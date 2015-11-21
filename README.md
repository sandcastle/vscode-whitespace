# vscode-whitespace

> Normalizes whitespace in files


## Install

Press <kbd>F1</kbd> and narrow down the list commands by typing `extension`. Pick `Extensions: Install Extension`.

Simply pick the `whitespace` extension from the list.


## Usage

#### File Save

The extension automatically runs on file save which is automatically handled by VS Code
at regular intervals.

#### Keyboard Shortcut

The extension can also be executed on demand 

- **Mac**: Shift + Command + Space
- **Windows**: Shift + Control + Space


## Configuration

The rules for normalizing whitespace come from the project's `.vscode/settings.json` file,
which has two properties:

- insertSpaces
- tabSize

#### .editorconfig

This extension also plays nicely with the [vscode-editorconfig](https://github.com/Microsoft/vscode-editorconfig)
extension.


## Performance

I have tested this plugin on files up to 70K lines and it performs pretty well, but
if there is anything that can be improved please send a PR.


Have fun! :beers:
