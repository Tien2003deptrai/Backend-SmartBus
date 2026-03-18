# Flow API Ticket (Postman)

## 1) Tạo ticket
- Method: `POST`
- URL: `http://localhost:3000/api/tickets/create`
- Headers:
  - `Content-Type: application/json`
  - `Authorization: Bearer <ACCESS_TOKEN>`

## 2) Body JSON mẫu (Success)
```json
{
  "routeId": "67d7f6f2962c8c8a9b9f1111",
  "routeName": "Bến xe Miền Đông - Suối Tiên",
  "startStopName": "Bến xe Miền Đông",
  "endStopName": "Khu Công nghệ cao",
  "ticketType": "single",
  "departureDate": "2026-03-19",
  "departureTime": "08:30",
  "seatQuantity": 1,
  "customerName": "Nguyễn Văn A",
  "customerPhone": "0901234567",
  "paymentMethodId": "67d7f6f2962c8c8a9b9f2222",
  "price": 7000
}
```

Lưu ý:
- `routeId` phải tồn tại trong DB.
- `paymentMethodId` phải là phương thức thanh toán của chính user đang đăng nhập.
- `ticketType` chỉ nhận: `single`, `monthlySingleRoute`, `monthlyInterRoute`.
- `departureTime` định dạng `HH:mm`.

## 3) Response mẫu khi thành công (201)
```json
{
  "success": true,
  "message": "Tạo vé thành công",
  "data": {
    "_id": "67d7f8f1962c8c8a9b9f3333",
    "user": "67d7f0f1962c8c8a9b9f0001",
    "routeId": "67d7f6f2962c8c8a9b9f1111",
    "routeName": "Bến xe Miền Đông - Suối Tiên",
    "startStopName": "Bến xe Miền Đông",
    "endStopName": "Khu Công nghệ cao",
    "ticketType": "single",
    "departureDate": "2026-03-18T17:00:00.000Z",
    "departureTime": "08:30",
    "seatQuantity": 1,
    "customerName": "Nguyễn Văn A",
    "customerPhone": "0901234567",
    "paymentMethodId": "67d7f6f2962c8c8a9b9f2222",
    "price": 7000,
    "qrCode": "TICKET-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "qrCodeImage": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
    "status": "pending",
    "purchaseDate": null,
    "issueDate": null,
    "expiryDate": null,
    "usedAt": null,
    "createdAt": "2026-03-18T10:15:13.000Z",
    "updatedAt": "2026-03-18T10:15:13.000Z",
    "__v": 0
  }
}
```

## 4) Body JSON mẫu (Validation lỗi)
```json
{
  "routeId": "abc",
  "routeName": "",
  "startStopName": "",
  "endStopName": "",
  "ticketType": "week",
  "departureDate": "2026/03/19",
  "departureTime": "8h30",
  "seatQuantity": 0,
  "customerName": "",
  "customerPhone": "",
  "paymentMethodId": "xyz",
  "price": -1
}
```

Response mong đợi: `400` với mảng `errors`.

## 5) Body JSON mẫu (Business lỗi)
- Dùng `routeId` không tồn tại, hoặc `paymentMethodId` không thuộc user đăng nhập.
- Response mong đợi: `400` với message tiếng Việt có dấu.

## 6) Quét/kiểm tra QR ticket
- Method: `POST`
- URL: `http://localhost:3000/api/tickets/verify-scanned-qr`
- Headers:
  - `Content-Type: application/json`
  - `Authorization: Bearer <ACCESS_TOKEN>`

### Body JSON mẫu (Success)
```json
{
  "qrCode": "TICKET-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
}
```

### Body JSON mẫu (Validation lỗi)
```json
{
  "qrCode": ""
}
```

Response mong đợi:
- `200`: trả về `isValid`, `reason`, `ticket`, `scanLogId`.
- `400`: lỗi validate khi thiếu/sai `qrCode`.
