import BreadcrumbNav from "@/components/constant/BreadcrumbNav";
import ProductSection from "@/components/showcase/ProductSection";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Separator } from "@workspace/ui/components/separator";
import { Bus, Heart, RefreshCcw } from "lucide-react";
import Image from "next/image";
import React from "react";

function ProductDetails() {
  const relatedProducts = Array.from({ length: 5 }).map((_, index) => ({
    id: index + 1,
    name: `Product ${index + 1}`,
    price: { original: 19.99, sale: 15.99 },
    imageUrl: `/assets/images/product-${index + 1}.png`,
    category: "Electronics",
    rating: 4.5,
    reviews: 100,
    inStock: true,
  }));

  return (
    <div className="flex flex-col gap-8 pb-8 pt-16">
      <BreadcrumbNav />
      <div className="grid grid-cols-1 gap-8 p-6 md:grid-cols-2">
        <div className="flex flex-col gap-4 lg:flex-row-reverse">
          <div className="flex-center bg-secondary">
            <Image
              src="/assets/images/product-main-image.png"
              alt="Main Product"
              width={500}
              height={600}
              className="scale-90"
            />
          </div>
          <div className="flex gap-4 lg:flex-col">
            <div className="flex-center bg-secondary">
              <Image
                src="/assets/images/product-thumb-1.png"
                alt="Thumbnail 1"
                width={170}
                height={138}
                className="scale-75"
              />
            </div>
            <div className="flex-center bg-secondary">
              <Image
                src="/assets/images/product-thumb-2.png"
                alt="Thumbnail 2"
                width={170}
                height={138}
                className="scale-75"
              />
            </div>
            <div className="flex-center bg-secondary">
              <Image
                src="/assets/images/product-thumb-3.png"
                alt="Thumbnail 3"
                width={170}
                height={138}
                className="scale-75"
              />
            </div>
            <div className="flex-center bg-secondary">
              <Image
                src="/assets/images/product-thumb-4.png"
                alt="Thumbnail 4"
                width={170}
                height={138}
                className="scale-75"
              />
            </div>
          </div>
        </div>

        <div className="max-w-[400px] space-y-6">
          <div className="flex w-max flex-col gap-2">
            <h1 className="h3">Havic HV G-92 Gamepad</h1>
            <div className="flex-items-center gap-2">
              <div>Stars</div>
              <span>(150 Reviews)</span>|<span>In Stock</span>
            </div>
          </div>
          <div className="flex gap-4 text-lg">
            <span className="text-primary">$192.00</span>
            <span className="line-through">$192.00</span>
          </div>
          <p className="text-light text-sm">
            PlayStation 5 Controller Skin: High-quality vinyl with air channel
            adhesive for easy bubble-free installation & mess-free removal.
            Pressure sensitive.
          </p>
          <div className="flex items-center gap-4">
            <label className="font-medium">Colours:</label>
            <button className="h-6 w-6 rounded-full border-2 border-gray-300 bg-red-500 focus:ring-2"></button>
            <button className="h-6 w-6 rounded-full border-2 border-gray-300 bg-gray-500 focus:ring-2"></button>
          </div>
          <div className="flex items-center gap-4">
            <label className="font-medium">Size:</label>
            <div className="flex gap-4">
              <Button size="icon" variant="outline">
                XS
              </Button>
              <Button size="icon" variant="outline">
                S
              </Button>
              <Button size="icon">M</Button>
              <Button size="icon" variant="outline">
                L
              </Button>
              <Button size="icon" variant="outline">
                XL
              </Button>
            </div>
          </div>
          <div className="flex gap-4">
            <Input type="number" min="1" defaultValue="1" className="w-max" />
            <Button>Buy Now</Button>
            <Button size="icon" variant="outline">
              <Heart />
            </Button>
          </div>
          <div className="grid w-[400px] gap-4 border px-4 py-6 [&_svg]:size-7">
            <div className="flex items-center gap-4">
              <Bus />
              <div className="grid gap-1">
                <span className="subtitle-1">Free Delivery</span>
                <p className="text-xs">
                  Enter your postal code for Delivery Availability
                </p>
              </div>
            </div>
            <Separator />
            <div className="flex items-center gap-4">
              <RefreshCcw />
              <div className="grid gap-1">
                <span className="subtitle-1">Return Delivery</span>
                <p className="text-xs">Return Delivery within 30 Days</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ProductSection
        items={relatedProducts}
        useCarousel={true}
        headerProps={{ subtitle: { text: `Related Products` } }}
      />
    </div>
  );
}

export default ProductDetails;
