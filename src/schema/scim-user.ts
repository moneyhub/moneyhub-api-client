interface Emails {
    value: string
  }

export interface SCIMUser {
    externalId: string
    name?: {
      familyName: string
      givenName: string
    }
    emails?: Emails[]
  }
