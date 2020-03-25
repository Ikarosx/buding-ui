<template>
  <v-content>
    <v-img src="../../assets/img/background.jpg" class="bk" height="100%" width="100%"></v-img>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="5">
          <v-hover v-slot:default="{ hover }">
            <v-card :elevation="hover ? 12 : 2" style="opacity:0.9">
              <v-toolbar flat color="#FFD600">
                <v-toolbar-title>布叮校园</v-toolbar-title>
                <div class="flex-grow-1"></div>
              </v-toolbar>
              <v-card-text>
                <v-form v-model="valid" ref="form">
                  <v-text-field
                    label="校园网账号"
                    name="login"
                    prepend-icon="mdi-account"
                    v-model="user.username"
                    :rules="[rules.required,rules.special]"
                  ></v-text-field>
                  <v-text-field
                    v-model="user.password"
                    :rules="[rules.required,rules.min,rules.notSpace]"
                    label="密码"
                    name="password"
                    prepend-icon="mdi-lock"
                    type="password"
                  ></v-text-field>
                  <v-select
                    label="学校"
                    :items="schools"
                    item-value="id"
                    item-text="schoolName"
                    prepend-icon="mdi-school"
                    :rules="[rules.required]"
                    v-model="schoolId"
                  ></v-select>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <div class="flex-grow-1"></div>
                <v-btn color="#FFD600" @click="login">登陆</v-btn>
              </v-card-actions>
            </v-card>
          </v-hover>
        </v-col>
      </v-row>
    </v-container>
  </v-content>
</template>
<style>
.bk {
  position: fixed !important;
  opacity: 0.8;
}
</style>
<script>
import qs from "qs";
import * as loginApi from "../api/login";
export default {
  name: "login",
  data() {
    return {
      rules: {
        required: value => !!value || "不能为空",
        special: value =>
          /^[a-zA-Z0-9]+$/.test(value) || "账号不应该包含特殊字符",
        min: v => !v || v.length >= 6 || "密码最短6位数",
        notSpace: v => !v || !/\s+/.test(v) || "密码不能有空格",
        imgSize: value => !value || value.size < 2000000 || "图片不能超过2MB",
        imgType: v =>
          (v.type && v.type.startsWith("image")) ||
          "文件必须是JPG、JPEG、BMP或PNG中的一种"
      },
      schools: null,
      user: {
        username: "",
        password: ""
      },
      schoolId: "",
      valid: false,
    };
  },
  created() {
    this.loadSchools();
    // let loginInfo = sessionStorage.getItem("loginInfo");
    // if (loginInfo != null) {
    //   this.$router.push({ path: "/" });
    // }
    // this.ifLogin();
  },
  mounted() {},
  methods: {
    loadSchools(){
      loginApi.listSchools().then((result) => {
        this.schools = result.queryResult.list;
      }).catch((err) => {
        this.$snackbar.error(err.message);
        console.log(err)
      });
    },
  }
};
</script>