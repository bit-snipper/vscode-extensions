import * as vscode from "vscode";
import { WebviewViewProvider, TreeDataProvider } from "vscode";

export class WebProvider implements WebviewViewProvider {
  resolveWebviewView(webviewView: vscode.WebviewView, context: vscode.WebviewViewResolveContext, token: vscode.CancellationToken): void | Thenable<void> {
    webviewView.webview.options = {
      enableScripts: true
    };

    webviewView.webview.html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
      </head>
      <body>
        <iframe src="https://code-snippets.zeabur.app/" frameborder="0" style="height: 100vh; width: 100%"></iframe>
      </body>
    </html>

    `;
  }
}

export class TreeProvider implements TreeDataProvider<TreeView> {
  onDidChangeTreeData?: vscode.Event<void | TreeView | TreeView[] | null | undefined> | undefined;

  getTreeItem(element: TreeView): vscode.TreeItem | Thenable<vscode.TreeItem> {
    const treeItem = new vscode.TreeItem("Open Webview");
    treeItem.command = {
      command: "extension.showWebviewInTree",
      title: "Open Webview"
    };
    return treeItem;
  }

  getChildren(element?: TreeView | undefined): vscode.ProviderResult<TreeView[]> {
    return [];
  }
  // getParent?(element: TreeView): vscode.ProviderResult<TreeView> {}

  // resolveTreeItem?(item: vscode.TreeItem, element: TreeView, token: vscode.CancellationToken): vscode.ProviderResult<vscode.TreeItem> {}
}

export class TreeView extends vscode.TreeItem {}
