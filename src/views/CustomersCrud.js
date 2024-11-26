import { useEffect, useState } from "react";

// Components
import Input from "../components/Input.jsx";
import Button from "../components/Button.jsx";
import UploadInput from '../components/UploadInput.jsx';

import settings from "../settings.js";

// Globals const
const BACKEND_SERVER_URL = settings.backendEndUrl;

function CustomersCrud() {
    // Globals vars
    const defaultTabClass = 'inline-block text-gray-500 hover:text-gray-600 hover:border-gray-300 rounded-t-lg py-4 px-4 text-sm font-medium text-center border-transparent border-b-2 dark:text-gray-400 dark:hover:text-gray-300';
    const selectedTabClass = 'text-primary-700 border-primary-700 inline-block rounded-t-lg py-4 px-4 text-sm font-medium text-center border-transparent border-b-2 dark:text-gray-400 dark:hover:text-gray-300';

    const customerPersonalDataDefaultFieldsObj = {
        name: '',
        lastName: '',
        cpf: '',
        telephone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
    };

    const customerLoginDataDefaultFieldsObj = {
        email: '',
        password: ''
    };

    const customerCreditCardDataDefaultFieldsObj = {
        cardNumber: '',
        cardCVC: '',
        cardName: '',
        cardExpirationDate: '',
    };

    // Getting customer code
    const customerId = localStorage.getItem('customer');

    // States
    const [customerPersonalDataObj, setCustomerPersonalDataObj] = useState(customerPersonalDataDefaultFieldsObj);
    const [customerLoginDataObj, setCustomerLoginDataObj] = useState(customerLoginDataDefaultFieldsObj);
    const [customerCreditCardDataObj, setCustomerCreditCardDataObj] = useState(customerCreditCardDataDefaultFieldsObj);
    const [crudMode, setCrudMode] = useState(customerId != null ? 'edit' : 'create') // options: edit, view, create
    const [currentTab, setCurrentTab] = useState('personalData') // options: personalData, loginData, creditCardData

    useEffect(() => {
        // Calling get customer controller if has param has customerID
        if (customerId != null) {
            const getOptions = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            // Getting the products list
            fetch(`${BACKEND_SERVER_URL}/getCustomers/${+customerId}`, getOptions)
                .then(async response => {
                    const { data, error } = await response.json();

                    setCustomerEditFields(data);

                    if (error) {
                        alert('Um erro inesperado ocorreu! ');
                        window.location.href = '/';
                        return;
                    }
                })
                .catch(err => console.log('Error::: ', err.message));
        }
    }, []);

    // Functions
    /**
     * @function CustomersCrud/setCustomerEditFields - Will get the customer data and set it into the crud fields
     * @param {Object} dataFields - The customer data fields
     */
    const setCustomerEditFields = dataFields => {
        const {
            name,
            lastName,
            cpf,
            telephone,
            address,
            city,
            state,
            zipCode,
            profileImage,
            email,
            password,
            cardNumber,
            cardCVC,
            cardName,
            cardExpirationDate,
        } = dataFields;

        const personalDataFieldsObj = {
            name,
            lastName,
            cpf,
            telephone,
            address,
            city,
            state,
            zipCode,
            profileImage,
        };

        const LoginDataDefaultFieldsObj = {
            email,
            password,
        };

        const creditCardDataFieldsObj = {
            cardNumber,
            cardCVC,
            cardName,
            cardExpirationDate,
        };

        setCustomerPersonalDataObj(personalDataFieldsObj);
        setCustomerLoginDataObj(LoginDataDefaultFieldsObj);
        setCustomerCreditCardDataObj(creditCardDataFieldsObj);
    }

    /**
     * @function CustomersCrud/checkIfAllFieldsAreFilled - Will check if all fields has values
     * @return {Boolean} - Boolean that indicates it all fields are filled or not
     */
    const checkIfAllFieldsAreFilled = () => {
        const personalDataValues = Object.values(customerPersonalDataObj);
        const loginDataValues = Object.values(customerLoginDataObj);
        const creditCardDataValues = Object.values(customerCreditCardDataObj);

        const fieldsValues = [
            ...personalDataValues,
            ...loginDataValues,
            ...creditCardDataValues
        ];

        return fieldsValues.every(value => value != '');
    }

    /**
     * @function CustomersCrud/handleChangeCustomerPersonalDataInput - Will get the input new value and setting the new value at state current obj key
     * @param {string} newValue - The personal data input new value
     * @param string} inputKey - The change personal data input key e.g (state, name, lastName...)
     */
    const handleChangeCustomerPersonalDataInput = (newValue, inputKey) => {
        let personalDataNewValue = newValue;

        // Convert to number CPF and telephone inputs
        if (inputKey === 'cpf' || inputKey === 'telephone') {
            personalDataNewValue = +newValue;
        }

        // Getting the state copy and setting the changed key attribute
        const customerPersonalDataObjCopy = { ...customerPersonalDataObj };
        customerPersonalDataObjCopy[inputKey] = personalDataNewValue;

        setCustomerPersonalDataObj(customerPersonalDataObjCopy);
    }

    /**
     * @function CustomersCrud/handleChangeCustomerLoginDataInput - Will get the input new value and setting the new value at state current obj key
     * @param {string} newValue - The login data input new value
     * @param {string} inputKey - The change login data input key e.g (email, password)
     */
    const handleChangeCustomerLoginDataInput = (newValue, inputKey) => {
        const customerLoginDataObjCopy = { ...customerLoginDataObj };
        customerLoginDataObjCopy[inputKey] = newValue;

        setCustomerLoginDataObj(customerLoginDataObjCopy);
    }

    /**
     * @function CustomersCrud/handleChangeCustomerCreditCardDataInput - Will get the input new value and setting the new value at state current obj key
     * @param {string} newValue - The credit card data input new value
     * @param {string} inputKey - The change credit card data input key e.g (email, password)
     */
    const handleChangeCustomerCreditCardDataInput = (newValue, inputKey) => {
        const customerCreditCardDataObjCopy = { ...customerCreditCardDataObj };
        customerCreditCardDataObjCopy[inputKey] = newValue;

        setCustomerCreditCardDataObj(customerCreditCardDataObjCopy);
    }

    /**
     * @function CustomersCrud/buildCurrentTabForm - Will render the selected tab PersonalDataForm, LoginDataForm or CreditCardData form 
     * @returns {Element} - Wil return a react element
     */
    const buildCurrentTabForm = () => {
        switch (currentTab) {
            case 'personalData': {
                return (
                    <PersonalDataForm
                        name={customerPersonalDataObj.name}
                        cpf={customerPersonalDataObj.cpf}
                        telephone={customerPersonalDataObj.telephone}
                        address={customerPersonalDataObj.address}
                        city={customerPersonalDataObj.city}
                        state={customerPersonalDataObj.state}
                        zipCode={customerPersonalDataObj.zipCode}
                        profileImage={customerPersonalDataObj.profileImage}
                        handleChangeInput={handleChangeCustomerPersonalDataInput}
                    />
                );
            }
            case 'loginData': {
                return (
                    <LoginDataForm
                        email={customerLoginDataObj.email}
                        password={customerLoginDataObj.password}
                        handleChangeInput={handleChangeCustomerLoginDataInput}
                    />
                );
            }
            case 'creditCardData': {
                return (
                    <CreditCardDataForm
                        cardName={customerCreditCardDataObj.cardName}
                        cardCVC={customerCreditCardDataObj.cardCVC}
                        cardExpirationDate={customerCreditCardDataObj.cardExpirationDate}
                        cardNumber={customerCreditCardDataObj.cardNumber}
                        handleChangeInput={handleChangeCustomerCreditCardDataInput}
                    />
                );
            }
            default: {
                return PersonalDataForm();
            }
        }
    }

    /**
     * @function CustomersCrud/getTabButtonClass - Will return selected css class if the current tab is selected, otherwise will return default css style class
     * @returns {string} - Will return class string
     */
    const getTabButtonClass = (tabName) => {
        return tabName === currentTab ? selectedTabClass : defaultTabClass;
    }

    /**
     * @function CustomersCrud/handleClickSaveCustomer - Will check if all fields are valid and fetch save customer api
     */
    const handleClickSaveCustomer = () => {
        if (!checkIfAllFieldsAreFilled()) {
            alert('Por favor, preencha todos os campos! ');
            return;
        }

        // build response obj
        const body = {
            ...customerPersonalDataObj,
            ...customerLoginDataObj,
            ...customerCreditCardDataObj
        }

        const jsonData = JSON.stringify(body);

        // Calling saving customer controller
        const postOptions = {
            method: 'POST',
            body: jsonData,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        let customerController = 'saveCustomer';

        if (customerId != null) {
            customerController = `updateCustomer/${customerId}`;
        }

        fetch(`${BACKEND_SERVER_URL}/${customerController}`, postOptions)
            .then(async (response) => {
                const { data, error } = await response?.json();

                if (error) {
                    console.log('error: ', error);

                    alert('Um erro inesperado ocorreu !');
                    return;
                }

                alert('Formulário enviado com sucesso !');

                if (crudMode !== 'edit') {
                    window.location.href = '/login';
                } else {
                    window.location.href = '/';
                }
            })
            .catch(err => console.log('Error::: ', err.message));
    }

    return (
        <div>
            {/* Tabs selector */}
            <div className="max-w-2xl mx-auto">
                <div className="border-b border-gray-200 dark:border-gray-700 mb-4">
                    <ul
                        className="flex flex-wrap justify-center -mb-px"
                        id="myTab"
                        data-tabs-toggle="#myTabContent"
                        role="tablist"
                    >
                        <li className="mr-2" role="presentation">
                            <button
                                className={getTabButtonClass('personalData')}
                                id="personalData-tab"
                                data-tabs-target="#personalData"
                                type="button"
                                role="tab"
                                aria-controls="personalData"
                                aria-selected="false"
                                onClick={() => setCurrentTab('personalData')}
                            >
                                Dados Pessoais
                            </button>
                        </li>

                        <li className="mr-2" role="presentation">
                            <button
                                className={getTabButtonClass('loginData')}
                                id="loginData-tab"
                                data-tabs-target="#loginData"
                                type="button"
                                role="tab"
                                aria-controls="loginData"
                                aria-selected="false"
                                onClick={() => setCurrentTab('loginData')}
                            >
                                Dados de Login
                            </button>
                        </li>

                        <li className="mr-2" role="presentation">
                            <button
                                className={getTabButtonClass('creditCardData')}
                                id="creditCardData-tab"
                                data-tabs-target="#creditCardData"
                                type="button"
                                role="tab"
                                aria-controls="creditCardData"
                                aria-selected="false"
                                onClick={() => setCurrentTab('creditCardData')}

                            >
                                Dados de cartão de crédito
                            </button>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Forms content */}
            <div style={{ height: '300px' }}>
                {buildCurrentTabForm()}
            </div>

            {/* Save Button */}
            <div style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
            }}>
                <Button
                    onClickFunction={handleClickSaveCustomer}
                    placeholder='Salvar'
                    cssClass='text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800'
                />
            </div>
        </div>
    );
}

