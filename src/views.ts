import * as vscode from "vscode";
import { WebviewViewProvider, TreeDataProvider, ProviderResult, scm, SourceControl } from "vscode";
import * as fs from "fs";
import path from "path";
import { sdkSotre } from "./store";

export class WebProvider implements WebviewViewProvider {
  private context: vscode.ExtensionContext;
  constructor(context: vscode.ExtensionContext) {
    this.context = context;
  }

  resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    token: vscode.CancellationToken
  ): void | Thenable<void> {
    webviewView.webview.options = {
      enableScripts: true
    };

    const { databaseURL } = sdkSotre.getState();
    webviewView.webview.html = this.getWebViewContent(this.context, "src/view/webview.html");
    webviewView.webview.onDidReceiveMessage((data) => {
      if (data === 'ready') {
        webviewView.webview.postMessage({ type: 'render', databaseURL });
      }
    });
  }

  // private async getHTMLContent(src: string): Promise<string> {
  //   return new Promise((resolve, reject) => {
  //     const htmlFilePath = path.join(__dirname, src); // HTML 文件的路径
  //     fs.readFile(htmlFilePath, { encoding: "utf-8" }, (error, data) => {
  //       if (error) {
  //         reject(error);
  //         return;
  //       }
  //       resolve(data);
  //     });
  //   });
  // }

  private getWebViewContent(context: vscode.ExtensionContext, templatePath: string) {
    const resourcePath = path.join(context.extensionPath, templatePath);
    const dirPath = path.dirname(resourcePath);
    let html = fs.readFileSync(resourcePath, "utf-8");
    // vscode不支持直接加载本地资源，需要替换成其专有路径格式，这里只是简单的将样式和JS的路径替换
    html = html.replace(/(<link.+?href="|<script.+?src="|<img.+?src=")(.+?)"/g, (m, $1, $2) => {
      return $1 + vscode.Uri.file(path.resolve(dirPath, $2)).with({ scheme: "vscode-resource" }).toString() + '"';
    });
    return html;
  }

  // private getExtensionFileVscodeResource(context: vscode.ExtensionContext, relativePath: string) {
  //   const diskPath = vscode.Uri.file(path.join(context.extensionPath, relativePath));
  //   return diskPath.with({ scheme: "vscode-resource" }).toString();
  // }
}

// export class TreeProvider implements TreeDataProvider<vscode.TreeItem> {
//   getTreeItem(element: TreeView): vscode.TreeItem | Thenable<vscode.TreeItem> {
//     return element;
//   }

//   async getChildren(element?: TreeView | undefined) {
//     const items = ["aaa", "bb", "cc"].map((label) => {
//       const treeItem = new TreeView(label, vscode.TreeItemCollapsibleState.None);
//       // 为每个项添加命令
//       treeItem.command = {
//         command: "code-snippets.edit",
//         title: "TreeView Item Click",
//         arguments: [label] // 将项的标签作为参数传递
//       };
//       return treeItem;
//     });

//     return [...items];
//   }
// }

// export class TreeView extends vscode.TreeItem {
//   constructor(public readonly label: string, public readonly collapsibleState: vscode.TreeItemCollapsibleState) {
//     super(label, collapsibleState);
//   }
// }
