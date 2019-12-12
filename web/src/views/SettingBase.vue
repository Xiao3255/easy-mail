<template>
  <div>
    <el-form
      :model="model"
      ref="ruleForm"
      :rules="rules"
      status-icon
      label-width="120px"
      @submit.native.prevent="save"
    >
      <h2>基本信息设置</h2>
      <el-form-item label="帐户名" prop="usrName">
        <el-input v-model="model.usrName" placeholder="填写帐户名"></el-input>
      </el-form-item>
      <el-form-item label="电子邮箱" prop="email">
        <el-input v-model="model.email" placeholder="填写电子邮件提供商提供的邮箱"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="model.password" placeholder="填写密码或授权码" show-password></el-input>
      </el-form-item>
      <h2>服务器设置</h2>
      <el-form-item :label="useIMAP ? '已开启' : '已关闭'">
        <el-switch v-model="useIMAP" active-text="IMAP"></el-switch>
      </el-form-item>
      <el-form-item v-if="useIMAP">
        <el-row type="flex">
          <el-col>
            <el-form-item label="服务器">
              <el-input v-model="model.imapHostname" placeholder="填写电子邮件提供商提供的服务器"></el-input>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="端口">
              <el-input v-model="model.imapPort" placeholder="默认为993"></el-input>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="加密">
              <el-switch v-model="model.imapEncrypt" active-text="SSL/TSL"></el-switch>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item :label="useSMTP ? '已开启' : '已关闭'">
        <el-switch v-model="useSMTP" active-text="SMTP"></el-switch>
      </el-form-item>
      <el-form-item v-if="useSMTP">
        <el-row type="flex">
          <el-col>
            <el-form-item label="服务器">
              <el-input v-model="model.smtpHostname" placeholder="填写电子邮件提供商提供的服务器"></el-input>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="端口">
              <el-input v-model="model.smtpPort" placeholder="默认为465"></el-input>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="加密">
              <el-switch v-model="model.smtpEncrypt" active-text="SSL/TSL"></el-switch>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item style="margin-top:5rem;">
        <el-button @click="save">保存</el-button>
        <el-button type="danger" @click="reset('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
//import Qs from "qs";

export default {
  data() {
    return {
      model: {},
      useIMAP: false,
      useSMTP: false,
      rules: {
        usrName: [
          { required: true, message: "账户名不可为空", trigger: "blur" }
        ],
        email: [
          { required: true, message: "邮箱不可为空", trigger: "blur" }
        ],
        password: [
          { required: true, message: "密码不可为空", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    async save() {
      this.$notify.success('设置成功');

      // const res = this.$http.post('',Qs.stringify(this.model));
      // if(res.code === 200){
      //   this.notify.success('设置成功')
      // } else{
      //   this.notify.error('失败')
      // }
    },
    reset(formName) {
      this.$confirm("是否确认重置", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$refs[formName].resetFields();
        })
        .catch(() => {});
    }
  }
};
</script>

<style>
</style>