import * as React from "react";
import * as Radium from "radium";
import {ITayInfo} from "../models/Tay";
import * as xhr from "xhr";

@Radium
export class DrawComponent extends React.Component<IDrawComponentProps, IDrawComponentState> {
    static readonly TAY_INFO_URL = "/tay.json";

    props: IDrawComponentProps;
    state: IDrawComponentState;

    ctx: CanvasRenderingContext2D;

    constructor() {
        super();

        this.state = {
            width: 600,
            height: 480,
            tayInfo: null,
            imageMetadataLoaded: false,
            nearestTayImage: null
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
        const mouse = this.getMouse(e);

        const nearestTayImage = this.findNearestTayImage(mouse.x, mouse.y);

        this.setState({nearestTayImage})
    }

    getMouse(e: MouseEvent): { x: number, y: number } {
        const bounds = (e.target as any).getBoundingClientRect();

        console.log(bounds);

        return {
            x: e.clientX - bounds.left,
            y: e.clientY - bounds.top
        }
    }

    render() {
        return (
            <div style={[
                DrawComponent.styles.base
            ]}>
                <img
                    onMouseMove={this.mouseMove.bind(this)}
                    src={this.state.nearestTayImage}
                    style={DrawComponent.styles.img(this.state.width, this.state.height)}>
                </img>
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
        img: (width: number, height: number) => {
            return {
                width: width + "px",
                height: height + "px",
                backgroundColor: "rgba(0, 0, 0, 0.1)"
            }
        }
    }
}

export interface IDrawComponentProps {

}

export interface IDrawComponentState {
    width: number;
    height: number;
    imageMetadataLoaded: boolean,
    tayInfo: ITayInfo,
    nearestTayImage: string;
}