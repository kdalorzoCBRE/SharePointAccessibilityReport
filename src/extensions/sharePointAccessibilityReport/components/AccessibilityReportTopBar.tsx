import * as React from "react";
import { PrimaryButton } from "office-ui-fabric-react/lib/Button";
import { Panel, PanelType } from "office-ui-fabric-react/lib/Panel";
import * as strings from 'SharePointAccessibilityReportApplicationCustomizerStrings';
import { ApplicationCustomizerContext } from "@microsoft/sp-application-base";
import { AccessibilityReport } from "./AccessibilityReport";
import { AccessibilityChatBot } from "./AccessibilityChatBot"
import { getGUID } from "@pnp/core";

export interface IAccessibilityReportTopBarProps {
    context: ApplicationCustomizerContext;
}

export interface IAccessibilityReportTopBarState {
    showPanel: boolean;
    showChatBot: boolean;
    runID: string;
}

export class AccessibilityReportTopBar extends React.Component<IAccessibilityReportTopBarProps, IAccessibilityReportTopBarState> {
    constructor(props: IAccessibilityReportTopBarProps) {
        super(props);
        this.state = {
            showPanel: false,
            showChatBot: false,
            runID: getGUID()
        };

        this.handleShowChatBot = this.handleShowChatBot.bind(this);
        this._hideMenu = this._hideMenu.bind(this);
        this._showMenu = this._showMenu.bind(this);
    }

    public render(): React.ReactElement<IAccessibilityReportTopBarProps> {
        return (
            <div title="AccessibilityChecker">
                <PrimaryButton data-id="menuButton"
                    id="ShowAccessibilityReport"
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
                    id="AccessibilityReportPanel"
                >
                    <AccessibilityReport context={this.props.context} handleShowChatBot={this.handleShowChatBot} runID={this.state.runID} />
                </Panel>
                <AccessibilityChatBot showChatBot={this.state.showChatBot} runID={this.state.runID} />
            </div>
        );
    }

    private _showMenu = () => {
        this.setState({ showPanel: true, showChatBot: false });
    }

    private _hideMenu = () => {
        this.setState({ showPanel: false, showChatBot: false });
    }

    public handleShowChatBot = () => {
        this.setState(
            {
                showChatBot: true,
                showPanel: false
            })
        console.log("handle chatbot state: " + this.state.showChatBot)
    }

}