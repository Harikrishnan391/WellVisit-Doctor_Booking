export const BASE_URL = "http://localhost:5000/api";
// export const BASE_URL='https://www.wellvisit.online/api'
const userInLocal = JSON.parse(localStorage.getItem("PatientInfo")) || {};
const doctorInLocal = JSON.parse(localStorage.getItem("doctorInfo")) || {};
const adminInLocal = JSON.parse(localStorage.getItem("adminInfo"));
export const token = userInLocal ? userInLocal.token : null;
export const docToken = doctorInLocal ? doctorInLocal.token : null;
export const adminToken = adminInLocal ? adminInLocal.token : null;
export const type = userInLocal ? userInLocal.role : null;
// console.log(type,"type in config")
export const doctorPath = "http://localhost:5000/doctorMedia/";
export const userPath = "http://localhost:5000/userMedia/";
