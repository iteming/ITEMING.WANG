---
title: 13.ORACLE查询历史数据（数据还原到历史时间点）
toc: true
recommend: 1
keywords: categories-java
uniqueId: '2020-04-09 08:01:20/"13.ORACLE查询历史数据（数据还原到历史时间点）".html'
mathJax: false
date: 2020-04-09 16:01:20
thumbnail:
tags:
categories:
---


    select * from table as of timestamp to_date('2014-03-18 13:12:10','yyyy-mm-dd hh24:mi:ss')



oracle 误删数据

    select * from test_table as of timestamp to_Date('2011-01-19 15:28:00', 'yyyy-mm-dd hh24:mi:ss')，什么意思呢， 找到test_table在2011-01-19 15:28:00这个时间点的所有数据(数据快照)。
