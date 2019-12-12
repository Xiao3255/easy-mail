<template>
  <el-container style="height: 100vh; border: 1px solid #eee">
    <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
      <el-menu router :default-openeds="['1']" unique-opened :default-active="$router.path">
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-user-solid"></i>员工管理
          </template>
          <el-menu-item-group>
            <template slot="title">员工</template>
            <el-menu-item index="/employees/create">添加员工</el-menu-item>
            <el-menu-item index="/employees/list">员工列表</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group title="数据操作">
            <el-menu-item index="/employees/push">批量导入</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-message"></i>邮件编辑
          </template>
          <el-menu-item-group>
            <template slot="title">分组一</template>
            <el-menu-item index="/wages/field">自定义字段添加</el-menu-item>
            <el-menu-item index="/wages/fieldlist">字段管理</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group title="工资管理">
            <el-menu-item index="/wages/list">工资条</el-menu-item>
          </el-menu-item-group>
          <el-submenu index="2-4">
            <template slot="title">选项4</template>
            <el-menu-item index="2-4-1">选项4-1</el-menu-item>
          </el-submenu>
        </el-submenu>
        <el-submenu index="3">
          <template slot="title">
            <i class="el-icon-setting"></i>设置
          </template>
          <el-menu-item-group>
            <template slot="title">服务器</template>
            <el-menu-item index="/setting/base">基本</el-menu-item>
            <el-menu-item index="3-2">选项2</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group title="分组2">
            <el-menu-item index="3-3">选项3</el-menu-item>
          </el-menu-item-group>
          <el-submenu index="3-4">
            <template slot="title">选项4</template>
            <el-menu-item index="3-4-1">选项4-1</el-menu-item>
          </el-submenu>
        </el-submenu>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header style="text-align: right; font-size: 12px">
        <el-dropdown>
          <i class="el-icon-setting" style="margin-right: 15px"></i>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>查看</el-dropdown-item>
            <el-dropdown-item>新增</el-dropdown-item>
            <el-dropdown-item>删除</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <span>王小虎</span>
      </el-header>

      <el-main>
        <router-view :key="$router.path"></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
// @ is an alias to /src
export default {};
</script>
<style>
.el-header {
  background-color: #b3c0d1;
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: #333;
}
</style>
