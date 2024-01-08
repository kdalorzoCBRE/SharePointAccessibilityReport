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
import { AccessibilityError } from "./AccessibilityError";



export interface IAccessibilityReportProps {
    context: ApplicationCustomizerContext,
    onclickHandler: () => void
}

export interface IAccessibilityReportState {
    data: Array<any>;
    currentPage: number;
    issuePerPage: number;
    isPrevBtnActive: string;
    isNextBtnActive: string;
    showChatBot: boolean;
    runID: string;
}





export class AccessibilityReport extends React.Component<IAccessibilityReportProps, IAccessibilityReportState> {
    constructor(props: IAccessibilityReportProps) {
        super(props);
        this.state = {
            data: [],
            currentPage: 1,
            issuePerPage: 1,
            isPrevBtnActive: 'disabled',
            isNextBtnActive: '',
            showChatBot: false,
            runID: getGUID()
        };
        this.handleClick = this.handleClick.bind(this);
        this.btnNextClick = this.btnNextClick.bind(this);
        this.btnPrevClick = this.btnPrevClick.bind(this);
        this.setPrevAndNextBtnClass = this.setPrevAndNextBtnClass.bind(this);
    }

    componentDidMount(): void {
        // Timeout is set to ensure the DOM is completeley render before running the accessbility report 
        setTimeout(() => {
            this.getAccessbility();
        }, 100)
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

    handleClick(event: any) {
        let listid = Number(event.target.id)
        this.setState({
            currentPage: Number(event.target.id)
        })
        this.setPrevAndNextBtnClass(listid);
    }

    setPrevAndNextBtnClass(listid: any) {
        let totalPage = Math.ceil(this.state.data.length / this.state.issuePerPage);
        this.setState({ isNextBtnActive: 'disabled' });
        this.setState({ isPrevBtnActive: 'disabled' });
        if (totalPage === listid && totalPage > 1) {
            this.setState({ isPrevBtnActive: '' });
        }
        else if (listid === 1 && totalPage > 1) {
            this.setState({ isNextBtnActive: '' });
        }
        else if (totalPage > 1) {
            this.setState({ isNextBtnActive: '' });
            this.setState({ isPrevBtnActive: '' });
        }
    }

    btnPrevClick() {
        let listid = this.state.currentPage - 1;
        this.setState({ currentPage: listid });
        this.setPrevAndNextBtnClass(listid);
    }

    btnNextClick() {
        let listid = this.state.currentPage + 1;
        this.setState({ currentPage: listid });
        this.setPrevAndNextBtnClass(listid);
    }

    public render(): React.ReactElement<IAccessibilityReportProps> {

        const { data, currentPage, issuePerPage, isNextBtnActive, isPrevBtnActive } = this.state;

        const indexOfLastIssue = currentPage * issuePerPage;
        const indexOfFirstIssue = indexOfLastIssue - issuePerPage;
        const currentIssues = data.slice(indexOfFirstIssue, indexOfLastIssue);

        const renderIssues = currentIssues.map((issue, index) => {
            return (
                <div key={index}>
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
                            {issue.nodes.map(function (node: any, index: any) {
                                return (
                                    <ul>
                                        <li key={index}>
                                            <span><h3>Failure Summary : </h3><p>{node.failureSummary}</p></span>
                                            <span><h3>HTML : </h3><p>{node.html}</p></span>
                                            <span><h3>Impact : </h3><p>{node.impact}</p></span>
                                        </li>
                                    </ul>
                                )
                            })}
                        </div>
                    </div>
                </div>
            )
        });

        let renderPrevButton = null;
        if (isPrevBtnActive === 'disabled') {
            renderPrevButton = (
                <div className="prevButton">
                    <span id="btnPrev"> Prev </span>
                </div>
            )
        }
        else {
            renderPrevButton = (
                <div className="prevButton">
                    <a href="#" id="btnPrev" onClick={this.btnPrevClick}> Prev </a>
                </div>
            )
        }
        let renderNextBtn = null;
        if (isNextBtnActive === 'disabled') {
            renderNextBtn = (
                <div className="nextButton">
                    <span id="btnNext"> Next </span>
                </div>
            )
        }
        else {
            renderNextBtn = (
                <div className="nextButton">
                    <a href="#" id="btnNext" onClick={this.btnNextClick}> Next </a>
                </div>
            )
        }

        return (
            <div data-id="menuPanel" className="AccessibilityReport">
                <div>
                    {renderIssues}
                </div>
                <div className={styles.pagination}>
                    <div>
                        {renderPrevButton}
                    </div>
                    <div>
                        {renderNextBtn}
                    </div>
                </div>
                <div>
                    <p> Want to learn more about the web accessibility issues? Chat with our AI bot for help: </p>
                    <AccessibilityChatBotButton onclickHandler={this.props.onclickHandler} runID={this.state.runID} />
                </div>

            </div>
        );


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
