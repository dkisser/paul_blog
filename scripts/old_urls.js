#!/usr/bin/env node
/**
 * 旧站 19 篇文章的线上 URL 清单（percent-decoded），
 * 抓取自旧站 archive 页 (https://dkisser.github.io/archive.html)。
 *
 * 被 verify_urls.js（校验新站产物）和 gen_redirects.js（生成旧站跳转页）共用。
 */
'use strict';

const OLD_URLS = [
  '/2022/03/20/Enable模块驱动.html',
  '/2022/03/20/SpringBoot可执行jar原理.html',
  '/2022/03/20/SpringBoot外部化配置.html',
  '/2022/03/26/顺序消息的解决思路.html',
  '/2022/05/10/阿里巴巴java规范-Result-方式杂谈.html',
  '/2022/05/24/上市公司的创业形式.html',
  '/2022/05/28/我在阿里创业的经历.html',
  '/2022/06/09/从零开始学gRPC-一.html',
  '/2022/06/19/从零开始学gRPC-二.html',
  '/2022/07/02/避坑-@Around与@Transactional混用导致事务不回滚.html',
  '/2022/07/25/Dubbo3.0-Triple协议.html',
  '/2022/08/03/Dubbo3.0-SpringBoot+Triple.html',
  '/2022/08/06/Dubbo3.0-服务自省.html',
  '/2022/08/07/Dubbo3.0-DubboBootstrap模型讲解.html',
  '/2022/08/18/Nacos-Naming模块源码讲解.html',
  '/2022/08/20/Nacos总览.html',
  '/2022/08/22/Nacos-Config模块源码讲解.html',
  '/2022/09/04/21天Python学习计划.html',
  '/2023/10/29/记一次搜索迁移故障复盘.html',
];

module.exports = { OLD_URLS };
