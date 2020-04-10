import React, {Component} from 'react';
import {searchDreams, suggestDreams} from '../API_Requests/search';
import axios from 'axios';
import Dream from '../Dreams/Dream'
import Navbar from '../Navbar'
import {Button, TextField} from '@material-ui/core';

class Search extends Component {
    state = {
        dreams: [],
        suggestions: [],
        searchTerm: '',
        suggestTerm: '',
    }

    handleChange = (e, field) => {
        this.setState({[field]: e.target.value})
    };


    onSuggest = async () => {
        try {
            const {suggestTerm} = this.state;
            const res = await suggestDreams('name', suggestTerm);
            console.log(res.data.name_suggest__completion[0].options)
            const suggestions = res.data.name_suggest__completion[0].options.map(suggestion => suggestion.text)
            this.setState({suggestions})
        } catch (err) {
            console.log(err);
            console.log(err.response);
            if (axios.isCancel(err)) {

            }
        }
    }


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
        const {dreams, searchTerm, suggestTerm, suggestions} = this.state;
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

                    <TextField
                        //fullWidth
                        label="Что посоветовать"
                        value={suggestTerm}
                        onChange={e => this.handleChange(e, 'suggestTerm')}
                    />
                    <Button
                        color='primary'
                        variant="contained"
                        onClick={(this.onSuggest)}
                    >
                        Suggest
                    </Button>
                </div>
                {dreams.map(obj => (
                    <Dream 
                        key={obj.id} 
                        data={obj}
                     />))
                }
                <span style={{whiteSpace: 'pre-line'}}>{suggestions.join('\n')}</span>
            </div>
        );
    }
}

export default Search;
