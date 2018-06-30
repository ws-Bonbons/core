# PROJECT Bonbons.koa
> a static-typed koa2 framework with typescript.

This is an MVC framework based on node.js and koa2 (old version is based on express). The framework is created by typescript, which includes a dependency injection system and RESTful high-level abstraction.

The core features are under development. Currently, the dependency injection system is basically completed, the controller module is basically completed, and the GET method is also completed. 

[![Build Status](https://travis-ci.org/ws-node/Bonbons.koa.svg?branch=master)](https://github.com/ws-node/Bonbons.koa/tree/master/%40Bonbons.koa/README.md)

**Bonbons.koa is still in developing**.

[Bonbons.express](https://github.com/ws-node/Bonbons)

[More about Bonbons(express version)](https://github.com/mogician-notes/blog/blob/master/en-US/about_bonbons.md)

## Installation
```powershell
# npm install @bonbons/core --save
# npm install @bonbons/controllers --save
# npm install @bonbons/decorators --save
# npm install @bonbons/plugins --save
# npm install @bonbons/di --save
# npm install @bonbons/options --save
# npm install @bonbons/utils --save
# npm install @bonbons/contracts --save
```

## How it works?
#### 1. Create an app
```Javascript
// 1. use constructor
new Bonbons()
    .option(DEPLOY_MODE, { port: 5678 });
    .start();
// 2. use static property
Bonbons.New
    .option(DEPLOY_MODE, { port: 5678 });
    .start();
// 3. use static method
Bonbons.Create()
    .option(DEPLOY_MODE, { port: 5678 });
    .start();
// 4. use decorator
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
#### 2. Create a service
```JavaScript
@Injectabe()
export class SecService {
    constructor() {}
    print(){
        return "hello world!";
    }
}

// 1.inject directly
new Bonbons()
    .scoped(SecService)
//    .scoped(SecService, new SecService())
//    .scoped(SecService, () => new SecService())
//    .singleton(SecService)
    .option(DEPLOY_MODE, { port: 5678 });
    .start();
// or use decorator
@BonbonsApp({
//    singleton: [ SecService ],
    scoped: [ SecService ]
    options: [
        { token: DEPLOY_MODE, value: { port: 5678 } }
    ]
})
// ...

// 2. use interface injection
// define a ABC
export abstract class ABCService {
    abstract getMessage(): string;
}

// then extends ABC and implements methods
@Injectabe()
export class MainService implements ABCService {

    // create an unique token
    private id = UUID.Create();

    constructor() { }

    public getMessage(): string {
        return this.id;
    }

}

// then inject them
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

// use call the service by constructor injection or dependency lookup in other services , pipes and constrollers.
```

#### 3. Create a controller
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
    // provide query params name list to open static query feature
    // example : localhost/api/page?id=123456&select=true&message=mmmmmm
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

// register controller
Bonbons.Create()
    .scoped(SecService)
    .controller(MainController);
```

#### 4. Add middlewares or pipe for route or controller (not completed in koa beta version)
```JavaScript
// 1 : Middlewares like express style
// first create middleware in pure function format.
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

// then add it to method by decorator
@Method("GET", "POST")
@Route("/index")
@Middlewares([middleware02(55555)])
public ApiIndex(): JsonResult {
    return new JsonResult({ value: this.sup.print() });
}

// this decorator is alse can be add in controller
// the middlewares add to controller will add to all the registeres methods, but you can still rewrite this behavior.
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
    @Middleware([middleware02(33333)], false) 
    // merge:true(default), will extends controller middlewares list : [middleware01(), middleware02(33333)]
    // merge:false, will not extends controller middlewares list : [middleware02(555)]
    public ApiIndex(): JsonResult {
        return new JsonResult({ value: this.sup.print() });
    }

}

// 2. Bonbons pipes
interface PipeDate {
  value: number;
  name: string;
}

@Pipe()
class PIpeClass2 extends PipeMiddleware<PipeDate> implements PipeOnInit {

  @Param()
  private value: number;

  @Param("name")
  private vName: string;

  constructor(private logger: GlobalLogger) {
    super();
  }

  pipeOnInit(): void {
    // console.log(this.params);
  }

  async process(next: () => Promise<any>): void | Promise<void> {
    console.log(this.vName);
    console.log(this.params);
    this.logger.debug("process in pipe [ WrappedPipe ]");
    await next();
  }

}

export const WrappedPipe = PipeFactory.generic(PIpeClass2);

// then add to route method
@Method("GET")
@Route("/index")
@Pipes([WrappedPipe({name: "aaa", value: 123456})])
public async GetIndex(): StringResult {
    console.log("this is a get method with base : ");
    return this.toStringfy("woshinidie : 鎴戞槸浣犵埞", { encoding: "GBK" });
}
```

#### 5. Form control
```JavaScript
// there are two ways to access the form data
    @Method("POST")
    @Route("/post")
    @Middleware([], false)
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
    * @FormData()   -   default : multiple/form-data (not completed in koa version)
    * @FromForm()   -   default : application/x-www-form-urlencoded
    * @RawBody()   -   default : application/octet-stream (not completed in koa version)
    * @TextBody()   -   default : text/plain
    */

   // static-typed form params will be introduced later.
```

#### 6.Multiple injections with POST/PUT
```JavaScript
// create a static-type model to describe form structure:
import { Serialize, Deserialize } from "bonbons";

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

#### 7. Async method
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

    // it works!
    // Async<T> = Promise<T>, only an alias.
```

#### 8. String encoding support
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

**Still in developing...**

