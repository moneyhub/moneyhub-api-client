const {Moneyhub} = require("../../dist/index")
const config = require("../config")
const commandLineArgs = require("command-line-args")
const commandLineUsage = require("command-line-usage")

const optionDefinitions = [
	{name: "subject", alias: "s", type: String, description: "required (can be userId or clientId)"},
	{name: "scope", alias: "c", defaultValue: "scim_user:write", type: String, description: "required scopes"},
]

const usage = commandLineUsage({
	header: "Options",
	optionList: optionDefinitions,
})

console.log(usage)

const options = commandLineArgs(optionDefinitions)

if (!options.subject) throw new Error("subject (userId or clientId) needs to be provided")

const start = async () => {
	try {
		const moneyhub = await Moneyhub(config)

		console.log("=== Using Client Credentials Grant to Get Access Token ===")
		console.log("This uses your private_key_jwt authentication automatically")
		console.log("")
		
		// Use client credentials grant with JWT authentication
		const tokenResponse = await moneyhub.getClientCredentialTokens({
			scope: options.scope,
			sub: options.subject, // Use your client ID as the subject
		})
		
		console.log("✅ Access Token Response:")
		console.log(JSON.stringify(tokenResponse, null, 2))
		console.log("")
		
		console.log("=== Use this Access Token in Postman ===")
		console.log("Copy this access token:")
		console.log(tokenResponse.access_token)
		console.log("")
		console.log("In Postman:")
		console.log("1. Set Authorization header to: Bearer " + tokenResponse.access_token)
		console.log("2. Set Content-Type header to: application/json")
		console.log("3. Make POST request to: https://identity-test.moneyhub.co.uk/scim/users")
		console.log("")
		console.log("Request Body Example:")
		console.log(JSON.stringify({
			"externalId": "your-external-user-id",
			"name": {
				"givenName": "John",
				"familyName": "Doe"
			},
			"emails": [
				{
					"value": "john.doe@example.com",
					"primary": true
				}
			]
		}, null, 2))
		
	} catch (e) {
		console.error("❌ Error:", e.message)
		if (e.response && e.response.body) {
			console.error("Response body:", e.response.body)
		}
		
		if (e.error === 'invalid_scope') {
			console.log("")
			console.log("💡 This error means the scope is not allowed for your client.")
			console.log("Try with a different scope that your client has permission for.")
		}
	}
}

start()

