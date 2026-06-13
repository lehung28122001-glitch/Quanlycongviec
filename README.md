# TaskFlow Management – Ứng dụng Quản Lý Công Việc

Ứng dụng quản lý công việc cá nhân được xây dựng bằng **ReactJS + Vite**, giúp người dùng tạo, theo dõi và thống kê công việc theo trạng thái (To Do / In Progress / Done), kèm tính năng Pomodoro hỗ trợ tập trung làm việc.

## 1. Giới thiệu hệ thống

TaskFlow Management là một Todo App hiện đại với các tính năng chính:

- **Quản lý công việc (CRUD):** Thêm, sửa, xóa công việc với mô tả, hạn hoàn thành, độ ưu tiên, danh mục và các công việc con (subtasks).
- **Quản lý trạng thái:** Mỗi công việc có trạng thái To Do / In Progress / Done, hiển thị bằng màu sắc/nhãn riêng và có thể chuyển đổi qua lại.
- **Bộ lọc & tìm kiếm:** Lọc theo danh mục, độ ưu tiên, tìm kiếm theo tên/mô tả, sắp xếp theo hạn, độ ưu tiên hoặc ngày tạo.
- **Thống kê:** Trang thống kê hiển thị số lượng và tỷ lệ công việc theo từng trạng thái dưới dạng bảng và biểu đồ thanh.
- **Pomodoro Timer:** Hỗ trợ làm việc tập trung theo chu kỳ thời gian.
- **Giao diện:** Hỗ trợ chế độ sáng/tối (dark/light theme), hiệu ứng pháo hoa khi hoàn thành công việc.
- **Lưu trữ:** Dữ liệu được lưu trong `localStorage`, không cần backend.

## 2. Công nghệ sử dụng

- [React 19](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [lucide-react](https://lucide.dev/) – icon
- CSS thuần (Glassmorphism style)


If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

=======
## 3. Hướng dẫn cài đặt

### Yêu cầu

- Node.js >= 18
- npm (đi kèm Node.js)

### Các bước cài đặt

```bash
# 1. Clone repository
git clone https://github.com/lehung28122001-glitch/Quanlycongviec.git
cd Quanlycongviec

# 2. Cài đặt các package phụ thuộc
npm install

# 3. Chạy ứng dụng ở môi trường phát triển
npm run dev
```

Sau khi chạy, mở trình duyệt và truy cập địa chỉ hiển thị trong terminal (thường là `http://localhost:5173`).

### Build cho môi trường production

```bash
npm run build
npm run preview
```

## 4. Hướng dẫn sử dụng

### 4.1. Thêm công việc mới
- Nhấn nút **"Thêm công việc"** ở góc trên bên phải.
- Điền thông tin: tên công việc, mô tả, hạn hoàn thành, độ ưu tiên, danh mục.
- Nhấn **Lưu** để tạo công việc mới.

### 4.2. Chỉnh sửa / Xóa công việc
- Nhấn icon **bút (Edit)** trên thẻ công việc để chỉnh sửa.
- Nhấn icon **thùng rác (Delete)** để xóa, hệ thống sẽ yêu cầu xác nhận trước khi xóa.

### 4.3. Cập nhật trạng thái công việc
- Mỗi công việc hiển thị trạng thái hiện tại: **To Do**, **In Progress**, hoặc **Done**, với màu/nhãn riêng biệt.
- Chọn trạng thái mới trên thẻ công việc để chuyển đổi trạng thái.
- Khi hoàn thành toàn bộ công việc con (subtasks), công việc chính sẽ tự động chuyển sang trạng thái **Done**.

### 4.4. Xem thống kê
- Khu vực **"Thống kê công việc"** trên trang chính hiển thị:
  - Số lượng công việc theo từng trạng thái (To Do / In Progress / Done).
  - Thanh tiến độ tổng quan theo tỷ lệ phần trăm.
  - Bảng chi tiết số lượng và tỷ lệ từng trạng thái so với tổng số công việc.

### 4.5. Lọc, tìm kiếm và sắp xếp
- Dùng ô tìm kiếm để tìm công việc theo tên hoặc mô tả.
- Dùng bộ lọc để chọn danh mục hoặc độ ưu tiên.
- Dùng menu sắp xếp để xếp công việc theo hạn, độ ưu tiên hoặc ngày tạo.

### 4.6. Pomodoro Timer
- Sử dụng bộ đếm thời gian Pomodoro ở Sidebar để quản lý thời gian làm việc/nghỉ ngơi.

### 4.7. Đổi giao diện
- Nhấn nút chuyển đổi theme ở Sidebar để thay đổi giữa chế độ sáng (light) và tối (dark).

## 5. Quy trình làm việc nhóm (Git Workflow)

- Repository: `taskflow-management`
- Mỗi thành viên làm việc trên branch riêng, commit thường xuyên, sau đó tạo Pull Request vào `main`.
- Các thành viên khác review, góp ý và approve trước khi merge.

## 6. Danh sách thành viên

| Thành viên | Công việc đảm nhiệm | Branch |
|---|---|---|
| Thành viên 1 | Đăng ký, đăng nhập, kiểm tra dữ liệu đầu vào | `feature/authentication` |
| Thành viên 2 | CRUD công việc (thêm/sửa/xóa) | `feature/task-management` |
| Thành viên 3 | Quản lý trạng thái công việc (To Do / In Progress / Done) | `feature/task-status` |
| Thành viên 4 | Thống kê công việc & tài liệu dự án | `feature/report-and-docs` |

