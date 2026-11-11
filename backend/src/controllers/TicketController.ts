import type { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError.js";
import { RequestHelper } from "../helpers/RequestHelper.js";
import { TICKET_STATUSES, type TicketStatus } from "../models/Ticket.js";
import type { TicketService } from "../services/TicketService.js";

export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tickets = await this.ticketService.list();
      res.json(tickets);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = RequestHelper.getUserId(req);
      const ticket = await this.ticketService.getById(RequestHelper.requireObjectId(req.params.id), userId);
      res.json(ticket);
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = req.body as { title?: unknown; description?: unknown };
      const title = RequestHelper.requireString(body.title, "título");
      const description = RequestHelper.requireString(body.description, "descripción");
      const ticket = await this.ticketService.create({ title, description });
      res.status(201).json(ticket);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = req.body as { title?: unknown; description?: unknown };
      const title = RequestHelper.requireString(body.title, "título");
      const description = RequestHelper.requireString(body.description, "descripción");
      const ticket = await this.ticketService.update(RequestHelper.requireObjectId(req.params.id), { title, description });
      res.json(ticket);
    } catch (error) {
      next(error);
    }
  };

  changeStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = RequestHelper.getUserId(req);
      const status = (req.body as { status?: unknown }).status;
      if (typeof status !== "string" || !TICKET_STATUSES.includes(status as TicketStatus)) {
        throw AppError.BadRequest("Estado inválido");
      }
      const ticket = await this.ticketService.changeStatus(RequestHelper.requireObjectId(req.params.id), userId, status as TicketStatus);
      res.json(ticket);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.ticketService.delete(RequestHelper.requireObjectId(req.params.id));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
