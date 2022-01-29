import { Response } from "express";
interface StringOptions {
    max: number;
    min: number;
    required?: boolean;
}
declare type ErrorObj = {
    [key: string]: ErrorObj | string;
};
export declare class ValidateData {
    private data;
    errors: ErrorObj;
    constructor(data: {
        [key: string]: any;
    });
    static validate(data: {
        [key: string]: any;
    }): ValidateData;
    boolean(key: string, required: boolean): this;
    string(key: string | number, options: StringOptions): this;
    number(key: string | number, options: StringOptions): this;
    object(key: string | number, callback: (validate: ValidateData) => void): this;
    array(key: string | number, callback: (validate: ValidateData, index: number) => void): this;
    done(res?: Response): ErrorObj | null;
}
export {};
//# sourceMappingURL=index.d.ts.map