import { useEffect, useState } from "react";

import settings from "../settings.js";

// Globals const
const BACKEND_SERVER_URL = settings.backendEndUrl;

function Checkout() {
    const [productsInformation, setProductsInformation] = useState([]);
    const [customerInformation, setCustomerInformation] = useState({});
    const [customerCartProducts, setCustomerCartProducts] = useState({});

    useEffect(() => {
        getProductsListDocuments();
        getCustomerDocument();
    }, []);

    /**
    * @function views/getCustomerDocument - Will fetch getCustomers to core api
    */
    const getCustomerDocument = () => {
        // Getting customer code
        const customerCode = localStorage.getItem('customer');

        // Calling get customer controller
        const getOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        fetch(`${BACKEND_SERVER_URL}/getCustomers/${customerCode}`, getOptions)
            .then(async response => {
                const { data, error } = await response.json();

                if (error) {
                    alert('Um erro inesperado ocorreu! ');
                    return;
                }

                if (data) {
                    setCustomerInformation(data);
                }
            })
            .catch(err => {
                alert('Um erro inesperado ocorreu! ');
                console.log('Error::: ', err.message)
            });
    }

    /**
    * @function views/getProductsListDocuments - Will fetch getProducts to core api
    */
    const getProductsListDocuments = () => {
        // Getting products
        const cartProducts = localStorage.getItem('customerCart');
        const cartProductsParsed = JSON.parse(cartProducts);

        const productsCodesList = Object.keys(cartProductsParsed);
        const productUrlStringify = JSON.stringify({ productList: productsCodesList });

        // Calling get products controller
        const getOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',

            },
        };

        fetch(`${BACKEND_SERVER_URL}/getProducts/${productUrlStringify}`, getOptions)
            .then(async response => {
                const { data, error } = await response.json();

                if (error) {
                    alert('Um erro inesperado ocorreu! ');
                    return;
                }

                if (data) {
                    setProductsInformation(data);
                    setCustomerCartProducts(cartProductsParsed);
                }
            })
            .catch(err => {
                alert('Um erro inesperado ocorreu! ');
                console.log('Error::: ', err.message)
            });
    }

    /**
    * @function views/buildProductsCartList - Will build the cart's products list
    * @returns {Element} - Return react element
    */
    const buildProductsCartList = () => {
        const productsList = productsInformation?.map(productDoc => {
            const customerCartProductsRow = customerCartProducts[productDoc.code];

            const priceFormattedToDecimals = productDoc?.price.toFixed(2)?.toString() || '';
            const priceFormatted = productDoc?.price ? `R$: ${priceFormattedToDecimals?.replace('.', ',')}` : '';

            const totalPrice = productDoc.price * customerCartProductsRow.amount;
            const totalPriceFormattedToDecimals = totalPrice?.toFixed(2)?.toString() || '';
            const totalPriceFormatted = totalPriceFormattedToDecimals ? `R$: ${totalPriceFormattedToDecimals?.replace('.', ',')}` : '';
 
            return (
                <li
                    className="grid grid-cols-6 gap-2 border-b-1"
                    key={`product_key_${productDoc.code}`}
                >
                    <div className="col-span-1 self-center">
                        <img src={productDoc?.image} alt="Product" className="rounded w-full" />
                    </div>

                    <div className="flex flex-col col-span-3 pt-2">
                        <span className="text-gray-600 text-md font-semi-bold">{productDoc?.name}</span>
                    </div>

                    <div className="col-span-2 pt-3">
                        <div className="flex items-center space-x-2 text-sm justify-between">
                            <span className="text-gray-400">
                                {`${customerCartProductsRow.amount} x ${priceFormatted}`}
                            </span>

                            <span className="text-pink-400 font-semibold inline-block">
                                {totalPriceFormatted}
                            </span>
                        </div>
                    </div>
                </li>
            );
        });

        return (
            <ul className="py-6 border-b space-y-6 px-8">
                {productsList}
            </ul>
        );
    }

    /**
    * @function views/calcOrderTotal - Will calc the total price based on each product price times quantity
    * @returns {Number} - The order total price
    */
    const calcOrderTotal = () => {
        let total = 0;

        productsInformation?.forEach(productDoc => {
            const customerCartProductsRow = customerCartProducts[productDoc.code];

            const productPriceAmount = customerCartProductsRow.amount * productDoc?.price;
            total += productPriceAmount;
        });

        const priceFormattedToDecimals = total.toFixed(2)?.toString() || '';
        const priceFormatted = total ? `R$: ${priceFormattedToDecimals?.replace('.', ',')}` : '';

        return priceFormatted;
    }

    /**
    * @function views/buildProductsCartList - Will fetch saveOrder to core api 
    */
    const handleClickToFinishOrder = () => {
        // Getting products
        const cartProducts = localStorage.getItem('customerCart');
        const cartProductsParse = JSON.parse(cartProducts);
        const productsValues = Object.values(cartProductsParse);
        const customerCode = localStorage.getItem('customer');
        const customerToken = localStorage.getItem('customerToken');

        if (customerToken) {
            try {
                // Building order body obj
                const orderBodyObj = {
                    products: productsValues,
                    customerId: +customerCode
                };

                // Calling get products controller
                const getOptions = {
                    method: 'POST',
                    body: JSON.stringify(orderBodyObj),
                    headers: {
                        'Content-Type': 'application/json',
                        'authorization': JSON.stringify(customerToken)
                    },
                };

                fetch(`${BACKEND_SERVER_URL}/saveOrder`, getOptions)
                    .then(async response => {
                        const { data, error } = await response.json();

                        if (error) {
                            alert('Um erro inesperado ocorreu! ');
                            return;
                        }

                        if (data) {
                            alert('Pedido criado com sucesso! ');

                            // Clean customer cart local storage
                            localStorage.removeItem('customerCart');

                            setTimeout(() => {
                                window.location.href = '/';
                            }, 1000);
                        }
                    })
                    .catch(err => {
                        alert('Um erro inesperado ocorreu! ');
                        console.log('Error::: ', err.message)
                    });
            } catch (error) {
                console.log(error)
            }
        } else {
            alert('Usuario não autenticado! Por favor fazer o login!')
            window.location.href = ("/login");
        }
    }

    return (
        <div className="h-screen grid grid-cols-3">
            <div className="lg:col-span-2 col-span-3 bg-indigo-50 space-y-8 px-12">
                <div className="mt-8 p-4 relative flex flex-col sm:flex-row sm:items-center bg-white shadow rounded-md">
                    <div className="flex flex-row items-center border-b sm:border-b-0 w-full sm:w-auto pb-4 sm:pb-0">
                        <div className="text-yellow-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 sm:w-5 h-6 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="text-sm font-medium ml-3">Checkout</div>
                    </div>

                </div>
                <div className="rounded-md">
                    <form id="payment-form" method="POST" action="">
                        <section>
                            <h2 className="uppercase tracking-wide text-lg font-semibold text-gray-700 my-2">
                                Informações do pedido
                            </h2>

                            <fieldset className="mb-3 bg-white shadow-lg rounded text-gray-600">
                                <label className="flex border-b border-gray-200 h-12 py-3 items-center">
                                    <span className="text-right px-2">Nome: </span>
                                    <span>{customerInformation.name || ''}</span>
                                </label>

                                <label className="flex border-b border-gray-200 h-12 py-3 items-center">
                                    <span className="text-right px-2">Email:</span>
                                    <span>{customerInformation.email || ''}</span>
                                </label>

                                <label className="flex border-b border-gray-200 h-12 py-3 items-center">
                                    <span className="text-right px-2">Endereço: </span>
                                    <span>{customerInformation.address}</span>
                                </label>

                                <label className="flex border-b border-gray-200 h-12 py-3 items-center">
                                    <span className="text-right px-2">Cidade: </span>
                                    <span>{customerInformation.city}</span>
                                </label>

                                <label className="inline-flex w-2/4 border-gray-200 py-3">
                                    <span className="text-right px-2">Estado: </span>
                                    <span>{customerInformation.state}</span>
                                </label>

                                <label className="xl:w-1/4 xl:inline-flex py-3 items-center flex xl:border-none border-t border-gray-200 py-3">
                                    <span className="text-right px-2 xl:px-0 xl:text-none">CEP:  </span>
                                    <span>{customerInformation.zipCode}</span>
                                </label>
                            </fieldset>
                        </section>
                    </form>
                </div>

                <div className="rounded-md">
                    <section>
                        <h2 className="uppercase tracking-wide text-lg font-semibold text-gray-700 my-2">Informações do pagamento</h2>
                        <fieldset className="mb-3 bg-white shadow-lg rounded text-gray-600">
                            <label className="flex border-b border-gray-200 h-12 py-3 items-center">
                                <span className="text-right px-2">Cartão de crédito: </span>
                                <span>{customerInformation.cardNumber}</span>
                            </label>
                        </fieldset>
                    </section>
                </div>

                <button
                    className="submit-button px-4 py-3 rounded-full bg-pink-400 text-white focus:ring focus:outline-none w-full text-xl font-semibold transition-colors"
                    onClick={handleClickToFinishOrder}
                >
                    Finalizar pedido
                </button>
            </div>
            <div className="col-span-1 bg-white lg:block hidden">
                <h1 className="py-6 border-b-2 text-xl text-gray-600 px-8">
                    Resumo do pedido
                </h1>

                {buildProductsCartList()}

                <div className="font-semibold text-xl px-8 flex justify-between py-8 text-gray-600">
                    <span>Total</span>
                    <span>{`${calcOrderTotal()}`}</span>
                </div>
            </div>
        </div>
    );
}

export default Checkout;