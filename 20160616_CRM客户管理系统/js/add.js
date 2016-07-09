var userName = document.getElementById("userName"),
    userAge = document.getElementById("userAge"),
    userPhone = document.getElementById("userPhone"),
    userAddress = document.getElementById("userAddress"),
    submit = document.getElementById("submit");

//->http://192.168.0.116/add.html?id=2&name=xxx ->{id:2,name:'xxx'}
//->获取地址栏中的问号后面传递的参数值
function queryURLParameter() {
    var obj = {},
        curURL = window.location.href,//->获取当前页面的URL地址
        reg = /([^?&=]+)=([^?&=]+)/g;
    curURL.replace(reg, function () {
        obj[arguments[1]] = arguments[2];
    });
    return obj;
}

//->获取浏览器地址中问号后面传递的参数值:如果传了ID当前操作为修改,否则为增加
var isAdd = true,
    urlObj = queryURLParameter();
if (typeof urlObj["id"] !== "undefined") {
    isAdd = false;//->不是增加操作而是修改操作
    //->获取客户的详细信息,把每一个信息分别分放入对应的文本框中
    ajax({
        url: "/getInfo",
        data:{id:urlObj["id"]},
        cache:false,
        type: "get",
        async:true,
        dataType:'json',
        success: function (data) {
            userName.value = data["name"];
            userAge.value = data["age"];
            userPhone.value = data["phone"];
            userAddress.value = data["address"];
        }
    });
}


//->绑定点击事件:实现我们的增加或者修改操作
submit.onclick = function () {
    var obj = {};
    obj.name = userName.value.replace(/^ +| +$/g, "");
    obj.age = userAge.value.replace(/^ +| +$/g, "");
    obj.phone = userPhone.value.replace(/^ +| +$/g, "");
    obj.address = userAddress.value.replace(/^ +| +$/g, "");

    var objStr = "";
    if (!isAdd) {//->修改
        obj["id"] = urlObj["id"];
        objStr = JSON.stringify(obj);

        ajax({
            url: "/update",
            type: "post",
            data: objStr,
            cache:false,
            async:true,
            dataType:'json',
            success: function (data) {

                alert(data["message"]);
                if (data["code"] == 0) {
                    window.location.href = "CRM.html";
                }
            }
        });
        return;
    }

    //->增加
    objStr = JSON.stringify(obj);
    ajax({
        url: "/add",
        type: "post",
        data: objStr,
        cache:false,
        async:true,
        dataType:'json',
        success: function (data) {
            alert(data["message"]);
            if (data["code"] == 0) {
                window.location.href = "CRM.html";
            }
        }
    });
};