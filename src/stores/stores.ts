import { HttpStore } from "./http.store";
import { rcWindow } from "./window.store";

class Stores {
  stores: HttpStore[];

  constructor() {
    this.stores = [];
  }

  addStore(store: HttpStore) {
    this.stores.push(store);
  }

  resetStores(): void {
    this.stores = [];
  }
}

export const stores = new Stores();
rcWindow.stores = stores;
