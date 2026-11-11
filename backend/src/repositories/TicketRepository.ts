import { Ticket } from "../models/Ticket.js";
import type { TicketDocument, TicketStatus } from "../models/Ticket.js";
import type {
  ITicketRepository,
  TicketInput,
} from "./interfaces/ITicketRepository.js";

export class TicketRepository implements ITicketRepository {
  findAll(): Promise<TicketDocument[]> {
    return Ticket.find().sort({ createdAt: -1 }).exec();
  }

  findById(id: string): Promise<TicketDocument | null> {
    return Ticket.findById(id).exec();
  }

  create(data: TicketInput): Promise<TicketDocument> {
    return Ticket.create(data);
  }

  update(id: string, data: TicketInput): Promise<TicketDocument | null> {
    return Ticket.findByIdAndUpdate(id, data, { returnDocument: "after" }).exec();
  }

  updateStatus(id: string, status: TicketStatus): Promise<TicketDocument | null> {
    return Ticket.findByIdAndUpdate(id, { status }, { returnDocument: "after" }).exec();
  }

  delete(id: string): Promise<TicketDocument | null> {
    return Ticket.findByIdAndDelete(id).exec();
  }
}