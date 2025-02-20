// import { AddressCreateRequest, ParcelCreateRequest, Shippo } from "shippo";
// import { IUserAddress } from "@/models/address";
// import { IShipping } from "@/models/product";
// import envConfig from "./env";

// const shippo = new Shippo({ apiKeyHeader: envConfig.shippo.key });

// export const createAddress = (address: IUserAddress): AddressCreateRequest => {
//   return {
//     name: address.name,
//     phone: address.phone,
//     street1: address.street1,
//     city: address.city,
//     state: address.state,
//     zip: address.zip,
//     country: address.country,
//   };
// };

// export const createParcel = (parcel: IShipping): ParcelCreateRequest => {
//   return {
//     distanceUnit: parcel.distanceUnit,
//     massUnit: parcel.massUnit,
//     weight: parcel.weight.toString(),
//     length: parcel.length.toString(),
//     width: parcel.width.toString(),
//     height: parcel.height.toString(),
//   };
// };

// export const createShipment = async (
//   address: IUserAddress,
//   parcels: IShipping[]
// ) => {
//   const addressFrom = {
//     name: "Sender Name",
//     street1: "123 Sender St",
//     city: "Sender City",
//     state: "CA",
//     zip: "12345",
//     country: "US",
//     phone: "1234567890",
//     email: "sender@example.com",
//   };

//   const response = await shippo.shipments.create({
//     addressFrom: createAddress(addressFrom),
//     addressTo: createAddress(address),
//     parcels: parcels.map((parcel) => createParcel(parcel)),
//     async: false,
//   });

//   return response;
// };

// // export const getShippingRates = async (req: Request, res: Response) => {
// //   try {
// //     const { address, parcels } = req.body;

// //     const rates = await createShipment(address, parcels);

// //     sendResponse(res, 200, true, "Rates fetched successfully", {
// //       rates,
// //     });
// //   } catch (error: any) {
// //     handleError(res, error, "Failed to retrieve shipping rates.");
// //   }
// // };
