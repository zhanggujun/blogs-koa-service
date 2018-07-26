const Labels = require('../mongose/labels');
const controller = {
  async addLabels(ctx, next) {
    const data = JSON.parse(ctx.request.body.data);
    ctx.body = data.add?await Labels.addLabels(data):await Labels.UpdateLabels(data);
  },
  async getLabels(ctx,next){
    const data = JSON.parse(ctx.request.body.data);
    ctx.body = await Labels.getLabels(data);
  },
  async delLabels(ctx,next){
    const labelId = ctx.request.body.labelId;
    ctx.body = await Labels.delLabels(labelId);
  },
  async updateLables(ctx,next){
    const labelId = ctx.request.body.labelId;
    const label = ctx.request.body.label;
    ctx.body = await Labels.updateLables(labelId,label);
  }
};
module.exports = controller;