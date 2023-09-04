import * as vscode from "vscode";
import { SdkAction, sdkSotre } from "./store";

export const create = async (context: vscode.ExtensionContext) => {
  try {
    const codeSnippetsSDK = await import("code-snippets-sdk-node");
    context.globalState.update("codesnippets-databaseURL", undefined);
    const databaseURL = await vscode.window.showInputBox({
      prompt: "Please enter your databaseURL:"
    });
    
    context.globalState.update("codesnippets-databaseURL", databaseURL);

    if (databaseURL) {
      const sdk = new codeSnippetsSDK.NodeSnippetsSDK(databaseURL);
      sdkSotre.dispatch({
        type: SdkAction.create,
        payload: {
          sdk,
          databaseURL
        }
      });
      vscode.window.showInformationMessage("login success");
    }
  } catch (e) {
    console.error(e);
  }
};

export const auth = async (context: vscode.ExtensionContext) => {
  const codeSnippetsSDK = await import("code-snippets-sdk-node");
  const databaseURL: string | undefined = context.globalState.get("codesnippets-databaseURL");
  if (databaseURL) {
    const sdk = new codeSnippetsSDK.NodeSnippetsSDK(databaseURL);
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
