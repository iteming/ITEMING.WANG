---
title: 4.跨服务器执行SQL
toc: true
recommend: 1
keywords: categories-java
uniqueId: '2020-04-09 07:36:35/"4.跨服务器执行SQL".html'
mathJax: false
date: 2020-04-09 15:36:35
thumbnail:
tags:
categories:
---

```sql
--exec sp_helpserver 可以以存储过程形式执行以下：

--1.1 创建登录信息(或叫创建链接服务器登录名映射)(只需选择一种方式)
    
--1.1.1 以windows认证的方式登录
/*例如：EXEC sp_addlinkedserver 'TonyLink','','SQLOLEDB','192.168.58.208' */ 
EXEC sp_addlinkedserver 'DB1','','SQLOLEDB','0.0.0.0' --有自定义实例名还要加上"/实例名"


--1.1.2 以SQL认证的方式登录 
/*例如：EXEC sp_addlinkedsrvlogin 'TonyLink'  或  EXEC sp_addlinkedsrvlogin 'TonyLink','true'  */

/*例如：EXEC sp_addlinkedsrvlogin 'TonyLink','false',null,'sa','123' */
EXEC sp_addlinkedsrvlogin 'DB1','false',NULL,'sa','123'

    --1.1.3 执行SQL或者存储过程
    /*更新菜单按钮*/
    INSERT INTO DB1.SUP2.dbo.sys_MenuButton ( Alias, Name, BtnName, BtnText)
    SELECT A.Alias,A.Name,A.BtnName,A.BtnText
    FROM SUP.dbo.sys_MenuButton AS A


    /*查询所有用户角色id*/
    DECLARE @RoleId INT
    DECLARE @TEMP TABLE (RoleId INT)
    
    INSERT INTO @TEMP 
    SELECT u.RoleId FROM DB1.SUP2.dbo.userBase u GROUP BY u.RoleId

    
    /*循环更新所有角色id新增的菜单按钮权限*/
    WHILE @@ROWCOUNT > 0
    BEGIN
        PRINT 'begin ---'
        IF EXISTS (SELECT TOP 1 RoleId FROM @TEMP )
        BEGIN
                SELECT TOP 1 @RoleId=RoleId FROM @TEMP
                
                PRINT 'exec count ---'

                DECLARE @Count INT
                SELECT @Count = COUNT(*)
                FROM DB1.SUP2.dbo.sys_MenuButton mb

                PRINT @Count
                PRINT @@ROWCOUNT
                
                DELETE FROM @TEMP WHERE RoleId=@RoleId
        END
    END;

    
--1.1.4 删除声明的映射和远程服务器链接
Exec sp_droplinkedsrvlogin DB1,Null --删除映射（断开与链接服务器上远程登录之间的映射） 
Exec sp_dropserver DB1 --删除远程服务器链接
```
