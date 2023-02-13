import fetch from "@/utils/request";

let request = fetch("/am-app-api-mobile/dash/");
export default {
  fetch: function(data) {
    return request(data);
  },
};
