/* eslint-disable */
const localConfig = {
  resourceServerUrl: "http://apigateway.dev.127.0.0.1.nip.io/v2.0",
  identityServiceUrl: "http://identity.dev.127.0.0.1.nip.io/oidc",
  accountConnectUrl: "https://bank-chooser.moneyhub.co.uk/account-connect.js",
  client: {
    client_id: "cbb1b1da-c497-43d0-a188-3fbd414bcb70",
    client_secret: "49194a7b-4374-45ee-89ac-1d05ff793fcb",
    token_endpoint_auth_method: "private_key_jwt",
    id_token_signed_response_alg: "RS256",
    request_object_signing_alg: "RS256",
    redirect_uri: "https://invite.moneyhub.co.uk/api/callback",
    response_type: "code id_token",
    keys: [
      {
        kty: "RSA",
        n: "uHOsrME1bsU2acqVcBGSHQUlPPLNF8BNCuEUc6n4E7ZLt3btAdxHjykzrmVukv8XwzgTV33XkPtWjI8qthLbSDG8EecObJKtTOV8dJBRxhHS0CGCbJoh5MGn8oYQq-vxVlfL4I0iNQvDb0TLC-gXnjmicGdnCt9bRqVYRu5ke0J4-m7Vk8D9F5BbZOGqrql5AVA24bjfpAtMWWVBsG7UQoZ6LnU8rhj2du0t1iJ0P3Wp9kiWc8SRd5yJn3u3D1iuvqjvmDMMwdVQBlsQk4dnrHx6uaQenXuhHBFBdnAkxP2JyKf6xnFO7P-DkX6q_cj_pPbUAGMXKCPdqjExsqg0-Q",
        e: "AQAB",
        d: "o6T87cf8v-n3_KPfMS5lk5mdEBXaH9hcgepvWq7RiauSQZMhcyUb18eWMoOLNp9bVbfKcTUUq2xRvSLHogHYypRVZwy3n1wCpNZ1NHVWF4R4pG8WZ4PXzjyB5IlNATqzQwdhujd8wdNN8Mn32vhu-9HmbBNRODQxptvLFiMqwq8UMUBGuRFTHvSugCWIXV3mjGJmuYGhQkxd52YwGnCTkfdJuXDey7lDdhgcPvCRvyXixTv7OeC3BpJ0CrL42uKEQuZus1NnL2R18EOIiivMuJJPszPjVBwPYTZmLAse2Z6jac_xGZsAbQ9t0Uxj23AkPvxvxfXRruP5NNVMd48KgQ",
        p: "6otVolIK3HAjT-ZH-n8kV2smH9Dx4THHsxikiEnOythYQol0tViZTdZcwcw0o4pI9Vkti4O9-Gi_WV0rp0L_x98ycuB--ukNSjyeNioFmYhkgCLOZ_8lhgsEo8wKqHHwlsnS5dQnHCLVxPwCLkLO0lBxSIMbbOr61Deyc_yeXFc",
        q: "yVNAr2lWRIJ6Xs-GWT4lKrMB_iVPinmr24ad9h9UvS5lCwyUx-CX91FnD18cqKAT5nC68-BDh44wMoadQTCutWVnVZPES-G_Q4xWdOjspCLUdJO4KvWxGzgxEwR9q8i0w55glj4tV4bjUjwvv8KjY6XQJwXrjwauSOFQGagcJy8",
        dp: "V3zN3pR31K5HncAqTTgr2CfxuqB3-SZWdWnVxbiyWFvG4Frhm9uGo9A4HVoMsIweltZC9O2ZaRW5ep4UcHm_a1DIQq2W8AUKngxqf43BNPn5cwqIr6Yu2wc1Hdw4hYiq07RI5M30ILylvKq8LYFiIHU9LG0rR7-G_K4h9L3gXFU",
        dq: "Fmjk92GTT7byZiFVhBON0Y3xd9exXemjPqFibeYY6aIDb1JsMT-HyujNvwFIUGDZNjpwJPteqPUj2kvvrzT7DYgHE5iKLiQnxR4W9ZaD2NVjrsJOqsGEgFIl7EcAsiF6NZgoijDLnUWPgjTe38qLo2junZlkGhyVQ9mIsAJtd9M",
        qi: "Uo0shJVYcCa-gzkImSMmikHm7jqcOrOaDMIjXHU28vqw1z_fgmLVv80m0GBj6-bpfAVLcCN09Ji5IyHw-72D_j7uVc5jplNGpm2qURGU8hRnYbUP7A_JtwvOihPfqoAJIOfdLClYEz9a18YwV66YeadJplqkBVr8b7XKvEyjzSc",
        kid: "Sd8tZOpjQha1WxZSIfNwn2LIlMb6zVPKYzti-4ZUM1w",
        use: "sig",
        alg: "RS256",
      },
    ],
  },
};

