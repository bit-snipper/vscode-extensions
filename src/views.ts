import * as vscode from "vscode";
import { WebviewViewProvider } from "vscode";

export class WebProvider implements WebviewViewProvider {
  resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    token: vscode.CancellationToken
  ): void | Thenable<void> {
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
