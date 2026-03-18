# API Phuong Thuc Thanh Toan (Payment Method)

**Base URL:** `http://localhost:<PORT>/api/payment-methods`  
**Auth:** Tat ca API deu can header `Authorization: Bearer <token>`

---

## Danh sach API

| Method | Endpoint | Mo ta |
|--------|----------|-------|
| POST | `/create` | Them phuong thuc thanh toan |
| PUT | `/update/:id` | Cap nhat phuong thuc thanh toan |
| GET | `/my-payment-methods` | Xem tat ca phuong thuc thanh toan cua ban than |

---

## 1. Them phuong thuc thanh toan - POST `/api/payment-methods/create`

**Headers:**
- `Content-Type: application/json`
- `Authorization: Bearer <token>`

**Body mau day du (raw JSON):**

```json
{
  "provider": "visa",
  "cardNumber": "4111111111111111",
  "expiryDate": "12/29",
  "csc": "123",
  "cardHolderName": "NGUYEN VAN A",
  "bankName": "Vietcombank",
  "cccd": "012345678901",
  "accountNumber": "1234567890",
  "phoneNumber": "0901234567",
  "email": "user@example.com"
}
```

**Body mau vi dien tu (MoMo):**

```json
{
  "provider": "momo",
  "phoneNumber": "0901234567",
  "email": "user@example.com"
}
```

---

## 2. Cap nhat phuong thuc thanh toan - PUT `/api/payment-methods/update/:id`

**Headers:**
- `Content-Type: application/json`
- `Authorization: Bearer <token>`

**Params:**
- `id`: `_id` cua payment method can cap nhat

**Body mau (raw JSON):**

```json
{
  "provider": "napas",
  "cardHolderName": "NGUYEN VAN B",
  "bankName": "BIDV",
  "accountNumber": "9876543210",
  "phoneNumber": "0912345678",
  "email": "new-email@example.com"
}
```

**Luu y:** Tat ca field deu la optional khi update. Gui field nao thi cap nhat field do.

---

## 3. Xem tat ca phuong thuc thanh toan cua ban than - GET `/api/payment-methods/my-payment-methods`

**Headers:**
- `Authorization: Bearer <token>`

**Body:** Khong can body.

---

## Cac field hop le

- `provider`: `momo` | `zalopay` | `shopeepay` | `visa` | `napas` (bat buoc khi create)
- `cardNumber`: String
- `expiryDate`: String
- `csc`: String
- `cardHolderName`: String
- `bankName`: String
- `cccd`: String
- `accountNumber`: String
- `phoneNumber`: String
- `email`: Email hop le

