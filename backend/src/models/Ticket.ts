export const TICKET_STATUSES = ["ABIERTO", "EN_PROGRESO", "RESUELTO", "CERRADO"] as const;
export type TicketStatus = (typeof TICKET_STATUSES)[number];