const localBasicConfig = {
  resourceServerUrl: "http://apigateway.dev.127.0.0.1.nip.io/v2.0",
  identityServiceUrl: "http://identity.dev.127.0.0.1.nip.io/oidc",
  accountConnectUrl: "https://bank-chooser.moneyhub.co.uk/account-connect.js",
  client: {
    client_id: "ca54c9f5-e6ba-4941-b5f2-39c8038282e3",
    client_secret: "7c516ba9-6772-408b-adca-af63d4effc18",
    token_endpoint_auth_method: "client_secret_basic",
    id_token_signed_response_alg: "RS256",
    request_object_signing_alg: "RS256",
    redirect_uri: "http://localhost:3000",
    response_type: "code",
    keys: [],
  },
};

const shwetaDevConfig = {
  resourceServerUrl: "https://api-dev.moneyhub.co.uk/v2",
  identityServiceUrl: "https://identity-dev.moneyhub.co.uk/oidc",
  accountConnectUrl:
    "https://bank-chooser-dev.moneyhub.co.uk/account-connect.js",
  options: {
    // optional
    timeout: 60000,
  },
  client: {
    client_id: "4d18da1b-b6b7-4275-8407-3c8bade53f9a",
    client_secret: "ee8915e5-c100-4656-8845-007662bd18b5",
    user_id: "5c8796b1d3dbf9f945922986",
    token_endpoint_auth_method: "client_secret_basic",
    id_token_signed_response_alg: "RS256",
    request_object_signing_alg: "none",
    redirect_uri: "https://moneyhub.com",
    response_type: "code id_token",
    keys: [
      /* your jwks */
    ],
  },
};

const devConfig = {
  resourceServerUrl: "https://api-dev.moneyhub.co.uk/v2",
  identityServiceUrl: "https://identity-dev.moneyhub.co.uk/oidc",
  accountConnectUrl: "https://bank-chooser.moneyhub.co.uk/account-connect.js",
  client: {
    client_id: "cf33dc12-83e5-4452-b2b3-3cc0eababecd",
    client_secret: "520c674a-f805-45b7-83e3-7e3c0f144e86",
    token_endpoint_auth_method: "private_key_jwt",
    id_token_signed_response_alg: "RS256",
    request_object_signing_alg: "none",
    redirect_uri: "https://invite.moneyhub.co.uk/api/callback",
    response_type: "code id_token",
    keys: [
      {
        e: "AQAB",
        n: "w6GNqGj5-Gngy_5rM40mUAxvRFGcl4VNHWzm1vwEYduQtNkPhAQwzK7-gXEzrmAQulNT-SD0oqzihdTyzd3IQIHE9uMjed3FwW04ANSUSiv416MfxgiS97_lhxfcGjqiolIUtZtSg-8Z_TEJSNJAlu4Nd8Sq5j35rODp1LkXTkTedbK_Ohrb6R7RBCOv3IWm0FV801c2tB3KZ_koI-xVPGnYsE4kKK7WaOk1oPolQgPL37bJeiOimlMdzR2NBI6rqVr10FFzh0o65KGcHpTzvkwO-d2fKVmUMFKXj4P3VF6gJYn0Z-flInhNoLpy8kj4xofaimIAsiXs6M86Oyrgsw",
        d: "CukMpHLOVhtZjSbwRZy-oUJARlgi2pR1m4mCSkUd3XNIW72rTtqI-jFcQk3U6wmyhSG2kjNTUWtA6uPYcsDGtUpHeNlsFhTXPZVgxTMV3hkbtLMFR58cyzJpk6IyBUh134WiYAp8jJ0eHu_IK8aGEaTPHXnbaiHUtd6JS_LSqOu3NiI1Ur2Gl3Y-Twv844W8e2J24dOWBb5mQLneZZtKuulgYZwbVPVTuTKoNLxqW0DaN45jJ92d65eFlZazYf6KFN9VfGvuP_HppEQ3eGwrcoARpixMANn4IJULjN8X10PtTf6vFo91KDR18Vm5e2kNFMtfWufaTC6-ZiExAH7NMQ",
        p: "-6f7LmwsFInJy-jyT1J6Cy0Mcb_FA0RJdfbaZ5MPBdTc_W2wm7Fv_ewgu2a7776nr4r_w0zfsjEy8WhooYfxVyqpJd2s-VC3r35FAK0nzOBIT6uKBnKrdAdMPOPSc7AFg741J4tO5gBgDVaZWLluVK74tbVmmBnoHoDL2BnRPhs",
        q: "xwICIJou19U5BQQO_dDQJI9B4WG0QF8PX-t5KqUO4CpBwIFocjAtf22ymKr3LlJ030vq3-qsGukzJGal3PCJtpfzRotfcKBSsjCmcuoh3ehYNNFgirHrV83jrLHP3LWGP1wOMWxseGXZ532h_VsRGTYio8wAk866_7lcC8qnMUk",
        dp: "Pg2NwkSqGeZf_AfUt_p-XYMeLm47BjMwagYUlLWOXsG-PD9v7PQzyUkQSSVr8hHxBzgfGOk7v5SiGyTDqBD9UaETVGL05AUjRgK8wQ3xYnNrYTnLLwvXeyTRh7IlkqE0uueL89RGADDXfnJ8HYSb0AXVDflM8vRwaBUaLo8vKUE",
        dq: "m1nd_0VdO--fS2MXsNvJIEEU1LRI2ddbUS2osLmZGzThjz12I22olskzmiocO3Ty9z10ZMf1Aiz5V3kqEYdUec20g2VZY7pD1AZWaW6McYZnFRQ9oQezCCAZkz5bXZf27I8YJUzWgEZCDIvuYLEub9fqwqMF8Fx5bhds22efjME",
        qi: "uaN1d7ldsfs_JKcY3VCXoTCv04WEKHz-XN-3tM0DdZNyAO_g5kS2-YuSSIooXL7BlDN6dD6-36VFkV_TCi8F4XNG-qn6XADgpgIUa7ll_uEbtWh_Zc_IqU20dIYgKSZD3KYmDpOQLlWuZAKiY4-nNBo2t6dOgHzDLpkKgLfhn9Q",
        kty: "RSA",
        kid: "05gsEspgIPITy0Dlt2r8F2H-nsMJuu9psf0hPBfChFk",
        alg: "RS256",
        use: "sig",
      },
    ],
  },
};

