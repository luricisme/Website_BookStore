<template>
  <div class="admin-poster-body">
    <div v-if="isLoading" class="loading-overlay">
      <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>


    <div class="admin-poster-box">
      <div class="d-flex justify-content-between mb-4">
        <div class="admin-poster-box-title fs-4 fw-bold text-primary">
          POSTER
        </div>
        <div class="btn btn-outline-primary" @click="showModal">
          + Thêm poster mới
        </div>
      </div>

      <div
        class="admin-poster-single-row mb-4 mx-4"
        v-for="(poster, index) in posterList"
        :key="index"
      >
        <div class="row mb-4 px-2">
          <div class="col-sm-1 fw-bold">Tên:</div>
          <div class="col-sm-10">{{ poster.name }}</div>
          <div class="col-sm-1 text-end">
            <i
              type="button"
              class="fa-solid fa-trash-can text-danger"
              @click="deletePoster(poster.id_poster)"
            ></i>
          </div>
        </div>
        <div class="row mb-4 px-2">
          <div class="col-sm-1 fw-bold">Ảnh:</div>
          <div class="col-sm-11">
            <img
              :src="poster.image_link"
              alt="poster image"
              style="width: 550px; height: 225px"
            />
          </div>
        </div>
        <div class="row px-2">
          <div class="col-sm-1 fw-bold">Link:</div>
          <div class="col-sm-11">
            <a :href="poster.product_link">{{ poster.product_link }}</a>
          </div>
        </div>
      </div>

      <nav v-if="total_page > 1" class="mx-4 mt-4 d-flex justify-content-center">
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
      id="modalAdminPoster"
      tabindex="-1"
      aria-labelledby="modalAdminPosterLabel"
      v-if="isModalVisible"
      @click.self="closeModal"
    >
      <!-- @click.self="closeModal" là khi nhấn vào vùng tối bên ngoài (là cái modalAdminPoster) thay vì nhấn vào modal là div con thì sẽ tắt -->
      <div
        class="modal-dialog d-flex justify-content-center modal-dialog-centered"
      >
        <div class="modal-content p-0" style="width: 1000px">
          <!-- Để width 1000px mà nó bị giới hạn không thể lớn hơn bao nhiêu đó -->
          <div class="modal-header">
            <h1
              class="modal-title fs-3 text-primary"
              id="modalAdminPosterLabel"
            >
              Thêm poster mới
            </h1>
            <button
              type="button"
              class="btn-close"
              @click="closeModal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <form
              @submit.prevent="checkAndAddPoster"
              enctype="multipart/form-data"
              id="addPosterForm"
            >
              <div class="row mb-4 mx-2">
                <label for="admin-poster-name" class="col-sm-1 col-form-label"
                  >Tên</label
                >
                <div class="col-sm-11">
                  <input
                    name="name"
                    type="text"
                    id="admin-poster-name"
                    class="form-control"
                    placeholder="Nhập tên poster"
                    v-model="name"
                  />
                </div>
              </div>

              <div class="row mb-4 mx-2">
                <label for="admin-poster-image" class="col-sm-1 col-form-label"
                  >Ảnh</label
                >
                <div class="col-sm-11">
                  <div
                    class="admin-poster-image-ctn"
                    style="cursor: pointer"
                    v-if="!previewImage"
                    @click="toggleFileInput"
                  >
                    <i class="fa-solid fa-plus"></i>
                  </div>

                  <div v-if="previewImage">
                    <img
                      :src="previewImage"
                      alt="Image Preview"
                      style="width: 550px; height: 225px"
                    />

                    <button
                      type="button"
                      class="btn btn-danger ms-4"
                      @click="removeImage"
                    >
                      Xóa
                    </button>
                  </div>

                  <input
                    ref="imagePosterInput"
                    type="file"
                    id="admin-poster-image"
                    class="d-none"
                    @change="handleFileChange"
                    accept="image/*"
                  />
                </div>
              </div>

              <div class="row mx-2">
                <label for="admin-poster-link" class="col-sm-1 col-form-label"
                  >Link</label
                >
                <div class="col-sm-11">
                  <input
                    name="product_link"
                    type="text"
                    id="admin-poster-link"
                    class="form-control"
                    placeholder="Nhập link sản phẩm"
                    v-model="product_link"
                  />
                </div>
              </div>

              <div class="row mx-2 mt-3">
                <div class="col-sm-12 text-danger">{{ err }}</div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="submit" class="btn btn-primary" form="addPosterForm">
              Thêm
            </button>
            <button type="button" class="btn btn-danger" @click="closeModal">
              Hủy
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "../css-component/admin-poster.css";
import axiosInstance from "../../services/axiosInstance.js";

export default {
  name: "AdminPoster",
  data() {
    return {
      posterList: [],
      currentPage: 1,
      total_page: 0,
      per_page: 3,
      total: 0,

      isModalVisible: false,

      previewImage: null,

      name: null,
      image: null,
      product_link: null,

      err: "",

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
          `/admin/poster?page=${this.currentPage}&per_page=${this.per_page}`
        );
        if (response.status === 200) {
          this.posterList = response.data.posters;
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

    async goToPage(page) {
      if (page >= 1 && page <= this.total_page) {
        try {
          this.isLoading = true;
          
          const response = await axiosInstance.get(
            `/admin/poster?page=${page}&per_page=${this.per_page}`
          );
          if (response.status === 200) {
            this.posterList = response.data.posters;
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

    async deletePoster(id_poster) {
      try {
        this.isLoading = true;

        const response = await axiosInstance.delete("/admin/poster/delete", {
          data: {
            id_poster: id_poster,
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

    showModal() {
      this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
    },

    toggleFileInput() {
      this.$refs.imagePosterInput.click(); // Kích hoạt input file để người dùng chọn ảnh
    },
    // Xử lý khi người dùng chọn file
    handleFileChange(event) {
      const file = event.target.files[0]; // Lấy file đầu tiên
      if (file) {
        this.image = file; // Lưu file vào data
        this.previewImage = URL.createObjectURL(file); // Tạo URL xem trước
      } else {
        this.image = null;
        this.previewImage = null;
      }
    },
    // Bỏ chọn ảnh đã chọn
    removeImage() {
      this.image = null;
      this.previewImage = null;
      this.$refs.imagePosterInput.value = "";
    },

    async checkAndAddPoster() {
      if (!this.name || !this.product_link || !this.image) {
        this.err = "Chú ý: Hãy điền đầy đủ thông tin";
      } else {
        const formData = new FormData();
        formData.append("name", this.name);
        formData.append("product_link", this.product_link);
        formData.append("images", this.image);

        try {
          this.isLoading = true;

          const response = await axiosInstance.post(
            "/admin/poster/add",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data", // Quan trọng
              },
            }
          );

          if (response.status === 200) {
            this.handleRouteChange();
            this.resetForm();
            this.closeModal();

            this.isLoading = false;
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
            } else if (status === 500) {
              alert(message);
            }
          } else {
            // Xử lý lỗi nếu không có phản hồi (chẳng hạn lỗi kết nối mạng)
            alert("Lỗi mạng: Không thể kết nối đến server.");
          }
        }
      }
    },
    resetForm() {
      this.name = null;
      this.product_link = null;
      this.image = null;
      this.previewImage = null;
      this.$refs.imagePosterInput.value = "";
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