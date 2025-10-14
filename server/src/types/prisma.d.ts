import "@prisma/client";
import type { Prisma } from "@prisma/client";

// Augment the Prisma namespace
declare module "@prisma/client" {
  namespace Prisma {
    // --- Category ---
    interface CategoryDelegate<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > {
      // Query methods: add includeDeleted
      findMany<T extends Prisma.CategoryFindManyArgs<ExtArgs>>(
        args?: T & { includeDeleted?: boolean }
      ): Prisma.PrismaPromise<
        Array<Prisma.$CategoryPayload<ExtArgs>["object"]>
      >;

      findFirst<T extends Prisma.CategoryFindFirstArgs<ExtArgs>>(
        args?: T & { includeDeleted?: boolean }
      ): Prisma.PrismaPromise<
        Prisma.$CategoryPayload<ExtArgs>["object"] | null
      >;

      findUnique<T extends Prisma.CategoryFindUniqueArgs<ExtArgs>>(
        args?: T & { includeDeleted?: boolean }
      ): Prisma.PrismaPromise<
        Prisma.$CategoryPayload<ExtArgs>["object"] | null
      >;

      count<T extends Prisma.CategoryCountArgs<ExtArgs>>(
        args?: T & { includeDeleted?: boolean }
      ): Prisma.PrismaPromise<number>;

      aggregate<T extends Prisma.CategoryAggregateArgs<ExtArgs>>(
        args?: T & { includeDeleted?: boolean }
      ): Prisma.PrismaPromise<any>;

      // Delete methods: add force
      delete<T extends Prisma.CategoryDeleteArgs<ExtArgs>>(
        args: T & { force?: boolean }
      ): Prisma.PrismaPromise<Prisma.$CategoryPayload<ExtArgs>["object"]>;

      deleteMany<T extends Prisma.CategoryDeleteManyArgs<ExtArgs>>(
        args?: T & { force?: boolean }
      ): Prisma.PrismaPromise<Prisma.BatchPayload>;
    }

    // --- Product (repeat for other models if needed) ---
    interface ProductDelegate<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > {
      // Query methods: includeDeleted
      findMany<T extends Prisma.ProductFindManyArgs<ExtArgs>>(
        args?: T & { includeDeleted?: boolean }
      ): Prisma.PrismaPromise<Array<Prisma.$ProductPayload<ExtArgs>["object"]>>;

      findFirst<T extends Prisma.ProductFindFirstArgs<ExtArgs>>(
        args?: T & { includeDeleted?: boolean }
      ): Prisma.PrismaPromise<Prisma.$ProductPayload<ExtArgs>["object"] | null>;

      findUnique<T extends Prisma.ProductFindUniqueArgs<ExtArgs>>(
        args?: T & { includeDeleted?: boolean }
      ): Prisma.PrismaPromise<Prisma.$ProductPayload<ExtArgs>["object"] | null>;

      count<T extends Prisma.ProductCountArgs<ExtArgs>>(
        args?: T & { includeDeleted?: boolean }
      ): Prisma.PrismaPromise<number>;

      aggregate<T extends Prisma.ProductAggregateArgs<ExtArgs>>(
        args?: T & { includeDeleted?: boolean }
      ): Prisma.PrismaPromise<any>;

      // Delete methods: force
      delete<T extends Prisma.ProductDeleteArgs<ExtArgs>>(
        args: T & { force?: boolean }
      ): Prisma.PrismaPromise<Prisma.$ProductPayload<ExtArgs>["object"]>;

      deleteMany<T extends Prisma.ProductDeleteManyArgs<ExtArgs>>(
        args?: T & { force?: boolean }
      ): Prisma.PrismaPromise<Prisma.BatchPayload>;
    }
  }
}
