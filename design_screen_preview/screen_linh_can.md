# Thiết Kế Chi Tiết: Màn Hình Linh Căn (Spirit Root Screen)

Tài liệu mô tả chi tiết giao diện và logic vận hành của màn hình Linh Căn dựa trên mẫu vẽ `art_design/screen_linh_can.png`.

---

## 1. Bố Cục Giao Diện (Layout)

Màn hình được thiết kế theo dạng dọc điện thoại (H5 Mobile), chia làm 4 khu vực chính từ trên xuống dưới:

### A. Thanh Tiêu Đề & Tài Nguyên (Header)
- **Tiêu đề phụ:** Logo "Đạo Tổ Tu Tiên" cùng một nhãn màu đỏ "Tiên Luyên" nhỏ bên cạnh.
- **Tài nguyên hiển thị:**
  - **Lực Chiến:** Icon ngọn lửa thần kiếm, hiển thị trị số lực chiến của nhân vật (ví dụ: `256.8 Ức`).
  - **Linh Thạch (Crystals):** Trị số `9.88 Ức` kèm nút bấm `+` màu vàng.
  - **Vàng (Gold):** Trị số `12.36 Vạn` kèm nút bấm `+` màu vàng.
- **Tiêu đề chính:** Chữ "Linh Căn" viết bằng font thư pháp vàng kim cỡ lớn đặt ở trung tâm. Bên cạnh có một biểu tượng dấu hỏi `(!)` để mở popup xem hướng dẫn.
- **Nút "Giới thiệu":** Nằm góc phải tiêu đề chính với icon quyển sách cổ.

### B. Vòng Tròn Ngũ Hành & Tu Sĩ Thiền Định (Central Diagram)
- **Cảnh giới nhân vật:** Khung tròn rồng cuốn bên góc trái hiển thị cảnh giới hiện tại (ví dụ: `Độ Kiếp Kỳ - Bậc 9`).
- **Phẩm chất Linh Căn:** Nhãn lớn ở trung tâm phía dưới tiêu đề: `Thiên Linh Căn` (màu tím thần thoại). Phụ đề bên dưới: `"Hiếm bậc Thiên – Trời ban linh căn, vô cùng hiếm có"`.
- **Hình vẽ trung tâm:** Hình ảnh tu sĩ nam/nữ tĩnh tọa thiền định trên hoa sen cổ, xung quanh tỏa ra quầng sáng hộ thể (aura) màu vàng nhạt dao động chậm (pulse).
- **Vòng Ngũ Hành (5 Lõi):** Bố trí 5 nút tròn nguyên tố liên kết với nhau bằng một vòng tròn cổ văn tự:
  1. **Kim (Metal):** Nút đỉnh đầu, phát sáng vàng kim. Hiển thị: `Kim Lv.85`, trạng thái: `Đã kích hoạt`.
  2. **Mộc (Wood):** Nút giữa bên trái, phát sáng lục ngọc. Hiển thị: `Mộc Lv.82`, trạng thái: `Đã kích hoạt`.
  3. **Thủy (Water):** Nút giữa bên phải, phát sáng lam ngọc. Hiển thị: `Thủy Lv.87`, trạng thái: `Đã kích hoạt`.
  4. **Hỏa (Fire):** Nút dưới bên trái, phát sáng đỏ hỏa. Hiển thị: `Hỏa Lv.84`, trạng thái: `Đã kích hoạt`.
  5. **Thổ (Earth):** Nút dưới bên phải, phát sáng nâu đất. Hiển thị: `Thổ Lv.83`, trạng thái: `Đã kích hoạt`.

### C. Bảng Thuộc Tính Tổng Hợp (Stats Panel)
Bảng hiển thị nằm ngay dưới sơ đồ thiền định, chia làm 2 cột:
- **Cột Trái (Stats):** Hiển thị các chỉ số cộng thêm từ Linh Căn bằng màu xanh lá dạ quang (glow):
  - Khí Huyết: `+256800`
  - Công Kích: `+12840`
  - Phòng Ngự: `+9870`
  - Thân Pháp (Tốc Độ): `+1560`
  - Né Tránh / Bạo Kích / Chính Xác...
- **Cột Phải (Buff Đặc Biệt - Thiên Linh Căn):** Khung viền hoa văn tím hiển thị các thuộc tính ẩn khi người chơi đạt mốc:
  - *"Kích hoạt 5 linh căn đạt Lv.80"* $\rightarrow$ Nhãn màu xanh: `Đã kích hoạt`.
  - Hiệu quả buff:
    - Tất cả thuộc tính +20%
    - Tốc độ tu luyện +30%
    - Tỉ lệ bạo kích +15%
    - Kháng tất cả +10%

### D. Khung Điều Khiển Phía Dưới (Upgrade & Awakening Panels)
Chia đôi làm 2 hộp chữ nhật nằm ngang:
1. **Khung Tăng Cấp Linh Căn (hệ đang chọn):**
   - Tiêu đề: `Tăng cấp Linh Căn (Kim)`
   - Cấp độ thay đổi: `Lv.85 >>> Lv.86` (cấp mới màu xanh).
   - Chỉ số thay đổi: `Công: +1277 >>> +1290` (chỉ số mới màu xanh).
   - Chi phí: `9.88 Ức/1850 Vạn` Linh Thạch.
   - Nút hành động: Nút vàng kim lớn chữ **"Tăng cấp"**.
2. **Khung Thức Tỉnh Linh Căn:**
   - Tiêu đề: `Thức tỉnh Linh Căn`
   - Hình ảnh: Huy hiệu tĩnh tọa ngọc bích cổ.
   - Mô tả: `"Thức tỉnh sẽ tăng giới hạn cấp"` (ví dụ: mở khóa từ 80 lên 100).
   - Nút hành động: Nút vàng kim chữ **"Thức tỉnh"**.

---

## 2. Logic Vận Hành (Game Logic & Mechanics)

- **Nhấp chọn nguyên tố:** Khi nhấp vào 1 trong 5 nút nguyên tố trên vòng tròn, khung nâng cấp phía dưới sẽ chuyển sang thông tin của nguyên tố đó (tên nguyên tố, cấp độ hiện tại, chỉ số cộng thêm, và tài nguyên tiêu hao).
- **Tăng cấp Linh Căn:**
  - Tiêu hao Linh Thạch và Vàng tăng dần theo cấp độ.
  - Khi nâng cấp, hệ thống trừ tài nguyên của nhân vật, tăng cấp của lõi nguyên tố lên 1, tính toán lại chỉ số thuộc tính cơ bản của nhân vật.
  - Lực chiến nhân vật tự động cập nhật ngay trên Header sau khi chỉ số thay đổi.
- **Thức tỉnh (Awaken):**
  - Khi một linh căn đạt giới hạn cấp (ví dụ: cấp 20, 40, 60, 80), nút **Tăng cấp** bị khóa và yêu cầu người chơi bấm **Thức tỉnh** bằng một loại nguyên liệu hiếm (như Linh Đan Đột Phá hoặc Mảnh Hồn) để mở giới hạn cấp kế tiếp.
- **Đồng bộ Thiên Linh Căn:**
  - Hệ thống kiểm tra điều kiện cấp nhỏ nhất trong 5 hệ linh căn: `minLevel = Math.min(Kim, Mộc, Thủy, Hỏa, Thổ)`.
  - Nếu `minLevel >= 20/40/60/80`, kích hoạt tầng buff tương ứng của Thiên Linh Căn, cộng trực tiếp % vào tổng thuộc tính và tốc độ tu luyện giây của người chơi.
