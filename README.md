# 贴吧文字内容保存
本脚本可以将一个百度贴吧帖子的内容保存为txt文件。可选只看楼主。
This script can save a post on http://tieba.baidu.com into a txt file. You can choose if save post starter's posts only.

#Dependencies依赖库
Cheerio, Bluebird

#Usage 用法
1.安装[NodeJs](https://nodejs.org/zh-cn/)。
2.选择一个目录作为项目目录来存放依赖模块。
3.用命令行打开项目目录，输入命令`npm install bluebird cheerio`。
4.打开js文件输入要保存的帖子地址。
5.使用node运行该脚本`node get_tieba_text.js`。

1.  Install [NodeJs](https://nodejs.org/zh-cn/).
2.  Choose a directory as your working directory to put your modules.
3.  Install dependency module via commmand line`npm install bluebird cheerio`. 
4.  Open this js file and edit the url. 
5.  Run this script with node`node get_tieba_text.js`.
