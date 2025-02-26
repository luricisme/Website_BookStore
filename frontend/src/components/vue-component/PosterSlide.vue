<template>
  <div id="posterSlide" class="carousel slide" data-bs-ride="carousel">
    <div class="carousel-indicators">
      <button
        type="button"
        data-bs-target="#posterSlide"
        :data-bs-slide-to="index"
        :aria-label="'Slide' + (index + 1)"
        v-for="(poster, index) in poster"
        :key="index"
        :class="{ active: index === 0 }"
        :aria-current="index === 0 ? 'true' : 'false'"
      ></button>
    </div>
    <div v-if="loading" class="spinner"></div>
    <div v-else class="carousel-inner h-100">
      <div
        class="carousel-item h-100"
        v-for="(poster, index) in poster"
        :key="index"
        :class="{ active: index === 0 }"
      >
        <img
          :src="poster.image_link"
          class="d-block w-100 h-100 hover-effect"
          alt="poster"
          @click="linkTo(poster.product_link)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import "../css-component/poster-slide.css";
import axios from "axios";

export default {
  name: "PosterSlide",
  data() {
    return {
      poster: [],
      type_money: "đ",
      loading: false,
      kinhTe: [],
      giaDinh: [],
      khoaHoc: [],
      giaoDuc: [],
      vanHoc: [],
      selectedTab: "skill", // Mặc định là tab "SÁCH TƯ DUY - KỸ NĂNG"
    };
  },
  methods: {
    goDetail(id) {
      this.$router.push({
        path: `/book`,
        query: { id_book: id },
      });
    },
    async getApi() {
      this.loading = true;
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_URL}/poster`); // Lấy API qua proxy

        if (response.data.success) {
          this.poster = response.data.posters;
          console.log("poster:", this.poster);
        }
      } catch (error) {
        this.error = "Không thể lấy thông tin sách!";
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    selectTab(tab) {
      this.selectedTab = tab;
    },
    linkTo(path){
      console.log(path);
      this.$router.push(`${path}`);
    }
  },
  mounted() {
    this.getApi();
  },
};
</script>
<style scoped>
/* Lớp CSS khi hover */
.hover-effect {
  transition: transform 0.3s ease, opacity 0.3s ease; /* Thêm hiệu ứng chuyển động mượt mà */
}

.hover-effect:hover {
  transform: scale(1.05); /* Phóng to ảnh khi hover */
  opacity: 0.8; /* Giảm độ sáng của ảnh khi hover */
  cursor: pointer;
}
</style>

