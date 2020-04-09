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
        name: '',
        description: '',
        errorText: '',
        editing: false,
    }
    handleChange = (e, field) => {
        this.setState({[field]: e.target.value})
    };

    onCreateDream = async () => {
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

    render() {
        const {name, description, editing} = this.state;
        return (
            <div>
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
                <Button
                    style={{minWidth: '151px'}}
                    color={editing ? 'primary' : 'default'}
                    variant="contained"
                    onClick={this.onCreateDream}
                >
                    {editing ? 'Завершить' : 'Редактировать'}
                </Button>
            </div>
        );
    }
}

export default Dream;
