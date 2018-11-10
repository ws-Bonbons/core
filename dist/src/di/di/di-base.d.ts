import { InjectScope, InjectToken, Implement, ImplementFactory, ScopeID, DIContainerEntry, DepedencyResolveEntry, BonbonsDIContainer } from "./declares";
import { DIScopePool } from "./scope-pool";
export declare abstract class BaseDIContainer implements BonbonsDIContainer {
    private sections;
    private map;
    private sorted;
    readonly count: number;
    /**
     * 变量池，用来实现范围模式
     * @description
     * @protected
     * @memberof DIContainer
     */
    protected scopePools: Map<ScopeID, DIScopePool>;
    abstract register<K, V>(token: InjectToken<K>, imp: Implement<V>, scope: InjectScope): void;
    abstract createFactory<T>(imp: DIContainerEntry<T>): ImplementFactory<T>;
    /**
     * 添加一个token-实现映射
     * @description
     * @author Big Mogician
     * @protected
     * @template T
     * @param {InjectToken<T>} token
     * @param {DepedencyResolveEntry<T>} entry
     * @memberof DIContainer
     */
    protected set<T>(token: InjectToken<T>, entry: DepedencyResolveEntry<T>): void;
    complete(): void;
    createScope(scopeId: ScopeID, metadata: any): void;
    dispose(scopeId?: ScopeID): void;
    /**
     * 解析单个token
     * @description
     * @author Big Mogician
     * @template T
     * @param {InjectToken<T>} token
     * @param {ScopeID} [scopeId]
     * @returns {(T | null)}
     * @memberof DIContainer
     */
    get<T>(token: InjectToken<T>, scopeId?: ScopeID): T | null;
    /**
     * 获取最终DI容器的整体信息
     * @description
     * @author Big Mogician
     * @returns
     * @memberof DIContainer
     */
    getConfig(): {
        contract: any;
        implement: any;
        scope: InjectScope;
        level: number;
        dependencies: any[];
    }[];
    /**
     * 将依赖令牌数组解析成最终的依赖项数组
     * @description
     * @author Big Mogician
     * @template T
     * @param {InjectToken[]} depts
     * @param {ScopeID} scopeId
     * @returns
     * @memberof DIContainer
     */
    getDepedencies<T>(depts: InjectToken[], scopeId?: ScopeID): any[];
    /**
     * 执行依赖处理程序，构建整个DI容器
     * @description
     * @author Big Mogician
     * @private
     * @memberof DIContainer
     */
    private resolve;
    /**
     * 依赖堆叠算法
     * ---
     * * 将依赖项按照依赖级别从低到高排列
     * * 每个实例的依赖项级别一定低于自身
     * * 最终无法被排列的内容，可能存在循环引用，或者不可达引用，可以继续分析
     * @description
     * @author Big Mogician
     * @private
     * @param {DeptNode[]} queue
     * @returns {DeptNode[]}
     * @memberof DIContainer
     */
    private sort;
    /**
     * 完成依赖堆叠的排列
     * @description
     * @author Big Mogician
     * @private
     * @param {DeptNode[]} queue
     * @param {DeptNode[]} sourceQueue
     * @param {Array<DeptNode[]>} sections
     * @param {number} current
     * @returns
     * @memberof DIContainer
     */
    private decideSection;
    /**
     * 按照scope处理工厂方法
     * @description
     * @author Big Mogician
     * @private
     * @template T
     * @param {DIContainerEntry<T>} item
     * @param {ImplementFactory<T>} fac
     * @returns {(Nullable<(scopeId?: ScopeID) => T | null>)}
     * @memberof DIContainer
     */
    private scopeMark;
}
export declare function invalidOperation(error: string, more?: any): Error;
export declare function ERROR(error: string, more?: any): Error;
