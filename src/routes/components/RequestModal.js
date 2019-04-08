import React, { Component } from 'react';
import Modal from 'react-modal';
import {
    Box,
    FormField,
    TextInput,
    Button,
} from 'grommet';
import Expo from 'expo-server-sdk';
import axios from 'axios';
const customStyles = {
    content : {
        height: "550px",
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)'
    }
};
Modal.setAppElement('#root');

class RequestModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalIsOpen: this.props.modalIsOpen,
            data: this.props.data,
            code: "",
            series_number: "",
            token: localStorage.getItem("token"),
            sendButtonLabel: "duyệt",
            refuseButtonLabel: "từ chối"
        };

    }

    sendUserNoti = (userID, action) => {
        axios.get("https://baomoi.press/wp-json/acf/v3/users/" + userID + "/deviceToken")
        .then(res => {
            const deviceToken = res.data.deviceToken;
            this.checkNoti(deviceToken, action)
        })
        .catch(err => console.log(err))
    }

    checkNoti = (deviceToken, action) => {
        console.log(action);
        if(action == "duyệt"){
            var title = "Yêu cầu đổi thẻ đã được duyệt!"
            var body = "Hãy vào ngay mục lịch sử đổi thẻ để nhận thẻ"
        }else if (action == "từ chối") {
            var title = "Yêu cầu đổi thẻ đã bị từ chối!"
            var body = "Yêu cầu của bạn đã bị từ chối do vi phạm điều khoản thanh toán của chúng tôi"
        }
        // Create a new Expo SDK client
        let expo = new Expo();

        // Create the messages that you want to send to clents
        let messages = [];
        for (let pushToken of [deviceToken]) {
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
                priority: "default",
                title: title,
                body: body,
                data: {
                    title: title,
                    body: body,
                },
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

    handleSend = (action) => {
        const {code, series_number} = this.state
        // ACCEPT REQUESTS
        if(action == "duyệt"){
            if(code !== "" && series_number!== ""){
                this.setState({sendButtonLabel: "loading..."})
                const {id, userID} = this.props.data.original
                this.sendUserNoti(userID, action)
                const data = new FormData()
                data.append("fields[card_code]", this.state.code)
                data.append("fields[request_status]", "đã duyệt")
                data.append("fields[series_number]", this.state.series_number)
                data.append("status", "publish")
                axios({
                    method: "POST",
                    url: 'https://baomoi.press/wp-json/acf/v3/cardrequest/' + id,
                    headers: {'Authorization': 'Bearer ' + this.state.token},
                    data: data
                })

                .then(res => {
                    if(res.status == 200){
                        this.setState({
                            sendButtonLabel: "đã xong"
                        })
                    }
                })
                .catch(err => console.log(err))
            }else{
                alert("Xin hãy điền tất cả các trường!")
            }

        }else if (action == "từ chối") {
            this.setState({refuseButtonLabel: "loading..."})
            const {id, userID} = this.props.data.original
            this.sendUserNoti(userID, action)
            const data = new FormData()
            data.append("fields[request_status]", "Bị từ chối")
            axios({
                method: "POST",
                url: 'https://baomoi.press/wp-json/acf/v3/cardrequest/' + id,
                headers: {'Authorization': 'Bearer ' + this.state.token},
                data: data
            })

            .then(res => {
                if(res.status == 200){
                    this.setState({
                        refuseButtonLabel: "đã xong"
                    })
                }
            })
            .catch(err => console.log(err))
        }

    }


    render() {
        const {openModal, closeModal, afterOpenModal, data} = this.props
        const {carrier, id, price, report, status, userID,} = data.original
        return (
            <Box>
                <Modal
                    isOpen={this.state.modalIsOpen}
                    onAfterOpen={afterOpenModal}
                    onRequestClose={closeModal}
                    style={customStyles}
                    contentLabel="Example Modal"
                >
                    <Box
                        pad="small"
                    >
                        <FormField label="Xác nhận yêu cầu đổi thẻ"></FormField>
                        <Box pad="medium" gap="xsmall">
                            <Box direction="row">
                                <FormField label="ID giao dịch">
                                    <TextInput value={id} ></TextInput>
                                </FormField>
                                <FormField label="ID người dùng">
                                    <TextInput value={userID} ></TextInput>
                                </FormField>
                            </Box>
                            <Box direction="row">
                                <FormField label="Mệnh giá">
                                    <TextInput value={price} ></TextInput>
                                </FormField>
                                <FormField label="Nhà mạng">
                                    <TextInput value={carrier} ></TextInput>
                                </FormField>
                            </Box>
                            <FormField label="Mã thẻ cào">
                                <TextInput value={this.state.code} onChange={(e) => this.setState({code: e.target.value})} ></TextInput>
                            </FormField>
                            <FormField label="Số seri">
                                <TextInput value={this.state.series_number} onChange={(e) => this.setState({series_number: e.target.value})} ></TextInput>
                            </FormField>
                            <Box pad="medium" gap="medium" align="end" direction="row">
                                <Button label={this.state.sendButtonLabel} color="brand" onClick={() => this.handleSend("duyệt")}/>
                                <Button label={this.state.refuseButtonLabel} color="brand" onClick={() => this.handleSend("từ chối")}/>
                            </Box>


                        </Box>


                    </Box>
                </Modal>
            </Box>

        );
    }
}


export default RequestModal;
