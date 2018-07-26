const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
// const bodyparser = require('koa-bodyparser')
const koabody = require('koa-body')
const logger = require('koa-logger')

const index = require('./routes/index')

// error handler
onerror(app)

// middlewares
// app.use(bodyparser({
//   enableTypes:['json', 'form', 'text']
// }))
let mongoose = require("mongoose");
mongoose.connect('mongodb://127.0.0.1:27017/blogs', function (err) {
  if (err) {
    console.log('mongo on error');
  } else {
    console.log('mongo on success');
  }
});
mongoose.Promise = global.Promise;
app.use(koabody({
  jsonLimit: '10mb',
  formLimit: '10mb',
  textLimit: '10mb'
}))
app.use(json())
app.use(logger())
// app.use(require('koa-static')(__dirname + '/public'))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(index.routes(), index.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
