import type { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError.js";
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
      const userId = this.getUserId(req);
      const ticket = await this.ticketService.getById(this.getId(req), userId);
      res.json(ticket);
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = req.body as { title?: unknown; description?: unknown };
      const title = this.requireString(body.title, "título");
      const description = this.requireString(body.description, "descripción");
      const ticket = await this.ticketService.create({ title, description });
      res.status(201).json(ticket);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = req.body as { title?: unknown; description?: unknown };
      const title = this.requireString(body.title, "título");
      const description = this.requireString(body.description, "descripción");
      const ticket = await this.ticketService.update(this.getId(req), { title, description });
      res.json(ticket);
    } catch (error) {
      next(error);
    }
  };

  changeStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = this.getUserId(req);
      const status = (req.body as { status?: unknown }).status;
      if (typeof status !== "string" || !TICKET_STATUSES.includes(status as TicketStatus)) {
        throw AppError.BadRequest("Estado inválido");
      }
      const ticket = await this.ticketService.changeStatus(this.getId(req), userId, status as TicketStatus);
      res.json(ticket);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.ticketService.delete(this.getId(req));
      res.status(204).send();
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

  private getId(req: Request): string {
  const id = req.params.id;
  if (typeof id !== "string") {
    throw AppError.BadRequest("Id inválido");
  }
  return id;
}
}