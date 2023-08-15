import { SnippetsSDK } from "snippets-sdk/lib/cjs";
import * as vscode from "vscode";
import { v4 as uuidv4 } from "uuid";

export const auth = async () => {
  try {
    const token = await vscode.window.showInputBox({
      prompt: "Please enter your token:"
    });
    vscode.window.showInformationMessage("Token entered: " + token);

    const useranme = await vscode.window.showInputBox({
      prompt: "Please enter your userName:"
    });

    vscode.window.showInformationMessage("Token entered: " + useranme);

    if (token && useranme) {
      const sdk = new SnippetsSDK(token, useranme);
      try {
   
      } catch (e) {
        console.log(e);
      }

      return {
        token,
        useranme,
        sdk
      };
    } else {
      return null;
    }
  } catch (e) {}
};
