# Postman API Test Cases

**Base URL:** `http://localhost:3000`

---

## 1. Gửi OTP đăng ký (nhập đủ thông tin)
```
POST {{baseUrl}}/api/users/register
Content-Type: application/json

{
  "full_name": "Nguyễn Văn A",
  "email": "user@example.com",
  "phone": "0901234567",
  "password": "123456",
  "password_confirm": "123456"
}
```

---

## 2. Xác nhận OTP và tạo tài khoản (chỉ gửi OTP)
```
POST {{baseUrl}}/api/users/register/verify-otp
Content-Type: application/json

{
  "otp": "123456"
}
```

---

## 3. Upload ảnh (tối đa 5 ảnh, cần token)
```
POST {{baseUrl}}/api/upload/images
Authorization: Bearer {{token}}
Content-Type: multipart/form-data
Body: form-data key "images" (File) - chọn 1 đến 5 file ảnh (JPEG, PNG, GIF, WebP, tối đa 5MB/file)
```
→ Response: `{ "success": true, "urls": ["https://...", ...] }`

---

## 4. Đăng nhập
```
POST {{baseUrl}}/api/users/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "123456"
}
```
→ Lưu `token` từ response để dùng cho các API cần auth.

---

## 5. Cập nhật profile
```
PUT {{baseUrl}}/api/users/profile
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "full_name": "Nguyễn Văn B",
  "gender": "male",
  "province": "Hà Nội",
  "district": "Cầu Giấy"
}
```

---

## 6. Tạo bài post
```
POST {{baseUrl}}/api/posts
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "title": "Bài viết mẫu",
  "summary": "Tóm tắt nội dung",
  "content": "Nội dung chi tiết bài viết",
  "category": "Tin tức"
}
```

---

## 7. Sửa bài post
```
PUT {{baseUrl}}/api/posts/{{postId}}
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "title": "Tiêu đề đã cập nhật",
  "content": "Nội dung đã cập nhật"
}
```

---

## 8. Xóa bài post
```
DELETE {{baseUrl}}/api/posts/{{postId}}
Authorization: Bearer {{token}}
```

---

## 9. Lấy danh sách post
```
GET {{baseUrl}}/api/posts?page=1&limit=10&search=tin&sort=newest
```

---

## 10. Lấy chi tiết 1 post
```
GET {{baseUrl}}/api/posts/{{postId}}
```

---

## Biến Postman (Environment)
| Biến    | Giá trị mẫu              |
|---------|---------------------------|
| baseUrl | http://localhost:3000     |
| token   | (paste từ response login) |
| postId  | (paste _id của post)      |
