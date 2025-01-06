import { CoreMessage } from "ai";

export type Thread = {
  id: string;
  userId: string;
  title: string;
  messages: CoreMessage;
};
