import * as React from "react";
import { PrimaryButton } from "office-ui-fabric-react/lib/Button";
import { Panel, PanelType } from "office-ui-fabric-react/lib/Panel";
import * as strings from 'SharePointAccessibilityReportApplicationCustomizerStrings';
import { ApplicationCustomizerContext } from "@microsoft/sp-application-base";
import { AccessibilityReport } from "./AccessibilityReport";
import { AccessibilityChatBot } from "./AccessibilityChatBot"

export interface IAccessibilityReportTopBarProps {
    context: ApplicationCustomizerContext;
}

export interface IAccessibilityReportTopBarState {
    showPanel: boolean;
    showChatBot: boolean;
}

export class AccessibilityReportTopBar extends React.Component<IAccessibilityReportTopBarProps, IAccessibilityReportTopBarState> {
    constructor(props: IAccessibilityReportTopBarProps) {
        super(props);
        this.state = {
            showPanel: false,
            showChatBot: false,
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
                    <AccessibilityReport context={this.props.context} handleShowChatBot={this.handleShowChatBot} />
                </Panel>
                <AccessibilityChatBot showChatBot={this.state.showChatBot} />
            </div>
        );
    }

    private _showMenu = () => {
        console.log("show menu previous chatbot state: " + this.state.showChatBot)
        this.setState({ showPanel: true, showChatBot: false });
        console.log("show menu chatbot state: " + this.state.showChatBot)
    }

    private _hideMenu = () => {
        console.log("hide menu previous chatbot state: " + this.state.showChatBot)
        this.setState({ showPanel: false, showChatBot: false });
        console.log("hide menu chatbot state: " + this.state.showChatBot)
    }

    public handleShowChatBot = () => {
        console.log("handle previous chatbot state: " + this.state.showChatBot)
        this.setState(
            {
                showChatBot: true,
                showPanel: false
            })
        console.log("handle chatbot state: " + this.state.showChatBot)
    }

}