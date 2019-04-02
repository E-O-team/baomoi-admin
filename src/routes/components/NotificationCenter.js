import React from 'react';
import Expo from 'expo-server-sdk';
import {
    TextInput,
    Box,
    Button,
    TextArea,
} from 'grommet';
import {
    Notification,
    Send
} from 'grommet-icons';
import axios from 'axios';
class NotificationCenter extends React.Component {

    constructor(props){
        super(props)
        this.state={
            tokens: [
                "ExponentPushToken[m46rkzF63XLq2XmZWUM4RC]",
                "ExponentPushToken[JwBUKJFRaChI9kXzh13Etc]"
            ],
            title: "",
            body: "",
            url: "",
            slug: "",
            status: "",
            postID: "",
        }
    }

    // getTokens = () => {
    //
    // }

    checkNoti = async() => {
        const {title, body, url, slug, postID} = this.state
        if(title == "" || body == "" || url == "" || slug == "" || postID == ""){
            // Check if all fields are filled
            alert("vui lòng điền tất cả các trường")
            return
        }else{
            // Create a new Expo SDK client
            let expo = new Expo();

            // Create the messages that you want to send to clents
            let messages = [];
            for (let pushToken of this.state.tokens) {
                // Each push token looks like ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]

                // Check that all your push tokens appear to be valid Expo push tokens
                if (!Expo.isExpoPushToken(pushToken)) {
                    console.error(`Push token ${pushToken} is not a valid Expo push token`);
                    continue;
                }

                // Construct a message (see https://docs.expo.io/versions/latest/guides/push-notifications.html)
                messages.push({
                    to: pushToken,
                    sound: 'default',
                    title: this.state.title,
                    body: this.state.body,
                    data: {postID: this.state.postID}
                })
            }

            let chunks = expo.chunkPushNotifications(messages);
            let tickets = [];
            (async () => {
              // Send the chunks to the Expo push notification service. There are
              // different strategies you could use. A simple one is to send one chunk at a
              // time, which nicely spreads the load out over time:
              for (let chunk of chunks) {
                try {
                  let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
                  console.log(ticketChunk);
                  tickets.push(...ticketChunk);
                  // NOTE: If a ticket contains an error code in ticket.details.error, you
                  // must handle it appropriately. The error codes are listed in the Expo
                  // documentation:
                  // https://docs.expo.io/versions/latest/guides/push-notifications#response-format
                } catch (error) {
                  console.error(error);
                }
              }
            })();
        }


    }

    handleSendNoti = async() => {
        this.checkNoti()
    }

    render() {

        return (
            <Box
                background="white"
                fill={true}
                pad="medium"
            >
                <Box direction="row" align="center" gap="small">
                    <Notification color="brand"/>
                    <h1>Tạo thông báo bài viết</h1>
                </Box>
                <Box pad="large" gap="medium" >
                    <Box width="large">
                        <TextInput
                            placeholder="tiêu đề"
                            focusIndicator="true"
                            size="small"
                            value={this.state.title}
                            onChange={(e) => this.setState({title: e.target.value})}
                        />
                    </Box>
                    <Box height="medium">
                        <TextArea
                            fill={true}
                            placeholder="body"
                            value={this.state.body}
                            onChange={event => this.setState({body: event.target.value})}
                        />
                    </Box>

                    <Box width="large">
                        <TextInput
                            placeholder="url ảnh"
                            focusIndicator="true"
                            size="small"
                            value={this.state.url}
                            onChange={(e) => this.setState({url: e.target.value})}
                        />

                    </Box>
                    <Box direction="row" align="center" justify="between">
                        <Box width="large">
                            <TextInput
                                placeholder="slug"
                                focusIndicator="true"
                                size="small"
                                value={this.state.slug}
                                onChange={(e) => {
                                    this.setState({
                                        slug: e.target.value,
                                        status: "loading..."
                                    }, () => {
                                        if(this.state.slug == ""){
                                            this.setState({status: ""})
                                        }else{
                                            axios.get("https://baomoi.press/wp-json/wp/v2/posts?slug=" + this.state.slug)
                                            .then(res => {
                                                if(res.data[0]){
                                                    this.setState({
                                                        status: "ok!",
                                                        postID: res.data[0].id,
                                                    })
                                                }else{
                                                    this.setState({status: "not ok"})
                                                }
                                            })
                                            .catch(err => this.setState({status: "not ok"}))
                                        }
                                    })

                                }}
                            />
                        </Box>

                            <h2>{this.state.status}</h2>

                    </Box>
                    <Box align="end" >
                        <Box width="small">
                            <Button
                                onClick={this.checkNoti}
                                label="gửi"
                                icon={<Send/>}
                                color="brand"
                                type="submit"
                                primary={true}
                            />
                        </Box>
                    </Box>
                </Box>
            </Box>);
    }

}

export default NotificationCenter;
