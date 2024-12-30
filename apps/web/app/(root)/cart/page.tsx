import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Separator } from "@workspace/ui/components/separator";
import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import React from "react";

function Cart() {
  return (
    <div className="flex flex-col gap-8 pb-8 pt-16">
      <div>
        <h1 className="h3">CheckOut</h1>
      </div>
      <div className="flex gap-16">
        <div className="flex-1">
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto rounded-lg shadow-md">
              <thead>
                <tr className="bg-secondary text-left text-sm uppercase text-secondary-foreground">
                  <th className="px-6 py-3">Product</th>
                  <th className="px-6 py-3">Price</th>
                  <th className="px-6 py-3">Quantity</th>
                  <th className="px-6 py-3">Subtotal</th>
                  <th className="sr-only w-max">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-secondary/20">
                  <td className="flex items-center gap-4 px-6 py-4">
                    <Image
                      src="/path-to-lcd-monitor.jpg"
                      alt="LCD Monitor"
                      width={48}
                      height={48}
                      className="rounded"
                    />
                    <span>LCD Monitor</span>
                  </td>
                  <td className="px-6 py-4">$650</td>
                  <td className="px-6 py-4">
                    <div className="relative inline-flex h-10 w-24 items-center overflow-hidden rounded-lg border [&_svg]:size-5 [&_svg]:cursor-pointer">
                      <Minus className="absolute left-2" />
                      <Input
                        type="number"
                        placeholder="1"
                        className="shad-input size-full !px-6 text-center"
                      />

                      <Plus className="absolute right-2" />
                    </div>
                  </td>
                  <td className="px-6 py-4">$650</td>
                  <td className="w-max px-6 py-4 text-center">
                    <Button
                      variant="destructive"
                      className="rounded-full"
                      size="icon"
                      aria-label="Remove Product"
                    >
                      <Trash2 />
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex w-64 flex-col gap-4 p-4">
          <div className="h4 flex-justify-between">
            <span>Subtotal</span>
            <span>$200.00</span>
          </div>
          <Separator />
          <div>
            <span className="text-xs">Enter Discount Code</span>
            <form className="flex">
              <Input type="text" className="shad-no-focus rounded-r-none" />
              <Button className="rounded-l-none">Apply</Button>
            </form>
          </div>
          <div className="flex-justify-between">
            <span> Delivery Charge</span>
            <span>$5.00</span>
          </div>
          <Separator />
          <div className="h4 flex-justify-between">
            <span>Grand Total</span>
            <span>$205.00</span>
          </div>
          <Button>Proceed to Checkout</Button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
