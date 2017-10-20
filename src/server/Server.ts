import * as express from "express";
import * as path from "path";

const app = express();

export const rootPath = path.join(__dirname, "../../");
export const htmlDir = path.join(rootPath, "html");
export const jsDir = path.join(rootPath, "dist", "bundle");
export const resDir = path.join(rootPath, "resources");
export const cssDir = path.join(rootPath, "css");

app.get('/', (req, res) => {
    res.sendFile(path.join(htmlDir, "index.html"));
});

app.use("/js", express.static(jsDir));
app.use("/res", express.static(resDir));
app.use("/css", express.static(cssDir));

const port = 4000;

app.listen(port, () => {
    console.log(`listening on port ${port}`)
});