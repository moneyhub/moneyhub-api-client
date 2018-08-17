const Moneyhub = require("../index")

const config = {
  resourceServerUrl: "https://api-dev.moneyhub.co.uk",
  identityServiceUrl: "https://identity-dev.moneyhub.co.uk/oidc",
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
    // console.log(user)
    // const users = await moneyhub.getUsers()

    // const data = await moneyhub.getAuthorizeUrlForCreatedUser({
    //   userId: "ebbf1eb5a58bda8d6832a0e8",
    //   state: "foo",
    //   bankId: "4ddeccd5a66881eb25223d5ff8b2e2c1",
    // })
    // console.log(data)

    const { access_token } = await moneyhub.getClientCredentialTokens({
      scope: "accounts:read",
      sub: "ebbf1eb5a58bda8d6832a0e8",
    })
    console.log(access_token)
    const accounts = await moneyhub.getAccounts(access_token)
    console.log(accounts)
  } catch (e) {
    console.log(e)
  }
}

start()
