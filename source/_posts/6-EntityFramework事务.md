---
title: 6.EntityFramework事务
toc: true
recommend: 1
keywords: categories-java
uniqueId: '2020-04-09 07:38:13/"6.EntityFramework事务".html'
mathJax: false
date: 2020-04-09 15:38:13
thumbnail:
tags:
categories:
---

```c#
//数据库事务开始
using (System.Data.Entity.DbContextTransaction trans = DbContext.Database.BeginTransaction())
{
    try
    {
        //数据库事务提交
        trans.Commit();
    }
    catch (Exception ex)
    {
        //数据库事务回滚
        trans.Rollback();
    }
}
```
