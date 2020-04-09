import React, { Component, Fragment } from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import { loadData, updateEl } from '../API_Requests/basic';
import axios from 'axios';
import {
    Card, CardContent, Button, TextField
} from '@material-ui/core';
import Navbar from '../Navbar'
import parseErrors from '../parseErrors';

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
        countryInput: '',
        cityInput: '',
        districtInput: '',
        streetInput: '',
        buildingInput: '',
        apartmentInput: '',
        errorText: '',
    }

    componentDidMount() {
        const { data, match } = this.props;
        if (data) {
            this.setState({ ...data, detail: false });
        } else if (match) {
            this.onLoadUser(match.url);
        }    
    }

    static getDerivedStateFromProps(nextProps, prevState) {       
        const { data, match } = nextProps;
        let newState = null;
        if (data) {
            newState = {id: data.id};
        } else if (match) {
            newState = {id: match.params.id};
        }
        return newState;
    }

    componentDidUpdate(prevProps, prevState) {
        const {id} = this.state;
        if (id !== prevState.id) {
            this.onLoadUser(`users/${id}`)
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


    createLocationData = () => {
        const {
            countryInput, cityInput, districtInput,
            streetInput, buildingInput, apartmentInput
        } = this.state;
        const country = countryInput ? { country: {name: countryInput }} : null
        const city = cityInput ? { city: { ...country, name: cityInput }} : null
        const district = districtInput ? { district: { ...city, name: districtInput }} : null
        const street = streetInput ? { street: { ...city, name: streetInput }} : null;
        const building = buildingInput ? { building: buildingInput } : null;
        const apartment = apartmentInput ? { apartment: apartmentInput } : null;
        let location = {}
        const data = [country, city, district, street, building, apartment]
        data.filter(el => el).forEach(el => location = { ...location, ...el })
        return location
    }

    onUpdateUser = async () => {
        try {
            const {bio, id, date_of_birth, email, location, 
                phone_number, social_media_links 
            } = this.state;
            const linksData = social_media_links.map(linkObj => linkObj.link).filter(link => link);
            const locationData = this.createLocationData()
            const data = {
                bio,
                date_of_birth,
                email,
                location: locationData,
                phone_number,
                social_media_links: linksData,
            }
            const res = await updateEl('users', id, data);
            this.setState({ location: locationData, editing: false })
        } catch (err) {
            console.log(err)
            console.log(err.response)
            const errorText = parseErrors(err)
            this.setState({ errorText });
            if (axios.isCancel(err)) {
                return;
            }
        }
    }

    onEditButtonClick = () => {
        const { editing, location } = this.state;
        if (editing) {
            this.onUpdateUser();
        } else {
            const [country, city, district, street, building, apartment] = this.getLocationNames(location);
            this.setState({ 
                editing: true,
                countryInput: country,
                cityInput: city,
                districtInput: district,
                streetInput: street,
                buildingInput: building,
                apartmentInput: apartment,
            })
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
                            ) : ' не указано'
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

    getLocationNames = (location) => {
        const country = location && location.country ? location.country.name : '';
        let city = ''
        let district = ''
        let street = ''
        let building = ''
        let apartment = ''
        if (country && location.city) {
            city = location.city.name;
        }
        if (city && location.district) {
            district = location.district.name;
        }
        if (city && location.street) {
            street = location.street.name;
        }
        if (street && location.building) {
            building = location.building;
        }
        if (building && location.apartment) {
            apartment = location.apartment;
        }
        return [country, city, district, street, building, apartment]
    }

    getLocationString = (location) => {
        if (location === null) {
            return 'не указано';
        }
        const names = this.getLocationNames(location);
        const res = names.filter(el => Boolean(el)).join(', ')
        return res;
    }

    render() {
        const { 
            bio, date_joined, date_of_birth, email,
            first_name, id, last_name, location, phone_number,
            privacy_settings, social_media_links, username, 
            detail, editing, countryInput, cityInput, 
            districtInput, streetInput, buildingInput, apartmentInput,
            errorText,
        } = this.state;
        const authId = localStorage.getItem('id');
        console.log('in render', errorText)
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
                                        <p> { `Место: ${this.getLocationString(location)}` } </p>
                                        {this.getContactInfo()}
                                    </Fragment>
                                ) : (
                                    <Fragment>
                                        <TextField
                                            label="Дата рождения"
                                            value={date_of_birth}
                                            onChange={e => this.handleChange(e, 'date_of_birth')}
                                        />
                                        <TextField
                                            label="О себе"
                                            multiline
                                            rowsMax="8"
                                            value={bio}
                                            fullWidth
                                            onChange={e => this.handleChange(e, 'bio')}
                                        />
                                        Место:
                                        <br/>
                                        <TextField
                                            label="Страна"
                                            value={countryInput}
                                            onChange={e => this.handleChange(e, 'countryInput')}
                                        />
                                        <br/>
                                        <TextField
                                            label="Город"
                                            value={cityInput}
                                            onChange={e => this.handleChange(e, 'cityInput')}
                                        />
                                        <br/>
                                        <TextField
                                            label="Район"
                                            value={districtInput}
                                            onChange={e => this.handleChange(e, 'districtInput')}
                                        />
                                        <br/>
                                        <TextField
                                            label="Улица"
                                            value={streetInput}
                                            onChange={e => this.handleChange(e, 'streetInput')}
                                        />
                                        <br/>
                                        <TextField
                                            label="Дом"
                                            value={buildingInput}
                                            onChange={e => this.handleChange(e, 'buildingInput')}
                                        />
                                        <br/>
                                        <TextField
                                            label="Квартира"
                                            value={apartmentInput}
                                            onChange={e => this.handleChange(e, 'apartmentInput')}
                                        />
                                        {this.getContactInfoEdit()}
                                        <span style={{ whiteSpace: 'pre-line', color: 'red' }}>{errorText}</span>
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
