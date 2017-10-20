import * as express from "express";
import * as path from "path";
import * as fs from "fs";
import {ITayInfo} from "../models/Tay";

const app = express();

export const rootPath = path.join(__dirname, "../../");
export const htmlDir = path.join(rootPath, "html");
export const jsDir = path.join(rootPath, "dist", "bundle");
export const tayDir = path.join(rootPath, "images_of_tay");
export const cssDir = path.join(rootPath, "css");

app.get('/', (req, res) => {
    res.sendFile(path.join(htmlDir, "index.html"));
});

app.use("/js", express.static(jsDir));
app.use("/images_of_tay", express.static(tayDir));
app.use("/css", express.static(cssDir));

app.get("/tay.json", (req, res, next) => {
    fs.readdir(tayDir, (err, files) => {
        if (err) {
            console.log(err);
            return next(err);
        }

        res.send(<ITayInfo> {
            files: files.map(file => "/images_of_tay/" + file)
        });
    });
});

app.use((err, req, res, next) => {
    res.status(500);
    res.send(err)
});

const port = 4000;

app.listen(port, () => {
    console.log(`listening on port ${port}`)
});