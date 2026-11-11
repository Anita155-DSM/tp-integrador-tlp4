import type { Request, Response, NextFunction } from "express";
import { RequestHelper } from "../helpers/RequestHelper.js";
import type { SubscriptionService } from "../services/SubscriptionService.js";
import type { TicketService } from "../services/TicketService.js";

export class SubscriptionController {
  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly ticketService: TicketService
  ) {}

  subscribe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = RequestHelper.getUserId(req);
      const rawTicketId = RequestHelper.requireString((req.body as { ticketId?: unknown }).ticketId, "ticketId");
      const ticketId = RequestHelper.requireObjectId(rawTicketId, "ticketId inválido");
      await this.subscriptionService.subscribe(userId, ticketId);
      const ticket = await this.ticketService.getById(ticketId, userId);
      res.json(ticket);
    } catch (error) {
      next(error);
    }
  };

  unsubscribe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = RequestHelper.getUserId(req);
      const ticketId = RequestHelper.requireObjectId(req.params.ticketId, "ticketId inválido");
      await this.subscriptionService.unsubscribe(userId, ticketId);
      const ticket = await this.ticketService.getById(ticketId, userId);
      res.json(ticket);
    } catch (error) {
      next(error);
    }
  };
}
