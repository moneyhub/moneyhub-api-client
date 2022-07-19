import {ApiResponse} from "src/request"
import {RentalRecord, RentalRecordPost} from "src/schema/rental-record"

export interface RentalRecordsRequests {
  getRentalRecords: ({
    userId,
  }: {
    userId: string
  }) => Promise<ApiResponse<RentalRecord[]>>

  createRentalRecord: ({
    userId,
    rentalData,
  }: {
    userId: string
    rentalData: RentalRecordPost
  }) => Promise<ApiResponse<RentalRecord>>

  deleteRentalRecord: ({
    userId,
    rentalId,
  }: {
    userId: string
    rentalId: string
  }) => Promise<number>
}
