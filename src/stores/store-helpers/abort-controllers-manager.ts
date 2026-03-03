export class AbortControllersManager {
  controllers: Record<string, AbortController> = {};

  _push = (id: string, controller: AbortController) => {
    this.controllers[id] = controller;
  };

  _remove = (id: string) => {
    delete this.controllers[id];
  };

  abortAll = () => {
    Object.values(this.controllers).forEach((c) => {
      c.abort();
    });
  };
}
