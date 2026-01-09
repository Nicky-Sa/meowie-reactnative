import { EventEmitter } from "expo-modules-core";

type EventMap = {
  userRegistered: (data: { userId: number }) => void;
  userUnregistered: () => void;
};

// Create and export a single instance
export const Emitter = new EventEmitter<EventMap>();
