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
        QUẢN LÍ SÁCH
      </div>

      <!-- Di chuyển nút thêm sách về bên phải -->
      <div class="col-md-12 text-end">
        <button
          class="btn btn-success d-flex align-items-center ms-auto"
          style="margin-right: 5%"
          @click="openModalAdd"
        >
          <i class="fas fa-book me-2"></i>
          Thêm sách
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
            <th scope="col" class="text-bg-primary ps-4" style="width: 30%">
              Tên sách
            </th>
            <th scope="col" class="text-bg-primary ps-4" style="width: 10%">
              Giá gốc
            </th>
            <th scope="col" class="text-bg-primary ps-4" style="width: 10%">
              Giá giảm
            </th>
            <th scope="col" class="text-bg-primary ps-4" style="width: 10%">
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
          <tr v-for="(book, index) in books" :key="book.id_book">
            <td class="text-center">{{ index + 1 }}</td>
            <td class="ps-4">{{ book.book_name }}</td>
            <td class="ps-4">{{ formattedAmount(book.list_price) }}</td>
            <td class="ps-4">{{ formattedAmount(book.discounted_price) }}</td>
            <td class="ps-4">{{ getCategoryName(book.genre) }}</td>
            <td class="fs-5 text-center">
              <i
                class="fa-solid fa-pen-to-square text-warning me-4"
                @click="editBookConfirm(book.id_book)"
                style="cursor: pointer"
              ></i>
              <i
                class="fa-solid fa-trash-can text-danger"
                @click="deleteBookQuestion(book.id_book)"
                style="cursor: pointer"
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
      <!-- Modal add book-->
      <div
        class="modal fade"
        :class="{ show: isModalAdd }"
        tabindex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        v-if="isModalAdd"
      >
        <div class="modal-dialog text-center modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">
                Thêm sách
                <small class="text-danger d-inline" style="font-size: 0.75rem"
                  >* Mục "Độ tuổi" theo thứ tự: "Child","Teen","Adult" ví dụ:
                  "Teen" "Child, Adult" "Child, Teen, Adult"</small
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
                <div class="form-group row">
                  <label for="book_image" class="col-sm-3 col-form-label"
                    >Ảnh</label
                  >
                  <div
                    class="col-sm-9"
                    id="book_image"
                    style="display: flex; justify-content: space-between"
                  >
                    <div class="col-md-2">
                      <div class="image-upload" @click="triggerFileInput(0)">
                        <span class="plus-icon" v-if="ispreview[0]">+</span>
                        <input
                          type="file"
                          ref="fileInput0"
                          @change="handleFileChange(0, $event)"
                          style="display: none"
                        />
                        <img
                          v-if="previews[0]"
                          :src="previews[0]"
                          class="image-preview"
                        />
                      </div>
                    </div>
                    <div class="col-md-2">
                      <div class="image-upload" @click="triggerFileInput(1)">
                        <span class="plus-icon" v-if="ispreview[1]">+</span>
                        <input
                          type="file"
                          ref="fileInput1"
                          @change="handleFileChange(1, $event)"
                          style="display: none"
                        />
                        <img
                          v-if="previews[1]"
                          :src="previews[1]"
                          class="image-preview"
                        />
                      </div>
                    </div>
                    <div class="col-md-2">
                      <div class="image-upload" @click="triggerFileInput(2)">
                        <span class="plus-icon" v-if="ispreview[2]">+</span>
                        <input
                          type="file"
                          ref="fileInput2"
                          @change="handleFileChange(2, $event)"
                          style="display: none"
                        />
                        <img
                          v-if="previews[2]"
                          :src="previews[2]"
                          class="image-preview"
                        />
                      </div>
                    </div>
                    <div class="col-md-2">
                      <div class="image-upload" @click="triggerFileInput(3)">
                        <span class="plus-icon" v-if="ispreview[3]">+</span>
                        <input
                          type="file"
                          ref="fileInput3"
                          @change="handleFileChange(3, $event)"
                          style="display: none"
                        />
                        <img
                          v-if="previews[3]"
                          :src="previews[3]"
                          class="image-preview"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div class="form-group row mt-2">
                  <label for="book_name" class="col-sm-3 col-form-label"
                    >Tên sách</label
                  >
                  <div class="col-sm-9">
                    <input
                      type="text"
                      class="form-control"
                      id="book_name"
                      v-model="newBook.book_name"
                      required
                    />
                  </div>
                </div>

                <div class="form-group row mt-2">
                  <label for="list_price" class="col-sm-3 col-form-label"
                    >Giá gốc</label
                  >
                  <div class="col-sm-9">
                    <input
                      type="number"
                      class="form-control"
                      id="list_price"
                      v-model="newBook.list_price"
                      required
                    />
                  </div>
                </div>

                <div class="form-group row mt-2">
                  <label for="discounted_price" class="col-sm-3 col-form-label"
                    >Giá giảm</label
                  >
                  <div class="col-sm-9">
                    <input
                      type="number"
                      class="form-control"
                      id="discounted_price"
                      v-model="newBook.discounted_price"
                      required
                    />
                  </div>
                </div>

                <div class="form-group row mt-2">
                  <label for="genre" class="col-sm-3 col-form-label"
                    >Thể loại</label
                  >
                  <div class="col-sm-9">
                    <select
                      class="form-control"
                      id="genre"
                      v-model="newBook.genre"
                    >
                      <option
                        v-for="cate in category"
                        :key="cate.id_category"
                        :value="cate.id_category"
                      >
                        {{ cate.name }}
                      </option>
                    </select>
                  </div>
                </div>

                <div class="form-group row mt-2">
                  <label for="age_group" class="col-sm-3 col-form-label"
                    >Độ tuổi</label
                  >
                  <div class="col-sm-9">
                    <input
                      type="text"
                      class="form-control"
                      id="age_group"
                      v-model="newBook.age_group"
                      required
                    />
                  </div>
                </div>

                <div class="form-group row mt-2">
                  <label for="supplier" class="col-sm-3 col-form-label"
                    >Nhà cung cấp</label
                  >
                  <div class="col-sm-9">
                    <input
                      type="text"
                      class="form-control"
                      id="supplier"
                      v-model="newBook.supplier"
                      required
                    />
                  </div>
                </div>

                <div class="form-group row mt-2">
                  <label for="translator" class="col-sm-3 col-form-label"
                    >Người dịch</label
                  >
                  <div class="col-sm-9">
                    <input
                      type="text"
                      class="form-control"
                      id="translator"
                      v-model="newBook.translator"
                      required
                    />
                  </div>
                </div>

                <div class="form-group row mt-2">
                  <label for="author" class="col-sm-3 col-form-label"
                    >Tác giả</label
                  >
                  <div class="col-sm-9">
                    <input
                      type="text"
                      class="form-control"
                      id="author"
                      v-model="newBook.author"
                      required
                    />
                  </div>
                </div>

                <div class="form-group row mt-2">
                  <label for="publisher" class="col-sm-3 col-form-label"
                    >Nhà xuất bản</label
                  >
                  <div class="col-sm-9">
                    <input
                      type="text"
                      class="form-control"
                      id="publisher"
                      v-model="newBook.publisher"
                      required
                    />
                  </div>
                </div>

                <div class="form-group row mt-2">
                  <label for="publication_year" class="col-sm-3 col-form-label"
                    >Năm xuất bản</label
                  >
                  <div class="col-sm-9">
                    <input
                      type="number"
                      class="form-control"
                      id="publication_year"
                      v-model="newBook.publication_year"
                      required
                    />
                  </div>
                </div>

                <div class="form-group row mt-2">
                  <label for="language" class="col-sm-3 col-form-label"
                    >Ngôn ngữ</label
                  >
                  <div class="col-sm-9">
                    <input
                      type="text"
                      class="form-control"
                      id="language"
                      v-model="newBook.language"
                      required
                    />
                  </div>
                </div>

                <div class="form-group row mt-2">
                  <label for="pages" class="col-sm-3 col-form-label"
                    >Số trang</label
                  >
                  <div class="col-sm-9">
                    <input
                      type="number"
                      class="form-control"
                      id="pages"
                      v-model="newBook.pages"
                      required
                    />
                  </div>
                </div>

                <div class="form-group row mt-2">
                  <label for="description" class="col-sm-3 col-form-label"
                    >Mô tả</label
                  >
                  <div class="col-sm-9">
                    <textarea
                      class="form-control"
                      id="description"
                      v-model="newBook.description"
                      required
                    ></textarea>
                  </div>
                </div>

                <div class="form-group row mt-2">
                  <label for="rating_count" class="col-sm-3 col-form-label"
                    >Số lượt đánh giá</label
                  >
                  <div class="col-sm-9">
                    <input
                      type="number"
                      class="form-control"
                      id="rating_count"
                      v-model="newBook.rating_count"
                      required
                    />
                  </div>
                </div>

                <div class="form-group row mt-2">
                  <label for="cover_type" class="col-sm-3 col-form-label"
                    >Loại bìa</label
                  >
                  <div class="col-sm-9">
                    <input
                      type="text"
                      class="form-control"
                      id="cover_type"
                      v-model="newBook.cover_type"
                      required
                    />
                  </div>
                </div>

                <div class="form-group row mt-2">
                  <label
                    for="available_quantity"
                    class="col-sm-3 col-form-label"
                    >Số lượng còn lại</label
                  >
                  <div class="col-sm-9">
                    <input
                      type="number"
                      class="form-control"
                      id="available_quantity"
                      v-model="newBook.available_quantity"
                      required
                    />
                  </div>
                </div>

                <div class="form-group row mt-2">
                  <label for="sold_quantity" class="col-sm-3 col-form-label"
                    >Số lượng đã bán</label
                  >
                  <div class="col-sm-9">
                    <input
                      type="number"
                      class="form-control"
                      id="sold_quantity"
                      v-model="newBook.sold_quantity"
                      required
                    />
                  </div>
                </div>

                <div class="form-group row mt-2">
                  <label for="status" class="col-sm-3 col-form-label"
                    >Trạng thái</label
                  >
                  <div class="col-sm-9">
                    <select
                      class="form-control"
                      id="status"
                      v-model="newBook.status"
                    >
                      <option value="1">Còn hàng</option>
                      <option value="0">Hết hàng</option>
                    </select>
                  </div>
                </div>

                <!-- Thêm nút Submit -->
                <div class="form-group col">
                  <div class="col-sm-12 text-end mt-2">
                    <button type="submit" class="btn btn-primary">Thêm</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal popup cho form edit book -->
      <div
        class="modal fade"
        :class="{ show: isEditBook }"
        tabindex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        v-if="isEditBook"
      >
        <div class="modal-dialog text-center modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">
                Thay đổi thông tin sách
                <small class="text-danger d-inline" style="font-size: 0.75rem"
                  >* Chọn vào ảnh bạn muốn xóa trong mục "Ảnh hiện tại"</small
                >
              </h5>
              <button
                type="button"
                class="close"
                @click="isEditBook = !isEditBook"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="callEditBook(edit_Book.id_book)">
                <div class="form-group row">
                  <label for="book_image" class="col-sm-3 col-form-label"
                    >Ảnh mới</label
                  >
                  <div
                    class="col-sm-9"
                    id="book_image"
                    style="display: flex; flex-wrap: wrap; gap: 4.16%"
                  >
                    <div class="col-md-2">
                      <div class="image-upload" @click="triggerFileInput(0)">
                        <span class="plus-icon" v-if="ispreview[0]">+</span>
                        <input
                          type="file"
                          ref="fileInput0"
                          @change="handleFileChange(0, $event)"
                          style="display: none"
                        />
                        <img
                          v-if="previews[0]"
                          :src="previews[0]"
                          class="image-preview"
                        />
                      </div>
                    </div>
                    <div class="col-md-2">
                      <div class="image-upload" @click="triggerFileInput(1)">
                        <span class="plus-icon" v-if="ispreview[1]">+</span>
                        <input
                          type="file"
                          ref="fileInput1"
                          @change="handleFileChange(1, $event)"
                          style="display: none"
                        />
                        <img
                          v-if="previews[1]"
                          :src="previews[1]"
                          class="image-preview"
                        />
                      </div>
                    </div>
                    <div class="col-md-2">
                      <div class="image-upload" @click="triggerFileInput(2)">
                        <span class="plus-icon" v-if="ispreview[2]">+</span>
                        <input
                          type="file"
                          ref="fileInput2"
                          @change="handleFileChange(2, $event)"
                          style="display: none"
                        />
                        <img
                          v-if="previews[2]"
                          :src="previews[2]"
                          class="image-preview"
                        />
                      </div>
                    </div>
                    <div class="col-md-2">
                      <div class="image-upload" @click="triggerFileInput(3)">
                        <span class="plus-icon" v-if="ispreview[3]">+</span>
                        <input
                          type="file"
                          ref="fileInput3"
                          @change="handleFileChange(3, $event)"
                          style="display: none"
                        />
                        <img
                          v-if="previews[3]"
                          :src="previews[3]"
                          class="image-preview"
                        />
                      </div>
                    </div>

                    <div class="col-md-2">
                      <div class="image-upload" @click="triggerFileInput(4)">
                        <span class="plus-icon" v-if="ispreview[4]">+</span>
                        <input
                          type="file"
                          ref="fileInput4"
                          @change="handleFileChange(4, $event)"
                          style="display: none"
                        />
                        <img
                          v-if="previews[4]"
                          :src="previews[4]"
                          class="image-preview"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div class="form-group row mt-4">
                  <label for="book_image" class="col-sm-3 col-form-label"
                    >Ảnh hiện tại</label
                  >
                  <div
                    class="col-sm-9"
                    id="book_image"
                    style="
                      display: flex;
                      gap: 4.16%;
                      flex-wrap: wrap;
                      max-height: 400px;
                      overflow-y: auto;
                    "
                  >
                    <div
                      class="col-md-2 d-flex flex-column align-items-center"
                      v-for="(image, index) in edit_Book.images"
                      :key="index"
                    >
                      <div class="image-upload">
                        <img
                          v-if="image"
                          :src="image"
                          class="image-preview"
                          style="width: 100%"
                        />
                      </div>
                      <input
                        type="checkbox"
                        :id="'checkbox_' + index"
                        class="mt-2"
                        :value="image"
                        v-model="selectedImages"
                        @change="show(image)"
                      />
                    </div>
                  </div>
                </div>

                <div class="form-group row mt-2">
                  <label for="book_name" class="col-sm-3 col-form-label"
                    >Tên sách</label
                  >
                  <div class="col-sm-9">
                    <input
                      type="text"
                      class="form-control"
                      id="book_name"
                      v-model="edit_Book.book_name"
                      required
                    />
                  </div>
                </div>

                <div class="form-group row mt-2">
                  <label for="list_price" class="col-sm-3 col-form-label"
                    >Giá gốc</label
                  >
                  <div class="col-sm-9">
                    <input
                      type="number"
                      class="form-control"
                      id="list_price"
                      v-model="edit_Book.list_price"
                      required
                    />
                  </div>
                </div>

                <div class="form-group row mt-2">
                  <label for="discounted_price" class="col-sm-3 col-form-label"
                    >Giá giảm</label
                  >
                  <div class="col-sm-9">
                    <input
                      type="number"
                      class="form-control"
                      id="discounted_price"
                      v-model="edit_Book.discounted_price"
                      required
                    />
                  </div>
                </div>

                <div class="form-group row mt-2">
                  <label for="genre" class="col-sm-3 col-form-label"
                    >Thể loại</label
                  >
                  <div class="col-sm-9">
                    <select
                      class="form-control"
                      id="genre"
                      v-model="edit_Book.genre"
                    >
                      <option
                        v-for="cate in category"
                        :key="cate.id_category"
                        :value="cate.id_category"
                      >
                        {{ cate.name }}
                      </option>
                    </select>
                  </div>
                </div>

                <div class="form-group row mt-2">
                  <label for="age_group" class="col-sm-3 col-form-label"
                    >Độ tuổi</label
                  >
                  <div class="col-sm-9">
                    <input
                      type="text"
                      class="form-control"
                      id="age_group"
                      v-model="edit_Book.age_group"
                      required
                    />
                  </div>
                </div>

                <div class="form-group row mt-2">
                  <label for="supplier" class="col-sm-3 col-form-label"
                    >Nhà cung cấp</label
                  >
                  <div class="col-sm-9">
                    <input
                      type="text"
                      class="form-control"
                      id="supplier"
                      v-model="edit_Book.supplier"
                      required
                    />
                  </div>
                </div>

                <div class="form-group row mt-2">
                  <label for="translator" class="col-sm-3 col-form-label"
                    >Người dịch</label
                  >
                  <div class="col-sm-9">
                    <input
                      type="text"
                      class="form-control"
                      id="translator"
                      v-model="edit_Book.translator"
                      required
                    />
                  </div>
                </div>

                <div class="form-group row mt-2">
                  <label for="author" class="col-sm-3 col-form-label"
                    >Tác giả</label
                  >
                  <div class="col-sm-9">
                    <input
                      type="text"
                      class="form-control"
                      id="author"
                      v-model="edit_Book.author"
                      required
                    />
                  </div>
                </div>

                <div class="form-group row mt-2">
                  <label for="publisher" class="col-sm-3 col-form-label"
                    >Nhà xuất bản</label
                  >
                  <div class="col-sm-9">
                    <input
                      type="text"
                      class="form-control"
                      id="publisher"
                      v-model="edit_Book.publisher"
                      required
                    />
                  </div>
                </div>

                <div class="form-group row mt-2">
                  <label for="publication_year" class="col-sm-3 col-form-label"
                    >Năm xuất bản</label
                  >
                  <div class="col-sm-9">
                    <input
                      type="number"
                      class="form-control"
                      id="publication_year"
                      v-model="edit_Book.publication_year"
                      required
                    />
                  </div>
                </div>

                <div class="form-group row mt-2">
                  <label for="language" class="col-sm-3 col-form-label"
                    >Ngôn ngữ</label
                  >
                  <div class="col-sm-9">
                    <input
                      type="text"
                      class="form-control"
                      id="language"
                      v-model="edit_Book.language"
                      required
                    />
                  </div>
                </div>

                <div class="form-group row mt-2">
                  <label for="pages" class="col-sm-3 col-form-label"
                    >Số trang</label
                  >
                  <div class="col-sm-9">
                    <input
                      type="number"
                      class="form-control"
                      id="pages"
                      v-model="edit_Book.pages"
                      required
                    />
                  </div>
                </div>

                <div class="form-group row mt-2">
                  <label for="description" class="col-sm-3 col-form-label"
                    >Mô tả</label
                  >
                  <div class="col-sm-9">
                    <textarea
                      class="form-control"
                      id="description"
                      v-model="edit_Book.description"
                      required
                      style="min-height: 150px"
                    ></textarea>
                  </div>
                </div>

                <div class="form-group row mt-2">
                  <label for="rating_count" class="col-sm-3 col-form-label"
                    >Số lượt đánh giá</label
                  >
                  <div class="col-sm-9">
                    <input
                      type="number"
                      class="form-control"
                      id="rating_count"
                      v-model="edit_Book.rating_count"
                      required
                    />
                  </div>
                </div>

                <div class="form-group row mt-2">
                  <label for="cover_type" class="col-sm-3 col-form-label"
                    >Loại bìa</label
                  >
                  <div class="col-sm-9">
                    <input
                      type="text"
                      class="form-control"
                      id="cover_type"
                      v-model="edit_Book.cover_type"
                      required
                    />
                  </div>
                </div>

                <div class="form-group row mt-2">
                  <label
                    for="available_quantity"
                    class="col-sm-3 col-form-label"
                    >Số lượng còn lại</label
                  >
                  <div class="col-sm-9">
                    <input
                      type="number"
                      class="form-control"
                      id="available_quantity"
                      v-model="edit_Book.available_quantity"
                      required
                    />
                  </div>
                </div>

                <div class="form-group row mt-2">
                  <label for="sold_quantity" class="col-sm-3 col-form-label"
                    >Số lượng đã bán</label
                  >
                  <div class="col-sm-9">
                    <input
                      type="number"
                      class="form-control"
                      id="sold_quantity"
                      v-model="edit_Book.sold_quantity"
                      required
                    />
                  </div>
                </div>

                <div class="form-group row mt-2">
                  <label for="status" class="col-sm-3 col-form-label"
                    >Trạng thái</label
                  >
                  <div class="col-sm-9">
                    <select
                      class="form-control"
                      id="status"
                      v-model="edit_Book.status"
                    >
                      <option value="1">Còn hàng</option>
                      <option value="0">Hết hàng</option>
                    </select>
                  </div>
                </div>

                <!-- Thêm nút Submit -->
                <div class="form-group col">
                  <div class="col-sm-12 text-end mt-2">
                    <button type="submit" class="btn btn-primary">Lưu</button>
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
      isEditBook: false,
      idDelete: 0,
      isDelete: false,
      isLoading: true,
      status: "",
      showNotice: false,
      isModalAdd: false,
      showForm: false,
      books: [],
      total_pages: 0,
      current_page: 1,
      category: [],
      //pageNumbers: [],
      previews: [],
      max_visible_pages: 5,

      ispreview: [true, true, true, true, true],

      newBook: {
        book_name: "Nhập tên sách", // Tên sách
        list_price: 100000, // Giá gốc
        discounted_price: 80000, // Giá giảm
        genre: 1, // ID thể loại
        age_group: "Teen", // Độ tuổi
        supplier: "HCM", // Nhà cung cấp
        translator: "HCM", // Người dịch
        author: "HCM", // Tác giả
        publisher: "HCM", // Nhà xuất bản
        publication_year: 2004, // Năm xuất bản
        language: "VN", // Ngôn ngữ
        pages: 2, // Số trang
        description: "HCM", // Mô tả
        rating_count: 0, // Số lượt đánh giá
        cover_type: "Bìa cứng", // Loại bìa
        available_quantity: 60, // Số lượng còn lại
        sold_quantity: 1, // Số lượng đã bán
        status: 1, // Trạng thái
        images: [], // Để lưu trữ ảnh khi chọn
      },
      edit_Book: [],
      selectedImages: [],
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
    ////
    // formattedAmount(amount) {
    //   console.log('Price:',amount);
    //   if (typeof amount === 'string') {
    //   amount = amount.replace(/[^\d.-]/g, ''); // Xóa các ký tự không phải số hoặc dấu chấm
    // }

    // let numAmount = parseFloat(amount);
    //   return numAmount.toLocaleString("vi-VN", {
    //     style: "currency",
    //     currency: "VND",
    //   });
    // },
  },
  methods: {
    formattedAmount(amount) {
      if (typeof amount !== "number") {
        amount = parseFloat(amount); // Chuyển đổi nếu là chuỗi
      }

      if (isNaN(amount)) {
        return "Invalid amount";
      }

      return amount.toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
      });
    },
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
      if (this.checkPrice()) {
        this.status = "Giá đã giảm phải nhỏ hơn giá gốc!";

        this.openNotice(this.status);
        this.resetForm();
        return;
      }
      await this.addBook();
      this.closeModalAdd();
      const color = "bg-success";
      this.openNotice(this.status, color);
      this.resetForm();
    },
    openModalAdd() {
      this.isModalAdd = true;
    },
    closeModalAdd() {
      this.isModalAdd = false;
    },
    goToPage(page) {
      this.fetchBook(page);
    },
    checkPrice() {
      let listPrice = parseFloat(this.newBook.list_price);
      let discountedPrice = parseFloat(this.newBook.discounted_price);

      // Kiểm tra nếu giá trị là NaN sau khi chuyển đổi, và trả về false nếu không hợp lệ
      if (isNaN(listPrice) || isNaN(discountedPrice)) {
        return false;
      }

      return listPrice < discountedPrice;
    },
    checkPriceUpdate() {
      let listPrice = parseFloat(this.edit_Book.list_price);
      let discountedPrice = parseFloat(this.edit_Book.discounted_price);

      // Kiểm tra nếu giá trị là NaN sau khi chuyển đổi, và trả về false nếu không hợp lệ
      if (isNaN(listPrice) || isNaN(discountedPrice)) {
        return false;
      }

      return listPrice < discountedPrice;
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
    async addBook() {
      const formData = new FormData();

      // Thêm dữ liệu vào FormData
      formData.append("book_name", this.newBook.book_name);
      formData.append("list_price", this.newBook.list_price);
      formData.append("discounted_price", this.newBook.discounted_price);
      formData.append("genre", this.newBook.genre);
      formData.append("age_group", this.newBook.age_group);
      formData.append("supplier", this.newBook.supplier);
      formData.append("translator", this.newBook.translator);
      formData.append("author", this.newBook.author);
      formData.append("publisher", this.newBook.publisher);
      formData.append("publication_year", this.newBook.publication_year);
      formData.append("language", this.newBook.language);
      formData.append("pages", this.newBook.pages);
      formData.append("description", this.newBook.description);
      formData.append("rating_count", this.newBook.rating_count);
      formData.append("cover_type", this.newBook.cover_type);
      formData.append("available_quantity", this.newBook.available_quantity);
      formData.append("sold_quantity", this.newBook.sold_quantity);
      formData.append("status", this.newBook.status);

      // Thêm tất cả các ảnh vào FormData
      if (this.newBook.images && this.newBook.images.length > 0) {
        this.newBook.images.forEach((image) => {
          formData.append("images", image); // Mỗi ảnh được thêm vào với tên 'images'
        });
      }

      try {
        this.isLoadingAction = true;

        const response = await axiosInstance.post(
          "/admin/books/add",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data", // Quan trọng
            },
          }
        );

        if (response.status === 200) {
          this.isLoadingAction = false;
          this.status = "Thêm sách thành công";
          this.fetchBook(this.current_page);
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
      //   this.isLoadingAction = true;

      //   const response = await fetch("/api/admin/books/add", {
      //     method: "POST",
      //     headers: {
      //       Authorization: "Bearer <your_token_here>", // Nếu có token
      //     },
      //     body: formData, // Chỉ cần truyền formData, không cần thiết lập 'Content-Type'
      //   });

      //   if (!response.ok) {
      //     throw new Error(`HTTP error! status: ${response.status}`);
      //   }

      //   const data = await response.json();
      //   if (data.success) {
      //     this.isLoadingAction = false;
      //     this.status = "Thêm sách thành công";
      //   } else {
      //     this.status = "Thất bại khi thêm sách !";
      //   }

      //   // Cập nhật lại danh sách sách sau khi thêm mới
      //   this.fetchBook(this.current_page);
      // } catch (error) {
      //   this.status = "Thất bại khi thêm sách !!!";
      // }
    },

    async fetchBook(page) {
      this.isLoading = true;
      try {
        const response = await axiosInstance.get(`/admin/books?page=${page}`);

        if (response.status === 200) {
          this.isLoading = false;

          this.books = response.data.data;

          this.total_pages = response.data.total_pages;
          this.current_page = parseInt(response.data.current_page, 10);

          this.category = response.data.categories.data;

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

      // try {
      //   const response = await fetch(`/api/admin/books?page=${page}`, {
      //     method: "GET", // Phương thức GET để lấy dữ liệu
      //     headers: {
      //       "Content-Type": "application/json",
      //       Authorization: "Bearer <your_token_here>", // Nếu cần gửi token
      //     },
      //   });

      //   if (!response.ok) {
      //     throw new Error(`HTTP error! status: ${response.status}`);
      //   }

      //   const data = await response.json(); // Chuyển dữ liệu từ JSON thành đối tượng
      //   this.isLoading = false;

      //   this.books = data.data;

      //   this.total_pages = data.total_pages;
      //   this.current_page = parseInt(data.current_page, 10);

      //   this.category = data.categories.data;
      //   // this.calculatePageNumbers();
      //   return data; // Trả về dữ liệu để dùng ở nơi khác
      // } catch (error) {
      //   console.error("Fetch failed:", error); // Bắt lỗi và hiển thị trong console
      // }
    },
    getCategoryName(id) {
      const category = this.category.find((cat) => cat.id_category === id);
      return category ? category.name : "Không có";
    },
    async deleteBook(id_book) {
      try {
        const response = await axiosInstance.delete(
          `/admin/books/delete?id=${id_book}`
        );

        if (response.status === 200) {
          this.fetchBook(1);
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

      // const url = `/api/admin/books/delete?id=${id_book}`;
      // fetch(url, {
      //   method: "DELETE",
      // })
      //   .then((response) => {
      //     if (!response.ok) {
      //       throw new Error(`Failed to delete book with id ${id_book}.`);
      //     }
      //     return response.json();
      //   })
      //   .then((data) => {
      //     if (data.success) {
      //       this.fetchBook(1);
      //     }
      //   })
      //   .catch((error) => {
      //     console.error("Error deleting book:", error);
      //   });
    },
    confirmDelete() {
      this.deleteBook(this.idDelete);
      this.isDelete = false;
      const status = "Đã xóa sách thành công";
      const color = "bg-danger";
      this.openNotice(status, color);
    },
    deleteBookQuestion(id_book) {
      this.idDelete = id_book;
      this.isDelete = true;
    },
    cancelDelete() {
      this.isDelete = false;
    },

    async editBook(id_book) {
      const formData = new FormData();

      // Thêm dữ liệu vào FormData
      formData.append("book_name", this.edit_Book.book_name);
      formData.append("list_price", this.edit_Book.list_price);
      formData.append("discounted_price", this.edit_Book.discounted_price);
      formData.append("genre", this.edit_Book.genre);
      formData.append("age_group", this.edit_Book.age_group);
      formData.append("supplier", this.edit_Book.supplier);
      formData.append("translator", this.edit_Book.translator);
      formData.append("author", this.edit_Book.author);
      formData.append("publisher", this.edit_Book.publisher);
      formData.append("publication_year", this.edit_Book.publication_year);
      formData.append("language", this.edit_Book.language);
      formData.append("pages", this.edit_Book.pages);
      formData.append("description", this.edit_Book.description);
      formData.append("rating_count", this.edit_Book.rating_count);
      formData.append("cover_type", this.edit_Book.cover_type);
      formData.append("available_quantity", this.edit_Book.available_quantity);
      formData.append("sold_quantity", this.edit_Book.sold_quantity);
      formData.append("status", this.edit_Book.status);
      formData.append("images_to_delete", JSON.stringify(this.selectedImages));

      // Thêm tất cả các ảnh vào FormData
      if (this.newBook.images && this.newBook.images.length > 0) {
        this.newBook.images.forEach((image) => {
          formData.append("images", image); // Mỗi ảnh được thêm vào với tên 'images'
        });
      }

      try {
        this.isLoadingAction = true;

        const response = await axiosInstance.put(
          `admin/books/change?id=${id_book}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data", // Quan trọng
            },
          }
        );

        if (response.status === 200) {
          this.isLoadingAction = false;
          this.fetchBook(this.current_page);
          this.isEditBook = false;
          const status = "Lưu thay đổi";
          const color = "bg-warning";
          this.openNotice(status, color);
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
      //   this.isLoadingAction = true;
      //   const response = await fetch(`/api/admin/books/change?id=${id_book}`, {
      //     method: "PUT",
      //     headers: {
      //       Authorization: "Bearer <your_token_here>", // Nếu có token
      //     },
      //     body: formData, // Chỉ cần truyền formData, không cần thiết lập 'Content-Type'
      //   });

      //   if (!response.ok) {
      //     throw new Error(`HTTP error! status: ${response.status}`);
      //   }

      //   const data = await response.json();
      //   if (data.success) {
      //     console.log(data);
      //     this.isLoadingAction = false;
      //     this.fetchBook(this.current_page);
      //     this.isEditBook = false;
      //     const status = "Lưu thay đổi";
      //     const color = "bg-warning";
      //     this.openNotice(status, color);
      //   } else {
      //     const status = "Vui lòng chọn mục thay đổi";
      //     this.openNotice(status);
      //   }

      //   // Cập nhật lại danh sách sách sau khi thêm mới
      //   this.fetchBook(this.current_page);
      // } catch (error) {
      //   this.status = "Thất bại khi thêm sách !!!";
      // }
    },
    fetchDetailBook(id) {
      console.log("fasdfffdffffffff", this.edit_Book);
      this.isLoadingAction = true;
      const url = `${process.env.VUE_APP_API_URL}/detail-book?id=${id}`;
      fetch(url, {
        method: "GET",
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to fetch book details for id ${id}.`);
          }
          return response.json();
        })
        .then((data) => {
          this.isLoadingAction = false;
          this.edit_Book = data.data;
        })
        .catch((error) => {
          console.error("Error fetching book details:", error);
        });
    },
    async callEditBook(id) {
      if (this.checkPriceUpdate()) {
        this.status = "Giá đã giảm phải nhỏ hơn giá gốc!";

        this.openNotice(this.status);
        this.resetForm();
        return;
      }
      await this.editBook(id);
      this.resetForm();
    },
    async editBookConfirm(id_book) {
      this.fetchDetailBook(id_book);
      this.isEditBook = true;
    },
    show(url) {
      console.log("Anh dc chon de xoa: ", url);
      console.log("dan sach anh trong mang:", this.selectedImages);
    },
  },
  mounted() {
    this.fetchBook(1);
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
