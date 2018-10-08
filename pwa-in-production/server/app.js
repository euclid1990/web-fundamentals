const dotenv = require('dotenv').config();
const http = require('http');
const jsonwebtoken = require('jsonwebtoken');
const status = require('http-status');
const koaBody = require('koa-body');
const koaLogger = require('koa-logger')
const koaJwt = require('koa-jwt');
const koaRouter = require('koa-router')();
const koaCors = require('@koa/cors');
const Koa = require('koa');
const app = new Koa();
const utils = require('./utils');
const act = require('./actions');
const db = require('./db');

app.context.db = db();
app.use(koaCors());
app.use(koaLogger());
app.use(koaBody());

// Custom error handling & set token data to ctx if it present
app.use(async (ctx, next) => {
  try {
    await next();
    let token = ctx.request.headers['authorization'];
    if (typeof token !== 'undefined') {
      ctx.state.user = jsonwebtoken.verify(token.replace('Bearer ', ''), utils.env('JWT_SECRET'));
    }
  } catch (err) {
    ctx.status = err.status || status.INTERNAL_SERVER_ERROR;
    ctx.body = {
      code: ctx.status,
      message: err.originalError ? err.originalError.message : err.message
    };
    ctx.app.emit('error', err, ctx);
  }
});

// Jwt authenticate middleware
const jwt = koaJwt({ secret: utils.env('JWT_SECRET') });

// Route definitions
koaRouter.post('/sign-in', act.auth.signIn)
  .post('/sign-up', act.auth.signUp)
  .get('/sign-out', jwt, act.auth.signOut)
  .get('/cryptocurrencies', jwt, act.cryptocurrencies.index)
  .get('/cryptocurrencies/:id', jwt, act.cryptocurrencies.show);
app.use(koaRouter.routes());


app.use(async (ctx) => {
  ctx.body = 'PWA Server';
});

http.createServer(app.callback()).listen(3000);
