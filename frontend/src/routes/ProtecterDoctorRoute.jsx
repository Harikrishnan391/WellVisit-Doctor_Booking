import { Navigate } from "react-router-dom";

const ProtectedDoctorRoute=({children,allowedRoles})=>{

    const user=JSON.parse(localStorage.getItem('doctorInfo'))

    if(user){

        const role=user.role
        const token=user.token

        const isAllowed=allowedRoles.includes(role)
    

        const accessibleRoute=token && isAllowed?children:<Navigate to="/doctors/login" replace={true}/>

        return accessibleRoute

    }else{

        return <Navigate to="/doctors/login" replace={true}/>
    }
}

export default ProtectedDoctorRoute