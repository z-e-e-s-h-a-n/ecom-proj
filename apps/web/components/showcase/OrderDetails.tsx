"use client";

import React from "react";
import Image from "next/image";
import { format } from "date-fns";
import { Button } from "@workspace/ui/components/button";
import { getImages } from "@/lib/utils";

interface OrderDetailsProps {
  order: IOrder;
}

const OrderDetails = ({ order }: OrderDetailsProps) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Order Details</h2>
      <div className="border-b pb-4 mb-4">
        <p>
          <strong>Order ID:</strong> {order.userId}
        </p>
        <p>
          <strong>Status:</strong>{" "}
          <span
            className={`text-${order.orderStatus === "delivered" ? "green-600" : "yellow-600"}`}
          >
            {order.orderStatus}
          </span>
        </p>
        <p>
          <strong>Placed On:</strong>{" "}
          {format(new Date(order.createdAt), "PPpp")}
        </p>
      </div>

      <h3 className="text-lg font-medium mb-3">Shipping Information</h3>
      <div className="border-b pb-4 mb-4">
        <p>
          <strong>Method:</strong> {order.shipping.method}
        </p>
        <p>
          <strong>Address:</strong>{" "}
          {`${order.shipping.addressId.street}, ${order.shipping.addressId.city}, ${order.shipping.addressId.state}, ${order.shipping.addressId.country}`}
        </p>
        <p>
          <strong>Cost:</strong> {order.payment.symbol}{" "}
          {order.shipping.cost.toFixed(2)}
        </p>
      </div>

      <h3 className="text-lg font-medium mb-3">Payment Information</h3>
      <div className="border-b pb-4 mb-4">
        <p>
          <strong>Method:</strong> {order.payment.method.toUpperCase()}
        </p>
        <p>
          <strong>Status:</strong>{" "}
          <span
            className={`text-${order.payment.status === "completed" ? "green-600" : "red-600"}`}
          >
            {order.payment.status}
          </span>
        </p>
        <p>
          <strong>Total Amount:</strong> {order.payment.symbol}{" "}
          {order.totalAmount.toFixed(2)}
        </p>
      </div>

      <h3 className="text-lg font-medium mb-3">Ordered Items</h3>
      <div className="space-y-4">
        {order.items.map(({ productId, variantId, price, quantity }, index) => {
          const { image } = getImages(productId, variantId);
          return (
            <div
              key={index}
              className="flex items-center gap-4 border p-3 rounded-md"
            >
              <Image
                src={image}
                alt={productId.name}
                width={60}
                height={60}
                className="rounded aspect-square"
              />
              <div className="flex-1">
                <p className="font-medium">{productId.name}</p>
                <p className="text-sm text-gray-600">Quantity: {quantity}</p>
                <p className="text-sm text-gray-600">
                  Price: {order.payment.symbol} {price.toFixed(2)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Button variant="outline">Download Invoice</Button>
        <Button>Track Order</Button>
      </div>
    </div>
  );
};

export default OrderDetails;
