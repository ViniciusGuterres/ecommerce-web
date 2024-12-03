import { useEffect, useState } from "react";
import settings from "../settings.js";
import img from "../assets/box.png";

const BACKEND_SERVER_URL = settings.backendEndUrl;
const USER_ID = localStorage.getItem("customer");
const localStorageCustomerToken = localStorage.getItem("customerToken");

function Checkout() {
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
                "Authorization": `Bearer ${localStorageCustomerToken}`,
            },
        };

        fetch(`${BACKEND_SERVER_URL}/shoppingCarts?userId=${USER_ID}`, options)
            .then(async (response) => {
                const { data, err } = await response.json();

                if (err || !data) {
                    alert("Erro ao buscar carrinho: " + (err || "erro inesperado"));
                    return;
                }

                console.log("get cart response data: ", data);
                setCustomerCart(data || { items: [], price: 0 });
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
                "Authorization": `Bearer ${localStorageCustomerToken}`,
            },
            body: JSON.stringify({ userId: USER_ID }),
        };

        fetch(`${BACKEND_SERVER_URL}/cart/${productId}`, options)
            .then(async (response) => {
                const { data, err } = await response.json();

                if (err) {
                    alert("Erro ao remover item: " + err);
                    return;
                }

                setCustomerCart(data.cart || { items: [], price: 0 });
            })
            .catch((err) => {
                console.error("Erro ao remover item:", err.message);
                alert("Erro inesperado ao remover item.");
            });
    };

    const formatOrderTotal = () => {
        return customerCart?.price?.toFixed(2).replace(".", ",");
    };

    const buildProductsCartList = () => {
        const aggregatedItems = {};

        customerCart.items?.forEach((item) => {
            const { id } = item;
            if (!aggregatedItems[id]) {
                aggregatedItems[id] = { ...item, quantity: 1 };
            } else {
                aggregatedItems[id].quantity += 1;
            }
        });

        return Object.values(aggregatedItems).map(({ id, name, price, quantity }) => {
            const totalPrice = (price * quantity).toFixed(2).replace(".", ",");

            return (
                <li key={id} className="grid grid-cols-6 gap-2 border-b-1 py-2">
                    <div className="col-span-1 self-center">
                        <img
                            src={img}
                            alt={name}
                            className="rounded w-full"
                        />
                    </div>
                    <div className="flex flex-col col-span-3 pt-2">
                        <span className="text-gray-600 text-md font-semibold">
                            {name}
                        </span>
                    </div>
                    <div className="col-span-2 pt-3 flex items-center justify-between">
                        <span className="text-gray-400">
                            {`${quantity} x R$${price.toFixed(2).replace(".", ",")}`}
                        </span>
                        <span className="text-pink-400 font-semibold">
                            R${totalPrice}
                        </span>
                        <button
                            onClick={() => handleRemoveItem(id)}
                            className="text-red-500"
                        >
                            Remover
                        </button>
                    </div>
                </li>
            );
        });
    };

    const handlePlaceOrder = async (paymentMethod) => {
        if (!["credit-card", "pix"].includes(paymentMethod)) {
            alert("Método de pagamento inválido.");
            return;
        }

        const paymentEndpoint = paymentMethod === "credit-card"
            ? "/payment/credit-card"
            : "/payment/pix";

        const orderDetails = {
            userId: USER_ID,
            cartId: customerCart.id,
            totalAmount: customerCart.price,
        };

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorageCustomerToken}`,
            },
            body: JSON.stringify(orderDetails),
        };

        try {
            // Process Payment
            const paymentResponse = await fetch(`${BACKEND_SERVER_URL}${paymentEndpoint}`, options);
            const paymentResult = await paymentResponse.json();

            if (!paymentResponse.ok || paymentResult.error) {
                throw new Error(paymentResult.error || "Erro ao processar o pagamento.");
            }

            alert(`Pagamento realizado com sucesso`);

            localStorage.removeItem("customerCart");

            // go back to home
            window.location.href = "/";

        } catch (err) {
            console.error("Erro ao finalizar pedido:", err.message);
            alert(err.message);
        }
    };

    return (
        <div className="h-screen grid grid-cols-3">
            <div className="lg:col-span-2 col-span-3 bg-indigo-50 space-y-8 px-12">
                <div className="mt-8 p-4 bg-white shadow rounded-md">
                    <h2 className="text-lg font-semibold text-gray-700">Checkout</h2>
                </div>

                <div>
                    <h2 className="uppercase text-lg font-semibold">Resumo do pedido</h2>
                    <ul>{buildProductsCartList()}</ul>
                    <div>
                        <strong>Total: R${formatOrderTotal()}</strong>
                    </div>
                </div>

                <div style={{
                    display: 'flex',
                    width: '100%',
                    gap: '10px'
                }}>
                    <button
                        onClick={() => handlePlaceOrder("credit-card")}
                        className="bg-pink-400 text-white px-4 py-2 rounded"
                    >
                        Pagar com Cartão
                    </button>

                    <button
                        onClick={() => handlePlaceOrder("pix")}
                        className="bg-pink-400 text-white px-4 py-2 rounded"
                    >
                        Pagar com Pix
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Checkout;