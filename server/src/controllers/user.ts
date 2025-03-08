import CartModel from "@/models/cart";
import OrderModel from "@/models/order";
import UserModel from "@/models/user";
import WishlistModel from "@/models/wishlist";
import { handleError, sendResponse } from "@/lib/utils/helper";
import { formatUserResponse } from "@/lib/utils/helper";
import { Request, Response } from "express";
import AddressModel from "@/models/address";
import { addressSchema } from "@workspace/shared/schemas/address";
import { validateRequest } from "@/config/zod";
import { cartItemSchema, cartSchema } from "@workspace/shared/schemas/cart";
import {
  wishlistItemSchema,
  wishlistSchema,
} from "@workspace/shared/schemas/wishlist";
import { orderSchema } from "@workspace/shared/schemas/order";

export const getUser = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;

    const user = await UserModel.findById(userId);
    if (!user) return sendResponse(res, 404, "User not found.");

    sendResponse(res, 200, "User fetched successfully.", {
      user: formatUserResponse(user),
    });
  } catch (error) {
    handleError(res, "Failed to fetch user", error);
  }
};

export const getCart = async (req: Request, res: Response) => {
  const userId = req.user?._id;

  try {
    const cart = await CartModel.findOne({ userId }).populate({
      path: "items.productId",
      populate: [
        "category",
        "reviews",
        "specifications.id",
        "attributes.id",
        "variations.pricing.currencyId",
      ],
    });

    sendResponse(res, 200, "Cart fetched successfully", {
      cart: cart || { userId, items: [] },
    });
  } catch (error) {
    handleError(res, "Failed to fetch cart", error);
  }
};

export const addToCart = async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const items = validateRequest(cartSchema, req.body);

  try {
    const addOps = items.map((item: any) =>
      CartModel.updateOne(
        {
          userId,
          items: {
            $not: {
              $elemMatch: {
                productId: item.productId,
                variantId: item.variantId,
              },
            },
          },
        },
        { $push: { items: item } },
        { upsert: true }
      )
    );
    await Promise.all(addOps);
    sendResponse(res, 200, "Unique items added to your cart");
  } catch (error) {
    handleError(res, "Failed to add items to cart", error);
  }
};

export const updateCart = async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const { productId, variantId, quantity } = validateRequest(
    cartItemSchema,
    req.body
  );

  try {
    const cart = await CartModel.findOneAndUpdate(
      { userId, "items.productId": productId, "items.variantId": variantId },
      { $set: { "items.$.quantity": quantity } },
      { new: true }
    );

    if (!cart) return sendResponse(res, 404, "Item not found in cart");

    sendResponse(res, 200, "Item updated in cart");
  } catch (error) {
    handleError(res, "Failed to update item in cart", error);
  }
};

export const removeFromCart = async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const { productId, variantId } = validateRequest(cartItemSchema, req.body);

  try {
    await CartModel.findOneAndUpdate(
      { userId },
      { $pull: { items: { productId, variantId } } },
      { new: true }
    );
    sendResponse(res, 200, "Item removed from cart");
  } catch (error) {
    handleError(res, "Failed to remove item from cart", error);
  }
};

export const getWishlist = async (req: Request, res: Response) => {
  const userId = req.user?._id;

  try {
    const wishlist = await WishlistModel.findOne({ userId }).populate({
      path: "items.productId",
      populate: [
        "category",
        "reviews",
        "specifications.id",
        "attributes.id",
        "variations.pricing.currencyId",
      ],
    });

    sendResponse(res, 200, "Wishlist fetched successfully", {
      wishlist: wishlist || { userId, items: [] },
    });
  } catch (error) {
    handleError(res, "Failed to fetch wishlist", error);
  }
};

export const addToWishlist = async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const items = validateRequest(wishlistSchema, req.body);

  try {
    const addOps = items.map((item: any) =>
      WishlistModel.updateOne(
        {
          userId,
          items: {
            $not: {
              $elemMatch: {
                productId: item.productId,
                variantId: item.variantId,
              },
            },
          },
        },
        { $push: { items: item } },
        { upsert: true }
      )
    );
    await Promise.all(addOps);

    sendResponse(res, 200, "Unique items added to your wishlist");
  } catch (error) {
    handleError(res, "Failed to add items to wishlist", error);
  }
};

