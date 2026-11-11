import { Subscription } from "../models/Subscription.js";
import type { SubscriptionDocument } from "../models/Subscription.js";
import type { ISubscriptionRepository } from "./interfaces/ISubscriptionRepository.js";

export class SubscriptionRepository implements ISubscriptionRepository {
  create(userId: string, ticketId: string): Promise<SubscriptionDocument> {
    return Subscription.create({ user: userId, ticket: ticketId });
  }

  delete(userId: string, ticketId: string): Promise<SubscriptionDocument | null> {
    return Subscription.findOneAndDelete({ user: userId, ticket: ticketId }).exec();
  }

  async exists(userId: string, ticketId: string): Promise<boolean> {
    const found = await Subscription.exists({ user: userId, ticket: ticketId });
    return found !== null;
  }

  findByTicket(ticketId: string): Promise<SubscriptionDocument[]> {
    return Subscription.find({ ticket: ticketId }).exec();
  }
}