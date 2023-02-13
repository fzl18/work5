// import Vue from "vue";
import axios from "axios";
import { Toast } from "vant";
// import store from '@/store'
import qs from "qs";
import router from "@/router";
const requestTimeout = 5000;
const tokenName = "token";
let loadingInstance;
const handleData = ({ config, data }) => {
  if (loadingInstance) loadingInstance.clear();
  let { success, errorCode, errorMsg } = data;
  let res = data.data;
  // res.$res = data

  if (success) {
    return res;
  }
  // 提醒接口报错消息
  if (!success) {
    const msg = !success
      ? // ? `后端接口 ${config.url} 异常 ${errorCode}：${errorMsg}`
        `${errorMsg}`
      : ``;

    switch (errorCode) {
      //未登录状态重定向
      case `401`:
        // store.dispatch('coreUser/resetAll').catch(() => {})
        // window.location.href = `${res.redirectUrl}${encodeURIComponent(
        //   window.location.href
        // )}`
        if (!res.redirectUrl) {
          window.location.reload();
        }
        break;
      case `4041001`:
        router.push({ path: "/403" }).catch(() => {});
        break;
      case `403`:
        window.location.reload();
        break;
      default:
        if (errorMsg) {
          Toast(msg);
          console.log(msg);
          throw new Error(errorMsg);
        } else {
          return data;
        }
      // break;
    }
  }
  return data;
};

export default (url) => {
  /**
   * @description axios初始化
   */

  // alert(oapi_login.getAccessToken());

  const instance = axios.create({
    baseURL: url,
    timeout: requestTimeout,
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: oapi_login.getAccessToken(),
      //  || `eyJhbGciOiJSUzI1NiJ9.eyJpc3MiOiI5NmE1MzIwYzI5NDc1NThhZTE2MjAwNjk0Yzc5YTdlYmYxMDAzOTdhIiwic3ViIjoie1wiam9iQ29kZVwiOlwiQlRaTjAwMzlcIixcInVzZXJpZFwiOlwiMDgyNzQwNDA2MDI2Mjk4MjYyXCIsXCJuYW1lXCI6XCLmnajmn7Poj4FcIixcImRlcGFydG1lbnRcIjpbMzU5NDQ2Mjg5XSxcInRpbWVTdGFtcFwiOjE2NzI4MTU4NzJ9IiwiaWF0IjoxNjcyODE1ODcyLCJqdGkiOiIwMGE4OTM1Zi1lYTNkLTQyMWQtYjNlNi1jYTNiYzgyNDM2MjkifQ.EHm2wRSUc9PCiZ2cX3-zAxgQQSXRz_AaoKqZtpdoJclA9b87bChXnV01_HUoBlzHRCZ1zSmKnwQpCfmdqNUD9BmvGZSnFOfV6pMESzBGjuGkpYovxa1ER5t8AcpWvmEXcHM5N7PhBXlHqSC-GH3PDsX-jpscLZ2mSqmR8g2Edxo`,
    },
    paramsSerializer: (params) => qs.stringify(params, { indices: false }),
  });
  /**
   * @description axios请求拦截器
   */
  instance.interceptors.request.use(
    (config) => {
      // console.log(config)
      // let i18n = store.getters['coreSettings/language'] || 'zh'
      // config.headers["Accept-Language"] = "zh";
      // if (store.getters['coreUser/accessToken'])
      config.headers[tokenName] = ""; //store.getters['coreUser/accessToken']
      // if (config.params) config.params = qs.stringify(config.params)
      if (
        config.data &&
        config.headers["Content-Type"] ===
          "application/x-www-form-urlencoded;charset=UTF-8"
      )
        config.data = qs.stringify(config.data);
      // if ([].some((item) => config.url.includes(item)))
      loadingInstance = Toast.loading({
        message: "加载中...",
        forbidClick: true,
        loadingType: "spinner",
      });
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  /**
   * @description axios响应拦截器
   */
  instance.interceptors.response.use(
    (response) => {
      return handleData(response);
    },
    (error) => {
      const { response } = error;
      if (response === undefined) {
        Toast({
          message: "未可知错误",
          forbidClick: true,
        });
        return {};
      } else return handleData(response);
    }
  );

  return instance;
};
