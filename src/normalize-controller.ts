import * as vscode from 'vscode';
import { Replacer, TabReplacer, SpaceReplacer } from './replacer'

/**
 * Controller for handling normalization.
 */
export default class NormalizeController {

  private _disposable: vscode.Disposable;

  private _replacer: Replacer; 

  constructor() {

    this._loadConfig();

    let subscriptions: vscode.Disposable[] = [];

    vscode.workspace.onDidSaveTextDocument(this._onDocumentSaved, this, subscriptions);
    vscode.workspace.onDidChangeConfiguration(this._onConfigChanged, this, subscriptions);

    let disposable = vscode.commands.registerCommand('extension.whitespace', () => {
      this.normalize();
    });
    subscriptions.push(disposable);

    this._disposable = vscode.Disposable.from(...subscriptions);
  }

  private _loadConfig(){
    const editorConfigurationNode = vscode.workspace.getConfiguration('editor');
    const { indent_style, indent_size } = this._toEditorConfig(
      editorConfigurationNode.get<string | boolean>('insertSpaces'),
      editorConfigurationNode.get<string | number>('tabSize')
    );

    this._replacer = (indent_style === 'space') ? new TabReplacer(indent_size) : new SpaceReplacer(indent_size);
  }

  private _onDocumentSaved() {
    this.normalize();
  }

  private _onConfigChanged() {
    this._loadConfig();
  }

  // Taken from https://github.com/Microsoft/vscode-editorconfig/blob/master/src/editorConfigMain.ts#L159-L183
  private _toEditorConfig(configuredInsertSpaces: boolean|string, configuredTabSize: number|string) {

    let indent_style = 'tab';
    let indent_size = 4;

    switch (configuredInsertSpaces) {
      case true:
        indent_style = 'space';
        break;
      case false:
        indent_style = 'tab';
        break;
      case 'auto':
        indent_style = 'tab';
        break;
    }

    if (configuredTabSize !== 'auto') {
      indent_size = parseInt(configuredTabSize + '', 10);
    }

    return {
      indent_style: indent_style,
      indent_size: indent_size
    };
  }

  dispose() {
    this._disposable.dispose();
  }

  normalize() {

    const editor = vscode.window.activeTextEditor;
    const doc = editor && editor.document;

    if (editor && doc.lineCount > 0) {
      editor.edit(editBuilder => {

        editBuilder.replace(
          new vscode.Range(
            new vscode.Position(0, 0),
            new vscode.Position(doc.lineCount - 1, doc.lineAt(doc.lineCount - 1).text.length)),
          this._replacer.replace(doc.getText()));

      }).then(() => doc.isDirty && doc.save());
    }
  }
}
