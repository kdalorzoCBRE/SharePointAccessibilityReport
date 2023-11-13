import * as React from "react";
import { PrimaryButton } from "office-ui-fabric-react/lib/Button";
import { Panel, PanelType } from "office-ui-fabric-react/lib/Panel";
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import styles from "./MyFavourites.module.scss";
import * as strings from 'SharePointAccessibilityReportApplicationCustomizerStrings';
import { ApplicationCustomizerContext } from "@microsoft/sp-application-base";
import * as axe from 'axe-core';

import { IItem } from "./item";

export interface IMyFavouritesTopBarProps {
    context: ApplicationCustomizerContext;
}

export interface IMyFavouritesTopBarState {
    showPanel: boolean;
    showDialog: boolean;
    dialogTitle: string;
    myFavouriteItems: IItem[];
    itemInContext: IItem;
    isEdit: boolean;
    status: JSX.Element;
    disableButtons: boolean;
    data: Array<any>;
    currentPage: number;
    totalPages: number;
}

export class MyFavouritesTopBar extends React.Component<IMyFavouritesTopBarProps, IMyFavouritesTopBarState> {
    constructor(props: IMyFavouritesTopBarProps) {
        super(props);
        this.state = {
            showPanel: false,
            showDialog: false,
            dialogTitle: "",
            myFavouriteItems: [],
            itemInContext: {
                Id: 0,
                Title: "",
                Description: "",
            },
            isEdit: false,
            status: <Spinner size={SpinnerSize.large} label={strings.LoadingStatusLabel} />,
            disableButtons: false,
            data: [],
            currentPage: 1,
            totalPages: 1
        };
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event: any) {
        this.setState({
            currentPage: Number(event.target.id)
        });
    }

    componentDidMount(): void {
        this.getAccessbility();
    }

    public render(): React.ReactElement<IMyFavouritesTopBarProps> {
        return (
            <div className={styles.ccTopBar} >
                <PrimaryButton data-id="menuButton"
                    title={strings.ShowMyFavouritesLabel}
                    text={strings.ShowMyFavouritesLabel}
                    ariaLabel={strings.ShowMyFavouritesLabel}
                    iconProps={{ iconName: "View" }}
                    className={styles.ccTopBarButton}
                    onClick={this._showMenu}
                />
                <Panel isOpen={this.state.showPanel}
                    type={PanelType.medium}
                    onDismiss={this._hideMenu}
                    headerText={strings.MyFavouritesHeader}
                    isLightDismiss={true}
                >
                    <div data-id="menuPanel" >
                        {this.state.data.map(function (item: any, key: any) {
                            return (
                                <div>
                                    <h2>Issue Type:</h2>
                                    <table>
                                        <thead>
                                            <th>ID</th>
                                            <th>Impact</th>
                                            <th>Description</th>
                                        </thead>
                                        <tbody>
                                            <tr key={key}>
                                                <td>{item.id}</td>
                                                <td>{item.impact}</td>
                                                <td>{item.description}</td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    <h3>Issue details:</h3>
                                    <table>
                                        <thead>
                                            <th>Summary</th>
                                            <th>HTML</th>
                                        </thead>
                                        <tbody>
                                            {item.nodes.map(function (item2: any, key2: any) {
                                                return (
                                                    <tr key={key2}>
                                                        <td>{item2.failureSummary}</td>
                                                        <td>{item2.html}</td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>

                                    <h3>Issues found:</h3>
                                    <table>
                                        <thead>
                                            <th>ID</th>
                                            <th>Message</th>
                                        </thead>
                                        <tbody>
                                            {item.nodes[0].any.map(function (item3: any, key3: any) {
                                                return (
                                                    <tr key={key3}>
                                                        <td>{item3.id}</td>
                                                        <td>{item3.message}</td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )
                        })}
                    </div>
                </Panel>
            </div>
        );
    }

    private _showMenu = () => {
        this.setState({ showPanel: true });
    }

    private _hideMenu = () => {
        this.setState({ showPanel: false });
    }

    private getAccessbility() {
        axe
            .run()
            .then(async results => {
                if (results.violations.length) {
                    this.setState({ data: results.violations });
                    this.setState({ totalPages: results.violations.length })
                    console.log(this.state.data);
                    console.log(this.state.totalPages);
                }
                else {
                    console.log("No violations")
                    this.setState({ data: ["No violations"] });
                }
            })
            .catch(err => {
                console.log(err.message);
                this.setState({ data: ["Hum"] });
            });
    }

}