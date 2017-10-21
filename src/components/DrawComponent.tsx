import * as React from "react";
import * as Radium from "radium";
import {ITayInfo} from "../models/Tay";
import * as xhr from "xhr";

@Radium
export class DrawComponent extends React.Component<IDrawComponentProps, IDrawComponentState> {
    static readonly TAY_INFO_URL = "/tay.json";
    static readonly MOUSE_MOVE_TIMEOUT = 1000 * 1;

    props: IDrawComponentProps;
    state: IDrawComponentState;

    refs = {
        img: HTMLImageElement
    };

    private timeout = null;

    constructor() {
        super();

        this.state = {
            width: 800,
            height: 600,
            tayInfo: null,
            imageMetadataLoaded: false,
            nearestTayImage: null,
            imageState: ImageState.Initializing,
        }
    }

    componentDidMount() {
        this.fetchImageUrls().then(tayInfo => {
            this.setState({tayInfo: tayInfo, imageState: ImageState.Initialized});
        });
    }

    fetchImageUrls(): Promise<ITayInfo> {
        return new Promise<ITayInfo>((resolve, reject) => {
            xhr.get(DrawComponent.TAY_INFO_URL, (err, resp, body) => {
                if (err) {
                    return reject(err);
                }

                resolve(JSON.parse(body));
            });
        });
    }

    findNearestTayImage(x, y): string {
        const xFraction = x / this.state.width;
        const yFraction = y / this.state.height;

        let nearestDistance = Number.MAX_VALUE;
        let nearestImage = null;

        for (const info of this.state.tayInfo.files) {
            const distance = Math.sqrt(
                Math.pow((info.noseInFractions.x - xFraction), 2) +
                Math.pow((info.noseInFractions.y - yFraction), 2));

            if (distance < nearestDistance) {
                nearestDistance = distance;
                nearestImage = info;
            }
        }

        console.log(nearestImage);

        return nearestImage.url;
    }

    triggerNewImage(e: MouseEvent) {
        if (this.state.imageState === ImageState.Initializing) {
            return;
        }

        clearTimeout(this.timeout);
        if (this.refs.img) {
            this.refs.img.onload = null;
        }

        this.setState({
            imageState: ImageState.MouseMoving,
        });

        const mouse = this.getMouse(e);

        this.timeout = setTimeout(this.mouseNotMovedForAReasonableTime.bind(this, mouse), DrawComponent.MOUSE_MOVE_TIMEOUT)
    }

    mouseClick(e: MouseEvent) {
        this.triggerNewImage(e);
    }

    mouseMove(e: MouseEvent) {
        this.triggerNewImage(e);
    }

    mouseNotMovedForAReasonableTime(lastMouse: { x: number, y: number }) {
        this.setState({
            imageState: ImageState.LoadingImage
        });

        const nearestTayImage = this.findNearestTayImage(lastMouse.x, lastMouse.y);

        this.setImageUrl(nearestTayImage);
    }

    setImageUrl(url: string) {
        this.refs.img.onload = () => {
            console.log("loaded!");

            this.setState({
                imageState: ImageState.ImageLoaded
            });
        };

        this.refs.img.src = url;
    }

    getMouse(e: MouseEvent): { x: number, y: number } {
        const bounds = (e.target as any).getBoundingClientRect();

        return {
            x: e.clientX - bounds.left,
            y: e.clientY - bounds.top
        }
    }

    render() {
        let overlayText = "";

        switch (this.state.imageState) {
            case ImageState.ImageLoaded:
                break;
            case ImageState.Initializing:
                overlayText = "initializing...";
                break;
            case ImageState.Initialized:
                overlayText = "move your mouse (;";
                break;
            case ImageState.MouseMoving:
                overlayText = "looking for matches!";
                break;
            case ImageState.LoadingImage:
                overlayText = "found a match, loading image!";
                break;
        }

        let overlay = (
            <div style={DrawComponent.styles.overlay}>{overlayText}</div>
        );

        if (this.state.imageState === ImageState.ImageLoaded) {
            overlay = null;
        }

        return (
            <div style={[
                DrawComponent.styles.base
            ]}>
                <div style={[
                    DrawComponent.styles.imgContainer,
                    DrawComponent.styles.size(this.state.width, this.state.height)
                ]}
                     onMouseMove={this.mouseMove.bind(this)}
                     onClick={this.mouseClick.bind(this)}>
                    {overlay}
                    <img
                        ref="img"
                        style={DrawComponent.styles.size(this.state.width, this.state.height)}>
                    </img>
                </div>
            </div>
        );
    }

    private static styles = {
        base: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
            cursor: "pointer"
        },
        overlay: {
            width: "100%",
            height: "100%",
            position: "absolute",
            top: "0",
            left: "0",
            backgroundColor: "rgb(240, 240, 240)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontFamily: "'Teko', sans-serif",
            fontSize: "2em",
            userSelect: "none"
        },
        imgContainer: {
            position: "relative",
            boxShadow: "0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12), 0 1px 5px 0 rgba(0,0,0,0.2)",
        },
        size: (width: number, height: number) => {
            return {
                width: width + "px",
                height: height + "px",
                backgroundColor: "rgba(0, 0, 0, 0.1)"
            }
        }
    }
}

enum ImageState {
    Initializing,
    Initialized,
    MouseMoving,
    LoadingImage,
    ImageLoaded,
}

export interface IDrawComponentProps {

}

export interface IDrawComponentState {
    width: number;
    height: number;
    imageMetadataLoaded: boolean,
    tayInfo: ITayInfo,
    nearestTayImage: string;
    imageState: ImageState;
}