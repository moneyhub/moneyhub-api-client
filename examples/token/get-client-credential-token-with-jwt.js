const {Moneyhub} = require("../../dist/index")
const config = require("../config")
const commandLineArgs = require("command-line-args")
const commandLineUsage = require("command-line-usage")

const optionDefinitions = [
	{name: "userId", alias: "u", type: String, description: "User ID (optional - omit for client-only token)"},
	{name: "scopes", alias: "s", defaultValue: "widget_authentication", type: String, description: "required scopes"},
]

const usage = commandLineUsage({
	header: "Options",
	optionList: optionDefinitions,
})

console.log(usage)

const options = commandLineArgs(optionDefinitions)

const start = async () => {
	try {
		const moneyhub = await Moneyhub(config)

		console.log("=== JWT Authentication with Client Credentials Grant ===")
		console.log("")
		console.log("Your configuration uses 'private_key_jwt' authentication.")
		console.log("The openid-client library automatically creates JWT assertions with these claims:")
		console.log("")
		console.log("JWT Claims (automatically generated):")
		console.log(`- iss (issuer): ${config.client.client_id}`)
		console.log(`- sub (subject): ${options.userId || 'client_id (for client-only tokens)'}`)
		console.log(`- aud (audience): ${config.identityServiceUrl}/oidc/token`)
		console.log(`- jti (JWT ID): auto-generated unique identifier`)
		console.log(`- iat (issued at): current timestamp`)
		console.log(`- exp (expiration): 5 minutes from now`)
		console.log("")
		console.log("Request parameters:")
		console.log(`- grant_type: client_credentials`)
		console.log(`- scope: ${options.scopes}`)
		if (options.userId) {
			console.log(`- sub: ${options.userId}`)
		}
		console.log("")

		const data = await moneyhub.getClientCredentialTokens({
			scope: options.scopes,
			sub: options.userId, // Optional - omit for client-only tokens
		})
		
		console.log("✅ Success! Token Response:")
		console.log(JSON.stringify(data, null, 2))
	} catch (e) {
		console.error("❌ Error:", e.message)
		if (e.response && e.response.body) {
			console.error("Response body:", e.response.body)
		}
		
		if (e.error === 'invalid_subject') {
			console.log("")
			console.log("💡 This error means:")
			console.log("1. ✅ JWT authentication is working correctly")
			console.log("2. ✅ Your private key is being used to sign the JWT")
			console.log("3. ❌ The user ID doesn't exist in the system")
			console.log("")
			console.log("Try running without a user ID for a client-only token:")
			console.log(`node examples/token/get-client-credential-token.js -s ${options.scopes}`)
		}
	}
}

start()

