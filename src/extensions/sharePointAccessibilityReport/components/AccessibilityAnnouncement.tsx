import * as React from "react";
import { PrimaryButton } from "office-ui-fabric-react/lib/Button";
import { Panel, PanelType } from "office-ui-fabric-react/lib/Panel";
import * as strings from 'SharePointAccessibilityReportApplicationCustomizerStrings';
import { ApplicationCustomizerContext } from "@microsoft/sp-application-base";
import * as axe from 'axe-core';
import styles from "./AccessibilityAnnouncement.module.scss";


export interface IAccessibilityReportTopBarProps {
    context: ApplicationCustomizerContext;
}

export interface IAccessibilityReportTopBarState {
    showPanel: boolean;
    data: Array<any>;
}

export class AccessibilityReportTopBar extends React.Component<IAccessibilityReportTopBarProps, IAccessibilityReportTopBarState> {
    constructor(props: IAccessibilityReportTopBarProps) {
        super(props);
        this.state = {
            showPanel: false,
            data: []
        };
    }

    componentDidMount(): void {
        this.getAccessbility();
    }

    public render(): React.ReactElement<IAccessibilityReportTopBarProps> {
        return (
            <div>
                <PrimaryButton data-id="menuButton"
                    title={strings.showAccessibilityReport}
                    text={strings.showAccessibilityReport}
                    ariaLabel={strings.showAccessibilityReport}
                    iconProps={{ iconName: "View" }}
                    onClick={this._showMenu}
                />
                <Panel isOpen={this.state.showPanel}
                    type={PanelType.medium}
                    onDismiss={this._hideMenu}
                    headerText={strings.AccessibilityReportHeader}
                    isLightDismiss={true}
                >
                    <div data-id="menuPanel" >
                        {this.state.data.map(function (item: any, key: any) {
                            return (
                                <div>
                                    <h2>Issue Type:</h2>
                                    <table className={styles.accessibilityPanelTable}>
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
                                    <table className={styles.accessibilityPanelTable}>
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
                                    <table className={styles.accessibilityPanelTable}>
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
                                    <p>----------------------------------------------------------------------------------</p>
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
                    console.log(this.state.data);
                }
                else {
                    console.log("No violations")
                }
            })
            .catch(err => {
                console.log(err.message);
            });
    }

}