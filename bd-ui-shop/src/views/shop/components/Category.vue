<template>
  <v-hover v-slot:default="{ hover }">
    <div class="categoryMenu hidden-xs-only" :class="{'on-hover':hover}">
      <v-card color="#FFFDE7" :elevation="hover?12:2">
        <v-card-title>分类</v-card-title>
        <!-- <Menu accordion width="150px" @on-select="navigateTo">
          <MenuItem name>全部商品</MenuItem>
          <mymenu :data="typeData" />
        </Menu> -->
      </v-card>
    </div>
  </v-hover>
</template>
<style>
.categoryMenu:not(.on-hover ) {
  opacity: 0.7;
}

.categoryMenu {
  transition: opacity 0.4s ease-in-out;
}
</style>
<script>
// import { Menu, MenuItem } from "iview";
// import mymenu from "./mymenu";
export default {
  name: "goodsMenu",
  components: {
    // mymenu,
    // Menu,
    // MenuItem
  },
  created() {
    this.getTypeData();
  },
  mounted() {},
  data() {
    return {
      typeData: "",
      activeName: ""
    };
  },
  methods: {
    getTypeData() {
      let _this = this;
      this.$axios({
        method: "get",
        url: "/dict/goods"
      })
        .then(res => {
          _this.typeData = res.data;
        })
        .catch(error => {});
    },
    navigateTo(itemcode) {
      //   this.$emit("setItemCode", itemcode);
    }
  }
};
</script>