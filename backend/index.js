import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import authRoute from "./Routes/auth.js";
import userRoute from "./Routes/user.js";
import DoctorRoute from "./Routes/doctors.js";
import reviewRoute from "./Routes/review.js";
import adminRoute from "./Routes/admin.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { Server } from "socket.io";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const port = process.env.PORT || 8000;

app.use(express.static(path.join(__dirname, "public")));

const corsOptions = {
  origin: true,
  credentials: true,
};

//configuring middlewares
const currentWorkingDir = path.resolve();
const parentDir = path.dirname(currentWorkingDir);
const dum = path.join(parentDir, "/frontend/dist");

//database connection
mongoose.set("strictQuery", false);

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) {
      return;
    }
    await mongoose.connect(process.env.MONGO_URL, {});

    console.log("Mongodb data base connected");
  } catch (error) {
    console.log("mongodb databse is connection failed", error);
  }
};

connectDB();

app.use(cors(corsOptions));
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/doctors", DoctorRoute);
app.use("/api/reviews", reviewRoute);
app.use("/api/admin", adminRoute);

if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  const frontendDistPath = path.join(__dirname, "frontend", "dist");
  console.log(frontendDistPath, "frontend dist path");
  app.use(express.static(frontendDistPath));
  // app.use(express.static(path.join(parentDir, "/frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(frontendDistPath, "index.html"));
    // res.sendFile(path.resolve(frontendDistPath, "frontend", "", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running...");
  });
}

const server = app.listen(port, () => {
  try {
    console.log("Server is running on port", port);
  } catch (error) {
    console.log(error);
  }
});

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    // origin: "https://www.wellvisit.online, https://wellvisit.online",
    // origin: "http://localhost:5173",
    origin: "https://wellvisit-doctor-booking.onrender.com",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("connected with socket io", socket.id);

  socket.on("setup", (user) => {
    socket.join(user);
    console.log(user, "userId");
    socket.emit("connected");
  });

  socket.on("join_chat", (room) => {
    socket.join(room);
    console.log("user joined in the room", room);
  });

  socket.on("new Message", (newMessageRecived) => {
    console.log("newMessageRecevied", newMessageRecived);

    var chat = newMessageRecived.room;

    if (!chat.user || !chat.doctor) {
      return console.log("chat.users  not defined  ");
    }

    socket.in(chat._id).emit("message received", newMessageRecived);

    if (chat.user._id === newMessageRecived.sender._id) {
      socket.to(chat._id).emit("message recevied", newMessageRecived);
    }

    if (chat.doctor._id === newMessageRecived.sender._id) {
      socket.to(chat._id).emit("message recevied", newMessageRecived);
    }
  });

  socket.off("setup", () => {
    console.log("User Disconnected");
    socket.leave(user);
  });
});
