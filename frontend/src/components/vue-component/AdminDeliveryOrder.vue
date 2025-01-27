<template>
  <div class="admin-delivery-order-body">
    <div v-if="isLoading" class="loading-overlay">
      <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>


    <div class="admin-delivery-order-box">
      <div class="admin-delivery-order-box-title fs-4 fw-bold text-primary mb-4">
        ĐƠN HÀNG ĐANG GIAO
      </div>
      <table class="table mx-auto border-dark-subtle" style="width: 95%">
        <thead class="border-bottom-0">
          <tr>
            <th scope="col" class="text-bg-primary rounded-start-5 ps-4">
              Email
            </th>
            <th scope="col" class="text-bg-primary text-center">
              Tổng giá trị
            </th>
            <th scope="col" class="text-bg-primary text-center">
              Thời điểm đặt hàng
            </th>
            <th scope="col" class="text-bg-primary text-center">Thanh toán</th>
            <th scope="col" class="text-bg-primary text-center">Trạng thái</th>
            <th scope="col" class="text-bg-primary rounded-end-5 text-center">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(order, index) in orderList" :key="index">
            <td class="ps-4 align-content-center">{{ order.email }}</td>
            <td class="align-content-center text-center">
              {{ formatPrice(order.total_amount) }}
            </td>
            <td class="align-content-center text-center">
              {{
                new Date(order.created_at).toLocaleString("en-CA", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: false,
                })
              }}
            </td>
            <td class="align-content-center text-center">{{ order.method }}</td>
            <td class="align-content-center text-center">
              <select
                class="form-select"
                style="cursor: pointer"
                aria-label="select status"
                v-model="order.status"
                @change="updateStatus(order.email, order.id_order, order.status)"
              >
                <option value="Refused">Refused</option>
                <option value="Delivering">Delivering</option>
                <option value="Completed">Completed</option>
              </select>
            </td>
            <td class="align-content-center">
              <div
                type="button"
                class="text-primary text-center fw-bold"
                @click="showModal(order.id_order)"
              >
                Chi tiết
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <nav v-if="total_page > 1" class="mx-auto mt-4 d-flex justify-content-center" style="width: 95%">
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

    <div
      class="modal d-block"
      id="modalAdminDeliveryOrder"
      tabindex="-1"
      aria-labelledby="modalAdminDeliveryOrderLabel"
      v-if="isModalVisible"
      @click.self="closeModal"
    >
      <!-- @click.self="closeModal" là khi nhấn vào vùng tối bên ngoài (là cái modalAdminDeliveryOrder) thay vì nhấn vào modal là div con thì sẽ tắt -->
      <div
        class="modal-dialog d-flex justify-content-center modal-dialog-centered"
      >
        <div class="modal-content p-0" style="width: 1000px; max-height: 90vh">
          <div class="modal-header">
            <h1
              class="modal-title fs-3 text-primary"
              id="modalAdminDeliveryOrderLabel"
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
          <div class="modal-body overflow-auto">
            <div class="row mb-4 px-2">
              <div class="col-sm-2 fw-bold">Email:</div>
              <div class="col-sm-5">{{ selectedOrderDetail.email }}</div>
              <div class="col-sm-2 fw-bold">Thanh toán:</div>
              <div class="col-sm-3">{{ selectedOrderDetail.method }}</div>
            </div>
            <div class="row mb-4 px-2">
              <div class="col-sm-2 fw-bold">Địa chỉ:</div>
              <div class="col-sm-5">
                {{ selectedOrderDetail.detail_address }}
              </div>
              <div class="col-sm-2 fw-bold">Trạng thái:</div>
              <div class="col-sm-3">{{ selectedOrderDetail.status }}</div>
            </div>
            <div class="row mb-4 px-2">
              <div class="col-sm-3 fw-bold">Thời điểm đặt hàng:</div>
              <div class="col-sm-9">
                {{
                  new Date(selectedOrderDetail.created_at).toLocaleString(
                    "en-CA",
                    {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: false,
                    }
                  )
                }}
              </div>
            </div>

            <table class="table mx-auto border-dark-subtle">
              <thead class="border-bottom-0">
                <tr>
                  <th scope="col" class="text-bg-primary rounded-start-5 ps-4">
                    Tên sách
                  </th>
                  <th scope="col" class="text-bg-primary text-center">
                    Giá tiền
                  </th>
                  <th scope="col" class="text-bg-primary text-center">
                    Số lượng
                  </th>
                  <th
                    scope="col"
                    class="text-bg-primary rounded-end-5 text-center col-sm-3"
                  >
                    Thành tiền
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(book, index) in selectedOrderDetail.books"
                  :key="index"
                >
                  <td class="ps-4 align-content-center">
                    {{ book.book_name }}
                  </td>
                  <td class="align-content-center text-center">
                    {{ formatPrice(book.price) }}
                  </td>
                  <td class="align-content-center text-center">
                    {{ book.quantity }}
                  </td>
                  <td class="align-content-center text-center">
                    {{ formatPrice(book.price * book.quantity) }}
                  </td>
                </tr>
              </tbody>
            </table>

            <div class="row px-2">
              <div class="col-sm-9 fw-bold text-end">Tổng cộng:</div>
              <div class="col-sm-3 text-center">
                {{ formatPrice(selectedOrderDetail.total_amount) }}
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
import "../css-component/admin-delivery-order.css";
import axiosInstance from "../../services/axiosInstance.js";

export default {
  name: "AdminDeliveryOrder",
  data() {
    return {
      orderList: [],
      currentPage: 1,
      total_page: 0,
      per_page: 12,
      total: 0,

      isModalVisible: false,

      selectedOrderDetail: null,

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
          `/admin/order/status-order?status=Delivering&page=${this.currentPage}&per_page=${this.per_page}`
        );
        if (response.status === 200) {
          this.orderList = response.data.orders;
          this.currentPage = response.data.page;
          this.total_page = response.data.total_page;
          this.per_page = response.data.per_page;
          this.total = response.data.total;

          this.isLoading = false;
        }
      } catch (error) {
        this.isLoading = false;

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
    },

    formatPrice(price) {
      return new Intl.NumberFormat("vi-VN").format(price) + " vnđ";
    },

    async updateStatus(email, id_order, status) {
      try {
        this.isLoading = true;

        const response = await axiosInstance.patch(
          "/admin/order/update-status",
          {
            email: email,
            id_order: id_order,
            status: status,
          }
        );
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

    async showModal(id_order) {
      try {
        this.isLoading = true;

        const response = await axiosInstance.get(
          `/admin/order/detail/${id_order}`
        );
        if (response.status === 200) {
          this.selectedOrderDetail = response.data.detail[0];
          console.log(this.selectedOrderDetail);

          this.isLoading = false;
        }
      } catch (error) {
        this.isLoading = false;

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

      // Lấy dữ liệu xong mới render ra
      this.isModalVisible = true;
    },

    closeModal() {
      this.isModalVisible = false;
    },

    async goToPage(page) {
      if (page >= 1 && page <= this.total_page) {
        try {
          this.isLoading = true;

          const response = await axiosInstance.get(
            `/admin/order/status-order?status=Delivering&page=${page}&per_page=${this.per_page}`
          );
          if (response.status === 200) {
            this.orderList = response.data.orders;
            this.currentPage = response.data.page;
            this.total_page = response.data.total_page;
            this.per_page = response.data.per_page;
            this.total = response.data.total;

            this.isLoading = false;
          }
        } catch (error) {
          this.isLoading = false;

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
      }
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