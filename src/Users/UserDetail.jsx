import React, { Component } from 'react';
import { loadData } from '../API_Requests/basic';
import axios from 'axios';
import {
    Card, CardContent,
} from '@material-ui/core';
import Navbar from '../Navbar'

class UserDetail extends Component {
    state = {
        bio: "",
        date_joined: null,
        date_of_birth: null,
        email: "",
        first_name: "",
        id: null,
        last_name: "",
        location: null,
        phone_number: "",
        privacy_settings: null,
        social_media_links: [],
        username: "",
        detail: true,
    }

    componentDidMount() {
        const { data, match } = this.props;
        if (match) {
            this.onLoadUser(match.url);
        }
        if (data) {
            this.setState({ ...data, detail: false });
        }        
    }

    onLoadUser = async (url) => {
        try {
            const res = await loadData(url);
            this.setState({ ...res.data, detail: true })
        } catch (err) {
            console.log(err)
            if (axios.isCancel(err)) {
                return;
            }
        }
    }

    getLinksList = (links) => {
        return (
            <ul>
                {links.map(link => <li key={link}><a href={link}> { link } </a></li>)}
            </ul>
        )
    }

    render() {
        const { 
            bio, date_joined, date_of_birth, email,
            first_name, id, last_name, location, phone_number,
            privacy_settings, social_media_links, username, detail 
        } = this.state;
        return (
            <div>
            {detail && <Navbar />}         
                <div style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    alignContent: 'center',
                    justifyContent: 'center',
                    overflow: 'auto',
                }}>
                    <Card style={{ margin: '10px' }}>
                        <CardContent>
                            <p> <a href={`/users/${id}`}>{ `${username}` } </a></p>
                            <p> { `${first_name} ${last_name}` } </p>
                            <p> { `Дата рождения: ${date_of_birth || 'не указано'}` } </p>
                            <p> { `О себе: ${bio || 'не указано'}` } </p>
                            <p> { `Место: ${location || 'не указано'}` } </p>
                            <div>
                                Контактная информация:
                                <ul>
                                    <li>
                                        Ссылки в социальных сетях:
                                        {
                                            social_media_links ?
                                            (
                                                this.getLinksList(social_media_links)
                                            ) : ' не указано'
                                        }
                                    </li>
                                    <li> Номер телефона: {phone_number} </li>
                                    <li> Электронная почта: <a href={`mailto:${email}`}> {email} </a></li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>  
        );
    }
}

export default UserDetail;
