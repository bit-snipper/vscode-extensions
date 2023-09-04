import * as vscode from "vscode";
import { WebviewViewProvider, TreeDataProvider, ProviderResult } from "vscode";

// export class WebProvider implements WebviewViewProvider {
//   resolveWebviewView(webviewView: vscode.WebviewView, context: vscode.WebviewViewResolveContext, token: vscode.CancellationToken): void | Thenable<void> {
//     webviewView.webview.options = {
//       enableScripts: true
//     };

//     webviewView.webview.html = `
//     <!DOCTYPE html>
//     <html lang="en">
//       <head>
//         <meta charset="UTF-8" />
//         <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//         <title>Document</title>
//       </head>
//       <body>
//         <iframe src="https://code-snippets.zeabur.app/" frameborder="0" style="height: 100vh; width: 100%"></iframe>
//       </body>
//     </html>

//     `;
//   }
// }

export class TreeProvider implements TreeDataProvider<TreeView | Search> {
  getTreeItem(element: TreeView): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return element;
  }

  async getChildren(element?: TreeView | undefined) {
    const search = new Search("search");

    const items = ["aaa", "bb", "cc"].map((label) => {
      const treeItem = new TreeView(label, vscode.TreeItemCollapsibleState.None);
      // 为每个项添加命令
      treeItem.command = {
        command: "code-snippets.click",
        title: "TreeView Item Click",
        arguments: [label] // 将项的标签作为参数传递
      };
      return treeItem;
    });

    return [search, ...items];
  }
}

export class TreeView extends vscode.TreeItem {
  constructor(public readonly label: string, public readonly collapsibleState: vscode.TreeItemCollapsibleState) {
    super(label, collapsibleState);
  }
}

export class Search extends vscode.TreeItem {}
