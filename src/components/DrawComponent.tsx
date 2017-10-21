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
            width: 600,
            height: 480,
            tayInfo: null,
            imageMetadataLoaded: false,
            nearestTayImage: null,
            imageState: ImageState.JustLoadedPage,
        }
    }

    componentDidMount() {
        this.fetchImageUrls().then(tayInfo => {
            console.log(tayInfo);
            this.setState({tayInfo});
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

    mouseMove(e: MouseEvent) {
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
        let overlay = null;

        switch (this.state.imageState) {
            case ImageState.ImageLoaded:
                break;
            case ImageState.JustLoadedPage:
                overlay = (
                    <div style={DrawComponent.styles.overlay}>move your mouse (;</div>
                );
                break;
            case ImageState.MouseMoving:
                overlay = (
                    <div style={DrawComponent.styles.overlay}>looking for matches!</div>
                );
                break;
            case ImageState.LoadingImage:
                overlay = (
                    <div style={DrawComponent.styles.overlay}>found a match, loading image!</div>
                );
                break;
        }
        return (
            <div style={[
                DrawComponent.styles.base
            ]}>
                <div style={[
                    DrawComponent.styles.imgContainer,
                    DrawComponent.styles.size(this.state.width, this.state.height)
                ]}
                     onMouseMove={this.mouseMove.bind(this)}>
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
        },
        overlay: {
            width: "100%",
            height: "100%",
            position: "absolute",
            top: "0",
            left: "0",
            backgroundColor: "grey",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
        },
        imgContainer: {
            position: "relative",
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
    JustLoadedPage,
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