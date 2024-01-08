import * as React from "react";
import * as ReactWebChat from 'botframework-webchat';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';

export interface IChatBotProps {
    onclickHandler: () => void
    runID: string;
}

export interface IChatBotState {
}

export class AccessibilityChatBotButton extends React.Component<IChatBotProps, IChatBotState> {

    constructor(props: IChatBotProps) {
        super(props);
    }

    componentDidMount(): void {
        setTimeout(() => {
            this.getChatBot();
        }, 1000)
    }

    public render(): React.ReactElement<IChatBotProps> {
        return (
            <PrimaryButton
                onClick={this.props.onclickHandler}
                secondaryText="Opens the Chatbot Dialog"
                text="Accessibilty Chatbot"
                id="ShowAccessibilityBot"
                iconProps={{ iconName: "View" }}
            />
        );
    }

    private getChatBot() {
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


        fetch(theURL)
            .then(response => response.json())
            .then(conversationInfo => {
                ReactWebChat.renderWebChat(
                    {
                        directLine: ReactWebChat.createDirectLine({
                            token: conversationInfo.token,
                        }),
                        store: store
                    },
                    document.getElementById('webchat')
                );
            })
            .catch(err => console.log("An error occurred when loading the bot: " + err));

    }
}  