# Authentication Flow

## Routes

- `/login`: hiển thị `LoginPage`.
- `/register`: hiển thị `RegisterPage`.
- `/app`: hiển thị giao diện chính nếu user đã đăng nhập; nếu chưa thì chuyển hướng về `/login`.
- `/`: chuyển hướng tự động sang `/app` khi đã đăng nhập hoặc `/login` khi chưa.

## Props

- `LoginPage` nhận prop `onLogin`.
  - `onLogin` kiểm tra dữ liệu đầu vào và xác thực user từ localStorage.
  - Nếu đăng nhập thành công, gọi `navigate('/app')`.

- `RegisterPage` nhận prop `onRegister`.
  - `onRegister` kiểm tra dữ liệu đầu vào và lưu user mới vào localStorage.
  - Nếu đăng ký thành công, gọi `navigate('/app')`.

## Luồng đăng nhập

1. Người dùng vào `/login`.
2. Người dùng điền `username` và `password`.
3. Form gọi `onLogin`.
4. `onLogin` kiểm tra:
   - `username` không được trống.
   - `password` không được trống.
   - user tồn tại trong localStorage.
5. Nếu hợp lệ, `user` được lưu state và localStorage, sau đó điều hướng tới `/app`.
6. Nếu không hợp lệ, hiển thị thông báo lỗi.

## Luồng đăng ký

1. Người dùng vào `/register`.
2. Người dùng điền `username` và `password`.
3. Form gọi `onRegister`.
4. `onRegister` kiểm tra:
   - `username` không được trống.
   - `password` không được trống.
   - tên user chưa được sử dụng.
5. Nếu hợp lệ, user mới lưu vào localStorage, state user được cập nhật và điều hướng tới `/app`.
6. Nếu không hợp lệ, hiển thị thông báo lỗi.
