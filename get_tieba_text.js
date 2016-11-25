var tiebaurl="http://tieba.baidu.com/p/4851218528";//在此输入URL Input Baidu Tieba post url
var option={
	"lang":"en",//zh简体中文，en for english
	"many":false,//每层楼都显示作者名字 show author name at every floor in the result
	"seelz":true//只看楼主 get post starter's posts only
}




var myapp=new getText(tiebaurl,option);
myapp.start();

function getText(url,opt){
	this.url=opt.seelz?url+"?see_lz=1":url;
	this.option=opt;
	var language={
		"zh":{
			"downloading":"正在下载数据，请稍候……",
			"lastModified":"最后刷新时间：",
			"getTitleWrong":"获取标题和页码出错：",
			"dlSuccess":"下载成功",
			"getPageContentWrong":"获取页面内容出错：",
			"author":"作者",
			"processingContent":"正在处理页面信息：",
			"odd":"好像有什么不对劲",
			"done":"所有任务完成！"
		},
		"en":{
			"downloading":"Downloading...",
			"lastModified":"Last modified: ",
			"getTitleWrong":"Get title and page info wrong: ",
			"dlSuccess":"Download complete:",
			"getPageContentWrong":"Get page content wrong",
			"author":"Author",
			"processingContent":"Processing content...",
			"odd":"Something is not quite right...",
			"done":"Done!"
		}
	}
	this.lang=language[opt.lang];
	var obj=this;
	var cheerio = require("cheerio");
	var promise=require("bluebird");
	var fs=require("fs");
	var http = require("http");

	this.start=function(){
		http.get(obj.url, function(res) {
	        var html = "";
	        res.on("data", function(data) {
	            html += data;
	        })
	        res.on("end", function() {
	            var pageInfo = getPageCount(html);
	            var fetchUrlArray = [];
	            for (var i = 1; i <= pageInfo.lastPageNum; i++) {
	                var currUrl = obj.option.seelz?obj.url+"&pn="+i:obj.url+"?pn="+i
	                fetchUrlArray.push(getPageAsync(currUrl));
	            }
	            promise.all(fetchUrlArray).then(function(pages) {
	                pages.forEach(function(html) {
	                    write(pageInfo.title + ".txt", getContent(html));
	                })
	            }).then(function(){
	            	console.log(obj.lang.done);
	            })
	            console.log(obj.lang.downloading);
	            var nowDate = new Date();
	            var nowTime = nowDate.toLocaleDateString() + " " + nowDate.toLocaleTimeString();
	            write(pageInfo.title + ".txt", obj.lang.lastModified + nowTime + "\r\n");
	        })
	    }).on("error", function(e) {
	        console.error(obj.lang.getTitleWrong + e)
	    })
	}

	function getPageAsync(url) {
	    return new promise(function(resolve, reject) {
	        // console.log("正在下载: " + url);
	        http.get(url, function(res) {
	            var html = ""
	            res.on("data", function(data) {
	                html += data
	            })
	            res.on("end", function() {
	            	console.log(obj.lang.dlSuccess+url)
	                resolve(html)
	            })
	        }).on("error", function(e) {
	            reject(e);
	            console.log(obj.lang.getPageContentWrong + e)
	        })
	    })
	}



	function getContent(rawdata) {
	    var $ = cheerio.load(rawdata);
	    var posts = $(".l_post");
	    var pageData = getPageCount(rawdata);
	    var currPageNum = pageData.currPageNum;
	    var lastPage = pageData.lastPageNum;
	    var content = "";
	    posts.each(function(index, element) {
	        var data = ($(element).attr("data-field"));
	        var floorCache=0;
	        if(data){
	            var parsedData = JSON.parse(data);
	            newline = "\r\n";
	            var _content = parsedData.content.content.replace(/\<br\>/g, "\r\n"); //替换html换行为文本换行
	            var _content = _content.replace(/<img[^>]+>/g, ""); //删除图片
	            floorCache=parsedData.content.post_no;
	            //console.log(parsedData.content.post_no + "楼：")
	            //console.log("作者:" + parsedData.author.user_name);
	            // console.log(_content);
	            //console.log("--------------------------------");
	            if(obj.option.many || parsedData.content.post_no==1){
	            	content += parsedData.content.post_no + "：" + newline + obj.lang.author + parsedData.author.user_name + newline + _content + newline + "--------------------------------" + newline;
	            }else{
	            	content += parsedData.content.post_no + "：" + newline + _content + newline +"--------------------------------" + newline;
	            }
	            
	        }else{
	            console.log(obj.lang.odd+"\r\n"+index+":"+data);
	        }
	        
	    })
	    console.log(obj.lang.processingContent + currPageNum +"/"+ lastPage);
	    return content;
	}
	 
	function getPageCount(rawdata){
	    var $ = cheerio.load(rawdata);
	    var posts = $(".l_post");
	    var pager = $(".pager_theme_5 a");
	    var title=$(".core_title_txt").attr("title");
	    if ($(pager[pager.length - 1]).attr("href")) {
	        var lastPage = $(pager[pager.length - 1]).attr("href").split("pn=")[1];
	        var currPage = $(".tP")[0];
	        var currPageNum = $(currPage).text();
	        lastPage = (currPageNum <= lastPage) ? lastPage : currPageNum;
	    }
	    return {"currPageNum":currPageNum,"lastPageNum":lastPage,"title":title};
	}
	 
	function write(file,content){
	    fs.open(file,"a",0644,function(e,fd){
	    if(e) throw e;
	    fs.write(fd,content,function(e){
	        if(e) throw e;
	        fs.closeSync(fd);
	    })
	})
	}
}
