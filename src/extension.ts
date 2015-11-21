import * as vscode from 'vscode';

/**
 * Activates the extension.
 */
export function activate(context: vscode.ExtensionContext) {
  const controller = new NormalizeController();
  context.subscriptions.push(controller);
}

/**
 * Controller for handling normalization.
 */
class NormalizeController {

  private _disposable: vscode.Disposable;

  private _matcher: RegExp;
  private _replacement : string;
  private _spaces : string;

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

    let editorConfigurationNode = vscode.workspace.getConfiguration('editor');
    let {indent_style, indent_size} = this._toEditorConfig(
        editorConfigurationNode.get<string | boolean>('insertSpaces'),
        editorConfigurationNode.get<string | number>('tabSize')
    );

    this._spaces = (new Array(parseInt(indent_size) + 1).join(' '));
    this._replacement = (indent_style === 'space') ? this._spaces : '\t';
    this._matcher = (indent_style === 'space') ? /\t/g : new RegExp(this._spaces, 'g');
  }

	private _onDocumentSaved() {
		this.normalize();
	}

	private _onConfigChanged() {
    this._loadConfig();
	}

  // Taken from https://github.com/Microsoft/vscode-editorconfig/blob/master/src/editorConfigMain.ts#L159-L183
  private _toEditorConfig(configuredInsertSpaces:boolean|string, configuredTabSize:number|string) {

    let indent_style = 'tab';
    let indent_size = '4';

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
      indent_size = String(configuredTabSize);
    }

    return {
      indent_style: indent_style,
      indent_size: indent_size
    };
  }

	dispose() {
		this._disposable.dispose();
	}

  normalize(){

    if (!vscode.window.activeTextEditor) {
      return;
    }

    const doc = vscode.window.activeTextEditor.document;

    if (doc.lineCount === 0 || !doc.getText().match(this._matcher)){
      return;
    }

    vscode.window.activeTextEditor.edit(editBuilder => {

      let line : vscode.TextLine;
      for(var i = 0; i < doc.lineCount; i++){

        line = doc.lineAt(i);
        if (line.text.length === 0){
          continue;
        }

        if (line.text.match(this._matcher)){
          editBuilder.replace(
            new vscode.Range(
              new vscode.Position(line.lineNumber, 0),
              new vscode.Position(line.lineNumber, line.text.length)),
            line.text.replace(this._matcher, this._replacement));
        };
      };

    }).then(() => doc.save());
  }
}