const testConfig = {
  resourceServerUrl: "https://api-test.moneyhub.co.uk/v2.0",
  identityServiceUrl: "https://identity-test.moneyhub.co.uk/oidc",
  accountConnectUrl: "https://bank-chooser.moneyhub.co.uk/account-connect.js",
  client: {
    client_id: "5f391be9-b865-40c0-932a-eb126345e622",
    client_secret: "995019ae-bbf0-430c-af34-a308630a649d",
    token_endpoint_auth_method: "private_key_jwt",
    id_token_signed_response_alg: "RS256",
    request_object_signing_alg: "RS256",
    redirect_uri: "http://localhost:3001",
    response_type: "code",
    keys: [
      {
        kty: "RSA",
        n: "2AY4KbCCmmfvvrzYo8n1XEUHayAoK0BXSpFGgJLvZmpMWzFgsma_zOeNY2dMZJgdOWNN7Lk-Z5UQbNFfA3HO8RMB-iDub52opFfaf-vAIYCe2e5vb9JDVjuUQ7y6LT2ZgTSVRNOhRH6jo2bJlkiQPSdLo7nmzccq5vOAjanHz5ALbZz4XJKU2wwtPdlEjhuaaYQIKbjy33CMuVQADZ0_hLDUYDZiXAm4GZawJ_jcLacORY-89XcMiDvVQXKis1-XwOvljibt1wR3lT1cqucx3ymgMa41VGtj3EFxfPfo6BgmNIz7MQLqRWgCabmP4tEnp8-nWUk11Jzs4aqTIrojHw",
        e: "AQAB",
        d: "faHQU96FdgrwUPs--rJfcZPrpo-DDPRUT9eBKxFJDUTQt1BWLiq3bRFVFvRiZzZX-KIaFYv-EPuOG9r_6N7tPSKSyccRI_SKuVkmh7KxgEpvF8slH-EmrCXmKia-F8V1WsEb9nUlmtITlNoYbsAwsoAB62wYIKCuALaokrqkq77GHuBpuCEFKUY8PmjqZs_F_-Z5fd71gVhzRaObSsi7YIWOjct6plgRMS3T9F5UJ-VevHn27wYSoj79Ck6YsCM8G-NnsA-w9ziTJyzgjPh_D3HpXO7JWcG_rznokXcx_WS0Hrs0L_nANkTOPqGUziW9ldAWlbG_j6G0safKjG6nsQ",
        p: "9826uDgO1vVXTZrRM1mKdWAjSCsjv-GK_ecIjCDupXA6mH30seOKHhnJY4-jLjDjprCbp8IPY83L1H0xhp36Bl8gb5gIe9PF-NAeKaA9u1uwVBvxkveetfd2dgQLotBLQbfsr_uqUefHua1-Y6F1H9ebliTyHbnbj8oZv--p6gs",
        q: "3ytmOsQBFHyl6XqrepeR4MinF1zlRC85cfq5K6MKQbvLlRlp8jpx4DGXuCDDIZ7Tqw8LdftQU94QvPyK62H0QXIiDiNro98LUy4rtSv_IJ7ztdA7RNJ7ZcpKpCH4YYUd2Gn8MuZDn9kV49PVs2yA_NB5aFyZCywdvip9d1O5q70",
        dp: "RolyMAQM_VVC7501FXfUeMrP4Dgfafwqk1GTVkf9hmwm0cdwwr4xT5YphESbv4c9FfLJq_wKY29uKOMmGNqZE_05_2n4aD8E6GldXJ33VICp9ZcqsZn4vHVfbAKEyWifM2rGXeW2OrBOYuUmx_dqnpDCAgAsRxfjjs-JeuAerrc",
        dq: "mAG4lShyT-EDJT_f0xWwUDp7zWcB5mqAJ0mOnNFlqBZg-YKg7lOuwvUkkU8Hejvzkt0hglAWi7mDDya4_NDwjS9PUPABXlILJbIaJUH9eduqxlk6NYtkb5XVN2zIAKyqAoFWPdknkJZN2autMJQkW48oUtRXjguTirboVMHbgsU",
        qi: "v4cu82HR36VBPgjuGEfcW4NUuIE8Q4WDZxC0YnF922BwxX6vNSKtSR-dZ4ZyrXAVoUg_3aW90ZmvqO0WDhU0aBTuDYWuVa0UWSkUB2rDuNNghn1jU9ViPK-PW3pe_EDUVBt4riaGwPLOqkEJ2MmnrM7bUpm-BiE7daEZzRXDhhg",
        kid: "0aO03nT_VKIfi3pZP1ybS8dY1HA-J_LaNGMCrRa3rnU",
        use: "sig",
        alg: "RS256",
      },
    ],
  },
};

