# Body API – Thêm / Sửa Route và Stop

Dùng **Body** → **raw** → **JSON** (Postman hoặc client).  
Các API thêm/sửa Route và Stop đều cần **Authorization: Bearer &lt;token&gt;** (đăng nhập).

---

## 1. Route (Tuyến)

### 1.1 Thêm tuyến – POST /api/routes/create

**Bắt buộc:** `code`, `name`  
**Tùy chọn:** `description`, `isHot`, `turnOnDay`, `startName`, `endName`, `stops` (mảng ObjectId), `staffId`

```json
{
  "code": "Route_16",
  "name": "Tuyến 16",
  "description": "Mô tả tuyến đi qua các điểm...",
  "isHot": false,
  "turnOnDay": 3,
  "startName": "Kim Liên",
  "endName": "Đại học Việt Hàn",
  "stops": [],
  "staffId": "507f1f77bcf86cd799439011"
}
```

- **stops**: mảng ObjectId của các điểm dừng (thường để `[]` khi tạo tuyến, sau đó tạo Stop rồi cập nhật tuyến với danh sách id).

---

### 1.2 Sửa tuyến – PUT /api/routes/update/:id

**Tất cả đều tùy chọn.** Chỉ gửi field cần thay đổi.  
**stops**: mảng ObjectId (chỉ chấp nhận id thuộc đúng tuyến).

```json
{
  "code": "Route_16",
  "name": "Tuyến 16 (cập nhật)",
  "description": "Mô tả mới",
  "isHot": true,
  "turnOnDay": 5,
  "startName": "Điểm đầu",
  "endName": "Điểm cuối",
  "stops": [
    "674a1b2c3d4e5f6789012345",
    "674a1b2c3d4e5f6789012346"
  ],
  "staffId": "507f1f77bcf86cd799439012"
}
```

---

## 2. Stop (Điểm dừng)

### 2.1 Thêm điểm dừng – POST /api/stops/create

**Bắt buộc:** `routeId`, `stopId`, `name`  
**Tùy chọn:** `location`, `times`, `order`

```json
{
  "routeId": "674a1b2c3d4e5f6789012340",
  "stopId": "1601",
  "name": "171 Nguyễn Văn Cừ",
  "location": {
    "type": "Point",
    "coordinates": [108.11955821710077, 16.135488824421348]
  },
  "times": ["06:00", "10:07", "14:06"],
  "order": 0
}
```

- **location.coordinates**: `[kinh_độ, vĩ_độ]` (lng, lat).  
- **times**: mảng giờ xe chạy qua điểm dừng.  
- **order**: thứ tự điểm dừng trên tuyến (số từ 0 trở lên).

---

### 2.2 Sửa điểm dừng – PUT /api/stops/update/:id

**Tất cả đều tùy chọn.** Chỉ gửi field cần thay đổi. Không gửi `routeId` (không đổi tuyến).

```json
{
  "stopId": "1601",
  "name": "171 Nguyễn Văn Cừ (đã cập nhật)",
  "location": {
    "type": "Point",
    "coordinates": [108.12, 16.14]
  },
  "times": ["06:00", "10:07", "14:06", "18:00"],
  "order": 1
}
```

---

## Tóm tắt field

| Chức năng | Bắt buộc | Ghi chú |
|-----------|----------|--------|
| **Route – thêm** | `code`, `name` | `stops` = mảng ObjectId hoặc `[]` |
| **Route – sửa** | — | Gửi field cần sửa; `stops` = mảng ObjectId thuộc tuyến |
| **Stop – thêm** | `routeId`, `stopId`, `name` | `location` = GeoJSON Point, `times` = mảng string |
| **Stop – sửa** | — | Không sửa `routeId` qua API này |
