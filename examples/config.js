// const config = {
// 	resourceServerUrl: "http://apigateway.dev.127.0.0.1.nip.io/v2.0",
// 	identityServiceUrl: "http://identity.dev.127.0.0.1.nip.io/oidc",
// 	accountConnectUrl: "https://bank-chooser.moneyhub.co.uk/account-connect.js",
// 	client: {
// 		client_id: "40e1a1bf-9574-4c83-b87b-82e2266907aa",
// 		client_secret: "928bae58-7216-46ad-86c2-84fd8151bdcd",
// 		token_endpoint_auth_method: "client_secret_basic",
// 		id_token_signed_response_alg: "RS256",
// 		request_object_signing_alg: "none",
// 		redirect_uri: "https://invite.moneyhub.co.uk/api/callback",
// 		response_type: "code",
// 		keys: [
// 			/* your jwks */
// 		],
// 	},
// }

// phoenix local config
const config = {
	resourceServerUrl: "http://apigateway.dev.127.0.0.1.nip.io/v2.0",
	identityServiceUrl: "http://identity.dev.127.0.0.1.nip.io/oidc",
	accountConnectUrl: "https://bank-chooser.moneyhub.co.uk/account-connect.js",
	client: {
		client_id: "e2d3c81d-ab96-4009-a1d6-8e255109fd31",
		client_secret: "0576385b-5a46-40de-8acf-7ab66900c22a",
		token_endpoint_auth_method: "client_secret_basic", // "private_key_jwt",
		id_token_signed_response_alg: "RS256",
		request_object_signing_alg: "RS256",
		redirect_uri: "https://invite.moneyhub.co.uk/api/callback",
		response_type: "code id_token",
		keys: [
			{
				kty: "RSA",
				n: "tcDSe4tfn0phu5t2rhyJ-Y7CFfOod934pKEG2SMTzYCmJ33YAqo0Y9VrYRDpk_CL-cup_Gi-Pp8AnSyPWwbC0RFMDmpKlxQFZuqOy7eyzelqHtq3Io4aaYVe6ZIx3yJnOVg5lGsl7FsMmndx4xd8E5QGFTVsGZD56GRhjqXhbDGEGYDFVbyjhMX_0CIfxOrNnN-UztiuWNmBFX09RH_wzpQQ0diBb5smtlsf_5uowxQM5v8deLAPPkzGyp1Vl2aD053KFH6sOv1bU1QgmNqgxplY3Rlsg-VWVja4FIchqZVJpzXt93rUpQ_CpY76FVWPXLIxMqzJKTBbtXqxZB2DIQ",
				e: "AQAB",
				d: "HrDNOgxqXLEIONBDJZpvGANptaA72eXTFyWTzPW14dUv-WowIB8SkqsWo0DiWFddo5QnA5bCTTu3NFMyb9n_6qLDl4mOR92bHepMq4y89jVMdKJVG1IolpntUX6cykN6b738lxnSwQsM4UZ7JjAwhPPRZSJsuxJ2iK3upVJQct7Ovfx9sTCbQdZr3k23aYIdJLgZ-M89l_TgKD3BS8QUjV2_9t20VAYG5EXzGmJ2NB39QrUkXCsMWh9PxovjiytFl3czKd0Ga5yrWN6dmNVyn_MkkWrYNalnk2LjwnDVq4Cl50z822nU4dLrCTrqwD8DsXkDijJfvogiGEZ_39kHUw",
				p: "3zeYAMnHOOHoGzbdFOIu-b8_h8h-3T0Hepx--sofhgKvDj7MeCpec4S8PkQY2nnZqyvIdT9rDbCeEjPOonMRk_lbVD8DsXynBr4l_uQ-DZaAMSaA0E8uBDQt72AAPRkgHsrz2tibduCeittfATU3zD825QJdaXigGMiWldh82jM",
				q: "0HJJp9uWMPecJQHLLGxT1IpaTQMtPfS0E7-J-EdiEFYqE8JrU95kRU5DR0cvj2LMB3lMclz6LquQ-2bxErnDTEBZjjPzYSlBXIQzl3_SRG8y1QvphqtH8S0jjpOAp-zax-BARETIb0xpDiWt07hkFmfHlu0ZdsdLXmjJ3xdXQVs",
				dp: "SpuZWcIXraKMYvQ-hulmzCEpSegwxx_L7SZ7prWCPdeNzVQeIZf_w9q81I8MQ5HwuC7FLLNKw-OhofHhAhk16eCxrwH06REB_tX1ezGsr_v60vLMoVOlzM_n_pd23PUV8FTjluVJaT2AoGbcZVn1UXZbkcXtlQA1erMo6eLXMFM",
				dq: "TnPVWQICgyeOczc7mtqiqonv9rBNZNYmuJAMg4-KTw-_AnTYJFa9coBEPh2Cvvq2Q9HZfemUl-Amzxgtf5i-8oH9stHGtjjqysFPEaQgJXWcsiarm-33Q8Rzb4QAljNFHJlAVvF0Zr9hgtuXkuoBcZVZv2o5fUUBDuVtpTOJuaU",
				qi: "qyJp3DfBDb3kr6KXUuRmntQX4GWSEfLEmy6sQ-RcsM5WcxDJn3ewCoUFAZBN4_Ki2TvYMUymVGngq8YbggaULk_dpavaCdZrVhP-0xWXifAw7v7DtNSeQ1y56zmKdsrQjTg5gPF7LYgB514wJQ7f_V4JGRgACS7McevVdsWJ4s4",
				kid: "vTQbDStWdEYtiByztrupcgm-u4QQgYeoSbp1yj-yAPg",
				use: "sig",
				alg: "RS256",
			},
		],
	},
}

