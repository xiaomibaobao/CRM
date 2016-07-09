# CRM员工管理系统

标签：node native-javascript ajax jsonp crm

需要clone到本地，然后启动server，在浏览器中输入`localhost:8888/index.html`或者`你的ip + :8888/index.html`即可进入登陆界面。

- 登陆名admin，密码123456，即可进入CRM管理系统。
- 可以进行员工xix信息的增删改查以及通过ajax实现的数据列表分页。
- 可以对员工名进行搜索，并返回数据。
- API接口如下：其他功能coming soon。

```
->验证登录信息(xxx都是用户在页面的文本框中自己输入的信息内容)
  URL:/login  POST
  参数:JSON格式字符串
      '{"name":"xxx","password":xxx}'

  返回值:JSON格式字符串
      {
        "code":0/1, ->成功(0)或者失败(1)
        "message":"添加成功!/添加失败!"
      }

->获取本页的信息
  URL:/getList  GET
  参数:无
  返回:JSON格式的字符串

->新增加信息(xxx都是用户在页面的文本框中自己输入的信息内容)
  URL:/addInfo  POST
  参数:JSON格式字符串
      '{"name":"xxx","age":xxx,"phone":"xxx","address":"xxx"}'

  返回值:JSON格式字符串
      {
        "code":0/1, ->成功(0)或者失败(1)
        "message":"添加成功!/添加失败!"
      }

->获取指定id的详细信息
  URL:/getInfo  GET
  参数:?id=xxx  ->把要获取用户的编号传递给服务器端即可
  返回:JSON格式字符串
      {
         "id":xxx,
         "name":"xxx"
         ...
      }
    ps:sever中规定了一页十个。

->修改指定的信息
  URL:/update POST
  参数:
     {"id":xxx,"name":"xxx"....}
  返回:
     {
       "code":0/1,
       "message":"修改成功!/修改失败!"
     }

->删除信息
  URL:/remove GET
  参数:?id=xxx
  返回:
     {
       "code":0/1,
       "message":"删除成功!/删除失败!"
     }

->搜索功能
  URL:/getList   GET
  参数:?val=xxx
  返回:
     JSON格式字符串
           {
              "id":xxx,
              "name":"xxx"
              ...
           }
         ps:sever中规定了一页十个。
```
                                             
                                             
                                             By ：袁苗岩、刘德元                                                                                                                  2016、7、6。