const prodConfig = {
  resourceServerUrl: "https://api.moneyhub.co.uk/v2.0",
  identityServiceUrl: "https://identity.moneyhub.co.uk/oidc",
  accountConnectUrl: "https://bank-chooser.moneyhub.co.uk/account-connect.js",
  client: {
    client_id: "e869ce14-7e05-410b-ab74-844b15a56a27",
    client_secret: "7ac6d605-70c2-4c6a-a213-563146b6053b",
    token_endpoint_auth_method: "private_key_jwt",
    id_token_signed_response_alg: "RS256",
    request_object_signing_alg: "RS256",
    redirect_uri: "https://example.com",
    response_type: "code id_token",
    keys: [
      {
        "kty": "RSA",
        "n": "vDXkPp7l0mFLMzxv7WyDo29uXCSR5z101atZyjpnhYDibuYsoTmMu9yveN9SdqdyUzO_Cbe1zmM4ahPdLs9zMTgm68aZ6D98TfaAP-hlkKjZdC4MRSyPaU54IRC4JM7D32TjfZ5zjFRiCuugfUGCN-eJ0X1miXEwVy0wS-uabOoBfP4_hLGBKYb8G2dR6Byg61H9GVO_iDvOPaTxDYCSL6i76GDs8JwKEkLXM-nNPi3wvvytB9OsJYw7oBd5ttDImFdD8fy85HHICVGTe2dZpOfiCDbfxHhHD0kiANmNOmvBllidF0V-5COV1R3CRoXjLih-dU7PIGXnrYZ_vka1zQ",
        "e": "AQAB",
        "d": "tFvkjQnSbQfle4T4MYqin3UCSfSViQZAtx2MXxoW6D25P9L9g8bVkZWK5gcETEZsbUUSViqhY9V7U1QTym7sEYeg7KKWDJUB9ug4wIVhBv533Djgc02fZKfYwL735_XoiGRzCIdWbWzTw2lHk6C6O_56-LD2GNHKJFBejvKJOsJju9E7RiHQBOKZa4ZfAQOqgyge1O8sW8oxj3VMfbkrYxikPPg53iZNrH1RhfQ2rbxsaY825k0mjBH5T11CqenE0KHEpZL_p9VvHYS60Kl_ak1vbrXiVblH4_giSa2b8c7Pf4ku1sjYJLov2yEjiUZMX91ascMmOEJQsR92z1CJ9Q",
        "p": "4FrNr6S3Jp61JL-sgCupCT8HlBJOxB9HO-hTzQqi2GvX00eJUiVL5rXzbNsPAlxP-g_FNmtvmbF5rbLat3fUL5Jwa3cM2HQ7G0WZeKfzgcbn_WM8uovNW6doyR3qe9sNCiHejXcZe5HPwozZVBNgtByDHDRb0kEQCsizhE256Oc",
        "q": "1sH2SrQodI_ngVU3fz1aCEWL5zo_5hl8oYXTI-jBT0rfuoHaTcWqsDtuakffxnGHkjrNAaQhqJapS9VMoawPnltyh25UqgbKGbK3wcdqAtLKYJYA-hvMFugHdB7eAZqcZ7jsFpRyJRtxkTeoGqCHF6uwLOdG0dzC2GqV1KrY0Ss",
        "dp": "aAq0CBgit04yQvCAVo_ou9j28rvquximOCntctDT4_lfBSPPksCpCjymvnx34WhdzmEx26LHBkc_XkXrF9oCFG2cpLl4w4hjQKpuGX4Jds1_GArFRt0-RprEBUBSVU2oJmK-imwI7T0ZU-dtgYfa-KugQZwmWMLDZbzdQyWoaVE",
        "dq": "wmvYkCrnkRcSa_j9BBlD38cucAhA_wxF02j3DERUdXeAcjXKr6vq6h7zyA4HnXz8Ujsfi4PO4PR8keWpuZeukBuT5N3SkhcRchBk4W6qH6I7ixNiEQuHSZmH3e1v6R3SyOgV_B8p80QUHXa4nlqD0r8hAJXkfGuSjiB4Qo7lOP8",
        "qi": "f7v2Qob_FLuWtHq8mtglSMKP1xR3S_wdI1jTHVkLS0h2vNvD1RF-HhAAdqGgV_ps7drcqmeRal80xOyiEmL2KFnO-ItHxId3Ya_y_WerIwCSAawlpGUQBY9XlVfQEJtXb4GlguyxXQ29rAZHfCjrCiGiE8005vkF_Y0HT_svN-4",
        "kid": "vn5JhAxq-8eDlgSwJXfW87hkpd4QcWJf45PTZkzXbys",
        "use": "sig",
        "alg": "RS256"
      }
  ],
  },
};

