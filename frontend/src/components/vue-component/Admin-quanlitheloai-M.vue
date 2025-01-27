<template>
  <div class="containera mt-2">
    <!-- loading data for all action -->
    <div
      v-if="isLoadingAction"
      class="d-flex justify-content-center align-items-center"
      style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(255, 255, 255, 0.3);
        z-index: 1050;
      "
    >
      <!-- Spinner Bootstrap -->
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div class="admin-category-box">
      <div class="admin-category-box-title fs-4 fw-bold text-primary mb-3">
        QUẢN LÍ THỂ LOẠI
      </div>

      <!-- Di chuyển nút thêm sách về bên phải -->
      <div class="col-md-12 text-end">
        <button
          class="btn btn-success d-flex align-items-center ms-auto"
          style="margin-right: 5%"
          @click="openModalAdd"
        >
          <i class="fas fa-plus me-2"></i>

          Thêm thể loại
        </button>
      </div>

      <table class="table mx-auto mt-4" style="width: 90%">
        <thead class="border-bottom-0">
          <tr>
            <th
              scope="col"
              class="text-bg-primary rounded-start-4 text-center"
              style="width: 10%"
            >
              ID
            </th>
            <th scope="col" class="text-bg-primary ps-4" style="width: 80%">
              Thể loại
            </th>
            <th
              scope="col"
              class="text-bg-primary rounded-end-4 text-center"
              style="width: 10%"
            >
              Thao tác
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(category, index) in categorys" :key="index">
            <td class="text-center">{{ category.id_category }}</td>
            <td class="ps-4">{{ category.name }}</td>
            <td class="fs-5 text-center">
              <i
                class="fa-solid fa-pen-to-square text-warning me-4"
                @click="editCategoryConfirm(category.id_category)"
              ></i>
              <i
                class="fa-solid fa-trash-can text-danger"
                @click="deleteCategoryQuestion(category.id_category)"
              ></i>
            </td>
          </tr>
        </tbody>
      </table>
      <div
        v-if="isLoading"
        class="d-flex justify-content-center"
        style="width: 100%"
      >
        <!-- Spinner Bootstrap -->
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <div class="mt-4 d-flex justify-content-center">
        <nav>
          <ul class="pagination pagination-sm">
            <li class="page-item" :class="{ disabled: current_page === 1 }">
              <button class="page-link" @click="goToPage(current_page - 1)">
                «
              </button>
            </li>

            <!-- Hiển thị số trang đầu tiên -->
            <li
              class="page-item"
              :class="{ disabled: current_page === 1 }"
              v-if="visiblePages[0] > 1"
            >
              <button class="page-link" @click="goToPage(1)">1</button>
            </li>

            <!-- Hiển thị dấu ba chấm nếu có nhiều trang -->
            <li v-if="showEllipsisBefore" class="page-item disabled">
              <span class="page-link">...</span>
            </li>

            <!-- Hiển thị các trang xung quanh trang hiện tại -->
            <li
              class="page-item"
              v-for="pageNumber in visiblePages"
              :key="pageNumber"
              :class="{ active: pageNumber === current_page }"
            >
              <button class="page-link" @click="goToPage(pageNumber)">
                {{ pageNumber }}
              </button>
            </li>

            <!-- Hiển thị dấu ba chấm nếu có nhiều trang -->
            <li v-if="showEllipsisAfter" class="page-item disabled">
              <span class="page-link">...</span>
            </li>

            <!-- Hiển thị số trang cuối cùng -->
            <li
              class="page-item"
              :class="{ disabled: current_page === total_pages }"
              v-if="visiblePages[visiblePages.length - 1] < total_pages"
            >
              <button class="page-link" @click="goToPage(total_pages)">
                {{ total_pages }}
              </button>
            </li>

            <li
              class="page-item"
              :class="{ disabled: current_page === total_pages }"
            >
              <button class="page-link" @click="goToPage(current_page + 1)">
                »
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <div>
      <!-- Modal add category -->
      <div
        class="modal fade"
        :class="{ show: isModalAdd }"
        tabindex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        v-if="isModalAdd"
      >
        <div
          class="modal-dialog text-center modal-dialog-centered modal-lg"
          role="document"
        >
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">
                Thêm thể loại mới
                <small class="text-danger d-inline" style="font-size: 0.75rem"
                  >* Thêm tên vào mục "Thể loại"</small
                >
              </h5>
              <button
                type="button"
                class="close"
                @click="isModalAdd = !isModalAdd"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="add">
                <div class="form-group row mt-2">
                  <label for="book_name" class="col-sm-3 col-form-label"
                    >Thể loại</label
                  >
                  <div class="col-sm-6">
                    <input
                      type="text"
                      class="form-control"
                      id="book_name"
                      v-model="category"
                      required
                    />
                  </div>

                  <!-- Thêm nút Submit -->
                  <div class="form-group col">
                    <div class="col-sm-3 offset-sm-3">
                      <button type="submit" class="btn btn-primary">
                        Thêm
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal popup cho form edit category -->
      <div
        class="modal fade"
        :class="{ show: isEditCategory }"
        tabindex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        v-if="isEditCategory"
      >
        <div
          class="modal-dialog text-center modal-dialog-centered modal-lg"
          role="document"
        >
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">
                Thay đổi thông tin sách
                <small class="text-danger d-inline" style="font-size: 0.75rem"
                  >* Điền vào mục "Thể loại"</small
                >
              </h5>
              <button
                type="button"
                class="close"
                @click="isEditCategory = !isEditCategory"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="callEditCategory">
                <div class="form-group row mt-2">
                  <label for="status" class="col-sm-3 col-form-label"
                    >Thể loại</label
                  >

                  <div class="col-sm-7">
                    <input
                      type="text"
                      class="form-control"
                      id="book_name"
                      v-model="category_name"
                      required
                    />
                  </div>

                  <!-- Thêm nút Submit -->
                  <div class="form-group col">
                    <div class="col-sm-2 offset-sm-4">
                      <button type="submit" class="btn btn-primary">Lưu</button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal hiển thị thông báo chung cho các hành động -->
    <div
      class="modal fade"
      :class="{ show: showNotice }"
      tabindex="-1"
      role="dialog"
      aria-labelledby="showNotice"
      aria-hidden="true"
      v-if="showNotice"
    >
      <div
        class="modal-dialog text-center modal-dialog-centered modal-sm"
        role="document"
      >
        <div class="modal-content" :class="modalColor">
          <div class="modal-body" :class="modalColorText">{{ status }}</div>
        </div>
      </div>
    </div>

    <div
      class="modal fade"
      :class="{ show: isDelete }"
      tabindex="-1"
      role="dialog"
      aria-labelledby="isDelete"
      aria-hidden="true"
      v-if="isDelete"
    >
      <div
        class="modal-dialog text-center modal-dialog-centered"
        role="document"
      >
        <div class="modal-content">
          <div class="modal-body">
            <p>Có chắc chắn muốn xóa không?</p>
            <div class="d-flex justify-content-center gap-2">
              <button class="btn btn-danger btn-sm" @click="confirmDelete">
                Đồng ý
              </button>
              <button class="btn btn-secondary btn-sm" @click="cancelDelete">
                Hủy
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "../css-component/admin-category.css";
import axiosInstance from "../../services/axiosInstance.js";

