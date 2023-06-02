import {RequestsParams} from "../request"
import {RentalRecordsRequests} from "./types/rental-records"

export default ({config, request}: RequestsParams): RentalRecordsRequests=> {
  const {resourceServerUrl} = config

  return {
    getRentalRecords: async ({userId}, options) =>
      request(
        `${resourceServerUrl}/rental-records`,
        {
          cc: {
            scope: "rental_records:read",
            sub: userId,
          },
          options,
        },
      ),
    createRentalRecord: async ({userId, rentalData}, options) => {
      return await request(
        `${resourceServerUrl}/rental-records`,
        {
          method: "POST",
          cc: {
            scope: "rental_records:write",
            sub: userId,
          },
          body: rentalData,
          options,
        },
      )
    },
    deleteRentalRecord: async ({userId, rentalId}, options) => {
      return await request(
        `${resourceServerUrl}/rental-records/${rentalId}`,
        {
          method: "DELETE",
          cc: {
            scope: "rental_records:write",
            sub: userId,
          },
          options,
        },
      )
    },
  }
}
