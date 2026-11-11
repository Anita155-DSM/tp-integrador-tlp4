import type { SubscriptionDocument } from "../../models/Subscription.js";

export interface ISubscriptionRepository {
  create(userId: string, ticketId: string): Promise<SubscriptionDocument>;
  delete(userId: string, ticketId: string): Promise<SubscriptionDocument | null>;
  exists(userId: string, ticketId: string): Promise<boolean>;
  findByTicket(ticketId: string): Promise<SubscriptionDocument[]>;
}