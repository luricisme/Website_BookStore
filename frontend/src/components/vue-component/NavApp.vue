<template>
  <div class="nav">
    <div class="nav-product nav-tab" @click="menuClick" @mouseleave="hideMenu">
      <i class="fas fa-bars nav-menu"></i>
      <div>TẤT CẢ SẢN PHẨM</div>
      <div class="menuBox" v-if="menuVisible">
        <div
          class="menuItem"
          v-for="(item, index) in genres"
          :key="index"
          @mouseover="showSubmenu(index)"
          @mouseleave="hideSubmenu"
          @click="genre(item.id_category, item.name)"
        >
          {{ item.name }}
        </div>
      </div>
    </div>
    <div class="nav-intro nav-tab" @click="goToIntro">GIỚI THIỆU</div>
    <div class="nav-news nav-tab" @click="goToNew">
      TIN TỨC
    </div>
    <!-- <div class="nav-review nav-tab" @click="isModalReview = !isModalReview">
      REVIEW
    </div> -->
    <div class="nav-colab nav-tab" @click="goToColab">
      HỢP TÁC
    </div>
    <div class="nav-lookUp nav-tab" @click="goToLookup">
      TRA CỨU ĐƠN
    </div>
  
  </div>
</template>

<script>
import "../css-component/nav-app.css";
import axios from "axios";

export default {
  name: "NavApp",
  data() {
    return {
      isModalIntro: false,
      isModalNew: false,
      isModalReview: false,
      isModalColab: false,
      isModalLookup: false,
      menuVisible: false,
      activeCategory: {},
      genres: [],
    };
  },
  props: ["categories", "subcategories"],
  methods: {
    goToNew(){
    this.$router.push("/new");
    },
    goToIntro() {
      this.$router.push("/intro");
    },
    goToColab() {
      this.$router.push("/colab");
    },
    goToLookup() {
      this.$router.push("/lookup");
    },
    menuClick() {
      if (this.menuVisible === false) {
        // Ẩn hiện menu khi ấn nút
        this.menuVisible = true;
      } else {
        this.menuVisible = false;
      }
    },
    hideMenu() {
      this.menuVisible = false; // Ẩn menu khi rời
    },
    showSubmenu(index) {
      this.activeCategory = index; // Hiện submenu danh mục đang hover
    },
    hideSubmenu() {
      this.activeCategory = null; // ẩn submenu khi rời
    },
    async fetchGenres() {
      try {
        const response = await axios.get("/api/genres"); // Thực hiện GET request
        this.genres = response.data.genres; // Gán dữ liệu trả về cho `genres`
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    },
    genre(id, genre) {
      this.$router.push({
        path: `/genre`,
        query: { id_genre: id, genre },
      });
    },
  },
  mounted() {
    this.fetchGenres();
  },
};
</script>

<style scoped>
.modal.fade {
  display: block;
}

.modal-dialog {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh; /* Chiều cao tràn màn hình */
  width: 100%; /* Chiều rộng tràn màn hình */
}

.modal-fullscreen {
  max-width: 100%;
  margin: 0;
}

.modal-content {
  width: 100%; /* Đảm bảo nội dung modal chiếm hết màn hình */
  max-height: 80%;
  overflow-y: auto; 
}
</style>
