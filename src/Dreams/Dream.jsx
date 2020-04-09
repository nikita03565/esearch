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
    }

    componentDidMount() {
        const {data} = this.props;
        this.setState({...data})
    }

    handleChange = (e, field) => {
        this.setState({[field]: e.target.value})
    };

    onEditButtonClick = () => {
        const {editing} = this.state;
        if (editing) {
            this.onUpdateDream();
        } else {
            this.setState({
                editing: true,
            })
        }
    };

    onAddDream = async () => {
        try {
            const {
                name, description,
            } = this.state;
            const data = {
                name,
                description,
            };
            await addEl('desires', data);
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

    render() {
        const {name, description, editing, user} = this.state;
        const user_id = user ? user.id : 0;
        const authId = Number(localStorage.getItem('id'));
        console.log('STATE', this.state)
        console.log(user_id, authId)
        
        return (
            <div>
                <Card style={{margin: '10px', minWidth: '1000px', maxWidth: '1000px'}}>
                    <CardContent>
                        {
                            editing ? (
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
                                    <p>{name}</p>
                                    <p>{description}</p>
                                </Fragment>
                            )
                        }
                        {
                            Number(user_id) === Number(authId) &&
                            <Button
                                style={{minWidth: '151px'}}
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
        );
    }
}

export default Dream;
