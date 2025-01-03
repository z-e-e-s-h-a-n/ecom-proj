import { BannerCardProps } from "@/components/showcase/BannerCard";
import { SmartphoneCharging } from "lucide-react";

export const productList: IProduct[] = Array.from({ length: 10 }).map(
  (_, index) => ({
    id: (index + 1) as unknown as string,
    name: `Product ${index + 1}`,
    price: { original: 19.99, sale: 15.99 },
    imageUrl: `/assets/images/product-${index + 1}.png`,
    category: "Electronics",
    rating: 4.5,
    quantity: 10,
    reviews: 100,
    inStock: true,
  })
);

export const categoryList = Array.from({ length: 10 }).map((_, index) => ({
  label: `Category ${index + 1} `,
  Icon: SmartphoneCharging,
  url: "/",
}));

export const bannerCardsList: BannerCardProps[] = [
  {
    subtitle: "Featured",
    title: "Women’s Collections",
    btnText: "buy Now",
    url: "#",
    imageUrl: "/assets/images/card-banner-1.webp",
  },
  {
    subtitle: "Speakers",
    title: "Amazon wireless speakers",
    btnText: "buy Now",
    url: "#",
    imageUrl: "/assets/images/card-banner-2.webp",
  },
  {
    subtitle: "Perfume",
    title: "GUCCI INTENSE OUD EDP",
    btnText: "buy Now",
    url: "#",
    imageUrl: "/assets/images/card-banner-3.webp",
  },
];
