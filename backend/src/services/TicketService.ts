import { AppError } from "../errors/AppError.js";
import type { ITicketRepository, TicketInput } from "../repositories/interfaces/ITicketRepository.js";
import type { ISubscriptionRepository } from "../repositories/interfaces/ISubscriptionRepository.js";
import type { ISubject } from "../observer/ISubject.js";
import type { TicketStatusChangedEvent } from "../notifications/TicketStatusChangedEvent.js";
import type { TicketDocument, TicketStatus } from "../models/Ticket.js";

export interface TicketDTO {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
}

export interface TicketDetailDTO extends TicketDTO {
  isSubscribed: boolean;
}

export class TicketService {
  constructor(
    private readonly ticketRepository: ITicketRepository,
    private readonly subscriptionRepository: ISubscriptionRepository,
    private readonly eventPublisher: ISubject<TicketStatusChangedEvent>
  ) {}

  async list(): Promise<TicketDTO[]> {
    const tickets = await this.ticketRepository.findAll();
    return tickets.map((ticket) => this.toDTO(ticket));
  }

  async getById(id: string, userId: string): Promise<TicketDetailDTO> {
    const ticket = await this.ticketRepository.findById(id);
    if (ticket === null) {
      throw AppError.NotFound("Ticket no encontrado");
    }
    const isSubscribed = await this.subscriptionRepository.exists(userId, id);
    return { ...this.toDTO(ticket), isSubscribed };
  }

  async create(data: TicketInput): Promise<TicketDTO> {
    const ticket = await this.ticketRepository.create(data);
    return this.toDTO(ticket);
  }

  async update(id: string, data: TicketInput): Promise<TicketDTO> {
    const ticket = await this.ticketRepository.update(id, data);
    if (ticket === null) {
      throw AppError.NotFound("Ticket no encontrado");
    }
    return this.toDTO(ticket);
  }

  async changeStatus(
    id: string,
    userId: string,
    newStatus: TicketStatus
  ): Promise<TicketDetailDTO> {
    const ticket = await this.ticketRepository.findById(id);
    if (ticket === null) {
      throw AppError.NotFound("Ticket no encontrado");
    }

    const previousStatus = ticket.status;
    const updated = await this.ticketRepository.updateStatus(id, newStatus);
    if (updated === null) {
      throw AppError.NotFound("Ticket no encontrado");
    }

    if (previousStatus !== newStatus) {
      await this.eventPublisher.notify({
        ticketId: updated._id.toString(),
        ticketTitle: updated.title,
        previousStatus,
        newStatus,
      });
    }

    const isSubscribed = await this.subscriptionRepository.exists(userId, id);
    return { ...this.toDTO(updated), isSubscribed };
  }

  async delete(id: string): Promise<void> {
    const deleted = await this.ticketRepository.delete(id);
    if (deleted === null) {
      throw AppError.NotFound("Ticket no encontrado");
    }
  }

  private toDTO(ticket: TicketDocument): TicketDTO {
    return {
      id: ticket._id.toString(),
      title: ticket.title,
      description: ticket.description,
      status: ticket.status,
      createdAt: ticket.createdAt!.toISOString(),
      updatedAt: ticket.updatedAt!.toISOString(),
    };
  }
}