export const removeFromWishlist = async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const { productId, variantId } = validateRequest(
    wishlistItemSchema,
    req.body
  );

  try {
    await WishlistModel.findOneAndUpdate(
      { userId },
      { $pull: { items: { productId, variantId } } },
      { new: true }
    );
    sendResponse(res, 200, "Item removed from wishlist");
  } catch (error) {
    handleError(res, "Failed to remove item from wishlist", error);
  }
};

export const placeOrder = async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const orderData = validateRequest(orderSchema, req.body);

  try {
    const order = await OrderModel.create({ userId, ...orderData });

    await order.populate([
      {
        path: "items.productId",
        populate: ["category", "variations.pricing.currencyId"],
      },
      "shipping.addressId",
      "billing.addressId",
    ]);

    sendResponse(res, 201, "Order placed successfully", { order });
  } catch (error) {
    handleError(res, "Failed to place order", error);
  }
};

export const getOrders = async (req: Request, res: Response) => {
  const userId = req.user?._id;

  try {
    const orders = await OrderModel.find({ userId }).populate([
      {
        path: "items.productId",
        populate: ["category", "variations.pricing.currencyId"],
      },
      { path: "shipping.addressId" },
      { path: "billing.addressId" },
    ]);
    sendResponse(res, 200, "Orders fetched successfully", { orders });
  } catch (error) {
    handleError(res, "Failed to fetch orders", error);
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const orderId = req.params.orderId;
  if (!orderId) return sendResponse(res, 400, "Order Id is Required");

  try {
    const order = await OrderModel.findOne({ userId, _id: orderId }).populate([
      {
        path: "items.productId",
        populate: ["category", "variations.pricing.currencyId"],
      },
      { path: "shipping.addressId" },
      { path: "billing.addressId" },
    ]);

    if (!order) return sendResponse(res, 404, "Order not found");

    sendResponse(res, 200, "Order fetched successfully", { order });
  } catch (error) {
    handleError(res, "Failed to fetch order", error);
  }
};

export const initiatePayment = async (_: Request, res: Response) => {
  try {
    sendResponse(res, 201, "Payment initiated successfully");
  } catch (error) {
    handleError(res, "Failed to initiate payment", error);
  }
};

export const verifyPayment = async (_: Request, res: Response) => {
  try {
    sendResponse(res, 200, "Payment status updated successfully", {});
  } catch (error) {
    handleError(res, "Failed to update payment status", error);
  }
};

export const getAddresses = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const addresses = await AddressModel.find({ userId });

    if (!addresses) return sendResponse(res, 404, "Address Not Found");

    sendResponse(res, 200, "Address Fetched Successfully", {
      addresses,
    });
  } catch (error) {
    handleError(res, "Failed to fetch Address", error);
  }
};

export const getAddress = async (req: Request, res: Response) => {
  try {
    const { addressId } = req.params;
    if (!addressId) return sendResponse(res, 400, "Address ID is required");

    const address = await AddressModel.findById(addressId);
    if (!address) return sendResponse(res, 404, "Address Not Found");

    sendResponse(res, 200, "Address Fetch Successfully", {
      address,
    });
  } catch (error) {
    handleError(res, "Failed to fetch Address", error);
  }
};

export const addAddress = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const addressData = validateRequest(addressSchema, req.body);

    const address =
      addressData.type === "billing"
        ? await AddressModel.findOneAndUpdate(
            { userId, type: "billing" },
            addressData,
            { new: true, upsert: true }
          )
        : await AddressModel.create({ userId, ...addressData });

    sendResponse(res, 200, "Address saved successfully", { address });
  } catch (error) {
    handleError(res, "Failed to add address", error);
  }
};

export const updateAddress = async (req: Request, res: Response) => {
  try {
    const addressId = req.params.addressId;
    if (!addressId) return sendResponse(res, 400, "Address ID is required");
    const addressData = validateRequest(addressSchema, req.body);

    const address = await AddressModel.findOneAndUpdate(
      { _id: addressId },
      addressData,
      { new: true }
    );

    if (!address) return sendResponse(res, 404, "Address Not Found");

    sendResponse(res, 200, "Address Updated Successfully", { address });
  } catch (error) {
    handleError(res, "Failed to update Address", error);
  }
};

export const deleteAddress = async (req: Request, res: Response) => {
  try {
    const { addressId } = req.params;
    if (!addressId) return sendResponse(res, 400, "Address ID is required");

    const address = await AddressModel.findByIdAndDelete(addressId);
    if (!address) return sendResponse(res, 404, "Address Not Found");

    sendResponse(res, 200, "Address Deleted Successfully");
  } catch (error) {
    handleError(res, "Failed to delete Address", error);
  }
};
