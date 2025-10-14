import { Prisma } from "@prisma/client";

const hasDeletedAt = (model: string) => {
  const dmmf = Prisma.dmmf.datamodel.models;
  const m = dmmf.find((m) => m.name === model);
  const hasField = !!m?.fields.find((f) => f.name === "deletedAt");
  console.log(`[hasDeletedAt] Model: ${model} => ${hasField}`);
  return hasField;
};

export const softDeleteExtension = Prisma.defineExtension({
  name: "softDelete",

  model: {
    $allModels: {
      async delete(this, args) {
        const model = (this as any).name;
        const force = (args as any).force;

        console.log(`🧱 [delete] Model: ${model}, Args:`, args);

        if (hasDeletedAt(model) && !force) {
          console.log(`[delete] Soft deleting ${model} where:`, args.where);
          return (Prisma.getExtensionContext(this) as any).update({
            where: args.where,
            data: { deletedAt: new Date() },
          });
        }

        console.log(`[delete] Hard deleting ${model}`);
        return (Prisma.getExtensionContext(this) as any).delete(args);
      },

      async deleteMany(this, args) {
        const model = (this as any).name;
        const force = (args as any).force;

        console.log(`🧱 [deleteMany] Model: ${model}, Args:`, args);

        if (hasDeletedAt(model) && !force) {
          console.log(`[deleteMany] Soft deleting ${model} records`);
          return (Prisma.getExtensionContext(this) as any).updateMany({
            where: args.where,
            data: { deletedAt: new Date() },
          });
        }

        console.log(`[deleteMany] Hard deleting ${model}`);
        return (Prisma.getExtensionContext(this) as any).deleteMany(args);
      },
    },
  },

  query: {
    $allModels: {
      async $allOperations({ model, operation, args, query }) {
        console.log(`🔍 [query] ${model}.${operation}`, args);

        const _args = args as Record<string, any>;

        const hasDel = hasDeletedAt(model);
        const targetOps = [
          "findUnique",
          "findFirst",
          "findMany",
          "count",
          "aggregate",
        ];
        if (!targetOps.includes(operation) || !hasDel) return query(args);

        if (_args.includeDeleted) {
          console.log(`[query] ${model}.${operation} => includeDeleted=true`);
          delete _args.includeDeleted;
          return query(_args);
        }

        // Ensure where always exists
        _args.where = _args.where ?? {};

        if (!("deletedAt" in _args.where)) {
          console.log(`[query] ${model}.${operation} => adding deletedAt:null`);
          _args.where = { ..._args.where, deletedAt: null };
        }

        return query(_args);
      },
    },
  },
});
