// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import "isomorphic-fetch";
import * as vscode from "vscode";
import { auth } from "./auth";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "vscode-authenticationprovider-sample" is now active!');

  // Register our authentication provider. NOTE: this will register the provider globally which means that
  // any other extension can use this provider via the `getSession` API.
  // NOTE: when implementing an auth provider, don't forget to register an activation event for that provider
  // in your package.json file: "onAuthenticationRequest:AzureDevOpsPAT"
  const storedToken = context.globalState.get("codesnippets-token", "");

  if (!storedToken) {
    // If no token is stored, prompt the user to enter one

    auth().then((data) => {
      if (data) {
        const { token, useranme } = data;
        context.globalState.update("codesnippets-token", token);
        context.globalState.update("codesnippets-username", useranme);
      }
    });
  } else {
    context.globalState.update("codesnippets-token", undefined);
    context.globalState.update("codesnippets-username", undefined);
  }

  // 鉴权
  let disposable = vscode.commands.registerCommand("code-snippets.auth", async function () {
    const data = await auth();
    if (data) {
      const { token, useranme } = data;
      context.globalState.update("codesnippets-token", token);
      context.globalState.update("codesnippets-username", useranme);
      console.log(data);
    }
  });

  // 选中代码右键
  let setSnippetsDisposable = vscode.commands.registerCommand("code-snippets.setSnippets", function (selectedText) {
    if (selectedText) {
      // 处理选中的代码

      console.log(selectedText);
    }
  });

  // 获取选中的代码
  const getSelectCodeDisposable = vscode.commands.registerCommand("code-snippets.getSelect", () => {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      const selectedText = editor.document.getText(editor.selection);
      // vscode.window.showInformationMessage('Selected code: ' + selectedText);
      vscode.commands.executeCommand("code-snippets.setSnippets", selectedText);
    }
  });

  const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
  statusBarItem.text = "😊code-snippets";
  statusBarItem.command = "code-snippets.auth";
  statusBarItem.tooltip = "Enter your token";
  statusBarItem.show();

  context.subscriptions.push(disposable);
  context.subscriptions.push(setSnippetsDisposable);
  context.subscriptions.push(statusBarItem);
  context.subscriptions.push(getSelectCodeDisposable);
}
