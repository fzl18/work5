import Vue from "vue";
import VueRouter from "vue-router";
import Api from "@/views/api/login";
import $api from "@/views/api/common";
import { query } from "@/views/api/charts";
import store from "../store";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "index",
    component: () => import("../views/index.vue"),
  },
];
const router = new VueRouter({
  mode: "hash",
  routes,
});

router.beforeEach((to, from, next) => {
  let href = window.location.href;
  let query = href.substring(href.indexOf("?") + 1);
  let vars = query.split("&");
  let pair = [];
  let xtoken = "";
  let flag = false;
  for (var i = 0; i < vars.length; i++) {
    pair = vars[i].split("=");
    if (pair[0] == "xtoken") {
      xtoken = pair[1];
      flag = true;
    }
  }
  if (flag) {
    document.cookie = "SESSION=" + xtoken.replace("#/", "") + ";path=/";
    window.location.href = href.replace(
      vars.length == 1 ? "?xtoken=" + xtoken : "xtoken=" + xtoken,
      ""
    );
    next();
  }
  Api.getLogin().then((res) => {
    if (res.code == 302) {
      window.location.href = `${$api.login}?redirectUrl=${href}`;
    } else {
      new Promise((resolve, reject) => {
        // $api
        //   .getMenu({
        //     params: {
        //       topUnit: res.data.userInfo.topUnit,
        //       userCode: res.data.userInfo.userCode,
        //     },
        //   })
        //   .then(async (res) => {
        //     let userPower = [];
        //     let allMenu = [];
        //     await $api
        //       .getDictionary({ params: { catalogCode: "GYHLWMENU" } })
        //       .then((res) => {
        //         res.data.forEach((item) => {
        //           userPower.push(item.dataCode);
        //         });
        //       });
        //     await res.data.forEach((item) => {
        //       userPower.forEach((it) => {
        //         if (item.optId === it) {
        //           item.children.forEach((it) => {
        //             allMenu.push(it);
        //           });
        //         }
        //       });
        //     });
        //     const arr = hasChildren(allMenu);
        //     store.commit("coreRoutes/setRoutes", arr);
        //   });
        // $api
        //   .getAllUnits({
        //     params: {
        //       topUnit: res.data.userInfo.topUnit,
        //     },
        //   })
        //   .then((res) => {
        //     const arr = hasUnitChildren(res.data);
        //     store.state.allUnits = arr;
        //   });
        $api
          .getUnitUsers({
            params: {
              topUnit: res.data.userInfo.topUnit,
              unitCode: res.data.userInfo.topUnit,
            },
          })
          .then((res) => {
            store.state.allUser = res.data;
          });
        store.state.userinfo = res.data.userInfo;
        store.state.userPowers = res.data.userOptList;
        resolve("成功");
      })
        .then((res) => {
          next();
        })
        .catch((error) => {
          alert("请求出错");
        });
    }
  });
});

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject)
    return originalPush.call(this, location, onResolve, onReject);
  return originalPush.call(this, location).catch((err) => err);
};

export function resetRouter() {
  router.matcher = new VueRouter({
    base: publicPath,
    mode: routerMode,
    scrollBehavior: () => ({
      y: 0,
    }),
    routes,
  }).matcher;
}

export default router;
