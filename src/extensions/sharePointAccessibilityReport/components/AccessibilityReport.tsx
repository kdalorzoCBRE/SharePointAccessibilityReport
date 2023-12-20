import * as React from "react";
import * as axe from 'axe-core';
import styles from "./AccessibilityReport.module.scss";

export interface IAccessibilityReportProps {
}

export interface IAccessibilityReportState {
    data: Array<any>;
    showChatBot: boolean;
}

export class AccessibilityReport extends React.Component<IAccessibilityReportProps, IAccessibilityReportState> {
    constructor(props: IAccessibilityReportProps) {
        super(props);
        this.state = {
            data: [],
            showChatBot: false,
        };
    }

    componentDidMount(): void {
        // Timeout is set to ensure the DOM is completeley render before running the accessbility report 
        setTimeout(() => {
            this.getAccessbility();
        }, 100)
    }

    public render(): React.ReactElement<IAccessibilityReportProps> {
        return (
            <div data-id="menuPanel" id="AccessibilityReport">
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
        );
    }

    private getAccessbility() {
        // ToDo: add error message in panel
        axe
            .run(".CanvasComponent")
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