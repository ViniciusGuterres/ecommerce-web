import { useEffect, useState } from "react";

// Components
import ProductsList from '../components/ProductsList.jsx';

import settings from "../settings.js";

// Globals const
const BACKEND_SERVER_URL = settings.backendEndUrl;

function HomeProducts() {
    const [products, setProducts] = useState([]);

    // Globals
    const localStorageCustomerToken = localStorage.getItem("customerToken");

    useEffect(() => {
        // Calling saving customer controller
        const getOptions = {
            method: 'GET',
            // body: jsonData,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorageCustomerToken}`,
            },
        };

        // Getting the products list
        fetch(`${BACKEND_SERVER_URL}/products`, getOptions)
            .then(response => handleGettingProductsList(response))
            .catch(err => console.log('Error::: ', err.message));
    }, []);

    // Functions
    /**
    * @function views/HomeProducts/handleGettingProductsList - It will set the products and categories states with response api param
    * @param {Object} response - The get api response
    */
    const handleGettingProductsList = response => {
        setTimeout(async () => {
            const { data, err } = await response.json();

            // Should show msg err
            if (err) {
                console.log('Error:: ', err);
                return
            }

            // Setting data states and vars
            console.log("🚀 ~~ data:", data);

            if (data) setProducts(data.data);
        }, 100);
    };

    return (
        <ProductsList
            key={'ProductsList'}
            products={products}
        />
    );
}

export default HomeProducts;