# Gmall-admin

## API
http://39.98.123.211:8170/swagger-ui.html
http://39.98.123.211:8416/swagger-ui.html

npm install --save echarts@4.9.0 
npm install --save vuex
npm install --save lodash
npm install --save dayjs
npm install mockjs--save-dev

在项目中，部分数据使用mock，部分数据使用devServer.proxy进行跨域代理访问后端接口，
同时配置会出现都走mock，无法进行跨域代理访问
解决办法：因为mock-server配置了检验content-type，需将mock-server中module.exports的如下代码注释掉
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))


1、在什么时候加载路由表？
  在用户登录后跳转的 router.beforeEach 钩子里面异步加载

2、路由表加载完应该做什么？
  进行路由重定向，因为之前跳转的时候地址还不存在路由表中，如果直接 next() 会找不到页面，所以需要重定向，这里还需要做一个判断，不然会进入死循环。
  next({ ...to, replace: true })



