import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@/modules/prisma/prisma.service";
import type { Request } from "express";
import type { CUShipmentDto, RDShipmentDto } from "@/common/dto/shipping.dto";

@Injectable()
export class ShipmentService {
  constructor(private readonly prisma: PrismaService) {}

  async createShipment(orderId: string, rateId: string) {
    // Here, rateId corresponds to one of the IDs fetched in getRates
    // In production, it should be verified with your real carrier API

    // TODO: Verify rateId with real API
    const fakeRate = {
      provider: rateId.includes("tcs") ? "TCS" : "Leopard Courier",
      service: rateId.includes("express") ? "Express" : "Standard",
      cost: rateId.includes("express") ? 600 : 350,
      currency: "PKR",
    };

    const shipment = await this.prisma.shipment.create({
      data: {
        orderId,
        provider: fakeRate.provider,
        service: fakeRate.service,
        method: "standard",
        rateId: rateId,
        trackingNumber: "",
        trackingUrl: "",
        labelUrl: "",
        metadata: {
          cost: fakeRate.cost,
          currency: fakeRate.currency,
        },
      },
    });

    // Log audit entry
    await this.prisma.auditLog.create({
      data: {
        entityType: "Shipment",
        entityId: shipment.id,
        action: "shipmentCreated",
        metadata: { orderId, rateId: rateId },
      },
    });

    return { message: "Shipment created successfully", data: { shipment } };
  }

  async updateShipment(dto: CUShipmentDto, shipmentId: string) {
    const updated = await this.prisma.shipment.update({
      where: { id: shipmentId },
      data: dto,
    });

    await this.prisma.auditLog.create({
      data: {
        entityType: "Shipment",
        entityId: shipmentId,
        action: "shipmentUpdated",
        metadata: {},
      },
    });

    return { message: "Shipment updated successfully", data: { updated } };
  }

  async getUserShipments(req: Request) {
    const userId = req.user!.id;

    const shipments = await this.prisma.shipment.findMany({
      where: {
        order: { userId },
      },
      include: {
        order: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return { message: "Shipments fetched successfully", data: { shipments } };
  }

  async getAllShipments() {
    const shipments = await this.prisma.shipment.findMany({
      include: {
        order: { select: { id: true, userId: true, status: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return {
      message: "All shipments fetched successfully",
      data: { shipments },
    };
  }

  async getShipment(dto: RDShipmentDto) {
    const shipment = await this.prisma.shipment.findUnique({
      where: { id: dto.shipmentId },
      include: { order: true },
    });

    if (!shipment) throw new NotFoundException("Shipment not found");

    return { message: "Shipment fetched successfully", data: { shipment } };
  }

  async deleteShipment(dto: RDShipmentDto) {
    const shipment = await this.prisma.shipment.delete({
      where: { id: dto.shipmentId },
    });

    await this.prisma.auditLog.create({
      data: {
        entityType: "Shipment",
        entityId: dto.shipmentId,
        action: "shipmentCancelled",
      },
    });

    return { message: "Shipment deleted successfully", data: { shipment } };
  }

  async syncTracking(dto: RDShipmentDto) {
    const shipment = await this.prisma.shipment.findUnique({
      where: { id: dto.shipmentId },
    });

    if (!shipment) throw new NotFoundException("Shipment not found");

    // TODO: Integrate with real tracking API (TCS / Shippo / etc.)
    // Mocking a status update for now
    const mockTracking = {
      status: "inTransit",
      trackingNumber: shipment.trackingNumber || "TCS123456789PK",
      trackingUrl:
        shipment.trackingUrl ||
        `https://track.tcs.com/${shipment.trackingNumber || "TCS123456789PK"}`,
      lastUpdated: new Date(),
    };

    const updated = await this.prisma.shipment.update({
      where: { id: dto.shipmentId },
      data: {
        status: "inTransit",
        trackingNumber: mockTracking.trackingNumber,
        trackingUrl: mockTracking.trackingUrl,
      },
    });

    return { message: "Shipment tracking synced", data: { updated } };
  }
}
