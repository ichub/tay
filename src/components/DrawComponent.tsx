import * as React from "react";
import * as Radium from "radium";
import {ITayInfo} from "../models/Tay";
import * as xhr from "xhr";

@Radium
export class DrawComponent extends React.Component<IDrawComponentProps, IDrawComponentState> {
    static readonly TAY_INFO_URL = "/tay.json";

    props: IDrawComponentProps;
    state: IDrawComponentState;

    refs: {
        canvas: HTMLCanvasElement
    };

    ctx: CanvasRenderingContext2D;

    constructor() {
        super();

        this.state = {
            width: 600,
            height: 480,
            mouseDown: false,
            tayInfo: null,
            loaded: false
        }
    }

    async componentDidMount() {
        this.ctx = this.refs.canvas.getContext("2d");
        this.refs.canvas.width = this.state.width;
        this.refs.canvas.height = this.state.height;

        this.registerListeners();
        const tayInfo = await this.fetchImageUrls();

        this.setState({tayInfo});
    }

    fetchImageUrls(): Promise<ITayInfo> {
        return new Promise<ITayInfo>((resolve, reject) => {
            xhr.get(DrawComponent.TAY_INFO_URL, (err, resp, body) => {
                if (err) {
                    return reject(err);
                }

                resolve(body);
            });
        });
    }

    registerListeners() {
        document.addEventListener("mousedown", this.mouseDown.bind(this));
        document.addEventListener("mouseup", this.mouseUp.bind(this));
        document.addEventListener("mousemove", this.mouseMove.bind(this));
    }

    mouseDown(e: MouseEvent) {
        this.setState({
            mouseDown: true
        });
    }

    mouseUp(e: MouseEvent) {
        this.setState({
            mouseDown: false
        })
    }

    mouseMove(e: MouseEvent) {
        if (!this.state.mouseDown) {
            return;
        }

        const mouse = this.getMouse(e);

        console.log(mouse);

        this.ctx.fillStyle = "red";
        this.ctx.fillRect(mouse.x, mouse.y, 10, 10);
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
                <canvas
                    style={DrawComponent.styles.canvas(this.state.width, this.state.height)}

                    ref="canvas"
                    width={this.state.width}
                    height={this.state.height}></canvas>
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
        canvas: (width: number, height: number) => {
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
    mouseDown: boolean;
    loaded: boolean,
    tayInfo: ITayInfo
}