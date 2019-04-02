import React from 'react';
import { Redirect, NavLink, Route } from "react-router-dom";
import Requests from './components/Requests';
import Ads from './components/Ads';
import DashboardMenu from './components/DashboardMenu';
import NotificationCenter from './components/NotificationCenter';
import PropTypes from 'prop-types'
import './components/styles/Home.css'
import {
    Grommet,
    Button,
    Heading,
    Box,
    ResponsiveContext,
    Collapsible,
    Layer
} from 'grommet';
import {
    Notification,
    FormClose,
    Dashboard,
    Ad,
    MailOption,
    Logout
} from 'grommet-icons';

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
    button:{
        disabled: {
            opacity: 0.5,
        }
    }
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

NavLink.contextTypes = {
    router: PropTypes.object
};

export default class Home extends React.Component {

    constructor(){
        super()
        this.state = {
            logedIn: true,
            showSidebar: false,
        }

    }

    // handleLogin = (token) => {
    //     console.log(token);
    //     // this.setState({logedIn: true})
    // }


    handleLogout = () => {
        localStorage.clear()
        this.setState({
            logedIn: false
        })

    }



    render() {
        const {
            showSidebar
        } = this.state;
        // var isActive = this.context.router.route.location.pathname === this.props.to;
        // console.log(this.context);
        console.log(this.props.location.pathname);
        return (
            <Grommet theme={theme} full>
                <ResponsiveContext.Consumer>
                    {size => (
                        <Box fill>
                            {(!this.state.logedIn) && <Redirect to="/"/>}
                            <AppBar>
                                <Heading level='3' margin='none'>Baomoi-press</Heading>
                                <Button
                                    icon={<Notification />}
                                    onClick={() => this.setState(prevState => ({ showSidebar: !prevState.showSidebar }))}
                                />
                            </AppBar>
                            <Box direction='row' flex overflow={{ horizontal: 'hidden' }}>
                                <Box flex pad="medium" background="light-3">
                                  <Route path='/home/dashboard' component={DashboardMenu}/>
                                  <Route path='/home/ads' component={Ads}/>
                                  <Route path='/home/requests' component={Requests}/>
                                  <Route path='/home/noti' component={NotificationCenter}/>
                                </Box>
                                {(!showSidebar || size !== 'small') ? (
                                    <Collapsible direction="horizontal" open={showSidebar}>
                                        <Box
                                            flex
                                            width='medium'
                                            background="secondBrand"
                                            elevation='small'
                                            align='baseline'
                                            justify='between'
                                            pad="medium"
                                            gap="medium"
                                        >
                                        <Box gap="medium">
                                            <Box
                                                direction="row"
                                                gap = "small"
                                                align= "center"
                                            >
                                                {(this.props.location.pathname == "/home/dashboard") &&
                                                    <Dashboard color="white"/>
                                                    ||
                                                    <Dashboard color="#2c2d3e"/>
                                                }
                                                <NavLink to="/home/dashboard" className="sidebar-nav" activeClassName="sidebar-selected">Dashboard</NavLink>
                                            </Box>
                                            <Box
                                                direction="row"
                                                gap = "small"
                                                align= "center"
                                            >
                                                {(this.props.location.pathname == "/home/ads") &&
                                                    <Ad color="white"/>
                                                    ||
                                                    <Ad color="#2c2d3e"/>
                                                }
                                                <NavLink to="/home/ads" className="sidebar-nav" activeClassName="sidebar-selected">Ads</NavLink>
                                            </Box>
                                            <Box
                                                direction="row"
                                                gap = "small"
                                                align= "center"
                                            >
                                                {(this.props.location.pathname == "/home/requests") &&
                                                    <MailOption color="white"/>
                                                    ||
                                                    <MailOption color="#2c2d3e"/>
                                                }
                                                <NavLink to="/home/requests" className="sidebar-nav" activeClassName="sidebar-selected">Requests</NavLink>
                                            </Box>
                                            <Box
                                                direction="row"
                                                gap = "small"
                                                align= "center"
                                            >
                                                {(this.props.location.pathname == "/home/noti") &&
                                                    <Notification color="white"/>
                                                    ||
                                                    <Notification color="#2c2d3e"/>
                                                }
                                                <NavLink to="/home/noti" className="sidebar-nav" activeClassName="sidebar-selected">Notification Center</NavLink>
                                            </Box>
                                        </Box>
                                        <Box>
                                            <Box
                                                direction="row"
                                                gap = "small"
                                                align= "center"
                                            >
                                                <Button
                                                    color="red"
                                                    icon={<Logout color="#2c2d3e"/>}
                                                    label="Logout"
                                                    onClick={this.handleLogout}
                                                />
                                            </Box>
                                        </Box>
                                        </Box>
                                    </Collapsible>
                            ) : (
                                <Layer>
                                    <Box
                                        background="light-2"
                                        tag="header"
                                        justify="end"
                                        align="center"
                                        direction="row"
                                    >
                                        <Button
                                            icon={<FormClose/>}
                                            onClick={() => this.setState({ showSidebar: false })}
                                        />
                                    </Box>
                                    <Box
                                        fill
                                        background="light-2"
                                        align="center"
                                        justify="center"
                                    >
                                        sidebar
                                    </Box>
                                </Layer>
                              )}
                            </Box>
                        </Box>
                    )}
                </ResponsiveContext.Consumer>
            </Grommet>


        )
    }
};
