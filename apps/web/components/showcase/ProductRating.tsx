import { Star } from "lucide-react";

export interface IProductRating {
  product: IProduct;
  showText?: boolean;
}

const ProductRating = ({ product, showText = true }: IProductRating) => {
  const stars = Array.from({ length: 5 }, (_, i) => {
    if (product.rating >= i + 1) {
      return <Star key={i} className="text-yellow-400 fill-yellow-400" />;
    } else if (product.rating >= i + 0.5) {
      return (
        <div key={i} className="relative w-4 h-4">
          <Star className="absolute text-gray-300 fill-gray-300" />
          <Star
            className="absolute text-yellow-400 fill-yellow-400"
            style={{ clipPath: "polygon(0 0, 50% 0, 50% 100%, 0% 100%)" }}
          />
        </div>
      );
    } else {
      return <Star key={i} className="text-gray-300 fill-gray-300" />;
    }
  });

  return (
    <div className="flex items-center gap-1 [&_svg]:size-4">
      {stars}
      <span>
        ({product.reviews.length || Math.floor(Math.random() * 10) + 1}){" "}
        {showText && "reviews"}
      </span>
    </div>
  );
};

export default ProductRating;
