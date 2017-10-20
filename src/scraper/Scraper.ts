import * as request from "request-promise";
import * as cheerio from "cheerio";

request.get("http://www.google.com", (err, data:any ) => {
    const $ = cheerio.load(data);
});