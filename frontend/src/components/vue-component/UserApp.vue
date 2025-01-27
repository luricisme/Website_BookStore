<template>
  <div id="user-app-root" style="cursor: default" :class="{ 'dark-mode': darkMode, 'light-mode': !darkMode }">

    <div v-if="notification" class="notification">{{ notification }}</div>
    
    <HeaderApp @user-loaded="setUser" @toggle-dark-mode="setDarkMode" />
    <NavApp :categories="categories" :subcategories="subcategories" />
    
    <main class="content">
      <router-view :user="user"/>
    </main>

    <FooterApp :dark-mode="darkMode" />
    <!-- <ChatBox /> -->
  </div>
</template>

<script>
import "../css-component/user-app.css";


import HeaderApp from "./HeaderApp.vue";
import NavApp from "./NavApp.vue";
import FooterApp from "./FooterApp.vue";
//import ChatBox from "./ChatBox.vue";

export default {
  name: "UserApp",
  components: {
    HeaderApp,
    NavApp,
    FooterApp,
    // ChatBox,
  },
  data() {
    return {
      notification: "TẾT ĐOÀN VIÊN - TẾT SUM VẦY - GIẢM GIÁ MỪNG XUÂN ẤT TỴ",
      categories: [],
      subcategories: [],
      user: null,
      // Trạng thái darkmode
      darkMode: false,
    };
  },
  methods: {
    setUser(user) {
      this.user = user; // Nhận user từ HeaderApp
    },
    setDarkMode(is) {
      console.log('fadsfasdf:', this.darkMode);
      this.darkMode = is; // Cập nhật trạng thái Dark Mode từ FooterApp
    },
  },
};
</script>
