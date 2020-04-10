import React, { Component, Fragment } from 'react';
import {searchDreams} from '../API_Requests/search';
import axios from 'axios';
import Dream from '../Dreams/Dream'
import Navbar from '../Navbar'
import parseErrors from '../parseErrors';
import {Button, Card, CardContent, TextField} from '@material-ui/core';

class Search extends Component {
    state = {
        dreams: [],
        searchTerm: '',
    }

    handleChange = (e, field) => {
        this.setState({[field]: e.target.value})
    };
    onSearch = async () => {
        try {
            const {searchTerm} = this.state;
            const res = await searchDreams(searchTerm);
            this.setState({dreams: res.data})
        } catch (err) {
            console.log(err);
            console.log(err.response);
            if (axios.isCancel(err)) {

            }
        }
    }
    
    render() {
        const {dreams, searchTerm} = this.state;
        return (
            <div >
                <Navbar />
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    alignContent: 'center',
                    justifyContent: 'center',
                    overflow: 'auto',
                }}>
                    <TextField
                        //fullWidth
                        label="Что искать"
                        value={searchTerm}
                        onChange={e => this.handleChange(e, 'searchTerm')}
                    />
                    <Button
                        color='primary'
                        variant="contained"
                        onClick={(this.onSearch)}
                    >
                        Поиск
                    </Button>
                </div>
                {dreams.map(obj => (
                    <Dream 
                        key={obj.id} 
                        data={obj}
                     />))
                }
            </div>
        );
    }
}

export default Search;
