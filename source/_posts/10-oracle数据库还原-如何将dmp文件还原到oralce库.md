---
title: '10.oracle数据库还原,如何将dmp文件还原到oralce库'
toc: true
recommend: 1
keywords: categories-java
uniqueId: '2020-04-09 07:52:57/"10.oracle数据库还原,如何将dmp文件还原到oralce库".html'
mathJax: false
date: 2020-04-09 15:52:57
thumbnail:
tags:
categories:
---
最近用到从oracle的dmp文件中还原数据
由于没有这方面的资料,在网上搜集了一些,相信有以下这些资料,我们可以成功地将dmp文件用命令行的方式还原回去


在这里我用的是oracle10g的版本,我的机器是512内存的,运行oracle的web管理程序有一些困难,所以我选择通过命令行的方式,
以下我的安装完成后,oracle给出的报告


Enterprise Manager Database Control URL - (orcl) :
http://localhost:1158/em


数据库配置文件已经安装到
E:oracleproduct10.2.0,


同时其他选定的安装组件也已经安装到
E:oracleproduct10.2.0db_1。


iSQL*Plus URL 为:
http://localhost:5560/isqlplus


iSQL*Plus DBA URL 为:
http://localhost:5560/isqlplus/dba

下面我们来看一看如何来完成这一任务

第一,启动服务,(如果数据库处于启动状态,那么略过这一步)

打开命令行执行以下语句
net start OracleServiceORCL
net start OracleOraDb10g_home2TNSListener
net start OracleOraDb10g_home2iSQL*Plus


以上方式是在windows服务中启动服务,当windows服务不能启动数据库实例的时候,应用以下的语句
set oracle_sid=orcl
oradim -startup -sid orcl

sqlplus internal/oracle
startup

第二清理以前还原过的痕迹,如果我们在数据库曾经还原过,我们先来清理一下,痕迹,
//删除用户
drop user xxxx cascade;
//删除表空间
drop tablespace xxxx;
//删除数据库文件
e:xxxxxx.dbf


第三,接下来,准备工作做好后,我们就可以开始还原了
//创建用户
CREATE USER 用户名 IDENTIFIED BY 密码 DEFAULT TABLESPACE USERS TEMPORARY TABLESPACE TEMP

//给予用户权限
grant connect,resource,dba to xxxx

//创建表空间,并指定文件名,和大小
CREATE SMALLFILE TABLESPACE "xxxx" DATAFILE 'E:ORADATAORCLxxxx.DBF'
SIZE 100M
AUTOEXTEND ON NEXT 100M
MAXSIZE UNLIMITED
LOGGING EXTENT MANAGEMENT LOCAL SEGMENT SPACE MANAGEMENT AUTO

//执行给予权限的脚本grant.txt,将权限给予刚才创建的用户
//给予权限
GRANT CREATE USER,DROP USER,ALTER USER ,CREATE ANY VIEW ,
DROP ANY VIEW,EXP_FULL_DATABASE,IMP_FULL_DATABASE,
DBA,CONNECT,RESOURCE,CREATE SESSION TO xxxx


//开始导入(完全导入),file:dmp文件所在的位置, ignore:因为有的表已经存在，对该表就不进行导入。
在后面加上 ignore=y 。指定log文件 log=e:log.txt
imp full=y file=e:xxx.dmp ignore=y log=e:log.txt

//当我们不需要完整的还原数据库的时候,我们可以单独地还原某个特定的表
//---------------------------------------------------------------------------
imp file=e:xxx.dmp ignore=y log=e:log.txt tables=(xxxx)
imp file=e:xxx.dmp ignore=y log=e:log2.txt tables=(xxxx)
//---------------------------------------------------------------------------

//做到这里我们就已经完成了,数据库的还原工作,下面我们就可以打开isqlplus查看表中的数据了

select * from ***

第四我们来看一下,对oracle常用的操作命令
1)查看表空间的属性
select tablespace_name,extent_management,allocation_type from dba_tablespaces


2)查找一个表的列,及这一列的列名,数据类型
select TABLE_NAME,COLUMN_NAME,DATA_TYPE from user_tab_columns where TABLE_NAME='xxxx'


3)查找表空间中的用户表
select * from all_tables where owner='xxx' order by table_name desc

4)在指定用户下,的表的数量
select count(*) from user_tab_columns

5)查看数据库中的表名,表列,所有列
select TABLE_NAME,COLUMN_NAME,DATA_TYPE from user_tab_columns order by table_name desc

6)查看用户ZBFC的所有的表名及表存放的表空间
select table_name,tablespace_name from all_tables where owner='xxxx' order by table_name desc
7)生成删除表的文本
select 'Drop table '||table_name||';' from all_tables where owner="ZBFC";

