# BDTiebaTextCrawler基于NodeJs的百度贴吧文本爬虫
A crawler base on NodeJs to crawli all replay text in one post of http://tieba.baidu.com and put them in a txt file. Useful when someone posts a story in many replies.
可以爬取一个主贴下面所有回复的文本内容。当一个楼主在一个主贴讲故事，发了很多回复，这个工具可以把楼主的所有回复下载回来，存到一个txt文件中。

#Dependencies依赖库
Cheerio, Bluebird

#Usage 用法
>1、Install NodeJs安装NodeJs
>2、Choose a directory as your working directory to put your modules选择一个目录作为项目目录来存放依赖模块
>3、Install dependency module via commmand line. 用命令行打开项目目录，输入命令[code]npm install bluebird cheerio[/code]
>4、Open this js file and edit the url. 打开js文件输入要爬取的url.
>5、Run. 使用命令[code]node pachong.promise.done.js[/code]