function PersonalDataForm({ name, lastName, cpf, telephone, address, city, state, zipCode, profileImage, handleChangeInput }) {
    return (
        <form>
            <div className="max-w-2xl mx-auto">
                <div className="flex gap-2">
                    {/* Name */}
                    <Input
                        value={name}
                        type={'text'}
                        onChange={handleChangeInput}
                        placeholder='Nome'
                        dataKey='name'
                        cssClass='text-black placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base   transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400'
                    />

                    {/*  LastName */}
                    <Input
                        value={lastName}
                        type={'text'}
                        onChange={handleChangeInput}
                        placeholder='Sobrenome'
                        dataKey='lastName'
                        cssClass='text-black placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base   transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400'
                    />
                </div>

                <div className="flex gap-2">
                    {/* CPF */}
                    <Input
                        value={cpf}
                        type={'number'}
                        onChange={handleChangeInput}
                        placeholder='CPF'
                        dataKey='cpf'
                        cssClass='text-black placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base   transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400'
                    />

                    {/* Telephone */}
                    <Input
                        value={telephone}
                        type={'number'}
                        onChange={handleChangeInput}
                        placeholder='Telefone'
                        dataKey='telephone'
                        cssClass='text-black placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base   transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400'
                    />
                </div>

                {/* Address */}
                <Input
                    value={address}
                    type={'text'}
                    onChange={handleChangeInput}
                    placeholder='Endereço'
                    dataKey='address'
                    cssClass='text-black placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base   transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400'
                />

                <div className="flex gap-2">
                    {/* City */}
                    <Input
                        value={city}
                        type={'text'}
                        onChange={handleChangeInput}
                        placeholder='Cidade'
                        dataKey='city'
                        cssClass='text-black placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base   transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400'
                    />

                    {/* State */}
                    <Input
                        value={state}
                        type={'text'}
                        onChange={handleChangeInput}
                        placeholder='Estado'
                        dataKey='state'
                        cssClass='text-black placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base   transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400'
                    />

                    {/* ZipCode */}
                    <Input
                        value={zipCode}
                        type={'text'}
                        onChange={handleChangeInput}
                        placeholder='CEP'
                        dataKey='zipCode'
                        cssClass='text-black placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base   transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400'
                    />
                </div>
            </div>
        </form>
    );
}

