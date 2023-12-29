import * as React from "react";
import * as axe from 'axe-core';
import "./AccessibilityReport.module.scss";

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
                {this.state.data.map(issue => {
                    return (
                        <div>
                            <div className="AccessibilityReportHeader">
                                <h3>Element with Accessibility Issue</h3>
                                <p>{issue.id}</p>
                            </div>
                            <div className="AccessibilityReportBody">
                                <div className="simpleDescription">
                                    <h4>Simple Description of Issue</h4>
                                    <p>{issue.help}</p>
                                </div>
                                <div className="description">
                                    <h4>Description</h4>
                                    <p>{issue.description}</p>
                                </div>
                                <div className="impact">
                                    <h4>Impact</h4>
                                    <p>{issue.impact}</p>
                                </div>
                                <div className="helpUrl">
                                    <h4>Helpful Link</h4>
                                    <a href={issue.helpUrl} target="_blank" rel="noopener noreferrer">{issue.helpUrl}</a>
                                </div>
                                <div>
                                    <h3>Instances of Accessibility Issues</h3>
                                        {console.log(issue.nodes[0])}
                                        <p>{issue.nodes[0].failureSummary}</p>
                                </div>
                            </div>
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
                    console.log("Accessibility Violations", this.state.data);
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

/*                                {issue.nodes.map((issueNode: { html: any; }) => 
                                    <p>{issueNode.html}</p>
                                )} */

/*<h2>Issue Type:</h2>
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
<p>----------------------------------------------------------------------------------</p>*/