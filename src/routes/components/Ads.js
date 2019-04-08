import React, { Component } from 'react';
import {
    Box,
    FormField,
    TextInput,
    Button,
} from 'grommet';
import {
    Ad,
} from 'grommet-icons';
class Ads extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title: ""
        }
    }

    render() {
        return (
            <Box pad="medium" background="white" fill={true}>
                <Box pad="medium" direction="row" gap="small" align="center" justify="between">
                    <Box direction="row" gap="small" align="center">
                        <Ad/>
                        <h1>Quản lý quảng cáo</h1>
                    </Box>
                </Box>
                <Box pad="medium">
                    <Box width="large">
                        <TextInput
                            placeholder="tiêu đề"
                            focusIndicator="true"
                            size="small"
                            value={this.state.title}
                            onChange={(e) => this.setState({title: e.target.value})}
                        />
                    </Box>
                </Box>
            </Box>
        );
    }

}

export default Ads;
