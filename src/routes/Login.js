import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import {
    Grommet,
    Button,
    Heading,
    Box,
    ResponsiveContext,
    Collapsible,
    Layer,
    TextInput,
    FormField
} from 'grommet';
import axios from 'axios';
const theme = {
    global: {
        colors: {
            brand: '#A1E2DC',
            secondBrand: "#639999"
        },
        font: {
            family: 'Roboto',
            size: '14px',
            height: '20px',
        },
    },
};

const AppBar = (props) => (
   <Box
       tag="header"
       direction="row"
       align="center"
       justify="between"
       background="brand"
       pad={{ left: 'medium', right: 'small', vertical: 'small' }}
       elevation='medium'
       style={{ zIndex: '1' }}
       {...props}
   />
)


export default class Login extends React.Component {

    constructor(props){
        super(props)
        this.state={
            token: "",
            logedIn: false,
            username: "",
            password: "",
        }
    }

    handleClick = () => {
        console.log(this.state);
        axios.post('https://baomoi.press/wp-json/jwt-auth/v1/token', {
            username: this.state.username,
            password: this.state.password,
        })
        .then(res => {
            localStorage.setItem("token", res.data.token)
            localStorage.setItem("user", res.data.user_display_name)
            this.setState({
                logedIn: true
            })
        })
        .catch(err => console.log(err))


    }

    handleChange = (event) => {
        this.setState({
            [event.target.id]: event.target.value
        })
    }




    render(){
        return(
            <Grommet theme={theme} full>
                <ResponsiveContext.Consumer>
                    {size => (
                        <Box fill>
                            {this.state.logedIn && <Redirect to="/"/>}
                            <AppBar>
                                <Heading level='3' margin='none'>Baomoi-press</Heading>
                            </AppBar>
                            <Box pad="medium" align="center" justify="center" background="true" fill={true} >
                                <Box width="medium" height="medium" pad="medium" gap="medium" background="white">
                                    <h1>LOGIN</h1>
                                    <FormField label="Tài khoản">
                                        <TextInput
                                            id="username"
                                            placeholder="Nhập vào đây"
                                            value={this.state.username}
                                            onChange={this.handleChange}
                                        />
                                    </FormField>
                                    <FormField label="Mật khẩu">
                                        <TextInput
                                            id="password"
                                            placeholder="Nhập vào đây"
                                            value={this.state.password}
                                            onChange={this.handleChange}
                                        />
                                    </FormField>
                                    <Button
                                        label="Enter"
                                        onClick={this.handleClick}
                                    />
                                </Box>
                            </Box>
                        </Box>
                    )}
                </ResponsiveContext.Consumer>

            </Grommet>
        )
    }
};
