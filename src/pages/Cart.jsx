import { useContext } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import { AuthContext } from '../context/AuthContext';
import { TrashIcon } from '@heroicons/react/24/outline';

export default function Cart() {
  const { user } = useContext(AuthContext);

  const cartItems = useLiveQuery(
    () => db.cart
      .where('userId').equals(user.id)
      .toArray()
      .then(async items => {
        const itemsWithDetails = await Promise.all(
          items.map(async item => {
            const product = await db.products.get(item.productId);
            return { ...item, product };
          })
        );
        return itemsWithDetails;
      }),
    [user.id]
  );

  const removeFromCart = async (id) => {
    await db.cart.delete(id);
  };

  const updateQuantity = async (id, quantity) => {
    if (quantity < 1) return;
    await db.cart.update(id, { quantity });
  };

  const total = cartItems?.reduce((sum, item) => 
    sum + (item.product.price * item.quantity), 0) || 0;

  if (!cartItems?.length) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Your Cart</h1>
        <p className="text-gray-600">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Your Cart</h1>
      
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {cartItems.map(item => (
          <div key={item.id} className="flex items-center p-6 border-b border-gray-200 last:border-0">
            <img
              src={item.product.image}
              alt={item.product.title}
              className="w-24 h-24 object-cover rounded-lg"
            />
            <div className="flex-1 ml-6">
              <h3 className="text-xl font-semibold text-gray-800">{item.product.title}</h3>
              <p className="text-blue-600 font-bold">${item.product.price}</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-10 h-10 flex items-center justify-center text-xl font-bold bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                >
                  -
                </button>
                <span className="w-12 text-center text-xl font-semibold">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center text-xl font-bold bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                >
                  +
                </button>
              </div>
              <p className="font-bold text-lg w-24 text-right">
                ${(item.product.price * item.quantity).toFixed(2)}
              </p>
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-500 hover:text-red-600 p-2"
              >
                <TrashIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        ))}
        
        <div className="p-6 bg-gray-50">
          <div className="flex justify-between items-center">
            <span className="text-xl font-semibold text-gray-800">Total</span>
            <span className="text-2xl font-bold text-blue-600">
              ${total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}