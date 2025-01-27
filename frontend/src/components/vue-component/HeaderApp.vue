<template>
  <div class="header" :class="{ dark: darkMode, light: !darkMode }">
    <div v-if="isLoading" class="loading-overlay">
      <div
        class="spinner-border text-primary"
        style="width: 3rem; height: 3rem"
        role="status"
      >
        <span class="sr-only">Loading...</span>
      </div>
    </div>

    <div class="grid-item-logo">
      <router-link to="/"
        ><i
          class="fas fa-book"
          :class="{ dark: darkMode, light: !darkMode }"
        ></i
      ></router-link>

      <div class="header-logo">BÁCH KHOA SÁCH</div>
    </div>

    <div style="display: flex; flex-direction: column; justify-content: center">
      <div class="grid-item-search">
        <input
          class="input"
          type="text"
          id="myInput"
          name="myInput"
          placeholder="Bạn muốn đọc sách gì..."
          v-model="searchQuery"
          @keyup.enter="search"
        />
        <div class="glass" @click="search"><i class="fas fa-search"></i></div>
      </div>
    </div>

    <div class="grid-item-icon">
      <!-- <div
        class="iconNoti"
        @mouseenter="notiVisible = true"
        @mouseleave="notiVisible = false"
      >
        <i type="button" class="fas fa-bell"></i>
        <div v-if="notiVisible" class="notiBox">
          <div class="notiBoxHeader">
            <div>Thông báo</div>
            <div class="notiBoxTxtAllNoti" type="button">Xem tất cả</div>
          </div>
           <div class="notiItemList">
            <div class="notiItem">
              <div class="notiItemTitle">Thông báo số 1</div>
              <div class="notiItemContent">hello Thong báo đây lo</div>
            </div>
            <div class="notiItem">
              <div class="notiItemTitle">Thông báo số 2</div>
              <div class="notiItemContent">
                hello Thong báo số 2 đây ai không muốn học thì đi về, không làm
                thì ngủ aaaaaaaaaaaa về nhà... mà cãi nhaoaaaaaaaaa
                aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa aaa
              </div>
            </div>
            <div class="notiItem">
              <div class="notiItemTitle">Thông báo nghỉ học</div>
              <div class="notiItemContent">hello cả nhà yêu của kem</div>
            </div>
            <div class="notiItem">
              <div class="notiItemTitle">Bạn có một tin nhắn chưa đọc</div>
              <div class="notiItemContent">hello Thong báo đây lo</div>
            </div>
            <div class="notiItem">
              <div class="notiItemTitle">Thông báo số 5</div>
              <div class="notiItemContent">hello haizzz đây lo</div>
            </div>
          </div> 
          <div class="text-secondary p-3 fs-5 fw-bold">
            Chức năng chưa phát triển
          </div>
        </div>
      </div> -->

      <div id="theme-toggle" @click="toggleDarkMode" class="iconDarkMode">
        <i
          class="fas"
          id="icon"
          :class="{ 'fa-sun': !darkMode, 'fa-moon': darkMode }"
        ></i>
      </div>

      <div class="iconCart">
        <i type="button" class="fas fa-shopping-cart" @click="goToCart"></i>
      </div>
      <div
        class="iconUser"
        @mouseenter="userVisible = true"
        @mouseleave="userVisible = false"
      >
        <i type="button" class="fas fa-user" @click="goToProfileInfo"></i>
        <div v-if="userVisible" class="userBox">
          <div class="userBoxLogined" v-if="name">
            <div
              class="userBoxHeader"
              :class="{ 'text-primary': userHoverOption === 'info' }"
              style="cursor: pointer"
              @mouseenter="userHoverOption = 'info'"
              @mouseleave="userHoverOption = null"
              @click="goToProfileInfo"
            >
              <div class="userInfor">
                <div class="userAvatar">
                  <img src="/IMG/default_avatar.png" alt="default avatar" />
                </div>

                <div
                  class="userName"
                  :class="{
                    'text-primary': userHoverOption === 'info',
                    'text-body-secondary': userHoverOption !== 'info',
                  }"
                >
                  {{ name }}
                </div>
              </div>
              <i class="fa-solid fa-angle-right ms-3"></i>
            </div>

            <div
              class="userItem"
              :class="{ 'text-primary': userHoverOption === 'order' }"
              style="cursor: pointer"
              @mouseenter="userHoverOption = 'order'"
              @mouseleave="userHoverOption = null"
              @click="goToProfileOrder"
            >
              <i class="fa-solid fa-receipt"></i>Đơn hàng của tôi
            </div>

            <div
              class="userItem"
              :class="{ 'text-primary': userHoverOption === 'address' }"
              style="cursor: pointer"
              @mouseenter="userHoverOption = 'address'"
              @mouseleave="userHoverOption = null"
              @click="goToProfileAddress"
            >
              <i class="fa-solid fa-location-dot"></i>Sổ địa chỉ
            </div>

            <div
              class="userItem"
              :class="{ 'text-primary': userHoverOption === 'changePW' }"
              style="cursor: pointer"
              @mouseenter="userHoverOption = 'changePW'"
              @mouseleave="userHoverOption = null"
              @click="goToProfileChangepw"
            >
              <i class="fa-solid fa-lock"></i>Thay đổi mật khẩu
            </div>

            <div
              class="userItem"
              :class="{ 'text-primary': userHoverOption === 'logout' }"
              style="cursor: pointer"
              @click="handleLogOut"
              @mouseenter="userHoverOption = 'logout'"
              @mouseleave="userHoverOption = null"
            >
              <i class="fa-solid fa-arrow-right-from-bracket"></i>Đăng xuất
            </div>
          </div>
          <div class="userBoxNotLogined p-3" v-else>
            <div class="mb-3">
              <router-link to="/login"
                ><button type="button" class="btn btn-primary w-100">
                  Đăng nhập
                </button></router-link
              >
            </div>
            <div>
              <router-link to="/register"
                ><button type="button" class="btn btn-danger w-100">
                  Đăng ký
                </button></router-link
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "../css-component/header-app.css";
import axiosInstance from "../../services/axiosInstance.js";

