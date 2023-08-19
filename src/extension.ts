// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import "isomorphic-fetch";
import * as vscode from "vscode";
import { auth, login, logout } from "./auth";
import { TreeProvider } from "./views";
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

  const PanelDisposable = vscode.commands.registerCommand("code-snippets.openWeb", () => {
    const panel = vscode.window.createWebviewPanel(
      "code-snippets-web", // 面板的唯一标识符
      "code snippets", // 面板的标题
      vscode.ViewColumn.One, // 面板显示的列
      {
        enableScripts: true // 启用脚本
      }
    );

    // 加载外部网页
    panel.webview.html = '<iframe src="https://code-snippets.zeabur.app/" style="width:100%;height:100vh"></iframe>';
  });

  const treeProvider = new TreeProvider();

  let openDisposable = vscode.window.registerTreeDataProvider("code-snippets.webpanel", treeProvider);

  const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
  statusBarItem.text = "😊code-snippets";
  statusBarItem.command = "code-snippets.auth";
  statusBarItem.tooltip = "Enter your token";
  statusBarItem.show();

  context.subscriptions.push(...[disposable, setSnippetsDisposable, statusBarItem, openDisposable]);
}
