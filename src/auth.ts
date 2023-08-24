import { NodeSnippetsSDK } from "code-snippets-sdk/node";
import * as vscode from "vscode";
import { SdkAction, sdkSotre } from "./store";

export const create = async (context: vscode.ExtensionContext) => {
  try {
    context.globalState.update("codesnippets-databaseURL", undefined);
    const databaseURL = await vscode.window.showInputBox({
      prompt: "Please enter your databaseURL:"
    });
    context.globalState.update("codesnippets-databaseURL", databaseURL);

    if (databaseURL) {
      const sdk = new NodeSnippetsSDK(databaseURL);
      sdkSotre.dispatch({
        type: SdkAction.create,
        payload: {
          sdk,
          databaseURL
        }
      });
      vscode.window.showInformationMessage("create success");
    }
  } catch (e) {}
};

export const auth = (context: vscode.ExtensionContext) => {
  const databaseURL: string | undefined = context.globalState.get("codesnippets-databaseURL");
  if (databaseURL) {
    const sdk = new NodeSnippetsSDK(databaseURL);
    sdkSotre.dispatch({
      type: SdkAction.create,
      payload: {
        sdk,
        databaseURL
      }
    });
    vscode.window.showInformationMessage("login success");
  } else {
    create(context);
  }
};
