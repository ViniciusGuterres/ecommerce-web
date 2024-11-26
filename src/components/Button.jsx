/**
 * @function Button - Will render the button html tag
 * @param {string|number} value - The button value
 * @param {function=} onChange - Function to be called when the button value change
 * @param {string=} placeholder - The button string placeholder
 * @param {string} class - The button className
 */
function Button({ value, onClickFunction, placeholder, isDisabled, cssClass, type }) {

    // Functions
    /**
    * @function components/Button/handleOnButtonClick - Will call the onClick param function if it has be passed
    * @param {object} evt - The on change evt object
    */
    const handleOnButtonClick = (evt) => {
        if (typeof onClickFunction == 'function') {
            onClickFunction();
        }
    }

    return (
        <button
            value={value}
            onClick={handleOnButtonClick}
            className={cssClass}
            type={type || 'button'}
        >
            <span>{placeholder}</span>
        </button>
    );
}

export default Button;