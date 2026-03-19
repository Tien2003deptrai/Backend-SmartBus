# Postman - Shift Reports

**Base URL:** `http://localhost:3000`

## Biến môi trường (Environment)
| Biến | Giá trị mẫu |
|---|---|
| baseUrl | http://localhost:3000 |
| staffToken | Bearer token của tài khoản staff |
| adminToken | Bearer token của tài khoản admin |
| reportId | ID báo cáo ca (lấy từ API submit/list) |
| staffId | ID tài khoản staff (để admin lọc) |

---

## 1) Staff preview thống kê ca
```http
POST {{baseUrl}}/api/shift-reports/preview
Authorization: Bearer {{staffToken}}
Content-Type: application/json

{
  "shiftStartAt": "2026-03-19T06:00:00.000Z",
  "shiftEndAt": "2026-03-19T10:00:00.000Z"
}
```

Kỳ vọng `200`:
- `data.totalScans`
- `data.successfulScans`
- `data.failedScans`
- `data.totalRevenue`

---

## 2) Staff submit báo cáo ca
```http
POST {{baseUrl}}/api/shift-reports/submit
Authorization: Bearer {{staffToken}}
Content-Type: application/json

{
  "shiftStartAt": "2026-03-19T06:00:00.000Z",
  "shiftEndAt": "2026-03-19T10:00:00.000Z",
  "note": "Ca sáng cổng số 2"
}
```

Kỳ vọng `201`:
- `data._id` -> lưu vào `{{reportId}}`
- `data.status = "submitted"`

---

## 3) Staff xem danh sách báo cáo của mình
```http
GET {{baseUrl}}/api/shift-reports/my?page=1&limit=10&status=submitted
Authorization: Bearer {{staffToken}}
```

Kỳ vọng `200`:
- `data.items` là mảng báo cáo
- `data.page`, `data.limit`, `data.total`

---

## 4) Admin xem danh sách báo cáo ca
```http
GET {{baseUrl}}/api/admin/shift-reports?page=1&limit=20&status=submitted&staffId={{staffId}}
Authorization: Bearer {{adminToken}}
```

Kỳ vọng `200`:
- `data.items[*].staffId`
- `data.items[*].totalScans`
- `data.items[*].totalRevenue`

---

## 5) Admin duyệt báo cáo ca
```http
PATCH {{baseUrl}}/api/admin/shift-reports/{{reportId}}/review
Authorization: Bearer {{adminToken}}
Content-Type: application/json

{
  "status": "approved",
  "reviewNote": "Số liệu hợp lệ"
}
```

Kỳ vọng `200`:
- `data.status = "approved"`
- `data.reviewedBy` có giá trị
- `data.reviewedAt` có giá trị

---

## 6) Admin từ chối báo cáo ca
```http
PATCH {{baseUrl}}/api/admin/shift-reports/{{reportId}}/review
Authorization: Bearer {{adminToken}}
Content-Type: application/json

{
  "status": "rejected",
  "reviewNote": "Thiếu giải trình"
}
```

Kỳ vọng `400` nếu report đã duyệt/từ chối trước đó.

---

## 7) Test lỗi nhanh

### 7.1 Sai thời gian ca
```http
POST {{baseUrl}}/api/shift-reports/preview
Authorization: Bearer {{staffToken}}
Content-Type: application/json

{
  "shiftStartAt": "2026-03-19T10:00:00.000Z",
  "shiftEndAt": "2026-03-19T06:00:00.000Z"
}
```
Kỳ vọng `400` với message `shiftStartAt phải nhỏ hơn shiftEndAt`.

### 7.2 Staff gọi API admin
```http
GET {{baseUrl}}/api/admin/shift-reports?page=1&limit=20
Authorization: Bearer {{staffToken}}
```
Kỳ vọng `403`.

### 7.3 Admin review với status sai
```http
PATCH {{baseUrl}}/api/admin/shift-reports/{{reportId}}/review
Authorization: Bearer {{adminToken}}
Content-Type: application/json

{
  "status": "submitted"
}
```
Kỳ vọng `400` (validation status).
