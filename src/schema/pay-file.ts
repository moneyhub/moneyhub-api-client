type fileType = "csv" | "xml" | "json"

export interface PayFile {
  id: string
  fileName: string
  fileHash: string
  transactionCount: number
  controlSum: string
  fileType: fileType
  createdAt: string
  expiredAt: string | null
  fileData: string
  fileByteSize: number
  providerId: string
}