const prodLiveConfig = {
  resourceServerUrl: "https://api.moneyhub.co.uk/v2.0",
  identityServiceUrl: "https://identity.moneyhub.co.uk/oidc",
  identityBaseServiceUrl: "https://identity.moneyhub.co.uk",
  accountConnectUrl: "https://bank-chooser.moneyhub.co.uk/account-connect.js",
  client: {
    client_id: "ba7fc745-6efe-44fa-9e58-58bb0cf2177d",
    client_secret: "c3ec4752-7e7b-42d8-94de-cc234f0df1d4",
    token_endpoint_auth_method: "private_key_jwt",
    id_token_signed_response_alg: "RS256",
    request_object_signing_alg: "RS256",
    redirect_uri: "https://example.com",
    response_type: "code id_token",
    keys: [
      {
        kty: "RSA",
        n: "uWecPnL2S7IhMSBCVJzxpxIpw0MfyAYhAs_DvLtoRwbxoZm1-h_jtCO1HwsuNbByC0ZNSG1nCGDToahCwnbzuksGV6fJ5s1XtN3f48JlCq2M5HSEvhkwR1VD3VmLqzvQMjCeagydMY9Su1o0t-VzeFqTsXid9dK4sU33bgY4h8Jv7ULk6K1ngqKvrOF5FGzFXzy4RCsEEDQidpnYE8VHYGXROztx92ft3nszTXi-cY_XtfSqcqAqujYmsmIZswkJ-G1xdjCGmNnwb6pOeZ9w1KxVoTi7UahqafrT-gW4gqXP3Hbo6UG3KvCGF3jLyE2rRtzXqPJFzNY0iMSad_WQLw",
        e: "AQAB",
        d: "BqJPc-iXKYQ5LdHSrcZj2y-KMQNw2q5ldf1LKrCl_YyhDsA6Q7XqZuK0M2UqBR_IJOEiGMpZWnJkgC9OHDk3ZV4T3wUQ82I7liwuO68UAHrPRMlqiobKNHM3l28B0WG1hGY69N54rXJMaonCwyXBqPfMuxfuxwIAO8_nX5d3ZFwgHP-JAvtln06TOawusAGR13D7jNRTRf9e14gDkjdlY9SoRtBN9IZtPUxeNo0POVrLg6Q9Ut4oB4s9i5z_YMmncXmjdno0BE1ITNEShWQBbCZPwGadnrmokPcNGziGzR22W8l6cjwJVQoQH-tNy1POtt6OsILOycv-lJS7Ag9WSQ",
        p: "4kHDbnC3h11AZvNdVcpUmD_Kz_vJ9hThUD6qfrpxtbnuqIhCxtdKz3ffMaXOjAhKnAu1TVvUhqhvQCn2DhSgO4OOxBOpynO_19Ehn3vaa9pTa17pXOGLNUK2dtMH0PN5i-UV5nan67FUu8mPtNNs4fApLB4Cem7-KRfbPOm3h8U",
        q: "0ccL9iOjRzu97W7M6fSWZEBu2gCPVLAJQlhfrBLOpQ63VpuLvluRoI9DTkzOkxbYn_FzxK2dJXd-E07UvSZuBXabi6Ogjc1oMe9_CjSftEkWOVQQfFAY6xGxhkd0dYRrGD6TF6hePHTDEq9Z5Fe4D-WS28mnfgJibdkiLYtdw2M",
        dp: "Zoqzjewb4YeL1pzZYjZO3Kmcu2I8CAEylHGyR7ksK9ZWqZ8H1KJiT2DekNu6npBrcAmGY8cIrPbNZOEfmQYUEKTxIUBgJVcMTT2E5Yj2Vwcd432ieevmcX8IvxWpZzPRlGuA33BLbnByHKGfNa7UnBmCL3JyYRbIrcsYG6U4_pk",
        dq: "j2w-MlflP0OKM_YIJYBy_jHLWEL_u8_rVK_lIVlubQ0lrhIEte4XH6YzRypeJdR94MSM-RAWG9KZoQvJiVTn7dZMvGjv0WN5dIKg4dJeyj0Z87IU31lH4Belvv_FkL8rFVVa7dbQLxdJc9HtbJ_ImR3FjX1OhWmN8Dp_EpJxVa8",
        qi: "dipdK9bvI9ujxNu02PMWJpdqxjcj_JDEc8g8rMH9RIKFciQRCvECZ7ezbQfGPNs2hTHMTu4uL76XYI5L3l86NgglF0kZp2AjZFuKbZSsP5ksHYwIOn4FLqz6UV0djIfEHq4By0-ws295qPDWlda3N0kMhrStcSUaoY3QMumcOKs",
        kid: "1bR4Eljjydxna7p8y18WkMhgxJlj_1kBkE3Cd5XJyOU",
        use: "sig",
        alg: "RS256",
      },
    ],
  },
};

