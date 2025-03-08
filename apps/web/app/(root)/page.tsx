"use client";
import HeroSection from "@/components/section/HeroSection";
import CategorySection from "@/components/section/CategorySection";
import ProductSection from "@/components/section/ProductSection";
import { Separator } from "@workspace/ui/components/separator";
import { bannerCardsList } from "@/constants/product";
import BannerCardSection from "@/components/section/BannerCardSection";
import useStorage from "@/hooks/useStorage";

function Home() {
  const { products, categories } = useStorage();

  return (
    <>
      <HeroSection />
      <BannerCardSection items={bannerCardsList} />
      <ProductSection
        items={products}
        useCarousel={true}
        headerProps={{
          title: "Flash Sale",
          subtitle: { text: "Today's" },
          countdown: {
            startDate: "2024-12-23T00:00:00",
            endDate: "2025-01-03T00:00:00",
          },
        }}
        footerProps={{
          buttonProps: { href: "/products" },
        }}
      />
      <Separator />
      <CategorySection
        items={categories}
        useCarousel={true}
        headerProps={{
          title: "Browse By Category",
          subtitle: { text: "Categories" },
        }}
      />
      <Separator />
      <ProductSection
        items={products}
        headerProps={{
          title: "Best Selling Products",
          subtitle: { text: "This Month" },
          buttonProps: { href: "/products", variant: "outline" },
        }}
      />
      <ProductSection
        items={products}
        useCarousel={true}
        headerProps={{
          title: "Explore Our Products",
          subtitle: { text: "Our Products" },
        }}
        footerProps={{ buttonProps: { href: "/products" } }}
      />
    </>
  );
}

export default Home;
