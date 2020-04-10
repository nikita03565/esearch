import React, { Component } from 'react';
import {loadDataWithQp, updateEl, deleteEl, addEl} from '../API_Requests/basic';
import axios from 'axios';
import Dream from './Dream'
import Navbar from '../Navbar'
import parseErrors from '../parseErrors';

class Dreams extends Component {
    state = {
        dreams: [],
        url_id: null,
    }

    componentDidMount() {
        const {match: {params: {id} = null}} = this.props;
        this.setState({url_id: id})
        this.onLoadDreams(id);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const {match: {params: {id} = null}} = nextProps;
        if (id !== prevState.id) {
            return {
                url_id: id,
            }
        }
        return null;
    }

    componentDidUpdate(prevProps, prevState) {
        const {url_id} = this.state;
        if (url_id !== prevState.url_id) {
            this.onLoadDreams(url_id)
        }
    }

    onLoadDreams = async (user_id) => {
        try {
            const url = user_id ? `desires/?user_id=${user_id}` : 'desires/'
            const res = await loadDataWithQp(url);
            this.setState({dreams: res.data})
        } catch (err) {
            console.log(err);
            console.log(err.response);
            if (axios.isCancel(err)) {

            }
        }
    }

    onAddDream = async (name, description) => {
        try {
            const data = {
                name,
                description,
            };
            const res = await addEl('desires', data);
            const {dreams} = this.state;
            dreams.push(res.data)
            this.setState({dreams})
        } catch (err) {
            console.log(err);
            console.log(err.response);
            const errorText = parseErrors(err);
            this.setState({errorText});
            if (axios.isCancel(err)) {

            }
        }
    };

    onDeleteDream = async (id) => {
        try {
            const {dreams} = this.state;
            await deleteEl('desires', id);
            const newDreams = dreams.filter(obj => obj.id !== id)
            this.setState({dreams: newDreams})
        } catch (err) {
            console.log(err);
            console.log(err.response);
            if (axios.isCancel(err)) {

            }
        }
    }

    render() {
        const {dreams, url_id} = this.state;
        const authId = localStorage.getItem('id');
        return (
            <div >
                <Navbar />
                {
                    Number(url_id) === Number(authId) && 
                    <Dream 
                        data={{creating: true, user: {id: url_id}}} 
                        addDream={this.onAddDream}    
                    />
                }
                {dreams.map(obj => (
                    <Dream 
                        key={obj.id} 
                        data={obj}
                        deleteDream={this.onDeleteDream}
                     />))
                }
            </div>
        );
    }
}

export default Dreams;
