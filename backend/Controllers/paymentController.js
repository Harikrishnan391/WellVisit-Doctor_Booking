import Stripe from "stripe";
const stripe = Stripe(process.env.STRIPE_KEY);
import { format } from "date-fns";
var customerInfo = await stripe.customers.create();


export const makepayment = async (req, res) => {
    
  const unit_amout = req.body.doctor.details.name;
  const user = req.body.user;
  console.log(user);
  customerInfo= {
    name: user.name,
    address: {
        line1: req.body.role,
      },
  }

  console.log(customerInfo,"info of customer");

  // console.log("data in payment",req.body)
  const indianDate = format(new Date(req.body.date), "dd/MM/yyyy");
  try {
    const session = await stripe.checkout.sessions.create({
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
      customer:customerInfo
   
    });
    res.send({ url: session.url });
  } catch (error) {
    console.log(error, "error");
  }
};
