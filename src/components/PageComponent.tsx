import * as React from "react";
import * as moment from "moment";
import {FoodGalleryComponent} from "./FoodGalleryComponent";
import {IDataModel} from "../ui/models/IDataModel";

export class PageComponent extends React.Component<any, IPageComponentState> {
    public state: IPageComponentState;
    public interval: NodeJS.Timer;
    private readonly UPDATE_INTERVAL = 1000 * 1;

    constructor(props: any) {
        super(props);

        this.state = {
            data: require("!json-loader!../../resources/data.json"),
            currentTime: moment()
        };
    }

    private setRenderInterval() {
        this.interval = setInterval(() => {
            this.setState({
                currentTime: moment()
            });
        }, this.UPDATE_INTERVAL)
    }

    private clearRenderInterval() {
        clearInterval(this.interval);
    }

    public componentDidMount() {
        this.setRenderInterval();
    }

    public componentWillUnmount() {
        this.clearRenderInterval()
    }

    public render() {
        return (
            <FoodGalleryComponent data={this.state.data} currentTime={this.state.currentTime}/>
        );
    }
}

export interface IPageComponentState {
    data: IDataModel;
    currentTime: moment.Moment;
}