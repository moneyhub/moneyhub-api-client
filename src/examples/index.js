const Moneyhub = require("../index")

const config = {
  resourceServerUrl: "http://apimock.dev.127.0.0.1.nip.io",
  identityServiceUrl: "http://identity.dev.127.0.0.1.nip.io/oidc",
  client: {
    client_id: "898c529b-c062-4f26-a136-fd8bc462d583",
    client_secret: "3df810b6-0020-4c10-890b-068328c8099c",
    token_endpoint_auth_method: "client_secret_basic",
    id_token_signing_alg: "RS256",
    redirect_uri: "https://client.example.com/cb",
  },
}

const start = async () => {
  try {
    const moneyhub = await Moneyhub(config)

    // const user = await moneyhub.registerUser("some-client-user-id")
    // const users = await moneyhub.getUsers()

    const data = await moneyhub.getAuthorizeUrlForCreatedUser({
      userId: "f3100325611831f37a7cdd9c",
      state: "foo",
      bankId: "3f0640be935f170febc1f35afb38a415",
    })
    console.log(data)
  } catch (e) {
    console.log(e)
  }
}

start()
