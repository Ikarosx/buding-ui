<template>
  <v-container class="mx-auto d-flex fill-height">
    <v-row class="mx-auto d-flex" align="center">
      <v-col>
        <v-card max-width="400px" class="mx-auto" elevation="12">
          <template>
            <v-carousel height="500px">
              <v-carousel-item
                :src="src"
                v-for="(src,i) in item.good_image_url.split('-')"
                :key="i"
              ></v-carousel-item>
            </v-carousel>
          </template>
        </v-card>
      </v-col>
      <v-col>
        <v-card elevation="12" width="400px" class="mx-auto">
          <v-card-title>商品详情</v-card-title>
          <v-card-text>
            <v-row>
              <nav class="menu menu--adsila" style="color:black;width:100%;">
                <span class="menu__item">
                  <span class="menu__item-name">名称：</span>
                  <span class="menu__item-label">{{item.good_name}}</span>
                </span>
                <span class="menu__item">
                  <span class="menu__item-name">价格：</span>
                  <span class="menu__item-label">¥{{item.good_price}}</span>
                </span>
                <span class="menu__item">
                  <span class="menu__item-name">卖家：</span>
                  <span class="menu__item-label">{{item.user_name}}</span>
                </span>
                <span class="menu__item">
                  <span class="menu__item-name">描述：</span>
                  <span
                    class="menu__item-label pa-2"
                    style="word-break: break-all;"
                  >{{item.good_desc}}</span>
                </span>
              </nav>
            </v-row>
            <v-row class="d-flex">
              <v-col cols="8"></v-col>
              <v-col>
                <v-row>
                  <v-btn color="#FFD600" fab class="pa-2" @click="heartClick">
                    <v-icon :color="heart?'red':'black'">mdi-heart</v-icon>
                  </v-btn>
                  <div class="flex-grow-1"></div>
                  <v-btn
                    color="primary"
                    fab
                    class="pa-2"
                    @click="toChat(item.user_name,item.user_id)"
                  >
                    <v-icon>mdi-chat</v-icon>
                  </v-btn>
                </v-row>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<style lang="stylus"></style>
<script>
import "../../assets/css/hoverColor.css";
import $qs from "qs";
export default {
  name: "gooddetail",
  created() {
    var item = sessionStorage.getItem("goodDetail");
    var user = sessionStorage.getItem("loginInfo");
    if (item == null) {
      this.$router.push({ path: "/" });
    }
    this.item = $qs.parse(item);
    this.user = $qs.parse(user);
    console.log("created");
    console.log(this.item);
    this.heart = this.item.collection === "true";
  },
  mounted() {
    console.log("mounted");
    console.log(this.item);
  },
  watch: {},
  data() {
    return {
      heart: false,
      user: {},
      item: {
        collection: false
      },
      tip: {
        status: false,
        color: "success",
        timeout: 2000,
        message: ""
      }
    };
  },
  methods: {
    toChat(nickname, user_id) {
      var item = localStorage.getItem("history-" + this.user.sid);
      var history = [];
      if (item == null) {
        history = this.initHistory();
      } else {
        history = $qs.parse(item);
      }
      if (history[user_id]) {
        this.$router.push({
          name: "chat",
          params: { user_id: user_id }
        });
      } else {
        // 加载头像
        this.$axios({
          method: "get",
          url: "/user/profile/" + user_id
        })
          .then(result => {
            history[user_id] = {
              sid: user_id,
              nickname: nickname,
              profile_photo: result.data.profile_photo,
              messages: [],
              unread: 0
            };
            localStorage.setItem(
              "history-" + this.user.sid,
              $qs.stringify(history)
            );
            this.$router.push({
              name: "chat",
              params: { user_id: user_id }
            });
          })
          .catch(err => {});
      }
    },
    initHistory() {
      return [
        {
          sid: "0",
          nickname: "布叮校园",
          profile_photo: "http://localhost/img/logo.4a490907.png",
          messages: [],
          unread: 0
        }
      ];
    },
    tipShow(message, color) {
      this.tip.message = message;
      this.tip.status = true;
      this.tip.color = color ? color : "success";
    },
    heartClick() {
      let _this = this;
      if (!this.heart) {
        this.$axios({
          method: "post",
          url: "/user/collection",
          data: {
            user_id: _this.user.sid,
            good_id: _this.item.good_id
          }
        })
          .then(result => {
            _this.heart = !_this.heart;
          })
          .catch(err => {
            _this.tipShow("收藏失败", "error");
          });
      } else {
        this.$axios({
          method: "delete",
          url: "/user/collection",
          data: {
            user_id: _this.user.sid,
            good_id: _this.item.good_id
          }
        })
          .then(result => {
            _this.heart = !_this.heart;
          })
          .catch(err => {
            _this.tipShow("取消收藏失败", "error");
          });
      }
    }
  }
};
</script>