<template>
  <div class="app-wrapper">
    <div class="main-container">
      <div class="fixed-header">
        <navbar />
      </div>
      <app-main />
    </div>
  </div>
</template>

<script>
import { Navbar, AppMain } from "./components";
// import ResizeMixin from "./mixin/ResizeHandler";

export default {
  name: "Layout",
  components: {
    Navbar,
    AppMain,
  },
  
  sockets: {
    receive_message: function (data) {
      if (this.$route.path.indexOf("/user/dialog") != -1) {
        console.log("由页面上的接收消息事件去接收");
        return;
      }
      // 处理数据，红点
      data.ack = true;
      this.handleReceiveMessage(data);
    },
  },
  watch: {

  },
  // mixins: [ResizeMixin],
  computed: {
    // sidebar() {
    //   return this.$store.state.app.sidebar;
    // },
    // device() {
    //   return this.$store.state.app.device;
    // },
    // fixedHeader() {
    //   return this.$store.state.settings.fixedHeader;
    // },
    // classObj() {
    //   return {
    //     hideSidebar: !this.sidebar.opened,
    //     openSidebar: this.sidebar.opened,
    //     withoutAnimation: this.sidebar.withoutAnimation,
    //     mobile: this.device === "mobile"
    //   };
    // }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch("app/closeSideBar", { withoutAnimation: false });
    },
    // 将接收到的数据存放入localStorage，增加红点提示
    handleReceiveMessage(data) {
      let user = JSON.parse(localStorage.getItem("user"));
      let history = JSON.parse(localStorage.getItem("history-" + user.id));
      if (history == null) {
        history = this.initHistory();
      }
      if (history[data.fromUser]) {
        if (!history[data.fromUser].messages) {
          history[data.fromUser].messages = [];
        }
        data.id = history[data.fromUser].messages.length + 1;
        delete history[data.fromUser].messages[undefined];
        history[data.fromUser].messages.push(data);
        history[data.fromUser].unread =
          parseInt(history[data.fromUser].unread) + 1;
      } else {
        console.log("新发来消息的用户不存在于对话框");
        userApi
          .getUserProfile(data.fromUser)
          .then((result) => {
            if (result.success) {
              Vue.set(history, data.fromUser, {
                student_id: data.fromUser,
                nickName: result.data.nickName,
                messages: [data],
                user_pic: result.data.userPic,
                unread: 1,
              });
            } else {
              this.$message.error(result.message);
            }
          })
          .catch((error) => {
            this.$message.error(error.message);
          });
      }
      console.log("接收到新消息，更新数据");
      this.$store.commit("setUnread", true);
      // 更新数据
      localStorage.setItem("history-" + user.id, JSON.stringify(history));
    },
    initHistory() {
      return {
        0: {
          sid: "0",
          nickname: "布叮校园",
          userPic: "http://localhost/img/logo.4a490907.png",
          messages: [],
          unread: 0,
        },
        17551119111: {
          sid: "17551119111",
          nickname: "17551119111",
          userPic: "http://localhost/img/logo.4a490907.png",
          messages: [],
          unread: 0,
        },
        17551119044: {
          sid: "17551119044",
          nickname: "17551119044",
          userPic: "http://localhost/img/logo.4a490907.png",
          messages: [],
          unread: 0,
        },
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.app-wrapper {
  position: relative;
  height: 100%;
  width: 100%;
  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}
.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.mobile .fixed-header {
  width: 100%;
}
</style>