8)删除表级联删除
drop table table_name [cascade constraints];

9)查找表中的列
select TABLE_NAME,COLUMN_NAME,DATA_TYPE from user_tab_columns where column_name like '%'||'地'||'%' order by table_name

desc

10)查看数据库的临时空间
select tablespace_name,EXTENT_SIZE,current_users,total_extents,used_extents,MAX_SIZE,free_extents from v$sort_segment;

http://download1.csdn.net/down3/20070615/15202338310.txt


作者在导入的过程中,还遇到了一个错误,就是数据违反了唯一性约束,数据库拒绝了数据
IMP-00019: 由于 ORACLE 的 1 错误而拒绝行
在网上看到有人说,这是字符集的原因,所以我就新建了一个数据库,将字符集改成了ZHS16GBK这样,从新导了一次,结果就成功了

下面是grant.txt脚本


评论 (0) 引用 (0) WAS[6] oracle[7] 一般分类[36] exp/imp备份与还原oracle数据库xuehongliang - by - 12 八月, 2007 16:25
exp file=d: ame.dmp owners=renlink rows=y
/
imp file=d: ame.dmp fromuser=renlink touser=renlink rows=y ignore=y
/


产生dmp文件方便移动/备份w3sky

ORACLE数据库有两类备份方法.w3sky

第一类为物理备份，该方法实现数据库的完整恢复，但数据库必须运行在归挡模式下（业务数据库在非归挡模式下运行），且需要极大的外部存储设备，例如磁带库;

第二类备份方式为逻辑备份，业务数据库采用此种方式，此方法不需要数据库运行在归挡模式下，不但备份简单，而且可以不需要外部存储设备.
数据库逻辑备份方法
ORACLE数据库的逻辑备份分为三种模式:表备份、用户备份和完全备份.w3sky

表模式
备份某个用户模式下指定的对象（表）.业务数据库通常采用这种备份方式.
若备份到本地文件，使用如下命令:w3sky

exp icdmain/icd rows=y indexes=n compress=n buffer=65536
feedback=100000 volsize=0
file=exp_icdmain_csd_yyyymmdd.dmp
log=exp_icdmain_csd_yyyymmdd.log
tables=icdmain.commoninformation,icdmain.serviceinfo,icdmain.dealinfow3sky

若直接备份到磁带设备，使用如下命令:w3sky

exp icdmain/icd rows=y indexes=n compress=n buffer=65536
feedback=100000 volsize=0
file=/dev/rmt0
log=exp_icdmain_csd_yyyymmdd.log
tables=icdmain.commoninformation,icdmain.serviceinfo,icdmain.dealinfow3sky

注:在磁盘空间允许的情况下，应先备份到本地服务器，然后再拷贝到磁带.出于速度方面的考虑，尽量不要直接备份到磁带设备.
w3sky

用户模式
备份某个用户模式下的所有对象.业务数据库通常采用这种备份方式.
若备份到本地文件，使用如下命令:w3sky

exp icdmain/icd owner=icdmain rows=y indexes=n compress=n buffer=65536
feedback=100000 volsize=0
file=exp_icdmain_yyyymmdd.dmp
log=exp_icdmain_yyyymmdd.logw3sky

若直接备份到磁带设备，使用如下命令:w3sky

exp icdmain/icd owner=icdmain rows=y indexes=n compress=n buffer=65536
feedback=100000 volsize=0
file=/dev/rmt0
log=exp_icdmain_yyyymmdd.logw3sky

注:如果磁盘有空间，建议备份到磁盘，然后再拷贝到磁带.如果数据库数据量较小，
可采用这种办法备份.
w3sky

完全模式
备份完整的数据库.业务数据库不采用这种备份方式.备份命令为:w3sky

exp icdmain/icd rows=y indexes=n compress=n buffer=65536
feedback=100000 volsize=0 full=y
file=exp_fulldb_yyyymmdd.dmp(磁带设备则为/dev/rmt0)
log=exp_fulldb_yyyymmdd.logw3sky

对于数据库备份，建议采用增量备份，即只备份上一次备份以来更改的数据.增量备份
命令:w3sky

exp icdmain/icd rows=y indexes=n compress=n buffer=65536
feedback=100000 volsize=0 full=y inctype=incremental
file=exp_fulldb_yyyymmdd.dmp(磁带设备则为/dev/rmt0)
log=exp_fulldb_yyyymmdd.logw3sky

