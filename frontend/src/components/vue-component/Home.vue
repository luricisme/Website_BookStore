<template>
  <div class="home-container">
    <div class="ctn-row">
      <PosterSlide />
    </div>
    <div class="ctn-row">
      <TopSeller />
    </div>
    <div class="ctn-row">
      <CategoryBook />
    </div>
  </div>
</template>

<script>
import "../css-component/home.css";
import PosterSlide from "../vue-component/PosterSlide.vue";
import TopSeller from "../vue-component/TopSeller.vue";
import CategoryBook from "../vue-component/CategoryBook.vue";
import axiosInstance from "../../services/axiosInstance.js";

export default {
  name: "HomePage",
  components: {
    PosterSlide,
    TopSeller,
    CategoryBook,
  },
  data() {
    return {};
  },
  mounted() {
    this.handleRouteChange();
  },
  watch: {
    $route() {
      this.handleRouteChange();
    },
  },
  methods: {
    async handleRouteChange() {
      const token = this.$route.query.accessToken;
      const status = this.$route.query.status;
      if (status === '200') {
        if (token) {
          console.log("Access Token:", token);

          // Lưu vào localStorage
          localStorage.setItem("accessToken", token);

          // Xóa accessToken khỏi URL để tránh hiển thị dư thừa
          this.$router.replace({ query: null });

          try {
            // Gửi yêu cầu để lấy xem người dùng có đang đăng nhập không
            const response = await axiosInstance.get("/account/merge-cart");
            console.log(response);

          } catch (error) {
            console.log(error);
          }
        }
      } else if (status === '401') {
        this.$router.replace({ query: null });
        this.$router.push("/login");
      } else if (status === '500') {
        this.$router.replace({ query: null });
        this.$router.push("/login");
      }
    },
  },
};
</script>


