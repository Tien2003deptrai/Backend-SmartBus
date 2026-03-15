Quản lí tài khoản - Quản lí tài khoản của nhân viên và khách hàng
admin service - controller - router

**Base URL:** `http://localhost:<PORT>/api/admin`  
**Auth:** Tất cả API cần header `Authorization: Bearer <token>` và chỉ user có `role === 'admin'` mới gọi được.

---

## API đã implement

| Method | Endpoint | Mô tả |
|--------|----------|--------|
| POST | /users/listUsers | Danh sách user (phân trang, tìm theo full_name, lọc role, is_priority_user, active) |
| GET | /users/:id | Chi tiết một user (theo id) |
| PUT | /users/:id/active | Cập nhật trạng thái active của user (nhân viên/khách hàng) |
| DELETE | /users/:id | Xóa user theo id (không xóa được admin, không xóa chính mình) |

---

## Body getListUser – POST /api/admin/users/listUsers

```json
{
  "page": 1,
  "limit": 5,
  "search": "Kim Liên",
  "role": "user",
  "is_priority_user": true,
  "active": false
}
```

- **page**, **limit**: phân trang (optional; mặc định page=1, limit=10).
- **search**: tìm theo `full_name` (optional).
- **role**: lọc theo vai trò – `"admin"` \| `"staff"` \| `"user"` (optional).
- **is_priority_user**: lọc ưu tiên – `true` \| `false` (optional).
- **active**: lọc trạng thái hoạt động – `true` \| `false` (optional).

---

## Body cập nhật active – PUT /api/admin/users/:id/active

```json
{
  "active": true
}
```

- **active**: bắt buộc, `true` hoặc `false`.
- Không thể đổi active của tài khoản có `role === 'admin'`.

---

## Xóa user – DELETE /api/admin/users/:id

- Không body.
- Không xóa được user có `role === 'admin'`.
- Admin không thể xóa chính tài khoản mình.

---

## File đã thêm/sửa

- **Middleware:** `src/middlewares/requireAdmin.js` (dùng sau `auth`, kiểm tra `req.user.role === 'admin'`).
- **Service:** `src/services/adminUserService.js` (listUsers, getUserById, updateUserActive, deleteUserById).
- **Controller:** `src/controllers/adminUserController.js`.
- **Validation:** `src/validations/adminUserValidation.js`.
- **Routes:** `src/routes/adminUserRoutes.js` (mount tại `/api/admin`).
- **Model User:** thêm index `role`, `active`, `full_name` (text) cho query.


