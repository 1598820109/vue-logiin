// 引入aixos
import axios from 'axios'
import Vue from 'vue'
import router from './router'

const http = axios.create({
    // 后台数据地址
    baseURL: "http://localhost:8181/admin/api"
})

// 储存token
http.interceptors.request.use(function (config) {
    if(localStorage.token){
        config.headers.Authorization = 'Bearer ' + localStorage.token;
    }
    return config;
  }, function (error) {
    return Promise.reject(error);
});


http.interceptors.response.use(function (response) {
    return response;
}, function (error) {

    if(error.response.data.message){
        Vue.prototype.$message({
            type: 'error',
            message: error.response.data.message
        })

        if(error.response.status === 401){
            router.push('/login')
        }
    }

  
    return Promise.reject(error);
});



// 暴露aixos
export default http;