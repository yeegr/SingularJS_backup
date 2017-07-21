# 全栈开发指南

## 简介

### 什么是“全栈开发”？

“全栈开发”这个词来自Facebook（脸书）的招聘要求<sup id="r1">[[1]](#f1)</sup>，然而这个概念并不新鲜。绝大部分的后端程序员对数据库和服务器搭建都有一定的了解，而绝大部分的设计师对客户需求和用户体验也都有一定的经验，难则难在跨越产品开发的整个链条。

百度百科中只有“全栈工程师”<sup id="r2">[[2]](#f2)</sup>这个词条，但是个人觉得并不准确：所谓“全栈”，就是要掌握产品开发中的每一个环节，这包括客户需求、用户体验、界面设计、前端开发、后端开发、系统测试和服务运维等各个方面，能独立完成整个项目。“工程师”的称谓过于局限了，似乎仅仅覆盖了编程这部分，而“开发者”则好像更准确些。

不过为了更简明也更流畅，后面我将把“全栈开发者”简化为“全栈”。

1. <span id="f1">[^](#r1)<span> ["What is a Full Stack developer?"](http://www.laurencegellert.com/2012/08/what-is-a-full-stack-developer/ "What is a Full Stack developer?") by _Laurence Gellert_ (2012-08-01)
2. <span id="f2">[^](#r2)<span> [全栈工程师](http://baike.baidu.com/link?url=bhic5HEpbnawYuYUI7zC1xHMkGZfd87iZsMxtZwLUTBCJcUqE9NBXZ5vfScBX1AxZ4H9XmZz4w-SLjFgFDlQXfKKf1nsIbUStHamzlwoVE_UUui-gnlieBkamSYC5IU6kpXh3MDR_XLCGn8ULfLoMq "全栈工程师") _百度百科_

### 为什么要“全栈开发”？

正如百度百科所说，一名全栈开发者大大的降低了开发团队的人力和沟通成本。我带过多个互联网项目开发团队，仅编程就要包括后台端、网页端、iOS端和Android端，而且每一端往往都要配备至少两人的编制，以保证任何一个岗位的暂时空置不会大幅影响开发进度。这还没有包括项目管理、产品管理以及设计师等岗位。一名全栈的开发速度未必能超过一个三五人的小团队，但是节省的人力和沟通成本则毋庸置疑。

全栈对于初创企业意义很明显，但对于成熟企业也相当重要。一个人，如果能纵观项目全局，对各个组成部分都有一定深度的理解和经验，并能与各环节各自的专职人员进行有机的交流，从而保证项目成功交付，那么他本身也是项目的关键一环。对这样的人，我们往往称之为“全栈综合者”。<sup id="r3">[[3]](#f3)</sup>

3. <span id="f3">[^](#r3)<span> ["The Rise And Fall Of The Full Stack Developer"](https://techcrunch.com/2014/11/08/the-rise-and-fall-of-the-full-stack-developer/ "The Rise And Fall Of The Full Stack Developer") by _Peter Yared_ (2014-11-08)

### 真能“全栈”吗？

不少人认为全栈是杂家而不是专家——样样皆能，样样不精。这是一个误解，“全栈”不是“全能”，互联网开发技术本身也在飞速发展，可谓日新月异，任何一个人，不管其智商多高，经验多丰富，也不可能精通开发流程的每个环节。实际上，一名真正的全栈往往起始于开发环节中的某一个技术领域，不管是设计还是编程，之后逐渐延伸至相关的其他环节。重要的是，对其他领域的能力不能仅仅局限于了解，必须有一定程度的经验，才能在实际工作中发挥作用。国外把这种人才称为“T”型——横向样样皆能，纵向专精一项。我觉得“山”型则更符合实际工作需求，专精至少要达到两到三项，才能完全发挥出全栈开发的优势。

### 怎么成为“全栈”？

有人总结了一下“全栈开发者”需要掌握的大部分知识点<sup id="r4">[[4]](#f4)</sup>，并列表如下。

| 环节 | 知识点 |
|:-|:-|
| 硬件 | 服务器硬件 / RAID / 网络协议 / 块设备 |
| 系统 | Linux / macOS / Windows Server / CoreOS |
| 云服务 | Azure / AWS / Linode / Rackspace cloud |
| 虚拟环境 | Xen / VMware / KVM / VirtualBox |
| 容器 | Google appengine / Docker / Heroku |
| 扩展 | 负载均衡 / 分区 / CDNs |
| 软件包管理 | apt / rpm / brew |
| 服务器管理 | bash / GCC / make |
| 网站服务器 | Apache / Nginx |
| 数据库 | MySQL / SQL Server / MongoDB / Redis |
| 搜索 | Elasticsearch / SOLR / Facets |
| 配置管理 | Puppet / Composer / Chef / Kubernetes |
| 后端开发 | PHP / Java / Go / Ruby / Python / JavaScript |
| 系统安全 | XSS / SQL Injection / SSL |
| 框架 | Wordpress / Flask / Symfony / Reals / Django / Angular |
| 网站开发 | HTML5 / CSS3 / SASS / LESS |
| 手机软件开发 | Swift / Java |
| 前端设计 | UI / UX / Photoshop / Illustrator / Photography |
| 商务需求 | 客户需求 / 项目管理 |

一眼看上去确实能令人心寒。如作者所言，有的只需要几小时就能掌握，有的则需要成年累月的积累。但是，对于一个全新的项目，我们也许能将这个范围大大缩小。

| 环节 | 知识点 | |
|:-|:-|:-|
| 硬件 | 服务器硬件 / RAID / 网络协议 / 块设备 | 都云服务时代了，没必要！ |
| 系统 | Linux / macOS / Windows Server / CoreOS | CoreOS |
| 云服务 | Azure / AWS / Linode / Rackspace cloud | 阿里云 |
| 虚拟环境 | Xen / VMware / KVM / VirtualBox | Docker |
| 容器 | Google appengine / Docker / Heroku | Docker |
| 扩展 | 负载均衡 / 分区 / CDNs | Docker Swarm |
| 软件包管理 | apt / rpm / brew | brew / chocolate |
| 服务器管理 | bash / GCC / make | bash |
| 网站服务器 | Apache / Nginx | Nginx / Node.js |
| 数据库 | MySQL / SQL Server / MongoDB / Redis | MongoDB / Redis |
| 配置管理 | Puppet / Composer / Chef / Kubernetes | Docker Composer |
| 后端开发 | PHP / Java / Go / Ruby / Python / JavaScript | JavaScript |
| 系统安全 | XSS / SQL Injection / SSL | SSL |
| 框架 | Wordpress / Flask / Symfony / Reals / Django / Angular | React |
| 网站开发 | HTML5 / CSS3 / SASS / LESS | React |
| 手机软件开发 | Swift / Java | React Native |
| 前端设计 | UI / UX / Photoshop / Illustrator / Photography | 同左 |
| 商务需求 | 客户需求 / 项目管理 | 同左 |

除了商务需求和前端设计以外，我们真正所需的知识点可以简化并综合为相对较少的几个。

1. 阿里云/CoreOS/Docker：用以运行后台服务
2. bash/brew：命令行，用以管理服务器和软件包
3. Nginx/Node.js/SSL：用以提供后台服务
4. MongoDB/Redis：用以储存数据
5. React/React Native：用以网站和手机软件开发
6. 设计、需求和项目管理

你可能已经注意到了，几乎所有和编程相关的知识点（3、4、5）都是基于JavaScript。下面让我来介绍一个新的框架，SingularJS。

4. <span id="f4">[^](#r4)<span> ["The full stack developer is a myth"](https://medium.com/swlh/the-full-stack-developer-is-a-myth-4e3fb9c25867 "The full stack developer is a myth") by _Scott Hadfield_ (2015-09-04)

### 什么是SingularJS？

我酝酿SingularJS已经好几年了😓。

多年前我们提到所谓软件栈时，一般是指LAMP，一位能独立开发网站的工程师，除了需要掌握配置Linux和Apache外，还要掌握MySQL、PHP以及HTML、CSS和JavaScript等多种语言。在2013年MEAN的概念<sup id="r5">[[5]](#f5)</sup>出现了，基于MongoDB、ExpressJS、AngularJS和Node.js，程序员终于可以用一种熟悉的语言，JavaScript，来开发包括前端界面、后端逻辑、到数据库储存的所有环节，这简直是程序员的圣杯。然而，手机软件的爆发拖延了MEAN的发展——程序员的注意力为了开发iOS和Android手机软件而转向Objective-C和Java，而纯网站程序员只得借助[PhoneGap](http://phonegap.com/ "Adobe PhoneGap")（或其开源分支[Cordova](https://cordova.apache.org/ "Apache Cordova")）之类的API库进行混合模式的APP开发——即将HTML5页面直接嵌入手机软件中，其效果可想而知。

2015年初，在其React库的基础上，Facebook推出了React Native，一个针对手机软件，并能提供近乎原生代码性能的开源JavaScript库。这在互联网开发行业中可谓地动山摇。在两年多来连续不断的推陈更新，以及开源社区的共同努力下，React和React Native逐渐成熟，促成了MERN——MongoDB、ExpressJS、React（包括React Native）和Node.js。和MEAN以及LAMP最大的不同，MERN覆盖到包括iOS、Android乃至微软的UWP（Universal Windows Platform）等多个终端平台，程序员终于可以一种语言走天下了！

当然，“一种语言走天下”只是一个妄想，想成为一名合格的全栈，你仍旧要掌握大量相关的知识和丰富的实际工作经验。这样的积累不是三五个月就能获得，甚至不是三五年内就能获得，没有五到十年的沉淀，你难以在开发的每一个环节都达到令人满意的深度。

然而，一个全新的项目对于一位优秀的全栈，仍旧有许多令人乏味的基础工作需要完成，这就是我开发SingularJS原因。

SingularJS是我近20年开发工作的一个总结。这个项目的目标是在MERN的基础上，开发一个拥有绝大部分常用功能的平台，如电商、社交、活动等，同时兼顾不同的系统和设备。当SingularJS上线后，一名有一定经验的JavaScript工程师，能通过它迅速的完成平台部署和基础开发，尽早一步开始创新。

从现在开始，我将逐步记录下SingularJS的整个开发过程，向大家分享一些工作中遇到的问题和解决方案，以及一些心得。欢迎有兴趣的朋友提问、指正。这篇博客的主线不会深入涉及各项相关技术，只会肤浅地解释一些需要了解的知识点。更深入的内容，我会要么指向其他相关资源，要么另开贴详解。

5. <span id="f5">[^](#r5)<span> ["The MEAN Stack: MongoDB, ExpressJS, AngularJS and Node.js"](https://medium.com/swlh/the-full-stack-developer-is-a-myth-4e3fb9c25867 "The MEAN Stack: MongoDB, ExpressJS, AngularJS and Node.js") by _Valeri Karpov_ (2013-04-30)

## SingularJS

### 功能

#### 用户结构

我的目标是能够从零开始，迅速搭建一个能满足当前绝大部分互联网平台项目需求的技术平台。首先要搞清楚的是，这样的平台需要什么样的用户结构。

除了如微信、微博等通讯、社交平台外，一般说来，互联网平台有三个用户人群：消费者、服务商和管理平台。传统的平台模式，以电商最为典型，服务商是主动方，而消费者则是被动方。

1. 由服务商向平台提供服务，包括文字、产品、活动等；
2. 管理平台审核服务内容，通过后向消费者展示或推送；
3. 消费者选择对该服务相应的操作，阅读、购买、报名、或者掠过。

而新一代的平台，如打车平台，消费者是主动方，服务商则是被动方，这里

1. 消费者提出消费要求；
2. 管理平台向合适的服务商转发该要求；
3. 服务商选择是否接受消费要求。

#### 功能需求

搭建我想要的平台，需要至少满足以下的功能点：

1. 要覆盖三种不同的用户人群，消费者、服务商和管理平台。
2. 要能提供新闻、电商、活动、社交等板块，地图、直播等功能，这些不仅覆盖到当前最常见的互联网应用，并且将利用到大量设备本身硬件，包括摄像头、GPS、蓝牙等。
3. 要尽可能覆盖到所有设备，也就是说，对于每种用户，都有相应的网站、移动网站、手机软件、平板软件用以操作。
4. 要尽可能覆盖到所有的操作系统，也就是说，对于每种用户的手机和平板，都有iOS和Android的软件。并且将在适当的时候，加入UWP（Universal Windows Platform）软件。

#### 技术要求

即便满足了以上的各点，这个平台仍必须有严格的技术要求，才能保证可以持续高速开发。

1. 前后端协议一律采用JSON API形式，并进行加密，统一不同终端与后端的通信。
2. 前端逻辑统一处理，统一不同终端的操作流程。
3. 因为前后端统一使用JavaScript，前后端相同功能的函数尽可能统一处理。
4. 前端界面除个性化设置外，一律通过后端更新，尽可能减少前端升级需求。
5. 支持多语言界面。

### 知识要求

SingularJS对开发者的要求不高，主要包括基础的OS操作，如怎样使用Terminal（macOS）或Command Prompt（Windows），和对JavaScript一定程度的掌握。

### 工具

#### 硬件

这是件很有趣的是，我本是个忠实的Windows用户，但是前两年为了开发iOS软件，转到了OSX（后来macOS）上。我本以为这会是个很大的挑战，一旦开始用才发现，Windows和macOS之间的相同远远多于不同。而这两年微软和苹果的变化也很大，由于iOS、Android以及Linux的普及，大量的开发者从Windows平台转到了macOS上；反之，由于微软在平板电脑和数字画笔上的发力，以及对英伟达的支持，大量的设计师从macOS平台转向了Windows。倒退10年这几乎难以想象，这从另一发面证明了互联网开发行业变化之迅速。

##### 笔记本

简而言之，鉴于我们将要开发iOS和Android软件，而iOS软件只能通过macOS开发（Android，则可以在Windows、macOS甚至Linux上开发），我们需要一台苹果电脑。我的建议是一台[MacBook Pro](https://www.apple.com/cn/macbook-pro/)加上尽可能多的内存。虽然程序开发本身对硬件没有很高的要求，但我们将会安装Docker并驱动多个容器，而且在开发过程中难免会需要同时打开Photoshop和Illustrator，所以系统资源仍旧是越多越好。MacBook、MacBook Air和Mac mini的最大内存仅有8GB，而Mac Pro（垃圾桶）作为一个即将被淘汰的产品也不建议购买。

如果你的项目不包括iOS（🤔真的吗？），你仍旧可以选择MBP，通过Bootcamp安装Windows，用双启动或虚拟机软件如[Parallels desktop](http://www.parallels.com/cn/ "Parallels desktop")等来跑Windows。当然，你也可以选择一台纯Windows笔记本，微软的[Surface Pro 4](https://www.microsoftstore.com.cn/surface/surface-book/p/mic1628)和戴尔的[XPS 15](http://china.dell.com/cn/p/xps-15-9560-laptop/pd?oc=xps%2015-9560-d1845)都是不错的选择。

##### 显示器

如果你有足够的资金，应该购买1台甚至2台4K显示器做扩展。为什么选择4K呢？目前，绝大多数智能手机已经达到1080的分辨率，既1080x1920，加上窗口的边框和macOS的菜单条（或Windows的任务条），普通的1920x1080或1920x1200的HD显示器，即便能做90&deg;旋转，也已经无法1:1显示手机屏了。我推荐戴尔24英寸的[P2415Q](http://accessories.ap.dell.com/sna/productdetail.aspx?c=cn&cs=cndhs1&l=zh&s=dhs&sku=391-BBYZ)或27英寸的[P2715Q](http://accessories.ap.dell.com/sna/productdetail.aspx?c=cn&cs=cndhs1&l=zh&s=dhs&sku=210-AEBF)，在天猫上的价格分别在&yen;2700和&yen;4000左右。如果你同时对色彩有比较高的要求，可以通过苹果商店入手21.5英寸的4K[LG UltraFine](https://www.apple.com/cn/shop/product/HKMY2CH/A/lg-ultrafine-4k-显示屏 "LG UltraFine 4K")，&yen;5498。最新的15寸MBP可以同时驱动两台5K的[LG UltraFine](https://www.apple.com/cn/shop/product/HKN62CH/A/lg-ultrafine-5k-显示屏 "LG UltraFine 5K")显示器，但是那意味着为了多出的60%的像素，你要多花1倍甚至更多的钱，性价比比较低。

##### 键盘

入手一个全尺寸的蓝牙键盘也很重要。程序员的打字工作也许没有纯文字工作者多，但是对键盘的损耗仍旧不小，而对于笔记本而言，失灵的键盘往往意味着大修，尤其是全新的MBP键盘。新一代的笔记本的USB-A接口越来越少（MBP一个都没有，😞），如果你不打算用笔记本来玩游戏的话，蓝牙键盘能节省你一个USB-A接口。

##### 台式机？

显示器+键盘，为什么不直接上台式机呢？相对于笔记本来说，笨重的台式机局限了你工作的灵活性——你无法随时随地投入工作。除非有较频繁的视频编辑工作，我仍旧推荐使用笔记本。不过，如果确实需要，一台[iMac](https://www.apple.com/cn/imac/ "iMac")也足够了。要是感觉iMac的性价比太低的话，你也可以自己攒一台[Hackintosh](http://baike.baidu.com/item/Hackintosh)台式机。如果不打算用来编辑视频或玩游戏，我建议使用Intel的[NUC](http://www.intel.cn/content/www/cn/zh/nuc/overview.html "NUC")准系统攒机，相对比较简单。关于攒Hackintosh，我会专门另写博客演示。

##### 设备

###### iOS

如果你的项目中包括移动开发😉，你需要移动设备。虽然Xcode和Android Studio提供各自的模拟器（Simulator/Emulator），有很多功能，诸如GPS等，仍旧是在实体硬件上进行测试最为稳妥。无论是APP还是移动网站，只有在实体硬件上才能最贴近用户的实际体验。

对于iOS开发来说，需求相对简单，一台[iPhone](https://www.apple.com/cn/iphone/ "iPhone")足矣。iPhone现在有3个分辨率，5S和[SE](https://www.apple.com/cn/iphone-se/ "iPhone SE")的640x1136，4.7"的750x1334和5.5"的1080x1920，选取其中的一个，另外两个分辨率可以通过模拟器测试。

如果有[iPad](https://www.apple.com/cn/ipad/ "iPad")的测试需求的话，iPad mini 2/3/4，9.7"的iPad、iPad Air 2和iPad Pro都是2048x1536像素的分辨率，而12.7"的iPad Pro则是2732x2048，鉴于后者微小的市场占有率，可以基本忽略，通过模拟器测试即可。

一般来说，我会选择一款仍旧有相对大的市场占有率，但仍能升级到最新版iOS的老款设备，如iPhone 6或iPhone 6 Plus作为测试机，作为流畅测试的底线。

###### Android

倒退两三年，你会要为Android多种不同的分辨率而头疼，现在虽然品牌和型号都大大缩减，但情况仅仅略有好转。单从设计的角度来说，虽然绝大部分手机的分辨率都落在720x1280、1080x1920和1440x2560三种之间，但不同品牌的手机都有各自不同的Android ROM，不同型号的手机都有各自不同的按键（实体、虚拟、与指纹按键合并等），于是留给APP或浏览器的实际显示高度都各自不同，这是在产品设计时需要考虑的问题。

虽然三星、华为、OPPO、VIVO、小米、联想和中兴等厂家占据了国内主要的市场，我选择了[一加3](http://www.oneplus.cn/product/oneplus3 "OnePlus 3")作为主测手机。原因很简单，相对于三星、华为和小米等一线ROM，一加的[氢OS](http://www.oneplus.cn/product/oneplus3/h2os "H2OS")更贴近Android的原生体验，加入Google的服务也更容易些。

---

以上是SingularJS开发所需的硬件，下面我们来谈谈服务。

#### 开发服务

说完硬件了，不是应该说软件了吗🤔？如今，很多软件已经转型为云服务，你往往需要一个Email地址注册一个账户；再说，如果你想上架一款移动软件，相应商店的账户更是必须的。所以，在实际使用软件前，咱们应首先注册相应的服务。而支付宝、微信等服务，往往需要几天的认证过程，所以提前注册服务账户也是个好的习惯。

##### 域名

国内的域名注册可以说已被[阿里云](https://wanwang.aliyun.com "阿里云")（原[万网](http://net.cn "万网")）垄断。是的，我也用过更便宜的域名注册服务，但是当我想将域名转到其他的服务商时却是困难重重，总有各种名目导致域名无法迁出。阿里云的域名服务已达到国际标准，而且也不是很贵，没特殊原因，我不建议使用国内其他的域名服务。

国外最出名的域名注册商是[GoDaddy](http://godaddy.com "GoDaddy")和[Register.com](https://www.register.com "Register.com")，但是由于众所周知的原因，这两个服务商所代理的域名往往遭到污染，在国内无法正常访问，如果你的服务对象包括大陆，我还是建议使用阿里云。

###### 注册阿里云账号

![阿里云-注册](https://github.com/yeegr/SingularJS/blob/master/blog/img/aliyun_signup.png?raw=true "阿里云-注册")

*** 注意 *** 一个手机号码只能绑定最多两个阿里云账号！

###### 搜索域名

![阿里云-域名搜索](https://github.com/yeegr/SingularJS/blob/master/blog/img/aliyun_domain_search.png?raw=true "阿里云-域名搜索")

域名搜索会给你一大串结果，具体选择哪几个完全基于你的项目需求。现在，顶级域名后缀<sup id="r6">[[6]](#f6)</sup>越来越多，覆盖全部后缀既不可能，也不必要，完全是浪费银子。一般来说，如果你的项目是个商业项目，注册.com、.net、.cn、.com.cn、.net.cn就可以了，为了防止歧义，可以加注.org和.org.cn，其他如.biz、.info、.store和.mobi等则看项目需求，更新的后缀诸如.top、.wang等可以忽略不计了。至于中文后缀.中国、.网络、.公司，除非是要占坑，要不真没什么意义。

6. <span id="f6">[^](#r6)<span> ["域名后缀"](http://baike.baidu.com/item/域名后缀 "域名后缀") _百度百科_

##### 云服务器

Amazon [AWS](https://aws.amazon.com/cn/ "Amazon Web Services")和Microsoft [Azure](https://www.azure.cn/ "Microsoft Azure")是当前全球最大的两个云服务平台，以IaaS<sup id="r7">[[7]](#f7)</sup>为主，直接提供虚拟化的服务环境如防火墙、数据库、储存、计算等，主要优势是进一步降低维护成本，主要缺点是开发成本提升，开发者需要熟悉服务平台的开发方案。

相较而言，国内的三大云平台[百度云](https://cloud.baidu.com/ "百度云")、[阿里云](https://aliyun.com/ "阿里云")、[腾讯云](https://www.qcloud.com/ "腾讯云")则提供的是PaaS<sup id="r8">[[8]](#f8)</sup>，直接提供虚拟的服务器，主要优点是开发更直观，缺点则是类似负载均衡、硬件拓展等大量的运维工作仍需要自己管理。

我们将首先考虑PaaS，不仅能熟悉部分Linux的运维操作，更重要的是，PaaS是符合多数大、中项目的需求。在SingularJS逐渐成熟后，在适当的时候，我们将加入AWS和Azure的移植方案。

国内三大平台中，阿里云更为成熟，服务的广度、深度和稳定性相对要么持平要么更好，在项目没有特殊要求的前提下，我一般都会选择阿里云。以下分别是阿里云的ECS购买首页、控制管理台首页和云服务管理台页的截屏。

![阿里云-ECS](https://github.com/yeegr/SingularJS/blob/master/blog/img/aliyun_ecs_buy.png?raw=true "阿里云-ECS")

![阿里云-控制台](https://github.com/yeegr/SingularJS/blob/master/blog/img/aliyun_control_panel.png?raw=true "阿里云-控制台")

![阿里云-ECS实例](https://github.com/yeegr/SingularJS/blob/master/blog/img/aliyun_ecs_instance.png?raw=true "阿里云-ECS实例")

7. <span id="f7">[^](#r7)<span> ["Infrastructure as a Service"](http://baike.baidu.com/item/IaaS "基础设施即服务") _百度百科_
8. <span id="f8">[^](#r8)<span> ["Platform as a Service"](http://baike.baidu.com/item/PaaS "平台即服务") _百度百科_

###### 网站备案

备案是大陆的特色。在国内，没有备案，域名就不能访问。

> 根据工信部规定，使用大陆境内服务器的组织或个人，若要使用独立域名开办网站 ，就需要履行备案手续。

备案可以以公司或个人的名义备案，具体的准备资料和操作流程，可以参考阿里云的[备案那些事](https://yq.aliyun.com/topic/57 "备案那些事")。初次备案一般需要2-3周左右，服务商初审通过后，一般会通知你备案结果在15个工作日内以短信模式下发到注册的手机号码上。虽然我几次备案的时间都更短，但是项目规划时还是要预出足够的时间。

##### 邮箱

有了域名和服务器，下一步就是建立一个企业邮箱了。我建议你选择一个企业邮箱云服务（SaaS<sup id="r9">[[9]](#f9)</sup>），虽然你也可以自建一个邮箱服务器，硬件、软件和维护成本实在是得不偿失。

###### 云邮箱

在国内诸多主流企业邮箱云服务中，只有[腾讯企业邮箱](https://exmail.qq.com "腾讯企业邮箱")是仍旧提供免费版，而且免费版支持上限50个账号！腾讯还有免费的[iPhone](https://itunes.apple.com/cn/app/id473225145)、[iPad](https://itunes.apple.com/cn/app/id880859615)和[Android](http://app.mail.qq.com/cgi-bin/mailapp?latest=y&from=2&downloadclick=)移动客户端——QQ邮箱，同时也支持其他APP通过POP3/IMAP协议访问，甚至能绑定微信和QQ账号。只要规范化操作，利用企业网盘和个人中转站，不把大的附件传来传去，对于绝大部分中小企业来说，免费的腾讯企业邮箱足够用了。

![腾讯企业邮箱-购买](https://github.com/yeegr/SingularJS/blob/master/blog/img/tencent_exmail_buy.png?raw=true "腾讯企业邮箱-购买")

如果你的企业已经在使用微软的[Office 365商业高级版](https://www.microsoftstore.com.cn/office-365-business-bundle "Office 365企业套餐")的话，也可以考虑利用其邮箱服务——反正已经付费了。

![微软Office 365企业套餐](https://github.com/yeegr/SingularJS/blob/master/blog/img/microsoft_office_365_business.png?raw=true "微软Office 365企业套餐")

###### 指向

一般来说，只要服务商备案初审通过了，你就可以在域名管理平台上将邮箱服务指向新建的企业邮箱了——没有这一步，邮件就找不到相应的服务器投送。腾讯提供详细的设置步骤：[在万网注册的域名如何设置MX记录？](http://service.exmail.qq.com/cgi-bin/help?subtype=1&&id=20012&&no=1000582)。你也可以在其[帮助中心](http://service.exmail.qq.com/)的[创建](http://service.exmail.qq.com/cgi-bin/help?id=20012)栏下找到其他域名服务商的设置步骤。

| 记录类型 | 主机记录 | 解析线路 | 记录值 | MX优先级 | TTL |
|:-|:-|:-|:-|:-|:-|
| MX | (不需填写) | 默认 | mxbiz1.qq.com | 5 | 10分钟 |
| MX | (不需填写) | 默认 | mxbiz2.qq.com | 10 | 10分钟 |

实际上，在阿里云（万网）域名控制台解析域名时，利用其《新手设置引导》功能，可以直接选择的腾讯企业邮箱作为解析目标。

![阿里云域名解析-MX](https://github.com/yeegr/SingularJS/blob/master/blog/img/aliyun_domain_mx.png?raw=true "阿里云域名解析-MX")

###### 常用邮箱地址

注册了企业邮箱之后，首先要设置几个常用的地址。我自己一般会设置以下几个账户：

* dev: 开发账号，用于注册各种开发资源，包括Xcode、Android市场、微信开发、Github等等，属于研发部
* pay: 支付账号，用于注册各种网络支付服务，包括支付宝、微信支付、Apple Pay等，属于财务部
* ***: 公众账号，用于注册各种公众宣传账号，如微信公众号、头条号等，如果有品牌偶像，则可以使用其拟人名称，属于公关部
* recruit: 招聘账号，用于注册各种招聘服务，如招聘网、无忧网等，属于人事部

之后再根据部门需求设置部门邮件组。

* rd: **R**esearch & **D**evelopment - 研发部
* fa: **F**inance and **A**ccounting Department - 财务部
* pr: **P**ublic **R**elations - 公关部
* hr: **H**uman **R**esources - 人事部
* mktg: **Marketing** - 市场部
* sales: 销售部

之后再设置个人邮箱。

![腾讯企业邮箱-账号](https://github.com/yeegr/SingularJS/blob/master/blog/img/tencent_exmail_accounts.png?raw=true "腾讯企业邮箱-账号")

9. <span id="f9">[^](#r9)<span> ["Software as a Service"](http://baike.baidu.com/item/SaaS "软件即服务") _百度百科_

##### Xcode/DUNS

App Store是唯一的苹果官方软件下载渠道，上架一款软件首先要用一个Apple ID注册（Enroll）一个开发者账号（个人、企业和政府机关）。

1. 注册信息要求除当地文字（汉字）以外，对非英语的国家和地区还要求相应的英文信息，包括姓名、地址等。
2. 个人开发者需支付99美刀的年费。只支持信用卡收费，不支持银行卡或支付宝等。而且信用卡主应是注册人本人，不然注册会被延迟，并需要你提供个人的身份证的扫描件。

注册后两种账号时需要提供企业和机关的名称等信息，以及[邓氏编码](http://baike.baidu.com/item/DUNS "邓氏编码")编码。只有这样，iTunes页面上的开发者（或开发商）后面才不会显示个人姓名。

如果不确定企业是否已经有邓氏编码，可以先通过苹果提供的[链接](https://developer.apple.com/enroll/duns-lookup/#/search "Look up your D-U-N-S Number")查看，如果找不到结果则可以选择一步提交申请，一般在两到三个工作日内就会接到电话回访，按照提交的信息确认，并说明是为了App Store上线软件就可以免费获得邓氏编码了。

![Look up your D-U-N-S Number](https://github.com/yeegr/SingularJS/blob/master/blog/img/xcode_duns_lookup.png?raw=true "Look up your D-U-N-S Number")

有了邓氏编码就可以完成企业账号的注册。

1. 和个人信息一样，需要准备好企业的英文信息，包括名称、地址等。
2. 需要向苹果提供企业网址、座机和工作邮箱（不能使用类似gmail.com或hotmail.com之类的邮箱，虽然163和126的邮箱是可以通过检验的，不过不建议使用）。
3. 企业账号的年费用为299美刀。

![Apple Developer Program Enrollment](https://github.com/yeegr/SingularJS/blob/master/blog/img/xcode_developer_enrollment_organization.png?raw=true "Apple Developer Program Enrollment")

通过企业开发者账号提交的App，才能在“开发商”栏显示企业的名称，而不是个人的英文名。

![微信iTunes下载页](https://github.com/yeegr/SingularJS/blob/master/blog/img/itunes_wechat.png?raw=true "A微信iTunes下载页")

##### 版本控制

版本控制<sup id="r10">[[10]](#f10)</sup>是开发中非常重要的一环，无论是团队还是个人。Git<sup id="r11">[[11]](#f11)</sup>在近几年内飞速发展，现在已经取代了SVN<sup id="r12">[[12]](#f12)</sup>成为最为普及的版本控制系统。安装Xcode会自动安装Git，而微软则号称拥有全球最大的Git代码库，并将Windows开发完全转移至Git上，Git的受欢迎度可见一斑。

10. <span id="f10">[^](#r10)<span> ["版本控制"](http://baike.baidu.com/item/版本控制 "版本控制") _百度百科_
11. <span id="f11">[^](#r11)<span> ["Git"](http://baike.baidu.com/item/Git "Git") _百度百科_
12. <span id="f12">[^](#r12)<span> ["SVN"](http://baike.baidu.com/item/SVN "SVN") _百度百科_

###### GitHub

[GitHub](https://github.com "GitHub")则是当前全球最大的代码托管云服务，其版本控制系统完全基于开源的Git。使用GitHub这样的SaaS托管代码，与使用云邮箱服务一样，消除了自己建立并维护版本控制服务器的工作，保证团队可以在任何时间、任何地点获取所需的代码。而且，开发SingularJS所需的开源控件，也基本上都使用GitHub进行代码托管和版本控制，鉴于SingularJS是个开源项目，我们也不例外。

###### 私有

但如果你的项目是个非开源的项目，那么就需要找一个提供私有仓库的云服务了。GitHub也提供私有仓库，但是是收费的，而[GitLab](https://gitlab.com "GitLab")则可以免费建立私有仓库。

由于众所周知的原因，GitHub和GitLab可能会出现偶尔不能访问的问题，你也可以选择一个国内的代码托管云服务，比较出名的包括[码云](https://git.oschina.net "码云")、[Coding.net](https://coding.net "Coding.net")、[CSDN Code](https://code.csdn.net "CSDN Code")，还有[Alicode](https://code.aliyun.com "Alicode")。

更可靠的方案则是通过给代码仓库添加远程服务器，将国内的云托管作为GitHub或GitLab的备用。

###### Git操作

想真正掌握Git操作，可以从[Pro Git](https://git-scm.com/book/zh/v2 "Pro Git")开始，然而在实际工作中，Git的诸多命令你不需要都记下来。我将这些命令分为以下四大类。

第一类是零星用到的命令，包括

```bash
# 设置全局变量
$ git config --global user.name <user name>
$ git config --global user.email <user email address>

# 在当前文件夹下初始化一个代码库
$ git init

# 新建一个文件夹，并为其初始化一个Git代码库
$ git init [directory]

# 克隆一个代码库
$ git clone <url>

# 克隆一个代码库至指定文件夹
$ git clone <url> [directory]

# 管理代码库
$ git remote
```

第二类是被直接整合到开发软件的文件操作中，包括

```bash
# 添加文件
$ git add

# 删除文件
$ git rm

# 重命名文件
$ git mv
```

第三类是被整合到开发软件的Git菜单里，包括

```bash
# 提交变化到仓库
$ git commit -m <message>

# 更新远程仓库
$ git push

# 下载远程仓库并与本地整合
$ git pull

# 显示当前工作树的状态
$ git status
```

第四类是不常用也未被整合的命令（针对[Visual Studio Code](#vsc "Visual Studio Code")而言），包括

```bash
# 下载远程仓库
$ git fetch

# 合并分支
$ git merge

# 列表本地分支
$ git branch

# 新建分支并切换
$ git checkout

# 显示提交之间的变化
$ git diff
```

第一类属于设置一次就忘，建议用文档记录下来；第二和第三类的基本功能已经整合到IDE里，知道个大概也就好了；第四类主要用于处理问题，知道出现了什么问题应该该怎么处理就好，具体命令选项到时候再百度。

##### 项目管理

有效的项目管理能协助团队掌控开发节奏，保持开发进度，而和市场、销售，乃至投资人等不间断的沟通，则可以保证产品不至于拐入死角。即便是一个人的独自开发，使用项目管理的方式方法也有助于培养个人的开发纪律，维持开发动力。然而项目管理的内容相当广泛，我不想在这里花更多的篇幅探讨，这里只针对全栈开发时可能用到的项目管理工具发表一下个人的意见。

最注明的项目管理工具可能就是微软的[Project](https://products.office.com/zh-cn/project "Microsoft Project")，这是一个传统的Server-Client结构的软件，更适合有规模公司做项目规划，对今天互联网中小开发团队更灵活的需求显得臃肿庞大。目前国际上最火的项目管理服务是[Asana](https://asana.com/ "Asana")，对15人（包括）内的团队免费开放。另一个是出名的软件则是[JIRA](https://www.atlassian.com/software/jira/ "JIRA")，10人（包括）以内的团队自带服务器只需要一次性支付10美元就可以下载安装。相对来说，Asana是一个更通用的项目管理系统，而JIRA出身于软件缺陷跟踪系统，所以对软件开发的支持要强于Asana。

###### Teambition

然而我想主要介绍一下[Teambition](https://www.teambition.com/zh/ "Teambition")，一款可以和Asana、JIRA等业界大头相提并论的国产项目管理服务。和Asana、JIRA类似，Teambition的客户端包括了网站、移动网站、Windows和macOS桌面软件、iOS和Android手机、平台软件，可谓是全方位覆盖。Teambition提供了Asana和JIRA的绝大部分主要功能，而且不仅10人（包括）之内免费，10人以上的收费也是对手的1/3甚至更低。

![项目列表](https://github.com/yeegr/SingularJS/blob/master/blog/img/teambition_mac_home.png?raw=true "Teambition项目列表")

![项目首页](https://github.com/yeegr/SingularJS/blob/master/blog/img/teambition_mac_project.png?raw=true "Teambition项目首页")

了解更多Teambition的功能，可以[点击这里](https://www.teambition.com/zh/tour "Teambition功能展示")

#### 第三方服务

##### 微信公众号

[微信公众平台](https://mp.weixin.qq.com "微信公众平台")目前提供三种不同的公众号，服务号、订阅号和企业号，点击[这里](https://kf.qq.com/faq/120911VrYVrA130805byM32u.html)了解其中的区别。

![微信公众号功能区别](http://file.service.qq.com/user-files/uploads/201612/cc31a8aa962694ea6a2b2ee08bdc4632.jpg "微信公众号功能区别")

公众号注册流程可参见[微信公众平台注册流程指引](https://kf.qq.com/product/weixinmp.html#hid=87 "微信公众平台注册流程指引")。

目前，微信的各种公众号中服务号的用途最为广泛，而只有认证的服务号才能完美支持微信支付。微信认证需每年支付300元审核费，认证后可开通微信支付权限，即在App和网页中支持微信支付功能。

认证流程可参见[微信公众号认证流程指引](https://kf.qq.com/product/weixinmp.html#hid=99 "微信公众号认证流程指引")，注意需要大量的影印件。

##### 微信支付

微信服务号认证成功之后，就能进一步开通[微信支付](https://pay.weixin.qq.com/ "微信支付平台")功能。微信支付又分为多个“场景”，其中“公众号支付”和“APP支付”的唯一区别就是是否和现有的认证公众号绑定。所以，如果已经有了认证公众号，则应选择公众号支付，否则将会在你的商家账户中产生一个不跟公众号向关联的支付账号。***注***：支付渠道（网站、APP等）将在程序中加以区分。

支付申请流程可见[公众号支付接入方法指引](http://kf.qq.com/faq/170116ZFBRRf170116AVV3Er.html "公众号支付接入方法指引")，注意要和公司财会沟通好，以便及时获得腾讯打给公司银行账户的小额资金数额（一般在1元之内），通过微信商户平台输入，才能正式开通支付功能。

##### 支付宝

注册支付宝企业账户

![注册支付宝企业账户](https://github.com/yeegr/SingularJS/blob/master/blog/img/alipay_signup.png?raw=true "注册支付宝企业账户")

##### 阿里大于

#### 软件

软件是开发的核心工具。如果说硬件是开发者手中的宝剑，那么软件则是剑法秘笈。没有合适的、趁手的软件，硬件再好也无用武之地。

##### 软件包管理器

软件包管理器来源于Linux，用于OS自动安装、配制、卸载和升级软件或服务。虽然macOS有App Store，Windows有Microsoft Store，但是不仅其软件数量和种类都过于局限，而且其图形界面相较于软件包管理器的命令行界面也过于臃肿和唐突。

###### Homebrew

[Homebrew](https://brew.sh/index_zh-cn.html "Homebrew")是macOS平台上最火的软件包管理器，在其基础上，你还可以安装[Homebrew-Cask](https://caskroom.github.io/ "Homebrew Cask")用以管理macOS应用软件（如Google Chrome等）。下面是一些常用的Homebrew指令。

版本指令

* `$ brew --version` 查看brew版本
* `$ brew cask --version` 查看cask版本

全局指令

* `$ brew update` 升级brew和cask
* `$ brew list` 列表已经安装的包
* `$ brew outdated` 列表已被淘汰的包
* `$ brew cleanup` 删除老版本的包

软件包指令

* `$ brew search <package keyword>` 搜索软件包
* `$ brew install <package name>` 安装软件包
* `$ brew upgrade <package name>` 升级软件包
* `$ brew info <package name>` 软件包信息
* `$ brew uninstall <package name>` 卸载软件包

###### Chocolatey

[Chocolatey](https://chocolatey.org/ "Chocolatey")号称是Windows平台的Homebrew+Cask。

##### Xcode

[Xcode](https://itunes.apple.com/cn/app/xcode/id497799835 "Xcode")是开发iOS或macOS软件所必须。

**注意！注意！注意！** 重要的事情说三遍：一定要通过App Store来安装，不要嫌网速慢就搜个下载包，很可能带有病毒或蠕虫<sup id="r7">[[7]](#f7)</sup>。

在macOS Sierra上安装Xcode将同时安装Git和Xcode的命令行工具，在后面的博客中将会详细讲述。

7. <span id="f7">[^](#r7)<span> ["Xcode Ghost"](http://baike.baidu.com/item/XcodeGhost "Xcode Ghost") _百度百科_

##### Android Studio

[Android Studio](https://developer.android.google.cn/studio/index.html "Android Studio")是Google官方的IDE（**I**ntegrated **D**evelopment **E**nvironment），和Xcode一样，不要从非官方的渠道获得。

* [英文版](https://developer.android.com/studio/install.html "Android Studio")
* [中文版](https://developer.android.google.cn/studio/index.html "Android Studio")

##### Google Chrome

桌面[Chrome](https://www.google.com/chrome/ "Google Chrome")是目前最先进的浏览器，它的插件结构帮助其成为开发者的最爱。实际开发中要大量运用到Chrome，尤其是在React和React Native开发阶段。你可以通过官方渠道下载[中文版](http://www.google.cn/chrome/browser/desktop/index.html "Google Chrome")或[英文版](https://www.google.com/chrome/ "Google Chrome")。但由于众所周知的原因，英文版未必能够下载，如果确实需要英文版的话，我建议使用用软件包管理器。

macOS

`$ brew cask install google-chrome`

Windows

`C:> choco install googlechrome`

##### Docker

[Docker](https://www.docker.com/ "Docker")可以说是当前最火的容器平台。什么是“容器”呢？以我的理解，“容器”是一种虚拟的虚拟机。😕怎么解释呢？传统的虚拟机可以同时模拟出多个自带CPU、内存和硬盘等硬件的主机，而容器则在传统虚拟机所模拟出的一台主机上，依靠标准的接口，模拟出多台主机。最直接的感受就是，启动一台传统虚拟机要走完整个boot过程，往往需要几分钟；而启动（或重启）一台容器一般只需要几秒钟。

在开发过程中我们经常会遇到这样的情况：代码在程序员的主机上运作一切正常，一旦提交到生产环境却跑不了了。这往往是因为生产环境和开发环境的配置不同，导致代码不能兼容。于是最常见的升级方式就是，提前在网站预告某年某月某日的凌晨，服务器将进行升级维护，在此几个小时之间，服务将暂停，等等。对于现在面向全球各地服务的互联网来说，这样陈旧的方式已令人难以接受。而使用容器在一定程度上解决了这个问题：首先，最大限度的模拟实际生产环境，从而保证生产环境和开发环境的统一；其次，利用容器可以保证开发团队内部，不管个人使用什么操作系统，都针对统一版本、配置的系统、框架、运行时等等进行开发。

在开发环境中使用Docker容器还有其他很多优势，例如

* 在个人系统中可以安装不同版本的语言（Java/Ruby等）或服务（MongoDB/Node.js），而避免了相互冲突。比方你手头的项目一个需要Python 2而另一个需要Python 3，在系统中直接安装两版Python可能会造成冲突或混乱，而通过2个Python容器，则可以避免这个问题。

而在生产环境中使用Docker容器，一样有很多优势，例如

* 更新一个Docker容器，你只需上传并覆盖原有的镜像文件，再启动新的镜像就行了。而且这些工作可以完全通过脚本完成，进一步缩减停工时间。
* 实际工作中，一个容器一般只负责一个后端服务，你只需更新配置文件，就可以相对迅速地将一个容器从一台主机移到另一台主机，这给你的服务更多的伸缩空间。
* 你可以通过v1.12.0及以后版本的Docker来部署服务器集群。

SingularJS将会开发、使用以下几个容器

| 名称 | 地址 | 类型 | 功能 |
| :- | :- | :- | :- |
| 数据库 |  | MongoDB | 负责保存服务和用户数据 |
| API | api.domain.com | Node.js | 负责前后端之间的主要通讯传输 |
| 消费者App | app.domain.com | Node.js | 负责host消费者的web app |
| 服务商APP | sp.domain.com | Node.js | 负责host服务商的web app |
| 管理员APP | admin.domain.com | Node.js | 负责host管理员的web app |
| 静态文件 | static.domain.com | Nginx | 负责host静态文件，如UI图片、CSS等 |
| 文件处理 | file.domain.com | Node.js | 负责处理、保存用户提交的文件，如图片、PDF等 |
| 用户文件 | uploads.domain.com | Nginx | 负责host处理过的用户文件 |

##### Postman

[Postman](https://www.getpostman.com/ "Postman")专为开发API而生，在API开发的过程中我感觉是不可或缺的。简而言之，Postman就是个REST GUI，专门用于测试API端点。

![Postman](http://blog.getpostman.com/wp-content/uploads/2016/06/Screen-Shot-2016-06-30-at-16.24.19.png?x38712 "Postman")

##### <span id="vsc">文本编辑器</span>

当下编程文本编辑器多的数不胜数，或许你已经有自己习惯的一个，或许没有。没关系，看看我的选择或许会给你一些启发，或许没有，你只需要知道，一个好的编辑器会加快你的开发速度、提升你的开发体验，但是只要你愿意，Vim😵或Notepad😱照样能用来开发，不大可能，但是可以。

我选择编辑器有三个前提，首先，必须是跨平台的，最低限度也是跨macOS和Windows，这样，无论在哪个系统，我都有熟悉的操作界面、习惯的快捷方式，可以随时进入开发。第二，应有超越基本语法高亮的开发功能。第三，必须是免费的软件。

第三个要求就把[Sublime Text](https://www.sublimetext.com/ "Sublime Text")和[WebStorm](https://www.jetbrains.com/webstorm/ "WebStorm")踢出了局，虽然这两个老牌JavaScript集成开发环境（IDE）仍有不少忠实粉丝，但是其US$70的价格或US$129的年费，相较于免费的选项来说，性价比可以说是空值了😉。

于是，我的选项降至Github的[Atom](https://atom.io/ "Atom")和微软的[Visual Studio Code](https://code.visualstudio.com/ "Visual Studio Code")。我认为实际上，这两款IDE之间的相似处远远超过他们间的不同。如果说Atom有什么优于Visual Studio Code的地方，那可能是其Git整合，毕竟，Atom是Github开发的。如果说Visual Studio Code有什么优于Atom的地方，那就是速度，文本搜索和打开大的文件往往会噎着Atom，而Visual Studio Code则没问题。而且，Visual Studio Code也已整合了Git，虽然功能没有Atom全面，但是对我来说刚刚好——绝大部分时间你用不到那些功能。所以，对我来说，Visual Studio Code胜出。只是我仍要声明，选择Atom你也不会失望。

###### Visual Studio Code

![Visual Studio Code](https://code.visualstudio.com/home/home-screenshot-mac-2x.png "Visual Studio Code")

###### Atom

![Atom](https://github-atom-io-herokuapp-com.global.ssl.fastly.net/assets/screenshot-main@2x-ca61af7db484f8df39fc8dea27ce1752.png "Atom")

如果你有来自前端开发的背景，你也可以从Adobe的[Brackets](http://brackets.io/ "Brackets")入手。Brackets和Visual Studio Code、Atom也很相似，只是更着重于前端开发，有着不错的设备预览和Photoshop整合，但对Node.js等的后端支持就比较弱了。

最后我还要提一提[TextMate](http://macromates.com/ "TextMate")和[Notepad++](https://notepad-plus-plus.org/ "Notepad\++")，虽然这两款免费软件并不跨平台（分别是macOS和Windows），也不是更全功能的IDE，但是我仍旧会安装，作为快速浏览、编辑代码的小工具。

关于Visual Studio Code的使用，我会另开博客详细介绍。








### Setup

#### Node.js

macOS中安装Node.js

```sh
brew update
brew install node@6
brew link node@6
```

macOS中升级Node.js

```sh
brew update
brew upgrade node@6
brew link node@6
```

#### [npm](https://npmjs.com "npm")

npm（**N**ode **P**ackage **M**anager）是Node.js自带的JavaScript包管理器，号称是世界最大的代码注册录。

```sh
brew update
npm i -g npm
```

全局域中常用到的npm指令

* `$ npm ls -g --depth 0` 列表全局域的包
* `$ npm outdated -g` 列表全局域中已落后的包
* `$ npm i -g <package name>` 安装包到全局域中
* `$ npm up -g` 升级全局域中所有的包到最新版

下面是我们将用于的全局域的包

* [babel-cli](https://babeljs.io/ "Babel")
* [code-push-cli](https://microsoft.github.io/code-push/ "CodePush")
* [eslint](http://eslint.org/ "ESLint")
* [jslint](http://www.jslint.com/ "JSLint")
* [less](http://lesscss.org/ "Less")
* [react-native-cli](https://facebook.github.io/react-native/ "React Native")
* [tslint](https://palantir.github.io/tslint/ "TSLint")
* [typescript](https://www.typescriptlang.org/ "TypeScript")
* [typings](https://github.com/typings/typings "Typings")
* [webpack](https://webpack.js.org/ "webpack")
* [npm-check-updates](https://github.com/tjunnone/npm-check-updates "npm-check-updates")

安装了npm-check-updates之后，我们可以在全局域中用以下指令

* `$ ncu -g` 列表全局域中已落后的包

#### 文件夹结构

安装好了Node.js和全局包，现在我们终于可以动手开发了。

1. 在桌面生成一个新的文件夹，`SingularJS`。
2. 右键点击`SingularJS`文件夹图片→服务→新建位于文件夹位置的终端窗口。
3. 输入`$ npm init`，你需要回答几个问题，npm将根据你的答案自动生成一个文件package.json。如果你不确定该回答什么，就打一下return键，npm将补入一个空字符串，你可以以后再进行编辑。或者你可以干脆输入`$ npm init -y`，跳过所有问题，等到合适的时候再来编辑。
4. 现在我们来看看整个项目的文件夹结构。

```map
SingularJS
│
├─┬─api             // API接口
│ ├───dev
│ ├───dist
│ └───src
│
├─┬─file            // 后端服务，用以处理用户上传的文件
│ ├───dev
│ ├───dist
│ └───src
│
├─┬─uploads         // 静态文件夹，用以保存用户上传的文件
│ ├───events
│ ├───products
│ ├───...
│ └───users
│
├─┬─assets          // 静态文件夹，用以保存各级服务共享的资源
│ ├───alipay
│ ├───...
│ ├───logo
│ └───ui
│
├─┬─common          // 静态文件夹，用以保存各级服务共享的代码
│ ├───locales       // 语言包
│ ├─┬─modules       // 共享的模块
│ │ ├───app
│ │ └───web
│ ├───...
│ └───util          // 共享的函数
│
├─┬─docker          // 静态文件夹，用以保存Docker镜像所需文件
│ ├─┬─config
│ │ ├───development
│ │ ├───staging
│ │ └───production
│ ├─┬─dockerfiles
│ │ ├───development
│ │ ├───staging
│ │ └───production
│ └─┬─env
│   ├───development
│   ├───staging
│   └───production
│
├─┬─devops          // 静态文件夹，用以保存服务器脚本
│ ├───staging
│ └───production
│
├─┬─consumer        // 消费者用户APP
│ ├─┬─app
│ │ ├───android
│ │ └───ios
│ ├─┬─web
│ │ ├───dev
│ │ ├───dist
│ │ └───src
│ └───redux
│
├─┬─provider        // 服务商用户APP
│ ├─┬─app
│ │ ├───android
│ │ └───ios
│ ├─┬─web
│ │ ├───dev
│ │ ├───dist
│ │ └───src
│ └───redux
│
└─┬─admin           // 管理员用户APP
  ├─┬─app
  │ ├───android
  │ └───ios
  ├─┬─web
  │ ├───dev
  │ ├───dist
  │ └───src
  └───redux
```

* consumer、provider和admin文件夹下都有redux文件夹，用以统一处理app导航
* 各级app工程下都有android和ios两个文件夹，用以分别保存Android和iOS代码
* 各级web工程下都有dev、dist和src三个文件夹，分别用以保存开发环境代码、生产环境代码和源代码

#### MongoDB

#### Express

#### Mongoose

#### TypeScript

#### Webpack

ACL

consumers
guest
member

providers
staff
manager

admin
moderator
editor


SingularJS components

* singular-textview
* singular-h1 ... h6
* singular-gridview ()
* singular-tileview (1-by-1, 1-by-4, gutter)
* singular-listview (ol/ul)
* singular-webview
* singular-popup
* singular-glyph

* singular-tag
* singular-avatar (circle, square, rounded)
* singular-input
* singular-range
* singular-rating
* singular-selectview (singular-gridview)

* singular-rte
* singular-icon (top-right indicator)
* singular-search (search page: history (clear) / suggestions)
* singular-jumplistview (singular-listview x 2)
* singular-editable-list

* singular-list-item (icon? | title (indicator) / view | value? | arrow? / control)
* singular-table: singular-order-item (title / unit / price)
