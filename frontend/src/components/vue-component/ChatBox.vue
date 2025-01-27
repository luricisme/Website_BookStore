<template>
  <button class="btnChat" @click="chatClick">
    <i class="fa-brands fa-facebook-messenger"></i>
    <div class="chatBox" v-if="chatBoxVisible" @click.stop="doSth">
      <div class="chatBoxHeader">Hỗ Trợ Khách Hàng</div>
      <div class="chatContent">
        <p>Hello! How can I assist you today?</p>
      </div>
      <textarea class="chatInput" placeholder="Type your message..."></textarea>
    </div>
  </button>
</template>

<script>
import '../css-component/chat-box.css';

export default {
  name: "ChatBox",
  data() {
    return {
      chatBoxVisible: false,
    };
  },
  methods: {
    chatClick() {
      // Ẩn hiện chatbox ấn nút
      if (this.chatBoxVisible === false) {
        this.chatBoxVisible = true;
      } else {
        this.chatBoxVisible = false;
      }
    },
  },
};
</script>