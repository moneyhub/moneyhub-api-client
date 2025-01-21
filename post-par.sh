# This curl request sends the payload to our PAR endpoint generating a request_uri in which can be used
# to create an auth url. The example has data missing denoted by {} in which you can fill with your own parameters

# The client assertion is a JWT signed by your JWKS and contains the data shown here:
# https://docs.moneyhubenterprise.com/docs/authentication#authenticating-on-the-token-endpoint

curl --location --request POST 'https://identity.moneyhub.co.uk/oidc/request' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'client_id={}' \
--data-urlencode 'state={}' \
--data-urlencode 'nonce={}' \
--data-urlencode 'redirect_uri={}' \
--data-urlencode 'response_type={}' \
--data-urlencode 'scope=openid id:test' \
--data-urlencode 'client_assertion_type=urn:ietf:params:oauth:client-assertion-type:jwt-bearer' \
--data-urlencode 'client_assertion={}' \
--data-urlencode 'claims={
		"id_token": {
			"mh:con_id": {
				"essential": true
			},
			"mh:payment": {
				"essential": true,
				"value": {
					"payee": {
						"accountNumber": "12345678",
						"sortCode": "123456",
						"name": "Mr Payee"
					},
					"payeeType": "api-payee",
					"amount": 150,
					"payeeRef": "Payee reference",
					"payerRef": "Payer reference"
				}
			}
		}
	}'

# Once you recieve the request_uri from the previous request, it must then be used in the below url
# replacing the {} with the request_uri and this is given to a user for consent.

https://identity.moneyhub.co.uk/oidc/auth?request_uri={}


# Once a user has visited the url and consented to the payment/connection a code will be returned
# in the url sent back to your redirect_uri. code={}

# To complete the process you must then make the below request with a new JWT and the code previously
# received.

curl --location --request POST 'https://identity.moneyhub.co.uk/oidc/token' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'grant_type=authorization_code' \
--data-urlencode 'redirect_uri={}' \
--data-urlencode 'client_assertion_type=urn:ietf:params:oauth:client-assertion-type:jwt-bearer' \
--data-urlencode 'client_assertion={}' \
--data-urlencode 'code={}'