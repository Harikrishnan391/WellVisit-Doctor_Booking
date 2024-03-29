import Admin from "../model/adminSchema.js";
import generateAdminToken from "../jwt/admin/adminjwt.js";
import User from "../model/UserSchema.js";
import Doctor from "../model/DoctorSchema.js";
import Booking from "../model/bookingSchema.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({ message: "Invalid admin" });
    } else {
      const isPasswordMatch = admin.password === password;

      if (!isPasswordMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      const { name } = admin._doc;

      const token = generateAdminToken(admin._id, res);

      return res.status(200).json({
        status: true,
        message: "Login Successfull!!",
        token,
        data: { email, name, type: "admin" },
      });
    }
  } catch (error) {
    console.log(error);

    return res.status(500).json({ status: false, message: "failed to login" });
  }
};

export const getAllUser = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");

    res.status(200).json({
      success: true,
      message: "User found",
      data: users,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Not found" });
  }
};

export const BlockUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "user Not Found" });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.status(200).json({
      status: true,
      message: `user is ${user.isBlocked ? "Blocked" : "unblock"}`,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getAllDoctor = async (req, res) => {
  try {
    const doctors = await Doctor.find({}).select("-password");
    res.status(200).json({
      success: true,
      message: "User found",
      data: doctors,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Not found" });
  }
};

export const approveCertificate = async (req, res) => {
  const docId = req.params.id;
  const status = req.query.status;

  try {
    const changeStatus = await Doctor.findByIdAndUpdate(
      docId,
      { $set: { certificateApprove: status } },
      { new: true }
    );

    if (!changeStatus) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json({ status: true, message: "Doctor status changed" });
  } catch (error) {
    res.status(500).json({ status: false, message: "Change status failed" });
  }
};

export const approveVideoCall = async (req, res) => {
  const docId = req.params.id;
  const status = req.query.status;
  try {
    const changeStatus = await Doctor.findByIdAndUpdate(
      docId,
      { $set: { VideoCallApprove: status } },
      { new: true }
    );

    if (!changeStatus) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    const doctor = await Doctor.findOne();
    res.status(200).json({ status: true, message: "Doctor status changed" });
  } catch (error) {
    res.status(500).json({ status: false, message: "Change status failed " });
  }
};

export const HandleApprove = async (req, res) => {
  try {
    const docId = req.params.id;

    const doctor = await Doctor.findById(docId);

    if (!doctor) {
      res.status(404).json({ status: false, message: "Doctor Not found" });
    }

    doctor.isApproved = !doctor.isApproved;

    const updateDoc = await Doctor.updateOne(
      { _id: docId },
      { $set: { isApproved: doctor.isApproved } }
    );

    res.status(200).json({
      status: true,
      message: `Doctor is ${doctor.isApproved ? "Approved" : "Rejected"}`,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: "Something went wrong" });
  }
};

export const HandleBlock = async (req, res) => {
  try {
    const doctorId = req.params.id;

    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      res.status(404).json({ status: false, message: "No doctors found" });
    }

    doctor.isBlocked = !doctor.isBlocked;

    const updateDoctorBlock = await Doctor.updateOne(
      { _id: doctorId },
      { $set: { isBlocked: doctor.isBlocked } }
    );

    res.status(200).json({
      status: true,
      message: `Doctor is ${doctor.isBlocked ? "Blocked" : "unblocked"}`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: "Something went wrong" });
  }
};

//// getting Monthly Data

export const getMonthlyBooking = async (req, res) => {
  try {
    const montlyData = await Booking.aggregate([
      {
        $group: {
          _id: { $month: { $toDate: "$createdAt" } },
          totalBookings: { $sum: 1 },
          totalAmount: { $sum: "$fee" },
        },
      },
    ]);

    res.status(200).json({ data: montlyData });
  } catch (error) {
    res.status(404).json({ message: "Data not found" });
  }
};

//// getting yearly Data   /////

export const YearlyBooking = async (req, res) => {
  try {
    const yearlyData = await Booking.aggregate([
      {
        $project: {
          year: {
            $year: {
              $dateFromString: {
                dateString: "$IndianDate",
                format: "%d/%m/%Y",
              },
            },
          },

          fee: 1,
        },
      },
      {
        $group: {
          _id: "$year",
          totalBookings: { $sum: 1 },
          totalAmount: { $sum: "$fee" },
        },
      },
    ]);

    res.status(200).json({ data: yearlyData });
  } catch (error) {
    res.status(404).json({ message: "Data not found" });
  }
};

///// getting the user Data

export const getBooking = async (req, res) => {
  try {
    const bookings = await Booking.find(
      {},
      {
        "patient.name": 1,
        "doctor.name": 1,
        paymentStatus: 1,
        IndianDate: 1,
        slot: 1,
        isCancelled: 1,
      }
    );

    if (bookings.length === 0) {
      throw new Error(" Not have any Bookings");
    }

    res
      .status(200)
      .json({ status: true, message: "getting the users", data: bookings });
  } catch (error) {
    console.log(error, "error");
    res
      .status(404)
      .json({ status: false, message: "Unable to retrieve doctors" });
  }
};

////Cancel Booking ////////

export const cancelBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const cancel = await Booking.findByIdAndUpdate(
      bookingId,
      { $set: { isCancelled: true } },
      { new: true }
    );

    if (!cancel) {
      return res.status(404).json({ message: "Booking not found" });
    } else {
      res
        .status(200)
        .json({ status: true, message: "Booking cancelled successfullly" });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: false, message: "Booking cancellation failed" });
  }
};