export default {
  name: "HeaderApp",
  data() {
    return {
      darkMode: false,
      searchQuery: "", // Lưu trữ giá trị tìm kiếm
      notiVisible: false,
      userVisible: false,
      name: null,
      userHoverOption: null,

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
    toggleDarkMode() {
      this.darkMode = !this.darkMode;
      this.$emit("toggle-dark-mode", this.darkMode); // Truyền trạng thái lên UserApp
    },
    search() {
      const stringSearch = this.searchQuery.trim();
      this.searchQuery = "";
      if (stringSearch) {
        // Chuyển đến route /search với query parameter là giá trị nhập vào
        this.$router.push({
          path: "/search",
          query: { query: stringSearch },
        });
      }
    },
    async handleLogOut() {
      try {
        this.isLoading = true;
        const response = await axiosInstance.post("/logout");
        if (response.status === 204) {
          this.name = null;
          localStorage.removeItem("accessToken");
          this.isLoading = false;
          this.$router.push("/login");
        }
      } catch (error) {
        this.isLoading = false;
        // Nếu lỗi là ko có người dùng hoặc không hợp lệ thì không gán name, header sẽ không hiện người dùng
        alert(error);
        return;
      }
    },
    async handleRouteChange() {
      try {
        // Gửi yêu cầu để lấy xem người dùng có đang đăng nhập không
        const response = await axiosInstance.get("/account/profile");
        if (response.status === 200) {
          const user = response.data.user;
          this.name = user.name;

          this.$emit("user-loaded", user);
          console.log(user);

          if (
            this.$route.path === "/login" ||
            this.$route.path === "/register"
          ) {
            // Nếu người dùng đã đăng nhập và đang ở login/register, điều hướng đến trang chủ
            this.$router.push("/");
          }
        }
      } catch (error) {
        // Nếu lỗi là ko có người dùng hoặc không hợp lệ thì không gán name, header sẽ không hiện người dùng
        this.name = null;
      }
    },
    goToProfileInfo() {
      this.$router.push("/profile/info");
    },
    goToProfileOrder() {
      this.$router.push("/profile/order");
    },
    goToProfileAddress() {
      this.$router.push("/profile/address");
    },
    goToProfileChangepw() {
      this.$router.push("/profile/changePW");
    },
    goToCart() {
      this.$router.push("/cart");
    },
  },
};
</script>
