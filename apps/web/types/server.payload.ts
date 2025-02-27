declare global {
  interface ILoginPayload {
    identifier: string;
    password: string;
  }

  interface IRegisterPayload {
    firstName: string;
    lastName: string;
    identifier: string;
    password?: string;
  }

  interface IRequestOtpPayload {
    identifier: string;
    purpose: OtpPurpose;
  }

  interface IVerifyOtpPayload extends IRequestOtpPayload {
    secret: string;
    type?: OtpType;
    verifyOnly?: boolean;
  }

  interface IResetPasswordPayload extends IRequestOtpPayload {
    password: string;
    secret: string;
  }

  interface UpdateCartPayload {
    action: "add" | "remove" | "update";
    items: (Omit<ICartItem, "productId"> & { productId: string })[];
  }

  type UpdateWishlistPayload = {
    action: "add" | "remove";
    items: (Omit<IWishlistItem, "productId"> & { productId: string })[];
  };

  interface PlaceOrderPayload {
    items: (Omit<IOrderItem, "productId"> & { productId: string })[];
    totalAmount: number;
    orderStatus?: TOrderStatus;
    transactionId?: string;
    metadata?: Map<string, any>;
    shipping: { method: TShippingMethod; addressId: string; cost: number };
    billing: { method: TBillingMethod; addressId?: string };
    payment: {
      method: TPaymentMethod;
      status: TPaymentStatus;
      currency: string;
      symbol: string;
    };
  }

  interface AddAddressPayload
    extends Omit<IAddress, "userId" | "label" | "_id"> {
    label?: "home" | "work";
  }

  interface UpdateAddressPayload extends AddAddressPayload {
    addressId: string;
  }
}

export {};
