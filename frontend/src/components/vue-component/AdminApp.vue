<template>
  <div id="admin-app-root" style="cursor: default">
    <AdminHeader />

    <div class="admin-body">
      <div class="admin-side">
        <div class="admin-side-body">
          <div class="admin-side-title fs-4 fw-bold text-primary">MENU</div>

          <div
            class="admin-side-tab border rounded-3"
            :class="{
              'text-primary border-primary':
                activeTab === 'dashboard' || hoverTab === 'dashboard',
              'text-secondary border-secondary-subtle':
                activeTab !== 'dashboard' && hoverTab !== 'dashboard',
            }"
            @mouseenter="hoverTab = 'dashboard'"
            @mouseleave="hoverTab = null"
            @click="switchTab('dashboard')"
          >
            <i class="fa-solid fa-chart-pie me-2 col-sm-1 text-center"></i>
            Thống Kê
          </div>

          <div
            class="admin-side-tab border rounded-3"
            :class="{
              'text-primary border-primary mb-0 rounded-bottom-0':
                activeTab === 'order',
              'text-primary border-primary': hoverTab === 'order',
              'text-secondary border-secondary-subtle':
                activeTab !== 'order' && hoverTab !== 'order',
            }"
            @mouseenter="hoverTab = 'order'"
            @mouseleave="hoverTab = null"
            @click="switchOrderTab('neworder')"
          >
            <i class="fa-solid fa-receipt me-2 col-sm-1 text-center"></i> Đơn
            Hàng
          </div>

          <div
            class="admin-side-tab my-0 border border-top-0"
            :class="{
              'text-primary border-primary':
                activeSubTab === 'neworder' || hoverTab === 'neworder',
              'text-secondary border-secondary-subtle':
                activeSubTab !== 'neworder' && hoverTab !== 'neworder',
              'border-bottom-0':
                activeSubTab === 'approved' || hoverTab === 'approved',
            }"
            @mouseenter="hoverTab = 'neworder'"
            @mouseleave="hoverTab = null"
            @click="switchOrderTab('neworder')"
            v-if="activeTab === 'order'"
          >
            <i class="fa-solid fa-scroll me-2 col-sm-1 text-center"></i> Đơn
            Hàng Mới
          </div>

          <div
            class="admin-side-tab my-0 border"
            :class="{
              'text-primary border-primary':
                activeSubTab === 'approved' || hoverTab === 'approved',
              'text-secondary border-secondary-subtle border-top-0':
                activeSubTab !== 'approved' && hoverTab !== 'approved',
              'border-bottom-0':
                activeSubTab === 'refuse' || hoverTab === 'refuse',
            }"
            @mouseenter="hoverTab = 'approved'"
            @mouseleave="hoverTab = null"
            @click="switchOrderTab('approved')"
            v-if="activeTab === 'order'"
          >
            <i class="fa-regular fa-circle-check me-2 col-sm-1 text-center"></i> Đơn Hàng
            Đã Xác Nhận
          </div>

          <div
            class="admin-side-tab my-0 border"
            :class="{
              'text-primary border-primary':
                activeSubTab === 'refuse' || hoverTab === 'refuse',
              'text-secondary border-secondary-subtle border-top-0':
                activeSubTab !== 'refuse' && hoverTab !== 'refuse',
              'border-bottom-0':
                activeSubTab === 'cancelled' || hoverTab === 'cancelled',
            }"
            @mouseenter="hoverTab = 'refuse'"
            @mouseleave="hoverTab = null"
            @click="switchOrderTab('refuse')"
            v-if="activeTab === 'order'"
          >
            <i class="fa-solid fa-ban me-2 col-sm-1 text-center"></i> Từ Chối
            Đơn Hàng
          </div>

          <div
            class="admin-side-tab my-0 border"
            :class="{
              'text-primary border-primary':
                activeSubTab === 'cancelled' || hoverTab === 'cancelled',
              'text-secondary border-secondary-subtle border-top-0':
                activeSubTab !== 'cancelled' && hoverTab !== 'cancelled',
              'border-bottom-0':
                activeSubTab === 'delivery' || hoverTab === 'delivery',
            }"
            @mouseenter="hoverTab = 'cancelled'"
            @mouseleave="hoverTab = null"
            @click="switchOrderTab('cancelled')"
            v-if="activeTab === 'order'"
          >
            <i class="fa-solid fa-xmark me-2 col-sm-1 text-center"></i> Đơn Hàng Bị Hủy
          </div>

          <div
            class="admin-side-tab my-0 border"
            :class="{
              'text-primary border-primary':
                activeSubTab === 'delivery' || hoverTab === 'delivery',
              'text-secondary border-secondary-subtle border-top-0':
                activeSubTab !== 'delivery' && hoverTab !== 'delivery',
              'border-bottom-0':
                activeSubTab === 'complete' || hoverTab === 'complete',
            }"
            @mouseenter="hoverTab = 'delivery'"
            @mouseleave="hoverTab = null"
            @click="switchOrderTab('delivery')"
            v-if="activeTab === 'order'"
          >
            <i class="fa-solid fa-truck me-2 col-sm-1 text-center"></i> Đơn Hàng
            Đang Giao
          </div>

          <div
            class="admin-side-tab mt-0 border rounded-bottom-3"
            :class="{
              'text-primary border-primary':
                activeSubTab === 'complete' || hoverTab === 'complete',
              'text-secondary border-secondary-subtle border-top-0':
                activeSubTab !== 'complete' && hoverTab !== 'complete',
            }"
            @mouseenter="hoverTab = 'complete'"
            @mouseleave="hoverTab = null"
            @click="switchOrderTab('complete')"
            v-if="activeTab === 'order'"
          >
            <i class="fa-solid fa-circle-check me-2 col-sm-1 text-center"></i> Đơn Đã
            Hoàn Thành
          </div>

          <div
            class="admin-side-tab border rounded-3"
            :class="{
              'text-primary border-primary':
                activeTab === 'category' || hoverTab === 'category',
              'text-secondary border-secondary-subtle':
                activeTab !== 'category' && hoverTab !== 'category',
            }"
            @mouseenter="hoverTab = 'category'"
            @mouseleave="hoverTab = null"
            @click="switchTab('category')"
          >
            <i class="fa-solid fa-list-ul me-2 col-sm-1 text-center"></i> Danh
            mục
          </div>

          <div
            class="admin-side-tab border rounded-3"
            :class="{
              'text-primary border-primary':
                activeTab === 'product' || hoverTab === 'product',
              'text-secondary border-secondary-subtle':
                activeTab !== 'product' && hoverTab !== 'product',
            }"
            @mouseenter="hoverTab = 'product'"
            @mouseleave="hoverTab = null"
            @click="switchTab('product')"
          >
            <i class="fa-solid fa-box-open me-2 col-sm-1 text-center"></i> Sản
            Phẩm
          </div>

          <div
            class="admin-side-tab border rounded-3"
            :class="{
              'text-primary border-primary':
                activeTab === 'user' || hoverTab === 'user',
              'text-secondary border-secondary-subtle':
                activeTab !== 'user' && hoverTab !== 'user',
            }"
            @mouseenter="hoverTab = 'user'"
            @mouseleave="hoverTab = null"
            @click="switchTab('user')"
          >
            <i class="fa-solid fa-user me-2 col-sm-1 text-center"></i> Tài Khoản
          </div>

          <div
            class="admin-side-tab border rounded-3"
            :class="{
              'text-primary border-primary':
                activeTab === 'poster' || hoverTab === 'poster',
              'text-secondary border-secondary-subtle':
                activeTab !== 'poster' && hoverTab !== 'poster',
            }"
            @mouseenter="hoverTab = 'poster'"
            @mouseleave="hoverTab = null"
            @click="switchTab('poster')"
          >
            <i class="fa-solid fa-images me-2 col-sm-1 text-center"></i> Poster
          </div>
        </div>
      </div>
      <div class="admin-content col">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import "../css-component/admin-app.css";

import AdminHeader from "./AdminHeader.vue";

export default {
  name: "AdminApp",
  components: {
    AdminHeader,
  },
  data() {
    return {
      activeTab: "dashboard", //Mục đang hiển thị
      activeSubTab: "neworder",
      subtab: null, //Mục con trong tab

      hoverTab: null,
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
    switchTab(tab) {
      this.$router.push(`/admin/${tab}`);
    },
    switchOrderTab(subtab) {
      this.$router.push(`/admin/order/${subtab}`);
    },
    async handleRouteChange() {
      const paths = this.$route.path.split("/"); // Lấy tab từ URL
      const basePathIndex = paths.findIndex((path) => path === "admin"); // Xác định vị trí "admin"

      this.activeTab = paths[basePathIndex + 1] || "dashboard"; // Tab
      this.activeSubTab = paths[basePathIndex + 2] || null;
    },
  },
};
</script>
