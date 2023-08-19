import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

export class TreeProvider implements vscode.TreeDataProvider<Webpanel> {
  private _onDidChangeTreeData: vscode.EventEmitter<Webpanel | undefined | void> = new vscode.EventEmitter<
    Webpanel | undefined | void
  >();

  readonly onDidChangeTreeData: vscode.Event<Webpanel | undefined | void> = this._onDidChangeTreeData.event;

  constructor() {}

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: Webpanel): vscode.TreeItem {
    const treeItem = new vscode.TreeItem("Open Webview");

    treeItem.command = {
      command: "code-snippets.openWeb",
      title: "Open Webview"
    };
    return treeItem;
  }

  getChildren(element?: Webpanel): Thenable<Webpanel[]> {
    return Promise.resolve([]);
  }
}

export class Webpanel extends vscode.TreeItem {}
