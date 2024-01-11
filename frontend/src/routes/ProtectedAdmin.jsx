import { Navigate } from "react-router-dom";

const ProtectedAdmin=({children,allowedTypes})=>{

    const user=JSON.parse(localStorage.getItem('adminInfo'))
  
    
    if(user){
        const type=user.data.type
        const token=user.token
        console.log(token);

    // eslint-disable-next-line react/prop-types
    const isAllowed = allowedTypes.includes(type);

        const accessibleRoute=

        token && isAllowed ?children:<Navigate to="/admin/login" replace={true}/>

        return accessibleRoute

    }
    else{
         
        return <Navigate to="/admin/login" replace={true}/>
    }
}

export default ProtectedAdmin