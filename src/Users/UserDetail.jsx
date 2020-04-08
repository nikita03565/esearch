import React, { Component, Fragment } from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import { loadData } from '../API_Requests/basic';
import axios from 'axios';
import {
    Card, CardContent, Button, TextField
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
        editing: false,
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
            console.log(res.data)
            this.setState({ ...res.data, detail: true })
        } catch (err) {
            console.log(err)
            if (axios.isCancel(err)) {
                return;
            }
        }
    }
    onEditButtonClick = () => {
        const { editing } = this.state;
        if (editing) {
            // send patch
            this.setState({ editing: false })
        } else {
            this.setState({ editing: true })
        }
    }

    getContactInfo = () => {
        const { social_media_links, phone_number, email} = this.state;
        return (
            <div>
                Контактная информация:
                <ul>
                    <li>
                        Ссылки в социальных сетях:
                        {
                            social_media_links ?
                            (
                                <ul>
                                    {social_media_links.map(link => <li key={link.id}><a href={link.link}> { link.link } </a></li>)}
                                </ul>
                            ) : ' не указано'
                        }
                    </li>
                    <li> Номер телефона: {phone_number} </li>
                    <li> Электронная почта: <a href={`mailto:${email}`}> {email} </a></li>
                </ul>
            </div>
        )
    }

    getContactInfoEdit = () => {
        const { social_media_links, phone_number, email} = this.state;
        return (
            <div>
                Контактная информация:
                <ul>
                    <li>
                        Ссылки в социальных сетях:
                        {
                            social_media_links ?
                            (
                                <Fragment>
                                    <ul>
                                        {social_media_links.map(link => (
                                            <div key={link.id} style={{ width: '700px'}}>
                                            <li style={{width: '500px', display: 'inline-block'}}>
                                                <TextField
                                                    label="Ссылка"
                                                    value={link.link}
                                                    fullWidth
                                                    onChange={e => this.handleChangeLink(e, link.id)}
                                                />
                                            </li>
                                            <Button
                                                onClick={e => this.onDeleteLink(e, link.id)}
                                            > 
                                                <DeleteIcon />
                                            </Button>
                                            </div>
                                            ))
                                        }
                                        <Button
                                            onClick={this.onAddLink}
                                        > 
                                            <AddIcon />
                                        </Button>
                                    </ul>
                                </Fragment>
                            ) : ' не указано' // add, delete
                        }
                    </li>
                    <li> 
                        <TextField
                            label="Телефон"
                            value={phone_number}
                            onChange={e => this.handleChange(e, 'phone_number')}
                        />
                    </li>
                    <li> 
                        <TextField
                            label="Электронная почта"
                            value={email}
                            onChange={e => this.handleChange(e, 'email')}
                        />
                    </li>
                </ul>
            </div>
        )
    }

    onAddLink = () => {
        const { social_media_links } = this.state;
        const [last] = social_media_links.slice(-1);
        const newId = last ? last.id + 1 : 0;
        const new_links = [...social_media_links, {id: newId, link: ''}]
        this.setState({ social_media_links: new_links })
    }

    onDeleteLink = (e, id) => {
        const { social_media_links } = this.state;
        const newLinks = social_media_links.filter(link => link.id !== id);
        this.setState({ social_media_links: newLinks })
    }

    handleChange = (e, field) => {
        this.setState({ [field]: e.target.value })
    }

    handleChangeLink = (e, id) => {
        const { social_media_links } = this.state;
        const newLinks = social_media_links.map(linkObj => {
            if (linkObj.id === id) {
                return {...linkObj, link: e.target.value};
            }
            return linkObj;
        });
        this.setState({ social_media_links: newLinks })
    }

    render() {
        const { 
            bio, date_joined, date_of_birth, email,
            first_name, id, last_name, location, phone_number,
            privacy_settings, social_media_links, username, 
            detail, editing
        } = this.state;
        const authId = localStorage.getItem('id');
        console.log(social_media_links)
        return (
            <div>
            {detail && <Navbar />}         
                <div style={{
                    minWidth: '500px',
                    display: 'flex',
                    alignItems: 'center',
                    alignContent: 'center',
                    justifyContent: 'center',
                    overflow: 'auto',
                }}>
                    <Card style={{ margin: '10px', minWidth: '1000px', maxWidth: '1000px' }}>
                        <CardContent>
                            <p> <a href={`/users/${id}`}>{ `${username}` } </a></p>
                            <p> { `${first_name} ${last_name}` } </p>
                            {
                                !editing ? (
                                    <Fragment>
                                        <p> { `Дата рождения: ${date_of_birth || 'не указано'}` } </p>
                                        <p> { `О себе: ${bio || 'не указано'}` } </p>
                                        <p> { `Место: ${location || 'не указано'}` } </p>
                                        {this.getContactInfo()}
                                    </Fragment>
                                ) : (
                                    <Fragment>
                                        <TextField
                                            label="О себе"
                                            multiline
                                            rowsMax="4"
                                            value={bio}
                                            fullWidth
                                            onChange={e => this.handleChange(e, 'bio')}
                                        />
                                        Место
                                        {this.getContactInfoEdit()}
                                    </Fragment>
                                )
                            }
                            <br/>
                            {
                                detail && id == authId &&
                                <Button
                                        style={{ minWidth: '151px' }}
                                        color={editing ? 'primary' : 'default'}
                                        variant="contained"
                                        onClick={this.onEditButtonClick}
                                >
                                    {editing ? 'Завершить' : 'Редактировать'}
                                </Button>
                            }
                        </CardContent>
                    </Card>
                </div>
            </div>  
        );
    }
}

export default UserDetail;