// phoenix test config
// const config = {
// 	resourceServerUrl: "https://api-test.moneyhub.co.uk/v3",
// 	identityServiceUrl: "https://identity-test.moneyhub.co.uk",
// 	accountConnectUrl: "https://bank-chooser.moneyhub.co.uk/account-connect.js",
// 	client: {
// 		client_id: "6e1bb8b4-1f6c-4b4a-9cb0-060a2dde00ce",
// 		client_secret: "d0078bc1-9aee-41c3-8573-25fa9396a1c7",
// 		token_endpoint_auth_method: "private_key_jwt",
// 		id_token_signed_response_alg: "RS256",
// 		request_object_signing_alg: "RS256",
// 		redirect_uri: "https://google.com",
// 		response_type: "code id_token",
// 		keys: [
// 			{
// 				kty: "RSA",
// 				n: "2XT_S6gTvVCdTMBqQh_y1YVDBQMAqDvtgnd5OnH0uRFpB-wjSLeewtN6rMhPsamU43Cw6XJEj0tk1x3mNAsRyXSgCeIpd98GsFbGCJZ0yjtEgWk1QweFiPq3uUOmTzzbNSv0YbO-pBre1mbqM6PyIZp1rovn9oMT2UQw6CwyeOmudXliwSsnvKevpLRWTd6ufvFyCyf_Femw-p3S8-BOmnRXrsECKAa6yB5Phi7yo0E-Wga5DyeN1o8N8lA9FaCBH7P3kv9GU0ETx3Tmms4nfAqKfnc2IPOYsoG94aFtR1oC9Ro8A_zYVKKWIvXCHVR9ZEknUMjqe7B_JMS68Vmg_Q",
// 				e: "AQAB",
// 				d: "HEet593s60LvogqoBv92qjQRejZgwIBCrCPzfRlS1TqhaSlZkVxn5jhwjMXkL1u5hDakm0eECQqqC5vU01HZN1TWd1KVSASWLxqp2HYQrDg2-YmAJr50rFLGz-4vU8C7VVfpCUfB9D-WWVW7AYpBtAMNaOzC9vkm_Kt0nM0ap0SnOYMR_X92cGfFEKSPIyFQzthaGcUUS5vYEH7waImnuK8SulBApwhrwTXkg0Mb1mDXni5Gc68HtE7jKXBRc2BnBqvEpL7ey8sd3tsSzdqVtg7XfjoT6GZp_--Tb-YlHAPHtxfMW98U3CZhcKQuCCbCYjh4ilXaNzNN72BEKYYUoQ",
// 				p: "-PKNFJ49J8sfzwbAoRWPoxQyHXJ7fnK-pF5pNPrLJT8WIjh1usv75MlyiOZwXxQzNrPZW-Tpi9xnF_en5ER-RIk3C3xV2SQyMxiUlzuuyOBReqzKc3P4ZxBPDx9cJ-nfmJT4_PLsf62eYGsStJcdgnvvWd1_tWW9tG4xL914TOU",
// 				q: "354RLL-8aWAHP16Odj42W0djx_4SO9Va0SDBhUTNbUn7rVsNOYETMUGh9ljetls4veENPG01dzqgXNBaGwLg3YzxTcBaFYw7ysmUidrFRgTsd67JFKkgfK8YqPKU5aoasp3mNhh_6NHuYr3-6AdoUFToF45OkTxZbAxS-pvoWjk",
// 				dp: "IZ4PcyNTOtZxOzG8PYR92xXVFqjpCFBScjvVlTPwztzQDlr1ev4ky-ZwMxB7SDugFtj-lyw4ZYyj11a4M1kUfAjTiBeIOERtCv1cw3dpyPKRzjEbPbABcVmAc5hWh4VLjn0_ilj7mtpFMtwCsKRfdclqrwX8QvC0R3NB7SbJIgk",
// 				dq: "i7NliW5TmAVtIbLCD674KHhmJvhcjdLRxNrQ66A7Mm7I89lxXp57zgbx10RYBtbgkQd7TGfxwgX3T2S_FibrMp4t1mQ4I0QTyrG6wZDSM9c5n9-rMeQjLqH5Jvs9-GkX-sTYoK0Xo-0bH8cQ7AZMrfsNcEHwZZ2tQ-pDINusAkk",
// 				qi: "yOASRctdA89TRIEr3ArmjT4Wp43vgYs_DKiX1Z53UA8bJ-_cPPQqNuYK34ZLfSE2O_rJuvkoez4ovycZi18hykcHrIEqQQhtSMnCX8iwpDeZJDHBvMW0-O-CjMLDNysbxA-ezj7q42q6kKDDr13j75lCzQYDXsRMPpke3ipt_Ak",
// 				kid: "JFqYxaLmjUZOAkhKXj8KWkcBZvJCsXtFz2tGYGpqUc8",
// 				use: "sig",
// 				alg: "RS256",
// 			},
// 		],
// 	},
// }

module.exports = config
