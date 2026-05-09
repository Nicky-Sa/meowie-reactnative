import mitt from "mitt";

type EventMap = {
  sessionCreated: void;
  sessionDestroyed: void;
};

export const Emitter = mitt<EventMap>();
