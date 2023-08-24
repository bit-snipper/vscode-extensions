// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import "isomorphic-fetch";
import * as vscode from "vscode";
import { auth, create } from "./auth";
import { WebProvider } from "./views";
import { setSnippets } from "./actions";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  console.log("vscode code-snippets is starting");

  auth(context);

  let AuthDisposable = vscode.commands.registerCommand("code-snippets.create", () => create(context));

  // commands
  vscode.commands.registerCommand("code-snippets.setSnippets", async function () {
    // 处理选中的代码

    const editor = vscode.window.activeTextEditor;
    if (editor) {
      // 获取
      const selectedText = editor.document.getText(editor.selection);
      const selectedRange = editor.selection;
      if (!selectedRange.isEmpty) {
        const languageId = editor.document.languageId;
        await setSnippets({
          code: selectedText,
          language: languageId,
          description: ""
        });
        vscode.window.showInformationMessage("success");
      }
    }
  });

  // primary side bar treeProvider
  vscode.window.registerWebviewViewProvider("code-snippets.webpanel", new WebProvider());

  // status bar button
  const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
  statusBarItem.text = "😊code-snippets-debug";
  statusBarItem.command = "code-snippets.auth";
  statusBarItem.tooltip = "set baseUrl";
  statusBarItem.show();

  context.subscriptions.push(...[AuthDisposable, statusBarItem]);
}
