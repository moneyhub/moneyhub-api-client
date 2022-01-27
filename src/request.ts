import got from "got";
import type { RequestOptions, GotRequestParams } from "./types/request";

export default ({ client, options: { timeout } }: GotRequestParams) =>
  async (url: string, opts?: RequestOptions) => {
    let gotOpts = {
      method: opts?.method || "GET",
      headers: opts?.headers || {},
      searchParams: opts?.searchParams || {},
      timeout,
      json: opts?.json || {},
      body: opts?.form || {},
    };

    if (opts?.cc) {
      const { access_token } = await client.grant({
        grant_type: "client_credentials",
        scope: opts?.cc.scope,
        sub: opts?.cc.sub,
      });
      gotOpts.headers.Authorization = `Bearer ${access_token}`;
    }

    if (opts?.body) {
      gotOpts.json = opts?.body;
    }

    if (opts?.form) {
      gotOpts.body = opts?.form;
    }

    const req = got(url, { json: { test: 1234 } });
    if (opts?.returnStatus) {
      return req.then((res) => res.statusCode);
    }

    return req.json();
  };
