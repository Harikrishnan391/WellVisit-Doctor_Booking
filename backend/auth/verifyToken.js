import jwt from "jsonwebtoken";
import Doctor from "../model/DoctorSchema.js";
import User from "../model/UserSchema.js";

export const authenticate = async (req, res, next) => {
  try {
    const authToken = req.headers.authorization;
    
    if (!authToken) {
      return res.status(401).json({ message: "Token not provided" });
    }

    const token = authToken.split(" ")[1];
    const decoded = jwt.verify(token, process.env.PATIENT_JWT_SECRET_KEY);

    if (decoded.role !== "user") {
      return res.status(403).json({ message: "Not authorized" });
    }

    req.userId = decoded.userId;
    req.role = decoded.role;
    next();

  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token is expired" });
    }
    return res.status(401).json({ success: false, message: "Invalid Token" });
  }
};

export const restrict = (role) => async (req, res, next) => {
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

  if (!role.includes(user.role)) {
    return res
      .status(401)
      .json({ success: false, message: "You are not authorized" });
  }

  next();
};
