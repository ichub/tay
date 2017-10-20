import * as React from "react";
import * as Radium from "radium";

@Radium
export class DrawComponent extends React.Component<IDrawComponentProps, IDrawComponentState> {
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
        }
    }

    componentDidMount() {
        this.ctx = this.refs.canvas.getContext("2d");
        this.refs.canvas.width = this.state.width;
        this.refs.canvas.height = this.state.height;
    }

    mouseDown(e: MouseEvent) {

    }

    mouseUp(e: MouseEvent) {

    }

    mouseMove(e: MouseEvent) {
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
                    onMouseDown={this.mouseDown.bind(this)}
                    onMouseUp={this.mouseUp.bind(this)}
                    onMouseMove={this.mouseMove.bind(this)}
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
}