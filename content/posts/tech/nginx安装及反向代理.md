---
title: "nginx安装及反向代理"
date: "2022-04-11"
author: "Cooper"
categories: ["tech"]
tags: ['Nginx', 'Linux']
description: "这是一个文章测试 <br description/> nginx相关 <br description/>  代理 正向代理：是代理客户端。 栗子： 客户端请求→ 代理 → 请求香港的服务器 → 香港服务器请求其他结果后返回 反向代理:将请求发送到反向代理服务器，由反向代理服务器去选择目标服务器获取数"
slug: "nginx安装及反向代理"
draft: false
featured: false
---

nginx 安装及反向代理测试
<!--more-->

<br description/> nginx相关 <br description/>


### 代理

正向代理：是代理客户端。

栗子： 客户端请求→ 代理 → 请求香港的服务器 → 香港服务器请求其他结果后返回

反向代理:将请求发送到反向代理服务器，由反向代理服务器去选择目标服务器获取数据后，在返回给客户端，此时反向代理服务器和目标服务器对外就是一个服务器，暴露的是代理服务器地址，隐藏了真实服务器IP地址。

代理服务器
栗子： [客户端请求baidu.com](http://客户端请求baidu.com)  ，反向代理后执行特定的服务器

### 负载均衡

轮询：

加权轮询：某些机器性能高，可以多请求些

ipharsh轮询：固定的ip永远打到这台机器上，session不会丢失。

### 动静分离

静态资源从nginx自身返回，动态的请求服务器。

### 常用命令：
启动： cd /usr/local/nginx/sbin ./nginx
./nginx -s stop 停止
./nginx -s reload 重新加载配置文件，比较常用

ps aux  | grep nginx 查看nginx进程
netstap -nap | grep port 查看端口的占用情况

### 配置
配置文件: /usr/local/nginx/conf/nginx.conf

1 全局配置：

2. envents

3. http配置

