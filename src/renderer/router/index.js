import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/operation'
    },
    {
      path: '/operation',
      name: 'home',
      component: require('@/components/common/Home').default,
      children: [
        {
          name: 'operation',
          path: '/operation',
          component: require('@/components/pages/Operation').default
        },
        {
          name: 'history',
          path: '/history',
          component: require('@/components/pages/History').default
        },
        {
          name: 'setting',
          path: '/setting',
          component: require('@/components/pages/Setting').default
        }
      ]
    }
  ]
})
