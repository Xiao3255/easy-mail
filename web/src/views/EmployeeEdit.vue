<template>
  <div>
    <h1>{{id ? '编辑' : '新增'}}员工</h1>
    <el-form
      :model="model"
      status-icon
      :rules="rules"
      ref="ruleForm"  
      label-width="120px"
      @submit.native.prevent="save('ruleForm')"
      style="width:50rem;margin:0 auto"
    >
      <el-form-item label="名称" prop="employeeName">
        <el-input v-model="model.employeeName" placeholder="请员工名称"></el-input>
      </el-form-item>
      <el-form-item label="头像">
        <el-upload
          class="avatar-uploader"
          :action="uploadUrl"
          name="imgFile"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
        >
          <img v-if="model.icon" :src="$http.defaults.baseURL + model.icon" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-radio-group v-model="model.gender">
          <el-radio :label="0">女</el-radio>
          <el-radio :label="1">男</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="部门ID" prop="departmentId">
        <el-input v-model="model.departmentId" placeholder="请输入部门ID"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="model.password" placeholder="请输入密码" show-password></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="model.email" placeholder="请输入邮箱"></el-input>
      </el-form-item>
      <el-form-item label="电话" prop="phone">
        <el-input v-model="model.phone" placeholder="请输入电话号码"></el-input>
      </el-form-item>
      <el-form-item label="入职时间" prop="entryTime">
        <el-date-picker
          v-model="model.entryTime"
          type="date"
          placeholder="选择日期时间"
          align="right"
          :picker-options="pickerOptions"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit">保存</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Qs from "qs";
import dayjs from "dayjs";

export default {
  props: {
    id: {}
  },
  data() {
    const validateName = (rule, value, callback) => {
      const nPatrn = /^(\D)[A-z0-9\u4e00-\u9af5_-]{1,16}$/;
      if (!value) {
        callback(new Error("名称不可为空"));
      } else if (!nPatrn.test(value)) {
        callback(new Error("请输入2到16位的非数字开头，不包含特殊符号的名称"));
      }
      callback();
    };
    const validatePass = (rule, value, callback) => {
      const pPatrn = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/;
      if (!value) {
        callback(new Error("密码不可为空"));
      } else if (!pPatrn.test(value)) {
        callback(
          new Error(
            "密码需包含至少八个字符，至少一个字母，一个数字和一个特殊字符"
          )
        );
      }
      callback();
    };
    const validateDepart = (rule, value, callback) => {
      if (!value) {
        callback(new Error("部门ID不可为空"));
      }
      callback();
    };
    const validateEmail = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("邮箱不可为空"));
      }
      callback();
    };
    const validateMobile = (rule, value, callback) => {
      const mPatrn=/^1[3456789]\d{9}$/;
      if (!value) {
        callback(new Error("电话号码不可为空"));
      } else if(!mPatrn.test(value)){
        callback(new Error('请输入符合规范的电话号码'))
      }
      callback();
    };
    return {
      model: {
        employeeName: "",
        password: "",
        gender: "",
        departmentId: "",
        email: "",
        phone: "",
        entryTime: "",
        icon: ""
      },
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
      rules: {
        employeeName: [
          { required: true, validator: validateName, trigger: "blur" }
        ],
        password: [
          { required: true, validator: validatePass, trigger: "blur" }
        ],
        gender: [{ required: true, message: "请选择性别", trigger: "change" }],
        departmentId: [
          { required: true, validator: validateDepart, trigger: "blur" }
        ],
        email: [{ required: true, validator: validateEmail, trigger: "blur" }],
        phone: [{ required: true, validator: validateMobile, trigger: "blur" }],
        entryTime: [
          { required: true, message: "请输入注册时间", trigger: "change" }
        ]
      }
    };
  },
  methods: {
    save(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          if (this.id) {
            const imodel = this.model;
            imodel.entryTime = dayjs(imodel.entryTime).format("YYYY/MM/DD");
            await this.$http.put("employee", Qs.stringify(imodel));
          } else {
            await this.$http.post("employee", Qs.stringify(this.model));
          }
          this.$router.push("/employees/list");
          this.$message({
            message: "保存成功",
            type: "success"
          });
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleAvatarSuccess(res) {
      this.$set(this.model, "icon", res.data);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    async fetch() {
      const res = await this.$http.get(`/employee/${this.id}`);

      delete res.data.data["createTime"];
      delete res.data.data["updateTime"];
      delete res.data.data["lastLoginTime"];
      this.model = res.data.data;
    }
  },
  created() {
    this.id && this.fetch();
  }
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>