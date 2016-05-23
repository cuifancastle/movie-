/**
 * Created by cuifancastle on 16-5-1.
 */
var mongoose = require('mongoose');

var MovieSchema = new mongoose.Schema({
    doctor:String,//导演
    title:String,//标题
    language:String,//语言
    country:String,//国家
    summary:String,//简介
    flash:String,//视频地址
    poster:String,//海报地址
    year:Number,//年份
    meta:{
        createAt:{type:Date,default:Date.now()},
        updateAt:{type:Date,default:Date.now()}
    },
    lanmu:String,
    biaoqian:String
});
//每次存储之前都调用这个方法
//目的是判断是否是新加的
MovieSchema.pre('save',function(next){
    if(this.isNew)
    {
        this.meta.createAt=this.meta.updateAt=Date.now();
    }
    else{
        this.meta.updateAt=Date.now();
    }
    next();
});
MovieSchema.statics=
{
    //取出数据库所有的数据
    fetch:function(cb){//cb,callback回调，也就是说执行fetch,查找到数据后执行回调
        return this
            .find({})
            .sort('meta.updateAt')
            .exec(cb)
    },
    findById:function(id,cb){
        return this
            .findOne({_id:id})
            .exec(cb)
    },
    // findBylanmu:function(lanmu,cb){
    //     return this
    //         .find({lanmu:lanmu})
    //         .sort('meta.updateAt')
    //         .exec(cb)
    // },
    findBybiaoqian:function(biaoqian,cb){
        return this//db.movies.find().sort({"meta.updateAt" : 1}).limit(3);
            .find({biaoqian:biaoqian})//查找标签　如"最新“
            .sort({"meta.updateAt" : -1})//依据　更新时间排序  1升序　-1降序
            .limit(9)//返回9条数据   //skip(10)从低10个位置返回9条数据（10,19]
            .exec(cb)
    }

};

module.exports=MovieSchema;









