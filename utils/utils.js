const crypto = require('crypto');
module.exports = {
  transfrom(time,type){
    const date = new Date(time);
    const year = date.getFullYear();
    const month = this.addZero(date.getMonth() + 1);
    const day = this.addZero(date.getDate());
    const hour = this.addZero(date.getHours());
    const minutes = this.addZero(date.getMinutes());
    const seconds = this.addZero(date.getSeconds());
    let str;
    switch(type){
      case 'yy':
        str = year;
        break;
      case 'mm':
        str = `${year}-${month}`;
        break;
      case 'dd':
        str = `${year}-${month}-${day}`;
        break;
      case 'hh':
        str = `${year}-${month}-${day} ${hour}`;
        break;
      case 'min':
        str = `${year}-${month}-${day} ${hour}:${minutes}`;
        break;
      case 'ss':
        str = `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`;
        break;
    }
    return str;
  },
  addZero(str){
    return str<10?`0${str}`:str;
  },
  mathId(){
    const str = ('Math_' + Math.random() + new Date().getTime()).replace('.', '');
    const md5 = crypto.createHash("md5");
    const MathId = md5.update(str).digest("hex");
    return MathId;
  }
};