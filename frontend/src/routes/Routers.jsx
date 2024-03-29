import Home from "../pages/Home";
import Services from "../pages/Services";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Contact from "../pages/Contact";
import Doctors from "../pages/Doctors/Doctors";
import MyAccount from "../Dashboard/userAccount/MyAccount";
import DoctorAccount from "../Dashboard/doctorAccount/DoctorsAccount";
import DoctorSignUp from "../pages/Doctors/DoctorSignup";
import DoctorOtp from "../pages/Doctors/DoctorOtp";
import DoctorLogin from "../pages/DoctorLogin";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import ProtectedDoctorRoute from "./ProtecterDoctorRoute";
import AdminHome from "../pages/Admin/AdminHome";
import AdminLogin from "../pages/Admin/AdminLogin";
import AdminUsers from "../pages/Admin/AdminUsers";
import AdminDoctors from "../pages/Admin/AdminDoctors";
import ProtectedAdmin from "./ProtectedAdmin";
import Bookings from "../pages/Admin/Bookings";
import UserOtpPage from "../pages/UserOtpPage";
import UserForgotPassword from "../pages/UserForgotPassword";
import UserResetPassword from "../pages/UserResetPassword";
import DoctorDetails from "../pages/Doctors/DoctorDetails";
import PaymentSuccess from "../components/PaymentSuccess/PaymentSuccess";
import PaymentFailed from "../components/PaymentFailed/PaymentFailed";
import CarouselDefault from "../pages/Admin/Bookings";
import DoctorForgotPassword from "../pages/Doctors/DoctorForgotPassword";
import DoctorResetPassword from "../pages/Doctors/DoctorResetPassword";
import VideoCallRoom from "../pages/Admin/VideoCallRoom";
import Appointments from "../pages/Doctors/Appointments";
import BookingDetails from "../pages/BookingDetails";
import DoctorVideoCallRoom from "../pages/Doctors/DoctorVideoCallRoom";
import UserVideoCallRoom from "../pages/UserVideoCallRoom";
import DoctorChat from "../pages/Doctors/DoctorChat";
import ErrorPage from "../components/404/ErrorPage"

const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/users/home"
        element={
          <ProtectedRoute allowedRoles={["patient"]}>
            <Home />
          </ProtectedRoute>
        }
      />
      {/* <Route path="/users/home" element={<Home />} /> */}
      <Route
        path="/users/doctors"
        element={
          <ProtectedRoute allowedRoles={["patient"]}>
            <Doctors />
          </ProtectedRoute>
        }
      />
      <Route path="/doctors/:id" element={<DoctorDetails />} />
      <Route path="users/login" element={<Login />} />
      <Route path="/register" element={<Signup />} />
      <Route path="/contact" element={<Contact />} />
      <Route
        path="/services"
        element={
          <ProtectedRoute allowedRoles={["patient"]}>
            {" "}
            <Services />
          </ProtectedRoute>
        }
      />
      <Route
        path="/userProfile"
        element={
          // <ProtectedRoute allowedRoles={["patient"]}>
          <MyAccount />
          // </ProtectedRoute>
        }
      />
      <Route path="/users/doctorDetails/:id" element={<DoctorDetails />} />
      <Route path="/verify-otp" element={<UserOtpPage />} />
      <Route path="/forgot-password" element={<UserForgotPassword />} />
      <Route path="/reset-password" element={<UserResetPassword />} />
      <Route path="/users/paymentSuccess" element={<PaymentSuccess />} />
      <Route path="/users/paymentFailed" element={<PaymentFailed />} />
      <Route path="/users/BookingDetails/:id" element={<BookingDetails />} />
      <Route path="/users/room/:roomId" element={<ProtectedRoute allowedRoles={["patient"]}><UserVideoCallRoom /></ProtectedRoute>} />

      {/*============================Doctor Routes=========================================*/}
      <Route path="/doctors/doctorSignup" element={<DoctorSignUp />} />
      <Route path="doctors/doctorOtp" element={<DoctorOtp />} />
      <Route path="doctors/login" element={<DoctorLogin />} />
      <Route
        path="doctors/forgot-password"
        element={<DoctorForgotPassword />}
      />
      <Route path="doctors/reset-password" element={<DoctorResetPassword />} />
      <Route
        path="doctors/home"
        element={
          <ProtectedDoctorRoute allowedRoles={["doctor"]}>
            <Home />
          </ProtectedDoctorRoute>
        }
      />
      <Route
        path="/doctors/appointments"
        element={
          <ProtectedDoctorRoute allowedRoles={["doctor"]}>
            <Appointments />
          </ProtectedDoctorRoute>
        }
      />
      <Route
        path="/doctors/doctorProfile"
        element={
          <ProtectedDoctorRoute allowedRoles={["doctor"]}>
            <DoctorAccount />
          </ProtectedDoctorRoute>
        }
      />
      <Route path="/doctors/room/:roomId" element={<ProtectedDoctorRoute allowedRoles={["doctor"]}><DoctorVideoCallRoom /></ProtectedDoctorRoute>} />
      <Route
        path="/doctors/chats"
        element={
          <ProtectedDoctorRoute allowedRoles={["doctor"]}>
            <DoctorChat />
          </ProtectedDoctorRoute>
        }
      />
      {/*============================Admin Routes=========================================*/}
      <Route
        path="/admin/home"
        element={
          <ProtectedAdmin allowedTypes={["admin"]}>
            <AdminHome />
          </ProtectedAdmin>
        }
      />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin/users"
        element={
          <ProtectedAdmin allowedTypes={["admin"]}>
            <AdminUsers />
          </ProtectedAdmin>
        }
      />
      <Route
        path="/admin/doctors"
        element={
          <ProtectedAdmin allowedTypes={["admin"]}>
            <AdminDoctors />
          </ProtectedAdmin>
        }
      />
      <Route path="/admin/bookings" element={<CarouselDefault />} />
      <Route path="/admin/room/:roomId" element={<VideoCallRoom />} />
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
};

export default Routers;
