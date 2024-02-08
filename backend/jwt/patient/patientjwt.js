import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const generatePatientToken = (userId, res) => {
  const token = jwt.sign({ userId ,role:"user"}, process.env.PATIENT_JWT_SECRET_KEY, {
    expiresIn: "30d",
  });

  res.cookie("jwtpatient", token, {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 1000,
  });

  return token;
};

export default generatePatientToken;
