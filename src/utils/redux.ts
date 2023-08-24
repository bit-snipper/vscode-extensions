interface Action<T = any, N = string> {
  type: N;
  payload?: T;
}

export interface Store<T = any, N = any> {
  dispatch: (action: Action<Partial<T>, N>) => void;
  subscribe: (fn: Function) => void;
  getState: () => T;
}

export type Reducer<T, N> = (state: T, action: Action<Partial<T>, N>) => T;

export const createStore = <T = any, N = any>(initialState: T, reducer: Reducer<T, N>): Store<T, N> => {
  let state: T = initialState;

  const callbacks: Function[] = [];

  const dispatch = (action: Action<Partial<T>, N>) => {
    state = reducer(state, action);
    callbacks.forEach((fn) => fn());
  };

  const subscribe = (callback: Function) => {
    if (typeof callback !== "function") return;
    callbacks.push(callback);
  };

  const getState = () => {
    return state;
  };

  return {
    dispatch,
    subscribe,
    getState
  };
};
