"use strict";
const app = new (require('koa'))();
const Router = require('koa-router');
const serve = require('koa-static-cache');
const logAdapter = new (require('koa-log4js-base'))('{{ name }}');
const bodyParser = require('koa-bodyparser');{{if (session === 'y')}}
const session = require('koa-session');{{/if }}{{if (template === 'y')}}
const path = require('path');
const render = require('koa-art-template');

// 模板引擎
render(app, {
  root: path.join(__dirname, 'views'),
  extname: '.html',
  debug: true
});{{/if}}
{{if (session === 'y') }}
// session
app.keys = ["{{ name }}-{{ time }}"];
app.use(session({
  key: "{{ name }}:sess", // cookie key
  maxAge: 1800000, // session 有效期: 30(min)
  renew: true // 保持持久状态
}, app)); // 配置 session
{{/if}}
app.use(logAdapter.adapt()); // 日志记录
app.use(serve('./public',{gzip:true,prefix:'/{{ name }}/'})); // 静态资源
app.use(bodyParser()); // post 请求参数

// 路由
const appRouter = new Router();
appRouter.use('/{{ name }}', require('./routes/index').routes());
app.use(appRouter.routes()).use(appRouter.allowedMethods());

module.exports = app;
