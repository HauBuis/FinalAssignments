# Project Code Guide

## Sơ đồ tổng quát

```text
Người dùng
   |
   v
client/src/pages + client/src/components
   |
   v
fetch API -> http://localhost:5000
   |
   v
server/server.js
   |
   v
MongoDB (qua model trong server/db/products.js)
   |
   v
server trả JSON về client
   |
   v
client render giao diện
```

---

## Cấu trúc ngắn gọn

```text
client
├─ public
└─ src
   ├─ components
   │  ├─ productShared.js
   │  ├─ productAdminShared.js
   │  ├─ AddProductAdmin.jsx
   │  ├─ UpdateProductAdmin.jsx
   │  ├─ DeleteProductAdmin.jsx
   │  ├─ ImportProductsAdmin.jsx
   │  ├─ ProductList.jsx
   │  ├─ ProductCard.jsx
   │  └─ ProductDetail.jsx
   ├─ pages
   │  ├─ Admin.jsx
   │  ├─ Products.jsx
   │  └─ Home.jsx
   └─ App.js

server
├─ db
│  ├─ connection.js
│  └─ products.js
├─ public
│  └─ images
└─ server.js
```

---

## Luồng chính

### 1. Xem danh sách sản phẩm

```text
Products.jsx
   -> fetch GET /products
   -> server.js
   -> Product.find(...)
   -> trả danh sách sản phẩm
   -> ProductList.jsx render
```

### 2. Xem chi tiết sản phẩm

```text
ProductDetail.jsx
   -> lấy id từ URL
   -> fetch GET /products/:id
   -> server.js
   -> Product.findById(...)
   -> trả 1 sản phẩm
   -> hiển thị ảnh, giá, tồn kho, loại, tags
```

### 3. Thêm sản phẩm

```text
AddProductAdmin.jsx
   -> validateProductForm()
   -> buildProductRequestData()
   -> fetch POST /api/products
   -> server.js
   -> Product.create(...)
   -> lưu MongoDB
   -> trả sản phẩm mới
```

### 4. Cập nhật sản phẩm

```text
UpdateProductAdmin.jsx
   -> chọn sản phẩm từ bảng
   -> mapProductToForm()
   -> sửa form
   -> fetch PUT /api/products/:id
   -> server.js
   -> Product.findByIdAndUpdate(...)
   -> trả sản phẩm đã cập nhật
```

### 5. Xóa sản phẩm

```text
DeleteProductAdmin.jsx
   -> confirm
   -> fetch DELETE /api/products/:id
   -> server.js
   -> Product.findByIdAndDelete(...)
```

### 6. Import sản phẩm

```text
ImportProductsAdmin.jsx
   -> đọc file Excel/CSV bằng xlsx
   -> validate từng dòng
   -> fetch POST /api/products cho từng dòng
   -> server.js lưu từng sản phẩm
   -> báo số dòng thành công / thất bại
```

---

## Vai trò file chính

### Client

- `productShared.js`
  chứa hằng số và helper chung như `API_BASE_URL`, `getProductId`, `getCategoryLabel`

- `productAdminShared.js`
  chứa logic form admin như tạo form rỗng, validate, build `FormData`

- `Admin.jsx`
  trang quản trị, điều hướng giữa thêm, sửa, xóa, import

- `Products.jsx`
  trang danh sách sản phẩm

- `ProductDetail.jsx`
  trang chi tiết sản phẩm

### Server

- `server.js`
  file backend chính, chứa route API, upload ảnh, kết nối MongoDB

- `db/products.js`
  schema/model sản phẩm

- `db/connection.js`
  helper kết nối MongoDB

---

## Giải thích code

### `client/src/components/productShared.js`

```text
Mục đích:
- chứa phần dùng chung cho nhiều component sản phẩm

Code chính:
- API_BASE_URL: địa chỉ backend
- DEFAULT_PRODUCT_IMAGE: ảnh mặc định nếu sản phẩm chưa có ảnh
- PRODUCT_CATEGORIES: danh sách 2 loại sản phẩm chuẩn
- getImageUrl(): ghép đường dẫn ảnh với backend
- getProductId(): lấy _id hoặc id của sản phẩm
- getCategoryLabel(): đổi id loại thành tên hiển thị
```

### `client/src/components/productAdminShared.js`

