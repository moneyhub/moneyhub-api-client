import type {ApiResponse, SearchParams} from "src/request"
import type {UserConnection} from "src/schema/connection"
import type {ConnectionSync} from "src/schema/sync"
import type {User} from "src/schema/user"

export interface UsersAndConnectionsRequests {
  registerUser: ({
    clientUserId,
  }: {
    clientUserId: string
  }) => Promise<User>

  getUsers: (
    params?: SearchParams
  ) => Promise<ApiResponse<User[]>>

  getSCIMUsers: (
    params?: SearchParams
  ) => Promise<ApiResponse<any>>

  getUser: ({
    userId,
  }: {
    userId: string
  }) => Promise<User>

  getUserConnections: ({
    userId,
  }: {
    userId: string
  }) => Promise<ApiResponse<UserConnection[]>>

  deleteUserConnection: ({
    userId,
    connectionId,
  }: {
    userId: string
    connectionId: string
  }) => Promise<number>

  deleteUser: ({
    userId,
  }: {
    userId: string
  }) => Promise<number>

  getConnectionSyncs: ({
    userId,
    connectionId,
    params,
  }: {
    userId: string
    connectionId: string
    params?: SearchParams
  }) => Promise<ApiResponse<ConnectionSync[]>>

  getSync: ({
    userId,
    syncId,
  }: {
    userId: string
    syncId: string
  }) => Promise<ApiResponse<ConnectionSync>>

  updateUserConnection: ({
    userId,
    connectionId,
    expiresAt,
  }: {
    userId: string
    connectionId: string
    expiresAt: string
  }) => Promise<number>
}
