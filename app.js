/**
 * Created by cuifancastle on 16-4-29.
 */
//引入express框架
var express = require("express");
var path = require('path');
var mongoose = require('mongoose');
var underscore = require('underscore');//更新movie　替换对象的字段
var Movie = require('./models/movie');


//监听端口
var port = process.env.PORT||3002;
//启动web服务器
var app = express();
//表单解析
var bodyParser= require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//设置视图根目录
app.set('views','./views');
//设置默认模板引擎
app.set('view engine','jade');
// app.use(express.bodyParase());//表单数据
app.use(express.static(path.join(__dirname, 'public')));
//数据库连接
mongoose.connect('mongodb://localhost:27017/movie');

app.locals.moment = require('moment');//格式化时间

app.get('/',function(req,res){
    // Movie.fetch(function(err,movies){
    //     // console.log(movies);
    //     if(err)console.log(err);
    //     res.render('pages/index',{
    //         title:'首页',
    //         movies:movies,
    //         tvs:tvs
    //     });
    // });
    // Movie.findBylanmu('电视剧',function(err,tvs){
    //     if(err)console.log(err);
    //     console.log(tvs);
    //     var zuixin=[];
    //     var rihan=[];
    //     var yingmei=[];
    //     var gangtai=[];
    //     var dalu=[];
    //     for(var i = 0 ;i<tvs.length;i++)
    //     {
    //         if(tvs[i].biaoqian=='最新')
    //         {
    //             zuixin.push(tvs[i]);
    //         }
    //         else if(tvs[i].biaoqian=='日韩剧')
    //         {
    //             rihan.push(tvs[i]);
    //         }else if(tvs[i].biaoqian=='英美剧')
    //         {
    //             yingmei.push(tvs[i]);
    //         }else if(tvs[i].biaoqian=='港台剧')
    //         {
    //             gangtai.push(tvs[i]);
    //         }else if(tvs[i].biaoqian=='大陆剧')
    //         {
    //             dalu.push(tvs[i]);
    //         }
    //     }
    //     console.log(zuixin);
    //     res.render('pages/index',{
    //                 title:'首页',
    //                 tvs:[zuixin,rihan,yingmei,gangtai,dalu]
    //             });
    //
    // });
    Movie.findBybiaoqian('最新',function(err,zuixin){
        if(err)console.log(err);
        Movie.findBybiaoqian('日韩剧',function(err,rihan){
            if(err)console.log(err);
            Movie.findBybiaoqian('英美剧',function(err,yingmei){
                if(err)console.log(err);
                Movie.findBybiaoqian('港台剧',function(err,gangtai){
                    if(err)console.log(err);
                    Movie.findBybiaoqian('大陆剧',function(err,dalu){
                        if(err)console.log(err);

                        Movie.findBybiaoqian('我的大学',function(err,wodedaxue){
                            if(err)console.log(err);

                            Movie.findBybiaoqian('微电影',function(err,weidianying){
                                if(err)console.log(err);

                                res.render('pages/index',{
                                    title:'首页',
                                    tvs:[zuixin,rihan,yingmei,gangtai,dalu],
                                    movies:[wodedaxue,weidianying]
                                });
                            });
                        });
                    });
                });
            });
        });
    });

    // res.render('pages/index',{movies:data});
});
//详情页
app.get('/movie/:id',function(req,res){
    var id = req.params.id;
    console.log('req.params.id:',id);
    Movie.findById(id,function(err,movie){
        if(err)console.log(err);
             // console.log('数据库查询出movie:',movie);
            res.render('pages/detail', {
                movie: movie
            });
        // res.send(movie);


    });
    // var movies=data.filter(function(elem){
    //         return elem._id==req.params.id;
    //     });
    // console.log(movies);
    // var movie = movies[0];
    // res.render('pages/detail',{movie:movie});
});
app.get('/admin/movie',function(req,res){
    res.render('pages/admin',{movie:data[0]});
});
//更新电影
app.get('/admin/update/:id',function(req,res){
    // console.log('req.params',req.params);
    var id = req.params.id;
    if(id)
    {
        Movie.findById(id,function(err,movie){
            res.render('pages/admin',{
               title:'后台录入页',
                movie:movie,
                tv:tvs
            });
        });
    }
});
//添加电影
app.post('/admin/movie/new',function(req,res){
    console.log(req.body);
    console.log(req.body.movie);
    var id = req.body.movie._id;
    var movieobj = req.body.movie;
    var _movie;
    if(id!== 'undefined' )//数据库有,更新
    {
        console.log('id!== undefined');
        Movie.findById(id,function(err,movie){
            if(err){console.log(err)}
            _movie = underscore.extend(movie,movieobj);//将movieobj字段付给数据库取出的movie 用中间变量_movie存储
            // console.log('保存前_movie',_movie);
            _movie.save(function(err,movie){
                if(err){
                    console.log(err);
                }
                // console.log('保存后movie',movie);
                res.redirect('/movie/'+movie._id);
            });
        });
    }
    else//创建新的数据库
    {
        _movie = new Movie({
            doctor:movieobj.doctor,
            title:movieobj.title,
            language:movieobj.language,
            country:movieobj.country,
            summary:movieobj.summary,
            flash:movieobj.flash,
            poster:movieobj.poster,
            year:movieobj.year,
            lanmu:movieobj.lanmu,
            biaoqian:movieobj.biaoqian
        });
        _movie.save(function(err,movie){
            if(err){
                console.log(err);
            }
            res.redirect('/movie/'+movie._id);
        });
    }

});
app.get('/admin/list',function(req,res){
    Movie.fetch(function(err,movies){
        if(err)console.log(err);
        res.render('pages/list',{
            title:'列表',
            movies:movies
        });
    });
    // res.render('pages/list',{movies:data});
});
app.delete('/admin/list',function(req,res){
    var id = req.query.id;
    console.log('DELETE:ID:',id);
    if(id){
        Movie.remove({_id:id},function(err,movie){
           if(err){
               console.log(err);
               res.json({success:2});
           } else{
               res.json({success:1});
           }
        });
    }
});



