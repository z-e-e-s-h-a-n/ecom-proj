export const findAndPopulate = async (model: any, userId: string) => {
  return model.findOne({ userId }).populate("items.productId");
};
