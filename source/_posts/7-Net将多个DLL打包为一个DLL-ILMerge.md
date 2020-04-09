---
title: 7..Net将多个DLL打包为一个DLL(ILMerge)
toc: true
recommend: 1
keywords: categories-java
uniqueId: '2020-04-09 07:40:31/"7..Net将多个DLL打包为一个DLL(ILMerge)".html'
mathJax: false
date: 2020-04-09 15:40:31
thumbnail:
tags:
categories:
---

在做.Net底层编码过程中，为了功能独立，有可能会生成多个DLL，引用时非常不便。这方面微软提供了一个ILMerge工具原版DOS工具，可以将多个DLL合并成一个。下载完成后需要安装一下，然后通过DOS命令进入。具体用法如下：

```
D:\Program Files\Microsoft\ILMerge>ilmerge /log:log.txt /targetplatform:v4 /
 out:merge.dll AnalysisLibrary.dll USBClassLibrary.dll 
```

说明：此操作的目的是：将当前目录下的AnalysisLibrary.dll和USBClassLibrary.dll类库，按照.NetFramework 4.0形式（V4）合并成merge.dll。

其中：/log:log.txt命令是将生成过程中的日志，写入到log.txt文件中。out:merge.dll:是输出文件。AnalysisLibrary.dll USBClassLibrary.dll是源文件，多个源文件用空格隔开。

 

当然也有人添加了界面，如果不习惯DOS命令，也可以到此处下载GUI界面工具。请下载1.9版本或更新的版本，1.0版本仅支持到Framework2.0。界面工具比较简单，此处不赘。

 

装载：



[.Net将多个DLL打包为一个DLL(ILMerge)](http://www.cnblogs.com/zhangpengshou/archive/2011/12/06/2278227.html)
