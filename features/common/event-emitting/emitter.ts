import { EventEmitter } from "expo-modules-core";

type EventMap = {
  logout: () => void;
};

// Create and export a single instance
export const Emitter = new EventEmitter<EventMap>();
