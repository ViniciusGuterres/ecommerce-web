import { useState } from "react";
import settings from "../settings.js";

// Globals const
const BACKEND_SERVER_URL = settings.backendEndUrl;

function CreateProduct() {
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        description: "",
        inventory_amount: "",
    });

    const [message, setMessage] = useState("");

    
    // Globals
    const localStorageCustomerToken = localStorage.getItem("customerToken");

    /**
     * @function handleInputChange - Updates the form data state on user input.
     * @param {Object} event - The event object from the input.
     */
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    /**
     * @function handleSubmit - Sends the form data to the backend server.
     * @param {Object} event - The form submission event.
     */
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Input validation
        const { name, price, description, inventory_amount } = formData;
        if (!name || !price || !description) {
            setMessage("Please fill in all required fields.");
            return;
        }

        // Prepare POST request
        const postOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorageCustomerToken}`,
            },
            body: JSON.stringify(formData),
        };

        try {
            const response = await fetch(
                `${BACKEND_SERVER_URL}/products`,
                postOptions
            );

            const result = await response.json();

            if (response.ok) {
                setMessage("Product created successfully!");
                setFormData({
                    name: "",
                    price: "",
                    description: "",
                    inventory_amount: "",
                });
            } else {
                setMessage(`Error: ${result.err}`);
            }
        } catch (error) {
            setMessage(`Network Error: ${error.message}`);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <h1 className="text-2xl font-bold mb-4">Criar Novo Produto</h1>
            {message && <p className="text-red-500 mb-4">{message}</p>}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Nome <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label
                        htmlFor="price"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Preço (R$) <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        step="0.01"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label
                        htmlFor="description"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Descrição <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        rows="3"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label
                        htmlFor="inventory_amount"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Quantidade
                    </label>
                    <input
                        type="number"
                        id="inventory_amount"
                        name="inventory_amount"
                        value={formData.inventory_amount}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        step="1"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-500"
                >
                    Criar Produto
                </button>
            </form>
        </div>
    );
}

export default CreateProduct;
