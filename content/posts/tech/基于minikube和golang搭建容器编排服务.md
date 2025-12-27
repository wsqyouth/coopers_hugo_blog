---
title: "基于minikube和golang搭建容器编排服务"
date: "2023-12-24"
author: "Cooper"
categories: ["tech"]
tags: ['Go', 'Kubernetes']
description: "引言 最近在自己电脑上搭建一个小型k8s环境，以学习云原生相关内容。这里我主要分为三部分记录：  容器及容器编排理论  环境安装相关  rpcx服务实战 >还在调试中，先总结整理下，这里后续补充上我的github工程链接。  一、容器及容器编排理论 容器技术中有三个核心概念：容器（Container"
slug: "基于minikube和golang搭建容器编排服务"
draft: false
featured: false
---

### 引言

最近在自己电脑上搭建一个小型k8s环境，以学习云原生相关内容。这里我主要分为三部分记录：

* 容器及容器编排理论
* 环境安装相关
* rpcx服务实战

>还在调试中，先总结整理下，这里后续补充上我的github工程链接。
### 一、容器及容器编排理论

容器技术中有三个核心概念：容器（Container）、镜像（Image），以及镜像仓库（Registry）

如何通过Docker File构建镜像？
=> 首先编写Docker File文件, Docker build 命令构建镜像, Docker run 依照新编写好的镜像运行容器实例。

操作容器的常用命令有 `docker ps、docker run、docker exec、docker stop `等；
操作镜像的常用命令有 `docker images、docker rmi、docker build、docker tag` 等；
操作镜像仓库的常用命令有 `docker pull、docker push` 等。

Kubernetes 就是一个生产级别的容器编排平台和集群管理系统，不仅能够创建、调度容器，还能够监控、管理服务器。

快速搭建 Kubernetes 环境的工具选择minikube， 最大特点就是“小而美”，可执行文件仅有不到 100MB，运行镜像也不过 1GB，但就在这么小的空间里却集成了 Kubernetes 的绝大多数功能特性，不仅有核心的容器编排功能，还有丰富的插件，例如 Dashboard、GPU、Ingress、Istio、Kong、Registry 等等，综合来看非常完善。

##### 总结差异：

容器技术只解决了应用的打包、安装问题，面对复杂的生产环境就束手无策了，解决之道就是容器编排，它能够组织管理各个应用容器之间的关系，让它们顺利地协同运行。

Kubernetes 源自 Google 内部的 Borg 系统，也是当前容器编排领域的事实标准。minikube 可以在本机搭建 Kubernetes 环境，功能很完善，适合学习研究。操作 Kubernetes 需要使用命令行工具 kubectl，只有通过它才能与 Kubernetes 集群交互。kubectl 的用法与 docker 类似，也可以拉取镜像运行，但操作的不是简单的容器。

docker和k8s之间的区别，一个是容器技术，一个是容器编排技术，两者思考的维度是不一样的，就容器而言，容器解决的问题是隔离，是一次打包到处运行的问题，最大的价值就在于镜像的迁移。编排技术则是关注的是整个系统的问题，如果你只关注一个服务，迁移一个服务，那docker就够，但要迁移整个系统以及运维，那就需要编排，包括网络关系，负载均衡，回滚，监控，扩缩容问题则需要容器编排技术。

### 二、环境安装相关

我的电脑是mac m2，因此需要安装一些arm架构的软件。首先安装docker，主要使用的命令记录：

```
下载dock arm架构的桌面版本安装。

因为安装的是docker 桌面版本,终端可能找不到docker命令，因此添加环境变量:
export PATH="$PATH:/Applications/Docker.app/Contents/Resources/bin/"

验证:
docker --version  
```

之后安装minikube，这里使用命令行安装arm架构版本:

```
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-darwin-arm64
sudo install minikube-darwin-arm64 /usr/local/bin/minikube

验证：
minikube version
```

不过 minikube 只能够搭建 Kubernetes 环境，要操作 Kubernetes，还需要另一个专门的客户端工具“kubectl”。kubectl 的作用有点类似之前我们学习容器技术时候的工具“docker”，它也是一个命令行工具，作用也比较类似，同样是与 Kubernetes 后台服务通信，把我们的命令转发给 Kubernetes，实现容器和集群的管理功能。

```
 minikube kubectl
 minikube dashboard
 此时可以界面化查看: http://127.0.0.1:52337/api/v1/namespaces/kubernetes-dashboard/services/http:kubernetes-dashboard:/proxy/#/pod?namespace=default
```

 ➜  k8s minikube version
minikube version: v1.32.0
commit: 8220a6eb95f0a4d75f7f2d7b14cef975f050512d
➜  k8s  minikube kubectl -- version
Client Version: v1.28.3
Kustomize Version: v5.0.4-0.20230601165947-6ce0bf390ce3
Server Version: v1.28.3

### 三、rpcx服务实战

