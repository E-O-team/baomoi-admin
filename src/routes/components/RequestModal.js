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
            buttonLabel: "gửi"
        };

    }

    sendUserNoti = (userID) => {
        axios.get("https://baomoi.press/wp-json/acf/v3/users/" + userID + "/deviceToken")
        .then(res => {
            const deviceToken = res.data.deviceToken;
            this.checkNoti(deviceToken)
        })
        .catch(err => console.log(err))
    }

    checkNoti = (deviceToken) => {
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
                title: "Yêu cầu đổi thẻ đã được duyệt!",
                body: "Hãy vào ngay mục lịch sử đổi thẻ để nhận thẻ",
                data: { withSome: 'data' },
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

    handleSend = () => {
        this.setState({buttonLabel: "loading..."})
        const {id, userID} = this.props.data.original
        this.sendUserNoti(userID)
        const data = new FormData()
        data.append("fields[card_code]", this.state.code)
        data.append("fields[request_status]", "đã duyệt")
        data.append("fields[series_number]", this.state.series_number)
        axios({
            method: "POST",
            url: 'https://baomoi.press/wp-json/acf/v3/cardrequest/' + id,
            headers: {'Authorization': 'Bearer ' + this.state.token},
            data: data
        })

        .then(res => {
            if(res.status == 200){
                this.setState({
                    buttonLabel: "đã xong"
                })
            }
        })
        .catch(err => console.log(err))
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
                        pad="medium"
                    >
                        <FormField label="Xác nhận yêu cầu đổi thẻ"></FormField>
                        <Box pad="medium" gap="small">
                            <Box direction="row">
                                <FormField label="ID giao dịch">
                                    <TextInput value={id} ></TextInput>
                                </FormField>
                                <FormField label="ID người dùng">
                                    <TextInput value={userID} ></TextInput>
                                </FormField>
                            </Box>
                            <FormField label="Mệnh giá">
                                <TextInput value={price} ></TextInput>
                            </FormField>
                            <FormField label="Nhà mạng">
                                <TextInput value={carrier} ></TextInput>
                            </FormField>
                            <FormField label="Báo cáo">
                                <TextInput value={report} ></TextInput>
                            </FormField>
                            <FormField label="Mã thẻ cào">
                                <TextInput value={this.state.code} onChange={(e) => this.setState({code: e.target.value})} ></TextInput>
                            </FormField>
                            <FormField label="Số seri">
                                <TextInput value={this.state.series_number} onChange={(e) => this.setState({series_number: e.target.value})} ></TextInput>
                            </FormField>
                            <Box pad="medium" align="end">
                                <Button label={this.state.buttonLabel} color="brand" onClick={this.handleSend}/>
                            </Box>


                        </Box>


                    </Box>
                </Modal>
            </Box>

        );
    }
}


export default RequestModal;
