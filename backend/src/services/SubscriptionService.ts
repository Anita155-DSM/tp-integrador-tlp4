import { AppError } from "../errors/AppError.js";
import type { ISubscriptionRepository } from "../repositories/interfaces/ISubscriptionRepository.js";
import type { ITicketRepository } from "../repositories/interfaces/ITicketRepository.js";

export class SubscriptionService {
  constructor(
    private readonly subscriptionRepository: ISubscriptionRepository,
    private readonly ticketRepository: ITicketRepository
  ) {}

  async subscribe(userId: string, ticketId: string): Promise<void> {
    const ticket = await this.ticketRepository.findById(ticketId);
    if (ticket === null) {
      throw AppError.NotFound("Ticket no encontrado");
    }
    const alreadySubscribed = await this.subscriptionRepository.exists(userId, ticketId);
    if (!alreadySubscribed) {
      await this.subscriptionRepository.create(userId, ticketId);
    }
  }

  async unsubscribe(userId: string, ticketId: string): Promise<void> {
    const ticket = await this.ticketRepository.findById(ticketId);
    if (ticket === null) {
      throw AppError.NotFound("Ticket no encontrado");
    }
    await this.subscriptionRepository.delete(userId, ticketId);
  }
}