import { createRouter, createWebHistory } from "vue-router";
import UserApp from "../components/vue-component/UserApp.vue";
import AdminApp from "../components/vue-component/AdminApp.vue";

import LoginPage from "../components/vue-component/DetailAccount.vue";
import HomePage from "../components/vue-component/Home.vue";
import RegisterPage from "../components/vue-component/Register.vue";
import ProfilePage from "../components/vue-component/Profile.vue";
import BookPage from "../components/vue-component/Book.vue";
import SearchPage from "../components/vue-component/Search.vue"
import CartPage from "../components/vue-component/Cart.vue"
import GenrePage from "../components/vue-component/GenreBook.vue"
import CheckoutPage from "../components/vue-component/CheckoutPage.vue"
import Intro from "../components/vue-component/Intro.vue"
import New from "../components/vue-component/New.vue"
import Colab from "../components/vue-component/Colab.vue"
import Lookup from "../components/vue-component/Lookup.vue"

import InfoTab from "../components/vue-component/InfoTab.vue"
import AddressTab from "../components/vue-component/AddressTab.vue"
import OrderTab from "../components/vue-component/OrderTab.vue"
import BankAccountTab from "../components/vue-component/BankAccountTab.vue"
import ChangePasswordTab from "../components/vue-component/ChangePasswordTab.vue"

import DefaultAddressPage from "../components/vue-component/DefaultAddressPage.vue"
import AddressAddPage from "../components/vue-component/AddressAddPage.vue"
import AddressEditPage from "../components/vue-component/AddressEditPage.vue"



import AdminUser from "../components/vue-component/AdminUser.vue"
import AdminOrder from "../components/vue-component/AdminOrder.vue"
import AdminPoster from "../components/vue-component/AdminPoster.vue"
import AdminThongKe from "../components/vue-component/Admin-thongke-M.vue"
import AdminQuanLiSach from "../components/vue-component/Admin-quanlisach-M.vue"
import AdminQuanLiTheLoai from "../components/vue-component/Admin-quanlitheloai-M.vue"

import AdminNewOrder from "../components/vue-component/AdminNewOrder.vue"
import AdminApprovedOrder from "../components/vue-component/AdminApprovedOrder.vue"
import AdminRefuseOrder from "../components/vue-component/AdminRefuseOrder.vue"
import AdminCancelledOrder from "../components/vue-component/AdminCancelledOrder.vue"
import AdminDeliveryOrder from "../components/vue-component/AdminDeliveryOrder.vue"
import AdminCompleteOrder from "../components/vue-component/AdminCompleteOrder.vue"
import axiosInstance from "../services/axiosInstance.js";


const routes = [
  {
    path: "/",
    component: UserApp, // Layout cho user
    children: [
      { path: "", component: HomePage, name: "HomePage" },
      { path: "login", component: LoginPage, name: "LoginPage" },
      { path: "register", component: RegisterPage, name: "RegisterPage" },
      { path: "/genre", component: GenrePage, name: "GenrePage" },
      {
        path: "profile", component: ProfilePage, name: "ProfilePage", children: [
          { path: "info", component: InfoTab, name: "InfoTab" },
          {
            path: "address", component: AddressTab, name: "AddressTab", children: [
              { path: "", component: DefaultAddressPage, name: "DefaultAddressPage" },
              { path: "add", component: AddressAddPage, name: "AddressAddPage" },
              { path: "edit", component: AddressEditPage, name: "AddressEditPage" },
            ],
          },
          { path: "order", component: OrderTab, name: "OrderTab" },
          { path: "bankaccount", component: BankAccountTab, name: "BankAccountTab" },
          { path: "changePW", component: ChangePasswordTab, name: "ChangePasswordTab" },
        ],
      },
      { path: "book", component: BookPage, name: "BookPage" },
      { path: "search", component: SearchPage, name: "SearchPage" },
      { path: "cart", component: CartPage, name: "CartPage" },
      { path: "checkout", component: CheckoutPage, name: "CheckoutPage" },
      { path: "intro", component: Intro, name: "IntroPage" },
      { path: "new", component: New, name: "NewPage" },
      { path: "colab", component: Colab, name: "ColabPage" },
      { path: "lookup", component: Lookup, name: "LookupPage" },
    ]
  },
  {
    path: "/admin",
    component: AdminApp, // Layout cho admin
    beforeEnter: async (to, from, next) => {
      try {
        const response = await axiosInstance.get("/account/profile");
        if (response.status === 200) {
          const user = response.data.user;

          // Nếu là người dùng thường thì đẩy về trang user
          if (user.role === "1") {
            alert("Bạn phải là admin để truy cập vào đường dẫn này!");
            next("/");
          }
          else { next(); }
        }
        next("/login");
      } catch (error) {
        if (error.response) {
          const status = error.response.status;
          const message = error.response.data.message;

          // Xử lý các mã lỗi cụ thể
          if (status === 404) {
            // Nếu lỗi là ko có người dùng hoặc không hợp lệ thì đẩy về login
            next("/login");
          } else if (status === 500) {
            alert(message);
            next("/login");
          }
          next("/login");
        } else {
          // Xử lý lỗi nếu không có phản hồi (chẳng hạn lỗi kết nối mạng)
          alert("Lỗi mạng: Không thể kết nối đến server.");
          next("/login")
        }
      }
    },
    children: [
      { path: "", redirect: "admin/dashboard" },
      { path: "dashboard", component: AdminThongKe, name: "AdminDashboard" },
      { path: "user", component: AdminUser, name: "AdminUser" },
      { path: "product", component: AdminQuanLiSach, name: "AdminProduct" },
      { path: "category", component: AdminQuanLiTheLoai, name: "AdminCategory" },
      {
        path: "order", component: AdminOrder, name: "AdminOrder", children: [
          { path: "neworder", component: AdminNewOrder, name: "AdminNewOrder" },
          { path: "approved", component: AdminApprovedOrder, name: "AdminApprovedOrder" },
          { path: "refuse", component: AdminRefuseOrder, name: "AdminRefuseOrder" },
          { path: "cancelled", component: AdminCancelledOrder, name: "AdminCancelledOrder" },
          { path: "delivery", component: AdminDeliveryOrder, name: "AdminDeliveryOrder" },
          { path: "complete", component: AdminCompleteOrder, name: "AdminCompleteOrder" },
        ],
      },
      { path: "poster", component: AdminPoster, name: "AdminPoster" },
    ],
  },
];


const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    // Cuộn trang lên đầu khi chuyển đến trang mới
    return { top: 0, left: 0 };
  },
});

export default router;
