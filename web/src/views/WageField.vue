<template>
  <div>
    <h1>工资字段添加</h1>
    <el-form
      ref="ruleForm"
      label-width="120px"
      @submit.native.prevent="save('ruleForm')"
      style="width:50rem;margin:0 auto"
    >
      <el-form-item label="数据库字段名称">
        <el-input v-model="items.dbname" placeholder="请输入数据库字段名称"></el-input>
      </el-form-item>
      <el-form-item label="自定义字段名称">
        <el-input v-model="items.name" placeholder="请输入自定义字段名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit">保存</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: []
    };
  },
  methods: {
    save() {},
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    async fetch() {}
  },
  created() {
    this.fetch();
  }
};
</script>

<style>
</style>