const osipConfig = {
  resourceServerUrl: "https://api.moneyhub.co.uk/osip/v1.0",
  identityServiceUrl: "https://identity.moneyhub.co.uk/oidc",
  accountConnectUrl: "https://bank-chooser.moneyhub.co.uk/account-connect.js",
  client: {
    client_id: "20fa7a43-91e2-475d-bff6-27c875886cf1",
    client_secret: "e335b43e-b6e2-4010-87f2-b5d77869a514",
    token_endpoint_auth_method: "private_key_jwt",
    id_token_signed_response_alg: "RS256",
    request_object_signing_alg: "none",
    redirect_uri: "https://example.com",
    response_type: "code id_token",
    keys: [
      {
        kty: "RSA",
        n: "tmfDXw1eTs5-kP7pIEJuv25sIZjS4rnLLJuwHHn6HNe3xBYHWrkgCFdbJpAtaKapOD1rP5SY74lQz54y9E_2RXvPJc8-1r5ievp-fEcZYNQMVCeCtXzm0pQcDdd2dTduzEHw5sxG3cCxH_ulYMW1BPWVFTrHFyPMkWVw1MrOZCBp3FRMU4UcuZnZ6EbNAUmG-QGW_DUFmTxvKzU9pbyc6tMmD1GsPeEuCI9fx9QhXnR5h3IfkvIE0vdqcVF-bcywsxNJ6FC1-O_Gqz3faAPhgJGJHPt5LgbpH-of43wR0tGna-fSapw33x_bBsvf5lN_Q1cPa9dQVsBdjM71eTemuQ",
        e: "AQAB",
        d: "q5ymUJiIQQbAR3S9Ku-1uH-QVm-tAUkiIX78y13rdhVyvJapJq8DtzVQ-dAuGMascNBARhptZPhBQoSplfhhUHAyrXT1vx5yExf3xr8x3krCqq5dqJixpi9Y0aEEvzV_Fcd4efx5NAsl2lxs9MYuEFNphwa850V0IttYs6t3UPUh5Ah9u0W4tCasCHe647dG3g8t5IjbVHcHZJDYuZc5AsBNQU34Rm5-rXzHYRqA5ZLWMrfly9SapoBEaMoCC7_V73CbuXMO1DS0v3IDJkw3d0LcrOFAQubzzZUvXDxiJmfaozAgOXtwEiciBmXt5qQz4FLR9SYZP8B8XHKsz9n7MQ",
        p: "64WOY7zZ2uL9-JG4B9_8q1nxKJcx1f7yu_1V_gBDU9mT3KKMWf2TCGWOAFigJWyBJBSJH4tMxLsnaPzq9510bSqyUJBpYOSwxyLvdpSfss99sg_7kLmhGn5ucnOyMyv3kadZdKY6I9Z9P0AVh_SqDgwuLzc7YTNPMPxLIRbRWmU",
        q: "xkPlqKrZbRFuVm7Cicb75ODs0RPNjoznqZcN8pcN9yfA0Ra7D0NnTG-etVdWr3rXxT5wPryVDUtjKjNtGpaPQKASPc_Dyov5tTWQkSfcDDu-joobsRWxVLJPiPo1b0l_RFOgVXcLJOeLQOXfSsrrneEK-y85UkxRfZ8nf9NDy8U",
        dp: "BzZs2OMUrN5ctrsHrr4OR9UWTI7syMfo-RbWBlRNu4ijPZOAxtS8JvqtMZeFOAAtqEQ0utGSRUgR-eYc7_5TbXBsS4lQoNYAD-ki-jes-FXgXI6evpzgsSYEDd87KtQC3eQJGkho6WYNKd21ixdUCeAXnfyMBfsDRtXDGz1Opf0",
        dq: "MbIVH6jrZN5IpNuQYY6B1wXV9jYbgQ6qhqS5N0RLmNbbCs3Cx3miq9MSmeuxa7zD1snmwqLsTW_HBG3tfAufDpjQ2bN5JQze41_ww6GVE2_qPLo7ZLDGSS-EphXpTOLERrEbcDCtl2t-SR8VUB763hDperqEiK9egblh4jVnOe0",
        qi: "0HLpozpw_Djbj-5V2F_BaUxOOVelaHMY8Ncj0zmb86RHKmvaO6hvGfSv720mF8kZG5LdDkf9c_LVo2CVtO03PXn0nuAMALwPrB27ffvIyuigPtyr-JszXbO87VGCYv2W4hFT1HNnEqD4Ewe08xKzuFX5LCx_9LhqV3loy5Xflg0",
        kid: "a2qUbFhxH_Gq4fTRBauzn-N7HkAvCoZaHZ9BCbuPuS8",
        use: "sig",
        alg: "RS256",
      },
    ],
  },
};

