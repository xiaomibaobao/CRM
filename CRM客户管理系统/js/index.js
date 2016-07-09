//->第一步：把所有的客户信息都获取到，并且绑定在HTML页面中
var boxList = document.getElementById("boxList");
ajax({
    url: "/getAllList",
    type: "get",
    success: function (data) {//->data就是我们从服务器获取到的JSON格式的数据
        var str = '';
        for (var i = 0, len = data.length; i < len; i++) {
            var curData = data[i];
            str += '<li>';
            str += '<span class="w50">' + curData["id"] + '</span>';
            str += '<span class="w200">' + curData["name"] + '</span>';
            str += '<span class="w50">' + curData["age"] + '</span>';
            str += '<span class="w200">' + curData["phone"] + '</span>';
            str += '<span class="w250">' + curData["address"] + '</span>';
            str += '<span class="w150">';
            str += '<a href="add.html?id=' + curData["id"] + '">修改</a>';
            str += '<a href="javascript:;" cusId="' + curData["id"] + '">删除</a>';//->在当前按钮的自定义属性上存储客户ID,删除的时候获取到即可
            str += '</span>';
            str += '</li>';
        }
        boxList.innerHTML = str;
    }
});

//->给删除按钮绑定点击事件,点击的时候实现删除操作
boxList.onclick = function (ev) {
    ev = ev || window.event;
    var tar = ev.target || ev.srcElement,
        tarTag = tar.tagName.toUpperCase();
    if (tarTag === "A" && tar.innerHTML === "删除") {
        var cusId = tar.getAttribute("cusId");
        var flag = window.confirm("确定要删除编号为 [ " + cusId + " ] 这个客户吗?");
        if (!flag) {//->如果flag为false,说明我们点击的是取消按钮,相反为true是删除按钮
            return;
        }
        ajax({
            url: "/remove?id=" + cusId + "&_=" + Math.random(),
            type: "get",
            success: function (data) {
                if (data["code"] == 0) {
                    boxList.removeChild(tar.parentNode.parentNode);
                }
                alert(data["message"]);
            }
        });
    }
};








