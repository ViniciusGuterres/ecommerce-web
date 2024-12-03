import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import img from "../assets/box.png";

import settings from "../settings.js";

// Globals const
const BACKEND_SERVER_URL = settings.backendEndUrl;

function ProductDetails() {
    const [product, setProduct] = useState({});
    const [quantity, setQuantity] = useState(1);

    // Globals
    const localStorageCustomerToken = localStorage.getItem("customerToken");
    const localStorageCustomerID = localStorage.getItem("customer");
    const localStorageCustomerCart = localStorage.getItem("customerCart");

    // Vars
    const { id: urlID } = useParams();
    let priceFormattedToDecimals = product?.price?.toFixed(2)?.toString() || "";
    let priceFormatted = product?.price
        ? priceFormattedToDecimals?.replace(".", ",")
        : "";

    useEffect(() => {
        // Calling saving product controller
        const getOptions = {
            method: "GET",
            // body: jsonData,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorageCustomerToken}`,
            },
        };

        // Getting the products list
        fetch(`${BACKEND_SERVER_URL}/products`, getOptions)
            .then((response) => handleGettingProduct(response))
            .catch((err) => console.log("Error::: ", err.message));
    }, []);

    /**
     *  @function views/ProductDetails/handleGettingProduct - Will receive the get response and set into state
     * @param {Object} response - The fetch get api response
     */
    const handleGettingProduct = async (response) => {
        const { data, err } = await response.json();

        // Should show msg err
        if (err) {
            console.log("err:: ", err);
        }

        // Setting data states and vars
        const { data: products } = data;

        if (products?.length) {
            const productFiltered = products.filter(({ id }) => id == urlID);

            setProduct(productFiltered[0]);
        }
    };

    /**
     *  @function views/ProductDetails/handleClickAddToCart - Will add the product to local storage if the customer is logged, otherwise, send him to login screen
     */
    const handleClickAddToCart = () => {
        const cartBody = {
            product,
            userId: localStorageCustomerID,
        };

        // Calling saving customer controller
        const getOptions = {
            method: "POST",
            // body: jsonData,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorageCustomerToken}`,
            },
            body: JSON.stringify(cartBody),
        };

        fetch(`${BACKEND_SERVER_URL}/shoppingCarts`, getOptions)
            .then(async (response) => {
                console.log("🚀 ~ handleClickAddToCart ~ response:", response);

                const { data, err } = await response.json();

                // Should show msg err
                if (err) {
                    console.log("Error:: ", err);
                    return;
                }

                const { items } = data;

                let localStorageCustomerCartParse = {};

                if (items?.length) {
                    try {
                        localStorageCustomerCartParse = JSON.parse({ items: items.length });
                    } catch (err) {
                        console.log("err: ", err);
                    }
                }

                // If customer is not auth, send to login screen
                if (!localStorageCustomerToken) {
                    window.location.href = "/login";
                    return;
                }

                // Update customer cart
                const customerCartCopy = { ...localStorageCustomerCartParse } || {};

                const cart = { items: items.length++ };

                localStorage.setItem("customerCart", JSON.stringify(cart));

                // Setting data states and vars
                alert("Produto adicionado ao carrinho! ");

                // go back to home
                window.location.href = "/";
            })
            .catch((err) => console.log("Error::: ", err.message));
    };

    /**
     *  @function views/ProductDetails/handleOnChangeProductAmount - Will set the new quantity products amount
     * @param {Object} evt - The on change event object
     */
    const handleOnChangeProductAmount = (evt) => {
        const value = evt.target.value;

        setQuantity(value);
    };

    /**
     *  @function views/ProductDetails/buildRatingElement - Will build the rating element stars, based on average rating
     * @returns {Element} - Will return the rating element
     */
    const buildRatingElement = () => {
        let starsAmount = Math.round(Math.random() * (5 - 1) + 1);

        const buildStarsElement = [];

        for (let i = 0; i < starsAmount; i++) {
            buildStarsElement.push(
                <svg
                    aria-hidden="true"
                    className="w-5 h-5 text-yellow-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    key={`product-details-star_key_${i}`}
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
            );
        }

        return (
            <div className="flex items-center mt-2.5 mb-5">{buildStarsElement}</div>
        );
    };

    return (
        <div className="antialiased">
            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center space-x-2 text-gray-400 text-sm">
                        <a href="/" className="hover:underline hover:text-gray-600">
                            Home
                        </a>

                        {/* Chevron */}
                        <span>
                            <svg
                                className="h-5 w-5 leading-none text-gray-300"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </span>

                        <span className="hover:underline hover:text-gray-600">
                            Produtos
                        </span>

                        {/* Chevron */}
                        <span>
                            <svg
                                className="h-5 w-5 leading-none text-gray-300"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </span>
                    </div>
                </div>

                {/* Product details container */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
                    <div className="flex flex-col md:flex-row -mx-4">
                        {/* Img */}
                        <div>
                            <img src={img} alt={product.name} />
                        </div>

                        <div className="md:flex-1 px-4">
                            {/* Name */}
                            <h2 className="mb-2 leading-tight tracking-tight font-bold text-gray-800 text-2xl md:text-3xl">
                                {product?.name}
                            </h2>

                            <div className="flex items-center space-x-4 my-4">
                                <div>
                                    <div className="rounded-lg bg-gray-100 flex py-2 px-3">
                                        <span className="text-indigo-400 mr-1 mt-1">R$</span>

                                        <span className="font-bold text-indigo-600 text-3xl">
                                            {priceFormatted}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <p className="text-gray-500">{product?.description}</p>

                            {buildRatingElement()}

                            <div className="flex py-4 space-x-4">
                                <div className="relative">
                                    <div className="text-center left-0 pt-2 right-0 absolute block text-xs uppercase text-gray-400 tracking-wide font-semibold">
                                        QTD.
                                    </div>
                                    <select
                                        className="cursor-pointer appearance-none rounded-xl border border-gray-200 pl-4 pr-8 h-14 flex items-end pb-1"
                                        onChange={handleOnChangeProductAmount}
                                    >
                                        <option>1</option>
                                        <option>2</option>
                                        <option>3</option>
                                        <option>4</option>
                                        <option>5</option>
                                        <option>6</option>
                                        <option>7</option>
                                        <option>8</option>
                                        <option>9</option>
                                        <option>10</option>
                                    </select>

                                    <svg
                                        className="w-5 h-5 text-gray-400 absolute right-0 bottom-0 mb-2 mr-2"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                                        />
                                    </svg>
                                </div>

                                <button
                                    type="button"
                                    className="h-14 px-6 py-2 font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white"
                                    onClick={handleClickAddToCart}
                                >
                                    Adicionar ao carrinho
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetails;
