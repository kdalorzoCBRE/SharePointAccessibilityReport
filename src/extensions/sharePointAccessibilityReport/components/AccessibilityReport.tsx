import * as React from "react";
import * as axe from 'axe-core';
import styles from "./AccessibilityReport.module.scss";
import { ErrorCircle24Regular } from '@fluentui/react-icons';
/*import { Button } from '@fluentui/react-components';*/
import { spfi, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { LogLevel, PnPLogging } from "@pnp/logging";
import { IItemAddResult } from "@pnp/sp/items";
import { ApplicationCustomizerContext } from "@microsoft/sp-application-base";
//import { getGUID } from "@pnp/core";
import { AccessibilityChatBotButton } from "./AccessibilityChatBotButton";
import { AccessibilityError } from "./AccessibilityError";

export interface IAccessibilityReportProps {
    context: ApplicationCustomizerContext,
    handleShowChatBot: () => void;
    runID: string;
}

export interface IAccessibilityReportState {
    data: Array<any>;
    currentPage: number;
    issuePerPage: number;
    isPrevBtnActive: string;
    isNextBtnActive: string;
    upperPageBound: number;
    lowerPageBound: number;
    pageBound: number;
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
            upperPageBound: 3,
            lowerPageBound: 0,
            pageBound: 3,
            isPrevBtnActive: 'disabled',
            isNextBtnActive: '',
            showChatBot: false,
            runID: this.props.runID
        };
        this.handleClick = this.handleClick.bind(this);
        this.btnNextClick = this.btnNextClick.bind(this);
        this.btnPrevClick = this.btnPrevClick.bind(this);
        this.setPrevAndNextBtnClass = this.setPrevAndNextBtnClass.bind(this);
        this.handleShowChatBotClick = this.handleShowChatBotClick.bind(this);
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
                    return results.violations;
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

    handleClick(event: any) {
        console.log("hum");
        let listid = Number(event.target.id)
        this.setState({
            currentPage: listid
        })
        this.setPrevAndNextBtnClass(listid);
    }

    btnPrevClick() {
        if ((this.state.currentPage - 1) % this.state.pageBound === 0) {
            this.setState({ upperPageBound: this.state.upperPageBound - this.state.pageBound });
            this.setState({ lowerPageBound: this.state.lowerPageBound - this.state.pageBound });
        }
        let listid = this.state.currentPage - 1;
        this.setState({ currentPage: listid });
        this.setPrevAndNextBtnClass(listid);
    }

    btnNextClick() {
        if ((this.state.currentPage + 1) > this.state.upperPageBound) {
            this.setState({ upperPageBound: this.state.upperPageBound + this.state.pageBound });
            this.setState({ lowerPageBound: this.state.lowerPageBound + this.state.pageBound });
        }
        let listid = this.state.currentPage + 1;
        this.setState({ currentPage: listid });
        this.setPrevAndNextBtnClass(listid);
    }

    public render(): React.ReactElement<IAccessibilityReportProps> {

        const { data, currentPage, issuePerPage, upperPageBound, lowerPageBound, isNextBtnActive, isPrevBtnActive } = this.state;

        const indexOfLastIssue = currentPage * issuePerPage;
        const indexOfFirstIssue = indexOfLastIssue - issuePerPage;
        const currentIssues = data.slice(indexOfFirstIssue, indexOfLastIssue);

        const renderIssues = currentIssues.map((issue, index) => {
            return (
                <div key={index}>
                    <div className={styles.ElementWithIssue}>
                        <h3>Element with Accessibility Issue</h3>
                        <p>{issue.id}</p>
                    </div>
                    <div>
                        <div className={styles.simpleDescription}>
                            <h3>Simple Description of Issue</h3>
                            <p>{issue.description}</p>
                        </div>
                        <div className={styles.helpUrl}>
                            <p>Resources for this Accessibility Issue</p>
                            <a href={issue.helpUrl} target="_blank" rel="noopener noreferrer">{issue.helpUrl}</a>
                        </div>
                        <div className={styles.infoTable}>
                            <table>
                                <tr>
                                    <th>Impact</th>
                                    <td>{issue.impact}</td>
                                </tr>
                                <tr>
                                    <th>Problem</th>
                                    <td>{issue.help}</td>
                                </tr>
                                <tr>
                                    <th>Failure Summary</th>
                                    <td>{issue.nodes[0].failureSummary}</td>
                                </tr>
                            </table>
                        </div>
                        <div className={styles.issueInstancesHeader}>
                            <h3>Instances of Accessibility Issues</h3>
                            <p>Amount of Instances : {issue.nodes.length}</p>
                        </div>
                        <div className={styles.issueInstances}>
                            {issue.nodes.length > 0 ?
                                issue.nodes.map(function (node: any, index: number) {
                                    return (
                                        <ul>
                                            <li key={index} className={styles.issueInstanceItem}>
                                                <span>{node.html}</span>
                                                <button>Show Issue on Page</button>
                                            </li>
                                        </ul>
                                    )
                                })
                                :
                                <div></div>
                            }
                        </div>
                    </div>
                </div>
            )
        });

        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(data.length / issuePerPage); i++) {
            pageNumbers.push(i);
        }

        const renderPageNumbers = pageNumbers.map(pageNumber => {
            if (pageNumber === 1 && currentPage === 1) {
                return (
                    <li key={pageNumber} className={styles.pageNumbers}>
                        <a href='#' id={String(pageNumber)} onClick={this.handleClick}>
                            {pageNumber}
                        </a>
                    </li>
                )
            }
            else if ((pageNumber < upperPageBound + 1) && pageNumber > lowerPageBound) {
                return (
                    <li key={pageNumber} className={styles.pageNumbers}>
                        <a href='#' id={String(pageNumber)} onClick={this.handleClick}>
                            {pageNumber}
                        </a>
                    </li>
                )
            }
        })

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
            <div data-id="menuPanel" className={styles.menuPanel}>
                <div className={styles.totalErrors}>
                    <ErrorCircle24Regular />
                    <p>Total Number of Accessibility Issues : {this.state.data.length}</p>
                </div>
                <div /*className={styles.renderIssues}*/>
                    {renderIssues}
                </div>
                <div className={styles.pagination}>
                    <div>
                        {renderPrevButton}
                    </div>
                    <div className={styles.renderPageNumbers}>
                        {renderPageNumbers}
                    </div>
                    <div>
                        {renderNextBtn}
                    </div>
                </div>
                <div className={styles.chatBotFooter}>
                    <p> Want to learn more about the web accessibility issues? Chat with our AI bot for help: </p>
                    <AccessibilityChatBotButton onclickHandler={this.handleShowChatBotClick} />
                </div>
            </div>
        );
    }

    handleShowChatBotClick = () => {
        console.log("handleShowChatBotClick");
        this.props.handleShowChatBot();
    }
}