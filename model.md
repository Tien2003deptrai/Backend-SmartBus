user
{
  full_name: String,
  email: String,
  phone: String,
  password: String,
  gender: String,
  date_of_birth: Date,
  occupation: String,
  province: String,
  district: String,
  ward: String,
  address_detail: String,
  is_priority_user: Boolean
}

post
{
  title: String,
  summary: String,
  content: String,
  thumbnail: String,
  images: [String],
  category: String,
  related_routes: [ObjectId],
  related_stops: [ObjectId],
  user: [ObjectId]
}

- đánh index db cho model

chức năng đối với "user":
1. Đăng ký tài khoản - full_name, email, phone, password, (trường xác nhận mật khẩu)
    - gửi OTP 6 chữ số -> dùng "npm install resend" để gửi mail (trong vòng 1 phút không xác nhận thì hết hạn)

2. Login tài khoản (token, ko cần refreshToken)
3. Cập nhật tài khoản, cho cập nhật tất cả các trường trong model

chức năng đối với "post":
1. Tạo, sửa, xoá bài post.
2. Lấy danh sách Post (panigation, search theo content - title, sort(theo ngày tạo mới nhất, cũ nhất) mặc định là mới nhất)
3. Lấy chi tiết 1 bài Post
