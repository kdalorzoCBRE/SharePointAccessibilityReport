import * as React from "react";
import styles from "./AccessibilityReport.module.scss";

export interface IChatBotProps {
    visibleChatBot: boolean
}

export interface IChatBotState {
}

export class AccessibilityChatBot extends React.Component<IChatBotProps, IChatBotState> {

    constructor(props: IChatBotProps) {
        super(props);
    }

    public render(): React.ReactElement<IChatBotProps> {
        return (
            <div id="webchatContainer" hidden={this.props.visibleChatBot} className={styles.webchatContainer}>
                <div id="webchat" role="main" style={{ height: "100%" }}>
                </div>
            </div>
        );
    }
}  
