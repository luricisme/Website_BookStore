<template>
  <form class="info-tab-body" @submit="validateAndSubmitInfo">
    <div v-if="isLoading" class="loading-overlay">
      <div
        class="spinner-border text-primary"
        style="width: 3rem; height: 3rem"
        role="status"
      >
        <span class="sr-only">Loading...</span>
      </div>
    </div>

    <div class="row mb-4 mx-5">
      <label for="profile-name" class="col-sm-2 col-form-label"
        >Họ và tên</label
      >
      <div class="col-sm-7">
        <input
          name="name"
          type="text"
          id="profile-name"
          class="form-control"
          :class="{ 'is-invalid': nameErr !== '' }"
          placeholder="Nhập họ và tên"
          v-model="name"
        />
        <div class="invalid-feedback ps-1 mt-2">
          {{ nameErr }}
        </div>
      </div>
    </div>

    <div class="row mb-4 mx-5">
      <label for="profile-email" class="col-sm-2 col-form-label">Email</label>
      <div class="col-sm-7">
        <input
          type="text"
          id="profile-email"
          class="form-control"
          v-model="email"
          disabled
        />
      </div>
    </div>

    <div class="row mb-4 mx-5">
      <label for="profile-phone" class="col-sm-2 col-form-label"
        >Số điện thoại</label
      >
      <div class="col-sm-7">
        <input
          name="phone"
          type="tel"
          id="profile-phone"
          class="form-control"
          :class="{ 'is-invalid': phoneErr !== '' }"
          placeholder="Nhập số điện thoại"
          v-model="phone"
        />
        <div class="invalid-feedback ps-1 mt-2">
          {{ phoneErr }}
        </div>
      </div>
    </div>

    <div class="row mb-4 mx-5">
      <label class="col-sm-2 col-form-label">Giới tính</label>
      <div class="col-sm-7">
        <input
          name="gender"
          type="radio"
          class="btn-check"
          id="profile-gender-male"
          value="male"
          v-model="gender"
        />
        <label class="btn btn-outline-secondary me-4" for="profile-gender-male"
          >Nam <i class="fa-solid fa-mars"></i
        ></label>

        <input
          name="gender"
          type="radio"
          class="btn-check"
          id="profile-gender-female"
          value="female"
          v-model="gender"
        />
        <label class="btn btn-outline-secondary" for="profile-gender-female"
          >Nữ <i class="fa-solid fa-venus"></i
        ></label>
      </div>
    </div>

    <div class="row mb-4 mx-5">
      <label for="profile-birthday" class="col-sm-2 col-form-label"
        >Ngày sinh</label
      >
      <div class="col-sm-7">
        <input
          name="birthday"
          type="date"
          id="profile-birthday"
          class="form-control"
          :class="{ 'is-invalid': birthdayErr !== '' }"
          style="cursor: text"
          placeholder="Nhập ngày sinh của bạn"
          v-model="birthday"
        />
        <div class="invalid-feedback ps-1 mt-2">
          {{ birthdayErr }}
        </div>
      </div>
    </div>

    <div class="row mb-2 mx-5">
      <div class="col-sm-5 text-danger">{{ errMsg }}</div>
    </div>

    <div class="d-flex justify-content-center">
      <button
        id="btn-save-info"
        type="submit"
        class="btn btn-primary btn-block w-auto my-1 py-2 rounded-3"
      >
        Lưu Thay Đổi
      </button>
    </div>
  </form>
</template>

<script>
import axiosInstance from "../../services/axiosInstance.js";
import "../css-component/info-tab.css";

export default {
  name: "InfoTab",
  data() {
    return {
      name: null,
      email: null,
      phone: null,
      gender: null,
      birthday: null,
      nameErr: "",
      phoneErr: "",
      birthdayErr: "",
      errMsg: null,

      isLoading: false,
    };
  },
  methods: {
    async validateAndSubmitInfo(event) {
      this.isLoading = true;

      event.preventDefault();

      // Validate
      const phoneRegex = /^[0-9]{10}$/;

      let formValid = true;

      if (!this.name) {
        this.nameErr = "Hãy nhập tên của bạn";
        formValid = false;
      } else {
        this.nameErr = "";
      }

      if (!this.phone) {
        this.phoneErr = "Hãy nhập số điện thoại";
        formValid = false;
      } else if (!phoneRegex.test(this.phone)) {
        this.phoneErr = "Số điện thoại không đúng định dạng 10 chữ số";
        formValid = false;
      } else {
        this.phoneErr = "";
      }

      if (!this.birthday) {
        this.birthdayErr = "Hãy nhập ngày sinh";
        formValid = false;
      } else {
        this.birthdayErr = "";
      }

      //Nếu không có lỗi thì submit form
      if (!formValid) {
        this.isLoading = false;
        return;
      }

      try {
        const response = await axiosInstance.put("/account/profile", {
          name: this.name,
          phone: this.phone,
          gender: this.gender,
          birthday: this.birthday,
        });

        if (response.status === 200) {
          this.isLoading = false;

          this.$router.push("/").then(() => {
            this.$router.replace("/profile/info");
          });
        }
      } catch (error) {
        this.isLoading = false;

        if (error.response) {
          const status = error.response.status;
          const message = error.response.data.message;

          // Xử lý các mã lỗi cụ thể
          if (status === 400) {
            this.errMsg = message;
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
    async handleRouteChange() {
      try {
        this.isLoading = true;

        // Gửi yêu cầu để lấy thông tin người dùng
        const response = await axiosInstance.get("/account/profile");
        if (response.status === 200) {
          const user = response.data.user;
          this.name = user.name;
          this.email = user.email;
          this.phone = user.phone;
          this.gender = user.gender;
          this.birthday = user.birth_date
            ? new Date(user.birth_date).toLocaleDateString("en-CA") // Sử dụng "en-CA" để có định dạng YYYY-MM-DD
            : null;

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
        if (error.response.status === 404) {
          // Không tìm thấy người dùng
          this.$router.push("/login");
        }
        if (error.response.status === 500) {
          // Lỗi server
          this.$router.push("/login");
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
