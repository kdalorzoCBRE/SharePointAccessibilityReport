import * as React from "react";
import { PrimaryButton } from "office-ui-fabric-react/lib/Button";
import { Panel, PanelType } from "office-ui-fabric-react/lib/Panel";
import * as strings from 'SharePointAccessibilityReportApplicationCustomizerStrings';
import { ApplicationCustomizerContext } from "@microsoft/sp-application-base";
import { AccessibilityReport } from "./AccessibilityReport";

export interface IAccessibilityReportTopBarProps {
    context: ApplicationCustomizerContext;
}

export interface IAccessibilityReportTopBarState {
    showPanel: boolean;
}

export class AccessibilityReportTopBar extends React.Component<IAccessibilityReportTopBarProps, IAccessibilityReportTopBarState> {
    constructor(props: IAccessibilityReportTopBarProps) {
        super(props);
        this.state = {
            showPanel: false,
        };
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
                    <AccessibilityReport />
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
}