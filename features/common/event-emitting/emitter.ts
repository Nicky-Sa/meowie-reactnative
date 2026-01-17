import mitt from "mitt";

type EventMap = {
  userRegistered: void;
  userUnregistered: void;
};

export const Emitter = mitt<EventMap>();
