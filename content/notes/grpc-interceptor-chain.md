---
title: gRPC 拦截器链与 Context 传递
date: 2026-08-15
stage: evergreen
version: v1.2
tags: ["grpc", "微服务"]
---

gRPC 的拦截器（Interceptor）是 AOP 思想的典型应用：客户端/服务端各一条链，按注册顺序嵌套执行。

- 客户端拦截器适合做：鉴权头注入、调用埋点、重试包装
- 服务端拦截器适合做：统一异常翻译、限流、审计日志
- Context 通过 `Contexts.interceptCall` 显式传递，**异步回调里记得 attach**，否则 trace 会断

这条结论在项目里验证过多次，标记为常青。
