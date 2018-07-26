const Labels = require('../models/labels');
const Articles = require('../models/articles');
const utils = require('../utils/utils');
const mongose = {
  async addLabels(data) {
    return await new Labels({
      label:data.label,
      time:Date.now(),
      labelId:data.labelId,
      articleCount:0,
      isDefault:data.isDefault?data.isDefault:false
    }).save().then(res=>{
      if(res){
        return {
          code:0,
          data:res
        }
      }else{
        return {
          code:1,
          data:'添加标签失败'
        }
      }
    }).catch(err=>{
      return {
        code:3,
        data:'添加标签失败',
        err:err
      }
    });
  },
  async UpdateLabels(data){
    return data;
  },
  async getLabels(data){
    return await Labels.find({
      label:{$regex:new RegExp(data.label,'i')},
    }).sort({'_id':'-1'}).then(res=>{
      if(res){
        return {
          code:0,
          data:res
        }
      }else{
        return {
          code:1,
          data:'获取标签列表失败'
        }
      }
    }).catch(err=>{
      return {
        code:3,
        data:'获取标签列表失败',
        err:err
      }
    })
  },
  async delLabels(labelId){
    let delCount = 0;
    try{
      delCount = await Labels.findOne({labelId:labelId}).then(res=>res.articleCount);
    }catch(err){
      delCount = 0;
    }
    const result = await Labels.remove({labelId:labelId}).then(res=>{
      if(res.n=='1'&&res.ok=='1'){
        return {
          code:0,
          data:'标签删除成功'
        }
      }else{
        return {
          code:1,
          data:'标签删除失败'
        }
      }
    }).catch(err=>{
      return {
        code:3,
        data:'标签删除失败',
        err:err
      }
    });
    if(result.code==0){
      let defaultCount = null;
      try{
        defaultCount = await Labels.find({isDefault:true}).then((res)=>{
          if(res&&res.length){
            return {
              count:res[0].articleCount,
              labelName:res[0].label,
              labelId:res[0].labelId
            }
          }else{
            return null;
          }
        }).catch(()=>{
          return null;
        });
      }catch(err){
        defaultCount = null;
      }
      delCount = delCount?delCount:0;
      delCount = delCount<=0?0:delCount;
      if(delCount&&delCount>0){
        if(defaultCount){
          defaultCount.count = defaultCount.count?defaultCount.count:0;
          const number = defaultCount.count<=0?0:defaultCount.count;
          const allCount = parseInt(number)+parseInt(delCount);
          try{
            await Labels.update({labelId:defaultCount.labelId},{articleCount:allCount});
          }catch(err){console.log(err)}
          try{
            await Articles.update({labelId:labelId},{$set:{labelId:defaultCount.labelId,label:defaultCount.labelName}},()=>true,()=>true);
          }catch(err){console.log(err)}
        }
      }
    }
    return result;
  },
  async updateLables(labelId,label){
    try{
      await Articles.update({labelId:labelId},{$set:{label:label,labelId:labelId}},()=>true,()=>true);
    }catch(err){console.log(err)}
    return await Labels.update({labelId:labelId},{label:label}).then(res=>{
      if(res.n=='1'&&res.ok=='1'){
        return {
          code:0
        }
      }else{
        return {
          code:1
        }
      }
    }).catch(err=>{
      return {
        code:3,
        data:'标签更新失败',
        err:err
      }
    })
  }
};
module.exports = mongose;