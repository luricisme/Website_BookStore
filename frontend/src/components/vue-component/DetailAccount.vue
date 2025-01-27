<template>
  <div class="login-body">
    <div v-if="isLoading" class="loading-overlay">
      <div
        class="spinner-border text-primary"
        style="width: 3rem; height: 3rem"
        role="status"
      >
        <span class="sr-only">Loading...</span>
      </div>
    </div>

    <form class="login-container" @submit="validateAndSubmit">
      <h3 class="text-primary mb-4">ĐĂNG NHẬP</h3>

      <div class="form-outline mb-4">
        <label class="form-label ps-1 mb-1" for="login-email">Email</label>
        <input
          name="email"
          type="text"
          id="login-email"
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
        <label class="form-label ps-1 mb-1" for="login-password"
          >Mật khẩu</label
        >
        <input
          name="password"
          type="password"
          id="login-password"
          class="form-control"
          :class="{ 'is-invalid': passwordErr !== '' }"
          placeholder="Nhập mật khẩu"
          v-model="password"
        />
        <div class="invalid-feedback ps-1">
          {{ passwordErr }}
        </div>
      </div>

      <div class="text-danger ms-1 mb-2">{{ errMsg }}</div>

      <div class="text-center mb-3 pt-2">
        <button
          id="btn-login"
          type="submit"
          class="btn btn-primary btn-block w-100 mb-2 py-2"
        >
          ĐĂNG NHẬP
        </button>
        <a class="text-muted" href="#!">Quên mật khẩu</a>
      </div>

      <div class="text-center mb-1">
        Bạn chưa có tài khoản? <router-link to="/register">Đăng ký</router-link>
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
import "../css-component/login-account.css";
import axiosInstance from "../../services/axiosInstance.js";

export default {
  name: "LoginPage",
  data() {
    return {
      email: "",
      password: "",
      emailErr: "",
      passwordErr: "",
      errMsg: null,

      isLoading: false,
    };
  },
  methods: {
    async validateAndSubmit(event) {
      this.isLoading=true;

      event.preventDefault();

      // Validate
      const emailRegex =
        /^(?=.{1,256}$)(?=.{1,64}@)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[^\s]{6,13}$/;

      let formValid = true;

      if (!this.email) {
        this.emailErr = "Hãy nhập email";
        formValid = false;
      } else if (!emailRegex.test(this.email)) {
        this.emailErr = "Email không đúng định dạng";
        formValid = false;
      } else {
        this.emailErr = "";
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

      //Nếu không có lỗi thì submit form
      if (!formValid) {
        this.isLoading=false;
        return;
      }

      try {
        // Gửi yêu cầu đăng nhập
        const response = await axiosInstance.post("/login", {
          email: this.email,
          password: this.password,
        });
        console.log('RESPONSE: ', response.data);

        // Kiểm tra token từ phản hồi và lưu vào localStorage
        const token = response.data.accessToken; // Giả sử bạn trả về accessToken trong body response
        // console.log(token);
        const role = response.data.role;

        // Lưu token vào LocalStorage
        localStorage.setItem("accessToken", token);
        console.log(
          "Access token saved to localStorage:",
          localStorage.getItem("accessToken")
        );

        if(role === '1'){
          this.$router.push("/");
        }else if(role === '2'){
          this.$router.push("/admin/dashboard");
        }
        this.isLoading = false;
      } catch (error) {
        this.isLoading=false;
        
        // Xử lý lỗi khi đăng nhập
        if (error.response) {
          const status = error.response.status;
          const message = error.response.data.message;

          // Xử lý các mã lỗi cụ thể
          if (status === 400) {
            this.errMsg = message;
          } else if (status === 401) {
            this.errMsg = message;
          } else if (status === 500) {
            this.errMsg = message;
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