[`RPCX`](https://rpcx.io/)是一个分布式的Go语言的 RPC 框架，支持Zookepper、etcd、consul多种服务发现方式，多种服务路由方式。
这里首先基于该框架在本机测试代码，之后开始考虑生成镜像并本地部署。

#### 3.1 本地运行及测试服务代码

服务端rpcx_server.go代码:

```
package main

import (
	"context"
	"flag"
	"log"
	"time"

	example "github.com/rpcxio/rpcx-examples"
	"github.com/smallnest/rpcx/client"
)

var (
	addr = flag.String("addr", "localhost:8972", "server address")
)

func main() {
	flag.Parse()

	d, _ := client.NewPeer2PeerDiscovery("tcp@"+*addr, "")
	xclient := client.NewXClient("Arith", client.Failtry, client.RandomSelect, d, client.DefaultOption)
	defer xclient.Close()

	args := &example.Args{
		A: 10,
		B: 20,
	}

	for {
		reply := &example.Reply{}
		err := xclient.Call(context.Background(), "Mul", args, reply)
		if err != nil {
			log.Fatalf("failed to call: %v", err)
		}

		log.Printf("%d * %d = %d", args.A, args.B, reply.C)
		time.Sleep(1e9)
	}
}

```

客户端rpcx_client.go代码:

```
package main

import (
	"flag"

	example "github.com/rpcxio/rpcx-examples"
	"github.com/smallnest/rpcx/server"
)

var addr = flag.String("addr", "localhost:8972", "server address")

func main() {
	flag.Parse()

	s := server.NewServer()
	// s.RegisterName("Arith", new(example.Arith), "")
	s.Register(new(example.Arith), "")
	s.Serve("tcp", *addr)
}

```

本地通过`go run`开启双窗口测试验证成功。

#### 3.2 编写dockfile生成镜像

服务端：

```
FROM golang:1.19-alpine as builder
WORKDIR /usr/src/app
ENV GOPROXY=https://goproxy.cn
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories && \
  apk add --no-cache ca-certificates tzdata
COPY ./go.mod ./
COPY ./go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -ldflags "-s -w" -o rpcx_server

FROM scratch as runner
COPY --from=builder /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
COPY --from=builder /usr/src/app/rpcx_server /opt/app/

EXPOSE 8972

CMD ["/opt/app/rpcx_server"]
```

客户端:

```
FROM golang:1.19-alpine as builder
WORKDIR /usr/src/app
ENV GOPROXY=https://goproxy.cn
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories && \
  apk add --no-cache ca-certificates tzdata
COPY ./go.mod ./
COPY ./go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -ldflags "-s -w" -o rpcx_client 

FROM busybox as runner
COPY --from=builder /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
COPY --from=builder /usr/src/app/rpcx_client /opt/app/

CMD ["/opt/app/rpcx_client"]
```

分别指向以下命令进行生成及验证:

```
docker build . -t rpcx-server-demo:0.1.0
docker build . -t rpcx-client-demo:0.1.0

之后通过docker images查看:
docker images                                     
REPOSITORY                    TAG       IMAGE ID       CREATED         SIZE
rpcx-server-demo              0.1.0     a13acd11fc0e   19 hours ago    10.7MB
```

#### 3.3 通过yaml部署发布

服务端：

```
kubectl apply -f rpcx-server-demo.yaml
kubectl apply -f rpcx-server-demo-service.yaml
```

Kubernetes 中的服务（Service）和部署（Deployment）是两个不同的资源对象，需要分别定义和创建。

1. `rpcx-server-demo.yaml` 文件用于创建 RPCX 服务器的部署。这个文件定义了部署所需的配置，如容器镜像、副本数、资源限制等。通过执行 `kubectl apply -f rpcx-server-demo.yaml` 命令，您将创建一个部署对象，该对象将负责管理和运行 RPCX 服务器的实例。
2. `rpcx-server-demo-service.yaml` 文件用于创建 RPCX 服务器的服务。服务是 Kubernetes 中的一种资源对象，用于公开应用程序的网络访问。通过执行 `kubectl apply -f rpcx-server-demo-service.yaml` 命令，您将创建一个服务对象，该对象将为 RPCX 服务器提供一个稳定的网络地址，以便其他应用程序可以通过该地址与服务器进行通信。

通过将这两个 YAML 文件分开，您可以更好地组织和管理应用程序的部署和服务。部署文件负责定义和管理应用程序的实例，而服务文件负责定义和管理应用程序的网络访问。这种分离可以提高可维护性和灵活性，并使您能够更好地管理应用程序的不同方面。

客户端：

```
kubectl apply -f rpcx-client-demo.yaml
```

客户端通常不需要像服务端那样暴露网络服务，所以不需要创建服务对象。

在这种情况下，只需使用 `kubectl apply -f rpcx-client-demo.yaml` 命令来创建客户端的部署对象即可。该部署对象将负责管理和运行 RPCX 客户端的实例。

客户端通常是作为一个独立的应用程序运行，它会连接到服务端提供的网络地址进行通信。因此，不需要为客户端创建服务对象，因为客户端不需要公开网络访问。

### 参考：

极客时间部分教程
想学习k8s但没有环境？使用minikube轻松搭建一个 https://mp.weixin.qq.com/s/aExQHKHsqsOChDrT4Lz0vw
构建 Golang 应用最小 Docker 镜像 https://www.cnblogs.com/hahaha111122222/p/17878985.html

