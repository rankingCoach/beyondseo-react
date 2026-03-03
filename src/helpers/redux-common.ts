import { ActionReducerMapBuilder, AsyncThunk, current, Draft, PayloadAction } from "@reduxjs/toolkit";
import { REHYDRATE } from "redux-persist";

import { BaseModel } from "@models/BaseModel";
import { capitalizeFirstLetter } from "./string-helpers";

type Opts<T, InitialState = any, MappedState = any> = {
  key: keyof T;
  // Subset object to select data from
  dataKey?: string;
  mapper?: (value: InitialState) => MappedState;
};

type LinkThunkToStateOpts<T, InitialState = any, MappedState = any> = {
  mapper?: (value: InitialState, state?: InitialState) => MappedState;
};

type PayloadActionCreatorSimple<InitialState, Payload> = (
  state: Draft<InitialState>,
  { payload }: PayloadAction<Payload>,
) => void;

type PayloadActionCreatorArr<InitialState, Payload> = (
  state: Draft<InitialState>,
  { payload }: PayloadAction<Payload[]>,
) => void;

type PayloadActionCreatorObj<InitialState, Payload> = (
  state: Draft<InitialState>,
  { payload }: PayloadAction<Payload>,
) => void;

type PayloadActionCreator<InitialState, Payload> = PayloadActionCreatorSimple<InitialState, Payload> &
  PayloadActionCreatorArr<InitialState, Payload>;

type ValueOf<T> = T[keyof T];
type NoStringIndex<T> = { [K in keyof T as string extends K ? never : K]: T[K] };

export type GeneratedReduces<InitialState> = Record<
  `set${Capitalize<string & keyof NoStringIndex<InitialState>>}`,
  (payload: any) => void
> &
  Record<`setAll`, (payload: Partial<InitialState>) => void>;

type GeneratorDataRet<InitialState> = Record<
  `set${Capitalize<string & keyof NoStringIndex<InitialState>>}`,
  (state: Draft<InitialState>, { payload }: PayloadAction<ValueOf<InitialState>>) => void
> &
  Record<`setAll`, (state: Draft<InitialState>, { payload }: PayloadAction<Partial<InitialState>>) => void> &
  Record<`resetState`, (state: Draft<InitialState>) => void>;

export type WithInitialState<T> = {
  initialState?: Partial<Omit<T, "initialState" | "requestInProgress" | "requestSuccess" | "requestRejected">> | null;
  requestInProgress: boolean;
  requestSuccess?: boolean;
  requestRejected?: boolean;
};

const updateObjByPath = (obj: any, keyPathUrl: string, value: any) => {
  const keyPath = keyPathUrl.split("/"); // split key path string
  const lastKeyIndex = keyPath.length - 1;
  for (let i = 0; i < lastKeyIndex; ++i) {
    let key = keyPath[i];

    // choose if nested object is array or hash based on if key is number
    if (!(key in obj)) obj[key] = parseInt(key) !== parseInt(key) ? {} : [];
    obj = obj[key];
  }
  obj[keyPath[lastKeyIndex]] = value;
};

