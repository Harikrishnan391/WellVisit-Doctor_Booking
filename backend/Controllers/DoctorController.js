import Booking from "../model/BookingSchema.js";
import Doctor from "../model/DoctorSchema.js";
import { format } from "date-fns";

export const updateDoctor = async (req, res) => {
  const id = req.params.id;
  const updateData = { ...req.body };

  try {
    const updateDoctor = await Doctor.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    res.status(200).json({
      status: true,
      message: "Successfully Updated",
    });
  } catch (error) {
    res.status(500).json({ status: false, message: "Failed to update" });
  }
};

export const deleteDoctor = async (req, res) => {
  const id = req.params.id;

  try {
    const deleteDoctor = await Doctor.findByIdAnddelete(id);

    res.status(200).json({
      success: true,
      message: "Successfully Updated",
      data: deleteDoctor,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete" });
  }
};

export const getSingleDoctor = async (req, res) => {
  const id = req.params.id;
  console.log(id);
  try {
    const doctor = await Doctor.findById(id).select("-password");

    res.status(200).json({
      success: true,
      message: "Doctor found",
      data: doctor,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "No Doctor Found" });
    console.log(error);
  }
};

export const getAllDoctor = async (req, res) => {
  try {
    const { query } = req.query;

    let doctors;

    if (query) {
      doctors = await Doctor.find({
        isApproved: "true",
        $or: [
          { name: { $regex: query, $options: "i" } },
          { specialization: { $regex: query, $options: "i" } },
        ],
      }).select("-password");
    } else {
      doctors = await Doctor.find({ isApproved: "true" }).select("-password");
    }
    res.status(200).json({
      success: true,
      message: "Doctor found",
      data: doctors,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Not found" });
  }
};

/////adding time slots //////

export const addTimeSlots = async (req, res) => {
  const docId = req.userId;

  console.log(req.body, "req.body......");
  try {
    const doctor = await Doctor.findOne({ _id: docId });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const { date, slots } = req.body.data;
    const indianDate = format(new Date(date), "dd/MM/yyyy");

    const timeSchedule = {
      uniDate: date,
      indianDate: indianDate,
      slots: slots,
    };

    const existingSlotIndex = doctor.timeSlots.findIndex((slot) => {
      return slot.indianDate === timeSchedule.indianDate;
    });

    if (existingSlotIndex !== -1) {
      console.log("exist");
      console.log(doctor.timeSlots[existingSlotIndex].slots);
      slots.forEach((slot) => {
        doctor.timeSlots[existingSlotIndex].slots.push(slot);
      });
    } else {
      if (doctor.timeSlots) {
        doctor.timeSlots.push(timeSchedule);
      } else {
        doctor.timeSlots = [timeSchedule];
      }
    }

    await doctor.save();

    return res.status(200).json({ message: "Time slotss added successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error adding time slots" });
  }
};

//// getting available Dates ////

export const getAvailableDates = async (req, res) => {
  console.log("helllo");
  const docId = req.userId;

  try {
    const doctor = await Doctor.findById(docId);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const dates = doctor.timeSlots.map((timeSlot) => timeSlot.uniDate);

    res.status(200).json({ data: dates });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAvailableSlots = async (req, res) => {
  const docId = req.userId;
  const date = req.params.date;
  const indianDate = format(new Date(date), "dd/MM/yyyy");

  try {
    const doctor = await Doctor.findById(docId);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const timeSlots = doctor.timeSlots.find(
      (slot) => slot.indianDate == indianDate
    );

    console.log(timeSlots, "timeSolotss");

    if (!timeSlots) {
      return res
        .status(404)
        .json({ message: "Time slot not found for the speci" });
    }
    const slots = timeSlots.slots;

    return res.status(200).json({ message: "Time slotes Found", data: slots });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const removeSlots = async (req, res) => {
  const docId = req.userId;
  const date = req.query.selectedDate;
  const indianDate = format(new Date(date), "dd/MM/yyyy");
  const slot = req.query.slot;
  console.log(slot, "slottt");

  try {
    const doctor = await Doctor.findById(docId);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const filter = {
      _id: docId,
      "timeSlots.indianDate": indianDate,
    };

    const update = {
      $pull: {
        "timeSlots.$.slots": slot,
      },
    };

    const result = await Doctor.updateOne(filter, update);
    await Doctor.updateOne(
      { _id: docId },
      { $pull: { timeSlots: { slots: [] } } }
    );

    if (result.nModified === 1) {
      console.log("result", result);
      return res.status(200).json({ message: "Slot removed successfully" });
    } else {
      return res.status(404).json({ message: "Slot not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error removing slot", error });
  }
};

export const getDoctorProfile = async (req, res) => {
  const doctorId = req.userId;

  try {
    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }

    const { ...rest } = doctor._doc;
    const appointments = await Booking.find({ doctor: doctorId });
    res.status(200).json({
      sucess: true,
      message: "Profile info is getting",
      data: { ...rest, appointments },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};
