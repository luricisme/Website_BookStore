<template>
  <div class="order-tab-body">
    <div v-if="isLoading" class="loading-overlay">
      <div
        class="spinner-border text-primary"
        style="width: 3rem; height: 3rem"
        role="status"
      >
        <span class="sr-only">Loading...</span>
      </div>
    </div>

    <!-- <div class="order-tab-single-order">
      <div class="single-order-info">
        <img
          src="../../../public/IMG/cam.jpg"
          class="single-order-img"
          alt="product image"
        />
        <div class="col single-order-name-amount">
          <div class="single-order-name mb-3">
            Phá vỡ giới hạn - sách bán chạy nhất năm, đoạt giải nobel hòa bình
            của nguyễn thúc thùy tiên, đặt dấu chấm hết cho sự nghiệp của con
            mén Ariana Grande
          </div>
          <div class="single-order-amount">Số lượng: 20</div>
        </div>
        <div class="single-order-price">5.250.300 vnđ</div>
      </div>
      <div class="single-order-total">
        Thành tiền:<span class="fs-5 text-primary ms-3">100.060.000 vnđ</span>
      </div>
      <div class="single-order-more-action">
        <div class="singe-order-status text-muted ms-2">Đã hủy</div>
      </div>
    </div>

    <div class="order-tab-single-order">
      <div class="single-order-info">
        <img
          src="../../../public/IMG/cam.jpg"
          class="single-order-img"
          alt="product image"
        />
        <div class="col single-order-name-amount">
          <div class="single-order-name mb-3">
            Phá vỡ giới hạn - sách bán chạy nhất năm, đoạt giải nobel hòa bình
            của nguyễn thúc thùy tiên, đặt dấu chấm hết cho sự nghiệp của con
            mén Ariana Grande
          </div>
          <div class="single-order-amount">Số lượng: 20</div>
        </div>
        <div class="single-order-price">5.250.300 vnđ</div>
      </div>
      <div class="single-order-total">
        Thành tiền:<span class="fs-5 text-primary ms-3">100.060.000 vnđ</span>
      </div>
      <div class="single-order-more-action">
        <div class="singe-order-status text-muted ms-2">Đã hủy</div>
      </div>
    </div> -->
    
    <div
      v-if="total_page === 0"
      class="text-body-tertiary fs-1 p-4 text-center"
    >
      Không có đơn hàng nào
    </div>
    <div v-else>
      <table class="table mx-auto border-dark-subtle">
        <thead class="border-bottom-0">
          <tr>
            <th scope="col" class="text-bg-primary text-center rounded-start-5 ps-4">
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
            <td class="align-content-center text-center">{{ order.status }}</td>
            <td class="d-flex flex-column gap-1">
              <div
                type="button"
                class="btn btn-primary"
                @click="showModal(order.id_order)"
              >
                Chi tiết
              </div>
              <div
                type="button"
                class="btn btn-danger"
                @click="cancelOrder(order.id_order)"
                v-if="order.status === 'Pending' || order.status === 'Approved'"
              >
                Hủy đơn
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <nav
        v-if="total_page > 1"
        class="mx-auto mt-4 d-flex justify-content-center"
      >
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
      id="modalProfileOrder"
      tabindex="-1"
      aria-labelledby="modalProfileOrderLabel"
      v-if="isModalVisible"
      @click.self="closeModal"
    >
      <!-- @click.self="closeModal" là khi nhấn vào vùng tối bên ngoài (là cái modalProfileOrder) thay vì nhấn vào modal là div con thì sẽ tắt -->
      <div
        class="modal-dialog d-flex justify-content-center modal-dialog-centered"
      >
        <div class="modal-content p-0" style="width: 1000px; max-height: 90vh">
          <div class="modal-header">
            <h1
              class="modal-title fs-3 text-primary"
              id="modalProfileOrderLabel"
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
                    <a :href="'/book?id_book=' + book.id_book">{{
                      book.book_name
                    }}</a>
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
import "../css-component/order-tab.css";
import axiosInstance from "../../services/axiosInstance.js";

export default {
  name: "OrderTab",
  data() {
    return {
      orderList: [],
      currentPage: 1,
      total_page: 0,
      per_page: 12,
      total: 0,

      isModalVisible: false,

      selectedOrderDetail: null,

      isLoading: false
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
          `/account/my-order?page=${this.currentPage}&per_page=${this.per_page}`
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

    async showModal(id_order) {
      try {
        this.isLoading = true;

        const response = await axiosInstance.get(
          `/account/my-order/detail/${id_order}`
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

    async cancelOrder(id_order) {
      try {
        this.isLoading = true;

        const response = await axiosInstance.patch("/account/my-order/cancel", {
          id_order: id_order,
        });
        if (response.status === 200) {
          
          this.isLoading = false;

          this.handleRouteChange();
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

    async goToPage(page) {
      if (page >= 1 && page <= this.total_page) {
        try {
          this.isLoading = true;

          const response = await axiosInstance.get(
            `/account/my-order?page=${this.currentPage}&per_page=${this.per_page}`
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
