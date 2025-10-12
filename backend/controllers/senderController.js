import prisma from "../config/db.js";
export const getAvailableFlights = async (req, res) => {
  try {
    const flights = await prisma.flight.findMany({
      where: {
        availableKg: {
          gt: 0,
        },
        status: "on-time",
      },
      include: {
        carrier: {
          select: {
            fullName: true,
            phone: true,
          },
        },
      },
      orderBy: {
        departureDate: "asc",
      },
    });

    res.status(200).json(flights);
  } catch (error) {
    console.error("Error fetching flights for sender:", error);
    res.status(500).json({ message: "Failed to fetch flights" });
  }
};
export const createShipment = async (req, res) => {
  try {
    const { flightId, itemWeight, acceptorName, acceptorPhone, acceptorNationalID } = req.body;
    const senderId = req.user.id; 
    if (!flightId || !itemWeight || !acceptorName || !acceptorPhone || !acceptorNationalID) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const flight = await prisma.flight.findUnique({ where: { id: flightId } });
    if (!flight) {
      return res.status(404).json({ message: "Flight not found" });
    }
    if (itemWeight > flight.availableKg) {
      return res.status(400).json({ message: "Item weight exceeds available flight capacity" });
    }
    await prisma.flight.update({
      where: { id: flightId },
      data: { availableKg: flight.availableKg - itemWeight },
    });
    const shipment = await prisma.shipment.create({
      data: {
        senderId,
        carrierId: flight.carrierId,
        flightId,
        acceptorName,
        acceptorPhone,
        acceptorNationalID,
        itemWeight: parseFloat(itemWeight),
        acceptorVerified: false,
      },
    });

    res.status(201).json({ message: "Shipment request created successfully", shipment });
  } catch (error) {
    console.error("Error creating shipment:", error);
    res.status(500).json({ message: "Failed to create shipment" });
  }
};
