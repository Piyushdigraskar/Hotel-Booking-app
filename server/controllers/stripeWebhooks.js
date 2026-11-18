import stripe from "stripe";
import Booking from "../models/Booking.js";
//api to handle stripe webhooks

export const stripeWebhooks = async (req, res) => {
  //stripe gateway initialixe
  const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

  const sig = req.headers("stripe-signature");
  let event;
  try {
    event = stripeInstance.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    res.status(400).send(`Webhook error: ${err.message}`);
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    const paymentIntentId = paymentIntent.id;

    const session = await stripeInstance.checkout.sessions.list({
      payment_intent: paymentIntentId,
    });

    const { bookingId } = session.data[0].metadata;

    //mark payment as paid
    await Booking.findByIdAndUpdate(bookingId, {
      isPaid: true,
      paymentMethod: "stripe",
    });
  } else {
    console.log("Unhandled event type :", event.type);
  }
  res.json({ received: true });
};
