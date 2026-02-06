import {ExtraOptions} from "../../../request"

export interface CaasAccountsRequests {
  caasDeleteAccount: ({
    accountId,
  }: {
    accountId: string
  }, options?: ExtraOptions) => Promise<void>
}
