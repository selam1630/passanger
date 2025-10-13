import fetch from "node-fetch";
import prisma from "../config/db.js";
export const initializePayment = async (req, res) => {
  try {
    const { shipmentId, amount, currency, customerEmail, customerName } = req.body;
    if (!shipmentId || !amount || !customerEmail || !customerName) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const response = await fetch(process.env.CHAPA_BASE_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount,
        currency,
        email: customerEmail,
        first_name: customerName,
        callback_url: "https://yourfrontend.com/payment/callback", 
        reference: `shipment_${shipmentId}`,
      }),
    });
    const data = await response.json();

    if (!data.status || data.status !== "success") {
      return res.status(400).json({ message: "Failed to initialize payment", data });
    }
    const payment = await prisma.payment.create({
      data: {
        shipmentId,
        reference: data.data.reference,
        amount,
        status: "pending",
      },
    });

    res.status(200).json({
      message: "Payment initialized",
      checkoutUrl: data.data.checkout_url,
      payment,
    });
  } catch (err) {
    console.error("Payment initialization error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
export const releasePayment = async (req, res) => {
  try {
    const { shipmentId } = req.body;
    const payment = await prisma.payment.findFirst({
      where: { shipmentId },
    });

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    const updatedPayment = await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: "released",
        releasedAt: new Date(),
      },
    });
    res.status(200).json({
      message: "Payment released to carrier (simulated in test mode)",
      payment: updatedPayment,
    });
  } catch (err) {
    console.error("Payment release error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
