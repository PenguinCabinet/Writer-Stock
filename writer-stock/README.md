# ✍Writer-Stock README(JP)

## ℹ️概要
![img1](https://github.com/PenguinCabinet/Writer-Stock/raw/master/LT/img3.png)

Gitコミットから執筆文字数のグラフを生成できるVS Code拡張機能です。   

### 依存関係
インターネット接続とgitのインストールが必要です

## 📒使い方
![img2](https://github.com/PenguinCabinet/Writer-Stock/raw/master/LT/img7.5.png)
拡張機能をインストールすると、VS Codeの右下に「文字数の推移」というボタンができると思うので、そこをクリックしてください。   
そうすると作業ディレクトリのGitリポジトリのコミットから、執筆文字数の推移グラフを自動生成します。

### .wsignore
Gitリポジトリに「.wsignore」を作成すると、「.gitignore」と同じような感覚で、カウントしないファイルを選択できます。   
   
例えば、test.mdを文字数カウントから除外したい場合
```text:.wsignore
test.md
```

またホワイトリスト方式も利用でき、main.mdだけ文字数カウントしたい場合
```text:.wsignore
*
!main.md
```

# ✍Writer-Stock README(EN)
[Project Page](https://github.com/PenguinCabinet/Writer-Stock).     
![img](https://github.com/PenguinCabinet/Writer-Stock/raw/master/LT/img3.png)

Writer-Stock is the VS Code extension drawing automatically the graph about the number of written characters by git commits.     
For novel writer,news writer or blogger etc...


## ℹ️Features

* Automatically makeing the graph of the num of chars!

## 🆗Requirements
It requires the Internet and CLI git client.

###s 📒How to use !
![img2](https://github.com/PenguinCabinet/Writer-Stock/raw/master/LT/img7.5.png)     
After installing the extension, you will see a button "文字数の推移" in the lower right corner of VS Code.   
Then it will automatically generate a graph of the transition of the number of characters written from the commits in the Git repository in your working directory.   

### .wsignore
If you create a ".wsignore" file in your Git repository, you can select files not to be counted in the same way as ".gitignore".   
   
For example, if you want to exclude test.md from the character count
```text:.wsignore
test.md
```

You can also use the whitelist method, for example, if you want to count only main.md
```text:.wsignore
*
!main.md
```

# Release Notes

Users appreciate release notes as you update your extension.

## 0.0.3
* Support .wsignore

## 0.0.2
* Start on launch of VS Code.   
* Add the logo icon.

## 0.0.1
* First version!
