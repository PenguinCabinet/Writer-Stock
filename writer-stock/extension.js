// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
//const gitLog = require('git-log');
const gitlog = require("gitlog").default;
const { execSync } = require('child_process')
const fs = require('fs');
const parse = require('parse-gitignore');
const path = require('path');


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */

function Get_wsignore(){
	const fname=".wsignore";
	const fpath=path.join(vscode.workspace.workspaceFolders[0].uri.fsPath,fname);

	let Black_list=[];
	let White_list=[];
	try {
		fs.statSync(fpath);
		let wsignore_text=fs.readFileSync(fpath, 'utf8');
		let list=parse(wsignore_text).patterns;
		list.forEach((e)=>{
			let text=e.replace("*",`.+`).replace("/",`[\/\\\\]`);
			if(text[0]=="!")White_list.push(text.slice(1));
			else Black_list.push(text);
		})
		//console.log(parse(wsignore_text));
	} catch(err) {
	}

	return [Black_list,White_list]
}

function Get_List_Files(dir,relative_path,wsignore){
	let wsignore_black=wsignore[0];
	let wsignore_white=wsignore[1];

	return fs.readdirSync(dir, { withFileTypes: true }).flatMap(function(dirent){
		if(".git"==dirent.name)
			return;
		if(".wsignore"==dirent.name)
			return;
		let Is_add=true;
		wsignore_black.forEach(
			(e)=>{
				//console.log(e);
				//console.log(path.join(relative_path,dirent.name));
				if(
					path.join(relative_path,dirent.name).match(new RegExp(e,"g"))
				){
					Is_add=false;
				}
			}
		);
		wsignore_white.forEach(
			(e)=>{
				//console.log(e);
				//console.log(path.join(relative_path,dirent.name));
				if(
					path.join(relative_path,dirent.name).match(new RegExp(e,"g"))
				){
					Is_add=true;
				}
			}
		);
		if(Is_add)
			return dirent.isFile() ? [`${dir}/${dirent.name}`] : Get_List_Files(`${dir}/${dirent.name}`,path.join(relative_path,dirent.name),wsignore);
		else
			return undefined;
	}).filter((e)=>e!==undefined);
}

function Get_line_number_one_diff(now_commit_hash,wsignore){
	try {
		const stdout1 = execSync(`git checkout master`, {
			cwd: vscode.workspace.workspaceFolders[0].uri.fsPath
		});		
		const stdout2 = execSync(`git checkout ${now_commit_hash}`, {
			cwd: vscode.workspace.workspaceFolders[0].uri.fsPath
		});		
	} catch (error) {}
	const file_list=Get_List_Files(vscode.workspace.workspaceFolders[0].uri.fsPath,"",wsignore);
	console.log(file_list);
	
	const all_line_number=file_list.map(e => {
		let text = fs.readFileSync(e, {encoding: 'utf-8'});
		//console.log(text);
		text=text
		.replace("\n","")
		.replace("\s","");

		return [...text].length;
	}).reduce((e1,e2)=>e1+e2,0);
	//console.log(all_line_number)

	return all_line_number;
	//return stdout.toString();
}
function Get_line_number_all_diff(commits_hash,wsignore){
	//console.log(commits_hash.length-1)
	let A=[];
	for(let i=0;i<commits_hash.length;i++){
		const temp=Get_line_number_one_diff(commits_hash[i],wsignore);
		A.push(temp);
	}
	
	return A;
}

function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "writer-stock" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('writer-stock.draw', function () {
		// The code you place here will be executed every time your command is executed
		const options = {
			repo: vscode.workspace.workspaceFolders[0].uri.fsPath,
			number: 1000,
			author: "",
			//fields: ["hash", "abbrevHash", "subject", "authorName", "authorDateRel"],
			fields:["hash","authorDate"],
			execOptions: { maxBuffer: 1000 *1000 * 1024 },
		  };
		
		const stdout1 = execSync(`git checkout master`, {
			cwd: vscode.workspace.workspaceFolders[0].uri.fsPath
		});		
		const commits = gitlog(options);

		commits.reverse();
		const commits_hash=commits.map((e)=>e.hash);

		let re1 =  /\d+\-\d+\-\d+\s+\d+/;
		let commits_date=commits.map((e)=>e.authorDate)
		.map((e)=>e.match(re1)).filter((e)=>e!==null)
		.map((e)=>e[0]);

		let wsignore=Get_wsignore();

		const char_number_list=Get_line_number_all_diff(commits_hash,wsignore);
		const stdout2 = execSync(`git checkout master`, {
			cwd: vscode.workspace.workspaceFolders[0].uri.fsPath
		});
		
		const panel = vscode.window.createWebviewPanel(
			"writer-stock",
			"文字数の推移",
			vscode.ViewColumn.One,
			{ enableScripts: true }
		)

		//console.log(JSON.stringify(commits_date));
		//console.log(JSON.stringify(JSON.stringify(char_number_list)));

		panel.webview.html = `
<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<title>文字数の推移</title>
</head>
<body>
<div>
  <canvas id="myChart"></canvas>
</div>
<script>
  const labels = ${JSON.stringify(commits_date)};

  const data = {
    labels: labels,
    datasets: [{
      label: 'The number of chars',
      backgroundColor: 'rgb(255, 99, 132)',
      borderColor: 'rgb(255, 99, 132)',
      data: ${JSON.stringify(char_number_list)},
    }]
  };

  const config = {
    type: 'line',
    data: data,
    options: {}
  };
  const myChart = new Chart(
    document.getElementById('myChart'),
    config
  );
</script> 
</body>
</html>`
		
		// Display a message box to the user
	});

	context.subscriptions.push(disposable);
	const button = vscode.window.createStatusBarItem(
		vscode.StatusBarAlignment.Right, 
		0
	);
	
	button.command = 'writer-stock.draw';
	button.text = '文字数の推移';
	context.subscriptions.push(button);
	button.show();
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
