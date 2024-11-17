import { useContext, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import { AuthContext } from '../context/AuthContext';
import Toast from '../components/Toast';

export default function Home() {
  const { user } = useContext(AuthContext);
  const products = useLiveQuery(() => db.products.toArray());
  const [showToast, setShowToast] = useState(false);
  const [selectedQuantity, setSelectedQuantity] = useState({});

  const updateQuantity = (productId, delta) => {
    const currentQty = selectedQuantity[productId] || 1;
    const newQty = Math.max(1, Math.min(10, currentQty + delta));
    setSelectedQuantity({ ...selectedQuantity, [productId]: newQty });
  };

  const addToCart = async (productId) => {
    if (!user) {
      alert('Please login to add items to cart');
      return;
    }

    const quantity = selectedQuantity[productId] || 1;
    const existingItem = await db.cart
      .where({ userId: user.id, productId })
      .first();

    if (existingItem) {
      await db.cart.update(existingItem.id, {
        quantity: existingItem.quantity + quantity
      });
    } else {
      await db.cart.add({
        userId: user.id,
        productId,
        quantity
      });
    }
    setShowToast(true);
    setSelectedQuantity({ ...selectedQuantity, [productId]: 1 });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Featured Products</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products?.map(product => (
          <div key={product.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 overflow-hidden">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover transform hover:scale-105 transition-transform"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{product.title}</h3>
              <p className="text-2xl font-bold text-blue-600 mb-4">${product.price}</p>
              <p className="text-gray-600 mb-4">{product.description}</p>
              {user?.role === 'user' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={() => updateQuantity(product.id, -1)}
                      className="w-12 h-12 flex items-center justify-center text-2xl font-bold bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                    >
                      -
                    </button>
                    <span className="w-16 text-center text-xl font-semibold">
                      {selectedQuantity[product.id] || 1}
                    </span>
                    <button
                      onClick={() => updateQuantity(product.id, 1)}
                      className="w-12 h-12 flex items-center justify-center text-2xl font-bold bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => addToCart(product.id)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors text-lg font-semibold"
                  >
                    Add to Cart
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <Toast 
        message="Added to cart successfully!"
        show={showToast}
        onHide={() => setShowToast(false)}
      />
    </div>
  );
}