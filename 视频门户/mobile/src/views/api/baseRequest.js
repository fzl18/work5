import request from "./request";

let baseURL =
  process.env.NODE_ENV === "development"
    ? `/video/`
    : `https://portal.boton-tech.com/`; //`http://10.11.0.169:8431/maccess/`;
// let baseURL = `/video/`;

export default request(baseURL);
