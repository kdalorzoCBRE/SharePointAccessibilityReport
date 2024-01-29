import * as React from "react";
import * as ReactWebChat from 'botframework-webchat';
import styles from "./AccessibilityReport.module.scss";


export interface IChatBotProps {
    showChatBot: boolean;
    runID: string;
}

export interface IChatBotState {
}

export class AccessibilityChatBot extends React.Component<IChatBotProps, IChatBotState> {

    constructor(props: IChatBotProps) {
        super(props);
    }

    public render(): React.ReactElement<IChatBotProps> {
        console.log("Accessibility chat bot render: " + this.props.showChatBot)

        var element = document.getElementById("webchat");
        if (this.props.showChatBot) {
            if (element) {
                element.style.visibility = "visible";
            }
            setTimeout(() => {
                this.getChatBot();
            }, 1000)
        } else {
            if (element) {
                element.style.visibility = "hidden";
            }
        }
        return (
            <div id="webchatContainer" className={styles.webchatContainer} style={{ visibility: this.props.showChatBot ? 'visible' : 'hidden' }}>
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


    public getChatBot() {
        // TODO move constants out of here
        const BOT_ID = "0f91255c-ba4a-4892-8a8d-745ccab7d2fa"
        const theURL = "https://powerva.microsoft.com/api/botmanagement/v1/directline/directlinetoken?botId=" + BOT_ID;
        const RUNID = this.props.runID

        const store = ReactWebChat.createStore({}, function (store: any) {
            return function (next: any) {
                return function (action: any) {
                    if (action.type === 'DIRECT_LINE/CONNECT_FULFILLED') {
                        store.dispatch({
                            type: "DIRECT_LINE/POST_ACTIVITY",
                            meta: {
                                method: "keyboard",
                            },
                            payload: {
                                activity: {
                                    channelData: {
                                        postBack: true,
                                    },
                                    name: 'startConversation',
                                    type: "event"
                                },
                            }
                        })

                        store.dispatch(
                            {
                                type: "WEB_CHAT/SEND_EVENT",
                                payload: {
                                    name: "pvaSetContext",
                                    value: {
                                        "RunID": RUNID
                                    }
                                }
                            }
                        )
                    }
                    return next(action);
                }
            }
        });

        const styleOptions = {
            bubbleBackground: 'rgba(0, 0, 255, .1)',
            bubbleFromUserBackground: 'rgba(0, 255, 0, .1)'
        };

        var element = document.getElementById("webchat");

        if (element && this.props.showChatBot) {
            console.log("Element found!")
            element.style.visibility = "visible";
            fetch(theURL)
                .then(response => response.json())
                .then(conversationInfo => {
                    ReactWebChat.renderWebChat(
                        {
                            directLine: ReactWebChat.createDirectLine({
                                token: conversationInfo.token,
                            }),
                            store: store,
                            styleOptions: styleOptions
                        },
                        document.getElementById('webchat')
                    );
                })
                .catch(err => console.log("An error occurred when loading the bot: " + err));
        }
        else {
            console.log("could not find element or show chatbot is not visible")
        }
    }
}  
