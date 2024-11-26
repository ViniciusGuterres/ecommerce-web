import { useEffect, useState } from "react";
import {
    useParams
} from "react-router-dom";

import settings from "../settings.js";

// Globals const
const BACKEND_SERVER_URL = settings.backendEndUrl;

function ProductDetails() {
    const [product, setProduct] = useState({});
    const [quantity, setQuantity] = useState(1);

    // Vars
    const { id } = useParams();
    let priceFormattedToDecimals = product?.price?.toFixed(2)?.toString() || '';
    let priceFormatted = product?.price ? priceFormattedToDecimals?.replace('.', ',') : '';
    let categoryName = product.category_obj?.[0]?.name || '';

    useEffect(() => {
        // Calling saving customer controller
        const getOptions = {
            method: 'GET',
            // body: jsonData,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        // Getting the products list
        fetch(`${BACKEND_SERVER_URL}/getProducts/${+id}`, getOptions)
            .then(response => handleGettingProduct(response))
            .catch(err => console.log('Error::: ', err.message));
    }, []);

    /**
     *  @function views/ProductDetails/handleGettingProduct - Will receive the get response and set into state
     * @param {Object} response - The fetch get api response
     */
    const handleGettingProduct = async response => {
        const { data, error } = await response.json();

        // Should show msg error
        if (error) {
            console.log('Error:: ', error);
        }

        // Setting data states and vars
        if (data?.length) {
            setProduct(data[0]);
        }
    }

    /**
     *  @function views/ProductDetails/handleClickAddToCart - Will add the product to local storage if the customer is logged, otherwise, send him to login screen
     */
    const handleClickAddToCart = () => {
        const localStorageCustomerToken = localStorage.getItem("customerToken");
        const localStorageCustomerCart = localStorage.getItem("customerCart");
        let localStorageCustomerCartParse = {};

        if (localStorageCustomerCart) {
            try {
                localStorageCustomerCartParse = JSON.parse(localStorageCustomerCart);

            } catch (err) {
                console.log('error: ', err);
            }
        }

        // If customer is not auth, send to login screen
        if (!localStorageCustomerToken) {
            window.location.href = '/login';
            return;
        }

        // Update customer cart
        const customerCartCopy = { ...localStorageCustomerCartParse } || {};

        customerCartCopy[product.code] = {
            code: product.code,
            amount: quantity
        };

        localStorage.setItem("customerCart", JSON.stringify(customerCartCopy));
        alert('Produto adicionado ao carrinho! ');

        // go back to home  
        window.location.href = '/';
    }

    /**
     *  @function views/ProductDetails/handleOnChangeProductAmount - Will set the new quantity products amount
     * @param {Object} evt - The on change event object
     */
    const handleOnChangeProductAmount = evt => {
        const value = evt.target.value;

        setQuantity(value);
    }

    /**
     *  @function views/ProductDetails/calcProductAverageRating - Will calc the product average based on product's comments array
     * @returns {number} - The product average rating
     */
    const calcProductAverageRating = () => {
        let averageRating = 0;
        let ratingSum = 0;

        const productComments = product?.comments || [];

        for (let i = 0; i < productComments.length; i++) {
            const commentRow = productComments[i];

            ratingSum = ratingSum + commentRow.rating;
        }

        averageRating = ratingSum / productComments.length;

        return averageRating
    }

    /**
     *  @function views/ProductDetails/buildRatingElement - Will build the rating element stars, based on average rating
     * @returns {Element} - Will return the rating element
     */
    const buildRatingElement = () => {
        const productAverageRating = calcProductAverageRating();
        const productAverageRatingFormatted = productAverageRating.toFixed(2);

        let starsAmount = 0;

        // Setting the amount of product stars based on product average rating
        if (productAverageRating >= 0 && productAverageRating <= 3) {
            starsAmount = 1;
        } else if (productAverageRating >= 3.1 && productAverageRating <= 5) {
            starsAmount = 2;
        } else if (productAverageRating >= 5.1 && productAverageRating <= 7) {
            starsAmount = 3;
        } else if (productAverageRating >= 7.1 && productAverageRating <= 8) {
            starsAmount = 4;
        } else {
            starsAmount = 5;
        }

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
            <div className="flex items-center mt-2.5 mb-5">
                {buildStarsElement}

                <span
                    className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ml-3"
                >
                    {productAverageRatingFormatted?.toString()?.replace('.', ',')}
                </span>
            </div>
        );
    };

    /**
     *  @function views/ProductDetails/buildCommentsSectionElement - Will build the product's comments section
     * @returns {Element} - Will return the comments section element
     */
    const buildCommentsSectionElement = () => {
        const reviewsElement = product?.comments?.map(({ rating, text }) => {
            return (
                <div
                    key={`Product_details_comment_${rating}_${text}`}
                    style={{
                        width: '200px',
                        boxShadow: '10px 10px 5px -8px rgba(0,0,0,0.38)',
                        padding: '15px',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <div className="mt-4">
                        <h1 className="text-lg text-gray-700 font-semibold hover:underline cursor-pointer">Product Review</h1>
                        <div className="flex mt-2">
                            <svg className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <svg className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <svg className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <svg className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        </div>

                        {/* Comment text */}
                        <p>
                            {text}
                        </p>
                    </div>
                </div>
            );
        });

        return (
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: '30px'
                }}
            >
                {reviewsElement}
            </div>
        );
    }

    return (
        <div className="antialiased">
            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center space-x-2 text-gray-400 text-sm">
                        <a
                            href="/"
                            className="hover:underline hover:text-gray-600"
                        >Home
                        </a>

                        {/* Chevron */}
                        <span>
                            <svg className="h-5 w-5 leading-none text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </span>

                        <span
                            className="hover:underline hover:text-gray-600">
                            Produtos
                        </span>

                        {/* Chevron */}
                        <span>
                            <svg className="h-5 w-5 leading-none text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </span>

                        <span>
                            {categoryName}
                        </span>
                    </div>
                </div>

                {/* Product details container */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
                    <div className="flex flex-col md:flex-row -mx-4">
                        {/* Img */}
                        <div>
                            <img
                                src={product?.image}
                                alt={product.name}
                            />
                        </div>

                        <div className="md:flex-1 px-4">
                            {/* Name */}
                            <h2 className="mb-2 leading-tight tracking-tight font-bold text-gray-800 text-2xl md:text-3xl">
                                {product?.name}
                            </h2>

                            <p className="text-gray-500 text-sm">
                                Categoria: <strong>{categoryName}</strong>
                            </p>

                            <div className="flex items-center space-x-4 my-4">
                                <div>
                                    <div className="rounded-lg bg-gray-100 flex py-2 px-3">
                                        <span className="text-indigo-400 mr-1 mt-1" >
                                            R$
                                        </span>

                                        <span className="font-bold text-indigo-600 text-3xl">
                                            {priceFormatted}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <p className="text-gray-500">
                                {product?.description}
                            </p>

                            {buildRatingElement()}

                            <div className="flex py-4 space-x-4">
                                <div className="relative">
                                    <div className="text-center left-0 pt-2 right-0 absolute block text-xs uppercase text-gray-400 tracking-wide font-semibold">QTD.</div>
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

                                    <svg className="w-5 h-5 text-gray-400 absolute right-0 bottom-0 mb-2 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
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

                {buildCommentsSectionElement()}
            </div>
        </div>
    );
}

export default ProductDetails;