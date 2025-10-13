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
