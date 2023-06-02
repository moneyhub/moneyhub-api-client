import {ApiResponse, ExtraOptions} from "../../request"
import {RentalRecord, RentalRecordPost} from "../../schema/rental-record"

export interface RentalRecordsRequests {
  getRentalRecords: ({
    userId,
  }: {
    userId: string
  }, options?: ExtraOptions) => Promise<ApiResponse<RentalRecord[]>>

  createRentalRecord: ({
    userId,
    rentalData,
  }: {
    userId: string
    rentalData: RentalRecordPost
  }, options?: ExtraOptions) => Promise<ApiResponse<RentalRecord>>

  deleteRentalRecord: ({
    userId,
    rentalId,
  }: {
    userId: string
    rentalId: string
  }, options?: ExtraOptions) => Promise<number>
}
