import {TinyEmitter} from "tiny-emitter";
const eventEmitter = new TinyEmitter();

export class BaseStore {
  setters: Record<string, Record<string, never>> = {};

  addSetter(val: Record<string, never>, id: string) {
    this.setters = this.setters || {};
    this.setters[id] = val;
  }

  removeSetter(id: string) {
    delete this.setters[id];
  }

  triggerChange() {
    eventEmitter.emit("change");
  }

  onChange(cb: (...args: string[]) => void) {
    return eventEmitter.on("change", cb);
  }
}
