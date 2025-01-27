<template>
  <div class="profile-body">
    <div class="profile-side-box">
      <div class="profile-side-header">
        <img
          src="/IMG/default_avatar.png"
          alt="Avatar"
          class="profile-side-avatar"
        />
        <div class="profile-side-name">{{ savedName }}</div>
      </div>
      <div class="profile-side-body">
        <div
          class="profile-side-tab border rounded-3"
          :class="{
            'border-white': activeTab !== 'info',
            'text-primary border-primary': activeTab === 'info',
            'text-primary': hoverTab === 'info',
          }"
          @mouseenter="hoverTab = 'info'"
          @mouseleave="hoverTab = null"
          @click="switchTab('info')"
        >
          <i class="fa-solid fa-user me-2"></i> Thông tin tài khoản
        </div>

        <div
          class="profile-side-tab border rounded-3"
          :class="{
            'border-white': activeTab !== 'address',
            'text-primary border-primary': activeTab === 'address',
            'text-primary': hoverTab === 'address',
          }"
          @mouseenter="hoverTab = 'address'"
          @mouseleave="hoverTab = null"
          @click="switchTab('address')"
        >
          <i class="fa-solid fa-location-dot me-2"></i> Sổ địa chỉ
        </div>

        <div
          class="profile-side-tab border rounded-3"
          :class="{
            'border-white': activeTab !== 'order',
            'text-primary border-primary': activeTab === 'order',
            'text-primary': hoverTab === 'order',
          }"
          @mouseenter="hoverTab = 'order'"
          @mouseleave="hoverTab = null"
          @click="switchTab('order')"
        >
          <i class="fa-solid fa-receipt me-2"></i> Đơn hàng của tôi
        </div>

        <div
          class="profile-side-tab border rounded-3"
          :class="{
            'border-white': activeTab !== 'bankaccount',
            'text-primary border-primary': activeTab === 'bankaccount',
            'text-primary': hoverTab === 'bankaccount',
          }"
          @mouseenter="hoverTab = 'bankaccount'"
          @mouseleave="hoverTab = null"
          @click="switchTab('bankaccount')"
        >
          <i class="fa-solid fa-money-check me-2"></i> Tài khoản ngân hàng
        </div>

        <div
          class="profile-side-tab border rounded-3"
          :class="{
            'border-white': activeTab !== 'changePW',
            'text-primary border-primary': activeTab === 'changePW',
            'text-primary': hoverTab === 'changePW',
          }"
          @mouseenter="hoverTab = 'changePW'"
          @mouseleave="hoverTab = null"
          @click="switchTab('changePW')"
        >
          <i class="fa-solid fa-lock me-2"></i> Đổi mật khẩu
        </div>
      </div>
    </div>

    <div class="profile-detail-box">
      <div class="d-flex justify-content-between pb-4">
        <div class="profile-detail-title">
          <span v-if="activeTab === 'info'">Thông Tin Tài Khoản</span>
          <span v-if="activeTab === 'address'">
            <span v-if="!action">Sổ Địa Chỉ</span>
            <span v-if="action === 'add'">Thêm Địa Chỉ</span>
            <span v-if="action === 'edit'">Sửa Địa Chỉ</span>
          </span>
          <span v-if="activeTab === 'order'">Đơn Hàng Của Tôi</span>
          <span v-if="activeTab === 'bankaccount'">Tài Khoản Ngân Hàng</span>
          <span v-if="activeTab === 'changePW'">Đổi Mật Khẩu</span>
        </div>
        <router-link to="/profile/address/add">
          <div
            class="btn btn-outline-primary"
            v-if="!action && activeTab === 'address'"
          >
            + Thêm địa chỉ mới
          </div></router-link
        >
      </div>

      <router-view />
    </div>
  </div>
</template>

<script>
import "../css-component/profile.css";
import axiosInstance from "../../services/axiosInstance.js";

export default {
  name: "ProfilePage",
  data() {
    return {
      activeTab: "info", //Mục đang hiển thị
      action: null, //Mục con trong tab

      hoverTab: null,

      savedName: null,
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
    switchTab(tab) {
      this.$router.push(`/profile/${tab}`);
    },
    async handleRouteChange() {
      const paths = this.$route.path.split("/"); // Lấy tab từ URL
      const basePathIndex = paths.findIndex((path) => path === "profile"); // Xác định vị trí "profile"

      this.activeTab = paths[basePathIndex + 1] || "info"; // Tab
      this.action = paths[basePathIndex + 2] || null;

      try {
        // Gửi yêu cầu để lấy thông tin người dùng
        const response = await axiosInstance.get("/account/profile");
        if (response.status === 200) {
          const user = response.data.user;
          this.savedName = user.name;
        }
      } catch (error) {
        console.log(error);
        if (error.response.status === 401 || error.response.status === 403) {
          // Không có accesstoken hoặc refreshtoken hết hạn
          this.$router.push("/login");
        }
        if (error.response.status === 404) {
          // Không tìm thấy người dùng
          this.$router.push("/login");
        }
        if (error.response.status === 500) {
          // Có lỗi trong quá trình lấy thông tin người dùng
          alert(error.response.data.message);
        }
      }
    },
  },
};
</script>
