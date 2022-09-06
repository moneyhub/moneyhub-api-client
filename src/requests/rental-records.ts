import {RequestsParams} from "../request"
import {RentalRecordsRequests} from "./types/rental-records"

export default ({config, request}: RequestsParams): RentalRecordsRequests=> {
  const {resourceServerUrl} = config

  return {
    getRentalRecords: async ({userId}) =>
      request(
        `${resourceServerUrl}/rental-records`,
        {
          cc: {
            scope: "rental_records:read",
            sub: userId,
          },
        },
      ),
    createRentalRecord: async ({userId, rentalData}) => {
      return await request(
        `${resourceServerUrl}/rental-records`,
        {
          method: "POST",
          cc: {
            scope: "rental_records:write",
            sub: userId,
          },
          body: rentalData,
        },
      )
    },
    deleteRentalRecord: async ({userId, rentalId}) => {
      return await request(
        `${resourceServerUrl}/rental-records/${rentalId}`,
        {
          method: "DELETE",
          cc: {
            scope: "rental_records:write",
            sub: userId,
          },
        },
      )
    },
  }
}
