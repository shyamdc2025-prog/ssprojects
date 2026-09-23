# EmmyTasty — Razorpay Checkout

This version uses Razorpay Standard Checkout with a small Node.js/Express backend.

## Setup

1. Install Node.js 18+.
2. Copy `.env.example` to `.env`.
3. Put your Razorpay **TEST** Key ID and Key Secret in `.env`.
4. Run:
   `npm install`
   `npm start`
5. Open:
   `http://localhost:3000`

## Important security points

- The Razorpay Key Secret stays on the server and is never placed in browser JavaScript.
- The backend creates the Razorpay Order.
- The frontend receives only the public Key ID and Order ID.
- The backend verifies the Razorpay payment signature before confirming the order.
- Test Mode should be used before switching to Live Mode.

For production, also persist orders/payments in a database and implement Razorpay webhooks with signature validation and idempotency.
