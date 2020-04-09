---
title: >-
  11.datatable.AccepteChanges()方法和datatable.RejectChanges()方法对DataTable.Rows[i].Delete()的操作。
toc: true
recommend: 1
keywords: categories-java
uniqueId: >-
  2020-04-09
  07:55:02/"11.datatable.AccepteChanges()方法和datatable.RejectChanges()方法对DataTable.Rows[i].Delete()的操作。".html
mathJax: false
date: 2020-04-09 15:55:02
thumbnail:
tags:
categories:
---
datatable.Rows[i].Delete()。

Delete()之后需要datatable.AccepteChanges()方法确认完全删除，

因为Delete()只是将相应列的状态标志为删除，还可以通过datatable.RejectChanges()回滚，使该行取消删除。