注:关于增量备份必须满足下列条件:
1.只对完整数据库备份有效，且第一次需要full=y参数，以后需要inctype=incremental参数.
2. 用户必须有EXP_FULL_DATABASE的系统角色.
3. 话务量较小时方可采用数据库备份.
4. 如果磁盘有空间，建议备份到磁盘，然后再备份到磁带.w3sky

业务数据库备份方法及周期用EXP进行备份前，先在SYS用户下运行CATEXP.SQL文件（如果以前已运行该文件，则不要执行这个脚本）.
没有特殊说明，不允许在客户端执行备份命令.
备份命令参照表模式下的备份命令.
从磁盘文件备份到磁带
如果首先备份到本地磁盘文件，则需要转储到磁带设备上.w3sky

1. 若需查看主机上配置的磁带设备，使用如下命令:
lsdev -Cc tape
显示的结果如下例所示:
rmt0 Available 30-58-00-2,0 SCSI 4mm Tape Drive
rmt1 Defined　 30-58-00-0,0 SCSI 4mm Tape Drive
标明Available的设备是可用的磁带设备.w3sky

2. 若需查看磁带存储的内容，使用如下命令:
tar -tvf /dev/rmt0
显示的结果如下例所示:
-rw-r--r-- 300 400 8089600 Jan 11 14:33:57 2001 exp_icdmain_20010111.dmp
如果显示类似如下内容，则表示该磁带存储的备份数据是从数据库直接备份到磁带上，而非从本地磁盘转储到磁带的备份文件，因此操作系统无法识别.
tar: 0511-193 An error occurred while reading from the media.
There is an input or output error.
或
tar: 0511-169 A directory checksum error on media; -267331077 not equal to 25626.w3sky

3. 对于新磁带或无需保留现存数据的磁带，使用如下命令:
tar -cvf /dev/rmt0 exp_icdmain_yyyymmdd.dmp
注:A. 该命令将无条件覆盖磁带上的现存数据.
　 B. 文件名不允许包含路径信息，如:/backup/exp_icdmain_yyyymmdd.dmp.w3sky

4. 对于需要保留现存数据的磁带，使用如下命令:
tar -rvf /dev/rmt0 exp_icdmain_yyyymmdd.dmp
注:该命令将文件exp_icdmain_yyyymmdd.dmp追加到磁带的末端，不会覆盖现存的数据.
特别强调:如果备份时是从数据库直接备份到磁带上，则不可再向该磁带上追加复制任何其他文件，否则该备份数据失效.w3sky

5. 若需将转储到磁带上的备份文件复制到本地硬盘，使用如下命令:
A. 将磁带上的全部文件复制到本地硬盘的当前目录
tar -xvf /dev/rmt0
B. 将磁带上的指定文件复制到本地硬盘的当前目录
tar -xvf /dev/rmt0 exp_icdmain_yyyymmdd.dmp
w3sky

备份时间安排
由于备份时对系统I/O有较大影响，所以，建议在晚上11点以后进行备份工作.业务数据库Oracle版本的恢复恢复方案需根据备份方案确定.由于业务数据库采用表备份和用户备份相结合的方案，所以业务数据库的恢复需根据实际情况采用表恢复和用户恢复相结合的方案.w3sky

w3sky

w3sky

恢复方案
数据库的逻辑恢复分为表恢复、用户恢复、完全恢复三种模式.w3sky

表模式
此方式将根据按照表模式备份的数据进行恢复.w3sky

A. 恢复备份数据的全部内容
若从本地文件恢复，使用如下命令:w3sky

imp icdmain/icd fromuser=icdmain touser=icdmain rows=y indexes=n
commit=y buffer=65536 feedback=100000 ignore=n volsize=0
file=exp_icdmain_cs
d_yyyymmdd.dmp
log=imp_icdmain_csd_yyyymmdd.logw3sky

若从磁带设备恢复，使用如下命令:w3sky

imp icdmain/icd fromuser=icdmain touser=icdmain rows=y indexes=n
commit=y buffer=65536 feedback=100000 ignore=n volsize=0 file=/dev/rmt0
log=imp_icdmain_csd_yyyymmdd.logw3sky

B. 恢复备份数据中的指定表w3sky

若从本地文件恢复，使用如下命令:w3sky

imp icdmain/icd fromuser=icdmain touser=icdmain rows=y indexes=n
commit=y buffer=65536 feedback=100000 ignore=n volsize=0
file=exp_icdmain_cs
d_yyyymmdd.dmp
log=imp_icdmain_csd_yyyymmdd.log
tables=commoninformation,serviceinfow3sky

若从磁带设备恢复，使用如下命令:w3sky