export class ReduxGenerator<T extends {}> {
  public genAll(initialState: T): GeneratorDataRet<T> {
    const toRet = {} as GeneratorDataRet<T>;
    for (const key in initialState) {
      let type: "undefined" | "object" | "boolean" | "number" | "string" | "function" | "symbol" | "bigint" | "array" =
        typeof initialState[key];

      if (Array.isArray(initialState[key])) {
        type = "array";
      }
      const capKey = capitalizeFirstLetter(key);

      switch (type) {
        case "string":
          //@ts-ignore
          toRet["set" + capKey] = this.primitiveSetter<string>(key);
          break;
        case "boolean":
          //@ts-ignore
          toRet["set" + capKey] = this.primitiveSetter<boolean>(key);
          break;
        case "number":
          //@ts-ignore
          toRet["set" + capKey] = this.primitiveSetter<number>(key);
          break;
        case "array":
          //@ts-ignore
          toRet["set" + capKey] = this.arrSetter<boolean>(key);
          //@ts-ignore
          toRet["set" + capKey + "inArray"] = this.inArrSetter<boolean>(key);
          break;
        case "object":
          //@ts-ignore
          toRet["set" + capKey] = this.primitiveSetter<number>(key);
          break;
        case "undefined":
          //@ts-ignore
          toRet["set" + capKey] = this.primitiveSetter<any>(key);
          break;
        default:
          throw new Error(`Not implemented ${type} ${key}`);
      }
    }

    toRet["setAll"] = (state: Draft<T>, { payload }: PayloadAction<Partial<T>>) => {
      for (const key in state) {
        const keyStr = key as string;
        if (payload && Object.hasOwnProperty.bind(payload)(keyStr)) {
          //@ts-ignore
          state[keyStr] = payload[keyStr];
        }
      }
    };

    //@ts-ignore
    toRet["setByPath"] = (state: Draft<T>, { payload }: PayloadAction<{ path: string; value: any }>) => {
      const { value } = payload;
      let { path } = payload;
      path = path.split(".").join("/");
      updateObjByPath(state, path, value);
    };

    toRet["resetState"] = (state: Draft<T>) => {
      //@ts-ignore
      if (state["initialState"] === null) {
        console.warn("Cannot reset state: No initialState", current(state));
        return;
      }

      //@ts-ignore
      for (const key in state["initialState"]) {
        const keyStr = key as string;
        if (["initialState", "requestInProgress", "requestSuccess", "requestRejected"].includes(keyStr)) {
          // Do not reset 'setting' keys
          continue;
        }
        //@ts-ignore
        state[keyStr] = state["initialState"][keyStr];
      }
    };

    return toRet;
  }

  public inArrSetter<U>(key: keyof T): PayloadActionCreatorSimple<T, { el: U; idx: number }> {
    return (state: Draft<T>, { payload }: PayloadAction<{ el: U; idx: number }>) => {
      const { el, idx } = payload;
      const keyStr = key as string;
      //@ts-ignore
      const toModify = state[keyStr][idx];
      if (toModify) {
        for (const key in toModify) {
          //@ts-ignore
          if (el[key] !== undefined) {
            //@ts-ignore
            toModify[key] = el[key];
          }
        }
      }
    };
  }

  public arrSetter<U>(key: keyof T): PayloadActionCreatorArr<T, U> {
    return (state: Draft<T>, { payload }: PayloadAction<U[]>) => {
      const keyStr = key as string;
      if (!payload) {
        //@ts-ignore
        state[keyStr] = payload;
      } else {
        //@ts-ignore
        state[keyStr] = [...payload];
      }
    };
  }

  public objectSetter<U>(): PayloadActionCreatorObj<T, U> {
    // @todo adjust to set whole state
    return (state: Draft<T>, { payload }: PayloadAction<U>) => {
      for (const key in payload) {
        const keyStr = key as string;
        const stateAsAny = state as any;
        if (stateAsAny.hasOwnProperty(keyStr)) {
          //@ts-ignore
          state[keyStr] = payload[keyStr];
        } else {
          //@ts-ignore
          const stateKeys = Object.keys(state).join(", ");
          console.warn(`Trying to set the key ${keyStr} on state, but state has only: ${stateKeys}`);
        }
      }
    };
  }

  public primitiveSetter<U extends boolean | string | number | object>(key: keyof T): PayloadActionCreatorSimple<T, U> {
    return (state: Draft<T>, { payload }: PayloadAction<U>) => {
      const keyStr = key as string;
      //@ts-ignore
      state[keyStr] = payload;
    };
  }

  public versionCheck(builder: ActionReducerMapBuilder<T>, initialState: any, key: string) {
    // @ts-ignore
    builder.addCase(REHYDRATE, (state, action) => {
      const rehydrateAction: any = action as PayloadAction<T>;

      if (!state) {
        return state;
      }
      if (!rehydrateAction.payload) {
        return rehydrateAction.payload;
      }
      if (key !== rehydrateAction.key) {
        return state;
      }
      if (initialState["version"] !== rehydrateAction.payload.version) {
        rehydrateAction.payload = initialState;
      }

      if (rehydrateAction.payload.keepStorage === false) {
        rehydrateAction.payload = initialState;
      }
    });
  }

