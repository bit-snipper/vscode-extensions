// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import "isomorphic-fetch";
import * as vscode from "vscode";
import { auth, login, logout } from "./auth";
import { DepNodeProvider } from "./views";
import { setSnippets } from "./actions";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  console.log("vscode code-snippets is starting");
  const rootPath =
    vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0
      ? vscode.workspace.workspaceFolders[0].uri.fsPath
      : undefined;

  auth(context);

  // 鉴权
  let disposable = vscode.commands.registerCommand("code-snippets.auth", async function () {
    logout(context);
    await login(context);
  });

  // 选中代码右键
  let setSnippetsDisposable = vscode.commands.registerCommand("code-snippets.setSnippets", async function () {
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

  const nodeDependenciesProvider = new DepNodeProvider(rootPath);

  let openDisposable = vscode.window.registerTreeDataProvider("nodeDependencies", nodeDependenciesProvider);

  const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
  statusBarItem.text = "😊code-snippets";
  statusBarItem.command = "code-snippets.auth";
  statusBarItem.tooltip = "Enter your token";
  statusBarItem.show();

  context.subscriptions.push(...[disposable, setSnippetsDisposable, statusBarItem, openDisposable]);
}
