<template>
  <v-content>
    <v-img src="@/assets/img/1.png" class="bdBackground" height="100%" width="100%"></v-img>
    <v-container>
      <v-row>
        <v-col>
          <v-hover v-slot:default="{hover}">
            <v-card
              :elevation="hover?8:2"
              class="transitionEasyInOut"
              :color="hover?'rgba(255,255,255,0.9)':'rgba(255,255,255,0.8)'"
            >
              <v-card-title>个人信息</v-card-title>
              <v-card-text>
                <v-form v-model="valid">
                  <v-text-field
                    v-model="user.nick_name"
                    :rules="[rules.required,rules.nickNameNotSpecial]"
                    label="昵称"
                    prepend-icon="mdi-account"
                    required
                  ></v-text-field>
                  <div class="d-flex align-center">
                    <v-icon>mdi-face-profile</v-icon>
                    <v-img
                      @click="crop.show = true"
                      :src="'http://fs.budingcc.cn/'+imageUrl"
                      style="width:50px;height:50px;border-radius:50%;"
                      max-width="50"
                      class="elevation-3 hoverPointer"
                    />
                  </div>
                  <v-switch
                    color="#FFD600"
                    hint="修改密码"
                    label="修改密码"
                    prepend-icon="mdi-lock"
                    v-model="showPassword"
                  ></v-switch>
                  <v-text-field
                    v-show="showPassword"
                    v-model="newPassword"
                    label="新密码"
                    prepend-icon="blank"
                    type="password"
                  ></v-text-field>
                  <v-textarea label="个人描述" prepend-icon="mdi-text" v-model="user.description"></v-textarea>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <div class="flex-grow-1"></div>
                <v-btn color="#FFD600" v-on="on" @click="updateUser">更新</v-btn>
              </v-card-actions>
            </v-card>
          </v-hover>
        </v-col>
      </v-row>
      <image-upload
        field="file"
        @crop-success="cropSuccess"
        @crop-upload-success="cropUploadSuccess"
        @crop-upload-fail="cropUploadFail"
        v-model="crop.show"
        :width="150"
        :height="150"
        url="/api/filesystem"
        :params="crop.params"
        :headers="crop.headers"
        img-format="png"
        :langExt="crop.langExt"
        :noCircle="false"
        :noSquare="true"
      ></image-upload>
    </v-container>
  </v-content>
</template>
<style>
.hoverPointer:hover {
  cursor: pointer;
}
</style>
<script>
import qs from "qs";
import ImageUpload from "vue-image-crop-upload";
export default {
  name: "center",
  components: {
    ImageUpload
  },
  beforeCreate() {},
  mounted() {
    this.user = JSON.parse(localStorage.getItem("user"));
  },
  data() {
    return {
      crop: {
        show: false,
        params: {},
        headers: {
          smail: "*_~"
        },
        list: []
      },
      showPassword: false,
      imageUrl: "group1/M00/00/00/dU4Lkl5OjIeAG6SWAABMN7CE7-U017.jpg",
      user: {},
      rules: {
        required: v => !!v || "不能为空",
        nickNameNotSpecial: v =>
          /^[a-zA-Z0-9\u4e00-\u9fa5]+$/.test(v) ||
          "昵称只能包含字母、数字或中文",
        imgSize: value => !value || value.size < 1048576 || "图片不能超过1MB",
        imgType: v =>
          (v && v.type && v.type.startsWith("image")) ||
          "文件必须是JPG、JPEG、BMP或PNG中的一种"
      },
      valid: "",
      newPassword: ""
    };
  },
  methods: {
    srcFileSet(fileName, fileType, fileSize){
      this.crop.params.fileName = fileName;
    },
    cropSuccess(imgDataUrl, field) {
      console.log("crop~~啦啦啦");
    },
    cropUploadSuccess(jsonData, field) {
      var json = qs.parse(jsonData);
      this.imageUrl = json.fileSystem.fileId;
      this.$snackbar.success("上传图片成功");
    },
    cropUploadFail(status, field) {
      this.$snackbar.error("上传图片失败");
    },
    updateUser() {}
  }
};
</script>