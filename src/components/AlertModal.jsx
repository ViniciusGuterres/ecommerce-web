/**
 * @function AlertModal - Will render an alert modal with title and message
 * @param {string=} title - The alert modal title
 * @param {string=} message - The alert modal body message string
 */
function AlertModal({ title, message }) {
    return (
        <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4">
            <p className="font-bold">{title}</p>
            <p>{message}</p>
        </div>
    );
}

export default AlertModal;