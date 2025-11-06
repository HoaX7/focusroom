import { Store, useStore } from "@tanstack/react-store";

export const updateStore = <T>(store: Store<T>, data: T, storageKey?: string) => {
  return store.setState((state) => {
    const updated = {
      ...state,
      ...data,
    };
    if (storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    }
    return updated;
  });
};

export const createStore = <T>(record: T) => {
  return new Store<T>(record);
};

export const getStoreHook = <T>(record: Store<T>) => {
  return useStore(record);
};
export const initStore = <T>(_initialState: T, storageKey: string) => {
  try {
    const cached = localStorage.getItem(storageKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      return createStore<T>(parsed);
    }
  } catch {}
  return createStore<T>(_initialState);
};
