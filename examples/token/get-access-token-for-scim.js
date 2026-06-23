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

		console.log("=== Step 1: Creating JWT Assertion Token ===")
		const jwtAssertion = await moneyhub.createJWTBearerGrantToken(options.subject)
		console.log("JWT Assertion Token:")
		console.log(jwtAssertion)
		console.log("")

		console.log("=== Step 2: Using JWT Assertion to Get Access Token ===")
		console.log("Making request to token endpoint...")
		
		// Use the JWT assertion to get an access token
		const tokenResponse = await moneyhub.getJWTBearerToken({
			scope: options.scope,
			sub: options.subject,
		})
		
		console.log("✅ Access Token Response:")
		console.log(JSON.stringify(tokenResponse, null, 2))
		console.log("")
		
		console.log("=== Step 3: Use this Access Token in Postman ===")
		console.log("Copy this access token:")
		console.log(tokenResponse.access_token)
		console.log("")
		console.log("In Postman:")
		console.log("1. Set Authorization header to: Bearer " + tokenResponse.access_token)
		console.log("2. Set Content-Type header to: application/json")
		console.log("3. Make POST request to: https://identity-test.moneyhub.co.uk/scim/users")
		
	} catch (e) {
		console.error("❌ Error:", e.message)
		if (e.response && e.response.body) {
			console.error("Response body:", e.response.body)
		}
	}
}

start()