imp icdmain/icd fromuser=icdmain touser=icdmain rows=y indexes=n
commit=y buffer=65536 feedback=100000 ignore=n volsize=0
file=/dev/rmt0
log=imp_icdmain_csd_yyyymmdd.log
tables=commoninformation,serviceinfow3sky

用户模式
此方式将根据按照用户模式备份的数据进行恢复.w3sky

A. 恢复备份数据的全部内容
若从本地文件恢复，使用如下命令:w3sky

imp icdmain/icd fromuser=icdmain touser=icdmain rows=y indexes=n
commit=y buffer=65536 feedback=100000 ignore=n volsize=0
file=exp_icdmain_yy
yymmdd.dmp
log=imp_icdmain_yyyymmdd.logw3sky

若从磁带设备恢复，使用如下命令:w3sky

imp icdmain/icd fromuser=icdmain touser=icdmain rows=y indexes=n
commit=y buffer=65536 feedback=100000 ignore=n volsize=0 file=/dev/rmt0
log=imp_icdmain_yyyymmdd.logw3sky

B. 恢复备份数据中的指定表
若从本地文件恢复，使用如下命令:w3sky

imp icdmain/icd fromuser=icdmain touser=icdmain rows=y indexes=n
commit=y buffer=65536 feedback=100000 ignore=n volsize=0
file=exp_icdmain_yy
yymmdd.dmp
log=imp_icdmain_yyyymmdd.log
tables=commoninformation,serviceinfow3sky

若从磁带设备恢复，使用如下命令:w3sky

imp icdmain/icd fromuser=icdmain touser=icdmain rows=y indexes=n
commit=y buffer=65536 feedback=100000 ignore=n volsize=0 file=/dev/rmt0
log=imp_icdmain_yyyymmdd.log
tables=commoninformation,serviceinfow3sky

完全模式
如果备份方式为完全模式，采用下列恢复方法:
若从本地文件恢复，使用如下命令:w3sky

imp system/manager rows=y indexes=n commit=y buffer=65536
feedback=100000 ignore=y volsize=0 full=y
file=exp_icdmain_yyyymmdd.dmp
log=imp_icdmain_yyyymmdd.logw3sky

若从磁带设备恢复，使用如下命令:w3sky

imp system/manager rows=y indexes=n commit=y buffer=65536
feedback=100000 ignore=y volsize=0 full=y
file=/dev/rmt0
log=imp_icdmain_yyyymmdd.logw3sky

参数说明
1. ignore参数w3sky

Oracle在恢复数据的过程中，当恢复某个表时，该表已经存在，就要根据ignore参数的设置来决定如何操作.若ignore=y，Oracle不执行CREATE TABLE语句，直接将数据插入到表中，如果插入的记录违背了约束条件，比如主键约束，则出错的记录不会插入，但合法的记录会添加到表中.若ignore=n，Oracle不执行CREATE TABLE语句，同时也不会将数据插入到表中，而是忽略该表的错误，继续恢复下一个表.w3sky

2. indexes参数w3sky

在恢复数据的过程中，若indexes=n，则表上的索引不会被恢复，但是主键对应的唯一索引将无条件恢复，这是为了保证数据的完整性.w3sky

字符集转换
对于单字节字符集（例如US7ASCII），恢复时，数据库自动转换为该会话的字符集（NLS_LANG参数）；对于多字节字符集（例如ZHS16CGB231280），恢复时，应尽量使字符集相同（避免转换），如果要转换，目标数据库的字符集应是输出数据库字符集的超集.w3sky

恢复方法
业务数据库采用表恢复方案.在用IMP进行恢复前，先在SYS用户下运行CATEXP.SQL文件（如果以前已运行该文件，则不要执行这个脚本），然后执行下列命令:w3sky

IMP ICDMAIN/ICD FILE=文件名 LOG=LOG文件名 ROWS=Y
COMMIT=Y BUFFER=Y IGNORE=Y TABLES=表名w3sky

注:要恢复的表名参照备份的表名.恢复是在原表基础上累加数据.没有特殊说明，不允许在客户端执行恢复命令将一个数据库的某用户的所有表导到另外数据库的一个用户下面的例子　
　
exp userid=system/manager owner=username1 file=expfile.dmp
imp userid=system/manager fromuser=username1 touser=username2 ignore=y file=expfile.dmpw3sky

将一个数据库的某用户的所有表导到另外数据库的一个用户下面的例子　　w3sky

exp userid=system/manager owner=username1 file=expfile.dmp
imp userid=system/manager fromuser=username1 touser=username2 ignore=y file=expfile.dmpw3sky

安装 Oracle 软件并构建数据库xuehongliang - by - 12 八月, 2007 16:24
http://www.oracle.com/technology/global/cn/obe/2day_dba/install.htm
