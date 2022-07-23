// 导入模块
var http = require('http');
var fs = require('fs');
var path = require('path');
// 导入mysql
var mysql = require('mysql');

// 创建server实例
var server = http.createServer()

// 创建server端与数据库的链接
var connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:"123456",
    database:'vscode'
})

// 监听事件，设置server的端口号和启动server时需要开启的服务
server.listen(8099,function(){
    console.log('服务已开启')
    // 建立连接
    connection.connect()
});

// 编写服务端请求，通过回调函数做回应
server.on('request',function(request,response){
    var url = request.url
    url = url.split("?")[0]

    // 读取数据库数据
    if(url == '/datas'){
                connection.query("select number,time from oneday",function(error,results,field){
                    var res = {
                        "xdata":[],
                        "ydata":[]
                    }
                    for(var i in results){
                        res.xdata.push(results[i].time)
                        res.ydata.push(results[i].number)
                    }
                    response.setHeader("Content-type","application/json;charset=utf-8")
                    response.end(JSON.stringify(res))
                })        
    }
    else if(url == '/datas1'){
        connection.query("select month,life,industry,agriculture,business from electricity",function(error,results1,field){

            var res1 = {
                "xdata1":[],
                "ydata1":[],
                "ydata2":[],
                "ydata3":[],
                "ydata4":[]
            }
            for(var i in results1){
                res1.xdata1.push(results1[i].month)
                res1.ydata1.push(results1[i].life)
                res1.ydata2.push(results1[i].industry)
                res1.ydata3.push(results1[i].agriculture)
                res1.ydata4.push(results1[i].business)
            }
            response.setHeader("Content-type","application/json;charset=utf-8")
            response.end(JSON.stringify(res1))
        })
    }
    else if(url == '/datas2'){
        connection.query("select city,cultural,medical,public,education from go_money",function(error,results2,field){

            var res2 = {
                "ydata1":[],
                "ydata2":[],
                "ydata3":[],
                "ydata4":[],
                "ydata5":[]
            }
            for(var i in results2){
                res2.ydata1.push(results2[i].city)
                res2.ydata2.push(results2[i].cultural)
                res2.ydata3.push(results2[i].medical)
                res2.ydata4.push(results2[i].public)
                res2.ydata5.push(results2[i].education)
            }
            response.setHeader("Content-type","application/json;charset=utf-8")
            response.end(JSON.stringify(res2))
        })
    }
    else{
        // 规范生成路径
        var fpath = path.join(__dirname,url)
        fs.readFile(fpath,function(errorState,datas){
            // 如果文件读取错误，返回404提示
            if(errorState != null){
                response.end('404!Not Found');
            }else{
                response.end(datas)
            }
        })
    }
})