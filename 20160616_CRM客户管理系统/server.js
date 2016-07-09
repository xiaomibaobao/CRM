//->导入所需要的模块
var http = require("http"),
    fs = require("fs"),
    url = require("url");
var suffixType = require("./nodeModule/suffixType");

//->创建SERVER服务
var reg = /\.(HTML|CSS|JS)/i;
var sv = http.createServer(function (req, res) {
    //->接收客户端的请求信息
    var urlObj = url.parse(req.url, true),
        pathname = urlObj.pathname,
        query = urlObj.query;

    //->资源文件的处理
    if (reg.test(pathname)) {
        try {
            //->获取资源文件的后缀名,通过后缀名计算出其MIME类型
            var suffix = reg.exec(pathname)[1].toUpperCase(),
                suType = suffixType.getType(suffix);

            //->根据请求资源文件的路径获取到文件的中代码,并且把内容响应给客户端
            var conFile = fs.readFileSync("." + pathname, "utf8");
            res.writeHead(200, {'content-type': suType + ';charset=utf-8;'});
            res.end(conFile);
        } catch (e) {
            res.writeHead(404, {'content-type': 'text/plain;charset=utf-8;'});
            res.end('请求的资源文件在服务器中并不存在!');
        }
        return;
    }
    //
    var path = "./nodeModule/stuffInfo.json";
    var pathAdmin = "./nodeModule/admin.json";
    if (pathname == "/login") {
        var temp = "";
        req.addListener("data", function (postCon) {
            temp += postCon;

        });
        req.addListener("end", function () {
            var con = fs.readFileSync(pathAdmin, "utf8");
            con = JSON.parse(con);

            temp = JSON.parse(temp);
            for (var i = 0; i < con.length; i++) {
                var curCon = con[i];
                if (temp.name == curCon.name && temp.password == curCon.password) {
                    res.end(JSON.stringify({
                        "code": 0,
                        'message':'登陆成功!'
                    }));
                } else {
                    res.end(JSON.stringify({
                        "code": 1,
                        'message':'登陆失败!'
                    }));
                }
            }
        })
    }
    //->获取所有的客户信息
    if (pathname === "/getList") {
        var n = query['n'] || 1,
            arr = [],
            total = 0,
            curData = JSON.parse(fs.readFileSync(path, 'utf8'));
        var val=query['val'];
        if(val!=='undefined'){
            var ary=[];
            for(var i=0;i<curData.length;i++){
                var cur=curData[i].name;
                if(cur.indexOf(val)>-1){
                    ary.push(curData[i])
                }
            }
            curData=ary;
        }
        console.log(curData)
        for (var i = (n - 1) * 10; i < n * 10; i++) {
            if (!curData[i]) {
                break
            }
            arr.push(curData[i]);
        }

        var obj = {
            total: Math.ceil(curData.length / 10),
            data: arr
        };
        res.writeHead(200, {'content-type': 'application/json;charset=utf-8'});
        res.end(JSON.stringify(obj));
    }

    //->新增用户
    if (pathname === "/add") {
        var addTemp = "";
        req.addListener("data", function (postCon) {
            addTemp += postCon;
        });
        req.addListener('end', function () {
            var con = fs.readFileSync(path, "utf8");
            con = JSON.parse(con);
            addTemp = JSON.parse(addTemp);
            if (con.length === 0) {
                addTemp["id"] = 1;
            } else {
                addTemp["id"] = parseFloat(con[con.length - 1]["id"]) + 1;
            }
            con.push(addTemp);

            fs.writeFileSync(path, JSON.stringify(con));
            res.writeHead(200, {'content-type': 'application/json;charset=utf-8;'});
            res.end(JSON.stringify({
                "code": 0,
                "message": "添加成功!"
            }));
        });
        return;
    }

    //->获取指定用户的详细信息
    if (pathname === "/getInfo") {
        var con = fs.readFileSync(path, "utf8");
        con = JSON.parse(con);
        var curObj = null;
        for (var i = 0; i < con.length; i++) {
            if (con[i]["id"] == query["id"]) {
                curObj = con[i];
                break;
            }
        }
        if (!curObj) {
            curObj = {};
        }
        res.writeHead(200, {'content-type': 'application/json;charset=utf-8;'});
        res.end(JSON.stringify(curObj));
        return;
    }

    //->修改客户信息
    if (pathname === "/update") {
        var updateTemp = "";
        req.addListener("data", function (chunk) {
            updateTemp += chunk;
        });
        req.addListener("end", function () {
            updateTemp = JSON.parse(updateTemp);
            var con = JSON.parse(fs.readFileSync(path, "utf8"));
            for (var i = 0; i < con.length; i++) {
                var cur = con[i];
                if (cur["id"] == updateTemp["id"]) {
                    con.splice(i, 1, updateTemp);
                    break;
                }
            }
            fs.writeFileSync(path, JSON.stringify(con));
            res.writeHead(200, {'content-type': 'application/json;charset=utf-8;'});
            res.end(JSON.stringify({
                "code": 0,
                "message": "修改成功!"
            }));
        });
        return;
    }

    //->删除客户信息
    if (pathname === "/remove") {
        var obj = {
            "code": 1,
            "message": "删除失败!"
        };
        con = JSON.parse(fs.readFileSync(path, "utf8"));
        for (i = 0; i < con.length; i++) {
            if (con[i]["id"] == query["id"]) {
                //->可以删除
                con.splice(i, 1);
                fs.writeFileSync(path, JSON.stringify(con));
                obj = {
                    "code": 0,
                    "message": "删除成功!"
                };
                break;
            }
        }
        res.writeHead(200, {'content-type': 'application/json;charset=utf-8;'});
        res.end(JSON.stringify(obj));
    }
});
sv.listen(8888, function () {
    console.log("successed in 8888 port")
});