import Stripe from "stripe";
const stripe = Stripe(process.env.STRIPE_KEY);
import { format } from "date-fns";
import User from "../model/UserSchema.js";

var customer = await stripe.customers.create({
  name: "Dummy Name",
  address: {
    line1: "Dummy Address",

    country: "US",
  },
});

export const makepayment = async (req, res) => {
  // const unit_amout = req.body.doctor.details.name;
  // const userId = req.body.user._id;
  // const user=  await User.findById(userId)
  // console.log(user,"user");
  // customerInfo= {
  //   name: user.name,
  //   address: {
  //       line1: user.address,
  //     },
  //  }
  // console.log("data in payment",req.body)
  const indianDate = format(new Date(req.body.date), "dd/MM/yyyy");
  try {
    const unit_amount = req.body.doctor.details.fee * 100;
    console.log(typeof unit_amount,"unit amount")
    const userId = req.body.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const indianDate = format(new Date(req.body.date), "dd/MM/yyyy");
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: `Dr.${req.body.doctor.details.name}`,
              description: `At ${req.body.slot} on ${indianDate}`,
            },

            unit_amount: req.body.doctor.details.fee * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/users/paymentSuccess?session_id{CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/users/paymentFailed`,

    });
    res.send({ url: session.url });
  } catch (error) {
    console.log(error, "error");
    res.status(500).json({ error: "Internal server error" });
  }
};
