import type { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError.js";
import type { SubscriptionService } from "../services/SubscriptionService.js";
import type { TicketService } from "../services/TicketService.js";

export class SubscriptionController {
  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly ticketService: TicketService
  ) {}

  subscribe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = this.getUserId(req);
      const ticketId = this.requireString((req.body as { ticketId?: unknown }).ticketId, "ticketId");
      await this.subscriptionService.subscribe(userId, ticketId);
      const ticket = await this.ticketService.getById(ticketId, userId);
      res.json(ticket);
    } catch (error) {
      next(error);
    }
  };

  unsubscribe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = this.getUserId(req);
      const ticketId = this.requireString(req.params.ticketId, "ticketId");
      await this.subscriptionService.unsubscribe(userId, ticketId);
      const ticket = await this.ticketService.getById(ticketId, userId);
      res.json(ticket);
    } catch (error) {
      next(error);
    }
  };

  private getUserId(req: Request): string {
    const user = req.user;
    if (user === undefined) {
      throw AppError.Unauthorized();
    }
    return user.id;
  }

  private requireString(value: unknown, field: string): string {
    if (typeof value !== "string" || value.trim() === "") {
      throw AppError.BadRequest(`El campo ${field} es obligatorio`);
    }
    return value;
  }
}