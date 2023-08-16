import { SnippetsSDK } from "code-snippets-sdk/index";
import { Reducer, createStore } from "./utils/redux";

interface SdkState {
  sdk: null | SnippetsSDK;
  username: string | null;
  token: string | null;
}

export enum SdkAction {
  create,
  destory,
  setSnippets
}

const initialState = {
  sdk: null,
  username: null,
  token: null
};

const reducer: Reducer<SdkState, SdkAction> = (state, action) => {
  switch (action.type) {
    case SdkAction.create:
      if (action.payload) {
        const { sdk, username, token } = action.payload;
        if (sdk && username && token) {
          state = { sdk, username, token };
        }
      }
      break;
    case SdkAction.destory:
      state = {
        sdk: null,
        username: null,
        token: null
      };
      break;
    default:
      break;
  }
  return state;
};

export const sdkSotre = createStore<SdkState, SdkAction>(initialState, reducer);
