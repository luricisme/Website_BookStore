<template>
  <div class="register-body">
    <div v-if="isLoading" class="loading-overlay">
      <div
        class="spinner-border text-primary"
        style="width: 3rem; height: 3rem"
        role="status"
      >
        <span class="sr-only">Loading...</span>
      </div>
    </div>

    <form class="register-container" @submit="validateAndSubmit">
      <h3 class="text-primary mb-4">ĐĂNG KÝ</h3>

      <div class="form-outline mb-4">
        <label class="form-label ps-1 mb-1" for="register-name"
          >Họ và tên</label
        >
        <input
          name="name"
          type="text"
          id="register-name"
          class="form-control"
          :class="{ 'is-invalid': nameErr !== '' }"
          placeholder="Nhập họ và tên của bạn"
          v-model="name"
        />
        <div class="invalid-feedback ps-1">
          {{ nameErr }}
        </div>
      </div>

      <div class="form-outline mb-4">
        <label class="form-label ps-1 mb-1" for="register-email">Email</label>
        <input
          name="email"
          type="text"
          id="register-email"
          class="form-control"
          :class="{ 'is-invalid': emailErr !== '' }"
          placeholder="Nhập email"
          v-model="email"
        />
        <div class="invalid-feedback ps-1">
          {{ emailErr }}
        </div>
      </div>

      <div class="form-outline mb-4">
        <label class="form-label ps-1 mb-1" for="register-phone"
          >Số điện thoại</label
        >
        <input
          name="phone"
          type="tel"
          id="register-phone"
          class="form-control"
          :class="{ 'is-invalid': phoneErr !== '' }"
          placeholder="Nhập số điện thoại"
          v-model="phone"
        />
        <div class="invalid-feedback ps-1">
          {{ phoneErr }}
        </div>
      </div>

      <div class="form-outline mb-4">
        <label class="form-label ps-1 mb-1" for="register-password"
          >Mật khẩu</label
        >
        <input
          name="password"
          type="password"
          id="register-password"
          class="form-control"
          :class="{ 'is-invalid': passwordErr !== '' }"
          placeholder="Nhập mật khẩu"
          v-model="password"
        />
        <div class="invalid-feedback ps-1">
          {{ passwordErr }}
        </div>
      </div>

      <div class="form-outline mb-4">
        <label class="form-label ps-1 mb-1" for="register-confirm-password"
          >Xác nhận mật khẩu</label
        >
        <input
          name="confirmedPassword"
          type="password"
          id="register-confirm-password"
          class="form-control"
          :class="{ 'is-invalid': confirmPasswordErr !== '' }"
          placeholder="Nhập lại mật khẩu"
          v-model="confirmPassword"
        />
        <div class="invalid-feedback ps-1">
          {{ confirmPasswordErr }}
        </div>
      </div>

      <div class="text-danger ms-1 mb-2">{{ errMsg }}</div>

      <button
        id="btn-regist"
        type="submit"
        class="btn btn-primary btn-block w-100 mb-4 mt-2"
      >
        ĐĂNG KÝ
      </button>

      <div class="text-center mb-1">
        Bạn đã có tài khoản? <router-link to="/login">Đăng nhập</router-link>
      </div>

      <div class="d-flex align-items-center justify-content-center">
        Hoặc đăng nhập với
        <a href="https://localhost:8888/auth/google"
          ><img
            src="../../../public/gg_icon.svg"
            alt="Google Logo"
            class="gg-icon"
        /></a>
      </div>
    </form>
  </div>
</template>

<script>
import "../css-component/register.css";

export default {
  name: "RegisterPage",
  data() {
    return {
      name: "",
      email: "",
      phone: "",
      // birthdate: "",
      password: "",
      confirmPassword: "",
      nameErr: "",
      emailErr: "",
      phoneErr: "",
      // birthdateErr: "",
      passwordErr: "",
      confirmPasswordErr: "",

      errMsg: null,

      isLoading: false,
    };
  },
  methods: {
    async validateAndSubmit(event) {
      this.isLoading = true;

      event.preventDefault();

      // Validate
      const emailRegex =
        /^(?=.{1,256}$)(?=.{1,64}@)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const phoneRegex = /^[0-9]{10}$/;
      const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[^\s]{6,13}$/;

      let formValid = true;

      if (!this.name) {
        this.nameErr = "Hãy nhập tên của bạn";
        formValid = false;
      } else {
        this.nameErr = "";
      }

      if (!this.email) {
        this.emailErr = "Hãy nhập email";
        formValid = false;
      } else if (!emailRegex.test(this.email)) {
        this.emailErr = "Email không đúng định dạng";
        formValid = false;
      } else {
        this.emailErr = "";
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

      if (!this.confirmPassword) {
        this.confirmPasswordErr = "Hãy nhập mật khẩu xác nhận";
        formValid = false;
      } else if (this.password !== this.confirmPassword) {
        this.confirmPasswordErr = "Mật khẩu xác nhận không đúng";
        formValid = false;
      } else {
        this.confirmPasswordErr = "";
      }

      //Nếu không có lỗi thì submit form
      if (!formValid) {
        this.isLoading = false;
        return;
      }

      try {
        const response = await fetch("https://localhost:8888/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: this.name,
            email: this.email,
            phone: this.phone,
            password: this.password,
            confirmedPassword: this.confirmPassword,
          }),
          credentials: "include",
        });

        const data = await response.json();

        if (response.status === 201) {
          // Nếu thành công, chuyển hướng về trang login
          this.$router.push("/login");
        } else if (response.status === 400) {
          // Nếu thiếu dữ liệu
          this.errMsg = data.message;
        } else if (response.status === 409) {
          // Tài khoản đã tồn tại
          this.errMsg = data.message;
        } else if (response.status === 500) {
          // Nếu có lỗi server
          this.errMsg = data.message;
        } else if (response.status === 502) {
          // Nếu có lỗi server
          this.errMsg = data.message;
        }

        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;

        console.error("Error:", error);
        alert("Lỗi mạng: Không thể kết nối đến server.");
      }
    },
  },
};
</script>
