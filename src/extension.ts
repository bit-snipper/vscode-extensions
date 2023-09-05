// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import "isomorphic-fetch";
import * as vscode from "vscode";
import { auth, create } from "./auth";
import { TreeProvider, WebProvider } from "./views";
import { setSnippets } from "./actions";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
  console.log("vscode code-snippets is starting");

  await auth(context);

  let AuthDisposable = vscode.commands.registerCommand("code-snippets.create", () => create(context));

  // commands
  vscode.commands.registerCommand("code-snippets.insert", async function () {
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
  // search
  vscode.commands.registerCommand("code-snippets.search", async () => {});
  // sync
  vscode.commands.registerCommand("code-snippets.sync", async () => {});
  // delete
  vscode.commands.registerCommand("code-snippets.delete", async () => {});
  // update
  vscode.commands.registerCommand("code-snippets.update", async () => {});
  // edit
  vscode.commands.registerCommand("code-snippets.edit", async (label: string) => {});

  // primary side bar webProvider
  vscode.window.registerWebviewViewProvider("code-snippets.web", new WebProvider());

  // primary side bar treeProvider
  // vscode.window.registerTreeDataProvider("code-snippets.tree", new TreeProvider());

  // status bar button
  const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
  statusBarItem.text = "😊code-snippets-debug";
  statusBarItem.command = "code-snippets.create";
  statusBarItem.tooltip = "set baseUrl";
  statusBarItem.show();

  context.subscriptions.push(...[AuthDisposable, statusBarItem]);
}
