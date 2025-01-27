<template>
  <div class="address-default-tab-body">
    <div v-if="isLoading" class="loading-overlay">
      <div
        class="spinner-border text-primary"
        style="width: 3rem; height: 3rem"
        role="status"
      >
        <span class="sr-only">Loading...</span>
      </div>
    </div>

    <div
      v-if="total_page === 0"
      class="text-body-tertiary fs-1 p-4 text-center"
    >
      Chưa lưu địa chỉ nào
    </div>
    <div v-else>
      <div
        class="address-single-row"
        v-for="(address, index) in allAddress"
        :key="index"
        :class="{
          'border-bottom-0': index === allAddress.length - 1,
          'pt-0': index === 0,
        }"
      >
        <div class="w-100">
          <div class="d-flex mb-2">
            <div class="border-end border-2 border-secondary-subtle pe-2">
              {{ address.name }}
            </div>
            <div class="ps-2">{{ address.phone }}</div>
          </div>
          <div class="text-muted">{{ address.address }}</div>
          <div class="text-muted">
            {{ address.ward }}, {{ address.district }}, {{ address.city }},
            {{ address.country }}
          </div>
        </div>
        <div class="d-flex">
          <span
            type="button"
            class="text-primary pe-2 text-opacity-75 border-end border-2 border-secondary-subtle"
            @click="editAddress(address)"
            >Sửa
          </span>
          <span
            type="button"
            class="ps-2"
            @click="deleteAddress(address.id_address)"
          >
            <i class="fa-solid fa-trash-can text-danger"></i>
          </span>
        </div>
      </div>

      <nav v-if="total_page > 1" class="mt-4 d-flex justify-content-center">
        <ul class="pagination">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <a
              class="page-link"
              href="#"
              aria-label="Previous"
              @click.prevent="goToPage(currentPage - 1)"
            >
              <span aria-hidden="true">&laquo;</span>
            </a>
          </li>

          <li
            class="page-item"
            v-for="page in pages"
            :key="page"
            :class="{ active: page === currentPage, disabled: page === '...' }"
          >
            <a
              class="page-link"
              href="#"
              @click.prevent="page !== '...' && goToPage(page)"
            >
              {{ page }}
            </a>
          </li>

          <li
            class="page-item"
            :class="{ disabled: currentPage === total_page }"
          >
            <a
              class="page-link"
              href="#"
              aria-label="Next"
              @click.prevent="goToPage(currentPage + 1)"
            >
              <span aria-hidden="true">&raquo;</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script>
import "../css-component/address-default-tab.css";
import axiosInstance from "../../services/axiosInstance.js";

export default {
  name: "DefaultAddressPage",
  data() {
    return {
      allAddress: [],
      currentPage: 1,
      total_page: 0,
      per_page: 3,
      total: 0,

      isLoading: false,
    };
  },
  computed: {
    pages() {
      const maxVisiblePages = 5; // Số trang hiển thị tối đa
      const total_page = this.total_page;
      const currentPage = this.currentPage;

      const pages = [];
      if (total_page <= maxVisiblePages) {
        for (let i = 1; i <= total_page; i++) {
          pages.push(i);
        }
        return pages;
      }

      const half = Math.floor(maxVisiblePages / 2);

      const startPage = Math.max(1, currentPage - half);
      const endPage = Math.min(total_page, currentPage + half);

      if (startPage > 1) pages.push(1);
      if (startPage > 2) pages.push("...");

      for (let i = startPage; i <= endPage; i++) pages.push(i);

      if (endPage < total_page - 1) pages.push("...");
      if (endPage < total_page) pages.push(total_page);

      return pages;
    },
  },
  methods: {
    async handleRouteChange() {
      try {
        this.isLoading = true;

        const response = await axiosInstance.get(
          `/account/address?page=${this.currentPage}&per_page=${this.per_page}`
        );
        if (response.status === 200) {
          this.allAddress = response.data.allAddress;
          this.currentPage = response.data.page;
          this.total_page = response.data.total_page;
          this.per_page = response.data.per_page;
          this.total = response.data.total;

          this.isLoading = false;
        }
      } catch (error) {
        this.isLoading = false;

        console.log(error);
        if (error.response.status === 401 || error.response.status === 403) {
          // Không có accesstoken hoặc refreshtoken hết hạn
          this.$router.push("/login");
        }
        if (error.response.status === 500) {
          // Lỗi server
          this.$router.push("/login");
        }
      }
    },
    async goToPage(page) {
      if (page >= 1 && page <= this.total_page) {
        try {
          this.isLoading = true;

          const response = await axiosInstance.get(
            `/account/address?page=${page}&per_page=${this.per_page}`
          );
          if (response.status === 200) {
            this.allAddress = response.data.allAddress;
            this.currentPage = response.data.page;
            this.total_page = response.data.total_page;
            this.per_page = response.data.per_page;
            this.total = response.data.total;

            this.isLoading = false;
          }
        } catch (error) {
          this.isLoading = false;

          console.log(error);
          if (error.response.status === 401 || error.response.status === 403) {
            // Không có accesstoken hoặc refreshtoken hết hạn
            this.$router.push("/login");
          }
          if (error.response.status === 500) {
            // Lỗi server
            this.$router.push("/login");
          }
        }
      }
    },
    editAddress(address) {
      this.$router.push({
        path: "/profile/address/edit",
        query: { ...address },
      });
    },
    async deleteAddress(id) {
      try {
        this.isLoading = true;

        const response = await axiosInstance.delete("/account/delete-address", {
          data: {
            id_address: id,
          },
        });

        if (response.status === 200) {
          this.isLoading = false;

          this.handleRouteChange();
        }
      } catch (error) {
        this.isLoading = false;

        if (error.response) {
          const status = error.response.status;
          const message = error.response.data.message;

          // Xử lý các mã lỗi cụ thể
          if (status === 400) {
            alert(message);
          } else if (status === 403) {
            alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
            this.$router.push("/login");
          } else if (status === 404) {
            alert(message);
          } else if (status === 500) {
            alert(message);
          }
        } else {
          // Xử lý lỗi nếu không có phản hồi (chẳng hạn lỗi kết nối mạng)
          alert("Lỗi mạng: Không thể kết nối đến server.");
        }
      }
    },
  },
  mounted() {
    this.handleRouteChange(); // Thực hiện xử lý khi component được mount
  },
  watch: {
    $route() {
      this.handleRouteChange();
    },
  },
};
</script>