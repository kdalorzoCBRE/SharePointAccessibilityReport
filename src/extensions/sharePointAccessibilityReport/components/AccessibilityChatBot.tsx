import * as React from "react";
import styles from "./AccessibilityReport.module.scss";

export interface IChatBotProps {
    showChatBot: boolean
}

export interface IChatBotState {
}

export class AccessibilityChatBot extends React.Component<IChatBotProps, IChatBotState> {

    constructor(props: IChatBotProps) {
        super(props);
    }

    public render(): React.ReactElement<IChatBotProps> {
        console.log("Accessibility chat bot render: " + this.props.showChatBot)
        if (this.props.showChatBot) {
            return (
                <div id="webchatContainer" className={styles.webchatContainer}>
                    <header id="webchatHeader" className={styles.webchatHeader}>
                        <div className={styles.webchatHeaderfiller}>
                            <h4 className={styles.webchatHeaderText}>Web Accessibility ChatBot</h4>
                        </div>
                    </header>
                    <div id="webchat" role="main" className={styles.webchat}>
                    </div>
                </div>
            );
        }
        return (<div></div>)
    }
}  
