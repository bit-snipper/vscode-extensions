import type { NodeSnippetsSDK } from "code-snippets-sdk-node";
import { Reducer, createStore } from "./utils/redux";

interface SdkState {
  sdk: null | NodeSnippetsSDK;
  databaseURL: string | null;
}

export enum SdkAction {
  create,
  destory,
  setSnippets
}

const initialState = {
  sdk: null,
  databaseURL: null
};

const reducer: Reducer<SdkState, SdkAction> = (state, action) => {
  switch (action.type) {
    case SdkAction.create:
      if (action.payload) {
        const { sdk, databaseURL } = action.payload;
        if (sdk && databaseURL) {
          state = { sdk, databaseURL };
        }
      }
      break;
    case SdkAction.destory:
      state = {
        sdk: null,
        databaseURL: null
      };
      break;
    default:
      break;
  }
  return state;
};

export const sdkSotre = createStore<SdkState, SdkAction>(initialState, reducer);
