import { useEffect, useState } from "react";
import settings from "../settings.js";

// Globals const
const BACKEND_SERVER_URL = settings.backendEndUrl;
const USER_ID = localStorage.getItem("customer");

const localStorageCustomerToken = localStorage.getItem("customerToken");

function Checkout() {
    const [productsInformation, setProductsInformation] = useState([]);
    const [customerInformation, setCustomerInformation] = useState({});
    const [customerCart, setCustomerCart] = useState({});

    useEffect(() => {
        fetchCustomerCart();
    }, []);

    const fetchCustomerCart = () => {
        if (!USER_ID) {
            alert("Usuário não autenticado! Por favor, faça login.");
            window.location.href = "/login";
            return;
        }

        const options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorageCustomerToken}`,
            },
        };

        fetch(`${BACKEND_SERVER_URL}/shoppingCarts?userId=${USER_ID}`, options)
            .then(async (response) => {
                const { data, err } = await response.json();

                if (err) {
                    alert("Erro ao buscar carrinho: " + err);
                    return;
                }

                setProductsInformation(data.products || []);
            })
            .catch((err) => {
                console.error("Erro ao buscar carrinho:", err.message);
                alert("Erro inesperado ao buscar carrinho.");
            });
    };

    const handleRemoveItem = (productId) => {
        const options = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ USER_ID }),
        };

        fetch(`${BACKEND_SERVER_URL}/cart/${productId}`, options)
            .then(async (response) => {
                const { data, err } = await response.json();

                if (err) {
                    alert("Erro ao remover item: " + err);
                    return;
                }

                setProductsInformation(data.products || []);
                setCustomerCart(data.cart || {});
            })
            .catch((err) => {
                console.error("Erro ao remover item:", err.message);
                alert("Erro inesperado ao remover item.");
            });
    };

    /**
     * Calculate the total order price.
     */
    const calcOrderTotal = () => {
        return productsInformation.reduce((total, product) => {
            const quantity = customerCart[product.id]?.quantity || 0;
            return total + product.price * quantity;
        }, 0).toFixed(2);
    };

    const buildProductsCartList = () => {
        return productsInformation.map((product) => {
            const quantity = customerCart[product.id]?.quantity || 0;
            const totalPrice = (product.price * quantity).toFixed(2);

            return (
                <li
                    key={product.id}
                    className="grid grid-cols-6 gap-2 border-b-1"
                >
                    <div className="col-span-1 self-center">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="rounded w-full"
                        />
                    </div>
                    <div className="flex flex-col col-span-3 pt-2">
                        <span className="text-gray-600 text-md font-semi-bold">
                            {product.name}
                        </span>
                    </div>
                    <div className="col-span-2 pt-3 flex items-center justify-between">
                        <span className="text-gray-400">
                            {`${quantity} x R$${product.price.toFixed(2).replace(".", ",")}`}
                        </span>
                        <span className="text-pink-400 font-semibold">
                            R${totalPrice.replace(".", ",")}
                        </span>
                        <button
                            onClick={() => handleRemoveItem(product.id)}
                            className="text-red-500"
                        >
                            Remover
                        </button>
                    </div>
                </li>
            );
        });
    };

    const handlePlaceOrder = () => {
        const orderDetails = {
            USER_ID,
            products: productsInformation.map((product) => ({
                productId: product.id,
                quantity: customerCart[product.id]?.quantity || 0,
            })),
        };

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(orderDetails),
        };

        fetch(`${BACKEND_SERVER_URL}/orders`, options)
            .then(async (response) => {
                const { data, err } = await response.json();

                if (err) {
                    alert("Erro ao finalizar pedido: " + err);
                    return;
                }

                alert("Pedido finalizado com sucesso!");
                localStorage.removeItem("customerCart");
                window.location.href = "/";
            })
            .catch((err) => {
                console.error("Erro ao finalizar pedido:", err.message);
                alert("Erro inesperado ao finalizar pedido.");
            });
    };

    return (
        <div className="h-screen grid grid-cols-3">
            <div className="lg:col-span-2 col-span-3 bg-indigo-50 space-y-8 px-12">
                <div className="mt-8 p-4 bg-white shadow rounded-md">
                    <h2 className="text-lg font-semibold text-gray-700">Checkout</h2>
                </div>
                <div>
                    <h2 className="uppercase text-lg font-semibold">Informações do cliente</h2>
                    <div>
                        <p>Nome: {customerInformation.name}</p>
                        <p>Email: {customerInformation.email}</p>
                    </div>
                </div>
                <div>
                    <h2 className="uppercase text-lg font-semibold">Resumo do pedido</h2>
                    {buildProductsCartList()}
                    <div>
                        <strong>Total: R${calcOrderTotal().replace(".", ",")}</strong>
                    </div>
                </div>
                <button onClick={handlePlaceOrder} className="bg-pink-400 text-white px-4 py-2 rounded">
                    Finalizar Pedido
                </button>
            </div>
        </div>
    );
}

export default Checkout;