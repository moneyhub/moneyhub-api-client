import {expect} from "chai"
import getAuthUrlsFactory from "../get-auth-urls"

const proxyquire = require("proxyquire").noCallThru()

describe("getAuthUrlsFactory (unit)", function() {
  const config = {
    identityServiceUrl: "https://identity.example.com",
    resourceServerUrl: "https://api.example.com",
    client: {
      client_id: "client-1",
      redirect_uri: "https://app.example.com/cb",
      response_type: "code" as const,
    },
  }

  const mockClientWithCapture = (capture?: {params?: any}) => ({
    issuer: {authorization_endpoint: "https://id.example.com/authorize"},
    requestObject: (params: any) => {
      if (capture) capture.params = params
      return Promise.resolve({request: "jwt"})
    },
    pushedAuthorizationRequest: () => Promise.resolve({request_uri: "par://x"}),
  })

  describe("getAuthorizeUrl and URL helpers", function() {
    it("getAuthorizeUrlFromRequestUri should build URL from request_uri", function() {
      const client = {issuer: {authorization_endpoint: "https://id.example.com/authorize"}}
      const auth = getAuthUrlsFactory({client: client as any, config: config as any})
      const url = auth.getAuthorizeUrlFromRequestUri({requestUri: "https://id.example.com/request/abc"})
      expect(url).to.equal("https://id.example.com/authorize?request_uri=https://id.example.com/request/abc")
    })

    it("getAuthorizeUrl should return URL with default claims and permissions when provided", async function() {
      const client = {
        issuer: {authorization_endpoint: "https://id.example.com/authorize"},
        requestObject: (params: any) => {
          expect(params.claims?.id_token?.["mh:consent"]?.value?.permissions).to.deep.equal(["accounts:read"])
          return Promise.resolve({request: "jwt"})
        },
        pushedAuthorizationRequest: () => Promise.resolve({request_uri: "par://x"}),
      }
      const auth = getAuthUrlsFactory({client: client as any, config: config as any})
      const url = await auth.getAuthorizeUrl({
        scope: "openid",
        permissions: ["accounts:read"],
      })
      expect(url).to.include("request_uri=par://x")
    })

    it("getAuthorizeUrl without permissions leaves claims unchanged (setPermissionsToClaims branch)", async function() {
      const capture: {params?: any} = {}
      const client = mockClientWithCapture(capture)
      const auth = getAuthUrlsFactory({client: client as any, config: config as any})
      await auth.getAuthorizeUrl({scope: "openid"})
      expect(capture.params?.claims?.id_token?.["mh:consent"]).to.be.undefined
    })

    it("getAuthorizeUrl with codeChallenge passes pkce params to requestObject", async function() {
      const capture: {params?: any} = {}
      const client = mockClientWithCapture(capture)
      const auth = getAuthUrlsFactory({client: client as any, config: config as any})
      await auth.getAuthorizeUrl({scope: "openid", codeChallenge: "challenge123"})
      expect(capture.params?.code_challenge).to.equal("challenge123")
      expect(capture.params?.code_challenge_method).to.equal("S256")
    })

    it("getAuthorizeUrl with expirationDateTime and transactionFromDateTime adds mh:consent claim", async function() {
      const capture: {params?: any} = {}
      const client = mockClientWithCapture(capture)
      const auth = getAuthUrlsFactory({
        client: client as any,
        config: config as any,
      })
      await auth.getAuthorizeUrl({
        scope: "openid",
        expirationDateTime: "2025-12-31",
        transactionFromDateTime: "2024-01-01",
      })
      const consentValue = capture.params?.claims?.id_token?.["mh:consent"]?.value
      expect(consentValue?.expirationDateTime).to.equal("2025-12-31")
      expect(consentValue?.transactionFromDateTime).to.equal("2024-01-01")
    })

    it("getAuthorizeUrl with enableAsync adds mh:sync claim", async function() {
      const capture: {params?: any} = {}
      const client = mockClientWithCapture(capture)
      const auth = getAuthUrlsFactory({client: client as any, config: config as any})
      await auth.getAuthorizeUrl({scope: "openid", enableAsync: true})
      expect(capture.params?.claims?.id_token?.["mh:sync"]?.value?.enableAsync).to.equal(true)
    })

    it("getAuthorizeUrl with accVerification adds mh:account_verification claim", async function() {
      const capture: {params?: any} = {}
      const client = mockClientWithCapture(capture)
      const auth = getAuthUrlsFactory({client: client as any, config: config as any})
      await auth.getAuthorizeUrl({scope: "openid", accVerification: true})
      expect(capture.params?.claims?.id_token?.["mh:account_verification"]?.value?.accVerification).to.equal(true)
    })

    it("getAuthorizeUrlLegacy should call client.requestObject and client.authorizationUrl", async function() {
      const client = {
        requestObject: () => Promise.resolve({request: "jwt"}),
        authorizationUrl(this: any, params: any) {
          expect(params.scope).to.equal("openid")
          return "https://id.example.com/authorize?request=jwt"
        },
      }
      const auth = getAuthUrlsFactory({client: client as any, config: config as any})
      const url = await auth.getAuthorizeUrlLegacy({scope: "openid"})
      expect(url).to.equal("https://id.example.com/authorize?request=jwt")
    })
  })

  describe("requestObject and getRequestUri", function() {
    it("requestObject (getRequestObject) should pass filterUndefined params to client.requestObject", async function() {
      let captured: any
      const client = {
        requestObject: (params: any) => {
          captured = params
          return Promise.resolve({request: "jwt"})
        },
      }
      const auth = getAuthUrlsFactory({client: client as any, config: config as any})
      await auth.requestObject({scope: "openid", state: "st", claims: {}})
      expect(captured.client_id).to.equal("client-1")
      expect(captured.scope).to.equal("openid")
      expect(captured.state).to.equal("st")
      expect(captured.redirect_uri).to.equal("https://app.example.com/cb")
      expect(captured.prompt).to.equal("consent")
    })

    it("requestObject with nonce and pkceParams passes them to client.requestObject", async function() {
      let captured: any
      const client = {
        requestObject: (params: any) => {
          captured = params
          return Promise.resolve({request: "jwt"})
        },
      }
      const auth = getAuthUrlsFactory({client: client as any, config: config as any})
      await auth.requestObject({
        scope: "openid",
        claims: {},
        nonce: "n123",
        pkceParams: {code_challenge: "cc", code_challenge_method: "S256"},
      })
      expect(captured.nonce).to.equal("n123")
      expect(captured.code_challenge).to.equal("cc")
      expect(captured.code_challenge_method).to.equal("S256")
    })

    it("getRequestUri posts request object to identity /request and returns body", async function() {
      const capture: {url?: string; opts?: any} = {}
      const mockGot = {
        post: (url: string, opts: any) => {
          capture.url = url
          capture.opts = opts
          return Promise.resolve({body: "request_uri=par://result"})
        },
      }
      const getAuthUrls = proxyquire("../get-auth-urls", {got: mockGot}).default
      const auth = getAuthUrls({client: {} as any, config: config as any})
      const result = await auth.getRequestUri("jwt-request-object")
      expect(capture.url).to.equal("https://identity.example.com/request")
      expect(capture.opts.body).to.equal("jwt-request-object")
      expect(capture.opts.headers["Content-Type"]).to.equal("application/jws")
      expect(result).to.equal("request_uri=par://result")
    })
  })

  describe("created user and payment flows", function() {
    it("getAuthorizeUrlForCreatedUser builds scope and delegates to getAuthorizeUrl", async function() {
      const capture: {params?: any} = {}
      const client = mockClientWithCapture(capture)
      const auth = getAuthUrlsFactory({client: client as any, config: config as any})
      const url = await auth.getAuthorizeUrlForCreatedUser({
        bankId: "bank-1",
        userId: "user-1",
      })
      expect(capture.params?.scope).to.equal("id:bank-1 openid")
      expect(capture.params?.claims?.id_token?.sub?.value).to.equal("user-1")
      expect(url).to.include("request_uri=par://x")
    })

    it("getReauthAuthorizeUrlForCreatedUser uses reauth scope and connectionId", async function() {
      const capture: {params?: any} = {}
      const client = mockClientWithCapture(capture)
      const auth = getAuthUrlsFactory({client: client as any, config: config as any})
      await auth.getReauthAuthorizeUrlForCreatedUser({
        userId: "u1",
        connectionId: "conn-1",
        codeChallenge: "cc",
      })
      expect(capture.params?.scope).to.equal("openid reauth")
      expect(capture.params?.claims?.id_token?.["mh:con_id"]?.value).to.equal("conn-1")
    })

    it("getReconsentAuthorizeUrlForCreatedUser uses reconsent scope", async function() {
      const capture: {params?: any} = {}
      const client = mockClientWithCapture(capture)
      const auth = getAuthUrlsFactory({client: client as any, config: config as any})
      await auth.getReconsentAuthorizeUrlForCreatedUser({userId: "u1", connectionId: "conn-1"})
      expect(capture.params?.scope).to.equal("openid reconsent")
    })

    it("getRefreshAuthorizeUrlForCreatedUser uses refresh scope", async function() {
      const capture: {params?: any} = {}
      const client = mockClientWithCapture(capture)
      const auth = getAuthUrlsFactory({client: client as any, config: config as any})
      await auth.getRefreshAuthorizeUrlForCreatedUser({connectionId: "conn-1"})
      expect(capture.params?.scope).to.equal("openid refresh")
    })

    it("getPaymentAuthorizeUrl builds payment scope and mh:payment claim", async function() {
      const capture: {params?: any} = {}
      const client = mockClientWithCapture(capture)
      const auth = getAuthUrlsFactory({client: client as any, config: config as any})
      await auth.getPaymentAuthorizeUrl({
        bankId: "b1",
        payeeRef: "pr",
        payeeId: "pe1",
        amount: 100,
        payerRef: "pr2",
        state: "st",
      })
      expect(capture.params?.scope).to.equal("payment openid id:b1")
      expect(capture.params?.claims?.id_token?.["mh:payment"]?.value?.amount).to.equal(100)
    })

    it("getPaymentAuthorizeUrl throws when state is missing", async function() {
      const client = mockClientWithCapture()
      const auth = getAuthUrlsFactory({client: client as any, config: config as any})
      try {
        await auth.getPaymentAuthorizeUrl({
          bankId: "b1",
          payeeRef: "pr",
          payeeId: "pe1",
          amount: 100,
          payerRef: "pr2",
        })
        expect.fail("should throw")
      } catch (e: any) {
        expect(e.message).to.include("State is required")
      }
    })

    it("getPaymentAuthorizeUrl throws when payeeId and payee are both missing", async function() {
      const client = mockClientWithCapture()
      const auth = getAuthUrlsFactory({client: client as any, config: config as any})
      try {
        await auth.getPaymentAuthorizeUrl({
          bankId: "b1",
          payeeRef: "pr",
          amount: 100,
          payerRef: "pr2",
          state: "st",
        })
        expect.fail("should throw")
      } catch (e: any) {
        expect(e.message).to.include("PayeeId or Payee are required")
      }
    })

    it("getReversePaymentAuthorizeUrl builds reverse_payment scope", async function() {
      const capture: {params?: any} = {}
      const client = mockClientWithCapture(capture)
      const auth = getAuthUrlsFactory({client: client as any, config: config as any})
      await auth.getReversePaymentAuthorizeUrl({
        bankId: "b1",
        paymentId: "pay-1",
        amount: 50,
        state: "st",
      })
      expect(capture.params?.scope).to.equal("reverse_payment openid id:b1")
      expect(capture.params?.claims?.id_token?.["mh:reverse_payment"]?.value?.paymentId).to.equal("pay-1")
    })

    it("getReversePaymentAuthorizeUrl throws when state or paymentId missing", async function() {
      const client = mockClientWithCapture()
      const auth = getAuthUrlsFactory({client: client as any, config: config as any})
      try {
        await auth.getReversePaymentAuthorizeUrl({bankId: "b1", paymentId: "p1", amount: 1} as any)
        expect.fail("should throw")
      } catch (e: any) {
        expect(e.message).to.match(/State is required/)
      }
      try {
        await auth.getReversePaymentAuthorizeUrl({bankId: "b1", amount: 1, state: "s"} as any)
        expect.fail("should throw")
      } catch (e: any) {
        expect(e.message).to.match(/PaymentId is required/)
      }
    })

    it("getRecurringPaymentAuthorizeUrl builds recurring_payment scope", async function() {
      const capture: {params?: any} = {}
      const client = mockClientWithCapture(capture)
      const auth = getAuthUrlsFactory({client: client as any, config: config as any})
      await auth.getRecurringPaymentAuthorizeUrl({
        bankId: "b1",
        payeeId: "pe1",
        userId: "u1",
        reference: "ref",
        context: "ctx",
        state: "st",
      })
      expect(capture.params?.scope).to.equal("recurring_payment:create openid id:b1")
      expect(capture.params?.claims?.id_token?.["mh:recurring_payment"]?.value?.payeeId).to.equal("pe1")
    })

    it("getRecurringPaymentAuthorizeUrl throws when state or payee missing", async function() {
      const client = mockClientWithCapture()
      const auth = getAuthUrlsFactory({client: client as any, config: config as any})
      const base = {bankId: "b1", userId: "u1"}
      try {
        await auth.getRecurringPaymentAuthorizeUrl({...base} as any)
        expect.fail("should throw")
      } catch (e: any) {
        expect(e.message).to.match(/State is required/)
      }
      try {
        await auth.getRecurringPaymentAuthorizeUrl({...base, state: "s"} as any)
        expect.fail("should throw")
      } catch (e: any) {
        expect(e.message).to.match(/PayeeId or Payee are required/)
      }
    })

    it("getStandingOrderAuthorizeUrl builds standing_orders scope", async function() {
      const capture: {params?: any} = {}
      const client = mockClientWithCapture(capture)
      const auth = getAuthUrlsFactory({client: client as any, config: config as any})
      await auth.getStandingOrderAuthorizeUrl({
        bankId: "b1",
        payeeId: "pe1",
        reference: "ref",
        frequency: {repeat: "Weekly"},
        firstPaymentAmount: 10,
        recurringPaymentAmount: 10,
        finalPaymentAmount: 10,
        firstPaymentDate: "2025-01-01",
        recurringPaymentDate: "2025-01-01",
        finalPaymentDate: "2025-12-31",
        context: "ctx",
        state: "st",
      })
      expect(capture.params?.scope).to.equal("standing_orders:create openid id:b1")
      expect(capture.params?.claims?.id_token?.["mh:standing_order"]?.value?.reference).to.equal("ref")
    })

    it("getStandingOrderAuthorizeUrl throws when state or payee missing", async function() {
      const client = mockClientWithCapture()
      const auth = getAuthUrlsFactory({client: client as any, config: config as any})
      const base = {bankId: "b1", reference: "r", frequency: {repeat: "Weekly" as const}, firstPaymentAmount: 1, recurringPaymentAmount: 1, finalPaymentAmount: 1, firstPaymentDate: "2025-01-01", recurringPaymentDate: "2025-01-01", finalPaymentDate: "2025-12-31", context: "c"}
      try {
        await auth.getStandingOrderAuthorizeUrl({...base} as any)
        expect.fail("should throw")
      } catch (e: any) {
        expect(e.message).to.match(/State is required/)
      }
      try {
        await auth.getStandingOrderAuthorizeUrl({...base, state: "s"} as any)
        expect.fail("should throw")
      } catch (e: any) {
        expect(e.message).to.match(/PayeeId or Payee are required/)
      }
    })

    it("getPushedAuthorisationRequestUrl builds scope and delegates to getAuthorizeUrl", async function() {
      const capture: {params?: any} = {}
      const client = mockClientWithCapture(capture)
      const auth = getAuthUrlsFactory({client: client as any, config: config as any})
      await auth.getPushedAuthorisationRequestUrl({bankId: "bank-1", userId: "user-1"})
      expect(capture.params?.scope).to.equal("id:bank-1 openid")
      expect(capture.params?.claims?.id_token?.sub?.value).to.equal("user-1")
    })
  })
})
