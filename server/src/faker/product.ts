import { faker } from "@faker-js/faker";
import CategoryModel from "@/models/category";
import ProductModel from "@/models/product";

export const createFakeCategories = async (count = 10) => {
  const uniqueNames = new Set<string>();

  while (uniqueNames.size < count) {
    uniqueNames.add(faker.commerce.department());
  }

  const categories = Array.from(uniqueNames).map((name) => ({
    name,
    description: faker.commerce.productDescription(),
    isActive: faker.datatype.boolean(),
  }));

  const createdCategories = await CategoryModel.insertMany(categories);
  return createdCategories;
};

export const createFakeProducts = async (count = 10) => {
  const categories = await CategoryModel.find();

  if (categories.length === 0) {
    throw new Error("No categories found. Please generate categories first.");
  }

  const products = Array.from({ length: count }, () => {
    const randomCategory = faker.helpers.arrayElement(categories);

    return {
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      images: Array.from({ length: 3 }, () => faker.image.urlPicsumPhotos()),
      video: faker.internet.url(),
      highlights: faker.helpers.arrayElements(
        [
          "Noise-cancelling",
          "Water-resistant",
          "Extended battery life",
          "Lightweight",
        ],
        faker.number.int({ min: 1, max: 3 })
      ),
      category: randomCategory._id,
      pricing: [
        {
          region: "US",
          currency: "USD",
          original: faker.number.int({ min: 50, max: 500 }),
          sale: faker.number.int({ min: 10, max: 50 }),
        },
        {
          region: "PK",
          currency: "PKR",
          original: faker.number.int({ min: 5000, max: 50000 }),
          sale: faker.number.int({ min: 1000, max: 5000 }),
        },
      ],
      stock: faker.number.int({ min: 0, max: 100 }),
      variations: [
        {
          type: "Color",
          values: Array.from({ length: 3 }, () => ({
            price: faker.number.int({ min: 50, max: 500 }),
            salePrice: faker.number.int({ min: 10, max: 50 }),
            stock: faker.number.int({ min: 0, max: 50 }),
            sku: faker.string.alphanumeric(10),
            weight: faker.number.float({ min: 0.1, max: 10 }),
            dimensions: {
              length: faker.number.float({
                min: 10,
                max: 100,
                multipleOf: 0.1,
              }),
              width: faker.number.float({ min: 10, max: 100, multipleOf: 0.1 }),
              height: faker.number.float({
                min: 10,
                max: 100,
                multipleOf: 0.1,
              }),
            },
          })),
        },
        {
          type: "Size",
          values: Array.from({ length: 4 }, () => ({
            price: faker.number.int({ min: 50, max: 500 }),
            salePrice: faker.number.int({ min: 10, max: 50 }),
            stock: faker.number.int({ min: 0, max: 50 }),
            sku: faker.string.alphanumeric(10),
            weight: faker.number.float({ min: 0.1, max: 10 }),
            dimensions: {
              length: faker.number.float({
                min: 10,
                max: 100,
                multipleOf: 0.1,
              }),
              width: faker.number.float({ min: 10, max: 100, multipleOf: 0.1 }),
              height: faker.number.float({
                min: 10,
                max: 100,
                multipleOf: 0.1,
              }),
            },
          })),
        },
      ],
      tags: faker.helpers.arrayElements(
        ["Eco-Friendly", "Limited Edition", "Popular", "Trending"],
        faker.number.int({ min: 1, max: 3 })
      ),
      isActive: faker.datatype.boolean(),
      rating: faker.number.float({ min: 1, max: 5, fractionDigits: 1 }),
      reviews: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });

  const createdProducts = await ProductModel.insertMany(products);
  return createdProducts;
};