const payLinkDemoClient = {
  resourceServerUrl: "https://api.moneyhub.co.uk/v2.0",
  identityServiceUrl: "https://identity.moneyhub.co.uk/oidc",
  accountConnectUrl: "https://bank-chooser.moneyhub.co.uk/account-connect.js",
  client: {
    client_id: "c4388fba-aef9-4824-aec1-c9f7b9f505bd",
    client_secret: "d32556c3-c8bb-45da-a0a6-3c89a7d29bcc",
    token_endpoint_auth_method: "private_key_jwt",
    id_token_signed_response_alg: "RS256",
    request_object_signing_alg: "RS256",
    redirect_uri: "https://prototypes-five.vercel.app/payment-qr",
    response_type: "code id_token",
    keys: [
      {
        kty: "RSA",
        n: "5eCdqlajYHDADcjaNG5V1QO425IWAs4udREolLPpXJWIH3LBA2R8BfGQsTplAIvWOyCL17MxO4sx3agJuaTFmJ4FXIg8zKJsVF3K62Y47MqoX-8akAswWGWTSmvRKj-spH4OF0pZ-3Nay8Pd-hVxlyPwNYQymnAEmNTjeHsfgR8nMTBTXyYjydSa02kLRR0KFFeP-w35mlBl3sDK0XP59EuxXSJ3cfmxwayLxpRyI6j8k6oG-ejA1wVYw-jEpEILZ98th-Yya1dPxUn9vJW1Cfo4MOyKtpkkXihHkOtlzwB0CZZuONqTxvNiAC1aUL9ZTEq8eeRoFiy1zWlNV8B_qw",
        e: "AQAB",
        d: "kz-6Pu6YYKJYo3vRKlyy5mwn8Z42Mz3XTG3dTMOh7Ahs1ZgwQvgO6c-_G4eIQz1P0Tgb2-OQ2c9j9dQ5xozhdc1jKc6rA3nXYoNiBD_KnwOBr1H99d707OrD2pwNs75t3EBSzmB2GzfdJUEl45fw1xvSNrWjpIG0sCFORFK5737KEz2sr2cC81h0eMP3VZnmI_1hsPJMr1nGopJi0VOfcppqH65Hcd2d61FU_fYDiF1ZVqtUWNu22lCEaz7LnAFlUkzq2wuJaVKcgyWVvDSl2JRh2BW9E7Gvl-a_GZLnU4w0pBgRWjUKlJapsce2Xe0G5A1LN5CivbH43BLk9gNWIQ",
        p: "_M-2k8zBpiwWvmAn8ZGKEC2WReBNzAnhnqFMyPOcjK5MqlNRgCO70K7Pfx42WJvjJlh_faRX0t9xlNZKVqBay8I6Bae5ENnE3VkFByfGAvYXGFOSNo7DlOeyRw6CqYj3o4rL9CKKW8PNrnl_9dBSS4jolm8AOqrOD8xQSxMrj88",
        q: "6MbaRSnSzc34KRWPTWd2OArJKHP0UcCwy_6WV_MfECdGTFMpinDS60nZUMQbpTANP3XmPkb0YTvnlf-Z2dZ0LkgJhi12NV7DH5M2JstjKRseQvyzKM0gNLyygGwNpeo_gF0mNWJB2MYVyIy-E4IjHWqqn5XhjaiEfXnLKnYYzWU",
        dp: "zWAQelFEn7IBZ_bFfEE3X50pDusBSFheqXdv4W_GJaMTNOsqsmZVFVptxl7M138MMQKDz5XKosxSgQ70pRrvp8fJSv7OIRpIC2ld5EozWgSBDooVpaykxjrTYVYwX3mdc4Y12caVj6apWKvrf84UjLhT-qGCFibb74mTUOnp4ZE",
        dq: "k1dDU-IcUC7etMqz0W_60ZBqMdPrw0-v2QAGFBeNAwGJKsi9E6dEqrAtAUWQpifbSt8K5UKub1mmxjhrHwrysVThym--UhvwcG0TKs00sBE9P3OKx_nHN_p1FnrOzMWQemT7yXCvc1I2-aG0ss5-AaHB7I_HnI4dhvrv0am9G00",
        qi: "Cirter9tWE1a4rg--R15uY6b5p1OXGHuoH7O5iEauv-jLi3TVpRk-NhFDO77qhfmWTZYyNrE-KxqOX2rpNnHSIXJEJiGtgU9GD0Ksd-6VOAD5IkThoGEJjm-8NmfYHTDFJELE2V8VEFtjJRI8HuaRn0aOONZ17Jc6uQ5mtcwH_c",
        kid: "EjNnYibxdgDBLse8bLhBSdSPBFLeYf0GWyWxz9QwGLI",
        use: "sig",
        alg: "RS256",
      },
    ],
  },
};

