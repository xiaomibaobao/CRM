//->第一步：把所有的客户信息都获取到，并且绑定在HTML页面中
var boxList = document.getElementById("boxList");
var bottom=document.getElementById('bottom'),
    pageList=document.getElementById('pageList'),
    pageLi=pageList.getElementsByTagName('li');
    search=document.getElementById('search');

var n=1;total=0;
dataBind();
function dataBind(val){
    ajax({
        url: "/getList",
        type: "get",
        async:true,
        cache:false,
        dataType:'json',
        data:{n:n,val:val},
        success: function (data) {
            var str = '',
                adata=data['data'];
            total=data['total'];
            for (var i = 0, len = adata.length; i < len; i++) {
                var curData = adata[i];
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

            str='';
            for(var i=1;i<=total;i++){
                str+='<li>'+i+'</li>';
            }
            pageList.innerHTML=str;

            for(var i=0;i<total;i++){
                pageLi[i].className=(i+1)==n?'bg':null;
            }
            search.value=n;
        }
    });
}

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
            url: "/remove",
            data:{'id':cusId},
            cache:false,
            type: "get",
            async:true,
            dataType:'json',
            success: function (data) {
                if (data["code"] == 0) {
                    boxList.removeChild(tar.parentNode.parentNode);
                }
                alert(data["message"]);
            }
        });
    }
};

//bottom button
bottom.onclick=function(e){
    var tar= e.target,
        tarTag=tar.tagName.toUpperCase();
    if(tarTag=="SPAN"){
        if(tar.innerHTML=='FIRST'){
            if(n==1){return}
            n=1
        }
        if(tar.innerHTML=='PREV'){
            if(n==1){return}
            n--;
        }
        if(tar.innerHTML=='NEXT'){
            if(n==total){return}
            n++
        }
        if(tar.innerHTML=='LAST'){
            if(n==total){return}
            n=total
        }
    }
    if(tarTag=='LI'){
        if(tar.innerHTML==n){return}
        n=tar.innerHTML;
    }
    val=searchInput.value;
    dataBind(val);
};

search.onkeyup=function(e){
    var tar= e.target;
    var x=this.value;
    if(e.keyCode==13){
        var reg=/^[1-9]$/g;
        if(!reg.test(x)){
            this.value=n;
            return;
        }else{
            n=this.value;
        }
        dataBind();
    }
};

var searchInput=document.getElementById("searchInput"),
    searchBtn=document.getElementById("searchBtn"),
    val=null;
function common(){
    n=1
    if(val){
        dataBind(val);
    }else{
        dataBind();
    }
}
searchBtn.onclick=function(){
    val=searchInput.value;
    common()
};
searchInput.onkeyup=function(e){
    if(e.keyCode==13){
        val=searchInput.value;
        common()
    }
}





