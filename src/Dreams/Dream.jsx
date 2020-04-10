import React, {Component, Fragment} from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import {loadData, updateEl, addEl} from '../API_Requests/basic';
import axios from 'axios';
import {Button, Card, CardContent, TextField} from '@material-ui/core';
import Navbar from '../Navbar'
import parseErrors from '../parseErrors';

class Dream extends Component {
    state = {
        id: null,
        name: '',
        description: '',
        user: null,
        errorText: '',
        editing: false,
        creating: false,
    }

    componentDidMount() {
        const {data} = this.props;
        this.setState({...data})
    }

    handleChange = (e, field) => {
        this.setState({[field]: e.target.value})
    };

    onEditButtonClick = () => {
        const {editing, creating} = this.state;
        if (editing) {
            this.onUpdateDream();
        } if (creating) {
            this.onAddDream();
        } else {
            this.setState({
                editing: true,
            })
        }
    };

    onAddDream = () => {
        try {
            const {
                name, description,
            } = this.state;
            const {addDream} = this.props;
            addDream(name, description);
            this.setState({editing: false})
        } catch (err) {
            console.log(err);
            console.log(err.response);
            const errorText = parseErrors(err);
            this.setState({errorText});
            if (axios.isCancel(err)) {

            }
        }
    };

    onUpdateDream = async () => {
        try {
            const {
                name, description, id
            } = this.state;
            const data = {
                name,
                description,
            };
            await updateEl('desires', id, data);
            this.setState({editing: false})
        } catch (err) {
            console.log(err);
            console.log(err.response);
            const errorText = parseErrors(err);
            this.setState({errorText});
            if (axios.isCancel(err)) {

            }
        }
    };

    onDeleteDream = (id) => {
        const {deleteDream} = this.props;
        deleteDream(id);
    }

    render() {
        const {id, name, description, editing, creating, user} = this.state;
        const user_id = user ? user.id : 0;
        const user_username = user ? user.username : '';
        const authId = Number(localStorage.getItem('id'));
        console.log('STATE', this.state)
        console.log(user_id, authId)
        let buttonText = '';
        if (creating) {
            buttonText = 'Создать'
        } else if (editing) {
            buttonText = 'Завершить'
        } else {
            buttonText = 'Редактировать'
        }
        console.log(creating, editing, buttonText)
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                alignContent: 'center',
                justifyContent: 'center',
                overflow: 'auto',
            }}>
                <Card style={{margin: '10px', minWidth: '1000px', maxWidth: '1000px'}}>
                    <CardContent>
                        <p><a href={`users/${user_id}`}> {user_username} </a></p>
                        {
                            editing || creating ? (
                                <Fragment>
                                    <TextField
                                        label="Название"
                                        value={name}
                                        onChange={e => this.handleChange(e, 'name')}
                                    />
                                    <TextField
                                        label="Подробное описание"
                                        multiline
                                        rowsMax="8"
                                        value={description}
                                        fullWidth
                                        onChange={e => this.handleChange(e, 'description')}
                                    />
                                </Fragment>
                            ) : (
                                <Fragment>
                                    <p>Название: {name}</p>
                                    <p>Подробное описание: {description}</p>
                                </Fragment>
                            )
                        }
                        {
                            Number(user_id) === Number(authId) && (
                                <Fragment>
                                    <Button
                                        style={{minWidth: '151px'}}
                                        color={editing ? 'primary' : 'default'}
                                        variant="contained"
                                        onClick={this.onEditButtonClick}
                                    >
                                        {buttonText}
                                    </Button>
                                    {!creating &&
                                    <Button
                                        style={{minWidth: '151px'}}
                                        color={editing ? 'primary' : 'default'}
                                        variant="contained"
                                        onClick={(() => this.onDeleteDream(id))}
                                    >
                                        Удалить
                                    </Button>
                                    }
                                </Fragment>
                            )
                        }
                    </CardContent>
                </Card>
            </div>
        );
    }
}

export default Dream;
