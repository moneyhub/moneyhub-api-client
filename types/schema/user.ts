export interface User {
  userId: string
  clientUserId: string
  clientId: string
  createdAt: string
  updatedAt: string
  scopes: string
  managedBy: "user" | "client"
  lastAccessed: string
  deletedAt?: string
  userType: "test" | "demo" | "live"
  clientName?: string
  connectionIds: string[]
}
