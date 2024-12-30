import HeroSection from "@/components/showcase/HeroSection";
import CategorySection from "@/components/showcase/CategorySection";
import ProductSection from "@/components/showcase/ProductSection";
import { Separator } from "@workspace/ui/components/separator";
import { SmartphoneCharging } from "lucide-react";
import FeatureSection from "@/components/showcase/FeatureSection";

function Home() {
  const productList = Array.from({ length: 10 }).map((_, index) => ({
    id: index + 1,
    name: `Product ${index + 1}`,
    price: { original: 19.99, sale: 15.99 },
    imageUrl: `/assets/images/product-${index + 1}.png`,
    category: "Electronics",
    rating: 4.5,
    reviews: 100,
    inStock: true,
  }));

  const categoryList = Array.from({ length: 10 }).map((_, index) => ({
    label: `Category ${index + 1} `,
    Icon: SmartphoneCharging,
    url: "/",
  }));

  const featureProducts = [
    {
      title: "PlayStation 5",
      desc: "Black and White version of the PS5 coming out on sale.",
      url: "/",
      imageUrl: "/assets/images/feature-product-1.png",
      className: "col-span-2 row-span-2",
    },
    {
      title: "Women’s Collections",
      desc: "Featured woman collections that give you another vibe.",
      url: "/",
      imageUrl: "/assets/images/feature-product-2.png",
      className: "col-span-2",
    },
    {
      title: "Speakers",
      desc: "Amazon wireless speakers",
      url: "/",
      imageUrl: "/assets/images/feature-product-3.png",
    },
    {
      title: "Perfume",
      desc: "GUCCI INTENSE OUD EDP",
      url: "/",
      imageUrl: "/assets/images/feature-product-4.png",
    },
  ];

  return (
    <div>
      <HeroSection />
      <ProductSection
        items={productList}
        useCarousel={true}
        headerProps={{
          title: "Flash Sale",
          subtitle: { text: "Today's" },
          countdown: {
            startDate: "2024-12-23T00:00:00",
            endDate: "2025-01-01T00:00:00",
          },
        }}
        footerProps={{ linkButtonProps: { href: "/products" } }}
      />
      <Separator className="mt-4" />
      <CategorySection
        items={categoryList}
        useCarousel={true}
        headerProps={{
          title: "Browse By Category",
          subtitle: { text: "Categories" },
        }}
      />
      <Separator className="mt-4" />
      <ProductSection
        items={productList}
        headerProps={{
          title: "Best Selling Products",
          subtitle: { text: "This Month" },
          linkButtonProps: { href: "/products", variant: "outline" },
        }}
      />
      <ProductSection
        items={productList}
        useCarousel={true}
        headerProps={{
          title: "Explore Our Products",
          subtitle: { text: "Our Products" },
        }}
        footerProps={{ linkButtonProps: { href: "/products" } }}
      />
      <FeatureSection
        headerProps={{ title: "New Arrival", subtitle: { text: "Featured" } }}
        items={featureProducts}
      />
    </div>
  );
}

export default Home;
