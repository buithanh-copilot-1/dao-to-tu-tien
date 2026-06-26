# Thiết Kế Chi Tiết: Màn Hình Tông Môn (Sect Screen)

Tài liệu mô tả chi tiết giao diện và logic vận hành của màn hình Tông Môn dựa trên mẫu vẽ `art_design/screen_tong_mon.png` và cấu trúc trong mã nguồn tại [sects.ts](file:///d:/Project/dao-to-tu-tien/src/data/sects.ts).

---

## 1. Bố Cục Giao Diện (Layout)

Màn hình Tông Môn hiển thị trạng thái của người chơi đối với môn phái tu tiên mà họ đã bái nhập. Giao diện chia thành 3 trạng thái chính:

### A. Trạng thái chưa vào Tông Môn (Sect Recruitment)
Hiển thị danh sách các tông môn để người chơi chọn bái nhập:
- **Thông tin môn phái:**
  - Tên môn phái (ví dụ: *Liệt Hỏa Tông*, *Kim Kiếm Môn*...).
  - Đại diện hệ ngũ hành (Hỏa, Kim, Mộc, Thủy, Thổ) với icon nguyên tố tương ứng.
  - Mô tả tôn chỉ môn phái (ví dụ: `"Lấy kiếm khí sắc bén làm gốc, đệ tử công kích kinh người"`).
- **Phúc lợi bái nhập:** Chỉ số thuộc tính cộng thêm cho mỗi bậc chức vị đạt được (ví dụ: `Công +60, Thân Pháp +6 cho mỗi chức vị`).
- **Nút "Bái Nhập":** Nút vàng kim đi kèm chi phí bái nhập (ví dụ: `1,000 Vàng`). Nút này bị vô hiệu hóa nếu người chơi không đủ vàng hoặc không phù hợp thuộc tính.

### B. Trạng thái đã gia nhập Tông Môn (Sect Home)
Khi đã vào phái, màn hình hiển thị trang chủ tông môn uy nghiêm với các thông tin:
- **Thông tin chức vị nhân vật:**
  - Tên tông môn đang ở (ví dụ: *Huyền Thủy Cung*).
  - Huy hiệu chức vị hiện tại (Ngoại Môn, Nội Môn, Thân Truyền, Chân Truyền, Trưởng Lão...).
  - Trị số cống hiến hiện tại và điểm cống hiến cần để thăng cấp chức vị tiếp theo (ví dụ: `150/500 cống hiến`).
- **Khung cảnh tông môn:** Hình vẽ cổng sơn môn tiên cảnh cổ kính mờ ảo trong mây khói.
- **Nút hành động nhanh:**
  - **Cống hiến (Donate):** Quyên góp Vàng hoặc Linh thạch cho tông môn để đổi lấy điểm cống hiến phái.
  - **Thoái xuất tông môn (Leave Sect):** Nút màu đỏ chu sa ở góc dưới. *Chú ý:* Thoái xuất sẽ mất toàn bộ cống hiến tích lũy và bị phạt giảm cống hiến ở môn phái sau.

### C. Các tab tính năng Tông Môn (Sect Tabs)
Phần cuối trang chủ chia làm các tab tính năng phụ:
1. **Nhiệm vụ tông môn (Sect Quests):**
   - Các nhiệm vụ nhận linh khí, tu vi hoặc cống hiến phái (như: luyện kiếm, tuần tra núi, chăm sóc linh thảo).
2. **Tàng Kinh Các (Sect Techniques):**
   - Đổi điểm cống hiến lấy các bí tịch công pháp độc quyền của môn phái để tăng tốc độ tu luyện hoặc gia tăng vĩnh viễn thuộc tính chiến đấu.
3. **Thần Binh Các (Sect Shop):**
   - Sử dụng cống hiến phái để đổi lấy các nguyên liệu rèn hiếm, thảo dược luyện đan thượng phẩm hoặc trang bị hộ mệnh.

---

## 2. Logic Vận Hành (Game Logic & Mechanics)

- **Gia nhập tông môn:**
  - Người chơi chỉ được gia nhập 1 tông môn duy nhất tại một thời điểm.
  - Gia nhập tông môn đúng hệ Ngũ Hành của Linh Căn nhân vật sẽ được tối ưu hiệu quả chỉ số cộng thêm.
- **Thăng tiến chức vị:**
  - Điểm cống hiến phái tăng lên khi hoàn thành nhiệm vụ tông môn hoặc quyên góp tài nguyên (Vàng/Linh thạch).
  - Hệ thống tự động kiểm tra điểm cống hiến tích lũy để thăng chức vị cho đệ tử:
    - `0 cống hiến`: Ngoại Môn Đệ Tử.
    - `500 cống hiến`: Nội Môn Đệ Tử.
    - `2000 cống hiến`: Thân Truyền Đệ Tử.
    - `6000 cống hiến`: Chân Truyền Đệ Tử.
    - `15000 cống hiến`: Trưởng Lão.
    - `40000 cống hiến`: Thái Thượng Trưởng Lão.
- **Tính toán chỉ số tăng thêm:**
  - Công thức buff chỉ số từ tông môn:
    $$\text{Chỉ Số Buff} = \text{Chỉ Số Cơ Bản Của Chức Vị} \times (\text{Cấp Chức Vị} + 1)$$
  - Chỉ số này cộng dồn trực tiếp vào tổng chỉ số nhân vật trong hàm `calcStats` và ảnh hưởng đến Lực Chiến tức thời.