export default {
  name: "AdminCategory",
  data() {
    return {
      isLoadingAction: false,
      isEditCategory: false,
      idDelete: 0,
      isDelete: false,
      isLoading: true,
      status: "",
      showNotice: false,
      isModalAdd: false,
      showForm: false,
      categorys: [],
      total_pages: 0,
      current_page: 1,
      category: "",
      previews: [],
      max_visible_pages: 5,
      edit_Book: [],
      selectedImages: [],
      category_name: "",
      id_category: 0,
    };
  },
  computed: {
    pageNumbers() {
      // Trả về tất cả các số trang
      let pages = [];
      for (let i = 1; i <= this.total_pages; i++) {
        pages.push(i);
      }
      return pages;
    },
    visiblePages() {
      // Hiển thị các trang xung quanh trang hiện tại, giới hạn số lượng trang
      let pages = [];
      const start = Math.max(
        1,
        this.current_page - Math.floor(this.max_visible_pages / 2)
      );
      const end = Math.min(
        this.total_pages,
        this.current_page + Math.floor(this.max_visible_pages / 2)
      );

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      return pages;
    },
    showEllipsisBefore() {
      // Kiểm tra nếu dấu ba chấm cần hiển thị ở trước các trang
      return this.visiblePages[0] > 2;
    },
    showEllipsisAfter() {
      // Kiểm tra nếu dấu ba chấm cần hiển thị ở sau các trang
      return (
        this.visiblePages[this.visiblePages.length - 1] < this.total_pages - 1
      );
    },
  },
  methods: {
    resetForm() {
      // Reset preview images
      this.previews = []; // Xóa tất cả ảnh đã preview
      // Đặt tất cả giá trị của ispreview thành true
      this.ispreview = this.ispreview.map(() => true);
      this.newBook.images = [];
      this.selectedImages = [];
    },
    openNotice(
      statusString,
      modalColor = "bg-secondary",
      modalColorText = "text-white"
    ) {
      this.status = statusString;
      this.showNotice = true;
      this.modalColor = modalColor; // Màu nền của modal
      this.modalColorText = modalColorText; // Màu chữ của modal

      // Đặt thời gian đóng modal tự động sau 1 giây
      setTimeout(() => {
        this.showNotice = false;
      }, 1000); // 1000ms = 1 giây
    },

    async add() {
      await this.addCategory();

      this.closeModalAdd();

      const color = "bg-success";
      this.openNotice(this.status, color);

      //this.resetForm();
    },
    openModalAdd() {
      this.isModalAdd = true;
    },
    closeModalAdd() {
      this.isModalAdd = false;
    },
    goToPage(page) {
      this.fetchCategory(page);
    },
    triggerFileInput(index) {
      this.$refs[`fileInput${index}`].click();
    },
    // Xử lý khi chọn file và cập nhật preview
    handleFileChange(index, event) {
      const file = event.target.files[0];
      if (file) {
        // Lưu file thực tế vào mảng newBook.images
        this.newBook.images[index] = file;

        const reader = new FileReader();
        reader.onload = (e) => {
          // Cập nhật giá trị trực tiếp vào mảng newBook.images
          this.previews[index] = e.target.result;
        };
        reader.readAsDataURL(file);
      }
      this.ispreview[index] = false;
      console.log(this.newBook.images);
    },

    // Hàm thêm sách
    async addCategory() {
      const name = this.category;

      try {
        this.isLoadingAction = true;

        const response = await axiosInstance.post("/admin/categories/add", {
          name: name,
        });

        if (response.status === 200) {
          console.log(response.data);
          this.isLoadingAction = false;
          this.status = "Thêm thể loại thành công";

          // Cập nhật lại danh sách sách sau khi thêm mới
          this.fetchCategory(this.current_page);
        }
      } catch (error) {
        console.log(error);
        if (error.response.status === 400) {
          this.isLoadingAction = false;
          this.status = "Thể loại đã tồn tại";
        }
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

    async fetchCategory(page) {
      this.isLoading = true;
      try {
        const response = await axiosInstance.get(
          `/admin/categories?page=${page}`
        );

        if (response.status === 200) {
          this.isLoading = false;

          this.categorys = response.data.data;
          console.log(this.categorys);

          this.total_pages = response.data.total_pages;
          this.current_page = parseInt(response.data.current_page, 10);

          return response.data;
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
    },

    async deleteCategory(id_book) {
      this.isLoadingAction = true;

      console.log(id_book);

      try {
        this.isLoadingAction = true;

        const response = await axiosInstance.delete(
          "/admin/categories/delete",
          {
            data: {
              id: id_book,
            },
          }
        );

        if (response.status === 200) {
          this.isLoadingAction = false;
          this.fetchCategory(1);
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
    },
    confirmDelete() {
      console.log("vao hàm delete", this.idDelete);
      this.deleteCategory(this.idDelete);
      this.isDelete = false;
      const status = "Đã xóa sách thành công";
      const color = "bg-danger";
      this.openNotice(status, color);
    },
    deleteCategoryQuestion(id) {
      this.idDelete = id;
      this.isDelete = true;
    },
    cancelDelete() {
      this.isDelete = false;
    },

    async editCategory() {
      this.isLoadingAction = true;

      try {
        const response = await axiosInstance.put("/admin/categories/change", {
          id: this.id_category,
          name: this.category_name,
        });

        if (response.status === 200) {
          this.isLoadingAction = false;

          this.fetchCategory(this.current_page);

          this.isEditCategory = false;

          const status = "Lưu thay đổi";
          const color = "bg-warning";
          this.openNotice(status, color);

          // Cập nhật lại danh sách sách sau khi thêm mới
          this.fetchCategory(this.current_page);
        }
      } catch (error) {
        console.log(error);
        if (error.response.status === 400) {
          this.isLoadingAction = false;
          this.isEditCategory = false;

          const status = "Tên thể loại mới đã tồn tại";
          const color = "bg-warning";
          this.openNotice(status, color);
        }
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
    async callEditCategory() {
      await this.editCategory();
      //this.resetForm();
    },
    editCategoryConfirm(id) {
      this.isEditCategory = true;
      this.id_category = id;
    },
  },
  mounted() {
    this.fetchCategory(1);
  },
};
</script>
<style scoped>
.containera {
  padding: 0;
  margin-left: 10px;
  margin-right: 10px;
}

.modal.show {
  display: block;
  min-height: 500px;
}

.modal-body {
  max-height: 70vh;
  width: 100%;
  overflow-y: auto;
}

.modal-dialog {
  width: 50%;
}

.image-upload {
  position: relative;
  width: 100%;
  border: 2px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
}

.plus-icon {
  font-size: 24px;
  color: #aaa;
}

.image-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

input[type="file"] {
  display: none;
}
</style>
