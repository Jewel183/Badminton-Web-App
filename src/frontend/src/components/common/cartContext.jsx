import { createContext, useContext, useState, useEffect } from "react";
import { fetchCart } from "../../services";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState({ items: [], totalQuantity: 0 });

    const updateCart = async () => {
        try {
            const data = await fetchCart();
            setCart(data);
        } catch (err) {
            console.error("Cập nhật giỏ hàng lỗi: ", err)
        }
    };

    useEffect(() => {
        updateCart();
    }, []);

    return (
        <CartContext.Provider value={{ cart, setCart, updateCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);