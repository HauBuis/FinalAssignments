export const API_BASE_URL = "http://localhost:5000";
export const DEFAULT_PRODUCT_IMAGE = "/images/cake1.jpg";
export const PRODUCT_CATEGORIES = [
  { value: "banh-ngot", label: "Bánh ngọt" },
  { value: "keo-ngot", label: "Kẹo ngọt" },
];
const CAKE_TYPE_IDS = new Set(["T01", "T02", "T04", "T05", "T06"]);
const CANDY_TYPE_IDS = new Set(["T03", "T07"]);

export function getImageUrl(imagePath = DEFAULT_PRODUCT_IMAGE) {
  const normalizedPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
  return `${API_BASE_URL}${normalizedPath}`;
}

export function getProductId(product) {
  return product?._id || product?.id || "";
}

export function getCategoryLabel(value) {
  if (CAKE_TYPE_IDS.has(value)) {
    return "Bánh ngọt";
  }

  if (CANDY_TYPE_IDS.has(value)) {
    return "Kẹo ngọt";
  }

  const matched = PRODUCT_CATEGORIES.find((item) => item.value === value);
  return matched ? matched.label : value;
}
