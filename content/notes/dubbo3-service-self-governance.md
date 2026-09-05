---
title: Dubbo3 应用级服务发现的取舍
date: 2026-08-30
stage: seedling
version: v0.1
tags: ["dubbo", "服务发现"]
related: ["nacos-discovery-model"]
---

Dubbo3 把接口级发现改成应用级（服务自省），本质是**用元数据中心换注册中心的压力**：注册数据量从 O(接口数) 降到 O(应用数)。

```java {file="MetadataService.java"}
// 应用级发现的关键：Provider 暴露 MetadataService，
// Consumer 先查元数据再建立订阅
ServiceInstancesChangedListener listener =
    serviceDiscovery.createListener(serviceNames);
```

疑问还没想清楚：元数据版本冲突时 Consumer 的回退策略，在规模上去之后会不会成为新瓶颈。
