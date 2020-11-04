<template>
  <v-main>
    <v-img
      src="@/assets/img/1.png"
      class="bdBackground"
      height="100%"
      width="100%"
      v-if="!update"
    ></v-img>
    <v-container>
      <v-row justify="center">
        <v-col>
          <v-card>
            <v-card-text>
              <v-card-title>{{
                update ? "修改商品" : "发布商品"
              }}</v-card-title>
              <v-form v-model="valid" ref="form">
                <v-text-field
                  v-model="good.goodName"
                  :counter="20"
                  :rules="[rules.required, rules.notSpecial]"
                  label="商品名称"
                  prepend-icon="mdi-pig-variant"
                  required
                ></v-text-field>
                <!-- 商品分类 -->
                <v-icon>mdi-file-tree</v-icon>
                <el-cascader
                  :options="category.categoryList"
                  v-model="category.categoryActive"
                  placeholder="请选择分类"
                  :props="category.props"
                ></el-cascader>
                <v-textarea
                  v-model="good.description"
                  label="商品描述"
                  prepend-icon="mdi-note"
                  :rules="[rules.required]"
                ></v-textarea>
                <v-text-field
                  v-model="good.price"
                  :rules="[rules.required, rules.numical]"
                  label="商品价格"
                  prepend-icon="mdi-cash-usd"
                  required
                ></v-text-field>
                <v-icon>mdi-camera</v-icon>
                <v-btn color="#FFD600" @click="crop.show = !crop.show" small
                  >上传图片</v-btn
                >
                <v-list v-if="crop.list.length > 0">
                  <v-list-item v-for="item in crop.list" :key="item">
                    <v-list-item-content>
                      <v-img
                        :src="'http://fdfs.ikarosx.cn:8888/' + item"
                        max-width="480"
                      ></v-img>
                    </v-list-item-content>
                    <v-list-item-action>
                      <v-btn icon @click="deleteFile(item)">
                        <v-icon color="grey lighten-1">mdi-close</v-icon>
                      </v-btn>
                    </v-list-item-action>
                  </v-list-item>
                </v-list>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <div class="flex-grow-1"></div>
              <v-btn color="#FFD600" @click="insertGood">发布</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <image-upload
        field="file"
        @src-file-set="srcFileSet"
        @crop-success="cropSuccess"
        @crop-upload-success="cropUploadSuccess"
        @crop-upload-fail="cropUploadFail"
        v-model="crop.show"
        :width="480"
        :height="270"
        url="http://gateway.budingcc.cn:30000/api/filesystem/upload"
        :params="crop.params"
        :headers="crop.headers"
        img-format="png"
        :langExt="crop.langExt"
        :noCircle="true"
        :noSquare="false"
      ></image-upload>
    </v-container>
  </v-main>
