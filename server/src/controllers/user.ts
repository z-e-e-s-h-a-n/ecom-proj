import CartModel from "@/models/cart";
import OrderModel from "@/models/order";
import PaymentModel from "@/models/payment";
import UserModel from "@/models/user";
import WishlistModel from "@/models/wishlist";
import { sendResponse } from "@/utils/helper";
import logger from "@/utils/logger";
import { findAndPopulate } from "@/utils/mongoose";
import { formatUserResponse } from "@/utils/user";
import { Request, Response } from "express";

export const getUser = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return sendResponse(res, 401, false, "Unauthorized access.");
    }
    const user = await UserModel.findById(req.user._id);
    if (!user) {
      return sendResponse(res, 404, false, "User not found.");
    }
    sendResponse(res, 200, true, "User fetched successfully.", {
      user: formatUserResponse(user),
    });
  } catch (error) {
    logger.error("Error fetching user profile:", { error });
    sendResponse(res, 500, false, "Internal server error.");
  }
};

export const getCart = async (req: Request, res: Response) => {
  if (!req.user) {
    return sendResponse(res, 401, false, "Unauthorized access.");
  }
  const userId = req.user._id;

  try {
    const cart = await findAndPopulate(CartModel, userId);
    sendResponse(res, 200, true, "Cart fetched successfully", {
      cart: cart || { userId, items: [] },
    });
  } catch (error) {
    sendResponse(res, 500, false, "Failed to fetch cart");
  }
};

export const addToCart = async (req: Request, res: Response) => {
  if (!req.user) {
    return sendResponse(res, 401, false, "Unauthorized access.");
  }
  const userId = req.user._id;
  const { items } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return sendResponse(res, 400, false, "Invalid cart data.");
  }

  try {
    const addOps = items.map((item: any) =>
      CartModel.updateOne(
        {
          userId,
          "items.productId": { $ne: item.productId },
          "items.variantId": { $ne: item.variantId },
        },
        { $push: { items: item } },
        { upsert: true }
      )
    );
    await Promise.all(addOps);

    sendResponse(res, 200, true, "Unique items added to your cart");
  } catch (error) {
    sendResponse(res, 500, false, "Failed to add items to cart");
  }
};

export const updateCart = async (req: Request, res: Response) => {
  if (!req.user) {
    return sendResponse(res, 401, false, "Unauthorized access.");
  }
  const userId = req.user._id;
  const { productId, variantId, quantity } = req.body;

  try {
    const cart = await CartModel.findOneAndUpdate(
      { userId, "items.productId": productId, "items.variantId": variantId },
      { $set: { "items.$.quantity": quantity } },
      { new: true }
    );

    if (!cart) {
      return sendResponse(res, 404, false, "Item not found in cart");
    }

    sendResponse(res, 200, true, "Item updated in cart", { cart });
  } catch (error) {
    sendResponse(res, 500, false, "Failed to update cart item");
  }
};

export const removeFromCart = async (req: Request, res: Response) => {
  if (!req.user) {
    return sendResponse(res, 401, false, "Unauthorized access.");
  }
  const userId = req.user._id;
  const { productId, variantId } = req.body;

  try {
    const cart = await CartModel.findOneAndUpdate(
      { userId },
      { $pull: { items: { productId, variantId } } },
      { new: true }
    );
    sendResponse(res, 200, true, "Item removed from cart", { cart });
  } catch (error) {
    sendResponse(res, 500, false, "Failed to remove item from cart");
  }
};

export const getWishlist = async (req: Request, res: Response) => {
  if (!req.user) {
    return sendResponse(res, 401, false, "Unauthorized access.");
  }
  const userId = req.user._id;

  try {
    const wishlist = await findAndPopulate(WishlistModel, userId);
    sendResponse(res, 200, true, "Wishlist fetched successfully", {
      wishlist: wishlist || { userId, items: [] },
    });
  } catch (error) {
    sendResponse(res, 500, false, "Failed to fetch wishlist");
  }
};

