export interface Beneficiary {
  id: string
  active: boolean
  name?: string
  reference?: string
  accountNumber?: string
  sortCode?: string
  iban?: string
  pan?: string
  providerAccountId: string
  providerBeneficiaryId: string
  accountId: string
  createdAt: string
  modifiedAt: string
}

export interface BeneficiaryWithDetails extends Beneficiary {
  postalAddress: object
}
