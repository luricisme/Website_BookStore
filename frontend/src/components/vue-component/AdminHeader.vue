<template>
  <div class="admin-header">
    <div v-if="isLoading" class="loading-overlay">
      <div
        class="spinner-border text-primary"
        style="width: 3rem; height: 3rem"
        role="status"
      >
        <span class="sr-only">Loading...</span>
      </div>
    </div>

    <router-link to="/admin/dashboard"
      ><div class="admin-header-logo-box text-primary">
        <i class="fas fa-book"></i>
        <div class="admin-header-logo-text">BÁCH KHOA SÁCH</div>
      </div></router-link
    >
    <div class="col border-2 border-start border-end h-50"></div>
    <div class="admin-header-user-box">
      <img
        src="/IMG/default_avatar.png"
        alt="Avatar"
        class="admin-header-avatar"
      />
      <div class="text-primary fw-bold mx-3">{{ name }}</div>
      <i
        class="fa-solid fa-arrow-right-from-bracket"
        :class="{ 'text-primary': hoverLogout, 'text-muted': !hoverLogout }"
        style="cursor: pointer"
        @mouseenter="hoverLogout = true"
        @mouseleave="hoverLogout = false"
        @click="handleLogOut"
      ></i>
    </div>
  </div>
</template>

<script>
import "../css-component/admin-header.css";
import axiosInstance from "../../services/axiosInstance.js";

export default {
  name: "AdminHeader",
  data() {
    return {
      hoverLogout: false,
      name: null,

      isLoading: false,
    };
  },
  mounted() {
    this.handleRouteChange(); // Thực hiện xử lý khi component được mount
  },
  watch: {
    $route() {
      this.handleRouteChange();
    },
  },
  methods: {
    async handleRouteChange() {
      try {
        // Gửi yêu cầu để lấy xem người dùng có đang đăng nhập không
        const response = await axiosInstance.get("/account/profile");
        if (response.status === 200) {
          const user = response.data.user;
          this.name = user.name;

          // Nếu là người dùng thường thì đẩy về trang user
          if (user.role === "1") {
            alert("Bạn phải là admin để truy cập vào đường dẫn này!");
            this.$router.push("/");
          }
        }
      } catch (error) {
        if (error.response) {
          const status = error.response.status;
          const message = error.response.data.message;

          // Xử lý các mã lỗi cụ thể
          if (status === 404) {
            // Nếu lỗi là ko có người dùng hoặc không hợp lệ thì đẩy về login
            this.$router.push("/login");
          } else if (status === 500) {
            alert(message);
            this.$router.push("/login");
          }
        } else {
          // Xử lý lỗi nếu không có phản hồi (chẳng hạn lỗi kết nối mạng)
          alert("Lỗi mạng: Không thể kết nối đến server.");
        }
      }
    },

    async handleLogOut() {
      try {
        this.isLoading = true;

        const response = await axiosInstance.post("/logout");
        if (response.status === 204) {
          localStorage.removeItem("accessToken");

          this.isLoading = false;
          this.$router.push("/login");
        }
      } catch (error) {
        this.isLoading = false;

        alert(error);
        this.$router.push("/login");
      }
    },
  },
};
</script>