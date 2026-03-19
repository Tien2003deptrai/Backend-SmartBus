# Flow API Báo Cáo Ca Làm Việc (Đề xuất)

## 1) Mục tiêu
- Nhân viên kết thúc ca và gửi báo cáo ca lên Admin.
- Báo cáo ca có 2 số chính: `totalScans`, `totalRevenue`.
- Dữ liệu thống kê nên được tính từ `ScanLog` theo chính nhân viên và khoảng thời gian ca.

---

## 2) Quy ước nghiệp vụ
- Một ca có `shiftStartAt`, `shiftEndAt`.
- Chỉ tính doanh thu từ lượt quét hợp lệ (`isValid = true`) và có vé tương ứng.
- Mỗi lượt quét hợp lệ cộng `ticket.price` vào doanh thu.
- Báo cáo sau khi gửi có trạng thái ban đầu: `submitted`.
- Admin có thể `approved` hoặc `rejected`.

Gợi ý trạng thái báo cáo ca:
- `submitted`: nhân viên vừa gửi.
- `approved`: admin duyệt.
- `rejected`: admin từ chối.

---

## 3) API đề xuất

### 3.1 Xem thống kê ca trước khi gửi
- Method: `POST`
- URL: `http://localhost:3000/api/shift-reports/preview`
- Auth: `Bearer <ACCESS_TOKEN>` (staff)

Body JSON mẫu:
```json
{
  "shiftStartAt": "2026-03-19T06:00:00.000Z",
  "shiftEndAt": "2026-03-19T10:00:00.000Z"
}
```

Response thành công (`200`):
```json
{
  "success": true,
  "data": {
    "shiftStartAt": "2026-03-19T06:00:00.000Z",
    "shiftEndAt": "2026-03-19T10:00:00.000Z",
    "totalScans": 124,
    "successfulScans": 101,
    "failedScans": 23,
    "totalRevenue": 707000
  }
}
```

Validation lỗi (`400`) ví dụ:
- Thiếu `shiftStartAt`, `shiftEndAt`.
- `shiftStartAt >= shiftEndAt`.

---

### 3.2 Nhân viên gửi báo cáo ca
- Method: `POST`
- URL: `http://localhost:3000/api/shift-reports/submit`
- Auth: `Bearer <ACCESS_TOKEN>` (staff)

Body JSON mẫu:
```json
{
  "shiftStartAt": "2026-03-19T06:00:00.000Z",
  "shiftEndAt": "2026-03-19T10:00:00.000Z",
  "note": "Ca sáng cổng số 2"
}
```

Luồng xử lý đề xuất:
1. Backend tự tính lại thống kê từ `ScanLog` theo `req.user._id` + khoảng ca.
2. Lưu bản ghi `ShiftReport` gồm snapshot số liệu.
3. Trả kết quả đã lưu cho client.

Response thành công (`201`):
```json
{
  "success": true,
  "message": "Gửi báo cáo ca thành công",
  "data": {
    "_id": "SR-69bc00112233445566778899",
    "staffId": "69bb5f7a1d7056d088a11da0",
    "shiftStartAt": "2026-03-19T06:00:00.000Z",
    "shiftEndAt": "2026-03-19T10:00:00.000Z",
    "totalScans": 124,
    "successfulScans": 101,
    "failedScans": 23,
    "totalRevenue": 707000,
    "note": "Ca sáng cổng số 2",
    "status": "submitted",
    "reviewedBy": null,
    "reviewNote": "",
    "reviewedAt": null,
    "createdAt": "2026-03-19T10:05:12.000Z"
  }
}
```

Business lỗi (`400`) ví dụ:
- Ca bị trùng thời gian với báo cáo đã gửi trước đó của cùng staff.
- Khoảng ca quá dài (ví dụ > 24h) theo rule hệ thống.

---

### 3.3 Nhân viên xem lịch sử báo cáo ca của mình
- Method: `GET`
- URL: `http://localhost:3000/api/shift-reports/my?page=1&limit=10&status=submitted`
- Auth: `Bearer <ACCESS_TOKEN>` (staff)

