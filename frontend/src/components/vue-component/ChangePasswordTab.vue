<template>
  <form class="changepw-tab-body" @submit="validateAndSubmitChangePW">
    <div v-if="isLoading" class="loading-overlay">
      <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>

    <div class="row mb-4 mx-5">
      <label for="profile-password" class="col-sm-3 col-form-label"
        >Mật khẩu hiện tại</label
      >
      <div class="col-sm-7">
        <input
          name="password"
          type="password"
          id="profile-password"
          class="form-control"
          :class="{ 'is-invalid': passwordErr !== '' }"
          placeholder="Nhập mật khẩu hiện tại của bạn"
          v-model="password"
        />
        <div class="invalid-feedback ps-1 mt-2">
          {{ passwordErr }}
        </div>
      </div>
    </div>

    <div class="row mb-4 mx-5">
      <label for="profile-newPassword" class="col-sm-3 col-form-label"
        >Mật khẩu mới</label
      >
      <div class="col-sm-7">
        <input
          name="newPassword"
          type="password"
          id="profile-newPassword"
          class="form-control"
          :class="{ 'is-invalid': newPasswordErr !== '' }"
          placeholder="Nhập mật khẩu mới"
          v-model="newPassword"
        />
        <div class="invalid-feedback ps-1 mt-2">
          {{ newPasswordErr }}
        </div>
      </div>
    </div>

    <div class="row mb-4 mx-5">
      <label for="profile-newPasswordAgain" class="col-sm-3 col-form-label"
        >Nhập lại mật khẩu mới</label
      >
      <div class="col-sm-7">
        <input
          name="newPasswordAgain"
          type="password"
          id="profile-newPasswordAgain"
          class="form-control"
          :class="{ 'is-invalid': newPasswordAgainErr !== '' }"
          placeholder="Nhập lại mật khẩu mới"
          v-model="newPasswordAgain"
        />
        <div class="invalid-feedback ps-1 mt-2">
          {{ newPasswordAgainErr }}
        </div>
      </div>
    </div>

    <div class="row mb-2 mx-5">
      <div class="col-sm-5 text-danger">{{ errMsg }}</div>
    </div>

    <div class="d-flex justify-content-center">
      <button
        id="btn-save-changePW"
        type="submit"
        class="btn btn-primary btn-block w-auto my-1 py-2 rounded-3"
      >
        Lưu Mật Khẩu
      </button>
    </div>
  </form>
</template>

<script>
import axiosInstance from "../../services/axiosInstance.js";
import "../css-component/changepw-tab.css";

export default {
  name: "ChangePasswordTab",
  data() {
    return {
      password: "",
      newPassword: "",
      newPasswordAgain: "",
      passwordErr: "",
      newPasswordErr: "",
      newPasswordAgainErr: "",

      errMsg: null,

      isLoading: false,
    };
  },
  methods: {
    async validateAndSubmitChangePW(event) {
      this.isLoading = true;

      event.preventDefault();

      // Validate
      const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[^\s]{6,13}$/;

      let formValid = true;

      if (!this.password) {
        this.passwordErr = "Hãy nhập mật khẩu";
        formValid = false;
      } else if (!passwordRegex.test(this.password)) {
        this.passwordErr =
          "Mật khẩu phải có 6-13 chữ số, phải có ký tự chữ cái, chữ số 0-9 và không được có khoảng trắng";
        formValid = false;
      } else {
        this.passwordErr = "";
      }

      if (!this.newPassword) {
        this.newPasswordErr = "Hãy nhập mật khẩu";
        formValid = false;
      } else if (!passwordRegex.test(this.newPassword)) {
        this.newPasswordErr =
          "Mật khẩu phải có 6-13 chữ số, phải có ký tự chữ cái, chữ số 0-9 và không được có khoảng trắng";
        formValid = false;
      } else if (this.newPassword === this.password) {
        this.newPasswordErr =
          "Mật khẩu mới không được giống với mật khẩu cũ của bạn";
        formValid = false;
      } else {
        this.newPasswordErr = "";
      }

      if (!this.newPasswordAgain) {
        this.newPasswordAgainErr = "Hãy nhập mật khẩu xác nhận";
        formValid = false;
      } else if (this.newPassword !== this.newPasswordAgain) {
        this.newPasswordAgainErr = "Mật khẩu xác nhận không đúng";
        formValid = false;
      } else {
        this.newPasswordAgainErr = "";
      }

      //Nếu không có lỗi thì submit form
      if (!formValid) {
        this.isLoading = false;
        return;
      }

      try {
        const response = await axiosInstance.put("/account/password", {
          password: this.password,
          newPassword: this.newPassword,
          newPasswordAgain: this.newPasswordAgain,
        });

        if (response.status === 200) {
          this.isLoading = false;
          alert(response.data.message);
          this.$router.push("/profile/info");
        }
      } catch (error) {
        this.isLoading = false;

        if (error.response) {
          const status = error.response.status;
          const message = error.response.data.message;

          // Xử lý các mã lỗi cụ thể
          if (status === 400) {
            this.errMsg = message;
          } else if (status === 401) {
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
  },
};
</script>