export const addToWishlist = async (req: Request, res: Response) => {
  if (!req.user) {
    return sendResponse(res, 401, false, "Unauthorized access.");
  }
  const userId = req.user._id;
  const { items } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return sendResponse(res, 400, false, "Invalid wishlist data.");
  }

  try {
    const addOps = items.map((item: any) =>
      WishlistModel.updateOne(
        {
          userId,
          "items.productId": { $ne: item.productId },
          "items.variantId": { $ne: item.variantId },
        },
        { $push: { items: item } },
        { upsert: true }
      )
    );
    await Promise.all(addOps);

    sendResponse(res, 200, true, "Unique items added to your wishlist");
  } catch (error) {
    sendResponse(res, 500, false, "Failed to add items to wishlist");
  }
};

export const removeFromWishlist = async (req: Request, res: Response) => {
  if (!req.user) {
    return sendResponse(res, 401, false, "Unauthorized access.");
  }
  const userId = req.user._id;
  const { productId, variantId } = req.body;

  try {
    const wishlist = await WishlistModel.findOneAndUpdate(
      { userId },
      { $pull: { items: { productId, variantId } } },
      { new: true }
    );
    sendResponse(res, 200, true, "Item removed from wishlist", { wishlist });
  } catch (error) {
    sendResponse(res, 500, false, "Failed to remove item from wishlist");
  }
};

export const placeOrder = async (req: Request, res: Response) => {
  if (!req.user) {
    return sendResponse(res, 401, false, "Unauthorized access.");
  }
  const userId = req.user._id;
  const { items, totalAmount, metadata } = req.body;

  if (!items || !totalAmount) {
    return sendResponse(res, 400, false, "Missing Fields are required.");
  }

  try {
    const order = new OrderModel({
      userId,
      items,
      totalAmount,
      paymentStatus: "Pending",
      orderStatus: "Pending",
      metadata,
    });

    await order.save();
    sendResponse(res, 201, true, "Order placed successfully", { order });
  } catch (error) {
    sendResponse(res, 500, false, "Failed to place order");
  }
};

export const getUserOrders = async (req: Request, res: Response) => {
  if (!req.user) {
    return sendResponse(res, 401, false, "Unauthorized access.");
  }
  const userId = req.user._id;

  try {
    const orders = await OrderModel.find({ userId }).populate(
      "products.productId"
    );
    sendResponse(res, 200, true, "Orders fetched successfully", { orders });
  } catch (error) {
    sendResponse(res, 500, false, "Failed to fetch orders");
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  if (!req.user) {
    return sendResponse(res, 401, false, "Unauthorized access.");
  }
  const userId = req.user._id;
  const { orderId } = req.params;

  try {
    const order = await OrderModel.findOne({ userId, _id: orderId }).populate(
      "products.productId"
    );

    if (!order) {
      return sendResponse(res, 404, false, "Order not found");
    }

    sendResponse(res, 200, true, "Order fetched successfully", { order });
  } catch (error) {
    sendResponse(res, 500, false, "Failed to fetch order");
  }
};

export const initiatePayment = async (req: Request, res: Response) => {
  if (!req.user) {
    return sendResponse(res, 401, false, "Unauthorized access.");
  }
  const { orderId, amount, paymentMethod } = req.body;
  const userId = req.user._id;
  try {
    const payment = await PaymentModel.create({
      userId,
      orderId,
      amount,
      paymentMethod,
      status: "Pending",
    });
    sendResponse(res, 201, true, "Payment initiated successfully", { payment });
  } catch (error) {
    sendResponse(res, 500, false, "Failed to initiate payment");
  }
};

export const verifyPayment = async (req: Request, res: Response) => {
  const { transactionId, status } = req.body;
  try {
    const payment = await PaymentModel.findOneAndUpdate(
      { transactionId },
      { status },
      { new: true }
    );
    sendResponse(res, 200, true, "Payment status updated successfully", {
      payment,
    });
  } catch (error) {
    sendResponse(res, 500, false, "Failed to verify payment");
  }
};
