# 🔐 Tài khoản Test - DMS System

## 📋 Danh sách tài khoản đầy đủ

Hệ thống có **5 tài khoản test** cho đủ 4 roles. Không cần backend, login trực tiếp!

---

## 🏢 **PHÍA HÃNG XE (Company)**

### 1️⃣ **Company Admin** - Quản trị viên Hãng

```
Username: companyadmin
Password: admin123
Role: CompanyAdmin
Tên: Nguyễn Văn A - Admin Hãng
```

**✅ Có thể làm:**
- Quản lý danh mục xe điện
- Quản lý tồn kho tổng
- Quản lý đại lý & hợp đồng
- Quản lý giá sỉ, chiết khấu
- Xem báo cáo doanh số theo khu vực
- **KHÔNG** thấy menu "Test Drive"
- **KHÔNG** truy cập được `/test-drive`

---

### 2️⃣ **Company Staff** - Nhân viên Hãng

```
Username: companystaff
Password: staff123
Role: CompanyStaff
Tên: Trần Thị B - Nhân viên Hãng
```

**✅ Có thể làm:**
- Xem danh mục sản phẩm
- Xử lý đơn hàng từ đại lý
- Hỗ trợ đại lý
- **KHÔNG** thấy menu "Test Drive"
- **KHÔNG** truy cập được `/test-drive`

---

## 🏪 **PHÍA ĐẠI LÝ (Dealer)**

### 3️⃣ **Dealer Admin** - Quản lý Đại lý ⭐

```
Username: dealeradmin
Password: admin123
Role: DealerAdmin
Tên: Lê Văn C - Quản lý Đại lý
```

**✅ Có thể làm với Test Drive:**
- ✅ Xem menu "Test Drive"
- ✅ Truy cập `/test-drive`
- ✅ Xem tất cả lịch hẹn
- ✅ **Tạo** lịch hẹn mới
- ✅ **Phê duyệt** lịch hẹn Pending
- ✅ **Từ chối** lịch hẹn Pending (nhập lý do)
- ✅ **Sửa** bất kỳ lịch hẹn nào
- ✅ **Xóa** bất kỳ lịch hẹn nào
- ✅ Quản lý khách hàng
- ✅ Tạo đơn hàng, báo giá

**Đặc biệt:**
- Là role duy nhất có nút "✓ Phê duyệt" và "✕ Từ chối"
- Full access trong trang Test Drive

---

### 4️⃣ **Dealer Staff** - Nhân viên Đại lý ⭐

```
Username: dealerstaff
Password: staff123
Role: DealerStaff
Tên: Phạm Thị D - Nhân viên Đại lý
```

**✅ Có thể làm với Test Drive:**
- ✅ Xem menu "Test Drive"
- ✅ Truy cập `/test-drive`
- ✅ Xem tất cả lịch hẹn
- ✅ **Tạo** lịch hẹn mới (auto status = Pending)
- ✅ **Sửa** lịch hẹn Pending hoặc Rejected
- ✅ **Xóa** lịch hẹn Pending
- ✅ Xem lý do từ chối
- ✅ Gửi lại lịch hẹn đã sửa

**❌ KHÔNG thể:**
- ❌ Phê duyệt lịch hẹn
- ❌ Từ chối lịch hẹn
- ❌ Sửa lịch hẹn Approved/Completed
- ❌ Xóa lịch hẹn Approved/Completed

---

### 5️⃣ **Developer** - Tài khoản Dev (Legacy)

```
Username: dev
Password: dev123
Role: CompanyAdmin
Tên: Developer
```

**Mục đích:** Tài khoản dev ban đầu, giống CompanyAdmin

---

## 🧪 HƯỚNG DẪN TEST

### **Test Case 1: Company không thấy Test Drive**

**Bước 1:** Login với CompanyAdmin
```
Username: companyadmin
Password: admin123
```

**Kết quả mong đợi:**
- ❌ Menu "Test Drive" KHÔNG hiển thị trong sidebar
- ❌ Nếu vào trực tiếp `/test-drive` → Access Denied

---

### **Test Case 2: Dealer Staff tạo và chỉnh sửa**

**Bước 1:** Login với DealerStaff
```
Username: dealerstaff
Password: staff123
```

