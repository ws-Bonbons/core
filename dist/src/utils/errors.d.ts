export declare class BonbonsError extends Error {
    constructor(error?: string);
}
export declare function ERROR(error: string, more?: any): BonbonsError;
export declare function invalidOperation(error: string, more?: any): BonbonsError;
export declare function invalidParam(error: string, more?: any): BonbonsError;
