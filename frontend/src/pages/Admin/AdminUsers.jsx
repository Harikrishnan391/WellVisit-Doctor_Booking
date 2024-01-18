import React, { useEffect, useState } from "react";
// import AdminFetchData from "../../hooks/AdminFetchData"
import userFetchData from "../../hooks/userFetchData";
import { BASE_URL, adminToken } from "../../config";
import { BiTrophy } from "react-icons/bi";
import Swal from "sweetalert2";
import Pagination from "../../components/pagination/Pagination"
import { useNavigate } from "react-router-dom";

const AdminUsers = () => {
  
  const [users, setUsers] = useState([]);
  const { data, error, loading, refetch } = userFetchData(
    `${BASE_URL}/admin/getAllUser`
  );

  const navigate=useNavigate()

  useEffect(() => {
    if (error) {
      console.log(error);
    } else if (!error && !loading) {
      setUsers(data);
      checkBlockedStatus(data)
    }
  }, [error, loading, data]);

  const checkBlockedStatus=(users)=>{

    users.forEach((user)=>{
      if(user.isBlocked){
        handleLogout()
      }
    })
  }

  const handleLogout=()=>{

    localStorage.removeItem("PatientInfo")

  }

  const handleBlock = async (userId) => {
    const confirmResult = await Swal.fire({
      title: "Are you Sure",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      confirmButtonText: "yes ,do it",
      cancelButtonText: "Cancel it",
    });

    if (confirmResult.isConfirmed) {
      try {
        const res = await fetch(`${BASE_URL}/admin/blockUser/${userId}`, {
          method: "post",
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        });

        let result = await res.json();
        console.log(result);

        if (!res.ok) {
          throw new Error(result.message);
        }

        Swal.fire({
          title: "Done!",
          text: "You changed the patient status",
          icon: "success",
        });
        refetch();
      } catch (error) {
        console.log(error);

        Swal.fire({
          title: "Error!",
          text: "An error occured while changing the status",
          icon: "error",
        });
      }
    }
  };

  return (
    <section className="container">
      <div className="relative mx-5 overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-[#81D4FA]">
            <tr>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Email
              </th>
              <th scope="col" className="px-6 py-3">
                Blood Group
              </th>
              <th scope="col" className="px-6 py-3">
                Options
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr className="bg-white border-b hover:bg-[#e8e8ff]" key={index}>
                <td className="px-6 py-4">{user.name}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">{user.bloodType}</td>
                <td className="px-6 py-4">
                  {user.isBlocked ? (
                    <button
                      onClick={()=>handleBlock(user._id)}
                      className="px-4 py-2 font-semibold text-white bg-green-500 border border-yellow-500 rounded hover:bg-yellow-500 hover:border-transparent"
                    >
                      unBlock
                    </button>
                  ) : (
                    <button
                      onClick={()=>handleBlock(user._id)}
                      className="px-4 ml-1 py-2 font-semibold text-white bg-red-500 border border-red-500 rounded hover:bg-red-500 hover:border-transparent"
                    >
                      Block
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AdminUsers;