```text
Mục đích:
- gom logic dùng chung cho form thêm và cập nhật sản phẩm

Code chính:
- EMPTY_PRODUCT_FORM: form rỗng ban đầu
- createEmptyProductForm(): tạo state form mới
- toCommaSeparatedText(): đổi mảng thành chuỗi để đổ lên input
- toCommaSeparatedValue(): chuẩn hóa input tags/events trước khi gửi server
- mapProductToForm(): lấy dữ liệu product và đổ vào form update
- validateProductForm(): kiểm tra dữ liệu trước khi submit
- buildProductRequestData(): tạo FormData để gửi API
```

### `client/src/components/AddProductAdmin.jsx`

```text
Mục đích:
- thêm sản phẩm mới

Luồng code:
1. lưu dữ liệu nhập vào state formData
2. validate bằng validateProductForm()
3. build FormData bằng buildProductRequestData()
4. gọi POST /api/products
5. nếu thành công thì reset form và chuyển sang trang chi tiết
```

### `client/src/components/UpdateProductAdmin.jsx`

```text
Mục đích:
- cập nhật sản phẩm đã có

Luồng code:
1. chọn 1 sản phẩm từ bảng
2. map dữ liệu sang form bằng mapProductToForm()
3. người dùng sửa dữ liệu
4. submit lên PUT /api/products/:id
5. cập nhật xong thì điều hướng sang trang chi tiết
```

### `client/src/components/ImportProductsAdmin.jsx`

```text
Mục đích:
- import nhiều sản phẩm từ file Excel/CSV

Code chính:
- parseWorkbookRows(): đọc file bằng xlsx
- normalizeHeader(): chuẩn hóa tên cột
- resolveCategory(): ép type về đúng 2 loại chuẩn
- mapRowToProduct(): đổi từng dòng Excel thành object product
- handleImportProducts(): gửi từng dòng hợp lệ lên server

Rule:
- price > 1000
- stock >= 0
- stock là số nguyên
- type phải là Bánh ngọt hoặc Kẹo ngọt
```

### `client/src/pages/Products.jsx`

```text
Mục đích:
- hiển thị danh sách sản phẩm cho người dùng

Code chính:
- đọc query trên URL
- gọi GET /products
- hỗ trợ tìm theo từ khóa, khoảng giá, category
- tạo tiêu đề phù hợp với trạng thái lọc hiện tại
```

### `client/src/components/ProductDetail.jsx`

```text
Mục đích:
- hiển thị 1 sản phẩm cụ thể

Code chính:
- lấy productId từ URL
- gọi GET /products/:id
- hiển thị ảnh, giá, tồn kho, mô tả
- loại sản phẩm hiển thị qua getCategoryLabel()
- phần "Phù hợp cho" lấy từ tags
```

### `server/db/products.js`

```text
Mục đích:
- định nghĩa schema MongoDB cho sản phẩm

Field chính:
- id: mã sản phẩm kiểu SP001
- name: tên sản phẩm
- description: mô tả
- price: giá
- image: ảnh
- stock: tồn kho
- type: loại sản phẩm { id, name }
- tags: tag
- events: sự kiện
```

### `server/server.js`

```text
Mục đích:
- file backend chính

Code chính:
- khởi tạo express
- bật cors, json, static file
- kết nối MongoDB
- upload ảnh bằng multer
- định nghĩa toàn bộ route sản phẩm

Route chính:
- GET /products
- GET /products/:id
- GET /products/search/keyword
- GET /api/products
- POST /api/products
- PUT /api/products/:id
- DELETE /api/products/:id
```

### `server/db/connection.js`

```text
Mục đích:
- helper kết nối MongoDB riêng

Lưu ý:
- hiện file này có tồn tại
- nhưng logic kết nối chính đang viết trực tiếp trong server.js
```

---

## Rule quan trọng

```text
Loại sản phẩm:
- Bánh ngọt
- Kẹo ngọt

Giá:
- phải > 1.000

Tồn kho:
- phải >= 0

Phù hợp cho:
- hiện lấy từ tags
```

---

## Nên đọc theo thứ tự

```text
1. client/src/components/productShared.js
2. client/src/components/productAdminShared.js
3. client/src/pages/Admin.jsx
4. client/src/components/AddProductAdmin.jsx
5. client/src/components/UpdateProductAdmin.jsx
6. client/src/components/ImportProductsAdmin.jsx
7. client/src/pages/Products.jsx
8. client/src/components/ProductDetail.jsx
9. server/db/products.js
10. server/server.js
```
