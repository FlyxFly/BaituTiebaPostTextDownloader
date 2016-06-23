//在这里填入要爬的页面，如果只需要楼主的回复，在链接最后加上?see_lz=1
var url="http://tieba.baidu.com/p/4338869559?see_lz=1"//只看楼主
//var url="http://tieba.baidu.com/p/4338869559"  //所有回复
var cheerio = require('cheerio');
var promise=require("bluebird");
var fs=require("fs");
var http = require('http');


http.get(url, function(res) {
    var html = ""
    res.on("data", function(data) {
        html += data
    })
    res.on("end", function() {
        var pageInfo = getPageCount(html);
        var fetchUrlArray = [];
        for (var i = 1; i <= pageInfo.lastPageNum; i++) {
            var currUrl = url + "&pn=" + i;
            fetchUrlArray.push(getPageAsync(currUrl));
        }
        promise.all(fetchUrlArray).then(function(pages) {
            pages.forEach(function(html) {
                write(pageInfo.title + ".txt", getContent(html))
            })
        })
        console.log("正在下载数据，请稍候……");
        var nowDate = new Date();
        var nowTime = nowDate.toLocaleDateString() + " " + nowDate.toLocaleTimeString();
        write(pageInfo.title + ".txt", "最后刷新时间：" + nowTime + "\r\n")
    })
}).on("error", function(e) {
    console.error("获取标题和页码出错： " + e)
})



function getPageAsync(url) {
    return new promise(function(resolve, reject) {
        console.log("正在下载: " + url);
        http.get(url, function(res) {
            var html = ""
            res.on("data", function(data) {
                html += data
            })
            res.on("end", function() {
                resolve(html)
            })
        }).on("error", function(e) {
            reject(e);
            console.log("获取页面内容出错： " + e)
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
        data = JSON.parse(data);
        newline = "\r\n";
        var _content = data.content.content.replace(/\<br\>/g, "\r\n"); //替换html换行为文本换行
        var _content = _content.replace(/<img[^>]+>/g, ""); //删除图片
        //console.log(data.content.post_no + "楼：")
        //console.log("作者:" + data.author.user_name);
        // console.log(_content);
        //console.log("--------------------------------");
        content += data.content.post_no + "楼：" + newline + "作者:" + data.author.user_name + newline + _content + newline + "--------------------------------" + newline;
    })
    console.log("正在处理第" + currPageNum + "页," + "共" + lastPage + "页");
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