**Bước 2:** Click menu "Test Drive"

**Kết quả mong đợi:**
- ✅ Menu hiển thị
- ✅ Vào được trang
- ✅ Thấy nút "Tạo lịch hẹn mới"

**Bước 3:** Tạo lịch hẹn mới
- Điền thông tin khách hàng
- Chọn xe và thời gian
- Click "Tạo lịch hẹn"

**Kết quả mong đợi:**
- ✅ Lịch hẹn được tạo với Status = "Pending" (badge vàng)
- ✅ Thấy nút Sửa và Xóa
- ❌ KHÔNG thấy nút "Phê duyệt" hoặc "Từ chối"

**Bước 4:** Thử sửa lịch hẹn Approved
- Tìm lịch hẹn có Status = "Approved" (badge xanh)

**Kết quả mong đợi:**
- ❌ KHÔNG thấy nút Sửa
- ❌ KHÔNG thấy nút Xóa

---

### **Test Case 3: Dealer Admin phê duyệt**

**Bước 1:** Login với DealerAdmin
```
Username: dealeradmin
Password: admin123
```

**Bước 2:** Vào trang Test Drive

**Kết quả mong đợi:**
- ✅ Thấy tất cả lịch hẹn
- ✅ Với lịch hẹn Pending, thấy nút:
  - "✓ Phê duyệt" (xanh)
  - "✕ Từ chối" (đỏ)

**Bước 3:** Click "✓ Phê duyệt" trên lịch Pending

**Kết quả mong đợi:**
- ✅ Confirm dialog hiển thị
- ✅ Sau khi confirm, Status → "Approved" (badge xanh)
- ✅ Tên Manager hiển thị ở cột "Người tạo"
- ✅ Nút phê duyệt biến mất

**Bước 4:** Click "✕ Từ chối" trên lịch Pending khác

**Kết quả mong đợi:**
- ✅ Modal nhập lý do hiển thị
- ✅ Nhập lý do (bắt buộc)
- ✅ Sau khi confirm, Status → "Rejected" (badge đỏ)
- ✅ Lý do từ chối hiển thị màu đỏ dưới status

---

### **Test Case 4: Staff xem lý do từ chối và sửa lại**

**Bước 1:** Login lại với DealerStaff
```
Username: dealerstaff
Password: staff123
```

**Bước 2:** Tìm lịch hẹn vừa bị từ chối (Status = Rejected)

**Kết quả mong đợi:**
- ✅ Status badge màu đỏ
- ✅ Lý do từ chối hiển thị rõ ràng
- ✅ Thấy nút "✏️ Sửa"

**Bước 3:** Click Sửa và chỉnh sửa theo lý do
- Ví dụ: Đổi thời gian nếu lý do là "lịch trùng"
- Click "Cập nhật"

**Kết quả mong đợi:**
- ✅ Status quay lại "Pending"
- ✅ Lịch hẹn được gửi lại để Manager xem xét
- ✅ Lý do từ chối cũ không còn hiển thị

---

### **Test Case 5: Filter theo status**

**Bước 1:** Login với bất kỳ Dealer role

**Bước 2:** Sử dụng bộ lọc "Trạng thái"

**Kết quả mong đợi:**
- ✅ Filter "Chờ phê duyệt" → Chỉ hiển thị Pending
- ✅ Filter "Đã phê duyệt" → Chỉ hiển thị Approved
- ✅ Filter "Đã từ chối" → Chỉ hiển thị Rejected
- ✅ Filter "Đã hoàn thành" → Chỉ hiển thị Completed

---

## 📊 BẢNG SO SÁNH QUYỀN HẠN

| Chức năng | CompanyAdmin | CompanyStaff | DealerAdmin | DealerStaff |
|-----------|--------------|--------------|-------------|-------------|
| **Xem menu "Test Drive"** | ❌ | ❌ | ✅ | ✅ |
| **Truy cập /test-drive** | ❌ | ❌ | ✅ | ✅ |
| **Xem danh sách** | ❌ | ❌ | ✅ | ✅ |
| **Tạo lịch hẹn** | ❌ | ❌ | ✅ | ✅ |
| **Phê duyệt** | ❌ | ❌ | ✅ | ❌ |
| **Từ chối** | ❌ | ❌ | ✅ | ❌ |
| **Sửa (Pending)** | ❌ | ❌ | ✅ | ✅ |
| **Sửa (Rejected)** | ❌ | ❌ | ✅ | ✅ |
| **Sửa (Approved)** | ❌ | ❌ | ✅ | ❌ |
| **Xóa (Pending)** | ❌ | ❌ | ✅ | ✅ |
| **Xóa (Approved)** | ❌ | ❌ | ✅ | ❌ |

