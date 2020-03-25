<template>
  <v-content>
    <v-img src="@/assets/img/1.png" class="bdBackground" height="100%" width="100%"></v-img>
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
                        v-slot:default="{hover}"
                        v-for="(user,index) in history"
                        :key="user.sid"
                      >
                        <v-list-item @click="switchMessages(index)">
                          <template>
                            <v-list-item-avatar>
                              <v-img
                                src="http://fs.budingcc.cn:8888/group1/M00/00/00/dU4Lkl5OjIeAG6SWAABMN7CE7-U017.jpg"
                              ></v-img>
                            </v-list-item-avatar>
                            <v-list-item-content>
                              <v-list-item-title>{{user.nickName}}</v-list-item-title>
                            </v-list-item-content>
                            <v-avatar color="red" size="20" v-if="user.unread!=0">
                              <span class="white--text">{{user.unread}}</span>
                            </v-avatar>

                            <v-icon
                              v-if="hover&&index!=0"
                              @click.stop="closeHistory(user.sid)"
                            >mdi-close</v-icon>
                          </template>
                        </v-list-item>
                      </v-hover>
                    </template>
                  </v-list-item-group>
                </v-list>
              </v-col>
              <v-col style="height:500px">
                <v-card height="100%">
                  <v-card-title>{{history[currentMessageIndex].nickName}}</v-card-title>
                  <v-divider></v-divider>
                  <v-card-text style="height:78%;overflow:auto;" class="chat_box">
                    <v-list-item
                      v-for="(message,index) in history[currentMessageIndex].messages"
                      :key="index"
                    >
                      <v-list-item-avatar v-show="message.send_user_id!=user.sid">
                        <v-img :src="history[currentMessageIndex].profile_photo"></v-img>
                      </v-list-item-avatar>
                      <v-list-item-content>
                        <v-list-item-title
                          :class="{'text-right':message.send_user_id==user.sid}"
                        >{{message.message_content}}</v-list-item-title>
                      </v-list-item-content>
                      <v-list-item-avatar v-show="message.send_user_id==user.sid">
                        <v-img :src="user.profile_photo"></v-img>
                      </v-list-item-avatar>
                    </v-list-item>
                  </v-card-text>
                  <v-divider></v-divider>
                  <v-text-field
                    v-model.trim="message.message_content"
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
  </v-content>
</template>
<style>
.chat_box::-webkit-scrollbar {
  width: 0;
}
</style>
<script>
import $qs from "qs";
import Vue from "vue";
// import VueSocketIO from "vue-socket.io";
export default {
  name: "chat",
  created() {
    // if (!this.$socket) {
    //   this.$router.push({ path: "/" });
    // }
    // this.user = $qs.parse(sessionStorage.getItem("loginInfo"));
    // this.message.send_user_id = this.user.sid;
    // this.history = $qs.parse(localStorage.getItem("history-" + this.user.sid));
  },
  mounted() {
    // window.addEventListener("beforeunload", e => this.beforeunloadFn(e));
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
    }
  },
  data() {
    return {
      user: {
        nickName: "Ikaros"
      },
      currentMessageIndex: 0,
      //   this.$route.params.user_id
      //     ? this.$route.params.user_id
      //     : 0,
      message: {
        message_id: null,
        message_content: null,
        message_time: null,
        send_user_id: null,
        receive_user_id: this.$route.params.user_id
          ? this.$route.params.user_id
          : 0,
        message_read: null
      },
      history: [
        {
          nickName: "杨佩斯"
        }
      ]
    };
  },
  sockets: {
    receiveMessage(data) {
      var _this = this;
      if (this.history[data.send_user_id]) {
        if (!this.history[data.send_user_id].messages) {
          this.history[data.send_user_id].messages = [];
        }
        var message_id = data.message_id;
        delete this.history[data.send_user_id].messages[undefined];
        var msgLength = Object.keys(this.history[data.send_user_id].messages)
          .length;
        Vue.set(this.history[data.send_user_id].messages, msgLength, data);
        if (data.send_user_id != this.currentMessageIndex) {
          this.history[data.send_user_id].unread =
            parseInt(this.history[data.send_user_id].unread) + 1;
        }
      } else {
        this.$axios({
          method: "get",
          url: "/user/profile/" + data.send_user_id
        })
          .then(result => {
            Vue.set(_this.history, data.send_user_id, {
              sid: data.send_user_id,
              nickname: result.data.nick_name,
              profile_photo: result.data.profile_photo,
              messages: [data],
              unread: 1
            });
          })
          .catch(err => {});
      }
      setTimeout(() => {
        this.scrollToBottom();
      }, 30);
    },
    sent(data) {
      var currentMessages = this.history[this.currentMessageIndex];
      if (!currentMessages.messages) {
        currentMessages.messages = [];
      }
      Vue.set(currentMessages.messages, currentMessages.messages.length, data);
      this.message.message_content = "";
      setTimeout(() => {
        this.scrollToBottom();
      }, 30);
    }
  },
  beforeDestroy() {
    this.recordHistory();
  },
  destroyed() {
    window.removeEventListener("beforeunload", e => this.beforeunloadFn(e));
  },
  methods: {
    closeHistory(index) {
      this.currentMessageIndex = 0;
      Vue.delete(this.history, index);
    },
    beforeunloadFn(e) {
      this.recordHistory();
    },
    recordHistory() {
      localStorage.setItem(
        "history-" + this.user.sid,
        $qs.stringify(this.history)
      );
    },

    sendMessage() {
      if (
        this.message.message_content != null &&
        this.message.message_content != ""
      ) {
        this.$socket.emit("sendMessage", this.message);
      }
    },
    switchMessages(index) {
      this.currentMessageIndex = index;
      this.message.receive_user_id = this.history[this.currentMessageIndex].sid;
      this.resetSetItem(
        "unRead",
        parseInt(sessionStorage.getItem("unRead")) - this.history[index].unread
      );
      this.history[index].unread = 0;
    },
    scrollToBottom() {
      const container = this.$el.querySelector(".chat_box");
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }
  }
};
</script>