const resellerClient = {
  resourceServerUrl: "https://api.moneyhub.co.uk/v2.0",
  identityServiceUrl: "https://identity.moneyhub.co.uk/oidc",
  accountConnectUrl: "https://bank-chooser.moneyhub.co.uk/account-connect.js",
  client: {
    client_id: "11bdcbff-6342-42c4-8fda-340a148c434e",
    client_secret: "12c52e16-7f22-4fc8-af84-3ca31c16061a",
    token_endpoint_auth_method: "private_key_jwt",
    id_token_signed_response_alg: "RS256",
    request_object_signing_alg: "RS256",
    redirect_uri: "https://payments-onboarding.moneyhub.co.uk/api/callback",
    response_type: "code id_token",
    keys: [{"kty":"RSA","n":"0YwK3ftFB-thpCoVSJHkTV_GcLJcOGOY4z0caLlrQraNStZvsYw0WODFJQ-vsTVSrMAx4aiw3LOA98BnYGmnMeIwzfW-uld1QjiUAsPeSppUw_ZTsoBbUnbyFSQhiP_pBiGJ20V1irq-6rhj-QIjgs6P3stC7O563UFdME--0l6jOcofCevJjl5nbSmxlpgXR4yweWUraovKBWrGp_SgQbdQyaNBnTg1gBQlpDBt3EychT9fIeqXCmkXX25ZliVoMg8UwmEXZoB_PhfaId2561Gor7o0U2IGgKCS_bBvun7vud4siiUeJWN6fK30DG2e3dXAdQiTwISrZH1wwe9nXQ","e":"AQAB","d":"0BecaxkuUlED4_0OqcSHzfbAoAXf4ve1SmTTo4QO6m9THPCadtze1yxPWyCavwZPFdK_NnNJP8La3i4p-uqw6K7Q_JeAUpirj5mUErLkO33Lk9c5AtjI17nbafc5fk104WvI9QGjWqNdGMcIMK5ZCXuMEBoWWifxx2sz2dg3jbw1o_JA-X69Qde5ciK_TUCJ3g5K8eJOFsKTKD7XJE_Z_P0752GDvpIS9yatB68-JC6EVuTgLV3i6KPzs45qmCg6MxH9ptnIA8tLng0ax1TTpCBj1SmqqnskuC8sVo1f49-XYUTzS_WdnbH8UyBNx5OMrCIMs0Tp5kiXLAhrjSLpGQ","p":"6Dejt10Zdt7chgZJ-d7PhA6ZCBIjbpswmMA5AnwxzE7FJ81wwq9DefnHv79KYQ2b54rlp9akoHY_3nl8k8hwyFHq-b_tfaFVblDlU3aQj0fnCkBqHxoFch6BHKHkBVNBmJ0NUHGw9CB9a2hSOhnlMx8Owxhe3Aus8YpRd9_DoC8","q":"5wIGScwWDg01EeUDOT9_alvjdKtVN2Gp_xtpq-2dn6tkCgy4YT03eluA3MFUszZf7TKkVIvohpkLBP5jAHUmwe07IR5xz7tKPMumTyxymAp7Xi3OaW6NGTpjGcnn-NSTwx-BTG7EUpmOFw1iu3dYoL0TP8UdV5cwphiC74YD4jM","dp":"K8Cv_BByh88dxbLRpV6xwrPtaXPhcSmUUnOFSk6UI2aEByfSIxxanlTNqfck0Hx773hgJOtwQTuGdSh2rHGLrnKgz0W2PYF0U0CytLMWMajegzP3yrxgYkwVD4wBJm-1YEfXBl0ldhnZB6-0LnZKlQM5CNFCrjsU7r2c8_UZKsk","dq":"ZHGs6kmjDVkQykcZr7q8XDK4I_KbiwkcMaBpwif_cX3Ecdo2EZHcnYdL8LDfc00hSLHMYjazVFMXR4SU544I3CmanDvwoLJ_BRBHsAVTjmiAW-Lu7Uj0cRPCI2R3SOqllSINxn4jPwclkUBwvbKXBs0voXrD12IV9SKTTDKpXaE","qi":"meso6ONTHZvGKQPpB6sg5EC0dHMJRmIJ5iVFgjjO5ljiJJ52pQ8H2m769CI2ik57rIbtX0pmTCe4N7UUY_tXjbD0VbTWtjXKW553p66QLELS5jyABGEFiT-geqc3FY5PwR5H5707-n69Zyg0CfeUvyXKbGS-ytXBISc2eS0cTwo","kid":"r_Hz8--PeiKmuN-5StE3jcoVakcYwCTzhPQW-DmBzGM","use":"sig","alg":"RS256"}],
  },
};

module.exports = prodConfig
