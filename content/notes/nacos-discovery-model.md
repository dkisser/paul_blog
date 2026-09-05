---
title: Nacos 服务发现的数据模型速记
date: 2026-08-25
stage: budding
version: v0.3
tags: ["nacos", "服务发现"]
related: ["dubbo3-service-self-governance"]
---

Nacos Naming 的核心数据模型是三层：**Service → Cluster → Instance**。临时实例走 Distro 协议（AP，节点间分片负责 + 异步同步），持久实例走 Raft（CP）。

> 判断一个实例是临时还是持久，看 `ephemeral` 字段；1.x 时代默认临时，2.x  grpc 长连接下沉后这个语义没变，只是传输层换了。

待验证：Distro 协议在网络分区恢复后的数据校验轮次，是否能解释我们线上那次「实例列表抖动」。
