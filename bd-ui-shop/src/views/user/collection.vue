<template>
  <v-content>
    <v-img src="@/assets/img/1.png" class="bdBackground" height="100%" width="100%"></v-img>
    <v-container>
      <v-row>
        <v-col>
          <v-hover v-slot:default="{hover}">
            <v-card
              class="pa-2 transitionEasyInOut"
              :color="hover?'rgba(255,253,231,1)':'rgba(255,253,231,0.7)'"
              :elevation="hover?12:2"
            >
              <v-card-title>我的收藏</v-card-title>
              <v-container>
                <v-row v-if="true" justify="center" style="font-size:20px">你还没有收藏</v-row>
                <v-row v-else>
                  <v-col v-for="(good,index) in pageResult.items" :key="good.id">
                    <v-card flat outlined raised width="320px" class="ma-auto">
                      <v-hover v-slot:default="{hover}">
                        <v-img
                          :class="{imgHover:hover}"
                          class="white--text goodImg"
                          height="200px"
                          width="320px"
                          @click="toGoodDetail(index)"
                          :src="good.good_image_url.split('-')[0]"
                        >
                          <v-card-title
                            class="align-end fill-height imgHover"
                            style="color:#000;"
                          >{{good.good_name}}</v-card-title>
                        </v-img>
                      </v-hover>
                      <v-card-text>{{good.good_desc}}</v-card-text>
                      <v-card-actions>
                        <v-btn icon>
                          <!-- 收藏 -->
                          <v-icon @click="heartClick(index,false)" color="red">mdi-heart</v-icon>
                        </v-btn>
                        <div class="flex-grow-1"></div>
                        <!-- 上架日期 -->
                        <v-btn text>{{good.good_create_time}}</v-btn>
                        <!-- 价格 -->
                        <v-btn text>￥{{good.good_price}}</v-btn>
                        <!-- 联系 -->
                        <v-btn outlined color="primary">联系卖家</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-col>
                </v-row>
                <v-row class="text-center" justify="center" v-if="pageResult.items.length>0">
                  <template>
                    <div class="text-center">
                      <v-pagination v-model="pageRequest.page" :length="pageResult.totalPage"></v-pagination>
                    </div>
                  </template>
                </v-row>
                <v-snackbar
                  v-model="tip.status"
                  bottom
                  :color="tip.color"
                  :timeout="tip.timeout"
                >{{ tip.msg }}</v-snackbar>
              </v-container>
            </v-card>
          </v-hover>
        </v-col>
      </v-row>
    </v-container>
  </v-content>
</template>

<script>
import $qs from "qs";
export default {
  name: "goods",
  watch: {
    "pageRequest.page"(newPage, oldPage) {
      this.loadPage();
    }
  },
  created() {
    // this.loadCollectionsPage();
  },
  mounted() {},
  data() {
    return {
      pageResult: {
        total: 1,
        totalPage: 5,
        items: {}
      },
      pageRequest: {
        page: 1,
        key: ""
      },
      collections: [],
      allCollections: [],
      tip: {
        status: false,
        timeout: 2000,
        msg: "",
        color: "success"
      }
    };
  },
  methods: {
    heartClick(index, flag) {
      let _this = this;
      this.$axios({
        method: "delete",
        url: "/user/collection",
        data: {
          good_id: _this.pageResult.items[index].good_id
        }
      })
        .then(result => {
          this.loadCollectionsPage();
        })
        .catch(err => {
          _this.tipShow("取消收藏失败", "error");
        });
    },

    toGoodDetail(index) {
      sessionStorage.setItem(
        "goodDetail",
        $qs.stringify(this.pageResult.items[index])
      );
      this.$router.push({ path: "/gooddetail" });
    },

    loadCollectionsPage() {
      let _this = this;
      this.$axios({
        method: "get",
        url: "/good/collection/page",
        params: {
          page: _this.pageRequest.page
        }
      })
        .then(result => {
          _this.pageResult = result.data;
          _this.collections = [];
        })
        .catch(err => {
          this.tipShow(err.response.data.message, "error");
          _this.pageRequest.dict_item_code = "";
        });
    }
  }
};
</script>