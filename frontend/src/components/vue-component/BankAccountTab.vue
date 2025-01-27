<template>
  <div class="bankacc-tab-body">
    <div v-if="isLoading" class="loading-overlay">
      <div
        class="spinner-border text-primary"
        style="width: 3rem; height: 3rem"
        role="status"
      >
        <span class="sr-only">Loading...</span>
      </div>
    </div>

    <div class="mb-4 fs-5 text-danger">
      Số dư: <span class="ms-2">{{ balance + " vnđ" }}</span>
    </div>
    <table class="table mx-auto border-dark-subtle">
      <thead class="border-bottom-0">
        <tr>
          <th
            scope="col"
            class="text-bg-primary text-center rounded-start-5 ps-4 col-2"
          >
            ID giao dịch
          </th>
          <th scope="col" class="text-bg-primary text-center">
            Ngày giao dịch
          </th>
          <th scope="col" class="text-bg-primary text-center">Số tiền</th>
          <th scope="col" class="text-bg-primary text-center">Số dư cuối</th>
          <th
            scope="col"
            class="text-bg-primary rounded-end-5 text-center col-2"
          >
            Thao tác
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(deal, index) in list" :key="index">
          <td class="ps-4 text-center">
            {{ deal.transaction_id }}
          </td>
          <td class="align-content-center text-center">
            {{ deal.transaction_date }}
          </td>
          <td class="align-content-center text-center">
            {{
              (deal.balance_after >= deal.balance_before ? "+ " : "- ") +
              deal.amount +
              " vnđ"
            }}
          </td>
          <td class="align-content-center text-center">
            {{ deal.balance_after + " vnđ" }}
          </td>
          <td class="align-content-center">
            <div
              type="button"
              class="text-primary text-center fw-bold"
              @click="showModal(deal)"
            >
              Chi tiết
            </div>
          </td>
        </tr>
      </tbody>
    </table>
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

        <li class="page-item" :class="{ disabled: currentPage === total_page }">
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

    <div
      class="modal d-block"
      id="modalProfileBankAcc"
      tabindex="-1"
      aria-labelledby="modalProfileBankAccLabel"
      v-if="isModalVisible"
      @click.self="closeModal"
    >
      <!-- @click.self="closeModal" là khi nhấn vào vùng tối bên ngoài (là cái modalProfileBankAcc) thay vì nhấn vào modal là div con thì sẽ tắt -->
      <div
        class="modal-dialog d-flex justify-content-center modal-dialog-centered"
      >
        <div class="modal-content p-0" style="width: 550px">
          <div class="modal-header">
            <h1
              class="modal-title fs-3 text-primary"
              id="modalProfileBankAccLabel"
            >
              Thông tin chi tiết
            </h1>
            <button
              type="button"
              class="btn-close"
              @click="closeModal"
              aria-label="Close"
            ></button>
          </div>
          <!-- <div class="modal-body">
            <div class="mb-4 px-2">
              <span class="fw-bold me-3">ID giao dịch:</span>
              <span>{{ selectedDeal.transaction_id }}</span>
            </div>

            <div class="mb-4 px-2">
              <span class="fw-bold me-3">Admin:</span>
              <span>{{ selectedDeal.admin_email }}</span>
            </div>

            <div class="mb-4 px-2">
              <span class="fw-bold me-3">Email người dùng:</span>
              <span>{{ selectedDeal.user_email }}</span>
            </div>

            <div class="mb-4 px-2">
              <span class="fw-bold me-3">Số tiền:</span>
              <span>
                {{
                  (selectedDeal.balance_after >= selectedDeal.balance_before
                    ? "+ "
                    : "- ") +
                  selectedDeal.amount +
                  " vnđ"
                }}
              </span>
            </div>

            <div class="mb-4 px-2">
              <span class="fw-bold me-3">Số dư trước giao dịch:</span>
              <span>
                {{ selectedDeal.balance_before + " vnđ" }}
              </span>
            </div>

            <div class="mb-4 px-2">
              <span class="fw-bold me-3">Số dư cuối:</span>
              <span>
                {{ selectedDeal.balance_after + " vnđ" }}
              </span>
            </div>

            <div class="mb-4 px-2">
              <span class="fw-bold me-3">Thời gian:</span>
              <span>
                {{ selectedDeal.transaction_date }}
              </span>
            </div>

            <div class="mb-4 px-2">
              <span class="fw-bold me-3">Loại giao dịch:</span>
              <span>
                {{ selectedDeal.transaction_type }}
              </span>
            </div>

            <div class="px-2">
              <span class="fw-bold me-3">Mô tả:</span>
              <span>
                {{ selectedDeal.description }}
              </span>
            </div>
          </div> -->
          <div class="modal-body">
            <div class="row mb-4 px-2">
              <div class="col-sm-5 fw-bold">ID giao dịch:</div>
              <div class="col-sm-7">{{ selectedDeal.transaction_id }}</div>
            </div>

            <div class="row mb-4 px-2">
              <div class="col-sm-5 fw-bold">Admin:</div>
              <div class="col-sm-7">{{ selectedDeal.admin_email }}</div>
            </div>

            <div class="row mb-4 px-2">
              <div class="col-sm-5 fw-bold">Email người dùng:</div>
              <div class="col-sm-7">{{ selectedDeal.user_email }}</div>
            </div>

            <div class="row mb-4 px-2">
              <div class="col-sm-5 fw-bold">Số tiền:</div>
              <div class="col-sm-7">
                {{
                  (selectedDeal.balance_after >= selectedDeal.balance_before
                    ? "+ "
                    : "- ") +
                  selectedDeal.amount +
                  " vnđ"
                }}
              </div>
            </div>

            <div class="row mb-4 px-2">
              <div class="col-sm-5 fw-bold">Số dư trước giao dịch:</div>
              <div class="col-sm-7">
                {{ selectedDeal.balance_before + " vnđ" }}
              </div>
            </div>

            <div class="row mb-4 px-2">
              <div class="col-sm-5 fw-bold">Số dư cuối:</div>
              <div class="col-sm-7">
                {{ selectedDeal.balance_after + " vnđ" }}
              </div>
            </div>

            <div class="row mb-4 px-2">
              <div class="col-sm-5 fw-bold">Thời gian:</div>
              <div class="col-sm-7">
                {{ selectedDeal.transaction_date }}
              </div>
            </div>

            <div class="row mb-4 px-2">
              <div class="col-sm-5 fw-bold">Loại giao dịch:</div>
              <div class="col-sm-7">
                {{ selectedDeal.transaction_type }}
              </div>
            </div>

            <div class="row px-2">
              <div class="col-sm-5 fw-bold">Mô tả:</div>
              <div class="col-sm-7">
                {{ selectedDeal.description }}
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "../css-component/bank-account-tab.css";
import axiosInstance from "../../services/axiosInstance.js";

