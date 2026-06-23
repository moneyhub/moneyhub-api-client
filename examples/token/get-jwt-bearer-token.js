const {Moneyhub} = require("../../dist/index")
const config = require("../config")
const commandLineArgs = require("command-line-args")
const commandLineUsage = require("command-line-usage")

const optionDefinitions = [
	{name: "userId", alias: "u", type: String, description: "required - User ID or API user ID"},
	{
		name: "scopes",
		alias: "s",
		defaultValue: "widget_authentication",
		type: String,
		description: "required scopes",
	},
]

const usage = commandLineUsage({
	header: "Options",
	optionList: optionDefinitions,
})

console.log(usage)

const options = commandLineArgs(optionDefinitions)

if (!options.userId) {
	console.error("Error: userId (-u) is required")
	process.exit(1)
}

const start = async () => {
	try {
		const moneyhub = await Moneyhub(config)

		console.log("Creating JWT Bearer token with the following claims:")
		console.log(`- iss (issuer): ${config.client.client_id}`)
		console.log(`- sub (subject): ${options.userId}`)
		console.log(`- aud (audience): ${config.identityServiceUrl}/oidc/token`)
		console.log(`- jti (JWT ID): auto-generated unique identifier`)
		console.log(`- iat (issued at): current timestamp`)
		console.log(`- exp (expiration): 10 minutes from now`)
		console.log(`- scope: ${options.scopes}`)
		console.log("")

		const data = await moneyhub.getJWTBearerToken({
			scope: options.scopes,
			sub: options.userId,
		})

		console.log("JWT Bearer Token Response:")
		console.log(JSON.stringify(data, null, 2))
	} catch (e) {
		console.error("Error:", e.message)
		if (e.response && e.response.body) {
			console.error("Response body:", e.response.body)
		}
	}
}

start()
