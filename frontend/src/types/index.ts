export type TicketStatus = "ABIERTO" | "EN_PROGRESO" | "RESUELTO" | "CERRADO";

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  ticketId: string;
  ticketTitle: string;
  previousStatus: TicketStatus;
  newStatus: TicketStatus;
  read: boolean;
  createdAt: string;
}

export interface CreateTicketInput {
  title: string;
  description: string;
}

export interface TicketDetail extends Ticket {
  isSubscribed: boolean;
}

export interface AuthUser {
    id: string;
    name: string;
    email: string;
    role: string;
    permissions: string[];
}

export interface LoginResponse {
    token: string;
    user: AuthUser;
}

export interface UserSummary {
    id: string;
    name: string;
    email: string;
    role: string;
}
