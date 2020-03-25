<template>
  <div>
    <!-- app-bar -->
    <v-app-bar app color="#FFD600">
      <v-img src="../../assets/logo.png" max-width="50px"></v-img>
      <v-toolbar-items class="hidden-xs-only">
        <v-btn text>校园二手</v-btn>
        <v-btn text>表白墙</v-btn>
        <v-btn text>学习管理</v-btn>
        <v-btn text>布叮记词</v-btn>
      </v-toolbar-items>
      <div class="flex-grow-1"></div>
      <div style="position:relative;">
        <v-img
          v-if="login"
          @click="accountShow = !accountShow"
          :src="this.user.profile_photo"
          max-width="50px"
          style="border-radius:50%;"
          class="elevation-5"
        ></v-img>
        <v-row v-else align="center">请登录！</v-row>
      </div>
    </v-app-bar>
    <!-- navigation -->
    <v-navigation-drawer app right color="#FFC400" v-model="accountShow" v-if="login">
      <v-list>
        <v-list-item link>
          <v-list-item-icon>
            <v-icon>mdi-account</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>个人中心</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link>
          <v-list-item-icon>
            <v-icon>mdi-heart</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>我的关注</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <template v-slot:append>
        <div class="pa-2">
          <v-btn block color="#FFE57F" @click="logout">注销</v-btn>
        </div>
      </template>
    </v-navigation-drawer>
    <v-snackbar v-model="tip.status" :timeout="tip.timeout" :color="tip.color">{{tip.message}}</v-snackbar>
  </div>
</template>
<style lang="stylus"></style>
<script>
import Vue from "vue";
export default {
  name: "Header",
  components: {},
  mounted() {},
  beforeMount() {},
  beforeCreate() {},
  created() {},
  data() {
    return {
      navShow: false,
      accountShow: false,
      user: {},
      login: false,
      tip: {
        status: false,
        color: "success",
        timeout: 2000,
        message: ""
      }
    };
  },
  methods: {
    tipShow(message, color) {
      this.tip.message = message;
      this.tip.status = true;
      this.tip.color = color ? color : "success";
    },
    logout() {
      var _this = this;
      this.$axios({
        method: "delete",
        url: "/user/logout"
      })
        .then(result => {
          sessionStorage.removeItem("loginInfo");
          _this.$router.push({ path: "/login" });
          _this.tipShow("注销成功");
          _this.$socket.disconnect();
        })
        .catch(err => {
          _this.tipShow("注销失败", "error");
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