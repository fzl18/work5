import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import { getUserInfo } from "../views/api";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      title: "首页",
    },
  },
  {
    path: "/user",
    name: "User",
    component: () => import("../views/User.vue"),
    meta: {
      title: "我的",
    },
  },
  {
    path: "/videoList",
    name: "VideoList",
    component: () => import("../views/VideoList.vue"),
    meta: {
      title: "视频列表",
    },
  },
  {
    path: "/videoDetail",
    name: "VideoDetail",
    component: () => import("../views/video/VideoDetail.vue"),
    meta: {
      title: "视频详情",
    },
  },
  {
    path: "/videoPlayer",
    name: "VideoPlayer",
    component: () => import("../views/video/Player.vue"),
    meta: {
      title: "播放视频",
    },
  },
  {
    path: "/myLike",
    name: "MyLike",
    component: () => import("../views/user/MyVideoList.vue"),
    meta: {
      title: "我的点赞",
    },
  },
  {
    path: "/myFavorites",
    name: "MyFavorites",
    component: () => import("../views/user/MyVideoList.vue"),
    meta: {
      title: "我的收藏",
    },
  },
  {
    path: "/myPlayList",
    name: "MyPlayList",
    component: () => import("../views/user/MyVideoList.vue"),
    meta: {
      title: "播放记录",
    },
  },
];

const router = new VueRouter({
  routes,
});

if (process.env.NODE_ENV !== "development") {
  router.beforeEach(async (to, from, next) => {
    const hasToken = oapi_login.getAccessToken();
    const getUrlParams = (url) => {
      const _url = url || window.location.href;
      const _urlParams = _url.match(/([?&])(.+?=[^&]+)/gim);
      return _urlParams
        ? _urlParams.reduce((a, b) => {
            const value = b.slice(1).split("=");
            a[value[0]] = value[1];
            return a;
          }, {})
        : {};
    };
    if (hasToken) {
      next();
    } else {
      const href = window.location.href;
      const ticket = getUrlParams().ticket;
      // sendDebugToDing("---ticket---" + ticket);
      //拿到票据请求登录
      oapi_login
        .dingLogin({ ticket: ticket || "" }, href)
        .then((token) => {
          // sendDebugToDing("---login success---" + token);
          //将token存入本地
          // alert("登录成功！");
          oapi_login.setItem(token);
          // getUserInfo().then((res) => {
          //   console.log(res);
          next({ ...to, replace: true });
          // });
        })
        .catch((info) => {
          //
          if (info.code == "401010") {
            // sendDebugToDing("---401010---" + JSON.stringify(info));
            //重定向
            window.location.href = info.result.redirecturl;
          } else if (info.code == "401020") {
            // sendDebugToDing("---401020---" + JSON.stringify(info));
            //登录失败或未获取token 去清除redis中的token，并重新登录
            oapi_login
              .maccessClear(info.result.ticket, href)
              .then((res) => {
                // sendDebugToDing("---dingClear success---" + JSON.stringify(res));
                //重定向登录
                window.location.href = res.result.redirecturl;
              })
              .catch(() => {
                // sendDebugToDing(
                //   "---dingClear error---" + "ticket:" + info.result.ticket
                // );

                alert("系统异常，请重试！");
                window.location.reload();
              });
          } else {
            // sendDebugToDing("---error---");
            alert("钉钉登录失败，请稍后重试！");
            window.location.reload();
          }
        });
    }
  });
}

export default router;
