import * as React from "react";
import * as moment from "moment";
import * as clone from "clone";
import * as Modal from "react-modal";
import {ITime, ITimeSpanAndWeekday, ITimeSpan, DayMenu, IFoodGalleryItem} from "../ui/models/IFoodGalleryItem";
import {leftpad, capitalize} from "../ui/Helpers";
import {Weekdays, getWeekday, WeekdayStrings, Weekday} from "../ui/Weekdays";
import {MenuComponent} from "./MenuComponent";
import {ScheduleComponent} from "./ScheduleComponent";

export class FoodGalleryItemComponent extends React.Component<IFoodGalleryItemComponentProps, IFoodGalleryItemComponentState> {
    props: IFoodGalleryItemComponentProps;
    state: IFoodGalleryItemComponentState;

    constructor(props: IFoodGalleryItemComponentProps) {
        super(props);

        this.state = {
            isModalOpen: false
        }
    }

    private convertNumberToTime(numberTime: ITime): string {
        return numberTime.h + ":" + leftpad(numberTime.m, 2);
    }

    private getCurrentScheduleEntry(): ITimeSpanAndWeekday {
        for (let weekDay of Object.keys(this.props.item.hours)) {
            const hours = this.props.item.hours[weekDay];

            for (let i = 0; i < hours.length; i++) {
                const openRange = hours[i];

                let format = 'hh:mm:ss';

                let time = moment(`${this.props.currentTime.hour()}:${this.props.currentTime.minutes()}:00`, format);
                let beforeTime = moment(`${openRange.start.h}:${openRange.start.m}:00`, format);
                let afterTime = moment(`${openRange.end.h}:${openRange.end.m}:00`, format);

                if (time.isBetween(beforeTime, afterTime)) {
                    const cloned: ITimeSpanAndWeekday = clone(openRange) as any;
                    cloned.weekday = weekDay;

                    return cloned;
                }
            }
        }

        return null;
    }

    private renderStatus() {
        const openClassName = "open";
        const closedClassName = "closed";

        const className = this.getCurrentScheduleEntry() == null ? closedClassName : openClassName;

        return (
            <span className={className + " status"}>{className}</span>
        );
    }

    private afterOpenModal() {

    }

    private closeModal() {
        this.setState({
            isModalOpen: false
        });
    }

    private openModal() {
        this.setState({
            isModalOpen: true
        })
    }

    private renderTimespan(span: ITimeSpan): string {
        return this.convertNumberToTime(span.start) + " - " +
            this.convertNumberToTime(span.end);
    }

    private renderHours() {
        const rows = [];

        for (let weekDay of Weekdays) {
            const hours: ITimeSpan[] = this.props.item.hours[weekDay];
            let result = null;

            if (hours != undefined) {
                const hourElements = [];

                for (let i = 0; i < hours.length; i++) {
                    hourElements.push(
                        <span key={i}>
                            {this.renderTimespan(hours[i])}
                        </span>
                    );
                }

                result = hourElements;
            } else {
                result = <span>closed</span>
            }

            let isToday = getWeekday(this.props.currentTime) == weekDay;

            rows.push(
                <tr key={weekDay} className={isToday ? "today" : ""}>
                    <td className="weekday">
                        {capitalize(weekDay)} {isToday ? <span>(today)</span> : null}
                    </td>
                    <td>
                        {result}
                    </td>
                </tr>
            );
        }

        return (
            <table className="hours">
                <tbody>
                {rows}
                </tbody>
            </table>
        );
    }

    private renderIsOpen() {
        const entry = this.getCurrentScheduleEntry();
        const open = "open";
        const closed = "closed";

        const isOpen = (entry == null) ? closed : open;

        return (
            <span className={"isOpen" + " " + isOpen}>
                {isOpen + " right now"}
            </span>
        );
    }

    private renderModal() {
        return (
            <Modal
                className="detail-modal"
                overlayClassName="detail-modal-overlay"
                isOpen={this.state.isModalOpen}
                onAfterOpen={this.afterOpenModal.bind(this)}
                onRequestClose={this.closeModal.bind(this)}
                contentLabel="">
                <div className="title">
                    <span className="nameAndIsOpen">
                        <span className="name">{this.props.item.name}</span>
                        {/*{this.renderIsOpen()}*/}
                    </span>

                    <span className="close" onClick={this.closeModal.bind(this)}>close</span>
                </div>
                <div className="content">
                    <ScheduleComponent/>
                    <MenuComponent menu={this.props.item.menu}/>
                </div>
            </Modal>
        );
    }

    public render() {
        return (
            <span className="food-gallery-item-component">
                <span className="place-name" onClick={this.openModal.bind(this)}>
                    {this.props.item.name}
                </span>
                &nbsp;
                {this.renderStatus()}
                {this.renderModal()}
            </span>
        );
    }
}

export interface IFoodGalleryItemComponentProps {
    currentTime: moment.Moment;
    item: IFoodGalleryItem;
}

export interface IFoodGalleryItemComponentState {
    isModalOpen: boolean;
}