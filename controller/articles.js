const Articles = require('../mongose/articles');
const controller = {
  async addArticles(ctx, next) {
    const data = JSON.parse(ctx.request.body.data);
    const articleId = data.articleId;
    ctx.body = articleId?await Articles.UpdateArticle(data):await Articles.addArticles(data);
  },
  async getAritcles(ctx,next){
    const data = JSON.parse(ctx.request.body.data);
    const page = ctx.request.body.page;
    const limit = ctx.request.body.limit;
    ctx.body = await Articles.getArticles(data,page,limit);
  },
  async delArticles(ctx,next){
    const data = JSON.parse(ctx.request.body.data);
    ctx.body = await Articles.delArticles(data);
  },
  async delArticlesImage(ctx,next){
    const data = JSON.parse(ctx.request.body.data);
    ctx.body = await Articles.delArticlesImage(data);
  }
};
module.exports = controller;