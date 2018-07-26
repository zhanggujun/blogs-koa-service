const Articles = require('../models/articles');
const Lables = require('../models/labels');
// const Navs = require('../models/navs');
// const crypto = require('crypto');
const utils = require('../utils/utils');
let OSS = require('ali-oss');
let client = new OSS({
  region: 'oss-cn-beijing',
  accessKeyId: 'LTAINMaEVBAED4aW',
  accessKeySecret: 'RLLkYqUzCjUXjN4aHrt78abYrOOjas',
  bucket: 'zgj-blogs'
});
async function deleteMulti(list){
  try {
    const result = await client.deleteMulti(list,{
      quiet: true
    });
    if(result.res.status==200){
      return {
        code:true,
        data:'oss删除成功'
      }
    }else{
      return {
        code:false,
        data:'oss删除失败'
      }
    }
  }catch(err){
    return {
      code:false,
      data:'oss删除失败',
      err:err
    }
  }
}
const mongose = {
  async addArticles(data) {
    const result = await new Articles({
      title:data.title,
      keyword:data.keyword,
      label:data.label,
      labelId:data.labelId?data.labelId:utils.mathId(),
      describe:data.describe,
      content:data.content,
      type:data.type,
      typeId:'3333',
      status:data.status,
      isopen:data.isopen,
      time:Date.now(),
      image:data.image,
      imageList:data.imageList,
      articleId:utils.mathId()
    }).save().then(res=>{
      if(res){
        return {
          code:0,
          data:res
        }
      }else{
        return {
          code:1,
          data:'添加文章失败'
        }
      }
    }).catch(err=>{
      return {
        code:3,
        data:'获取文章失败',
        err:err
      }
    });
    if(result.code==0){
      let articleCount = 0;
      try{
        articleCount = await Lables.findOne({labelId:data.labelId}).then(res=>res.articleCount);
      }catch(err){
        articleCount = 0;
      }
      try{
        await Lables.updateOne({labelId:data.labelId},{articleCount:parseInt(articleCount)+1});
      }catch(err){
        console.log(err);
      }
    }
    return result;
  },
  async UpdateArticle(data){
    const result = await Articles.updateOne({
      'articleId':data.articleId
    },{
      title:data.title,
      keyword:data.keyword,
      label:data.label,
      labelId:data.labelId?data.labelId:utils.mathId(),
      describe:data.describe,
      content:data.content,
      type:data.type,
      status:data.status,
      isopen:data.isopen,
      image:data.image,
      imageList:data.imageList,
    }).then(res=>{
      if(res){
        return {
          code:0,
          data:res
        }
      }else{
        return {
          code:1,
          data:'更新文章失败'
        }
      }
    }).catch(err=>{
      return {
        code:3,
        data:'更新文章失败',
        err:err
      }
    });
    if(result.code==0){
      if(data.delList&&data.delList.length){
        try{
          await this.delArticlesImage(data.delList);
        }catch(err){console.log(err)}
      }
      if(data.labelId!=data.oldLableId){
        let articleCount=0,newArticleCount=0;
        try{
          articleCount = await Lables.findOne({labelId:data.oldLableId}).then(res=>res.articleCount);
        }catch(err){
          articleCount = 0;
        }
        try{
          await Lables.updateOne({labelId:data.oldLableId},{articleCount:parseInt(articleCount)-1<=0?0:parseInt(articleCount)-1});
        }catch(err){console.log(err)}
        try{
          newArticleCount = await Lables.findOne({labelId:data.labelId}).then(res=>res.articleCount);
        }catch(err){
          newArticleCount = 0;
        }
        try{
          await Lables.updateOne({labelId:data.labelId},{articleCount:parseInt(newArticleCount)+1});
        }catch(err){console.log(err)}
      }
    }
    return result;
  },
  async getArticles(data,page,limit){
    const maxLimit = limit?limit:20;
    const _page = parseInt(page)?parseInt(page):1;
    return await Articles.find({
      label:{$regex:new RegExp(data.label,'i')},
      type:{$regex:new RegExp(data.type,'i')},
      isopen:{$regex:new RegExp(data.isopen,'i')},
      status:{$regex:new RegExp(data.status,'i')},
      labelId:{$regex:new RegExp(data.labelId,'i')},
      articleId:{$regex:new RegExp(data.articleId,'i')},
      $or:[
        {title:{$regex:new RegExp(data.keyword,'i')}},
        {describe:{$regex:new RegExp(data.keyword,'i')}},
        {keyword:{$regex:new RegExp(data.keyword,'i')}},
      ]
    })
    .sort({'_id':'-1'})
    .skip((_page-1)*maxLimit)
    .limit(maxLimit)
    .then(res=>{
      if(res){
        return {
          code:0,
          data:res
        }
      }else{
        return {
          code:1,
          data:'获取文章数据失败'
        }
      }
    }).catch(err=>{
      return {
        code:3,
        data:'获取文章数据失败',
        err:err
      }
    });
  },
  async delArticles(data){
    const result = await Articles.remove({articleId:data.articleId}).then(res=>{
      if(res.n=='1'&&res.ok=='1'){
        return {
          code:0,
          data:'文章删除成功'
        }
      }else{
        return {
          code:1,
          data:'文章删除失败'
        }
      }
    }).catch(err=>{
      return {
        code:3,
        data:'文章删除失败',
        err:err
      }
    });
    if(result.code==0){
      let articleCount = 0;
      try{
        articleCount = await Lables.findOne({labelId:data.labelId}).then(res=>res.articleCount);
      }catch(err){
        articleCount = 0;
      }
      const _articleCount = parseInt(articleCount)-1<=0?0:parseInt(articleCount)-1;
      const delList = data.delList;
      const image = data.image;
      const fileList = delList.concat(image);
      if(fileList&&fileList.length){
        try{
          await this.delArticlesImage(fileList);
        }catch(err){console.log(err)}
      }
      try{
        await Lables.updateOne({labelId:data.labelId},{articleCount:_articleCount});
      }catch(err){console.log(err)}
    }
    return result;
  },
  async delArticlesImage(data){
    let array = data.map((item)=>{
      return `cover/${item.fileName}`;
    });
    return await deleteMulti(array);
  }
};
module.exports = mongose;