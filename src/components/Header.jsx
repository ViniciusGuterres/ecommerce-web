import { useEffect, useState } from 'react';
import logo from '../images/logo.png';

/**
 * @function Header - Will render the Header 
 */
function Header() {
    const [isCustomerLogged, setIsCustomerLogged] = useState(false);
    const [cartProductsAmount, setCartProductsAmount] = useState(null);

    useEffect(() => {
        // Get the customer token to check it is logged
        const localStorageCustomerToken = localStorage.getItem("customerToken");

        if (localStorageCustomerToken) {
            // Get the customer cart amount
            const localStorageCustomerCart = localStorage.getItem("customerCart");

            if (localStorageCustomerCart) {
                const localStorageCustomerCartParsed = JSON.parse(localStorageCustomerCart);
                setCartProductsAmount(Object.keys(localStorageCustomerCartParsed).length);
            }

            setIsCustomerLogged(true);
        }
    }, []);

    /**
    * @function components/Button/buildCartProductElements - Will build the checkout button and cart's products amount
    * @return {Element} - React Element
    */
    const buildCartProductElements = () => {
        return (
            <div className="flex items-center lg:order-2">
                <div className="p-3 mr-4 text-green-500 bg-gray-100 rounded-full cursor-pointer" style={{ position: 'relative', cursor: 'auto' }}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="1em" viewBox="0 0 576 512">
                        <path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z" />
                    </svg>

                    {/* Cart amount  */}
                    {
                        cartProductsAmount
                            ?
                            <div style={{
                                height: '20px',
                                width: '20px',
                                position: 'absolute',
                                borderRadius: '50px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#e50000',
                                right: '0px',
                            }}>
                                <span style={{ color: 'white' }}>
                                    {cartProductsAmount}
                                </span>
                            </div>
                            :
                            null
                    }
                </div>

                {/* Checkout button */}
                {
                    cartProductsAmount
                        ?
                        <a
                            href="/checkout"
                            className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800">
                            Finalizar Comprar
                        </a>
                        :
                        null
                }

                <a
                    href='/customerCrud'
                    className="text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800"
                >
                    Editar Dados
                </a>
            </div>
        );
    }

    return (
        <header>
            <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
                {/* main div container */}
                <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
                    {/* Logo */}
                    <a
                        href='/'
                        className='flex items-center'
                    >
                        <img
                            src={logo}
                            className="mr-3 h-6 sm:h-9"
                            alt="Logo"
                        />

                        <span className="font-semibold self-center text-xl whitespace-nowrap dark:text-white">
                            Store
                        </span>
                    </a>

                    {/* Buttons */}
                    {
                        !isCustomerLogged
                            ?
                            <div className="flex items-center lg:order-2">
                                {/* Login button */}
                                <a
                                    href='/login'
                                    className="text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800"
                                >
                                    Logar
                                </a>

                                {/* Register */}
                                <a
                                    href="/customerCrud"
                                    className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800">
                                    Cadastre-se
                                </a>

                                {/* Mobile main menu */}
                                <button
                                    data-collapse-toggle="mobile-menu-2"
                                    type="button"
                                    className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                                    aria-controls="mobile-menu-2"
                                    aria-expanded="false"
                                >
                                    <span className="sr-only">Abrir Menu</span>
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"></path></svg>
                                    <svg className="hidden w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"></path></svg>
                                </button>
                            </div>
                            :
                            buildCartProductElements()
                    }
                </div>
            </nav>

            <div className="bg-indigo-700 text-indigo-200 md:text-center py-2 px-4">
                O ecommerce do seu jeito
            </div>
        </header>
    );
}

export default Header;