import axios from "axios";


const axiosInstance=axios.create({
    baseURL:
     import.meta.env.MODE === "development"
      ? "http://127.0.0.1:8000"
      : "https://leave-approval-system.onrender.com",
    withCredentials:true
})

axiosInstance.interceptors.request.use(
    (config)=>{
        return config
    },
    (error)=>Promise.reject(error)

)

axiosInstance.interceptors.response.use(
    (response)=>response,
    async(error)=>{
        const originalRequest=error.config

        if(error.response?.status===401 && !originalRequest._retry && !originalRequest.url.includes('/accounts/refresh-token/')){
            originalRequest._retry=true
            try{
                await axiosInstance.post('/accounts/refresh-token/')
                return axiosInstance(originalRequest)
            }catch(refreshError){
                console.log("Refresh token failed, redirecting to login")
                window.location.href='/login'
                return Promise.reject(refreshError)
            }
        }
        return Promise.reject(error)
    }
)

export default axiosInstance