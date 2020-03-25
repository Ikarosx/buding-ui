<template>
  <v-content>
    <v-img src="@/assets/img/1.png" class="bdBackground" height="100%" width="100%"></v-img>
    <v-container>
      <!-- 搜索、筛选和商品展示 -->
      <div>
        <v-text-field
          label="寻找你所需要的东西..."
          prepend-icon="mdi-card-search"
          v-model="pageRequest.keyword"
          color="#FF9800"
          @keyup.enter="listGoods"
        ></v-text-field>
        <v-hover v-slot:default="{hover}">
          <v-card
            :elevation="hover?8:2"
            class="category transitionEasyInOut"
            style="margin-bottom: 20px;"
            :color="hover?'rgba(255,253,231,0.9)':'rgba(255,253,231,0.7)'"
          >
            <div class="pa-2">
              <span>一级分类：</span>
              <v-btn
                small
                text
                :class="category.selectedOneId == 0 ? 'categorySelect' : ''"
                @click="clickCategoryOne(null, '')"
              >全部</v-btn>
              <v-btn
                v-for="item in category.list"
                :key="item.id"
                text
                small
                :class="item.id == category.selectedOneId ? 'categorySelect' : ''"
                @click="clickCategoryOne(item.children, item.id)"
              >{{item.name}}</v-btn>
            </div>
            <v-divider light></v-divider>
            <div class="pa-2">
              <span>二级分类：</span>
              <v-btn
                small
                text
                :class="category.selectedTwoId == category.selectedOneId ? 'categorySelect' : ''"
                @click="clickCategoryTwo(null, category.selectedOneId)"
              >全部</v-btn>
              <v-btn
                v-for="item in category.listTwo"
                :key="item.id"
                text
                small
                :class="item.id == category.selectedTwoId ? 'categorySelect' : ''"
                @click="clickCategoryTwo(item.children, item.id)"
              >{{item.name}}</v-btn>
            </div>

            <v-divider light></v-divider>
            <div class="pa-2">
              <span>三级分类：</span>
              <v-btn
                small
                text
                :class="category.selectedThreeId == category.selectedTwoId ? 'categorySelect' : ''"
                @click="clickCategoryThree(category.selectedTwoId)"
              >全部</v-btn>
              <v-btn
                v-for="item in category.listThree"
                :key="item.id"
                text
                small
                :class="item.id == category.selectedThreeId ? 'categorySelect' : ''"
                @click="clickCategoryThree(item.id)"
              >{{item.name}}</v-btn>
            </div>
          </v-card>
        </v-hover>

        <!-- 商品列表 -->
        <v-hover v-slot:default="{hover}">
          <v-card
            class="goods transitionEasyInOut"
            :elevation="hover?10:2"
            :color="hover?'rgba(255,253,231,.9)':'rgba(255,253,231,0.7)'"
            v-if="pageResult.items && pageResult.items.length>0"
          >
            <v-container fluid>
              <v-row class="pa-2 filterButtons">
                <v-btn color="#FFD600" @click="clickOrder(0)">
                  <span>价格</span>
                  <v-icon>{{order.icon[order.index[0]]}}</v-icon>
                </v-btn>
                <v-btn color="#FFD600" @click="clickOrder(1)">
                  <span>上架日期</span>
                  <v-icon>{{order.icon[order.index[1]]}}</v-icon>
                </v-btn>
              </v-row>
              <v-row>
                <v-col v-for="(good,index) in pageResult.items" :key="good.id">
                  <v-hover v-slot:default="{hover}">
                    <v-card
                      flat
                      outlined
                      raised
                      width="320px"
                      class="ma-auto"
                      @click="openUrlNewWindow('http://budingcc.cn/good/detail/' + good.id + '.html')"
                    >
                      <v-img
                        class="goodImg"
                        height="180px"
                        width="320px"
                        :class="{'imgHover': hover}"
                        :src="'http://fs.budingcc.cn/' + good.imageUrl.split(',')[0]"
                      >
                        <v-card-title class="align-end fill-height">{{good.goodName}}</v-card-title>
                      </v-img>
                      <v-card-text>{{good.description}}</v-card-text>
                      <v-card-actions>
                        <div class="flex-grow-1"></div>
                        <!-- 上架日期 -->
                        <v-btn text>{{good.createTime.substr(0, 10)}}</v-btn>
                        <!-- 价格 -->
                        <v-btn text>￥{{good.price}}</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-hover>
                </v-col>
              </v-row>
              <v-row class="text-center" justify="center">
                <template>
                  <div class="text-center">
                    <v-pagination v-model="page" :length="pageResult.totalPage"></v-pagination>
                  </div>
                </template>
              </v-row>
            </v-container>
          </v-card>
          <v-card
            v-else
            class="pa-2 goods transitionEasyInOut"
            :color="hover?'rgba(255,253,231,.9)':'rgba(255,253,231,0.7)'"
            :elevation="hover?10:2"
          >
            <v-container>
              <v-row justify="center">这个分类暂时没有商品</v-row>
            </v-container>
          </v-card>
        </v-hover>
      </div>
    </v-container>
  </v-content>
