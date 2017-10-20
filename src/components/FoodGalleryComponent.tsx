import * as React from "react";
import * as moment from "moment";
import {FoodGalleryItemComponent} from "./FoodGalleryItemComponent";
import {IDataModel} from "../ui/models/IDataModel";

export class FoodGalleryComponent extends React.Component<IFoodGalleryProps, IFoodGalleryState> {
    props: IFoodGalleryProps;

    constructor(props: IFoodGalleryProps) {
        super(props);

        console.log(props);
    }

    public render() {
        return (
            <div>
                {
                    this.props.data.places.map((item, index) => {
                        return (
                            <div key={index}>
                                <FoodGalleryItemComponent
                                    item={item}

                                    currentTime={this.props.currentTime}/>
                            </div>
                        );
                    })
                }
            </div>
        );
    }
}

export interface IFoodGalleryProps {
    currentTime: moment.Moment;
    data: IDataModel;
}

export interface IFoodGalleryState {

}