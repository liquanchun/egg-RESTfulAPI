'use strict';
/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);

  // userAccess;
  router.post('/api/user/access/login', controller.userAccess.login);
  router.get('/api/user/access/current', app.jwt, controller.userAccess.current);
  router.get('/api/user/access/logout', controller.userAccess.logout);
  router.put('/api/user/access/resetPsw', app.jwt, controller.userAccess.resetPsw);

  // user;
  // router.post('/api/user', controller.user.create);
  // router.delete('/api/user/:id', controller.user.destroy);
  // router.put('/api/user/:id', controller.user.update);
  // router.get('/api/user/:id', controller.user.show);
  // router.get('/api/user', controller.user.index);
  router.delete('/api/user', controller.user.removes);
  router.resources('user', '/api/user', controller.user);

  // upload;
  router.post('/api/upload', controller.upload.create);
  router.post('/api/upload/url', controller.upload.url);
  router.post('/api/uploads', controller.upload.multiple);
  router.delete('/api/upload/:id', controller.upload.destroy);
  // router.put('/api/upload/:id', controller.upload.update);
  router.post('/api/upload/:id', controller.upload.update); // Ant Design Pro;
  router.put('/api/upload/:id/extra', controller.upload.extra);
  router.get('/api/upload/:id', controller.upload.show);
  router.get('/api/upload', controller.upload.index);
  router.delete('/api/upload', controller.upload.removes);
  // router.resources('upload', '/api/upload', controller.upload);

  //通用接口路由定义;
  router.get('/api/data/:table/:id', controller.data.show);
  router.get('/api/data/:table', controller.data.table);
  router.post('/api/datalist/:table', controller.data.list);
  router.post('/api/datalist/page/:table', controller.data.listpage);
  router.post('/api/data/:table', controller.data.create);
  router.post('/api/data/:table/:id', controller.data.update);
  router.post('/api/datadel/:table', controller.data.removes);
  router.post('/api/datadel/:table/:id', controller.data.destroy);

  //通用接口路由定义;
  router.get('/api/knex/:table/:id', controller.knex.show);
  router.get('/api/knex/:table', controller.knex.table);
  router.get('/api/knexlist/page/:table', controller.knex.getlistpage);
  router.post('/api/knexlist/:table', controller.knex.list);
  router.post('/api/knexlist/page/:table', controller.knex.listpage);
  router.post('/api/knex/:table', controller.knex.create);
  router.post('/api/knex/:table/:id', controller.knex.update);
  router.post('/api/knexdel/:table', controller.knex.removes);
  router.post('/api/knexdel/:table/:id', controller.knex.destroy);
  router.post('/api/knexsql',controller.knex.listBySql);
  
  router.post('/api/sp/:spname',controller.knex.callsp);
  //获取数据表类别
  router.get('/api/tablelist', controller.knex.tablelist);
  //根据表获取表字段列表
  router.get('/api/collist/:table', controller.knex.columnlist);

  //新增商品入库 
  router.post('/api/goodsin',controller.goods.createGoods);
  //新增入住登记 
  router.post('/api/checkin',controller.checkin.createCheckin);
    //新增入住登记 
  router.post('/api/checkout',controller.checkin.createCheckout);
  //取消订单
  router.post('/api/cancelorder',controller.checkin.cancelOrder);
  // 换房
  router.post('/api/changehouse',controller.checkin.changeHouse);
  // 续住
  router.post('/api/adddays',controller.checkin.orderAdddays);
  // 获取房间的标准配置商品信息 
  router.post('/api/housegoods',controller.goods.housegoods);
};