</template>
<script>
import qs from "qs";
import { Cascader } from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import ImageUpload from "vue-image-crop-upload";
import * as shopApi from "../api";
export default {
  components: {
    "el-cascader": Cascader,
    "image-upload": ImageUpload,
  },
  created() {
    this.loadGoodCategory();
    this.changeGood();
  },
  name: "good",
  watch: {
    good() {
      this.changeGood();
    },
  },
  props: {
    update: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "发布商品",
    },
    good: {
      type: Object,
      default: () => {
        return {
          goodName: "",
          description: "",
          directCategoryId: "",
          price: "",
          imageUrl: "",
          userId: "8a80cb81704365b5017043674de40006", // TODO
          username: "",
          schoolId: "1",
        };
      },
    },
  },
  computed: {},
  data() {
    return {
      category: {
        categoryList: [],
        categoryActive: [],
        props: {
          expandTrigger: "hover",
          value: "id",
          label: "name",
          children: "children",
          // 任意一项
          checkStrictly: false,
        },
      },
      crop: {
        show: false,
        params: {
          businessKey: "goodImage",
          fileName: "fileName",
        },
        headers: {
          smail: "*_~",
          Authorization: "Bearer " + localStorage.getItem("access_token")
        },
        langExt: {
          preview: "图片预览",
        },
        list: [],
      },
      valid: "",
      rules: {
        required: (value) => !!value || "不能为空",
        notSpecial: (v) =>
          /^[a-zA-Z0-9\u4e00-\u9fa5]+$/.test(v) || "只能包含字母、数字或中文",
        numical: (v) => /^[0-9]{1}[0-9]*[.]?[0-9]*$/.test(v) || "价格格式错误",
      },
    };
  },
  methods: {
    srcFileSet(fileName, fileType, fileSize) {
      this.crop.params.fileName = fileName;
    },
    changeGood() {
      var imageUrl = this.good.imageUrl;
      if (imageUrl && imageUrl != "") {
        this.crop.list = imageUrl.split(",");
      }
      var directCategoryId = this.good.directCategoryId;
      if (directCategoryId && directCategoryId != "") {
        this.category.categoryActive = this.convertCategoryActive(
          directCategoryId
        );
      }
    },
    convertCategoryActive(directCategoryId) {
      // "1-1-1"
      var arrays = directCategoryId.split("-");
      for (let i = 1; i < arrays.length; i++) {
        arrays[i] = arrays[i - 1] + "-" + arrays[i];
      }
      return arrays;
      // [1,1-1,1-1-1]
    },
    cropSuccess(imgDataUrl, field) {
      console.log("crop~~啦啦啦");
    },
    cropUploadSuccess(jsonData, field) {
      var json = qs.parse(jsonData);
      console.log(json);
      if (json.success) {
        this.$message.success("上传图片成功");
        this.crop.list.push(json.data.path);
        this.crop.show = false;
      } else {
        this.$message.error(json.message);
        this.crop.show = false;
      }
    },
    cropUploadFail(status, field) {
      this.$message.error("上传图片失败");
    },
    loadGoodCategory() {
      shopApi
        .listCategoryStruct()
        .then((result) => {
          if (result.success) {
            this.category.categoryList = this.handleLeaf(
              result.queryResult.list
            );
          } else {
            this.$message.error(result.message);
          }
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    },
    deleteFile(id) {
      var params = { id: id };
      shopApi
        .deleteFile(params)
        .then((result) => {
          if (result.success) {
            this.crop.list = this.crop.list.filter((item) => item != id);
            this.$message.success(result.message);
          } else {
            this.$message.error(result.message);
          }
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    },
    insertGood() {
      if (!this.$refs.form.validate()) {
        return;
      }
      if (
        !this.category.categoryActive ||
        this.category.categoryActive.length <= 1
      ) {
        this.$message.error("请选择商品分类，还有不要选择根节点da");
        return;
      }
      if (!this.crop.list || this.crop.list.length == 0) {
        this.$message.error("请上传图片");
        return;
      }
      this.good.imageUrl = this.convertImgUrl();
      this.good.directCategoryId = this.convertDirectCategoryId();
      this.good.rootCategoryId = this.category.categoryActive[1];
      shopApi
        .insertGood(this.good)
        .then((result) => {
          if (result.success) {
            this.$message.success(result.message);
            this.crop.list = [];
            this.$refs["form"].reset();
          } else {
            this.$message.error(result.message);
          }
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    },
    convertDirectCategoryId() {
      var len = this.category.categoryActive.length;
      return this.category.categoryActive[len - 1];
    },
    convertImgUrl() {
      var imgUrl = "";
      for (let index in this.crop.list) {
        let url = this.crop.list[index];
        if (url && url != "") {
          imgUrl += this.crop.list[index] + ",";
        }
      }
      imgUrl = imgUrl.substring(0, imgUrl.length - 1);
      return imgUrl;
    },
    handleLeaf(json) {
      for (let i = 0; i < json.length; i++) {
        if (!json[i].children || json[i].children.length < 1) {
          json[i].children = undefined;
        } else {
          this.handleLeaf(json[i].children);
        }
      }
      return json;
    },
  },
};
</script>