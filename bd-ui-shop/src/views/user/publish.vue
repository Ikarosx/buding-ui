<template>
  <v-main>
    <v-img src="@/assets/img/1.png" class="bdBackground" height="100%" width="100%"></v-img>
    <v-container>
      <v-row>
        <v-col>
          <v-card>
            <v-card-title>我的商品</v-card-title>
            <v-data-table
              show-select
              search
              :headers="table.headers"
              :items="table.desserts"
              :items-per-page="10"
              item-key="id"
              v-model="selectedGoodList"
              class="elevation-12"
              no-data-text="你还没有发布商品"
            >
              <template v-slot:item.operation="{ item }">
                <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
                <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
              </template>

              <template v-slot:body.append>
                <tr>
                  <td colspan="4"></td>
                  <v-btn color="error" class="ma-2" @click="deleteGoods">批量删除</v-btn>
                </tr>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
      <v-dialog v-model="dialog.delDialog" persistent max-width="290">
        <v-card>
          <v-card-title class="headline">确认删除</v-card-title>
          <v-card-text>你确定要删除咩</v-card-text>
          <v-card-actions>
            <div class="flex-grow-1"></div>
            <v-btn color="green darken-1" text @click="dialog.delDialog = false">取消</v-btn>
            <v-btn color="error darken-1" text @click="deleteItemOk">删除</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialog.editDialog" content-class="notBoxShadow">
        <good :good="operateItem" :update="true"></good>
      </v-dialog>
    </v-container>
  </v-main>
</template>
<style>
.notBoxShadow {
  box-shadow: 0px 0px 0px;
}
</style>
<script>
import qs from "qs";
import Good from "@/views/shop/components/Good";
import * as shopApi from "@/views/shop/api";
export default {
  components: {
    Good
  },
  name: "myRelease",
  created() {
    this.listGoods();
  },
  mounted() {},
  data() {
    return {
      operateItem: {},
      operateIndex: "",
      dialog: {
        delDialog: false,
        editDialog: false
      },
      selectedGoodList: [],
      page: 1,
      size: 10,
      pageRequest: {
        userId: "8a80cb81704365b5017043674de40006"
      },
      valid: "",
      rules: {
        required: value => !!value || "不能为空",
        imgTypeAndSize: v => this.validImgs(),
        notSpecial: v =>
          /^[a-zA-Z0-9\u4e00-\u9fa5]+$/.test(v) || "只能包含字母、数字或中文",
        numical: v => /^[0-9]{1}[0-9]*[.]?[0-9]*$/.test(v) || "价格格式错误"
      },
      table: {
        headers: [
          {
            text: "商品ID",
            value: "id"
          },
          { text: "名称", value: "goodName" },
          { text: "价格", value: "price" },
          { text: "操作", value: "operation" }
        ],
        desserts: []
      }
    };
  },
  methods: {
    listGoods() {
      shopApi
        .listGoods(this.page, this.size, this.pageRequest)
        .then(result => {
          if (result.success) {
            this.table.desserts = result.queryResult.list;
          } else {
            this.$message.error(result.message);
          }
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    deleteGoods() {
      var ids = "";
      for (let index in this.selectedGoodList) {
        ids += this.selectedGoodList[index].id + "-";
      }
      ids = ids.substring(0, ids.length - 1);
      shopApi
        .deleteGoods(ids)
        .then(result => {
          if (result.success) {
            this.$message.success(result.message);
            this.listGoods();
          } else {
            this.$message.error(result.message);
          }
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    editItem(item) {
      this.operateItem = item;
      this.dialog.editDialog = true;
    },
    deleteItem(item) {
      this.operateItem = item;
      this.dialog.delDialog = true;
    },
    deleteItemOk() {
      shopApi
        .deleteGood(this.operateItem.id)
        .then(result => {
          if (result.success) {
            this.$message.success(result.message);
            this.dialog.delDialog = false;
            this.listGoods();
          } else {
            this.$message.error(result.message);
          }
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    }
  }
};
</script>