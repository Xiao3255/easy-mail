<template>
  <div>
    <el-form ref="searchForm" v-model="select" @submit.native.prevent="research">
      <el-form-item>
        <el-switch v-model="enableResearch" active-text="启用搜索"></el-switch>
      </el-form-item>
      <el-form-item v-show="enableResearch">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-input v-model="select.employeeName" placeholder="请输入姓名">
              <template slot="prepend">姓名</template>
            </el-input>
          </el-col>
          <el-col :span="12">
            <el-input v-model="select.departmentId" placeholder="请输入部门ID">
              <template slot="prepend">部门ID</template>
            </el-input>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-input v-model="select.email" placeholder="请输入邮箱">
              <template slot="prepend">邮箱</template>
            </el-input>
          </el-col>
          <el-col :span="12">
            <el-input v-model="select.phone" placeholder="请输入电话">
              <template slot="prepend">电话</template>
            </el-input>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="开始入职时间">
              <el-date-picker
                v-model="select.startEntryTime"
                type="date"
                placeholder="选择日期"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd"
                :picker-options="pickerOptions"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="结束入职时间">
              <el-date-picker
                v-model="select.endEntryTime"
                type="date"
                placeholder="选择日期"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd"
                :picker-options="pickerOptions"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item>
              <el-button type="text" native-type="submit">查询</el-button>
              <el-button type="text" @click="reset">重置搜索条件</el-button>
            </el-form-item>
          </el-col>
        </el-row>
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
      <el-table-column label="头像" align="center">
        <template #default="{row}">
          <div>
            <img :src="$http.defaults.baseURL + row.icon" width="50%" />
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="employeeName" label="姓名" width="100" align="center"></el-table-column>
      <el-table-column label="性别" width="50" align="center">
        <template #default="{row}">{{ row.gender | genderTransfer }}</template>
      </el-table-column>
      <el-table-column label="隐私" align="center">
        <el-table-column prop="departmentId" label="部门ID" align="center"></el-table-column>
        <el-table-column prop="password" label="密码" align="center"></el-table-column>
        <el-table-column prop="email" label="邮箱" show-overflow-tooltip align="center" width="160"></el-table-column>
        <el-table-column prop="phone" label="电话" align="center"></el-table-column>
      </el-table-column>
      <el-table-column prop="entryTime" label="入职时间" align="center" :formatter="formatter"></el-table-column>
      <el-table-column label="操作" fixed="right" width="160" align="center">
        <template #default="{$index,row}">
          <el-button type="text" @click="deleteRow($index,infos,row)">删除</el-button>
          <el-button type="text" @click="$router.push(`/employees/edit/${row.id}`)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div>
      <el-button type="text" @click="deleteSelection">删除所选</el-button>
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
      enableResearch: false,
      select: {},
      currentRow: null,
      multipleSelection: [],
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
      loading: false
    };
  },
  methods: {
    async fetch(currentPage, pageSize, params) {
      this.loading = true;
      const res = await this.$http.get(`employees/${currentPage}/${pageSize}`, {
        params: params
      });
      this.infos = res.data.data.list;
      this.loading = false;
      this.pageInfos = res.data.data;
    },
    deleteRow(index, infos, row) {
      let param = new URLSearchParams();
      param.append("id", `${row.id}`);
      this.$confirm("是否确认删除该员工?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          infos.splice(index, 1);
          await this.$http.delete("employee", {
            data: param
          });
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
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
    deleteSelection() {
      this.multipleSelection.forEach(val => {
        this.infos = this.infos.filter(v => v.id !== val.id);
      });
    },
    formatter(row) {
      return row.entryTime != null
        ? dayjs(row.entryTime).format("YYYY/MM/DD")
        : dayjs(Date.now()).format("YYYY/MM/DD");
    },
    research() {
      if (
        (this.select.startEntryTime && !this.select.endEntryTime) ||
        (!this.select.startEntryTime && this.select.endEntryTime)
      ) {
        return this.$notify.error({
          title: "提示",
          message: "请输入开始入职时间与结束入职时间",
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
    }
  },
  created() {
    this.fetch(this.currentPage, this.pageInfos.pageSize, {});
  },
  filters: {
    genderTransfer(val) {
      return val ? "男" : "女";
    }
  }
};
</script>

<style lang="scss">
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-select .el-input {
  width: 8rem;
}
</style>