var tools={
    encodeToURIString:function(data){
        if(!data){
            return "";
        }
        if(typeof data=="string"){
            return data;
        }
        var ary=[];
        for(var key in data){
            if(data.hasOwnProperty(key)){
                ary.push(encodeURIComponent(key)+'='+encodeURIComponent(data[key]));
            }
        }
        return ary.join("&");
    },
    padStringToURL:function(url,param){
        param=tools.encodeToURIString(param);
        if(!param){
            return url;
        }
        return url+(/\?/.test(url)?'&':'?')+param;
    }
}
