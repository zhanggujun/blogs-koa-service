const router = require('koa-router')();
const crypto = require('crypto');     
const Articles = require('../controller/articles');    // 文章
const Labels = require('../controller/labels'); // 标签
router
// oss签名
.post('/get-sign', async (ctx) => {
  const dirPath = '';
  const oss = {
    secret:'RLLkYqUzCjUXjN4aHrt78abYrOOjas',
    accesskey:'LTAINMaEVBAED4aW'
  };
  let end = new Date().getTime() + 300000;
  let expiration = new Date(end).toISOString();
  let policyString = {
    expiration,
    conditions: [
      ['content-length-range', 0, 1048576000],
      ['starts-with', '$key', dirPath]
    ]
  };
  policyString = JSON.stringify(policyString);
  const policy = new Buffer(policyString).toString('base64');
  const signature = crypto.createHmac('sha1',oss.secret).update(policy).digest('base64');
  ctx.body = {
    code:true,
    data:{
      policy: policy,
      signature: signature,
      accesskey:oss.accesskey
    }
  }
})
// 文章
.post('/add-articles',Articles.addArticles)
.post('/get-articles',Articles.getAritcles)
.post('/del-articles',Articles.delArticles)
.post('/del-articles-image',Articles.delArticlesImage)
// 标签
.post('/add-labels',Labels.addLabels)
.post('/get-labels',Labels.getLabels)
.post('/del-labels',Labels.delLabels)
.post('/update-labels',Labels.updateLables)

module.exports = router;
