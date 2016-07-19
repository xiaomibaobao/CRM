(function () {
    var isUndefind = function (a) {
        return a === void 0;
    };
    var ajax = function (options) {
        console.log(options);
        if (!tools.getType(options,'Object')) {
            throw new Error('参数类型错误');
        }
        var def = {
            url: '',// 请求的路径
            data: null, // 发送的参数
            dataType: 'text',// 按照指定格式格式化服务器返回的数据
            headers: null,// 自定义请求首部
            method: 'get',//是指定http method 请求
            success: null,// ajax成功时执行的函数
            error: null,// ajax失败时执行的函数
            async: true,//是否为异步请求
            cache: false// 是否缓存该请求
        };
        for (var k in options) {
            def[k] = options[k];
        }
        var xhr = new XMLHttpRequest();
        var isGet = /(GET|HEAD|DELETE)/ig.test(def.method);
        if (def.data) {
            def.data = tools.encodeData(def.data, isGet);
        }
        if (isGet) {
            def.url = tools.padStringToURL(def.url, def.data);
            def.data = void 0;
            console.log(def.data)
        }
        if (def.cache === false) {
            def.url = tools.padStringToURL(def.url, '_=' + Math.random());
        }
        console.log(def.method);
        xhr.open(def.method, def.url, def.async);
        if (def.headers && tools.getType(def.headers, 'Object') && xhr.setRequestHeader) {
            for (var key in  def.headers) {
                xhr.setRequestHeader(key, def.headers[key])
            }
        }
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (/^2\d{2}$/gi.test(xhr.status)) {
                    try {
                        var data = xhr.responseText;
                        data = tools.JSONParse(data);
                        if (typeof  def.success == 'function') {
                            def.success(data)
                        }
                    } catch (e) {
                        if (typeof def.error == 'function') {
                            def.error(data)
                        }
                    }
                } else {
                    if (typeof def.error == 'function') {
                        def.error(xhr);
                    }
                }
            }
        };
        xhr.send(def.data);

    };
    var tools = {
        getType: function (data, type) {
            return Object.prototype.toString.call(data) === '[object '+ type+']';
        },
        encodeData: function (data, isGet) {
            if (!data) {
                return '';
            }
            if (this.getType(data, 'String')) {
                return data
            }
            var ary = [];
            for (var n in data) {
                if (isGet) {
                    ary.push(n + '=' + data[n])
                } else {
                    ary.push(encodeURIComponent(n) + '=' + encodeURIComponent(data[n]))
                }
            }
            return ary.join('&');
        },
        padStringToURL: function (url, data) {
            var data = this.encodeData(data);
            return url = url + (/\?/ig.test(url) ? '&' : '?') + data;
        },
        JSONParse: function (jsonString) {
            if (this.getType(jsonString, 'Object')) {
                return jsonString;
            }
            return "JSON" in  window ? JSON.parse(jsonString) : eval('(' + jsonString + ')')
        }
    };

    this.ajax = ajax;
})();