Response (`200`):
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "_id": "SR-69bc00112233445566778899",
        "shiftStartAt": "2026-03-19T06:00:00.000Z",
        "shiftEndAt": "2026-03-19T10:00:00.000Z",
        "totalScans": 124,
        "totalRevenue": 707000,
        "status": "submitted",
        "createdAt": "2026-03-19T10:05:12.000Z"
      }
    ],
    "page": 1,
    "limit": 10,
    "total": 1
  }
}
```

---

### 3.4 Admin xem danh sách báo cáo ca
- Method: `GET`
- URL: `http://localhost:3000/api/admin/shift-reports?page=1&limit=20&status=submitted&staffId=69bb5f7a1d7056d088a11da0`
- Auth: `Bearer <ACCESS_TOKEN>` (admin)

Response (`200`):
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "_id": "SR-69bc00112233445566778899",
        "staffId": "69bb5f7a1d7056d088a11da0",
        "staffName": "Nguyen Van B",
        "shiftStartAt": "2026-03-19T06:00:00.000Z",
        "shiftEndAt": "2026-03-19T10:00:00.000Z",
        "totalScans": 124,
        "totalRevenue": 707000,
        "status": "submitted",
        "createdAt": "2026-03-19T10:05:12.000Z"
      }
    ],
    "page": 1,
    "limit": 20,
    "total": 1
  }
}
```

---

### 3.5 Admin duyệt hoặc từ chối báo cáo ca
- Method: `PATCH`
- URL: `http://localhost:3000/api/admin/shift-reports/:reportId/review`
- Auth: `Bearer <ACCESS_TOKEN>` (admin)

Body JSON mẫu:
```json
{
  "status": "approved",
  "reviewNote": "Số liệu hợp lệ"
}
```

hoặc:
```json
{
  "status": "rejected",
  "reviewNote": "Thiếu giải trình ca gãy giữa giờ"
}
```

Response (`200`):
```json
{
  "success": true,
  "message": "Cập nhật trạng thái báo cáo ca thành công",
  "data": {
    "_id": "SR-69bc00112233445566778899",
    "status": "approved",
    "reviewNote": "Số liệu hợp lệ",
    "reviewedBy": "69aa11112222333344445555",
    "reviewedAt": "2026-03-19T10:20:00.000Z"
  }
}
```

---

## 4) Gợi ý model `ShiftReport`
```js
{
  staffId: ObjectId,          // user staff gửi ca
  shiftStartAt: Date,
  shiftEndAt: Date,
  totalScans: Number,
  successfulScans: Number,
  failedScans: Number,
  totalRevenue: Number,
  note: String,
  status: 'submitted' | 'approved' | 'rejected',
  reviewedBy: ObjectId | null,
  reviewNote: String,
  reviewedAt: Date | null
}
```

Index đề xuất:
- `{ staffId: 1, shiftStartAt: -1 }`
- `{ status: 1, createdAt: -1 }`
- Unique chống gửi trùng ca (tuỳ rule): `{ staffId: 1, shiftStartAt: 1, shiftEndAt: 1 }`

---

## 5) Lưu ý kỹ thuật quan trọng
- Khi submit, backend phải tự tính lại số liệu từ DB, không nhận `totalScans/totalRevenue` từ client.
- Dùng transaction nếu vừa ghi báo cáo vừa cập nhật entity liên quan.
- Chuẩn hóa timezone (khuyến nghị lưu UTC, frontend hiển thị local).
- Đảm bảo phân quyền:
  - Staff chỉ xem/gửi report của chính mình.
  - Admin xem và review toàn bộ.

---

## 6) Tóm tắt flow ngắn
1. Staff gọi `preview` để xem số liệu ca.
2. Staff gọi `submit` để gửi báo cáo ca.
3. Admin vào danh sách report chờ duyệt.
4. Admin `approved/rejected` và ghi chú.
5. Staff xem trạng thái xử lý ở API `my`.
