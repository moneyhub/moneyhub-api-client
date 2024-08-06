import type {ApiResponse, ExtraOptions, SearchParams} from "../../request"
import type {UserConnection} from "../../schema/connection"
import type {ConnectionSync} from "../../schema/sync"
import type {User} from "../../schema/user"
import type {SCIMUser} from "../../schema/scim-user"

export interface UsersAndConnectionsRequests {
  registerUser: ({
    clientUserId,
  }: {
    clientUserId?: string
  }, options?: ExtraOptions) => Promise<User>

  getUsers: (
    params?: SearchParams, options?: ExtraOptions
  ) => Promise<ApiResponse<User[]>>

  getSCIMUsers: (
    params?: SearchParams, options?: ExtraOptions
  ) => Promise<ApiResponse<any>>

  registerSCIMUser: (user: SCIMUser, options?: ExtraOptions
  ) => Promise<ApiResponse<any>>

  getUser: ({
    userId,
  }: {
    userId: string
  }, options?: ExtraOptions) => Promise<User>

  getUserConnections: ({
    userId,
  }: {
    userId: string
  }, options?: ExtraOptions) => Promise<ApiResponse<UserConnection[]>>

  deleteUserConnection: ({
    userId,
    connectionId,
  }: {
    userId: string
    connectionId: string
  }, options?: ExtraOptions) => Promise<number>

  deleteUser: ({
    userId,
  }: {
    userId: string
  }, options?: ExtraOptions) => Promise<number>

  getConnectionSyncs: ({
    userId,
    connectionId,
    params,
  }: {
    userId: string
    connectionId: string
    params?: SearchParams
  }, options?: ExtraOptions) => Promise<ApiResponse<ConnectionSync[]>>

  getUserSyncs: ({
    userId,
    params,
  }: {
    userId: string
    params?: SearchParams
  }, options?: ExtraOptions) => Promise<ApiResponse<ConnectionSync[]>>

  getSync: ({
    userId,
    syncId,
  }: {
    userId: string
    syncId: string
  }, options?: ExtraOptions) => Promise<ApiResponse<ConnectionSync>>

  updateUserConnection: ({
    userId,
    connectionId,
    expiresAt,
  }: {
    userId: string
    connectionId: string
    expiresAt: string
  }, options?: ExtraOptions) => Promise<number>
}
