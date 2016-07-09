//->suffixType这个模块就是根据后缀名获取到MIME类型
function getType(suffix) {
    var type = "text/plain";
    switch (suffix) {
        case "HTML":
            type = "text/html";
            break;
        case "CSS":
            type = "text/css";
            break;
        case "JS":
            type = "text/javascript";
            break;
    }
    return type;
}
module.exports.getType = getType;