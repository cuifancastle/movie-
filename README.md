+ 模仿优酷网站
    * 后端技术: 
        * 服务器:nodejs运行环境 express Web框架 mongoose驱动数据库 jade模板引擎
        * 数据库:mongodb        
    * 前端技术: bootstrap  jquery
    
                    
1.博客：(程序实现讲解)
2.demo:http://121.42.213.45:3002/   目测我的服务器2016.12月过期..到时候会不会续费再说..如果地方的话,会修改的
一：功能

    主页视频分栏目展示
    主页的布局,js特效
    视频详情页播放
    录入页上传视频信息
    管理列表页曾删改查视频
二：使用

1. git clone 本项目
2. 安装依赖

    npm install             因为我的依赖没写入package.json,所以运行程序时缺少什么根据提示安装就好啦~,代表我很low囧
3. 配置数据库
本项目使用mongodb 并用mongoose驱动
先瞧下目录:

    * database
        * backups <span>&#9;&#9;备份的示例数据</span>
            * movie <span>&#9;&#9;movie集合的备份文件</span>
        * bin <span>&#9;&#9;二进制文件</span>
            * mongod <span>&#9;&#9;启动数据库</span>
                     <span>&#9;&#9;命令为(在database目录下) ./bin/mongod -f conf/mongod.conf </span>
                     <span>&#9;&#9;意思是根据mongod.conf配置来启动服务</span>
            * mongo  <span>&#9;&#9;使用mongo自带的命令行交互连接数据库</span>
                     <span>&#9;&#9;mongo ip:port</span>
                     <span>&#9;&#9;mongodb搭建请戳 http://blog.csdn.net/cuifancastle/article/details/51443428</span> 
                     <span>&#9;&#9;mongodb曾删改查请戳 http://blog.csdn.net/cuifancastle/article/details/51443436</span> 
            * mongodump <span>&#9;&#9;备份数据库</span>
            * mongorestore <span>&#9;&#9;还原数据库</span>
                           <span>&#9;&#9;数据库备份,导入导出,请戳这里 http://blog.csdn.net/cuifancastle/article/details/51443451</span> 
                            
        * conf <span>&#9;&#9;配置文件</span>
            * mongod.conf 
        * data <span>&#9;&#9;数据存储文件</span>           
        * log<span>&#9;&#9;日志文件</span>
        
    a. 下载mongodb数据库 ,把项目需要的4个二进制文件 从mongodb的安装目录下bin/目录里拷贝过来, 也就是
            
            cp xxxx/mongodb/bin/mongod xxxx/database/bin/   第一个xxx为mongodb安装目录   第二个xxx为项目所在目录
            cp xxxx/mongodb/bin/mongo xxxx/database/bin/    mongodump mongorestore同理
    b. 启动数据库
        
            ./bin/mongod -f conf/mongod.conf
    c. 还原数据到数据库
            
            mongorestore -h IP --port 端口 -u 用户名 -p 密码 -d 数据库 --drop 文件存在路径
            ./bin/mongorestore xxxx/database/backups 大概是这个样子
    d. 连接并查询
            
            mongo 127.0.0.1:27017
            show dbs        //查看数据库
            use movies      //如果没配置错的话,应该是出来了
            show collections //输出集合
            db.movies.find() //输出所有数据
            
4. 安装前端依赖
    a. 安装bower
        
        npm install -g bower
    b. 安装bootstrap
        
        bower install bootstrap 
        安装目录的设置再.bowerrc上 可以查看下
5. 启动服务器
        
        node app.js 第一次使用会缺少很多模块,根据提示 缺什么 npm install xxx 就可以了
6. 访问服务器

        通过浏览器访问本地 127.0.0.1:3002 就可以看到奇效了,必须要联网,因为很多图片连接呀 视频连接之类的存的仅仅是连接..
7. 部署到服务器
        
        1. 我是通过ssh连接到服务器(服务器和本机都是linux ubuntu) 
            关于ssh scp 请戳  <a href="http://blog.csdn.net/cuifancastle/article/details/51443472">http://blog.csdn.net/cuifancastle/article/details/51443472"</a>
        2. 在服务器安装node环境,也可以先安装nvm(管理node版本)
        3. 可以通过 scp上传代码 或者git上传代码 我用的是Git,坑不少
        4. 比如说用git
            a. 服务器 创建项目文件,进入后 git init
            b. 服务器 修改 .git/....  目的是允许远程提交
            c. 本地   git init
                      git commit -am '注释'
                      git remote add 名字 地址  如我的 git remote add aliyun ssh://root@121.42.213.45/~/workspace/movie2/.git
                      git remote -v 查看远程仓库列表
                      git push 名字   etc git push aliyun
                      关于git请戳 .............................
        5.有能力的使用git  hook  but我还没空研究..
        6.服务器安装forever or supverisor   推荐forever我觉得很好用
        7.有能力研究下nginx
        8.忘记说了.还有安装mongodb等 和本地操作一样的 使用wget下载吧
               