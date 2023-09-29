// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import "isomorphic-fetch";
import * as vscode from "vscode";
import { auth, create } from "./auth";
import { WebProvider } from "./views";
import { sdkSotre } from "./store";
import { setSnippetsAction } from "code-snippets-sdk-node";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
  console.log("vscode code-snippets is starting");

  await auth(context);

  let AuthDisposable = vscode.commands.registerCommand("code-snippets.create", () => create(context));

  const webProvider = new WebProvider(context);

  // commands

  // sync
  vscode.commands.registerCommand("code-snippets.sync", async () => {
    webProvider.postMessage("sync");
  });

  // upload
  vscode.commands.registerCommand("code-snippets.upload", async function () {
    // 处理选中的代码
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      // 获取
      const selectedText = editor.document.getText(editor.selection);
      const selectedRange = editor.selection;
      if (!selectedRange.isEmpty) {
        const languageId = editor.document.languageId;
        const { sdk } = sdkSotre.getState();
        await sdk!.init();
        await sdk!.setSnippets(
          {
            code: selectedText,
            language: languageId,
            description: "",
            createTimestamp: Date.now(),
            updateTimestamp: Date.now()
          },
          setSnippetsAction.Insert
        );
        vscode.window.showInformationMessage("upload success");
        webProvider.postMessage("sync", () => {});
      }
    }
  });
  // search
  vscode.commands.registerCommand("code-snippets.search", async () => {});

  // delete
  vscode.commands.registerCommand("code-snippets.delete", async () => {});
  // update
  vscode.commands.registerCommand("code-snippets.update", async () => {});
  // edit
  vscode.commands.registerCommand("code-snippets.edit", async (label: string) => {});

  // primary side bar webProvider
  vscode.window.registerWebviewViewProvider("code-snippets.web", webProvider);

  // status bar button
  const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
  statusBarItem.text = "😊code-snippets";
  statusBarItem.command = "code-snippets.create";
  statusBarItem.tooltip = "set baseUrl";
  statusBarItem.show();

  context.subscriptions.push(...[AuthDisposable, statusBarItem]);
}
