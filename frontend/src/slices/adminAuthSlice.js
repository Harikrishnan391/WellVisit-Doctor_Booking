import { createSlice } from "@reduxjs/toolkit";



const adminInfo=localStorage.getItem("adminInfo")

const initialState={
    adminInfo:adminInfo? JSON.parse(adminInfo):null,
}

const adminAuthSlice=createSlice({

    name:"adminAuth",
    initialState,
    reducers:{

        setAdminCredentials:(state,action)=>{
            state.adminInfo=action.payload
            localStorage.setItem("adminInfo",JSON.stringify(action.payload));

        },
        logoutAdmin:(state,action)=>{

            state.doctorInfo=null
            localStorage.removeItem("adminInfo")
        }
    }
})

export const{setAdminCredentials,logoutAdmin}=adminAuthSlice.actions;
export default adminAuthSlice.reducer