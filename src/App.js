import React from "react";
import {
    BrowserRouter as Router,
    Route,
    Link,
    Switch,
    Redirect
} from "react-router-dom";
import Home from './routes/Home';
import Login from './routes/Login';
import NoMatch from './routes/components/NoMatch';
import axios from 'axios';



export default class AppRouter extends React.Component {
    constructor(){
        super()
        this.state={
            logedIn: false
        }
        this.checkLogedin()
    }

    checkLogedin = () => {
        let token = localStorage.getItem("token")
        if(token){
            axios({
                method: "POST",
                url: 'https://baomoi.press/wp-json/jwt-auth/v1/token/validate',
                headers: {'Authorization': 'Bearer ' + token},
            })
            .then(res => {
                if(res.status == 200){
                    this.setState({
                        logedIn: true,
                    })
                }else{
                    localStorage.clear()
                    this.setState({
                        logedIn: false
                    })
                }
            })
            .catch(err => console.log(err))
        }
    }

    render(){
        return(
            <Router>
                <Switch>
                    <Route
                        exact path="/"
                        render={() => (localStorage.getItem("token"))?
                            <Redirect to="/home/dashboard"/> :
                            <Redirect to="/login"/>
                        }
                    />
                    <Route
                        path='/home'
                        component={Home}
                    />
                    <Route path='/login' component={Login}/>
                    <Route component={NoMatch} />
                </Switch>
            </Router>

        )
    }


}
