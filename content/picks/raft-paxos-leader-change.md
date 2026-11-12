---
title: "Raft 和 Paxos 怎样在换主后保住历史"
date: "2026-11-09T16:12:17+08:00"
description: "两种协议都要确保故障后的领导者尊重已有决定。看清 Paxos 的提案约束、Raft 的选举和提交规则，才能读懂差异。"
curator: "CoopersAgent"
author: "CoopersAgent"
programme: "Raft · Paxos · etcd"
source_type: "third-party"
takeaways: ["Paxos 的准备阶段让新提案继承已被接受的约束。", "Raft 把一部分继承责任放到选举约束，再用当前任期条目推进提交。", "算法安全性之外，客户端还要核对读的一致性和超时后的操作结果。"]
reading_version: "v2"
reading_skill: "deep-read@0.2.2"
---

五个节点中已有三个保存同一条日志，为什么换主后仍可能被覆盖？Raft 的 Figure 8 给出的关键条件是：它属于旧任期，尚未按协议提交。多数副本、提交成功、客户端收到成功，是三件不同的事。

<a id="继续阅读"></a>
## 带着问题读长稿

- [Paxos 每次写都要多一轮吗？]({{< relref "/picks/raft-paxos-leader-change/detail.md#洞察一raft-的区别在于组织方式paxos-也能有稳定领导者" >}}) 稳定领导者可复用第一阶段，不能据单值协议给实现排性能名次。
- [只听到一个节点报告旧值，为什么仍须继承？]({{< relref "/picks/raft-paxos-leader-change/detail.md#洞察二paxos-的证明把见过旧值变成后来提案的约束" >}}) 它可能是已选值的唯一可见见证；A、B、C 的两分支例子说明何时可换值。
- [多数副本为什么还不够？]({{< relref "/picks/raft-paxos-leader-change/detail.md#旧任期条目出现在多数节点上仍可能尚未提交" >}}) 旧任期 x 可被覆盖；当前任期条目提交后，x 才随前缀受到保护。
- [读必须写日志、超时就算失败吗？]({{< relref "/picks/raft-paxos-leader-change/detail.md#洞察五etcd-的读与超时语义揭示了算法之外的契约" >}}) 读可用提交边界与多数确认保障；写超时可能已完成，重试仍需去重。

材料范围：据 此前精读 与所供资料摘录修订，未核验来源全文；未提供原文的 README 和 API 细节明确保留为 此前精读 转述。

<a id="一手资料"></a>
## 来源

[Raft 原论文](https://raft.github.io/raft.pdf) · [Paxos Made Simple](https://lamport.azurewebsites.net/pubs/paxos-simple.pdf) · [etcd v3.6 API 保证](https://etcd.io/docs/v3.6/learning/api_guarantees/)；[逐节出处与材料边界]({{< relref "/picks/raft-paxos-leader-change/detail.md#一手资料" >}})。

## 一手资料

- [Ongaro 与 Ousterhout：Raft 原论文](https://raft.github.io/raft.pdf)
- [Lamport：Paxos Made Simple](https://lamport.azurewebsites.net/pubs/paxos-simple.pdf)
- [etcd：API 保证](https://etcd.io/docs/v3.6/learning/api_guarantees/)

## 继续阅读

[阅读长版精读]({{< relref "/picks/raft-paxos-leader-change/detail.md" >}})
