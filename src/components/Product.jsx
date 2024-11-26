/**
 * @function Product - The product container with some information and "buy" button
 * @param {string} name - The product name
 * @param {string} image - The product Base64 image
 * @param {number} price - The product price
 * @param {number} rating - The product rating based on clients experiences
 * @param {number} code - The product DB identifier code
 * @param {function} onClickToBuyProductFunction - The function to handle when click to buy button
 */
function Product({ name, image, price, comments, code, onClickToBuyProductFunction }) {
    // Vars
    const priceFormattedToDecimals = price.toFixed(2)?.toString() || '';
    const priceFormatted = price ? `R$: ${priceFormattedToDecimals?.replace('.', ',')}` : '';

    /**
     *  @function components/Product/calcProductAverageRating - Will calc the product average based on product's comments array
     * @returns {number} - The product average rating
     */
    const calcProductAverageRating = () => {
        let averageRating = 0;
        let ratingSum = 0;

        const productComments = comments || [];

        for (let i = 0; i < productComments.length; i++) {
            const commentRow = productComments[i];

            ratingSum = ratingSum + commentRow.rating;
        }

        averageRating = ratingSum / productComments.length;

        return averageRating
    }

    /**
    * @function components/Product/buildRatingElement - Will build the rating element stars, based on average rating
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

    return (
        <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <a href={`/productDetails/${code}`}>
                {/* Product img */}
                <img
                    className="p-8 rounded-t-lg"
                    src={image}
                    alt='ecommerce product'
                />
            </a>

            <div className="px-5 pb-5">
                {/* Name */}
                <span>
                    <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                        {name}
                    </h5>
                </span>

                {/* Rating */}
                {
                    comments?.length
                        ?
                        buildRatingElement()
                        :
                        null
                }

                <div className="flex items-center justify-between">
                    {/* Price */}
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                        {priceFormatted}
                    </span>

                    {/* Add to cart button */}
                    <a
                        href={`/productDetails/${code}`}
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                        Comprar
                    </a>
                </div>
            </div>
        </div >
    );
}

export default Product;