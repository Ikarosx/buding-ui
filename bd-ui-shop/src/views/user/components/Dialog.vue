<template>
  <v-main>
    <v-img
      src="@/assets/img/1.png"
      class="bdBackground"
      height="100%"
      width="100%"
    ></v-img>
    <v-container>
      <v-row>
        <v-col>
          <v-card width="100%" height="500px" color="#FFFDE7" tile>
            <v-row class="ma-0">
              <v-col cols="3" class="pa-0">
                <v-list class="pa-0" color="#FFFDE7">
                  <v-list-item-group>
                    <template>
                      <v-hover
                        v-slot:default="{ hover }"
                        v-for="(user, index) in history"
                        :key="user.sid"
                      >
                        <v-list-item @click="switchMessages(index)">
                          <template>
                            <v-list-item-avatar>
                              <v-img
                                src="http://n.sinaimg.cn/sinacn/w800h755/20171206/ef92-fypikwu3264849.png"
                              ></v-img>
                            </v-list-item-avatar>
                            <v-list-item-content>
                              <v-list-item-title>{{
                                user.nickname
                              }}</v-list-item-title>
                            </v-list-item-content>
                            <v-avatar
                              color="red"
                              size="20"
                              v-if="user.unread != 0"
                            >
                              <span class="white--text">{{ user.unread }}</span>
                            </v-avatar>

                            <v-icon
                              v-if="hover && index != 0"
                              @click.stop="closeHistory(user.sid)"
                              >mdi-close</v-icon
                            >
                          </template>
                        </v-list-item>
                      </v-hover>
                    </template>
                  </v-list-item-group>
                </v-list>
              </v-col>
              <v-col style="height: 500px">
                <v-card height="100%">
                  <v-card-title>{{
                    history[currentMessageIndex].nickname
                  }}</v-card-title>
                  <v-divider></v-divider>
                  <v-card-text
                    style="height: 77%; overflow: auto"
                    class="chat_box"
                  >
                    <v-list-item
                      v-for="(message, index) in history[currentMessageIndex]
                        .messages"
                      :key="index"
                    >
                      <v-list-item-avatar
                        v-show="message.fromUser != user.student_id"
                      >
                        <v-img
                          :src="history[currentMessageIndex].user_pic"
                        ></v-img>
                      </v-list-item-avatar>
                      <v-list-item-content>
                        <v-list-item-title
                          :class="{
                            'text-right': message.fromUser == user.student_id,
                          }"
                        >
                          <v-progress-circular
                            indeterminate
                            v-if="!message.ack"
                            color="green"
                            size="25"
                          ></v-progress-circular>
                          {{ message.message }}
                        </v-list-item-title>
                      </v-list-item-content>
                      <v-list-item-avatar
                        v-show="message.fromUser == user.student_id"
                      >
                        <v-img :src="user.user_pic"></v-img>
                      </v-list-item-avatar>
                    </v-list-item>
                  </v-card-text>
                  <v-divider></v-divider>
                  <v-text-field
                    v-model.trim="message.message"
                    placeholder="ENTER发送消息"
                    solo
                    @keydown.enter="sendMessage"
                  >
                    <template v-slot:append>
                      <v-btn color="success" @click="sendMessage">发送</v-btn>
                    </template>
                  </v-text-field>
                </v-card>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>