//监听端口
app.listen(port);
console.log("success on "+port);



//伪造数据
var data =[
        {
            poster:'http://img03.store.sogou.com/net/a/04/link?url=http%3A%2F%2Fimg03.sogoucdn.com%2Fapp%2Fa%2F100520024%2F193884b5a047cd8913d21b1e1293477d&appid=122',
            title:'title1',
            doctor:'导演１号',
            country:'国家１号',
            language:'语言１号',
            year:'19991222',
            summary:'简介１号',
            flash:'http://player.youku.com/player.php/sid/XMTUzOTQwMzMyMA==/v.swf',
            meta:{createAt:20161128},
            lanmu:'电视剧',
            biaoqian:'最新'

        }
];
var detaildata ={};//movie {title,flash,doctor导演，country国家,language,year,summary简介}
var admindata = {};//movie {title,doctor导演，country国家,language,poster海报地址,flash视频地址,year,summary简介}
var listdata={};// movies.item{_id,title,doctor,country,year}
//
/*
* tvs[] 代表电视剧栏目，有数组表示，
* tvs[0]代表电视剧栏目下”最新“标签　用数组表示 一共5个元素，代表“最新”“日韩剧”英美剧、港台剧、大陆剧
* tvs[1][0] 电视剧栏目下“日韩电视剧”标签下　第0个视频　　页面上一共显示9个视频　　用对象表示
* tvs[0][0].title　视频标题
*          ._id  　视频详情　用于a href 连接到视频详情页
*          .flash  视频海报
*          .summary 简介
* var tvs=[[{}{}{}{}{}],[],[],[],[]]
* */
var tvs = [[{
    poster:'http://r3.ykimg.com/050C0000572813F167BC3D70990627B9',
    title:'欢乐颂',
    doctor:'导演１号',
    country:'国家１号',
    language:'语言１号',
    year:'19991222',
    summary:'天啦噜!wuli涛涛求婚了',
    flash:'http://player.youku.com/player.php/sid/XMTUzOTQwMzMyMA==/v.swf',
    meta:{createAt:20161128},
    _id:0

},{
    poster:'http://www.52ij.com/uploads/allimg/160317/0Q91622b-5.jpg',
    title:'title1',
    doctor:'导演１号',
    country:'国家１号',
    language:'语言１号',
    year:'19991222',
    summary:'婚礼遭劈腿　女神变网红',
    flash:'http://player.youku.com/player.php/sid/XMTUzOTQwMzMyMA==/v.swf',
    meta:{createAt:20161128},
    _id:1
},{
    poster:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1390298685,3076735550&fm=116&gp=0.jpg',
    title:'title1',
    doctor:'导演１号',
    country:'国家１号',
    language:'语言１号',
    year:'19991222',
    summary:'简介１号',
    flash:'http://player.youku.com/player.php/sid/XMTUzOTQwMzMyMA==/v.swf',
    meta:{createAt:20161128},
    _id:2
},{
    poster:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1390298685,3076735550&fm=116&gp=0.jpg',
    title:'title1',
    doctor:'导演１号',
    country:'国家１号',
    language:'语言１号',
    year:'19991222',
    summary:'简介１号',
    flash:'http://player.youku.com/player.php/sid/XMTUzOTQwMzMyMA==/v.swf',
    meta:{createAt:20161128},
    _id:3
},{
    poster:'http://pic1.nipic.com/2009-02-19/200921922311483_2.jpg',
    title:'title1',
    doctor:'导演１号',
    country:'国家１号',
    language:'语言１号',
    year:'19991222',
    summary:'简介１号',
    flash:'http://player.youku.com/player.php/sid/XMTUzOTQwMzMyMA==/v.swf',
    meta:{createAt:20161128},
    _id:4
},{
    poster:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1390298685,3076735550&fm=116&gp=0.jpg',
    title:'title1',
    doctor:'导演１号',
    country:'国家１号',
    language:'语言１号',
    year:'19991222',
    summary:'简介１号',
    flash:'http://player.youku.com/player.php/sid/XMTUzOTQwMzMyMA==/v.swf',
    meta:{createAt:20161128},
    _id:5
},{
    poster:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1390298685,3076735550&fm=116&gp=0.jpg',
    title:'title1',
    doctor:'导演１号',
    country:'国家１号',
    language:'语言１号',
    year:'19991222',
    summary:'简介１号',
    flash:'http://player.youku.com/player.php/sid/XMTUzOTQwMzMyMA==/v.swf',
    meta:{createAt:20161128},
    _id:6
},{
    poster:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1390298685,3076735550&fm=116&gp=0.jpg',
    title:'title1',
    doctor:'导演１号',
    country:'国家１号',
    language:'语言１号',
    year:'19991222',
    summary:'简介１号',
    flash:'http://player.youku.com/player.php/sid/XMTUzOTQwMzMyMA==/v.swf',
    meta:{createAt:20161128},
    _id:7
},{
    poster:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1390298685,3076735550&fm=116&gp=0.jpg',
    title:'title1',
    doctor:'导演１号',
    country:'国家１号',
    language:'语言１号',
    year:'19991222',
    summary:'简介１号',
    flash:'http://player.youku.com/player.php/sid/XMTUzOTQwMzMyMA==/v.swf',
    meta:{createAt:20161128},
    _id:8
}],[{
    poster:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1390298685,3076735550&fm=116&gp=0.jpg',
    title:'title1',
    doctor:'导演１号',
    country:'国家１号',
    language:'语言１号',
    year:'19991222',
    summary:'简介１号',
    flash:'http://player.youku.com/player.php/sid/XMTUzOTQwMzMyMA==/v.swf',
    meta:{createAt:20161128},
    _id:0

},{
    poster:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1390298685,3076735550&fm=116&gp=0.jpg',
    title:'title1',
    doctor:'导演１号',
    country:'国家１号',
    language:'语言１号',
    year:'19991222',
    summary:'简介１号',
    flash:'http://player.youku.com/player.php/sid/XMTUzOTQwMzMyMA==/v.swf',
    meta:{createAt:20161128},
    _id:1
},{
    poster:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1390298685,3076735550&fm=116&gp=0.jpg',
    title:'title1',
    doctor:'导演１号',
    country:'国家１号',
    language:'语言１号',
    year:'19991222',
    summary:'简介１号',
    flash:'http://player.youku.com/player.php/sid/XMTUzOTQwMzMyMA==/v.swf',
    meta:{createAt:20161128},
    _id:2
},{
    poster:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1390298685,3076735550&fm=116&gp=0.jpg',
    title:'title1',
    doctor:'导演１号',
    country:'国家１号',
    language:'语言１号',
    year:'19991222',
    summary:'简介１号',
    flash:'http://player.youku.com/player.php/sid/XMTUzOTQwMzMyMA==/v.swf',
    meta:{createAt:20161128},
    _id:3
},{
    poster:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1390298685,3076735550&fm=116&gp=0.jpg',
    title:'title1',
    doctor:'导演１号',
    country:'国家１号',
    language:'语言１号',
    year:'19991222',
    summary:'简介１号',
    flash:'http://player.youku.com/player.php/sid/XMTUzOTQwMzMyMA==/v.swf',
    meta:{createAt:20161128},
    _id:4
},{
    poster:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1390298685,3076735550&fm=116&gp=0.jpg',
    title:'title1',
    doctor:'导演１号',
    country:'国家１号',
    language:'语言１号',
    year:'19991222',
    summary:'简介１号',
    flash:'http://player.youku.com/player.php/sid/XMTUzOTQwMzMyMA==/v.swf',
    meta:{createAt:20161128},
    _id:5
},{
    poster:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1390298685,3076735550&fm=116&gp=0.jpg',
    title:'title1',
    doctor:'导演１号',
    country:'国家１号',
    language:'语言１号',
    year:'19991222',
    summary:'简介１号',
    flash:'http://player.youku.com/player.php/sid/XMTUzOTQwMzMyMA==/v.swf',
    meta:{createAt:20161128},
    _id:6
},{
    poster:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1390298685,3076735550&fm=116&gp=0.jpg',
    title:'title1',
    doctor:'导演１号',
    country:'国家１号',
    language:'语言１号',
    year:'19991222',
    summary:'简介１号',
    flash:'http://player.youku.com/player.php/sid/XMTUzOTQwMzMyMA==/v.swf',
    meta:{createAt:20161128},
    _id:7
},{
    poster:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1390298685,3076735550&fm=116&gp=0.jpg',
    title:'title1',
    doctor:'导演１号',
    country:'国家１号',
    language:'语言１号',
    year:'19991222',
    summary:'简介１号',
    flash:'http://player.youku.com/player.php/sid/XMTUzOTQwMzMyMA==/v.swf',
    meta:{createAt:20161128},
    _id:8
}],[{
    poster:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1390298685,3076735550&fm=116&gp=0.jpg',
    title:'title1',
    doctor:'导演１号',
    country:'国家１号',
    language:'语言１号',
    year:'19991222',
    summary:'简介１号',
    flash:'http://player.youku.com/player.php/sid/XMTUzOTQwMzMyMA==/v.swf',
    meta:{createAt:20161128},
    _id:0

},{
    poster:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1390298685,3076735550&fm=116&gp=0.jpg',
    title:'title1',
    doctor:'导演１号',
    country:'国家１号',
    language:'语言１号',
    year:'19991222',
    summary:'简介１号',
    flash:'http://player.youku.com/player.php/sid/XMTUzOTQwMzMyMA==/v.swf',
    meta:{createAt:20161128},
    _id:1
},{
    poster:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1390298685,3076735550&fm=116&gp=0.jpg',
    title:'title1',
    doctor:'导演１号',
    country:'国家１号',
    language:'语言１号',
    year:'19991222',
    summary:'简介１号',
    flash:'http://player.youku.com/player.php/sid/XMTUzOTQwMzMyMA==/v.swf',
    meta:{createAt:20161128},
    _id:2
},{
    poster:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1390298685,3076735550&fm=116&gp=0.jpg',
    title:'title1',
    doctor:'导演１号',
    country:'国家１号',
    language:'语言１号',
    year:'19991222',
    summary:'简介１号',
    flash:'http://player.youku.com/player.php/sid/XMTUzOTQwMzMyMA==/v.swf',
    meta:{createAt:20161128},
    _id:3
},{
    poster:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1390298685,3076735550&fm=116&gp=0.jpg',
    title:'title1',
    doctor:'导演１号',
    country:'国家１号',
    language:'语言１号',
    year:'19991222',
    summary:'简介１号',
    flash:'http://player.youku.com/player.php/sid/XMTUzOTQwMzMyMA==/v.swf',
    meta:{createAt:20161128},
    _id:4
},{
    poster:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1390298685,3076735550&fm=116&gp=0.jpg',
    title:'title1',
    doctor:'导演１号',
    country:'国家１号',
    language:'语言１号',
    year:'19991222',
    summary:'简介１号',
    flash:'http://player.youku.com/player.php/sid/XMTUzOTQwMzMyMA==/v.swf',
    meta:{createAt:20161128},
    _id:5
},{
    poster:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1390298685,3076735550&fm=116&gp=0.jpg',
    title:'title1',
    doctor:'导演１号',
    country:'国家１号',
    language:'语言１号',
    year:'19991222',
    summary:'简介１号',
    flash:'http://player.youku.com/player.php/sid/XMTUzOTQwMzMyMA==/v.swf',
    meta:{createAt:20161128},
    _id:6
},{
    poster:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1390298685,3076735550&fm=116&gp=0.jpg',
    title:'title1',
    doctor:'导演１号',
    country:'国家１号',
    language:'语言１号',
    year:'19991222',
    summary:'简介１号',
    flash:'http://player.youku.com/player.php/sid/XMTUzOTQwMzMyMA==/v.swf',
    meta:{createAt:20161128},
    _id:7
},{
    poster:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1390298685,3076735550&fm=116&gp=0.jpg',
    title:'title1',
    doctor:'导演１号',
    country:'国家１号',
    language:'语言１号',
    year:'19991222',
    summary:'简介１号',
    flash:'http://player.youku.com/player.php/sid/XMTUzOTQwMzMyMA==/v.swf',
    meta:{createAt:20161128},
    _id:8
}],[{
    poster:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1390298685,3076735550&fm=116&gp=0.jpg',
    title:'title1',
    doctor:'导演１号',
    country:'国家１号',
    language:'语言１号',
    year:'19991222',
    summary:'简介１号',
    flash:'http://player.youku.com/player.php/sid/XMTUzOTQwMzMyMA==/v.swf',
    meta:{createAt:20161128},
    _id:0

},{
    poster:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1390298685,3076735550&fm=116&gp=0.jpg',
    title:'title1',
    doctor:'导演１号',
    country:'国家１号',
    language:'语言１号',
    year:'19991222',
    summary:'简介１号',
    flash:'http://player.youku.com/player.php/sid/XMTUzOTQwMzMyMA==/v.swf',
    meta:{createAt:20161128},
    _id:1
},{
    poster:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1390298685,3076735550&fm=116&gp=0.jpg',
    title:'title1',
    doctor:'导演１号',
    country:'国家１号',
    language:'语言１号',
    year:'19991222',
    summary:'简介１号',
    flash:'http://player.youku.com/player.php/sid/XMTUzOTQwMzMyMA==/v.swf',
    meta:{createAt:20161128},
    _id:2
},{
    poster:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1390298685,3076735550&fm=116&gp=0.jpg',
    title:'title1',
    doctor:'导演１号',
    country:'国家１号',
    language:'语言１号',
    year:'19991222',
    summary:'简介１号',
    flash:'http://player.youku.com/player.php/sid/XMTUzOTQwMzMyMA==/v.swf',
    meta:{createAt:20161128},
    _id:3
},{
    poster:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1390298685,3076735550&fm=116&gp=0.jpg',
    title:'title1',
    doctor:'导演１号',
    country:'国家１号',
    language:'语言１号',
    year:'19991222',
    summary:'简介１号',
    flash:'http://player.youku.com/player.php/sid/XMTUzOTQwMzMyMA==/v.swf',
    meta:{createAt:20161128},
    _id:4
},{
    poster:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1390298685,3076735550&fm=116&gp=0.jpg',
    title:'title1',
    doctor:'导演１号',
    country:'国家１号',
    language:'语言１号',
    year:'19991222',
    summary:'简介１号',
    flash:'http://player.youku.com/player.php/sid/XMTUzOTQwMzMyMA==/v.swf',
    meta:{createAt:20161128},
    _id:5
},{
    poster:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1390298685,3076735550&fm=116&gp=0.jpg',
    title:'title1',
    doctor:'导演１号',
    country:'国家１号',
    language:'语言１号',
    year:'19991222',
    summary:'简介１号',
    flash:'http://player.youku.com/player.php/sid/XMTUzOTQwMzMyMA==/v.swf',
    meta:{createAt:20161128},
    _id:6
},{
    poster:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1390298685,3076735550&fm=116&gp=0.jpg',
    title:'title1',
    doctor:'导演１号',
    country:'国家１号',
    language:'语言１号',
    year:'19991222',
    summary:'简介１号',
    flash:'http://player.youku.com/player.php/sid/XMTUzOTQwMzMyMA==/v.swf',
    meta:{createAt:20161128},
    _id:7
},{
    poster:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1390298685,3076735550&fm=116&gp=0.jpg',
    title:'title1',
    doctor:'导演１号',
    country:'国家１号',
    language:'语言１号',
    year:'19991222',
    summary:'简介１号',
    flash:'http://player.youku.com/player.php/sid/XMTUzOTQwMzMyMA==/v.swf',
    meta:{createAt:20161128},
    _id:8
}],[{
    poster:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1390298685,3076735550&fm=116&gp=0.jpg',
    title:'title1',
    doctor:'导演１号',
    country:'国家１号',
    language:'语言１号',
    year:'19991222',
    summary:'简介１号',
    flash:'http://player.youku.com/player.php/sid/XMTUzOTQwMzMyMA==/v.swf',
    meta:{createAt:20161128},
    _id:0

},{
    poster:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1390298685,3076735550&fm=116&gp=0.jpg',
    title:'title1',
    doctor:'导演１号',
    country:'国家１号',
    language:'语言１号',
    year:'19991222',
    summary:'简介１号',
    flash:'http://player.youku.com/player.php/sid/XMTUzOTQwMzMyMA==/v.swf',
    meta:{createAt:20161128},
    _id:1
},{
    poster:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1390298685,3076735550&fm=116&gp=0.jpg',
    title:'title1',
    doctor:'导演１号',
    country:'国家１号',
    language:'语言１号',
    year:'19991222',
    summary:'简介１号',
    flash:'http://player.youku.com/player.php/sid/XMTUzOTQwMzMyMA==/v.swf',
    meta:{createAt:20161128},
    _id:2
},{
    poster:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1390298685,3076735550&fm=116&gp=0.jpg',
    title:'title1',
    doctor:'导演１号',
    country:'国家１号',
    language:'语言１号',
    year:'19991222',
    summary:'简介１号',
    flash:'http://player.youku.com/player.php/sid/XMTUzOTQwMzMyMA==/v.swf',
    meta:{createAt:20161128},
    _id:3
},{
    poster:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1390298685,3076735550&fm=116&gp=0.jpg',
    title:'title1',
    doctor:'导演１号',
    country:'国家１号',
    language:'语言１号',
    year:'19991222',
    summary:'简介１号',
    flash:'http://player.youku.com/player.php/sid/XMTUzOTQwMzMyMA==/v.swf',
    meta:{createAt:20161128},
    _id:4
},{
    poster:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1390298685,3076735550&fm=116&gp=0.jpg',
    title:'title1',
    doctor:'导演１号',
    country:'国家１号',
    language:'语言１号',
    year:'19991222',
    summary:'简介１号',
    flash:'http://player.youku.com/player.php/sid/XMTUzOTQwMzMyMA==/v.swf',
    meta:{createAt:20161128},
    _id:5
},{
    poster:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1390298685,3076735550&fm=116&gp=0.jpg',
    title:'title1',
    doctor:'导演１号',
    country:'国家１号',
    language:'语言１号',
    year:'19991222',
    summary:'简介１号',
    flash:'http://player.youku.com/player.php/sid/XMTUzOTQwMzMyMA==/v.swf',
    meta:{createAt:20161128},
    _id:6
},{
    poster:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1390298685,3076735550&fm=116&gp=0.jpg',
    title:'title1',
    doctor:'导演１号',
    country:'国家１号',
    language:'语言１号',
    year:'19991222',
    summary:'简介１号',
    flash:'http://player.youku.com/player.php/sid/XMTUzOTQwMzMyMA==/v.swf',
    meta:{createAt:20161128},
    _id:7
},{
    poster:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1390298685,3076735550&fm=116&gp=0.jpg',
    title:'title1',
    doctor:'导演１号',
    country:'国家１号',
    language:'语言１号',
    year:'19991222',
    summary:'简介１号',
    flash:'http://player.youku.com/player.php/sid/XMTUzOTQwMzMyMA==/v.swf',
    meta:{createAt:20161128},
    _id:8
}]];
