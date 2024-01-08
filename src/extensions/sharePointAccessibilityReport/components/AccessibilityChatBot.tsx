import * as React from "react";
import styles from "./AccessibilityReport.module.scss";

export interface IChatBotProps {
    showChatBot: boolean
}

export interface IChatBotState {
    showChatBot: boolean
}

export class AccessibilityChatBot extends React.Component<IChatBotProps, IChatBotState> {

    constructor(props: IChatBotProps) {
        super(props);
        this.state = {
            showChatBot: this.props.showChatBot
        }
    }

    public render(): React.ReactElement<IChatBotProps> {
        return (
            <div id="webchatContainer" hidden={this.state.showChatBot} className={styles.webchatContainer}>
                <div id="webchat" role="main" style={{ height: "100%", borderColor: "gray" }}>
                </div>
            </div>
        );
    }
}  
