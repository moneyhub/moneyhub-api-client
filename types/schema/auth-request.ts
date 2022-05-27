enum Status {
  COMPLETE = "complete",
  PENDING = "pending",
  ERROR = "error",
  DELETED = "deleted"
}

interface RedirectParams {
  authUrl?: string
  returnUrl?: string
  state?: string
}


export interface AuthRequest {
  id: string
  redirectUri?: string
  createdAt: string
  bankId: string
  userId?: string
  scope: string
  paymentId?: string
  status: Status
  redirectParams: RedirectParams
}

export interface AuthParams {
  state?: string
  code?: string
  id_token?: string
  error?: string
  error_description?: string
}