  public linkThunk(builder: ActionReducerMapBuilder<T>, thunk: AsyncThunk<any, any, any>, opts: Opts<T> | Opts<T>[]) {
    const optArr = Array.isArray(opts) ? opts : [opts];

    builder.addCase(thunk.pending, (state, { payload }) => {
      for (const opt of optArr) {
        const { key, dataKey } = opt;
        const keyString = key as string;
        //@ts-ignore
        if (Array.isArray(state[keyString])) {
          //@ts-ignore
          state[keyString] = [];
        } else {
          // TODO multiple types
          //@ts-ignore
          state[keyString] = {};
        }
        //@ts-ignore
        state[key + "Loading"] = true;
      }
    });
    builder.addCase(thunk.fulfilled, (state, { payload }) => {
      for (const opt of optArr) {
        const { key, dataKey, mapper } = opt;
        const keyString = key as string;

        let data = dataKey ? payload[dataKey] : payload.data;
        if (mapper) {
          // Allow the user to do a custom mapping on the response data
          data = mapper(data);
        }
        //@ts-ignore
        state[key + "Loading"] = false;
        if (Array.isArray(data)) {
          //@ts-ignore
          state[keyString] = [...data];
        } else {
          // TODO multiple types
          //@ts-ignore
          state[keyString] = { ...data };
        }

        //Clear all errors on success
        //@ts-ignore
        state[key + "Error"] = "";
      }
    });
    builder.addCase(thunk.rejected, (state, payload) => {
      for (const opt of optArr) {
        const { key, dataKey, mapper } = opt;
        const errorPayload = payload as any;
        //@ts-ignore
        state[key + "Loading"] = false;
        //@ts-ignore
        state[key + "Error"] = errorPayload?.error.message || "unknown error";
      }
    });
  }

  public linkThunkToState<ThunkType extends BaseModel, ThunkReturn, ThunkConfig>(
    builder: ActionReducerMapBuilder<T>,
    thunk: AsyncThunk<Partial<any>, Partial<any>, Partial<any>>, // @todo VERIFY THIS WHY IT DOES NOT WORK PROPERLY
    opts?: LinkThunkToStateOpts<T>,
  ) {
    builder.addCase(thunk.pending, (state, { payload }) => {
      //@ts-ignore
      state["isLoading"] = true;
      //@ts-ignore
      state["error"] = "";
    });

    builder.addCase(thunk.fulfilled, (state, { payload }) => {
      let data = payload.data ? payload.data : payload;
      if (opts && opts.mapper) {
        // Allow the user to do a custom mapping on the response data
        data = opts.mapper(data, state);
      }
      const dataKeys = Object.keys(data ?? {});
      //@ts-ignore
      const stateKeys = Object.keys(state);

      const intersectionDataState = dataKeys.filter((x) => !stateKeys.includes(x));
      const intersectionStateData = stateKeys.filter((x) => !dataKeys.includes(x));

      if (intersectionDataState) {
        console.warn("Mapping keys that exist in data but not in state", intersectionDataState.join(", "));
      }
      if (intersectionStateData) {
        console.warn("Mapping keys that exist in state but not in data", intersectionStateData.join(", "));
      }
      //@ts-ignore
      state["isLoading"] = false;

      for (const key in data) {
        const keyStr = key as string;
        //@ts-ignore
        state[keyStr] = data[keyStr];
      }

      // Clear all errors on success
      //@ts-ignore
      state["error"] = "";
    });

    builder.addCase(thunk.rejected, (state, payload) => {
      const errorPayload = payload as any;
      //@ts-ignore
      state["isLoading"] = false;
      //@ts-ignore
      state["error"] = errorPayload?.error.message || "unknown error";
    });
  }

  public removeById(key: keyof T): PayloadActionCreatorSimple<T, number> {
    return (state: Draft<T>, { payload }: PayloadAction<number>) => {
      if (payload) {
        const stringKey = key as string;
        //@ts-ignore
        state[stringKey] = state[stringKey].filter((el: { id: number }) => el.id !== payload);
      }
    };
  }
}
