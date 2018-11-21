# PROJECT Bonbons.koa
> 一个以koa2为底，用typescript设计的IoC框架.

其实没什么太多可以的描述，Bonbons纯粹依照静态语言风格来设计，包括不仅限于静态类型依赖注入能力，线性请求管道中间件，高可配置容器，静态路由与表单参数和传统的RESTful风格路由支持.

核心功能仍在开发中，而且目前看来进度缓慢- -。

[![Build Status](https://travis-ci.org/ws-Bonbons/core.svg?branch=master)](https://travis-ci.org/ws-Bonbons/core)
[![package version](https://badge.fury.io/js/%40bonbons%2Fcore.svg)](https://badge.fury.io/js/%40bonbons%2Fcore.svg)

[Bonbons.express](https://github.com/ws-node/Bonbons)

[More about Bonbons(express version)](https://github.com/mogician-notes/blog/blob/master/en-US/about_bonbons.md)

## 安装
```powershell
$ npm install @bonbons/core --save
```

## Bonbons如何工作?
#### 1. 创建app
```Javascript
// 1. 直接使用构造
new Bonbons()
    .option(DEPLOY_MODE, { port: 5678 });
    .start();
// 2. 使用静态属性
Bonbons.New
    .option(DEPLOY_MODE, { port: 5678 });
    .start();
// 3. 使用静态方法
Bonbons.Create()
    .option(DEPLOY_MODE, { port: 5678 });
    .start();
// 4. 定义构造
@BonbonsApp({
    options: [
        { token: DEPLOY_MODE, value: { port: 5678 } }
    ]
})
class MyApp extends BaseApp { 
    start(): void {
        const { port } = this.config.get(DEPLOY_MODE);
        this.logger.debug(`app is running on port ${port || 3000}`);
    }
 }

 new MyApp().start();
```
#### 2. 创建一个service
```JavaScript
@Injectabe()
export class SecService {
    constructor() {}
    print(){
        return "hello world!";
    }
}

// 1. 直接注册
new Bonbons()
    .scoped(SecService)
//    .scoped(SecService, new SecService())
//    .scoped(SecService, () => new SecService())
//    .singleton(SecService)
    .option(DEPLOY_MODE, { port: 5678 });
    .start();
// 或者进行定义
@BonbonsApp({
//    singleton: [ SecService ],
    scoped: [ SecService ]
    options: [
        { token: DEPLOY_MODE, value: { port: 5678 } }
    ]
})
// ...

// 2. 接口-实现注册
// 定义抽象类
export abstract class ABCService {
    abstract getMessage(): string;
}

// 使用接口实现来继承抽象类，不需要生产真实继承链
@Injectabe()
export class MainService implements ABCService {

    // create an unique token
    private id = UUID.Create();

    constructor() { }

    public getMessage(): string {
        return this.id;
    }

}

// 然后进行注册
new Bonbons()
    .scoped(SecService)
    .scoped(ABCService, MainService)
//    .scoped(ABCService, new MainService())
//    .scoped(ABCService, () => new MainService())
//    .singleton(ABCService, MainService)
    .option(DEPLOY_MODE, { port: 5678 });
    .start();
// or
@BonbonsApp({
    scoped: [ 
        SecService,
//        [ ABCService, MainService ],
        { token: ABCService, implement: MainService },
//        { token: ABCService, implement: new MainService() },
//        { token: ABCService, implement: () => new MainService() }
    ],
    options: [
        { token: DEPLOY_MODE, value: { port: 5678 } }
    ]
})
// ...

// 目前支持在控制器、服务、和管道中，使用构造函数注入或者依赖查找来获取实例.
```

#### 3. 创建控制器controller
```JavaScript
@Controller("api")
export class MainController extends BaseController {

    constructor(private sup: SuperService) {
        super();
    }

    @Method("GET", "POST")
    @Route("/index")
    public ApiIndex(): JsonResult {
        console.log("this is a api method with query id : " + this.context.query("id", Number));
        console.log("this is a api method with query select : " + this.context.query("select", Boolean));
        console.log("this is a api method with query notexist : " + this.context.query("notexist"));
        // return new JsonResult({ value: "this is a api method with base : " });
        return this.toJSON({ value: "this is a api method with base : " });
    }

    @Method("GET")
    @Route("/page?{id}&{select}&{message}") 
    // 提供路由参数占位符列表来开启静态路由参数功能，确保函数参数数量和顺序与之保持一致
    // 举例 : localhost/api/page?id=123456&select=true&message=mmmmmm
    public AnotherGET(id:number, select:boolean, message): JsonResult {
        console.log(id); // 123456
        console.log(select); // true
        console.log(message) // "mmmmmm" (string is the default type)
        console.log(typeof id); // number
        console.log(typeof select); // boolean
        console.log(typeof message); // string
        return new JsonResult({ value: "666666" });
    }

}

...

// 注册controller
Bonbons.Create()
    .scoped(SecService)
    .controller(MainController);
```

#### 4. 使用koa中间件或者线性管道 (可能存在变更，koa中间件可能在未来删除直接支持)
```JavaScript
// 1 : koa风格中间件
// 纯函数构建模式.
const middleware01 = () => {
    return async (ctx, next) => {
        console.log("123456");
        await next();
    };
}
const middleware02 = (param) => {
    return async (ctx, next) => {
        console.log(param);
        await next();
    };
}

// 使用装饰器定制
@Method("GET", "POST")
@Route("/index")
@Middlewares([middleware02(55555)])
public ApiIndex(): JsonResult {
    return new JsonResult({ value: this.sup.print() });
}

// 可以在控制器上进行router级别定义
// 所有路由方法将默认继承，当然你也可以在路由上重写它们
@Controller("api")
@Middlewares([middleware01()])
export class MainController extends BaseController {

    constructor(private sup: SuperService) {
        super();
    }

    @Method("GET")
    @Route("/index")
    // will extends controller middlewares list : [middleware01]
    public GetIndex(): string {
        return this.sup.print();
    }

    @Method("GET", "POST")
    @Route("/index2")
    @Middleware([middleware02(33333)], true) 
    // merge:false(默认), 覆盖router的中间件定义 : [middleware02(33333)]
    // merge:true, 继承router的中间件定义 : [middleware01(), middleware02(555)]
    public ApiIndex(): JsonResult {
        return new JsonResult({ value: this.sup.print() });
    }

}

// 2. Bonbons线性管道
interface PipeDate {
  value: number;
  name: string;
}

@Pipe()
class PIpeClass2 extends PipeMiddleware<PipeDate> implements PipeOnInit {

  constructor(private logger: GlobalLogger) {
    super();
  }

  pipeOnInit(): void {
    // console.log(this.params);
  }

  async process(): void | Promise<void> {
    console.log(this.vName);
    console.log(this.params);
    this.logger.debug("process in pipe [ WrappedPipe ]");
  }

}

export const WrappedPipe = PipeFactory.generic(PIpeClass2);

// 在需要的地方定义
@Method("GET")
@Route("/index")
@Pipes([WrappedPipe({name: "aaa", value: 123456})])
public async GetIndex(): StringResult {
    console.log("this is a get method with base : ");
    return this.toStringfy("woshinidie : 鎴戞槸浣犵埞", { encoding: "GBK" });
}
```

> pipe追求的是纯粹的流水线式风格。pipe在请求过程中总是保持同步顺序调用，依赖依赖注入能力可以在各个管道之间共享状态

#### 5. 表单控制
```JavaScript
// 有两种定义表单类型的方式
    @Method("POST")
    @Route("/post")
    @Middleware([], true)
    public POSTIndex(name:string, @FromBody() params: any): JsonResult {
        console.log("this is a post method");
        const form = this.context.form;
        console.log(form.data);
        console.log(params);
        return new JsonResult(params);
    }

    // then post message in application/json format : 
    // {"name":"bws", age:123}

    // console output:
    // {"name":"bws", age:123}
    // {"name":"bws", age:123}

    /*
    * All supported decorators :
    * @FromBody()   -   default : application/json
    * @FormData()   -   default : multiple/form-data (未完成)
    * @FromForm()   -   default : application/x-www-form-urlencoded
    * @RawBody()   -   default : application/octet-stream (未完成)
    * @TextBody()   -   default : text/plain
    */

   // 下面介绍的静态类型表单会自动完成类型映射，功能强大但同时意味着更高的性能开销。
```

#### 6.强大的静态类型表单实现POST/PUT
```JavaScript
// create a static-type model to describe form structure:
import { Serialize, Deserialize } from "@bonbons/core";

// model to describe the form data structure
export class PostModel {

    // data contract
    @Serialize("received_ame")
    @Deserialize("NAME_TEST")
    private _name: string;
    public get Name() { return this._name; }

    // data contract and type convert
    @Serialize(Number, "receivedMax")
    @Deserialize(Number, "MAX_TEST")
    private _max: number;
    public get MAX() { return this._max; }

}

// then try to create a post method:
    @Method("POST")
    @Route("/post/:id/details/:name?{query}&{find}")
    @Middlewares([], false)
    public POSTIndex( // you can access params, queryParams and form object by function-params-injection.
        id: number,
        name: string,
        query: string,
        find: string,
        @FromBody() params: PostModel): JsonResult {

        console.log("this is a post method");
        console.log(`${id} - ${name} - ${query} - ${find}`); 
        console.log(`${typeof id} - ${typeof name} - ${typeof query} - ${typeof find}`);
        console.log(params);
        console.log(Object.getPrototypeOf(params).constructor.name);
         return this.toJSON({
            theParams: params,
            theName: name,
            theQuery: query,
            theId: id,
            theFind: find
        }, { resolver: JsonResultResolvers.decamalize }); 
        // use resolver to change object keys, this will work an the end of JSON.stringfy.
    }

/**
* then post to "localhost:3000/api/post/123456/details/miao18game?query=sss&find=mmm" with body : 
* {
*   "NAME_TEST":"miao17game",
*   "MAX_TEST":123
* }
*  
* output: 
* "this is a post method"
* "123456 - miao18game - sss - mmm"
* "numner - string - string - string"
* "PostModel { _name: 'miao17game', _max: 123 }"
* "PostModel"
*
* response : 
*   {
*       "the_params": {
*           "received_name": "miao17game", 
*           // key is resolved by @Deserialize/@Serialize
*           "received_max": 123  
*           // key is resolved by @Deserialize/@Serialize and JsonResultResolvers.decamalize
*       },
*       "the_name": "miao18game",
*       "the_query": "sss",
*       "the_id": 123456,
*       "the_find": "mmm"
*   }
*
* JsonResult will automatically transform static-type object to correct object-json with data contract, 
* or you can transfoem manually with [TypedSerializer.ToJSON(obj)], 
* if you create contract with decorators : @Serialize/@Deserialize.
* 
* Of cource, you can define your own static-typed serialization behavior, 
* only create your serializer implements the IStaticTypedResolver
*/
```

#### 7. 异步路由
```JavaScript
    @Method("GET")
    @Route("/index")
    public async GetIndex(): Async<string> {
        console.log("this is a get method with base : ");
        // async mock
        await this.sleep(20);
        console.log("step 01");
        await this.sleep(20);
        console.log("step 02");
        await this.sleep(20);
        console.log("step 03");
        await this.sleep(20);
        console.log("step 04");
        await this.sleep(20);
        console.log("step 05");
        return this.sup.print();
    }

    // it works
    // Async<T> = Promise<T>|T, not only an alias.
```

#### 8. 字符串编码
```JavaScript
    @Method("GET")
    @Route("/index")
    public async GetIndex(): StringResult {
        console.log("this is a get method with base : ");
        return this.toStringfy("woshinidie : 鎴戞槸浣犵埞", { encoding: "GBK" });
        // defaults:
        // encoding: "utf8"
        // decoding: "utf8"
    }

    // response:
    // "woshinidie : 我是你爹"
```

**数据库驱动、日志、模块隔离等其余功能还在开发中...**

