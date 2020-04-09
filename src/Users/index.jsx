import React, { Component } from 'react';
import axios from 'axios';
import { loadData } from '../API_Requests/basic';
import UserDetail from './UserDetail';
import Navbar from '../Navbar'

class Users extends Component {
    state = {
        users: []
    }

    componentDidMount() {
        this.onLoadAllUsers();
    }

    async onLoadAllUsers() {
        try {
            const res = await loadData('users');
            const aaa = res.data.map(user => <UserDetail data={user}/>)
            console.log('aaa', aaa)
            this.setState({
                users: res.data,
            });
            console.log(res.data)
        } catch (err) {
            console.log(err)
            if (axios.isCancel(err)) {
                return;
            }
        }
    }
    render() {
        const { users } = this.state;
        return (
            <div>
                <Navbar />
                {users.map(user => <UserDetail data={user} key={user.id}/>)}
            </div>
        );
    }
}

export default Users;
