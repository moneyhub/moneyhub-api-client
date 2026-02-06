import {ExtraOptions} from "../../../request"

export interface CaasUsersRequests {
  caasDeleteUser: ({
    userId,
  }: {
    userId: string
  }, options?: ExtraOptions) => Promise<void>
}
