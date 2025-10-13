import prisma from "../config/db.js";

export const trackShipment = async (req, res) => {
  try {
    const { trackingCode } = req.params;

    const shipment = await prisma.shipment.findFirst({
      where: { trackingCode },
      include: {
        flight: {
          select: { from: true, to: true, departureDate: true, status: true },
        },
        sender: {
          select: { fullName: true, phone: true },
        },
        carrier: {
          select: { fullName: true, phone: true },
        },
      },
    });

    if (!shipment) {
      return res.status(404).json({ message: "Shipment not found" });
    }

    res.status(200).json(shipment);
  } catch (error) {
    console.error("Error tracking shipment:", error);
    res.status(500).json({ message: "Failed to track shipment" });
  }
};
export const confirmDelivery = async (req, res) => {
  try {
    const { trackingCode } = req.params;

    const shipment = await prisma.shipment.findUnique({
      where: { trackingCode },
      include: { carrier: true },
    });

    if (!shipment) {
      return res.status(404).json({ message: "Shipment not found" });
    }

    if (shipment.status === "DELIVERED") {
      return res.status(400).json({ message: "Shipment already confirmed" });
    }
    const updatedShipment = await prisma.shipment.update({
  where: { id: shipment.id },
  data: { status: "DELIVERED" },
});

const platformFeeRate = 0.1;
const shipmentFee = shipment.fee ?? 0;
const platformFee = shipmentFee * platformFeeRate;
const amountToRelease = shipmentFee - platformFee;

if (amountToRelease > 0 && shipment.carrierId) {
  await prisma.user.update({
    where: { id: shipment.carrierId },
    data: { balance: { increment: amountToRelease } },
  });
}

const reference = `SHIP-${shipment.trackingCode}-${Date.now()}`;

await prisma.payment.create({
  data: {
    shipmentId: shipment.id,
    reference,
    amount: shipmentFee,
    platformFee,
    status: "released",
    releasedAt: new Date(),
  },
});

    res.status(200).json({
      message: "Delivery confirmed. Payment released to carrier minus platform fee.",
      shipment: updatedShipment,
      amountReleased: amountToRelease,
      platformFee,
    });
  } catch (err) {
    console.error("Error confirming delivery:", err);
    res.status(500).json({ message: "Failed to confirm delivery" });
  }
};
