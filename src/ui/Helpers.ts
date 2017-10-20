import {IKeys} from "./Keys";
export function leftpad(n: any, width: number, padStr: string = '0') {
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(padStr) + n;
}

export const keys: IKeys = require("!json-loader!../../resources/keys.json");

export function capitalize(str: string) {
    if (str.length > 0) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    return str;
}