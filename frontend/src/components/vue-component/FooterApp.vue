<template>
  <div class="footer" :class="{ dark: darkMode, light: !darkMode }">

    <div class="body-bottom">
      <div class="address row">
        <div class="col-7">
          <div class="grid-item-logo">
            <i class="fas fa-book"></i>
            <div class="footer-logo">BÁCH KHOA SÁCH</div>
          </div>

          <div class="content-address">
            <div class="infor">
              Lầu 5, 387-389 Hai Bà Trưng Quận 3 TP HCM Công Ty Cổ Phần Phát
              Hành Sách TP HCM - BKS
            </div>
            <div class="infor">
              BKS.com nhận đặt hàng trực tuyến và giao hàng tận nơi.
            </div>
            <div class="infor">
              KHÔNG hỗ trợ đặt mua và nhận hàng trực tiếp tại văn phòng cũng như
              tất cả hệ thông BKS trên toàn quốc.
            </div>
          </div>
        </div>

        <div class="col-5">
          <div class="title text-center"> LIÊN HỆ</div>

          <div class="icon-contact mt-2" >
            <i class="fab fa-facebook"></i>
            <i class="fab fa-instagram"></i>
            <i class="fab fa-youtube"></i>
            <i class="fab fa-tiktok"></i>
            <i class="fab fa-pinterest"></i>
          </div>
          
        </div>

      </div>

      <div class="bottom-option">
        <div class="container-bottom-option">
          <div class="col-lg-4">
            <div class="title">DỊCH VỤ</div>
            <li>Điều khoản và sử dụng</li>
            <li>Chính sách bảo mật</li>
            <li>Chính sách bảo mật thanh toán</li>
            <li>Giới thiệu Bách Khoa Sách</li>
            <li>Liên hệ:</li>
            <div class="contact">
              <i class="fas fa-map-marker-alt"></i>
              <span> 60-62 Lê Lợi, Q.1, TP. HCM</span>
            </div>
          </div>

          <div class="col-lg-4">
            <div class="title">HỖ TRỢ</div>
            <li>Chính sách đổi trả hoàn tiền</li>
            <li>Chính sách bảo mật</li>
            <li>Chính sách vận chuyển</li>

            <li>CSKH:</li>
            <div class="care">
              <i class="fas fa-phone"></i>
              <span> cskh@bks.com.vn</span>
            </div>
          </div>

          <div class="col-lg-4">
            <div class="title">TÀI KHOẢN CỦA TÔI</div>
            <li>Đăng nhập/ Tạo mới tài khoản</li>
            <li>Thay đổi địa chỉ khách hàng</li>
            <li>Chi tiết tài khoản</li>
            <li>Lịch sử mua hàng</li>
            <li>SĐT:</li>
            <div class="phone-number">
              <i class="fas fa-mobile-alt"></i>
              <span> 1900636467</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import "../css-component/footer-app.css";

export default {
  name: "FooterApp",
  props: {
    darkMode: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isDarkMode: false, // Trạng thái dark mode, mặc định là false (light mode)
    };
  },
};
</script>
