import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { FiArrowLeft } from 'react-icons/fi'
import { Link, useHistory } from 'react-router-dom';
import { Map, Marker, TileLayer } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';
import api from "../../services/api";
import axios from 'axios';

import './styles.css';

import logo from '../../assets/logo.svg'

interface Item {
    id: number;
    title: string;
    URL: string;
}
interface IBGE_UF_response {
    sigla: string;
}
interface IBG_City_response {
    nome: string;
}



const CreatePoint = () => {

    const [items, setItems] = useState<Item[]>([]);
    const [ufs, setUfs] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>([]);

    const [selectedUf, set_selectedUf] = useState('0');
    const [selectedCity, set_selectedCity] = useState('0');
    const [InicialPosition, set_InicialPosition] = useState<[number, number]>([0, 0]);
    const [selectedPosition, set_selectedPosition] = useState<[number, number]>([0, 0]);
    const [formData, set_formData] = useState({
        name: '',
        email: '',
        whatsapp: ''
    });
    const [selectedItems, set_selectedItems] = useState<number[]>([]);

    const history = useHistory();

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            console.log(position)
            let { latitude, longitude } = position.coords;
            set_InicialPosition([latitude, longitude]);
        })
    }, [])
    useEffect(() => {
        api.get('/items').then(response => {
            setItems(response.data);
        })
    }, [])
    useEffect(() => {
        axios.get<IBGE_UF_response[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
            const UFs_initials = response.data.map(item => item.sigla);
            setUfs(UFs_initials);
        })
    }, [])
    useEffect(() => {
        if (selectedUf === '0') {
            return;
        }
        axios.get<IBG_City_response[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
            .then(response => {
                const cityNames = response.data.map(city => city.nome);
                setCities(cityNames);
            })

    }, [selectedUf]);

    function handleSelectedUf(event: ChangeEvent<HTMLSelectElement>) {
        set_selectedUf(event.target.value);
    }
    function handleSelectedCity(event: ChangeEvent<HTMLSelectElement>) {
        set_selectedCity(event.target.value)
    }
    function handleMapMouseClick(event: LeafletMouseEvent) {
        set_selectedPosition([event.latlng.lat, event.latlng.lng]);
    }
    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target

        set_formData({ ...formData, [name]: value });
    }
    function handleSelectItem(itemId: number) {
        const alreadySelectedItem = selectedItems.findIndex(item => item === itemId)

        if (alreadySelectedItem >= 0) {
            const filteredItems = selectedItems.filter(item => item !== itemId);

            set_selectedItems(filteredItems);
        } else {
            set_selectedItems([...selectedItems, itemId]);
        }

    };
    async function handleSubmit(event: FormEvent) {
        event.preventDefault();

        const [latitude, longitude] = selectedPosition;
        const {name, email, whatsapp} = formData

        const data = {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city: selectedCity,
            uf: selectedUf,
            items: selectedItems
        };

        await api.post('/points', data);
        alert(`Ponto de coleta ${data.name} criado`);
        history.push('/');
    }



    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Ecoleta logo" />
                <Link to='/' >
                    <FiArrowLeft />
                    Voltar
                </Link>
            </header>
            <form onSubmit={handleSubmit}>
                <h1>Cadastro do ponto de coleta</h1>

                <fieldset>
                    <legend><h2>Dados</h2></legend>

                    <div className="field">
                        <label htmlFor="name">Nome da entidade</label>
                        <input
                            type="text"
                            name='name'
                            id='name'
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">E-mail</label>
                            <input
                                type="text"
                                name='email'
                                id='email'
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="whatsapp">Whatsapp</label>
                            <input
                                type="text"
                                name='whatsapp'
                                id='whatsapp'
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>

                    <Map center={InicialPosition} zoom={15} onClick={handleMapMouseClick}>
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={selectedPosition} />
                    </Map>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="s">Estado (UF)</label>
                            <select onChange={handleSelectedUf} value={selectedUf} name="uf" id="uf">
                                <option value="0">Selecione um estado</option>
                                {ufs.map(uf => {
                                    return (
                                        <option key={uf} value={uf}>{uf}</option>

                                    )
                                })}
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select onChange={handleSelectedCity} value={selectedCity} name="city" id="city">
                                <option value="0">Selecione uma cidade</option>
                                {cities.map(city => {
                                    return (
                                        <option key={city} value={city}>{city}</option>
                                    )
                                })}
                            </select>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Itens de coleta</h2>
                        <span>Selecione um ou mais itens abaixo</span>
                    </legend>

                    <ul className='items-grid'>
                        {items.map(item => {
                            return (
                                //Se passar 'onClick={func(param)}', a função será executada, ao inves de passar a função como referencia.
                                //Para passar a função com parametro, precisa ser 'onClick={ () => func(param) }'
                                <li
                                    key={item.id}
                                    onClick={() => handleSelectItem(item.id)}
                                    className={selectedItems.includes(item.id) ? 'selected' : ''}
                                >
                                    <img src={item.URL} alt="" />
                                    <span>{item.title}</span>
                                </li>
                            )
                        })}

                    </ul>
                </fieldset>

                <button>Cadastrar ponto de coleta</button>
            </form>
        </div>
    )
}

export default CreatePoint;