export default {
  name: "BankAccountTab",
  data() {
    return {
      balance: 0,

      list: [],
      currentPage: 1,
      total_page: 0,
      per_page: 1,
      total: 0,

      selectedDeal: {},

      isModalVisible: false,

      isLoading: false,
    };
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
      try {
        this.isLoading = true;

        const response = await axiosInstance.get(
          `/account/bank-account?page=${this.currentPage}`
        );
        if (response.status === 200) {
          this.balance = response.data.balance.balance;
          this.list = response.data.data;
          this.currentPage = response.data.current_page;
          this.total_page = response.data.total_pages;
          this.per_page = response.data.per_page;
          this.total = response.data.total_records;

          this.isLoading = false;
        }
      } catch (error) {
        this.isLoading = false;

        console.log(error);
        if (error.response) {
          const status = error.response.status;
          const message = error.response.data.message;

          // Xử lý các mã lỗi cụ thể
          if (status === 401) {
            // Không có accesstoken
            this.$router.push("/login");
          } else if (status === 403) {
            alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
            this.$router.push("/login");
          } else if (status === 500) {
            alert(message);
            this.$router.push("/login");
          } else if (status === 502) {
            alert(message);
            this.$router.push("/login");
          }
        } else {
          // Xử lý lỗi nếu không có phản hồi (chẳng hạn lỗi kết nối mạng)
          alert("Lỗi mạng: Không thể kết nối đến server.");
        }
      }
    },

    async goToPage(page) {
      if (page >= 1 && page <= this.total_page) {
        try {
          this.isLoading = true;

          const response = await axiosInstance.get(
            `/account/bank-account?page=${page}`
          );
          if (response.status === 200) {
            this.balance = response.data.balance.balance;
            this.list = response.data.data;
            this.currentPage = response.data.current_page;
            this.total_page = response.data.total_pages;
            this.per_page = response.data.per_page;
            this.total = response.data.total_records;

            this.isLoading = false;
          }
        } catch (error) {
          this.isLoading = false;

          console.log(error);
          if (error.response) {
            const status = error.response.status;
            const message = error.response.data.message;

            // Xử lý các mã lỗi cụ thể
            if (status === 401) {
              // Không có accesstoken
              this.$router.push("/login");
            } else if (status === 403) {
              alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
              this.$router.push("/login");
            } else if (status === 500) {
              alert(message);
              this.$router.push("/login");
            } else if (status === 502) {
              alert(message);
              this.$router.push("/login");
            }
          } else {
            // Xử lý lỗi nếu không có phản hồi (chẳng hạn lỗi kết nối mạng)
            alert("Lỗi mạng: Không thể kết nối đến server.");
          }
        }
      }
    },

    formatPrice(price) {
      return new Intl.NumberFormat("vi-VN").format(price) + " vnđ";
    },
    showModal(deal) {
      this.selectedDeal = deal;
      this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
    },
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
};
</script>