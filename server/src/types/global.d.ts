import { InferSchemaType, Types } from "mongoose";

export type Nullable<T> = T | null | undefined;
export type InferMongooseSchema<T extends Schema> = InferSchemaType<T> & {
  _id: Types.ObjectId;
};
export interface ILookupIPInfo<T> {
  data?: {
    query: string;
    status: "success" | "fail";
    continent: string;
    continentCode: string;
    country: string;
    countryCode: string;
    region: string;
    regionName: string;
    city: string;
    district: string;
    zip: string;
    lat: number;
    lon: number;
    timezone: string;
    offset: number;
    currency: string;
    symbol: string;
    isp: string;
    org: string;
    as: string;
    asname: string;
    mobile: boolean;
    proxy: boolean;
    hosting: boolean;
  };

  fallback: T;
}
