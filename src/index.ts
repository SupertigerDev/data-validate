import { Response } from "express";

interface StringOptions {
  max: number;
  min: number
  required?: boolean
}

type ErrorObj = {[key: string]: ErrorObj | string}

export class ValidateData {
  private data: { [key: string]: any; };
  errors: ErrorObj;

  constructor(data: {[key: string]: any}) {
    this.data = data;
    this.errors = {};
  }
  static validate(data: {[key: string]: any}) {
    return new ValidateData(data);
  }
  boolean(key: string, required: boolean) {
    const bool = this.data[key];
    if (required && bool === undefined) this.errors[key] = key + " is required.";
    return this;
  }
  string(key: string | number, options: StringOptions) {
    const value = this.data[key];
    if (options.required && value === undefined) this.errors[key] = key + " is required.";
    if (value && typeof value !== "string") this.errors[key] = key + " is not a string.";
    if (value && options.max !== undefined && value.length > options.max) this.errors[key] = key + " is longer than " + options.max + " characters.";
    if (value && options.min !== undefined && value.length < options.min) this.errors[key] = key + " is shorter than " + options.min + " characters.";
    return this;
  }
  number(key: string | number, options: StringOptions) {
    const value = this.data[key];
    if (options.required && value === undefined) this.errors[key] = key + " is required.";
    if (value && typeof value !== "number") this.errors[key] = key + " is not a number.";
    if (value && options.max !== undefined && value > options.max) this.errors[key] = key + " must be less than " + options.max + ".";
    if (value && options.min !== undefined && value < options.min) this.errors[key] = key + " must be greater than " + options.min + ".";
    return this;
  }
  object(key: string | number, callback: (validate: ValidateData) => void) {
    const object = this.data[key];
    if (!isObject(object)) {
      this.errors[key] = key + " is not an object.";
      return this;
    }
    const validate = new ValidateData(object);
    callback(validate);
    const errors = validate.done();
    if (errors && Object.keys(errors).length) {
      this.errors[key] = errors;
    }
    return this;
  }
  array(key: string | number, callback: (validate: ValidateData, index: number) => void) {
    const arr = this.data[key];
    if (!isArray(arr)) {
      this.errors[key] = key + " is not an array.";
      return this;
    }
    const validate = new ValidateData(arr);
    for (let i = 0; i < arr.length; i++) {
      callback(validate, i);
      const errors = validate.done();
      if (errors && Object.keys(errors).length) {
        this.errors[key] = errors;
      }
    }

    return this;
  }
  done(res?: Response) {
    if (Object.keys(this.errors).length) {
      res?.status(400).json(this.errors);
      return this.errors;
    }
    return null;
  }

}


function isArray(arr: any): boolean {
  return Array.isArray(arr)
}
function isObject(obj: any): boolean {
  return typeof obj === 'object' && !Array.isArray(obj)
}