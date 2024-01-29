import * as React from "react";
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import styles from "./AccessibilityReport.module.scss";

export interface IChatBotProps {
    onclickHandler: () => void
}

export interface IChatBotState {
}

export class AccessibilityChatBotButton extends React.Component<IChatBotProps, IChatBotState> {

    constructor(props: IChatBotProps) {
        super(props);
    }

    public render(): React.ReactElement<IChatBotProps> {
        return (
            <PrimaryButton
                onClick={this.props.onclickHandler}
                secondaryText="Opens the Chatbot Dialog"
                text="Accessibilty Chatbot"
                id="ShowAccessibilityBot"
                iconProps={{ iconName: "View" }}
                className={styles.chatbotMainButton}
            />
        );
    }
}  