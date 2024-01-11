import axios from "axios"

const apiInstance=axios.create({

    baseURL:"http://localhost:5173",
})

apiInstance.interceptors.request.use(

    (config)=>{
        console.log(config,"configurationnn")
        return config

        
    },
    (error)=>{
        return Promise.reject(error)
    }
)


apiInstance.interceptors.response.use(

    (response)=>{
        return response
    },

    (error)=>{

        return Promise.reject(error)
    }
)

export default apiInstance;