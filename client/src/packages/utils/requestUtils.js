import axios from "axios";

const request = axios.create({
  baseURL: "/dev",
  timeout: 500000,
});

export { request };
