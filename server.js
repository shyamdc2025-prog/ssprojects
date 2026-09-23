require("dotenv").config();
const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname)));

const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, PORT = 3000 } = process.env;

if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
  console.warn("Razorpay keys are not configured. Copy .env.example to .env and add your TEST keys.");
}

const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET
});

const MINIMUM_ORDER = 19900; // ₹199 in paise

function calculateAmount(items) {
  if (!Array.isArray(items) || items.length === 0) throw new Error("Cart is empty");

  const subtotal = items.reduce((sum, item) => {
    const price = Number(item.price);
    const qty = Number(item.qty);
    if (!Number.isFinite(price) || !Number.isFinite(qty) || price <= 0 || qty < 1 || qty > 99) {
      throw new Error("Invalid cart item");
    }
    return sum + Math.round(price * 100) * qty;
  }, 0);

  if (subtotal < MINIMUM_ORDER) throw new Error("Minimum order value is ₹199");

  const delivery = subtotal >= 49900 ? 0 : 3500;
  const tax = Math.round(subtotal * 0.05);
  return subtotal + delivery + tax;
}

app.post("/api/create-order", async (req, res) => {
  try {
    const amount = calculateAmount(req.body.items);
    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: "EMT-" + Date.now(),
      notes: { app: "EmmyTasty" }
    });
    res.json({
      keyId: RAZORPAY_KEY_ID,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message || "Unable to create order" });
  }
});

app.post("/api/verify-payment", (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ verified: false, error: "Incomplete payment response" });
    }

    const expected = crypto
      .createHmac("sha256", RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    const verified = crypto.timingSafeEqual(
      Buffer.from(expected),
      Buffer.from(razorpay_signature)
    );

    if (!verified) {
      return res.status(400).json({ verified: false, error: "Invalid payment signature" });
    }

    res.json({ verified: true, paymentId: razorpay_payment_id, orderId: razorpay_order_id });
  } catch (err) {
    console.error(err);
    res.status(400).json({ verified: false, error: "Payment verification failed" });
  }
});

app.listen(PORT, () => {
  console.log(`EmmyTasty running at http://localhost:${PORT}`);
});
