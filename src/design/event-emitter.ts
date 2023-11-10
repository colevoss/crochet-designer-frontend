type EventHandler<T, K extends keyof T> = (payload: T[K]) => void;
type Unsub = () => void;

export class EventEmitter<T = {}> {
  // #handlers: Map<keyof T, Map<EventHandler<T, keyof T>, boolean>> = new Map();
  #handlers: Map<keyof T, Map<EventHandler<any, any>, boolean>> = new Map();
  // #handlers: Map<keyof T, Map<EventHandler<T, keyof T>, boolean>> = new Map();

  public on<K extends keyof T>(name: K, handler: EventHandler<T, K>): Unsub {
    if (!this.#handlers.has(name)) {
      this.#handlers.set(name, new Map());
    }

    const handlers = this.#handlers.get(name)!;
    handlers.set(handler, true);

    return () => {
      handlers.delete(handler);
    };
  }

  public emit(event: keyof T, payload: T[keyof T]) {
    const handlers = this.#handlers.get(event);

    if (handlers === undefined) {
      return;
    }

    for (const [handler, _] of handlers) {
      handler(payload);
    }
  }
}
