<template>
  <div class="search-container">
    <div class="filter-box">
      <div class="filter-box-title">Bộ lọc tìm kiếm</div>

      <div class="filter-cate">
        <div class="fw-bold">Thể loại</div>

        <div
          v-for="category in categories"
          :key="category.id_category"
          class="form-check"
        >
          <input
            class="form-check-input"
            type="checkbox"
            :value="category.id_category"
            :id="'cb' + category.id_category"
            :data-id="category.id_category"
            v-model="selectedCategories"
            @change="handleFillter"
          />
          <label class="form-check-label" :for="'cb' + category.id_category">
            {{ category.name }}
          </label>
        </div>
      </div>

      <div class="filter-cate">
        <div class="fw-bold">Mức giá</div>
        <!-- Tất cả mức giá -->
        <div class="form-check">
          <input
            class="form-check-input"
            type="radio"
            name="filterPrice"
            id="rb0"
            value="all"
            v-model="selectedPrice"
            @change="handleFillter"
          />
          <label class="form-check-label" for="rb0"> Tất cả mức giá</label>
        </div>

        <!-- Các khoảng giá -->
        <div
          class="form-check"
          v-for="(range, index) in priceRanges"
          :key="index"
        >
          <input
            class="form-check-input"
            type="radio"
            name="filterPrice"
            :id="'rb' + (index + 1)"
            :value="range"
            v-model="selectedPrice"
            @change="handleFillter"
          />
          <label class="form-check-label" :for="'rb' + (index + 1)">
            {{ range.label }}
          </label>
        </div>
      </div>

      <div class="filter-cate">
        <div class="fw-bold">Độ tuổi</div>

        <div v-for="(age, index) in ages" :key="index" class="form-check">
          <input
            class="form-check-input"
            type="checkbox"
            :value="age"
            :id="'cb' + index"
            :data-age="age"
            v-model="selectedAge"
            @change="handleFillter"
          />
          <label class="form-check-label" :for="'cb' + index">
            {{ age }}
          </label>
        </div>
      </div>
    </div>

    <div class="search-result-box">
      <div class="search-result-title">
        Kết quả tìm kiếm :
        <span class="text-primary">{{ this.searchQuery }}</span>
      </div>

      <div class="filter-order-box">
        <span class="text-secondary">Sắp xếp theo</span>
        <input
          type="checkbox"
          class="btn-check"
          name="filterOrder"
          id="rbnew"
          :checked="selectedRadio === 'discounted_price'"
          @click="toggleFilter('discounted_price')"
        />
        <label class="btn btn-outline-primary" for="rbnew">Giá hiện tại</label>

        <input
          type="checkbox"
          class="btn-check"
          name="filterOrder"
          id="rbhot"
          :checked="selectedRadio === 'sold_quantity'"
          @click="toggleFilter('sold_quantity')"
        />
        <label class="btn btn-outline-warning" for="rbhot"
          >Số lượng đã bán</label
        >

        <input
          type="checkbox"
          class="btn-check"
          name="filterOrder"
          id="rbpricel2h"
          :checked="selectedRadio === 'rating_count'"
          @click="toggleFilter('rating_count')"
        />
        <label class="btn btn-outline-success" for="rbpricel2h"
          >Điểm rating</label
        >

        <!-- Radio button for sorting price from low to high (tăng dần) -->
        <input
          type="radio"
          class="btn-check"
          name="filterOrder"
          id="rbpriceasc"
          :checked="typeSort === 'asc'"
          @click="toggleTypeSort('asc')"
        />
        <label class="btn btn-outline-danger" for="rbpriceasc"
          >Thấp đến cao ▲</label
        >

        <!-- Radio button for sorting price from high to low (giảm dần) -->
        <input
          type="radio"
          class="btn-check"
          name="filterOrder"
          id="rbpricedesc"
          :checked="typeSort === 'desc'"
          @click="toggleTypeSort('desc')"
        />
        <label class="btn btn-outline-danger" for="rbpricedesc"
          >Cao đến thấp ▼</label
        >
      </div>

      <!-- Vòng tròn quay khi đang tải -->
      <div v-if="isLoading" class="search-loading-spinner">
        <div class="spinner-border" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>

      <div class="search-result-list">
        <ProductCard
          v-for="(book, index) in arrayBook.slice(0, 8)"
          :key="index"
          :img="book.images[0]"
          :name="book.book_name"
          :old_price="book.list_price"
          :new_price="book.discounted_price"
          :type_money="type_money"
          @click="goDetail(book.id_book)"
        />
      </div>

      <div
        v-if="arrayBook.length"
        class="pagination d-flex justify-content-center align-items-center"
      >
        <!-- Nút Previous -->
        <button
          class="btn btn-secondary me-2"
          @click="goToPage(page - 1)"
          :disabled="page === 1"
        >
          «
        </button>

        <!-- Hiển thị các trang với logic -->
        <div class="btn-group" role="group" aria-label="Pagination Buttons">
          <button
            v-if="1 !== pageRange[0]"
            class="btn btn-outline-primary"
            @click="goToPage(1)"
          >
            1
          </button>

          <span v-if="pageRange[0] > 2" class="px-2">...</span>

          <button
            v-for="n in pageRange"
            :key="n"
            class="btn"
            :class="n === page ? 'btn-primary' : 'btn-outline-primary'"
            @click="goToPage(n)"
          >
            {{ n }}
          </button>

          <span
            v-if="pageRange[pageRange.length - 1] < totalPage - 1"
            class="px-2"
            >...</span
          >

          <button
            v-if="totalPage !== pageRange[pageRange.length - 1]"
            class="btn btn-outline-primary"
            @click="goToPage(totalPage)"
          >
            {{ totalPage }}
          </button>
        </div>

        <!-- Nút Next -->
        <button
          class="btn btn-secondary ms-2"
          @click="goToPage(page + 1)"
          :disabled="page === totalPage"
        >
          »
        </button>
      </div>

      <div
        v-else
        class="d-flex flex-column align-items-center justify-content-center text-center py-5"
      >
        <h4 class="text-danger font-weight-bold">Không tìm thấy kết quả!</h4>
        <p class="text-muted">
          Xin lỗi, không có dữ liệu nào phù hợp với tìm kiếm của bạn. <br />
          Hãy thử lại với thể loại khác.
        </p>

      </div>
    </div>
  </div>
