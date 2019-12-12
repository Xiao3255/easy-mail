<template>
  <div>
    <el-form ref="searchForm" v-model="select" @submit.native.prevent="research">
      <el-form-item>
        <el-switch v-model="enableResearch" active-text="启用搜索"></el-switch>
      </el-form-item>
      <el-form-item v-show="enableResearch">
        <el-row type="flex">
          <el-col :offset="1">
            <el-input v-model="select.employeeName" placeholder="请输入姓名">
              <template slot="prepend">姓名</template>
            </el-input>
          </el-col>
          <el-col :offset="1">
            <el-input v-model="select.departmentId" placeholder="请输入部门ID">
              <template slot="prepend">部门ID</template>
            </el-input>
          </el-col>
          <el-col :offset="1">
            <el-input v-model="select.minSalary" placeholder="请输入最小工资">
              <template slot="prepend">最小工资</template>
            </el-input>
          </el-col>
          <el-col :offset="1">
            <el-input v-model="select.maxSalary	" placeholder="请输入最大工资">
              <template slot="prepend">最大工资</template>
            </el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item v-show="enableResearch">
        <el-button type="text" native-type="submit">查询</el-button>
        <el-button type="text" @click="reset">重置搜索条件</el-button>
      </el-form-item>
    </el-form>
    <el-table
      ref="coupleTable"
      max-height="600"
      v-loading="loading"
      :data="infos"
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column prop="employeeName" label="姓名" align="center"></el-table-column>
      <el-table-column prop="departmentId" label="部门ID" align="center"></el-table-column>
      <el-table-column prop="entryTime" label="工资年月" align="center" :formatter="formatter"></el-table-column>
      <el-table-column prop="salary" label="工资" align="center" sortable></el-table-column>
      <el-table-column prop="send" label="发送状态" align="center" :formatter="hintSend" sortable></el-table-column>
      <el-table-column label="操作" fixed="right" width="160" align="center">
        <template #default="{$index,row}">
          <el-button type="text" @click="$router.push(`/wages/edit/${row.id}`)">编辑</el-button>
          <el-button type="text" @click="send(row)">发送</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div>
      <el-button type="text" @click="send(infos)">发送工资单</el-button>
      <el-button type="text" @click="send(multipleSelection)">仅向选中的对象发送工资单</el-button>
      <el-button v-show="detailMsg" type="text" @click="dialogVisible = true">查看当前提交状况</el-button>
      <el-dialog title="当前提交状况" :visible.sync="dialogVisible" width="30%" show-close="false">
        <span v-html="detailMsg"></span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">确定</el-button>
        </span>
      </el-dialog>
    </div>
    <el-pagination
      layout="total, sizes, prev, pager, next, jumper"
      :total="pageInfos.total"
      :page-size="pageInfos.pageSize"
      :page-sizes="pageSizes"
      style="text-align:right;"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    ></el-pagination>
  </div>
</template>

<script>
import Qs from "qs";
import dayjs from "dayjs";
export default {
  data() {
    return {
      infos: [],
      pageInfos: {
        total: 0,
        pageSize: 10
      },
      pageSizes: [10, 20, 30],
      enableResearch: true,
      select: {},
      currentRow: null,
      multipleSelection: [],
      dialogVisible: false,
      detailMsg: "",
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            }
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            }
          }
        ]
      },
      currentPage: 1,
      loading: true
    };
  },
  methods: {
    async fetch(currentPage, pageSize, params) {
      this.loading = true;
      const res = await this.$http.get(`payRolls/${currentPage}/${pageSize}`, {
        params: params
      });
      this.infos = res.data.data.list;
      this.loading = false;
      this.pageInfos = res.data.data;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      if (this.enableResearch) {
        this.fetch(val, this.pageInfos.pageSize, this.select);
      } else {
        this.fetch(val, this.pageInfos.pageSize, {});
      }
    },
    handleSizeChange(val) {
      this.pageInfos.pageSize = val;
      if (this.enableResearch) {
        this.fetch(this.currentPage, val, this.select);
      } else {
        this.fetch(this.currentPage, val, {});
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    async send(items) {
      let res;
      if (typeof items === Array) {
        let ids = [];
        items.forEach(v => {
          ids.push(v.id);
        });
        let param = new URLSearchParams();
        param.append("ids", ids);
        res = await this.$http.post("/payRolls/sendMail", param);
      } else if (typeof items === Object) {
        res = await this.$http.post(
          "/payRoll/sendMail",
          Qs.stringify({
            id: items.id
          })
        );
      }
      this.detailMsg = res.data.msg;
      this.$message.info(res.data.msg);
      this.detailMsg = res.data.msg.replace(/\n/g, "<br/>");
      this.fetch(this.currentPage, this.pageInfos.pageSize, {});
    },
    formatter(row) {
      return row.entryTime != null
        ? dayjs(row.entryTime).format("YYYY/MM/DD")
        : dayjs(Date.now()).format("YYYY/MM/DD");
    },
    research() {
      if (
        (this.select.minSalary && !this.select.maxSalary) ||
        (!this.select.minSalary && this.select.maxSalary)
      ) {
        return this.$notify.error({
          title: "提示",
          message: "请输入最大工资与最小工资",
          showClose: false
        });
      }
      this.fetch(this.currentPage, this.pageInfos.pageSize, this.select);
    },
    reset() {
      if (this.select != "") {
        this.select = {};
        this.fetch(this.currentPage, this.pageInfos.pageSize, {});
      }
    },
    hintSend(row) {
      switch (row.send) {
        case 0:
          row.send = "未发送";
          break;
        case 1:
          row.send = "发送中";
          break;
        case 2:
          row.send = "已发送";
          break;
        case 3:
          row.send = "发送失败";
          break;
      }
      return row.send;
    }
  },
  created() {
    this.fetch(this.currentPage, this.pageInfos.pageSize, {});
  }
};
</script>

<style>
.el-select .el-input {
  width: 8rem;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
</style>