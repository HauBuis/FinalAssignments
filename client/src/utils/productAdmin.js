import { PRODUCT_CATEGORIES } from "./categories";

export const EMPTY_PRODUCT_FORM = {
  name: "",
  price: "",
  description: "",
  category: "",
  stock: "",
  tags: "",
  events: "",
  imageFile: null,
};

export function createEmptyProductForm() {
  return { ...EMPTY_PRODUCT_FORM };
}

export function toCommaSeparatedText(items) {
  return (Array.isArray(items) ? items : []).join(", ");
}

export function toCommaSeparatedValue(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .join(",");
}

export function findCategoryByValue(categoryValue) {
  return (
    PRODUCT_CATEGORIES.find((item) => item.value === categoryValue) || null
  );
}

export function mapProductToForm(product) {
  return {
    name: product?.name || "",
    price: product?.price || "",
    description: product?.description || "",
    category: product?.type?.id || "",
    stock: product?.stock || "",
    tags: toCommaSeparatedText(product?.tags),
    events: toCommaSeparatedText(product?.events),
    imageFile: null,
  };
}

export function validateProductForm(formData) {
  if (!formData.name.trim() || formData.price === "") {
    return "Vui lòng nhập tên và giá.";
  }

  if (Number.isNaN(Number(formData.price)) || Number(formData.price) <= 1000) {
    return "Giá sản phẩm phải lớn hơn 1.000.";
  }

  if (formData.stock === "") {
    return "Vui lòng nhập tồn kho.";
  }

  if (Number.isNaN(Number(formData.stock)) || Number(formData.stock) < 0) {
    return "Tồn kho không được nhỏ hơn 0.";
  }

  if (!formData.category) {
    return "Vui lòng chọn loại sản phẩm.";
  }

  return "";
}

export function buildProductRequestData(formData) {
  const selectedCategory = findCategoryByValue(formData.category);
  const requestData = new FormData();

  requestData.append("name", formData.name);
  requestData.append("price", formData.price);
  requestData.append("description", formData.description);
  requestData.append("stock", formData.stock);
  requestData.append("tags", toCommaSeparatedValue(formData.tags));
  requestData.append("events", toCommaSeparatedValue(formData.events));
  requestData.append(
    "type",
    JSON.stringify({
      id: formData.category,
      name: selectedCategory ? selectedCategory.label : "",
    })
  );

  if (formData.imageFile) {
    requestData.append("imageFile", formData.imageFile);
  }

  return requestData;
}
