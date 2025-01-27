<template>
  <form class="address-add-tab-body" @submit="validateAndSubmitAddress">
    <div v-if="isLoading" class="loading-overlay">
      <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>


    <div class="row mb-4 mx-5">
      <label for="address-add-name" class="col-sm-3 col-form-label">Tên</label>
      <div class="col-sm-9">
        <input
          name="name"
          type="text"
          id="address-add-name"
          class="form-control"
          :class="{ 'is-invalid': nameErr !== '' }"
          placeholder="Nhập tên"
          v-model="name"
        />
        <div class="invalid-feedback ps-1 mt-2">
          {{ nameErr }}
        </div>
      </div>
    </div>

    <div class="row mb-4 mx-5">
      <label for="address-add-phone" class="col-sm-3 col-form-label"
        >Điện thoại</label
      >
      <div class="col-sm-9">
        <input
          name="phone"
          type="text"
          id="address-add-phone"
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
      <label for="address-add-country" class="col-sm-3 col-form-label"
        >Quốc gia</label
      >
      <div class="col-sm-9">
        <input
          name="country"
          type="text"
          id="address-add-country"
          class="form-control"
          :class="{ 'is-invalid': countryErr !== '' }"
          placeholder="Nhập quốc gia"
          v-model="country"
        />
        <div class="invalid-feedback ps-1 mt-2">
          {{ countryErr }}
        </div>
      </div>
    </div>

    <div class="row mb-4 mx-5">
      <label for="address-add-city" class="col-sm-3 col-form-label"
        >Tỉnh/Thành phố</label
      >
      <div class="col-sm-9">
        <input
          name="city"
          type="text"
          id="address-add-city"
          class="form-control"
          :class="{ 'is-invalid': cityErr !== '' }"
          placeholder="Nhập tỉnh/thành phố"
          v-model="city"
        />
        <div class="invalid-feedback ps-1 mt-2">
          {{ cityErr }}
        </div>
      </div>
    </div>

    <div class="row mb-4 mx-5">
      <label for="address-add-district" class="col-sm-3 col-form-label"
        >Quận/Huyện</label
      >
      <div class="col-sm-9">
        <input
          name="district"
          type="text"
          id="address-add-district"
          class="form-control"
          :class="{ 'is-invalid': districtErr !== '' }"
          placeholder="Nhập quận/huyện"
          v-model="district"
        />
        <div class="invalid-feedback ps-1 mt-2">
          {{ districtErr }}
        </div>
      </div>
    </div>

    <div class="row mb-4 mx-5">
      <label for="address-add-ward" class="col-sm-3 col-form-label"
        >Xã/Phường</label
      >
      <div class="col-sm-9">
        <input
          name="ward"
          type="text"
          id="address-add-ward"
          class="form-control"
          :class="{ 'is-invalid': wardErr !== '' }"
          placeholder="Nhập xã/phường"
          v-model="ward"
        />
        <div class="invalid-feedback ps-1 mt-2">
          {{ wardErr }}
        </div>
      </div>
    </div>

    <div class="row mb-4 mx-5">
      <label for="address-add-stAddress" class="col-sm-3 col-form-label"
        >Địa chỉ</label
      >
      <div class="col-sm-9">
        <input
          name="stAddress"
          type="text"
          id="address-add-stAddress"
          class="form-control"
          :class="{ 'is-invalid': stAddressErr !== '' }"
          placeholder="Nhập địa chỉ nơi ở"
          v-model="stAddress"
        />
        <div class="invalid-feedback ps-1 mt-2">
          {{ stAddressErr }}
        </div>
      </div>
    </div>

    <div class="row mb-2 mx-5">
      <div class="col-sm-5 text-danger">{{ errMsg }}</div>
    </div>

    <div class="row mb-2 mx-5">
      <div class="col-sm-3">
        <router-link to="/profile/address">
        <button
            type="button"
            class="btn btn-primary btn-block rounded-3"
          >
            ◄ Quay lại
          </button>
        </router-link>
      </div>

      <div class="col-sm-9 d-flex justify-content-end">
        <button
          id="btn-save-address"
          type="submit"
          class="btn btn-primary btn-block rounded-3"
        >
          Lưu Địa Chỉ
        </button>
      </div>
    </div>
  </form>
</template>

<script>
import "../css-component/address-add-tab.css";
import axiosInstance from "../../services/axiosInstance.js";

export default {
  name: "AddressAddPage",
  data() {
    return {
      name: null,
      phone: null,
      country: null,
      city: null,
      district: null,
      ward: null,
      stAddress: null,
      nameErr: "",
      phoneErr: "",
      countryErr: "",
      cityErr: "",
      districtErr: "",
      wardErr: "",
      stAddressErr: "",
      errMsg: null,

      isLoading: false,
    };
  },
  methods: {
    async validateAndSubmitAddress(event) {
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

      if (!this.country) {
        this.countryErr = "Không được để trống thông tin này";
        formValid = false;
      } else {
        this.countryErr = "";
      }

      if (!this.city) {
        this.cityErr = "Không được để trống thông tin này";
        formValid = false;
      } else {
        this.cityErr = "";
      }

      if (!this.district) {
        this.districtErr = "Không được để trống thông tin này";
        formValid = false;
      } else {
        this.districtErr = "";
      }

      if (!this.ward) {
        this.wardErr = "Không được để trống thông tin này";
        formValid = false;
      } else {
        this.wardErr = "";
      }

      if (!this.stAddress) {
        this.stAddressErr = "Không được để trống thông tin này";
        formValid = false;
      } else {
        this.stAddressErr = "";
      }

      //Nếu không có lỗi thì submit form
      if (!formValid) {
        this.isLoading = false;
        return;
      }

      try {
        const response = await axiosInstance.post("/account/create-address", {
          name: this.name,
          phone: this.phone,
          country: this.country,
          city: this.city,
          district: this.district,
          ward: this.ward,
          address: this.stAddress,
        });

        if (response.status === 200) {
          this.isLoading = false;
          
          this.$router.push("/profile/address");
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