<template>
  <div class="top-seller-container">
    <div class="top-seller-label">
      <i class="fas fa-trophy"></i>
      <div>SÁCH BÁN CHẠY</div>
    </div>

    <div v-if="loading" class="spinner"></div>
    <div v-else>
      <div class="top-seller-book-list-container">
        <ProductCard
          v-for="(product, index) in arrayBook"
          :key="index"
          :img="product.images[0]"
          :name="product.book_name"
          :old_price="product.list_price"
          :new_price="product.discounted_price"
          :type_money="type_money"
          @click="goDetail(product.id_book)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import "../css-component/top-seller.css";
import axios from "axios";

import ProductCard from "./ProductCard.vue";

export default {
  name: "TopSeller",
  components: {
    ProductCard,
  },
  data() {
    return {
      loading: false,
      type_money: "đ",
      arrayBook: [],
    };
  },
  methods: {
    async getApi() {
      this.loading = true;
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_URL}/top-book`); // Lấy API qua proxy

        if (response.data.success) {
          this.arrayBook = response.data.topBooks;
        }
      } catch (error) {
        this.error = "Không thể lấy thông tin sách!";
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    goDetail(id) {
      this.$router.push({
        path: `/book`,
        query: { id_book: id },
      });
    },
  },
  mounted() {
    this.getApi();
  },
};
</script>
