// Components
import Product from "./Product";

/**
 * @function ProductsList - Will render products list
 * @param {object[]} products - The array with all products objects 
 * @param {string} sortProductsValue - The sort products logic value ('lowestPrice', 'biggestPrice') 
 */
function ProductsList({  products, sortProductsValue }) {
    // Functions
    /**
     * @function components/ProductsList/sortProducts - Will sort the products by lowestPrice or biggestPrice
     * @returns {object[]} - The sorted products
     */
    const sortProducts = () => {
        let productsListSorted = products;

        // Just sort the products if has a sort value 
        if (sortProductsValue) {
            // Sorting the movie list
            productsListSorted = products.sort((productA, productB) => {
                const productAPrice = productA.price;
                const productBPrice = productB.price;

                // Case is sorted by name ASC
                if (sortProductsValue === 'lowestPrice') {
                    if (productAPrice < productBPrice) return -1;
                    if (productAPrice > productBPrice) return 1;

                    return 0;
                }
                // Case is sorted by name DESC
                if (sortProductsValue === 'biggestPrice') {
                    if (productAPrice > productBPrice) return -1;
                    if (productAPrice < productBPrice) return 1;

                    return 0;
                }
            }); 
        }

        return productsListSorted;
    }

    /**
     * @function components/ProductsList/buildProducts
     * @summary - Will build the product list calling Product component for each product's object
     * @returns {element} - Returns each product component 
     */
    const buildProducts = () => {
        const productsListSorted = sortProducts();

        const productsList = productsListSorted?.map(({ name, price, id, description, inventory_amount }) => {
            return (
                <Product
                    key={`product_key_${id}`}
                    name={name}
                    price={price}
                    id={id}
                    description={description}
                    inventoryAmount={inventory_amount}
                />
            );
        });

        return (
            <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                {productsList}
            </div>
        );
    }

    return (
        <div className="bg-white">
            <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                {buildProducts()}
            </div>
        </div>

    );
}

export default ProductsList;