import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    children: [
      {
        path: '/employees/create',
        component: () => import(/* webpackChunkName: "employeeedit" */ '../views/EmployeeEdit.vue')
      },
      {
        path: '/employees/edit/:id',
        props: true,
        component: () => import(/* webpackChunkName: "employeeedit" */ '../views/EmployeeEdit.vue')
      },
      {
        path: '/employees/list',
        component: () => import(/* webpackChunkName: "employeelist" */ '../views/EmployeeList.vue')
      },
      {
        path: '/employees/push',
        component: () => import(/* webpackChunkName: "employeepush" */ '../views/EmployeePush.vue')
      },
      {
        path: '/setting/base',
        component: () => import(/* webpackChunkName: "settingbase" */ '../views/SettingBase.vue')
      },
      {
        path: '/wages/list',
        component: () => import(/* webpackChunkName: "wagelist" */ '../views/WageList.vue')
      },
      {
        path: '/wages/edit/:id',
        props: true,
        component: () => import(/* webpackChunkName: "wageedit" */ '../views/WageEdit.vue')
      },
      {
        path: '/wages/field',
        component: () => import(/* webpackChunkName: "wagefield" */ '../views/WageField.vue')
      },
      {
        path: '/wages/fieldList',
        component: () => import(/* webpackChunkName: "wagefieldList" */ '../views/WageFieldList.vue')
      },
    ]
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
]

const router = new VueRouter({
  routes
})

export default router
