// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import "isomorphic-fetch";
import * as vscode from "vscode";
import { auth, create } from "./auth";
import { TreeProvider } from "./views";
import { setSnippets } from "./actions";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
  console.log("vscode code-snippets is starting");

  await auth(context);

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
        console.log({
          code: selectedText,
          language: languageId
        });
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
  vscode.window.registerTreeDataProvider("code-snippets.tree", new TreeProvider());
  vscode.commands.registerCommand("code-snippets.click", (label: string) => {
    // 获取点击事件
  });

  // status bar button
  const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
  statusBarItem.text = "😊code-snippets-debug";
  statusBarItem.command = "code-snippets.create";
  statusBarItem.tooltip = "set baseUrl";
  statusBarItem.show();

  context.subscriptions.push(...[AuthDisposable, statusBarItem]);
}
