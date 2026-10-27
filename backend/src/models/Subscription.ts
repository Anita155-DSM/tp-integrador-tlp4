import { Schema, model, Types, type HydratedDocument } from "mongoose";

export interface ISubscription {
  user: Types.ObjectId;
  ticket: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export type SubscriptionDocument = HydratedDocument<ISubscription>;

const subscriptionSchema = new Schema<ISubscription>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    ticket: { type: Schema.Types.ObjectId, ref: "Ticket", required: true },
  },
  { timestamps: true }
);

subscriptionSchema.index({ user: 1, ticket: 1 }, { unique: true });

export const Subscription = model<ISubscription>("Subscription", subscriptionSchema);