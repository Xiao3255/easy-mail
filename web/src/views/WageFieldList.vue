<template>
  <div>
    <h1>工资字段管理</h1>
    <el-table :data="items">
      <el-table-column label="数据库字段名称">
        <template #default="{row}">
          <div v-if="row.editable && !row.usageMsg">
            <el-input v-model="row.dbname"></el-input>
          </div>
          <span v-else>{{row.dbname}}</span>
        </template>
      </el-table-column>
      <el-table-column label="自定义字段名称">
        <template #default="{row}">
          <div v-if="row.editable">
            <el-input v-model="row.name"></el-input>
          </div>
          <span v-else>{{row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否已引用该字段">
        <template #default="{row}">{{row.usageMsg ? '已引用':'未引用'}}</template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="{$index,row}">
          <div v-if="row.editable">
            <el-button type="text" @click="handleSave(row)">保存</el-button>
            <el-button type="text" @click="handleCancel(row)">取消</el-button>
          </div>
          <el-button v-else type="text" @click="handleEdit(row)">编辑</el-button>
          <el-button v-if="!row.usageMsg" type="text" @click="handleDelete($index)">删除</el-button>
        </template>
      </el-table-column>
      <el-table-column label="启用字段">
        <template #default="{row}">
          <el-switch v-model="row.used" :disabled="row.usageMsg"></el-switch>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [
        {
          dbname: "yearEndAwards",
          name: "年终奖",
          usageMsg: true,
          used: true
        },
        {
          dbname: "overTimePay",
          name: "加班费",
          usageMsg: false,
          used: false
        }
      ]
    };
  },
  methods: {
    fetch() {},
    handleEdit(row) {
      this.$set(row, "editable", true);
    },
    handleSave(row) {
      row.editable = false;
      delete row.editable;
    },
    handleCancel(row) {
      row.editable = false;
      delete row.editable;
    },
    handleDelete(index){
      this.items.splice(index,1);
    }
  },
  created() {
    //this.fetch();
  }
};
</script>

<style>
</style>