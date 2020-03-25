<template>
  <div>
    <!-- app-bar -->
    <v-app-bar app color="#FFD600">
      <v-img src="../../assets/logo.png" max-width="50px"></v-img>
      <v-toolbar-items class="hidden-xs-only">
        <v-btn text to="/good/list">校园二手</v-btn>
        <v-btn text>表白墙</v-btn>
        <v-btn text>学习管理</v-btn>
        <v-btn text>布叮记词</v-btn>
      </v-toolbar-items>
      <div class="flex-grow-1"></div>
      <div style="position:relative;">
        <v-img
          v-if="login"
          @click="navShow = !navShow"
          src="http://fs.budingcc.cn/group1/M00/00/00/dU4Lkl5OjIeAG6SWAABMN7CE7-U017.jpg"
          width="50px"
          height="50px"
          style="border-radius:50%;"
          class="elevation-5"
        ></v-img>
        <v-row v-else align="center">请登录！</v-row>
      </div>
    </v-app-bar>
    <!-- navigation -->
    <v-navigation-drawer app right color="#FFC400" v-model="navShow" v-if="login">
      <v-list>
        <v-list-item
          v-for="item in navDrawerList"
          :key="item.id"
          link
          @click="$router.push(item.href)"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <template v-slot:append>
        <div class="pa-2">
          <v-btn block color="#FFE57F" @click="logout">注销</v-btn>
        </div>
      </template>
    </v-navigation-drawer>
  </div>
</template>
<style>
* {
  font-family: "Microsoft YaHei", "youyuan";
}
</style>
<script>
import Vue from "vue";
import * as loginApi from "@/base/api/login"
export default {
  name: "Header",
  components: {},
  mounted() {
    // this.$socket.emit("connect", {mac:1});
    // this.$socket.emit("chat", {userName:"Ikaros",content: "我老婆"});
  },
  sockets: {
    connect(data) {
      console.log("连接connect", data);
    },
    receiveChat(data) {
      console.log("从服务器收到了", data);
    },
    reconnect(data) {
      console.log("重新连接", data);
      this.$socket.emit("connect", 1);
    },
    disconnect(data) {
      console.log('socket断开连接');
    }
  },
  data() {
    return {
      navShow: false,
      user: {},
      navDrawerList: [
        {
          id: 1,
          href: "/user/center",
          icon: "mdi-account",
          title: "个人中心"
        },
        {
          id: 2,
          href: "/user/collection",
          icon: "mdi-heart",
          title: "我的收藏"
        },
        {
          id: 3,
          href: "/user/dialog",
          icon: "mdi-chat",
          title: "我的聊天"
        },
        {
          id: 4,
          href: "/user/publish",
          icon: "mdi-equalizer",
          title: "我的发布"
        },
        {
          id: 5,
          href: "/good/add",
          icon: "mdi-arrow-up",
          title: "发布商品"
        }
      ],
      login: true,
      tip: {
        status: false,
        color: "success",
        timeout: 2000,
        message: ""
      }
    };
  },
  methods: {
    logout() {
      loginApi.logout().then((result) => {
        if(result.success){
          window.location.href = "http://oauth.budingcc.cn:40000/logout?redirect_uri=" + window.location.href;
        }else{
          this.$snackbar.error("注销失败");
        }
      }).catch((err) => {
        this.$snackbar.error("注销失败");
      });
      
    },
    getNavData(i) {
      var _this = this;
      this.$axios({
        method: "get",
        url: "/dict?dict_type_code=" + i
      })
        .then(res => {
          if (i == 1) {
            _this.navData1 = res.data;
          } else {
            _this.navData2 = res.data;
          }
        })
        .catch(error => {});
    }
  }
};
</script>