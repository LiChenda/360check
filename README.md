# 360check
360考核系统（2016）
本系统完成于2016年12月，用于Dian团队2016年年终360考核。以后如有需要，可直接采用该系统。
### 环境
该系统基于node，mongo，请提前安装。具体方法可自行查资料(•̀ᴗ•́)
### 启动
首先clone一份代码

```bash
git clone https://github.com/waningflow/360check.git
```
然后执行

```bash
cd 360check/
npm install
cd app/
node server.js
```

默认的端口号是1337，如需修改，要改动server.js和app/controllers/文件夹下的几个涉及到端口号的文件

### 数据库
建立数据库后首先要导入当前阶段的所有需要参与考核的人员的信息（包括三位导师），你可以先从Dian团队微信后台数据库的签到表导出一份cvs文件，再利用others/writeInUsers.js将人员信息导入数据库，需要注意的是该js文件中包含数据库的配置。你可以执行如下的操作

```bash
cd others/
node writeInUsers.js
```

数据库的相关配置也位于server.js，包括数据库名，可登录数据库的用户名和密码。默认的数据库名为dian，集合名为users
数据库的管理页面http://localhost:1337/admin, 这个链接需要用户名和密码，配置位于routes.js，这个链接只给有管理权限的人访问
数据库静态页面http://localhost:1337/view/admin, 这个链接可给所有人访问，用于确认信息

### 配置
app/static/json/文件夹下有三个配置文件
config.json, 分为项目组（xmz），队委会（dwh）和种子班（zzb），leader是组长（或者部长、班长）的喻信ID，其他的很容易理解

```
{
	"xmz" : [
		{
			"name": "WinMac组",
			"leader": "Huaan",    
			"leaderName": "黄伦"
		},
		...
｝
```
boss.json，这里是时任队长和导师的信息（注意：虽然这里队长是一个数组，但是实际上程序很多地方是按照只有一个队长来设计的，如果某天突然冒出了副队长，就需要改代码了）

```
{
	"captain": [
		{
			"username": "yulebron",
			"realname": "余乐"
		}
	],
	"tutor": ["dian", "ll", "quickmouse"]
}
```
questions.json，这是问卷要用到的问题，一般来说不会改

### 更新人员信息
导入了用户数据并且更新了配置文件之后，就可以访问http://localhost:1337/admin 来补全人员的信息，包括呆过哪些项目组，队委会部门和种子班。右上方有两个提交按钮，“提交”按钮只会更新信息有变动的人员信息，“重置”会重写所有人员的信息同时清空分数

### 访问
以上完成后，可访问http://localhost:1337/ 进行360考核，登录使用喻信ID和密码

### 备注
有些包没有写进package.json，如果执行某个操作时遇到缺少包的情况，请直接用npm安装



