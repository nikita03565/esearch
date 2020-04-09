import React, { Component } from 'react';
import {loadDataWithQp, updateEl} from '../API_Requests/basic';
import axios from 'axios';
import Dream from './Dream'
import Navbar from '../Navbar'

class Dreams extends Component {
    state = {
        dreams: []
    }

    componentDidMount() {
        const {match: {params: {id} = null}} = this.props;
        this.onLoadDreams(id);
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

    render() {
        const {dreams} = this.state;
        return (
            <div>
                <Navbar />
                {dreams.map(obj => <Dream key={obj.id} data={obj} />)}
            </div>
        );
    }
}

export default Dreams;