</template>

<script>
import "../css-component/search.css";
import ProductCard from "./ProductCard.vue";
import axios from "axios"; // Import axios nếu bạn dùng axios để gọi API

export default {
  name: "SearchPage",
  components: {
    ProductCard,
  },
  data() {
    return {
      sortBy: "",
      typeSort: "asc",
      selectedRadio: "",
      selectedPrice: "all", // Mặc định là "Tất cả mức giá"
      priceRanges: [
        { label: "0đ - 50,000đ", startPrice: 0, endPrice: 50000 },
        { label: "50,000đ - 100,000đ", startPrice: 50000, endPrice: 100000 },
        { label: "100,000đ - 250,000đ", startPrice: 100000, endPrice: 250000 },
        { label: "250,000đ - 500,000đ", startPrice: 250000, endPrice: 500000 },
        { label: "500,000đ trở lên", startPrice: 500000, endPrice: null },
      ],
      isLoading: false,

      categories: [],
      ages: ["Child", "Teen", "Adult"],
      selectedCategories: [],
      selectGenre: null,
      selectAge: null,
      startPrice: null,
      endPrice: null,

      selectedAge: [],
      type_money: "đ",
      page: 1,
      arrayBook: [],
      totalPage: 0,
      perPage: 0,
      totalRecord: 0,
      curentRecord: 0,

      products_skill: [],
      searchQuery: "",
      isfillter: false,
    };
  },

  mounted() {
    // Lấy giá trị query từ URL khi trang được tải lần đầu
    const query = this.$route.query.query;
    this.searchQuery = query || ""; // Lưu giá trị tìm kiếm vào biến searchQuery

    // Gọi API với giá trị query lấy từ URL
    this.fetchProducts();
    console.log("start price", this.startPrice);
    console.log("end price", this.endPrice);
    this.fetchGenres();
  },

  watch: {
    // Theo dõi sự thay đổi của query trong URL
    "$route.query.query": "handleQueryChange",
  },

  methods: {
    isFillter() {
      if (
        this.selectGenre === null &&
        this.selectAge === null &&
        this.startPrice === null &&
        this.endPrice === null &&
        this.sortBy === null
      ) {
        return false;
      } else {
        return true;
      }
    },
    goDetail(id) {
      this.$router.push({
        path: `/book`,
        query: { id_book: id },
      });
    },
    handleFillter() {
      this.handleCheckboxChange();
      this.handlePriceChange();
      this.page = 1;
      this.fetchData();
    },
    handlePriceChange() {
      if (this.selectedPrice === "all") {
        this.startPrice = "";
        this.endPrice = "";
      } else {
        const { startPrice, endPrice } = this.selectedPrice;
        this.startPrice = startPrice;
        this.endPrice = endPrice;
      }
    },
    handleCheckboxChange() {
      // Kiểm tra nếu có nhiều hơn một category được chọn

      if (this.selectedCategories.length >= 1) {
        // Nếu có, chỉ giữ lại category cuối cùng được chọn
        const lastSelected = this.selectedCategories.pop();
        this.selectedCategories = [lastSelected];
        this.selectGenre = [lastSelected];
        console.log("genre", this.selectGenre);
      } else {
        this.selectGenre = null;
      }
      if (this.selectedAge.length >= 1) {
        const lastSelectedAge = this.selectedAge.pop();
        this.selectedAge = [lastSelectedAge];
        this.selectAge = [lastSelectedAge];
        console.log("age", this.selectAge);
      } else {
        this.selectAge = null;
      }
    },

    fetchData() {
      this.isLoading = true;

      if (this.selectGenre === null) {
        this.selectGenre = "";
      }

      if (this.selectAge === null) {
        this.selectAge = "";
      }

      if (this.startPrice === null) {
        this.startPrice = "";
      }

      if (this.endPrice === null) {
        this.endPrice = "";
      }

      if (this.sortBy === null) {
        this.sortBy = "";
      }

      if (this.typeSort === null) {
        this.typeSort = "";
      }

      const url = `${process.env.VUE_APP_API_URL}/search/filter?keyword=${this.searchQuery}&page=${this.page}&genre=${this.selectGenre}&age=${this.selectAge}&startPrice=${this.startPrice}&endPrice=${this.endPrice}&${this.sortBy}=${this.typeSort}`;
      console.log(url);
      axios
        .get(url)
        .then((response) => {
          this.arrayBook = response.data.data;
          this.curentRecord += this.arrayBook.length;

          this.totalPage = response.data.total_pages;
          this.perPage = response.data.per_page;
          this.totalRecord = response.data.total_records;
          this.page = response.data.current_page;
        })
        .catch((error) => {
          console.error("Có lỗi xảy ra khi gọi API:", error);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    async fetchGenres() {
      try {
        const response = await axios.get("${process.env.VUE_APP_API_URL}/genres"); // Thực hiện GET request
        this.categories = response.data.genres;
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    },
    toggleFilter(value) {
      // Kiểm tra nếu giá trị đã chọn thì hủy chọn
      this.selectedRadio = this.selectedRadio === value ? null : value;
      this.sortBy = this.selectedRadio === value ? value : null;
      console.log(this.typeSort);
      console.log(this.selectedRadio);

      this.handleFillter();
    },

    toggleTypeSort(value) {
      this.typeSort = value;
      if (this.sortBy) {
        this.handleFillter();
      }
    },

    async fetchProducts() {
      this.isLoading = true;
      try {
        const response = await axios.get(
          `${process.env.VUE_APP_API_URL}/search?keyword=${this.searchQuery}&page=${this.page}`
        ); // Lấy API qua proxy
        if (response.data.success) {
          this.arrayBook = response.data.data;
          this.curentRecord += this.arrayBook.length;

          this.totalPage = response.data.total_pages;
          this.perPage = response.data.per_page;
          this.totalRecord = response.data.total_records;
          this.page = response.data.current_page;

          console.log("tong so trang:", this.totalPage);
          console.log("tong so sach:", this.totalRecord);
          console.log("so sach moi trang:", this.perPage);
          console.log("trang hien tai:", this.page);
        }
      } catch (error) {
        this.error = "Không thể lấy thông tin sách!";
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
    allCurrentBook() {
      this.curentRecord += this.arrayBook.length;
    },
    goToPage(pageNumber) {
      if (pageNumber < 1 || pageNumber > this.totalPage) return;
      this.page = pageNumber;
      if (this.isFillter) {
        this.fetchData();
      } else {
        this.fetchProducts();
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    handleQueryChange() {
      // Gọi API mỗi khi query trong URL thay đổi
      const query = this.$route.query.query;
      this.searchQuery = query || ""; // Cập nhật giá trị tìm kiếm
      this.fetchProducts();
      this.allCurrentBook();
    },
  },
  computed: {
    pageRange() {
      const range = [];
      const delta = 2; // Số lượng trang hiển thị trước và sau trang hiện tại

      let start = Math.max(this.page - delta, 1);
      let end = Math.min(this.page + delta, this.totalPage);

      // Điều chỉnh nếu đầu hoặc cuối vượt giới hạn
      if (start <= 2) {
        start = 1;
        end = Math.min(delta * 2 + 1, this.totalPage);
      }

      if (end >= this.totalPage - 1) {
        start = Math.max(this.totalPage - delta * 2, 1);
        end = this.totalPage;
      }

      for (let i = start; i <= end; i++) {
        range.push(i);
      }
      return range;
    },
  },
};
</script>
