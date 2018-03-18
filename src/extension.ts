import * as vscode from 'vscode';
import NormalizeController from './normalize-controller';

/**
 * Activates the extension.
 */
export function activate(context: vscode.ExtensionContext) {
  const controller = new NormalizeController();
  context.subscriptions.push(controller);
}
