import { EventEmitter } from "expo-modules-core";

type EventMap = {
  tokensCleared: () => void;
};

// Create and export a single instance
export const Emitter = new EventEmitter<EventMap>();
