import React, { Component } from 'react';
import {
    TextInput,
    Box,
    Button,
    Table,
    TableHeader,
    TableRow,
    TableCell,
    TableBody,
} from 'grommet';
import {
    Notification,
    Send,
    MailOption,
    Refresh,
} from 'grommet-icons';
import ReactTable from 'react-table';
import 'react-table/react-table.css'
import {TableData} from './data';
import RequestModal from './RequestModal';
import axios from 'axios';
const columns = [{
    Header: "id",
    accessor: "id",
},{
    Header: "Tên người dùng",
    accessor: "title"
},{
    Header: "ID người dùng",
    accessor: "userID",
},{
    Header: "Mệnh giá",
    accessor: "price"
},{
    Header: "Nhà mạng",
    accessor: "carrier",
},{
    Header: "Tình trạng",
    accessor: "request_status"
},{
    Header: "Báo cáo",
    accessor: "report"
}]


class Requests extends Component {
    constructor(){
        super()
        this.state={
            selected: null,
            modalIsOpen: false,
            data: [],
            buttonDisabled: false,
        }
        this.fetchRequests()
    }

    fetchRequests = () => {
        this.setState({
            buttonDisabled: true
        })
        axios.get("https://baomoi.press/wp-json/wp/v2/cardrequest")
        .then(res => {
            const data = res.data.map((request, index) => {
                return {
                    id: request.id,
                    title: request.title.rendered,
                    price: request.acf.price,
                    carrier: request.acf.carrier,
                    userID: request.acf.userID,
                    request_status: request.acf.request_status,
                    report: request.acf.report,
                }
            })
            this.setState({
                data: data,
                buttonDisabled: false
            })
        })
        .catch(err => console.log(err))
    }

    // fetchMoreRequests = () => {
    //     axios.get("https://baomoi.press/wp-json/wp/v2/cardrequest")
    //     .then(res => {
    //         const data = res.data.map((request, index) => {
    //             return {
    //                 id: request.id,
    //                 title: request.title.rendered,
    //                 price: request.acf.price,
    //                 carrier: request.acf.carrier,
    //                 userID: request.acf.userID,
    //                 request_status: request.acf.request_status,
    //                 report: request.acf.report,
    //             }
    //         })
    //         this.setState({
    //             data: data
    //         })
    //     })
    //     .catch(err => console.log(err))
    // }

    openModal = () => {
        this.setState({modalIsOpen: true});
    }

    afterOpenModal = () => {
    // references are now sync'd and can be accessed.

    }

    closeModal = () => {
        this.setState({modalIsOpen: false});
        this.fetchRequests()
    }

    render() {
        return (
            <Box pad="medium" background="white" fill={true}>
                <Box pad="medium" direction="row" gap="small" align="center" justify="between">
                    <Box direction="row" gap="small" align="center">
                        <MailOption/>
                        <h1>Yêu cầu đổi thẻ</h1>
                    </Box>
                    <Box
                    >

                        <Button
                            label="Tải lại"
                            icon={<Refresh/>}
                            onClick={this.fetchRequests}
                            disabled={this.state.buttonDisabled}
                        />
                    </Box>
                </Box>
                <Box pad="medium">
                    <ReactTable
                        data={this.state.data}
                        resolveData={data => data.map(row => row)}
                        columns={columns}
                        defaultPageSize={10}
                        filterable={true}
                        pageSizeOptions={[5,10,15]}
                        sortable={true}
                        getTrProps={(state, rowInfo) => {
                            if (rowInfo && rowInfo.row) {
                                return {
                                    onClick: (e) => {
                                        this.setState({
                                            selected: rowInfo,
                                            isModalOpen: true,
                                        }, () => this.openModal())
                                    },
                                }
                            }else{
                                return {};
                            }
                        }}
                    />
                </Box>
                <Box>
                    {this.state.modalIsOpen &&
                        <RequestModal
                            modalIsOpen={this.state.modalIsOpen}
                            openModal={this.openModal}
                            afterOpenModal={this.afterOpenModal}
                            closeModal={this.closeModal}
                            data={this.state.selected}
                        />
                    }
                </Box>
            </Box>
        );
    }

}


export default Requests;
