<template>
  <div class="containera mt-2 p-5 rounded-2" style="background-color: white">
    <h2 class="mb-3">Biểu đồ thống kê</h2>
    <!-- Hiển thị thống kê -->
    <h4>Thống kê hồ sơ</h4>
    <div class="row">
      <div class="col-md-3">
        <div class="card text-white bg-primary mb-3">
          <div class="card-body">
            <h6 class="card-title">Tổng người mua</h6>
            <p class="card-text">{{ total_users }}</p>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card text-white bg-success mb-3">
          <div class="card-body">
            <h6 class="card-title">Tổng doanh thu</h6>
            <p class="card-text">${{ total_revenue }}</p>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card text-white bg-warning mb-3">
          <div class="card-body">
            <h6 class="card-title">Tổng sản phẩm bán ra</h6>
            <p class="card-text">{{ total_products_sold }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-3">
      <h4>Thống kê doanh thu</h4>
      <!-- Chọn năm -->
      <div class="form-group">
        <label for="yearSelect" style="font-weight: bold; font-size: 17px"
          >Chọn năm</label
        >

        <select
          id="yearSelect"
          class="form-control"
          v-model="year"
          @change="handleYearChange($event)"
        >
          <option v-for="n in years" :key="n" :value="n">{{ n }}</option>
        </select>

        <BarChart
          ref="barChart"
          v-if="revenueLabels.length > 0"
          :key="revenueData"
          :labels="revenueLabels"
          :data="revenueData"
        />
      </div>
    </div>

    <div class="row mt-4">
      <!-- Biểu đồ sản phẩm bán theo danh mục -->
      <div class="col-md-6 mt-4" style="margin-bottom: 100px">
        <h4>Thể loại đã bán</h4>
        <PieChart
          v-if="productsSold.length > 0"
          :labels="categoryLabels"
          :data="quantityData"
        />
      </div>
    </div>
  </div>
</template>

<script>
import "../css-component/admin-thong-ke-M.css";
import BarChart from "../vue-component/Admin-bieudocot_M.vue";
import PieChart from "../vue-component/Admin-bieudotron-M.vue";
import axiosInstance from "../../services/axiosInstance.js";

export default {
  name: "AdminDashboard",
  components: {
    BarChart,
    PieChart,
  },
  data() {
    return {
      total_users: 0,
      total_revenue: 0,
      total_products_sold: 0,
      year: 0,
      years: this.generateYears(), // Danh sách các năm
      revenueLabels: [],
      revenueData: [],
      productsSold: [],
    };
  },
  computed: {
    categoryLabels() {
      return this.productsSold.map((product) => product.category_name);
    },
    quantityData() {
      return this.productsSold.map((product) =>
        parseInt(product.quantity_sold, 10)
      );
    },
  },

  methods: {
    generateYears() {
      const currentYear = new Date().getFullYear();
      const years = [];
      for (let i = 0; i < 5; i++) {
        years.push(currentYear - i);
      }
      return years;
    },
    handleYearChange(event) {
      const selectedYear = event.target.value;

      this.getData(selectedYear); // Truyền năm được chọn vào getData
    },
    async getData(year) {
      console.log("namw trong hamf gecth:", year);

      try {
        const response = await axiosInstance.get(`/admin?year=${year}`);

        if (response.status === 200) {
          this.total_users = response.data.stats.total_users;
          this.total_revenue = response.data.stats.total_revenue;
          this.total_products_sold = response.data.stats.total_products_sold;

          this.revenueLabels = response.data.revenueLabels;
          this.revenueData = response.data.revenueData;
          console.log(this.revenueData);

          this.productsSold = response.data.productsSold;
        }
      } catch (error) {
        console.log(error);
        if (error.response.status === 401) {
          // Không có accesstoken
          this.$router.push("/login");
        }
        if (error.response.status === 403) {
          // refreshtoken hết hạn
          alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
          this.$router.push("/login");
        }
        if (error.response.status === 500) {
          // Lỗi server
          alert(error);
          this.$router.push("/login");
        }
      }

      // try {
      //   const response = await axios.get(`/api/admin?year=${year}`);
      //   const data = response.data;
      //   console.log(data);

      //   this.total_users = data.stats.total_users;
      //   this.total_revenue = data.stats.total_revenue;
      //   this.total_products_sold = data.stats.total_products_sold;

      //   this.revenueLabels = response.data.revenueLabels;
      //   this.revenueData = response.data.revenueData;
      //   console.log(this.revenueData);

      //   this.productsSold = response.data.productsSold;
      // } catch (error) {
      //   console.error("Error fetching data:", error);
      // }
    },
  },
  async created() {
    this.year = this.years[0];
    this.getData(this.year);
  },
};
</script>
<style scoped>
.containera {
  padding: 0;
  margin-left: 10px;
  margin-right: 10px;
}
</style>
