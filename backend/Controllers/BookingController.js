import Doctor from "../model/DoctorSchema.js";
import Booking from "../model/bookingSchema.js";
import { format, parse, parseISO } from "date-fns";

export const saveBookingData = async (req, res) => {
  console.log("Booing Data", req.body);

  const date = parseISO(req.body.appointmentDate);
  const IndianDate=format(date,"dd/MM/yyyy")

  const paymentId=req.body.paymentId
  const bookingExisit=await Booking.findOne({paymentId:paymentId})

  try {
    if(bookingExisit){
        res.status(200).json({data:bookingExisit})
        return
    }

    const {
        doctor:{details:doctorDetails},
        patient,
        fee,
        appointmentDate,
        slot,
        paymentStatus="pending",
        isPaid=true,
        paymentId

    }=req.body

    const newBooking=new Booking({

        doctor:doctorDetails,
        patient,
        fee,
        appointmentDate,
        IndianDate:appointmentDate,
        slot,
        IndianDate:IndianDate.toString(),
        paymentStatus,
        isPaid,
        paymentId
    })

    const saveBooing=await  newBooking.save()

    res.status(200).json({message:"Booking saved Successfully",data:savedBooking})
  } catch (error) {
    console.log(error)
    res.status(500).json({error:"Internal Server error"})
  }
};
