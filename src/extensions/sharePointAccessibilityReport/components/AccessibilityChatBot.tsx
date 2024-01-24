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
                <header id="webchatHeader" className={styles.webchatHeader} hidden={this.state.showChatBot}>
                    <div className={styles.webchatHeaderfiller}>
                        <h4 className={styles.webchatHeaderText}>Web Accessibility ChatBot</h4>
                    </div>
                </header>
                <div id="webchat" role="main" className={styles.webchat}>
                </div>
            </div>
        );
    }
}  
