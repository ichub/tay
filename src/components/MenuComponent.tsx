import * as React from "react";
import {Menu} from "../ui/models/IFoodGalleryItem";
import {Weekday, WeekdayStrings, Weekdays} from "../ui/Weekdays";

export class MenuComponent extends React.Component<IMenuComponentProps, any> {
    public props: IMenuComponentProps;
    public state: IMenuComponentState;

    constructor(props: any) {
        super(props);

        this.state = {
            selectedDay: null
        }
    }


    private renderMenuSection(title: string, items: string[]) {
        if (items) {
            return (
                <tr className="menu-section">
                    <td className="menu-section-title">{title}</td>
                    <td className="menu-section-contents">
                        {
                            items.map((item: string, idx: number) => {
                                return (
                                    <div className="menu-section-food" key={idx}>{item}</div>
                                )
                            })
                        }
                    </td>
                </tr>
            );
        }
        return null;
    }

    private handleMenuDayClick(day: Weekday) {
        console.log(day);

        this.setState({
            selectedDay: day == this.state.selectedDay ? null : day
        });
    }

    private renderMenuDay(day: Weekday, idx: number) {
        if (this.props.menu[day]) {

            if (this.state.selectedDay === day) {
                return (
                    <div key={idx}>
                        <div
                            className="menu-day-title"
                            onClick={this.handleMenuDayClick.bind(this, day)}>{day}</div>
                        <table className="menu-day">

                            <tbody>
                            {this.renderMenuSection("Breakfast", this.props.menu[day].breakfast)}
                            {this.renderMenuSection("Lunch", this.props.menu[day].lunch)}
                            {this.renderMenuSection("Dinner", this.props.menu[day].dinner)}
                            </tbody>
                        </table>
                    </div>
                );
            }

            return (
                <div
                    key={idx}
                    className="menu-day-title-link"
                    onClick={this.handleMenuDayClick.bind(this, day)}>{day}</div>
            )
        }

        return null;
    }

    public render() {
        return (
            <div className="menu">
                {
                    Weekdays.map((day: Weekday, idx: number) => {
                        return this.renderMenuDay(day, idx)
                    })
                }
            </div>
        );
    }
}

export interface IMenuComponentProps {
    menu: Menu
}

export interface IMenuComponentState {
    selectedDay: Weekday;
}