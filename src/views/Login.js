import { useState } from "react";

import logo from '../images/logo.png';

// Components
import Input from '../components/Input.jsx';
import AlertModal from '../components/AlertModal.jsx';

import settings from "../settings.js";

// Globals const
const BACKEND_SERVER_URL = settings.backendEndUrl;

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [alertModal, setAlertModal] = useState(null);

    // Functions
    /**
    * @function views/handleClickToLogin - Will fetch the login api
    * @param {Object} - The click evt object
    */
    const handleClickToLogin = evt => {
        evt.preventDefault();

        if (!email || !password) {
            console.log('Preencha corretamente todos os campos !');
            return;
        }

        const jsonData = JSON.stringify({ email, password });

        // Calling saving customer controller
        const postOptions = {
            method: 'POST',
            body: jsonData,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        fetch(`${BACKEND_SERVER_URL}/signInCustomer`, postOptions)
            .then(async response => {
                const { data, error } = await response.json();

                if (error === "controllers/signInCustomer - Email or password invalid") {
                    setTimeout(() => {
                        setAlertModal(null);
                    }, 5000);

                    setAlertModal({
                        title: "Erro",
                        message: "Não foi possível logar, Email ou senha invalido"
                    });

                    return;
                }

                if (data) {
                    setTimeout(() => {
                        setAlertModal(null);
                    }, 5000);

                    setAlertModal({
                        title: "Succeso",
                        message: "Aguarde um momento, você está sendo redirecionado"
                    });

                    localStorage.setItem("customerToken", data.token);
                    localStorage.setItem("customer", data.code);

                    setTimeout(() => {
                        window.location.href = '/';
                    }, 2000);

                    return;
                }
            })
            .catch(err => console.log('Error::: ', err.message));
    }

    return (
        <>
            {
                alertModal
                    ?
                    <AlertModal
                        title={alertModal.title}
                        message={alertModal.message}
                        expirationTimeInMs={5000}
                    />
                    :
                    null
            }

            <section className="dark:bg-gray-900">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <div className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                        <img
                            className="w-16 h-16 mr-2"
                            src={logo}
                            alt="logo"
                        />
                        Pet Store
                    </div>

                    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                Entre na sua conta
                            </h1>

                            <form className="space-y-4 md:space-y-6">
                                {/* Email */}
                                <div>
                                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email: </label>

                                    <Input
                                        value={email}
                                        onChange={newValue => setEmail(newValue)}
                                        placeholder="silva@outlook.com"
                                        cssClass="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        required={true}
                                        name="email"
                                        type='email'
                                    />
                                </div>

                                {/* Pasword */}
                                <div>
                                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Senha</label>

                                    <Input
                                        value={password}
                                        onChange={newValue => setPassword(newValue)}
                                        type="password"
                                        name="password"
                                        id="password"
                                        placeholder="••••••••"
                                        cssClass="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        required={true}
                                    />
                                </div>

                                {/* Sign in button */}
                                <button
                                    type="submit"
                                    className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                                    onClick={handleClickToLogin}
                                >
                                    Logar
                                </button>

                                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                    Não possui uma conta? <a
                                        href="/customerCrud"
                                        className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                                    >
                                        Registre-se
                                    </a>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Login;