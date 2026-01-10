import { EventEmitter } from "expo-modules-core";

type EventMap = {
  userRegistered: () => void;
  userUnregistered: () => void;
};

// Create and export a single instance
export const Emitter = new EventEmitter<EventMap>();
