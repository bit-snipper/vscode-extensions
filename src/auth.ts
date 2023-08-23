import { SnippetsSDK } from "code-snippets-sdk";
import * as vscode from "vscode";
import { SdkAction, sdkSotre } from "./store";

export const login = async (context: vscode.ExtensionContext) => {
  try {
    const token = await vscode.window.showInputBox({
      prompt: "Please enter your token:"
    });
    context.globalState.update("codesnippets-token", token);
    const username = await vscode.window.showInputBox({
      prompt: "Please enter your userName:"
    });
    context.globalState.update("codesnippets-username", username);

    if (token && username) {
      const sdk = new SnippetsSDK(token);
      sdkSotre.dispatch({
        type: SdkAction.create,
        payload: {
          sdk,
          username,
          token
        }
      });
      vscode.window.showInformationMessage("login success");
    }
  } catch (e) {}
};

export const logout = (context: vscode.ExtensionContext) => {
  context.globalState.update("codesnippets-token", undefined);
  context.globalState.update("codesnippets-username", undefined);
  sdkSotre.dispatch({ type: SdkAction.destory });
};

export const auth = (context: vscode.ExtensionContext) => {
  const token: string | undefined = context.globalState.get("codesnippets-token");
  const username: string | undefined = context.globalState.get("codesnippets-username");
  if (!token || !username) {
    login(context);
  } else if (token && username) {
    const sdk = new SnippetsSDK(token);
    sdkSotre.dispatch({
      type: SdkAction.create,
      payload: {
        sdk,
        username,
        token
      }
    });
    vscode.window.showInformationMessage("login success");
  }
};
