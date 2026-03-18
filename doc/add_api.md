const mongoose = require("mongoose");

const stopSchema = new mongoose.Schema(
  {
    stopId: { type: String, required: true },
    name: { type: String, required: true },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point"
      },
      coordinates: {
        type: [Number], // [lng, lat]
        required: true
      }
    },
    times: [{ type: String }]
  },
  { _id: false }
);

const routeSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true }, // Route_16
    name: { type: String, required: true },
    description: { type: String },
    isHot: { type: Boolean, default: false },
    turnOnDay: { type: Number, default: 0 },
    startName: { type: String },
    endName: { type: String },
    stopsCount: { type: Number, default: 0 },
    stops: [stopSchema]
    userId: ObjectId
  },
  {
    timestamps: true
  }
);

routeSchema.index({ "stops.location": "2dsphere" });

<!-- getListRoute page, limit, search, sort, userId -->
<!-- thêm, sửa, xoá -->

module.exports = mongoose.model("Route", routeSchema);


<!-- data mẫu -->

{
  code: "Route_16",
  name: "Tuyến 16",
  description: "Đi qua 171 Nguyễn Văn Cừ; Công ty Xi măng Ngũ Hành Sơn; 957 Nguyễn Lương Bằng; Đối diện 546 Nguyễn Lương Bằng; 421 Nguyễn Lương Bằng; Bệnh viện tâm thần; 27 Nguyễn Lương Bằng; 573 Tôn Đức Thắng; Đối diện 422A (Công ty Mazda) Tôn Đức Thắng; 341 Tôn Đức Thắng; Công ty cổ phần xe khách và dịch vụ thương mại Đà Nẵng; 559 Điện Biên Phủ; 311 Điện Biên Phủ; Công viên 29/3; 85 Lý Thái Tổ; 335 Hùng Vương; 103 Hùng Vương; Đối diện 155 Trần Phú; 270 Trần Phú; Chân cầu Rồng 2 Võ Văn Kiệt; Trung tâm y tế khu vực Sơn Trà; 178 Ngũ Hành Sơn; 376 Ngũ Hành Sơn; 158 Lê Văn Hiến; 376 Lê Văn Hiến; 542 Lê Văn Hiến; Cây cảnh Ebisu; 316 Trần Đại Nghĩa; Bến xe buýt Đại học Việt Hàn",
  isHot: false,
  turnOnDay: 3,
  startName: "Kim Liên",
  endName: "Đại học Việt Hàn",
  stopsCount: 2,
  userId: "11112222BBaaa"
  stops: [
    {
      stopId: "1601",
      name: "171 Nguyễn Văn Cừ",
      location: {
        type: "Point",
        coordinates: [108.11955821710077, 16.135488824421348]
      },
      times: ["06:00", "10:07", "14:06"]
    },
    {
      stopId: "1602",
      name: "Điểm 1602",
      location: {
        type: "Point",
        coordinates: [108.12, 16.14]
      },
      times: ["06:05", "10:12", "14:11"]
    }
  ]
}


<!-- báo cáo sự cố tuyến -->
const mongoose = require("mongoose");

const routeReportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    routeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Route",
      required: true
    },
    type: {
      type: String,
      enum: ["issue", "suggestion", "complaint", "other"],
      default: "issue"
    },
    content: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      default: "N/A"
    },
    status: {
      type: String,
      enum: ["new", "in_progress", "resolved", "rejected"],
      default: "new"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Feedback", feedbackSchema);

<!-- getListRouteReport page, limit, search, sort, userId, status, type  -->
<!-- thêm, sửa, xoá -->

<!-- Quan trọng cần đọc: hiện tại chức năng này theo tôi định nghĩa ra flow, bạn xem chức năng cần cải thiện thì hãy viết thêm flow trước khi code để tôi review -->

---

## Test cases API (Postman)

**Base URL:** `http://localhost:<PORT>/api`  
**Header (API cần auth):** `Authorization` = `Bearer <token>`  
**Body:** chọn **raw** → **JSON**, dán nội dung trong từng block dưới đây.

---

### 1. Route API

#### 1.1 Tạo tuyến – POST /routes

**TC-R1 – Tạo tuyến thành công**  
Kỳ vọng: 201, `success: true`, có `route` với `code`, `name`, `stopsCount`.

```json
{
  "code": "Route_16",
  "name": "Tuyến 16",
  "description": "Đi qua 171 Nguyễn Văn Cừ; Bến xe buýt Đại học Việt Hàn",
  "isHot": false,
  "turnOnDay": 3,
  "startName": "Kim Liên",
  "endName": "Đại học Việt Hàn",
  "stops": [
    {
      "stopId": "1601",
      "name": "171 Nguyễn Văn Cừ",
      "location": {
        "type": "Point",
        "coordinates": [108.11955821710077, 16.135488824421348]
      },
      "times": ["06:00", "10:07", "14:06"]
    },
    {
      "stopId": "1602",
      "name": "Điểm 1602",
      "location": {
        "type": "Point",
        "coordinates": [108.12, 16.14]
      },
      "times": ["06:05", "10:12", "14:11"]
    }
  ]
}
```

**TC-R2 – Thiếu code**  
Kỳ vọng: 400, `errors` chứa "Mã tuyến không được để trống".

```json
{
  "name": "Tuyến 16",
  "startName": "Kim Liên",
  "endName": "Đại học Việt Hàn"
}
```

**TC-R3 – Thiếu name**  
Kỳ vọng: 400, `errors` chứa "Tên tuyến không được để trống".

```json
{
  "code": "Route_16",
  "startName": "Kim Liên",
  "endName": "Đại học Việt Hàn"
}
```

**TC-R4 – Không có token**  
Dùng body TC-R1, nhưng trong Postman bỏ header `Authorization`.  
Kỳ vọng: 401 (hoặc 400 tùy middleware).

**TC-R5 – Code trùng**  
Dùng body giống TC-R1 với `code` đã tồn tại trong DB.  
Kỳ vọng: 400, lỗi duplicate.

---

#### 1.2 Sửa tuyến – PUT /routes/:id

URL: `PUT {{baseUrl}}/routes/{{routeId}}` (thay `{{routeId}}` bằng _id tuyến thật).

**TC-R6 – Sửa tuyến thành công**  
Kỳ vọng: 200, `success: true`, `route.name` đã đổi.

```json
{
  "name": "Tuyến 16 (cập nhật)",
  "startName": "Kim Liên",
  "endName": "Đại học Việt Hàn"
}
```

**TC-R7 – id không hợp lệ**  
URL: `PUT {{baseUrl}}/routes/abc123` (không phải MongoId).  
Không cần body. Kỳ vọng: 400, `errors` ID không hợp lệ.

**TC-R8 – Không quyền sửa**  
URL dùng _id tuyến của user khác. Body giống TC-R6.  
Kỳ vọng: 400, "Tuyến không tồn tại hoặc không có quyền sửa".

---

#### 1.3 Xóa tuyến – DELETE /routes/:id

**TC-R9 – Xóa thành công**  
URL: `DELETE {{baseUrl}}/routes/{{routeId}}`. Không body.  
Kỳ vọng: 200, `success: true`, message "Đã xóa tuyến".

**TC-R10 – id không hợp lệ**  
URL: `DELETE {{baseUrl}}/routes/invalid`.  
Kỳ vọng: 400, `errors` ID không hợp lệ.

**TC-R11 – Không quyền xóa**  
URL dùng _id tuyến của user khác.  
Kỳ vọng: 400, "Tuyến không tồn tại hoặc không có quyền xóa".

---

#### 1.4 Danh sách tuyến – POST /routes/listRoutes

**TC-R12 – Lấy danh sách mặc định**  
Kỳ vọng: 200, `success: true`, `routes` (mảng), `pagination` (page, limit, total, totalPages).

```json
{}
```

**TC-R13 – Phân trang**  
Kỳ vọng: 200, tối đa 5 phần tử, `pagination.page` = 2.

```json
{
  "page": 2,
  "limit": 5
}
```

**TC-R14 – Tìm kiếm**  
Kỳ vọng: 200, các tuyến có name/code/startName/endName/description chứa "Kim Liên".

```json
{
  "search": "Kim Liên"
}
```

**TC-R15 – Sắp xếp**  
Kỳ vọng: 200, routes theo createdAt tăng dần. Dùng `"sort": "newest"` thì giảm dần.

```json
{
  "sort": "oldest"
}
```

**TC-R16 – Lọc theo userId**  
Thay `{{userId}}` bằng MongoId user. Kỳ vọng: 200, chỉ tuyến của user đó.

```json
{
  "userId": "{{userId}}"
}
```

**TC-R17 – Tham số không hợp lệ**  
Kỳ vọng: 400, `errors` (page >= 1, limit 1–100).

```json
{
  "page": 0,
  "limit": 200
}
```

---

#### 1.5 Chi tiết tuyến – GET /routes/:id

**TC-R18 – Lấy chi tiết thành công**  
URL: `GET {{baseUrl}}/routes/{{routeId}}`. Không body.  
Kỳ vọng: 200, `success: true`, `route` đầy đủ (code, name, stops, userId populated).

**TC-R19 – id không hợp lệ**  
URL: `GET {{baseUrl}}/routes/abc`.  
Kỳ vọng: 400, `errors` ID không hợp lệ.

**TC-R20 – Tuyến không tồn tại**  
URL: `GET {{baseUrl}}/routes/507f1f77bcf86cd799439011` (MongoId đúng format nhưng không có trong DB).  
Kỳ vọng: 404, "Tuyến không tồn tại".

---

### 2. Route Report API (Báo cáo sự cố tuyến)

#### 2.1 Tạo báo cáo – POST /route-reports

**TC-RP1 – Tạo báo cáo thành công**  
Thay `{{routeId}}` bằng _id tuyến có sẵn. Kỳ vọng: 201, `success: true`, `report` có routeId, content, status "new".

```json
{
  "routeId": "{{routeId}}",
  "type": "issue",
  "content": "Xe đến trễ liên tục",
  "phone": "0900123456"
}
```

**TC-RP2 – Thiếu routeId**  
Kỳ vọng: 400, `errors` routeId không hợp lệ.

```json
{
  "content": "Nội dung báo cáo",
  "type": "issue"
}
```

**TC-RP3 – Thiếu content**  
Thay `{{routeId}}` bằng _id tuyến. Kỳ vọng: 400, "Nội dung không được để trống".

```json
{
  "routeId": "{{routeId}}"
}
```

**TC-RP4 – type không hợp lệ**  
Kỳ vọng: 400, `errors` type phải là issue/suggestion/complaint/other.

```json
{
  "routeId": "{{routeId}}",
  "content": "Nội dung OK",
  "type": "invalid"
}
```

**TC-RP5 – Không có token**  
Dùng body TC-RP1, bỏ header `Authorization`.  
Kỳ vọng: 401 (hoặc 400).

---

#### 2.2 Sửa báo cáo – PUT /route-reports/:id

URL: `PUT {{baseUrl}}/route-reports/{{reportId}}`.

**TC-RP6 – Sửa nội dung thành công**  
Kỳ vọng: 200, `success: true`, `report.content` đã đổi.

```json
{
  "content": "Nội dung đã cập nhật"
}
```

**TC-RP7 – Cập nhật status**  
Kỳ vọng: 200, `report.status` = "resolved" (nếu backend cho phép user đổi status).

```json
{
  "status": "resolved"
}
```

**TC-RP8 – id không hợp lệ**  
URL: `PUT {{baseUrl}}/route-reports/xyz`.  
Kỳ vọng: 400, `errors` ID không hợp lệ.

**TC-RP9 – Không quyền sửa**  
URL dùng _id báo cáo của user khác. Body giống TC-RP6.  
Kỳ vọng: 400, "Báo cáo không tồn tại hoặc không có quyền sửa".

---

#### 2.3 Xóa báo cáo – DELETE /route-reports/:id

**TC-RP10 – Xóa thành công**  
URL: `DELETE {{baseUrl}}/route-reports/{{reportId}}`. Không body.  
Kỳ vọng: 200, `success: true`, "Đã xóa báo cáo".

**TC-RP11 – id không hợp lệ**  
URL: `DELETE {{baseUrl}}/route-reports/invalid`.  
Kỳ vọng: 400, `errors` ID không hợp lệ.

**TC-RP12 – Không quyền xóa**  
URL dùng _id báo cáo của user khác.  
Kỳ vọng: 400, "Báo cáo không tồn tại hoặc không có quyền xóa".

---

#### 2.4 Danh sách báo cáo – POST /route-reports/listRouteReports

**TC-RP13 – Lấy danh sách mặc định**  
Kỳ vọng: 200, `success: true`, `reports` (mảng), `pagination`.

```json
{}
```

**TC-RP14 – Phân trang**  
Kỳ vọng: 200, tối đa 10 báo cáo, pagination đúng.

```json
{
  "page": 1,
  "limit": 10
}
```

**TC-RP15 – Lọc theo userId**  
Thay `{{userId}}` bằng MongoId. Kỳ vọng: 200, chỉ báo cáo của user đó.

```json
{
  "userId": "{{userId}}"
}
```

**TC-RP16 – Lọc theo status**  
Kỳ vọng: 200, chỉ báo cáo status "new".

```json
{
  "status": "new"
}
```

**TC-RP17 – Lọc theo type**  
Kỳ vọng: 200, chỉ báo cáo type "complaint".

```json
{
  "type": "complaint"
}
```

**TC-RP18 – Tìm kiếm**  
Kỳ vọng: 200, báo cáo có content/phone chứa "trễ".

```json
{
  "search": "trễ"
}
```

**TC-RP19 – Sắp xếp**  
Kỳ vọng: 200, reports theo createdAt tăng dần.

```json
{
  "sort": "oldest"
}
```

**TC-RP20 – Tham số không hợp lệ**  
Kỳ vọng: 400, `errors` (status/type không hợp lệ).

```json
{
  "status": "invalid",
  "type": "invalid"
}
```

---

#### 2.5 Chi tiết báo cáo – GET /route-reports/:id

**TC-RP21 – Lấy chi tiết thành công**  
URL: `GET {{baseUrl}}/route-reports/{{reportId}}`. Cần auth. Không body.  
Kỳ vọng: 200, `success: true`, `report` đầy đủ (userId, routeId populated).

**TC-RP22 – id không hợp lệ**  
URL: `GET {{baseUrl}}/route-reports/abc`.  
Kỳ vọng: 400, `errors` ID không hợp lệ.

**TC-RP23 – Báo cáo không tồn tại**  
URL dùng MongoId đúng format nhưng không có trong DB.  
Kỳ vọng: 404, "Báo cáo không tồn tại".

---

### Postman: biến môi trường gợi ý

| Biến | Ví dụ | Ghi chú |
|------|--------|--------|
| `baseUrl` | `http://localhost:3000/api` | Base URL API |
| `token` | (giá trị sau khi login) | Dùng trong Authorization: Bearer {{token}} |
| `routeId` | (_id tuyến tạo từ TC-R1) | Cho route-reports và PUT/DELETE route |
| `reportId` | (_id báo cáo tạo từ TC-RP1) | Cho PUT/DELETE/GET route-reports |
| `userId` | (MongoId user) | Cho listRoutes, listRouteReports lọc theo user |
