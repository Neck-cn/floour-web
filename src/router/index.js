import VueRouter from "vue-router";
import Vue from 'vue';

import SendGood from "../comonents/SendGood";
import Account from "../comonents/Account";

Vue.use(VueRouter);

export default new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/SendGood'
    },
    {
      path: '/SendGood',
      name: 'SendGood',
      component: SendGood,
      meta: {
        keepAlive: true
      }
    }, {
      path: '/Account',
      name: 'Account',
      component: Account,
      meta: {
        keepAlive: true
      }
    }
  ]
})
