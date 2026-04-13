export function getProductId(product) {
  return product?._id || product?.id || "";
}
