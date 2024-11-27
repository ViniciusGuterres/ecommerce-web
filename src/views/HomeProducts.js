import { useEffect, useState } from "react";

// Components
import ProductsCategoryList from '../components/ProductsCategoryList.jsx';

import settings from "../settings.js";

// Globals const
const BACKEND_SERVER_URL = settings.backendEndUrl;

function HomeProducts() {
    const [productsSeparateByCategory, setProductsSeparateByCategory] = useState({});
    const [showingProductsSeparateByCategory, setShowingProductsSeparateByCategory] = useState({});
    const [categoriesDictionary, setCategoriesDictionary] = useState({});
    const [isFiltersCollapsed, setIsFiltersCollapsed] = useState(true);
    const [inputFilterValue, setInputFilterValue] = useState('');
    const [sortProductsValue, setSortProductsValue] = useState(null);

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
        fetch(`${BACKEND_SERVER_URL}/products`, getOptions)
            .then(response => handleGettingProductsList(response))
            .catch(err => console.log('Error::: ', err.message));
    }, []);

    // Functions
    /**
    * @function views/HomeProducts/handleGettingProductsList - Will set the products and categories states with response api param
    * @param {Object} response - The get api response
    */
    const handleGettingProductsList = response => {
        setTimeout(async () => {
            const { data, error } = await response.json();

            // Should show msg error
            if (error) {
                console.log('Error:: ', error);
            }

            // Setting data states and vars
            if (data) {
                const categoriesObj = data?.categoriesObj || {};

                setProductsSeparateByCategory(categoriesObj);
                setShowingProductsSeparateByCategory(categoriesObj);
                setCategoriesDictionary(data?.categoriesDictionary || {})
            }
        }, 100);
    };

    /**
    * @function views/HomeProducts/handleChangeInputFilter - Will set the input products filter value
    * @param {Object} - The onChange obj event
    */
    const handleChangeInputFilter = event => {
        const newInputValue = event.target.value;

        setInputFilterValue(newInputValue);
        setShowingProductsSeparateByCategory(handleFilteredProductsChange(newInputValue));
    }

    /**
    * @function views/HomeProducts/handleChangeInputFilter - Will check for each product name and compare with the filtered value and set the matchs products 
    * @param {string} - The new changed filter value
    */
    const handleFilteredProductsChange = filteredValue => {
        const removeAccentsRegex = /[\u0300-\u036f]/g;

        // Formatting input text value. Removing accents, empty spaces e set lower case
        let inputText = filteredValue.trim();
        inputText = inputText.toLowerCase();
        inputText = inputText.normalize("NFD").replace(removeAccentsRegex, "");

        const newProductsSeparateByCategoryFiltered = {};

        for (let productsSeparateByCategoryId in productsSeparateByCategory) {
            const currentProductsSeparateByCategory = productsSeparateByCategory[productsSeparateByCategoryId];

            const filteredProducts = currentProductsSeparateByCategory?.filter(product => {
                let productName = product.name;

                if (productName) {
                    // Removing Name and Identifier accents
                    productName = productName?.normalize("NFD")?.replace(removeAccentsRegex, "") || '';
                    productName = productName?.toLowerCase();

                    if (productName?.includes(inputText)) {
                        return product;
                    }
                }
            });

            newProductsSeparateByCategoryFiltered[productsSeparateByCategoryId] = filteredProducts;
        }

        return newProductsSeparateByCategoryFiltered;
    }

    // Build functions
    /**
    * @function views/HomeProducts/buildProductsList - Will build the products list separated by category
    * @return {Element} - React element
    */
    const buildProductsList = () => {
        const result = [];

        for (let showingProductsSeparateByCategoryId in showingProductsSeparateByCategory) {
            const currentShowingProductsSeparateByCategory = showingProductsSeparateByCategory[showingProductsSeparateByCategoryId];

            // Just render products list category if category has products showing
            if (currentShowingProductsSeparateByCategory?.length) {
                result.push(
                    <ProductsCategoryList
                        key={showingProductsSeparateByCategoryId}
                        categoryName={categoriesDictionary[showingProductsSeparateByCategoryId]}
                        products={currentShowingProductsSeparateByCategory}
                        sortProductsValue={sortProductsValue}
                    />
                );
            }
        }

        return result;
    }

    /**
    * @function views/HomeProducts/buildModalFilter - Will build the sort products modal filter
    * @return {Element} - React element
    */
    const buildModalFilter = () => {
        const sortOptionsDefaultClass = 'font-medium text-gray-900 block px-4 py-2 text-sm cursor-pointer';
        const sortOptionsSelectedClass = 'text-gray-900 block px-4 py-2 text-sm text-primary-700';

        // Setting sort button label value
        let labelValue = '';

        switch (sortProductsValue) {
            case 'lowestPrice':
                labelValue = 'Menor Preço';
                break;
            case 'biggestPrice':
                labelValue = 'Maior preço';
                break;
            default:
                labelValue = 'Ordenar';
                break;
        }

        return (
            <div className="flex items-center">
                <div className="relative inline-block text-left">
                    <div>
                        <button
                            type="button"
                            className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900 w-40"
                            id="menu-button"
                            onClick={() => setIsFiltersCollapsed(!isFiltersCollapsed)}
                        >
                            {labelValue}
                            <svg className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" />
                            </svg>
                        </button>
                    </div>

                    {/* Sort filters selects modal */}
                    {
                        !isFiltersCollapsed
                            ?
                            <div className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
                                <div className="py-1" role="none">
                                    <span
                                        className={sortProductsValue === 'lowestPrice' ? sortOptionsSelectedClass : sortOptionsDefaultClass}
                                        onClick={() => setSortProductsValue('lowestPrice')}
                                    >
                                        Menor Preço
                                    </span>

                                    <span
                                        className={sortProductsValue === 'biggestPrice' ? sortOptionsSelectedClass : sortOptionsDefaultClass}
                                        onClick={() => setSortProductsValue('biggestPrice')}
                                    >
                                        Maior Preço
                                    </span>
                                </div>
                            </div>
                            :
                            null
                    }
                </div>
            </div>
        );
    }

    /**
    * @function views/HomeProducts/buildFilters - Will render the input filter and sort modal filter
    * @return {Element} - React element
    */
    const buildFilters = () => {
        return (
            <div className="bg-white shadow-sm sticky top-0">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1 md:py-4">
                    <div className="flex items-center justify-between md:justify-start">
                        <div className="flex items-center space-x-4">
                            {buildModalFilter()}

                            <input
                                type="text"
                                id="simple-search"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Procurar produto"
                                value={inputFilterValue}
                                onChange={evt => handleChangeInputFilter(evt)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            {buildFilters()}
            {buildProductsList()}
        </>
    );
}

export default HomeProducts;