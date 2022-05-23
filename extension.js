const vscode = require('vscode');
const path = require("path")


/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	context.subscriptions.push(
		vscode.commands.registerCommand("vscode-extesnion-vue-template.openVueApp", async () => {
			const panel = vscode.window.createWebviewPanel(
				"vscode-extesnion-vue-template:panel",
				"Web App Panel",
				vscode.ViewColumn.One,
				{ enableScripts: true }
			);
			const vsCodeCss = panel.webview.asWebviewUri(
				vscode.Uri.file(path.join(context.extensionPath, "media", "vscode.css"))
			);
			const resetCss = panel.webview.asWebviewUri(
				vscode.Uri.file(path.join(context.extensionPath, "media", "reset.css"))
			);
			const mainCss = panel.webview.asWebviewUri(
				vscode.Uri.file(
					path.join(
						context.extensionPath,
						"dist-web/dist-web",
						"helloworld.css"
					)
				)
			);
			const script = panel.webview.asWebviewUri(
				vscode.Uri.file(
					path.join(context.extensionPath, "dist-web", "mainview.js")
				)
			);
			const nonce = getNonce();
			panel.webview.html = mainPanelHtml(vsCodeCss, resetCss, mainCss, script, nonce);
		})
	);

	// Making sidebar
	var thisProvider = {
		resolveWebviewView: function (thisWebview, thisWebviewContext, thisToken) {
			thisWebview.webview.options = { enableScripts: true };
			const vsCodeStylePath = vscode.Uri.file(
				path.join(context.extensionPath, "media", "vscode.css")
			);
			const resetStylePath = vscode.Uri.file(
				path.join(context.extensionPath, "media", "reset.css")
			);
			const scriptPath = vscode.Uri.file(
				path.join(context.extensionPath, "dist-web", "sidebar.js")
			);
			const cssPath = vscode.Uri.file(
				path.join(context.extensionPath, "dist-web/dist-web", "sidebar.css")
			);
			const nonce = getNonce();
			const vsCodeCss = thisWebview.webview.asWebviewUri(vsCodeStylePath);
			const resetCss = thisWebview.webview.asWebviewUri(resetStylePath);
			const script = thisWebview.webview.asWebviewUri(scriptPath);
			const mainCss = thisWebview.webview.asWebviewUri(cssPath);
			thisWebview.webview.html = sidebarHtml(vsCodeCss, resetCss, mainCss, script, nonce);

			thisWebviewContext.context = context;
			thisToken.isCancellationRequested = true;
		},
	};
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider("sidebar-view", thisProvider)
	);
}

// this method is called when your extension is deactivated
function deactivate() { }
function mainPanelHtml(vsCodeCss, resetCss, mainCss, script, nonce) {
	return `
	<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width,initial-scale=1" />  
			<link href="${resetCss}" rel="stylesheet">
			<link href="${vsCodeCss}" rel="stylesheet">
			<link href="${mainCss}" rel="stylesheet">  
			<title>Web Pages Panel</title>
			<script nonce="${nonce}">    
				const tsvscode = acquireVsCodeApi();
			</script>
	</head>     
	<body>
		<div id="app"></div>
		<script src="${script}" nonce="${nonce}">
	</body>
	</html> 
	`
}
function sidebarHtml(vsCodeCss, resetCss, mainCss, script, nonce) {
	return `
	<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />  
          <link href="${resetCss}" rel="stylesheet">
          <link href="${vsCodeCss}" rel="stylesheet">
          <link href="${mainCss}" rel="stylesheet">  
          <title>Web Pages Panel</title>
          <script nonce="${nonce}">    
              const tsvscode = acquireVsCodeApi();
          </script>
  </head>     
  <body>
      <div id="app"></div>
      <script src="${script}" nonce="${nonce}">
  </body>
  </html>   
	`
}
function getNonce() {
	let text = "";
	const possible =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	for (let i = 0; i < 32; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}

module.exports = {
	activate,
	deactivate
}
