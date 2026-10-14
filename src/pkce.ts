/** PKCE options for authorisation URL creation. */
export interface PkceAuthoriseOptions {

  /**
   * When true, the library generates code_verifier + S256 code_challenge and calls storeVerifier.
   * Defaults to false — same as today when pkce is omitted. Opt in explicitly for FAPI 2 flows.
   */
  generate?: boolean

  /**
   * Required when generate is true. Persist the code_verifier server-side, keyed by OAuth `state`.
   * Called by the library after generation; must complete before the URL is returned.
   *
   * @example Server-sessions widget flow — store in Redis keyed by `state`, never expose to browser.
   */
  storeVerifier?: (params: {state: string, codeVerifier: string}) => void | Promise<void>
}

/** PKCE options for authorisation-code token exchange. */
export interface PkceExchangeOptions {

  /**
   * Load the stored code_verifier for `state` and delete it (one-time use).
   * The library passes the result to the token endpoint as `code_verifier`.
   *
   * @example Return undefined if missing — token exchange proceeds without a verifier.
   */
  consumeVerifier: (params: {state: string}) => string | undefined | Promise<string | undefined>
}
