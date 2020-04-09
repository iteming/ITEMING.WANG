---
title: '9.C#调用dll函数，IntPtr如何作参数传递'
toc: true
recommend: 1
keywords: categories-java
uniqueId: '2020-04-09 07:51:26/"9.C#调用dll函数，IntPtr如何作参数传递".html'
mathJax: false
date: 2020-04-09 15:51:26
thumbnail:
tags:
categories:
---
指针不是你自己创建的，一般是创建其他类带来的。
例如：TextBox TB= new TextBox();
IntPtr Handle = TB.Handle;
DllFunction(Handle, "xxx");