---

## 🎯 QUICK TEST COMMANDS

### **Test nhanh từng role:**

```bash
# 1. Test CompanyAdmin (không thấy menu)
Login: companyadmin / admin123
Expected: NO "Test Drive" menu

# 2. Test CompanyStaff (không thấy menu)
Login: companystaff / staff123
Expected: NO "Test Drive" menu

# 3. Test DealerAdmin (full access + approval)
Login: dealeradmin / admin123
Expected: See menu + Approve/Reject buttons

# 4. Test DealerStaff (limited access, no approval)
Login: dealerstaff / staff123
Expected: See menu + Create, NO Approve/Reject
```

---

## 💡 TIPS & TRICKS

### **Đổi role nhanh:**
1. Logout (click avatar → Logout)
2. Login với account khác
3. Refresh page nếu cần

### **Debug quyền:**
```javascript
// Mở Console (F12) và chạy:
console.log(JSON.parse(localStorage.getItem('user')));
// Sẽ hiển thị role hiện tại
```

### **Clear localStorage:**
```javascript
// Nếu gặp lỗi lạ:
localStorage.clear();
// Rồi login lại
```

---

## 🐛 TROUBLESHOOTING

### **Vấn đề 1: Login không được**

**Kiểm tra:**
- Username/password đúng chưa? (copy từ doc này)
- Case-sensitive! `companyadmin` ≠ `CompanyAdmin`
- Password: `admin123` hoặc `staff123`

---

### **Vấn đề 2: Thấy menu nhưng vào không được**

**Nguyên nhân:** Cache cũ

**Giải pháp:**
1. Logout
2. Clear localStorage: `localStorage.clear()`
3. Login lại
4. Hard refresh: `Ctrl + F5`

---

### **Vấn đề 3: Company role thấy menu Test Drive**

**Nguyên nhân:** Code chưa được update

**Kiểm tra:**
- File `AppSidebar.tsx` có `roles: ['DealerAdmin', 'DealerStaff']` chưa?
- Clear cache browser
- Restart dev server

---

## 🎓 LEARNING PATH

### **Cho QA/Tester:**

**Level 1: Basic**
1. Login với cả 4 roles
2. Xác nhận menu hiển thị đúng
3. Test create lịch hẹn với DealerStaff

**Level 2: Intermediate**
1. Test workflow: Staff tạo → Admin duyệt
2. Test rejection: Admin từ chối → Staff sửa
3. Test permissions: Sửa/xóa theo status

**Level 3: Advanced**
1. Test edge cases: Sửa lịch Approved (should fail)
2. Test filters: Tất cả status combinations
3. Cross-role testing: CompanyAdmin vào /test-drive

---

## 📝 NOTES

- ✅ Tất cả accounts đều **KHÔNG CẦN BACKEND**
- ✅ Data lưu trong **localStorage** và **memory**
- ✅ Mock data có **4 test drives** mẫu
- ✅ Logout sẽ clear localStorage
- ✅ Refresh page giữ nguyên session

---

## 🚀 READY TO TEST!

**Khuyến nghị test theo thứ tự:**

1. ✅ **CompanyAdmin** → Xác nhận KHÔNG thấy menu
2. ✅ **CompanyStaff** → Xác nhận KHÔNG thấy menu
3. ✅ **DealerStaff** → Tạo lịch hẹn
4. ✅ **DealerAdmin** → Phê duyệt/Từ chối
5. ✅ **DealerStaff** → Xem lý do & sửa lại

**Happy Testing!** 🎉

---

**Phiên bản:** 1.0.0  
**Ngày tạo:** October 20, 2025  
**Trạng thái:** ✅ Ready for Testing

