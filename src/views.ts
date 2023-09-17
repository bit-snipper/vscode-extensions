import * as vscode from "vscode";
import { WebviewViewProvider } from "vscode";
import * as fs from "fs";
import path from "path";
import { sdkSotre } from "./store";

export class WebProvider implements WebviewViewProvider {
  private context: vscode.ExtensionContext;
  private messageHandler: Map<string, (callback?: Function) => Thenable<any>> = new Map();

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
  }

  resolveWebviewView(webviewView: vscode.WebviewView, context: vscode.WebviewViewResolveContext, token: vscode.CancellationToken): void | Thenable<void> {
    webviewView.webview.options = {
      enableScripts: true
    };

    const { databaseURL } = sdkSotre.getState();
    webviewView.webview.html = this.getWebViewContent(this.context, "src/view/webview.html");

    this.messageHandler.set("sync", async (cb?: Function) => {
      await webviewView.webview.postMessage({ type: "sync" });
      cb && cb();
    });


    webviewView.webview.onDidReceiveMessage((data) => {
      if (data === "ready") {
        webviewView.webview.postMessage({ type: "render", databaseURL });
      }
    });
  }

  postMessage(key: string, cb?: Function) {
    const fn = this.messageHandler.get(key);
    fn && fn(cb);
  }

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
}
