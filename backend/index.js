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

app.get("/", (req, res) => {
  res.send("its working");
});

//database connection
mongoose.set("strictQuery", false);
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {});

    console.log("Mongodb data base connected");
  } catch (error) {
    console.log("mongodb databse is connection failed", error);
  }
};

app.use(cors(corsOptions));
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/doctors", DoctorRoute);
app.use("/api/v1/reviews", reviewRoute);
app.use("/api/v1/admin", adminRoute);

const server = app.listen(port, () => {
  try {
    connectDB();
    console.log("Server is running on port", port);
  } catch (error) {
    console.log(error);
  }
});

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:5173",

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
