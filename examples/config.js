
const config = {
  resourceServerUrl: "http://apigateway.dev.127.0.0.1.nip.io/v2.0",
  identityServiceUrl: "http://identity.dev.127.0.0.1.nip.io/oidc",
  accountConnectUrl: "https://bank-chooser.moneyhub.co.uk/account-connect.js",
  client: {
    client_id: "eabfeb3e-3eba-47d0-a0e6-bafa74618356",
    client_secret: "c1c9fd88-7d1a-454c-88e5-ba50f2c61f8d",
    token_endpoint_auth_method: "private_key_jwt",
    id_token_signed_response_alg: "RS256",
    request_object_signing_alg: "RS256",
    redirect_uri: "http://localhost:3001",
    response_type: "code",
    "keys": [
      {
        "kty": "RSA",
        "kid": "yq9uCyleD15dw4KBR5hrC_j6dIm56SXVpzsWT9tZ4a0",
        "use": "sig",
        "e": "AQAB",
        "n": "tbO5JdiDUtj6NYygN6RSsvoSqpEPbepn1lhajz3zGQMWr50GKavzcpQUh1BUcp6pnlni9u0PTB8YnT0v2bsDPZCb94bnyWCkkav_935-798UFh0Diz1w4I_tCq0juSFk3a-13HJvVG2w9aZDD7UZsKNwuKETxY8XK7DpWwceTFAtUdf90qb8mv4wvChAXiulEatG8Koy5L-VX3gV3xK9Oi56_rztj9DgELs1OF6BQH6Se2lMJSSb7toQxqc2K95RvjK0Hw85n_mA2NUc5O7_7a6jUapYSp1_oMr_ympm8XM8c_rVL_UcCmx7EYW7lCRJx3Rq6Q1U113KKk2hxZ36zw",
        "d": "AnQj2uv6kgLWFiUJANdaOop_-AevcqeIsW9OAcMvZjYRd1uiequUxQZU5KLkEQwtdDL4iqcW3stItM7ft4v79jfes1ACD0kbz8_HzBrMMgcMKWRI6Pdyb8XhyJQf-F8IEqpNxWVSNYypqBePrkWezDDY09VxA-jzwiZIcG8_LH6e2rbMOaAParjnty8H9TH-gzuz_zJS6LfTQ_qPB4nKgsdEMeC963VrB3NQUJxw3GNvEdyFyzXL67G1cYRp6GwC7R-YTuNDWhEmhFzs1SwmlavJljMRpQw3_PWtgdaRGtjA_OIz6xNVCn670CgeIQu4AIl8EAXvio_kZnbgfGDqWQ",
        "p": "2rfAxCk6KyVDR3qkkLQG_sR-GmpsAJ2cxrZmO9Z4DHAZslCQCtZqFbhRd5Dak5N41liQ_zb2Dh1rZQfpcQaj7imcw5m6kj2XYZBl0qmzNtu8FTJ_u8jh_AbCuJ70JPCxVJA7WUi99Fvub8CZ6B-WqdtVi_K0KS5QGJIV9bS_Vc0",
        "q": "1Ky0UGQ1RFx4iu39bRFswt97f5KWrlxURsMni1NJZIw-KBikszoG5wVLb5MMU0HorQJGnEQ2U4ilA1PBHklo3CpGRESowsTgpszKWhzdjhyK7G0UF_1J0oUDObbd1NSKain7_3BBPt9xhELEZzkCL1L1VSAAyAJPqDwmnq-Pdws",
        "dp": "c4Lgd7keU3MWmUWYbCPoHd1AjErwR1L2XawvSiL2u_roV1hc-pxK4rW5sN_70DzucKXNzjwEr2eyNGV9UIglQ78OX-9srZeBv7E3VY7ya2KZbsiA1Xg-gZBAfqjUYD4OKY8TCRB14fw7bSHXJtSoCYUhJQxFQgqHmrJsjpurAXE",
        "dq": "MBsAjk6cXeIswgAjGtCeMVYrsSePPdFUnsz13OXx6_Rs-tTYLFIrzYW9EnfIieyWnMuu_RnQ0ARQjvga7qbcOTC2xCpjoeq2hgQ8oTV2R_bc1a22pdZ9JElB-YQLmWCaDnmArr7Ng1M3chtIIbEbdWjmZWLfyl37dqpkcfB0GxE",
        "qi": "ROU7csuptZ0bW2a--JeSd7y53ddUztBKCIajRXpTVvqOPDfYlZMI-cb6bsgLEqzKaqOsTa2xjNem3UFtN0s4D9Tb2Y80eeQtYUA8gj-BZWBf-IPXKenllCy8FHhHiUKLa-fPLSBn8qW7jnZ1alO6anKHb_4EYam-eLyY5bSwBX0",
      },
    ],
  },
}

module.exports = config