function LoginDataForm({ email, password, handleChangeInput }) {
    return (
        <form>
            <div className="max-w-2xl mx-auto">
                <Input
                    value={email}
                    type={'email'}
                    onChange={handleChangeInput}
                    placeholder='Email'
                    dataKey='email'
                    cssClass='text-black placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base   transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400'
                />

                <Input
                    value={password}
                    type={'password'}
                    onChange={handleChangeInput}
                    placeholder='Senha'
                    dataKey='password'
                    cssClass='text-black placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base   transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400'
                />
            </div>
        </form>
    );
}

function CreditCardDataForm({ cardName, cardNumber, cardExpirationDate, cardCVC, handleChangeInput }) {
    return (
        <form>
            <div className="max-w-2xl mx-auto">
                <Input
                    value={cardName}
                    type={'text'}
                    onChange={handleChangeInput}
                    placeholder='Nome no Cartão'
                    dataKey='cardName'
                    cssClass='text-black placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base   transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400'
                />

                <Input
                    value={cardNumber}
                    type={'number'}
                    onChange={handleChangeInput}
                    placeholder='Número'
                    dataKey='cardNumber'
                    cssClass='text-black placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base   transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400'
                />

                <div className="flex gap-2">
                    {/* Expiration date */}
                    <Input
                        value={cardExpirationDate}
                        type={'text'}
                        onChange={handleChangeInput}
                        placeholder='Data da Validade'
                        dataKey='cardExpirationDate'
                        cssClass='text-black placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base   transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400'
                    />

                    {/* CVC */}
                    <Input
                        value={cardCVC}
                        type={'number'}
                        onChange={handleChangeInput}
                        placeholder='CVC'
                        dataKey='cardCVC'
                        cssClass='text-black placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base   transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400'
                    />
                </div>
            </div>
        </form>
    );
}

export default CustomersCrud;