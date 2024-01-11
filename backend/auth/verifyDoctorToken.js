import jwt from "jsonwebtoken";
import Doctor from "../model/DoctorSchema.js";
import User from "../model/UserSchema.js";

export const authenticateDoctor = async (req, res, next) => {
  const authToken = req.headers.authorization;

  if (!authToken || !authToken.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ success: false, message: "No Token,authorization denied" });
  }

  try {
    const token = authToken.split(" ")[1];

    const decoded = jwt.verify(token, process.env.DOCTOR_JWT_SECRET_KEY);

    req.userId = decoded.userId;
    req.role = decoded.role;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token is expired" });
    }
    console.log(err);
    return res.status(401).json({ success: false, message: "Invalid Token" });
  }
};

export const restrict = (role) => async (req, res, next) => {
  // console.log("typeeeeeeeee",type);

  const userId = req.userId;
  let user;

  const patient = await User.findById(userId);
  const doctor = await Doctor.findById(userId);

  if (patient) {
    user = patient;
  }
  if (doctor) {
    user = doctor;
  }

  // console.log("userrrrr",user);

  if (!role.includes(user.role)) {
    return res
      .status(401)
      .json({ success: false, message: "You are not authorized" });
  }

  next();
};
