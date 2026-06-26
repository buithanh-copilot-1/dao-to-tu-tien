# Thiết Kế Chi Tiết: Màn Hình Đan Dược / Luyện Đan (Alchemy Screen)

Tài liệu mô tả chi tiết giao diện và logic vận hành của màn hình Đan Dược dựa trên mẫu vẽ `art_design/screen_dan_duoc.png` và cấu trúc trong mã nguồn tại [alchemy.ts](file:///d:/Project/dao-to-tu-tien/src/data/alchemy.ts).

---

## 1. Bố Cục Giao Diện (Layout)

Màn hình được chia làm hai khu vực chính: Đan Lô (Lò Luyện) ở trên và Danh Sách Công Thức Luyện Đan ở dưới.

### A. Khu vực Đan Lô (Alchemy Furnace Panel)
- **Tiêu đề:** "Đan Lô"
- **Hình ảnh mô tả:** Một chiếc lư hương/lò luyện đan bằng đồng cổ ba chân lớn đang rực lửa hỏa diễm màu cam đỏ ở giữa. Trên nắp lò phát ra các quầng sáng nhỏ bay lên (hiệu ứng khói linh khí).
- **Mô tả:** *"Dùng linh dược và linh thạch để luyện chế đan dược, hỗ trợ tu luyện và đột phá."*
- **Trạng thái lò:** Hiển thị lò trống (sẵn sàng luyện đan) hoặc thanh tiến độ đếm ngược thời gian nếu lò đang chạy (nếu có bổ sung cơ chế thời gian luyện đan thực tế).

### B. Danh Sách Công Thức Đan Dược (Recipes List)
Mỗi công thức đan dược hiển thị thành một khối hàng (list-row) bao gồm:
1. **Thông tin đan dược thành phẩm:**
   - Icon đan dược (ví dụ: bình đan màu đỏ, xanh, tím tùy theo phẩm chất).
   - Tên đan dược (ví dụ: *Tụ Khí Đan*, *Ngưng Thần Đan*, *Đột Phá Đan*).
   - Trị số mô tả hiệu quả: (ví dụ: `Tu vi +1,000 khi dùng`, `Hỗ trợ độ kiếp...`).
2. **Khung nguyên liệu yêu cầu (Ingredients Grid):**
   - Danh sách các linh thảo/khoáng thạch yêu cầu đi kèm cấp số hiện có/cần tiêu hao (ví dụ: `Linh Chi 3/2` màu xanh lá nếu đủ, `Huyền Thiết 0/1` màu đỏ báo động nếu thiếu).
   - Chi phí Linh thạch hoặc Vàng cần để luyện đan (ví dụ: `200 Vàng` hoặc `100 Linh Thạch`).
3. **Nút hành động "Luyện đan" (Craft Button):**
   - Nút màu vàng kim ở góc phải. 
   - Tự động khóa (disabled) và chuyển thành chữ báo lỗi (ví dụ: `Không đủ Vàng`, `Thiếu Linh Chi`) nếu người chơi không đáp ứng đủ nguyên liệu hoặc tài nguyên.
   - Khi đủ điều kiện, nút sáng lên và hiển thị chữ `"Luyện đan"`.

---

## 2. Logic Vận Hành (Game Logic & Mechanics)

- **Kiểm tra điều kiện Luyện đan (Craft Validation):**
  - Hàm `canCraft` kiểm tra số lượng của từng loại nguyên liệu trong túi đồ nhân vật (`player.inventory`) và tài nguyên vàng/linh thạch.
  - Trả về mã lỗi chi tiết nếu thiếu nguyên liệu để hiển thị trực tiếp lên nút bấm thay vì chỉ làm nút bị xám.
- **Thực hiện Luyện đan (Craft Action):**
  - Khi nhấp "Luyện đan", hệ thống sẽ:
    1. Trừ số lượng nguyên liệu yêu cầu trong túi đồ nhân vật.
    2. Trừ lượng Vàng/Linh thạch tương ứng.
    3. Thêm đan dược thành phẩm vào túi đồ (tự động cộng dồn số lượng nếu đã có sẵn).
    4. Kích hoạt hiệu ứng Toast thông báo thành công: `"Luyện đan thành công: Nhận [Tụ Khí Đan] x1"`.
- **Sử dụng Đan dược (Use Pill):**
  - Đan dược sau khi luyện chế thành công sẽ nằm trong túi đồ.
  - Khi người chơi sử dụng đan dược trong túi đồ, hệ thống sẽ:
    1. Cộng trực tiếp lượng tu vi hoặc gia tăng thuộc tính chỉ định cho nhân vật.
    2. Tiêu hao 1 đan dược.
    3. Cập nhật tiến độ nhiệm vụ (Quest progress) liên quan tới luyện đan hoặc sử dụng đan dược.
