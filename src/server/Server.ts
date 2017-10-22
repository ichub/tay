import * as express from "express";
import * as path from "path";
import * as fs from "fs";
import * as sizeOf from "image-size";

import {ITayInfo} from "../models/Tay";

const app = express();

export const rootPath = path.join(__dirname, "../../");
export const htmlDir = path.join(rootPath, "html");
export const jsDir = path.join(rootPath, "dist", "bundle");
export const tayDir = path.join(rootPath, "images_of_tay");
export const cssDir = path.join(rootPath, "css");

let cachedImageMetadata = null;

function getImageMetadata(): Promise<ITayInfo> {
    if (cachedImageMetadata) {
        return Promise.resolve(cachedImageMetadata);
    }

    return new Promise<ITayInfo>((resolve, reject) => {
        fs.readdir(tayDir, (err, files) => {
            if (err) {
                console.log(err);
                return reject(err);
            }

            files = files.filter(file => [".jpg", ".png"].indexOf(path.extname(file)) >= 0);

            resolve(<ITayInfo> {
                files: files.map(fileName => {
                    const parts = fileName.split("x");

                    const noseLocation = {
                        x: parseInt(parts[0], 10),
                        y: parseInt(parts[1], 10),
                    };

                    const dimensions = sizeOf(path.join(tayDir, fileName));

                    return {
                        url: "/images_of_tay/" + fileName,
                        noseInPixels: noseLocation,
                        sizeInPixels: dimensions,
                        noseInFractions: {
                            x: noseLocation.x / dimensions.width,
                            y: noseLocation.y / dimensions.height
                        }
                    }
                })
            });
        });
    });
}

const imageMetadataPromise = getImageMetadata();

app.get('/', (req, res) => {
    res.sendFile(path.join(htmlDir, "index.html"));
});

app.use("/js", express.static(jsDir));
app.use("/images_of_tay", express.static(tayDir));
app.use("/css", express.static(cssDir));

app.get("/tay.json", (req, res, next) => {
    imageMetadataPromise.then(data => res.send(data))
        .catch(err => next(err));
});

app.use((err, req, res, next) => {
    res.status(500);
    res.send(err)
});

let port = 4000;
if (process.env.NODE_ENV === "production") {
    port = 80;
}

app.listen(port, () => {
    console.log(`listening on port ${port}`)
});