</template>
<style scoped>
</style>
<style>
.category .categorySelect {
  color: #ff9800 !important;
}
.filterButtons button + button {
  margin-left: 1%;
}
.category button {
  color: rgb(131, 131, 131) !important;
}

.left {
  margin-right: 2%;
}
.appBarNavIcon {
  position: fixed;
}

.goodImg {
  transition: all 0.2s ease-in-out;
}

.goodImg:not(.imgHover) {
  opacity: 0.5;
}
.imgHover {
  color: black;
  opacity: 1;
}
</style>
<script>
import $qs from "qs";
import * as shopApi from "./api";
export default {
  name: "mycontent",
  components: {},
  created() {
    this.listCategoryStruct();
    this.listGoods();
  },
  data() {
    return {
      order: {
        value: ["", "true", "false"],
        icon: ["", "mdi-menu-down", "mdi-menu-up"],
        // 每多一个排序字段就在index加一个0，在name加上字段名字
        index: [0, 0],
        name: ["price", "create_time"]
      },
      priceIndex: 0,
      category: {
        list: [],
        listTwo: [],
        listThree: [],
        selectedOneId: "0",
        selectedTwoId: "-1",
        selectedThreeId: "-2"
      },
      pageResult: {
        total: 1,
        totalPage: 5,
        items: {}
      },
      page: 1,
      size: 10,
      pageRequest: {
        keyword: "",
        sort: "price:-create_time:-",
        directCategoryId: ""
      }
    };
  },
  methods: {
    openUrlNewWindow(url) {
      window.open(url, "_blank");
    },
    listCategoryStruct() {
      shopApi
        .listCategoryStruct()
        .then(result => {
          if (result.success) {
            this.category.list = result.queryResult.list[0].children;
            this.pageResult.total = result.queryResult.total;
          } else {
            this.$snackbar.error(result.message);
          }
        })
        .catch(err => {
          this.$snackbar.error(err);
        });
    },
    listGoods() {
      shopApi
        .listGoods(this.page, this.size, this.pageRequest)
        .then(result => {
          if (result.success) {
            this.pageResult.items = result.queryResult.list;
            this.pageResult.totalPage = result.queryResult.totalPage;
            if (!result.queryResult.list) {
              this.$snackbar.error("搜索不到商品");
            }
          } else {
            this.$snackbar.error(result.message);
          }
        })
        .catch(err => {
          this.$snackbar.error(err);
        });
    },
    clickCategoryOne(list, id) {
      this.category.selectedOneId = id;
      this.category.selectedTwoId = id;
      this.category.listTwo = list;
      this.pageRequest.directCategoryId = id;
      this.listGoods();
    },
    clickCategoryTwo(list, id) {
      this.category.selectedTwoId = id;
      this.category.selectedThreeId = id;
      this.category.listThree = list;
      this.pageRequest.directCategoryId = id;
      this.listGoods();
    },
    clickCategoryThree(id) {
      this.category.selectedThreeId = id;
      this.pageRequest.directCategoryId = id;
      this.listGoods();
    },
    clickOrder(index) {
      this.$set(this.order.index, index, this.order.index[index] + 1);
      let replaceStrng = "";
      let regex = new RegExp(this.order.name[index] + ":.*?-", "g");
      if (this.order.index[index] >= 3) {
        this.order.index[index] = 0;
        replaceStrng = this.order.name[index] + ":-";
      } else {
        replaceStrng =
          this.order.name[index] +
          ":" +
          this.order.value[this.order.index[index]] +
          "-";
      }
      this.pageRequest.sort = this.pageRequest.sort.replace(
        regex,
        replaceStrng
      );
      this.listGoods();
    }
  }
};
</script>