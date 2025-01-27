<template>
  <div class="product-card">
    <img :src="img" :alt="name" class="product-image" />
    <div class="product-title">{{ name }}</div>
    <div class="product-new-price-info">
      <span class="new-price">{{ formattedNewPrice }} {{ type_money }}</span>
      <span class="discount-tag">-{{ discountPercentage }}%</span>
    </div>
    <div class="old-price">{{ formattedOldPrice }} {{ type_money }}</div>
  </div>
</template>

<script>
import '../css-component/product-card.css';

export default {
  name: "ProductCard",
  props: ["img", "name", "old_price", "new_price", "type_money"],
  computed: {
    formattedOldPrice() {
      // Đảm bảo rằng giá là một chuỗi hoặc số hợp lệ trước khi định dạng
      let formattedPrice = parseFloat(this.old_price)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      return formattedPrice; // Trả về giá đã được định dạng
    },
    // Định dạng giá mới trực tiếp trong computed
    formattedNewPrice() {
      let formattedPrice = parseFloat(this.new_price)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      return formattedPrice; // Trả về giá đã được định dạng
    },
    // Tính toán phần trăm giảm giá
    discountPercentage() {
      let discount = ((this.old_price - this.new_price) / this.old_price) * 100;
      return discount.toFixed(0);
    },
  },
};
</script>