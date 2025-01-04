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
    desc: faker.commerce.productDescription(),
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
      desc: faker.commerce.productDescription(),
      images: Array.from({ length: 3 }, () => faker.image.url()),
      category: randomCategory._id,
      pricing: {
        US: {
          original: faker.number.int({ min: 50, max: 500 }),
          sale: faker.number.int({ min: 10, max: 50 }),
        },
        PK: {
          original: faker.number.int({ min: 5000, max: 50000 }),
          sale: faker.number.int({ min: 1000, max: 5000 }),
        },
      },
      availability: {
        US: faker.datatype.boolean(),
        PK: faker.datatype.boolean(),
      },
      stock: faker.number.int({ min: 0, max: 100 }),
      variants: {
        colors: faker.helpers.arrayElements(
          ["Red", "Blue", "Green", "Black", "White"],
          faker.number.int({ min: 1, max: 3 })
        ),
        sizes: faker.helpers.arrayElements(
          ["S", "M", "L", "XL"],
          faker.number.int({ min: 1, max: 3 })
        ),
        attributes: {
          warranty: `${faker.number.int({ min: 1, max: 5 })} years`,
          weight: `${faker.number.int({ min: 1, max: 10 })} kg`,
        },
      },
      rating: faker.number.float({ min: 1, max: 5, multipleOf: 0.1 }),
      reviews: [],
      isActive: faker.datatype.boolean(),
      tags: faker.helpers.arrayElements(
        ["Eco-Friendly", "Limited Edition", "Popular", "Trending"],
        faker.number.int({ min: 1, max: 3 })
      ),
      specs: {
        processor: faker.helpers.arrayElement([
          "Intel i5",
          "Intel i7",
          "AMD Ryzen 5",
          "AMD Ryzen 7",
        ]),
        ram: `${faker.number.int({ min: 4, max: 64 })}GB`,
      },
      brand: faker.company.name(),
      sku: faker.string.alphanumeric(10),
      upc: faker.string.alphanumeric(12),
      material: faker.commerce.productMaterial(),
      weight: faker.number.float({ min: 1, max: 10, multipleOf: 0.1 }),
      dimensions: {
        length: faker.number.float({ min: 10, max: 100, multipleOf: 0.1 }),
        width: faker.number.float({ min: 10, max: 100, multipleOf: 0.1 }),
        height: faker.number.float({ min: 10, max: 100, multipleOf: 0.1 }),
      },
    };
  });

  const createdProducts = await ProductModel.insertMany(products);
  return createdProducts;
};