<style>
.chat_box::-webkit-scrollbar {
  width: 0;
}
</style>
<script>
import $qs from "qs";
import Vue from "vue";
import VueSocketIO from "vue-socket.io";
import * as userApi from "../api";
export default {
  name: "chat",
  created() {
  },
  mounted() {
    this.$store.commit("setUnread", false);
    let user = localStorage.getItem("user");
    let userJson = JSON.parse(user);
    this.user = userJson;
    this.history = JSON.parse(localStorage.getItem("history-" + this.user.id));

    if (this.history == null) {
      this.history = this.initHistory();
      localStorage.setItem(
        "history-" + this.user.id,
        JSON.stringify(this.history)
      );
    }
    window.addEventListener("beforeunload", e => this.beforeunloadFn(e));
    // this.resetSetItem(
    //   "unRead",
    //   parseInt(sessionStorage.getItem("unRead")) - this.history[0].unread
    // );
    // this.history[0].unread = 0;
    // setTimeout(() => {
    //   this.scrollToBottom();
    // }, 30);
  },
  watch: {
    currentMessageIndex() {
      setTimeout(() => {
        this.scrollToBottom();
      }, 30);
    },
  },
  data() {
    return {
      user: {
        nickName: "Ikaros",
      },
      currentMessageIndex: this.$route.params.user_id
        ? this.$route.params.user_id
        : 0,
      message: {
        id: null,
        message: null,
        time: null,
        fromUser: null,
        toUser: this.$route.params.user_id ? this.$route.params.user_id : 0,
        read: null,
      },
      history: {
        0: {
          nickName: "布叮校园",
          unread: 0,
          user_pic:
            "https://img.shixijob.net/ciwei_ALD_sys/159119076455364ca6bc7-7dc4-4dbc-8010-ef2a73f8be61.png",
        },
        // 17551119044: {
        //   nickName: "111",
        //   unread: 0,
        //   user_pic:
        //     "https://img.shixijob.net/ciwei_ALD_sys/159119076455364ca6bc7-7dc4-4dbc-8010-ef2a73f8be61.png",
        //   messages: [
        //     {
        //       id: 1,
        //       fromUser: 17551119111,
        //       toUser: 17551119044,
        //       message: "111",
        //       ack: false
        //     },
        //     {
        //       id: 2,
        //       fromUser: 17551119044,
        //       toUser: 17551119111,
        //       message: "222",
        //       ack: true
        //     }
        //   ]
        // }
      },
    };
  },
  sockets: {
    // 获取未读信息，在首次连接时后端会发送此条消息给客户端
    get_unread: function (data) {
      for (let message of data) {
        message.ack = true;
        this.handleReceiveMessage(message);
      }
    },
    receive_message: function (data) {
      data.ack = true;
      this.handleReceiveMessage(data);
    },
    sent: function (data) {
      var currentMessages = this.history[this.currentMessageIndex];
      if (!currentMessages.messages) {
        currentMessages.messages = [];
      }
      Vue.set(currentMessages.messages, currentMessages.messages.length, data);
      this.message.message_content = "";
    },
  },
  beforeDestroy() {
    console.log("beforeDestroy");
    this.recordHistory();
  },
  destroyed() {
    window.removeEventListener("beforeunload", (e) => this.beforeunloadFn(e));
  },
  methods: {
    handleReceiveMessage(data) {
      if (this.history[data.fromUser]) {
        if (!this.history[data.fromUser].messages) {
          this.history[data.fromUser].messages = [];
        }
        data.id = this.history[data.fromUser].messages.length + 1;
        delete this.history[data.fromUser].messages[undefined];
        this.history[data.fromUser].messages.push(data);
        if (data.fromUser != this.currentMessageIndex) {
          this.history[data.fromUser].unread =
            parseInt(this.history[data.fromUser].unread) + 1;
        }
      } else {
        console.log("新发来消息的用户不存在于对话框");
        userApi
          .getUserProfile(data.fromUser)
          .then((result) => {
            if (result.success) {
              Vue.set(this.history, data.fromUser, {
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
      setTimeout(() => {
        this.scrollToBottom();
      }, 30);
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
    closeHistory(index) {
      this.currentMessageIndex = 0;
      Vue.delete(this.history, index);
      this.recordHistory();
    },
    // 直接关闭页面前保存记录
    beforeunloadFn(e) {
      this.recordHistory();
    },
    recordHistory() {
      localStorage.setItem(
        "history-" + this.user.id,
        JSON.stringify(this.history)
      );
    },

    sendMessage() {
      if (this.message.message != null && this.message.message != "") {
        this.message.fromUser = this.user.student_id;
        this.message.toUser = this.currentMessageIndex;
        this.message.ack = false;
        this.message.id =
          this.history[this.currentMessageIndex].messages.length + 1;
        this.history[this.currentMessageIndex].messages.push(
          JSON.parse(JSON.stringify(this.message))
        );
        this.$socket.emit("send_message", this.message, (data) => {
          for (var message of this.history[data.toUser].messages) {
            if (message.id == data.id) {
              message.ack = true;
              break;
            }
          }
        });
        this.message.message = "";
        setTimeout(() => {
          this.scrollToBottom();
        }, 30);
      }
    },
    switchMessages(index) {
      this.currentMessageIndex = index;
      // this.message.receive_user_id = this.history[this.currentMessageIndex].sid;
      this.history[index].unread = 0;
    },
    scrollToBottom() {
      const container = this.$el.querySelector(".chat_box");
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    },
  },
};
</script>
