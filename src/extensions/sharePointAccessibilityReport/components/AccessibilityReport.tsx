import * as React from "react";
import * as axe from 'axe-core';
import styles from "./AccessibilityReport.module.scss";

import { spfi, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { LogLevel, PnPLogging } from "@pnp/logging";
import { IItemAddResult } from "@pnp/sp/items";
import { ApplicationCustomizerContext } from "@microsoft/sp-application-base";
import { getGUID } from "@pnp/core";
import { AccessibilityChatBotButton } from "./AccessibilityChatBotButton";


export interface IAccessibilityReportProps {
    context: ApplicationCustomizerContext,
    onclickHandler: () => void
}

export interface IAccessibilityReportState {
    data: Array<any>;
    showChatBot: boolean;
    runID: string;
}

class AccessibilityError {
    constructor(public runId: string, public runDate: Date, public issueId: string, public impact: string, public description: string,
        public summary: string, public html: string, public itemId: string, public message: string) { }

    public toJSON() {
        return {
            'RunID': this.runId,
            'Page': {
                Description: "Description",
                Url: "https://github.com/SharePoint/PnP-JS-Core/issues/682"
            },
            'RunDate': this.runDate,
            'IssueId': this.issueId,
            'Impact': this.impact,
            'Description': this.description,
            'Summary': this.summary,
            'HTML': this.html,
            'ItemId': this.itemId,
            'Message': this.message
        }
    }
}


export class AccessibilityReport extends React.Component<IAccessibilityReportProps, IAccessibilityReportState> {
    constructor(props: IAccessibilityReportProps) {
        super(props);
        this.state = {
            data: [],
            showChatBot: false,
            runID: getGUID()
        };
        console.log("RUN ID: " + this.state.runID)
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

                <AccessibilityChatBotButton onclickHandler={this.props.onclickHandler} runID={this.state.runID} />
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
                    return results.violations
                }
                else {
                    console.log("No violations")
                }
                return []
            })
            .then(violations => {
                this.saveAccessibilityErrorsInList();
            })
            .catch(err => {
                console.log("Error on get accessibility: " + err.message);
            });
    }

    private saveAccessibilityErrorsInList() {

        const runDate = new Date();

        this.state.data.forEach(e1 => {
            e1.nodes.forEach((e2: any) => {
                e2.any.forEach((e3: any) => {
                    const acccessibilityError = new AccessibilityError(
                        this.state.runID,
                        runDate,
                        e1.id,
                        e1.impact,
                        e1.description,
                        e2.failureSummary,
                        e2.html,
                        e3.id,
                        e3.message
                    )
                    this.saveErrorsInList(acccessibilityError)
                });
            });

        });
    }

    private saveErrorsInList(accessbilityError: AccessibilityError) {
        const sp = spfi().using(SPFx(this.props.context)).using(PnPLogging(LogLevel.Warning));

        const listName = "Accessibility Bugs";

        sp.web.lists.getByTitle(listName).items
            .add(accessbilityError.toJSON())
            .then((result: IItemAddResult): void => {
            }, (error: any): void => {
                console.log("error on save errors in list: " + error)
            });
    }

}