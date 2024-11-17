import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  
  const cartItemCount = useLiveQuery(
    async () => {
      if (user?.role === 'user') {
        const items = await db.cart.where('userId').equals(user.id).toArray();
        return items.reduce((sum, item) => sum + item.quantity, 0);
      }
      return 0;
    },
    [user]
  );

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold tracking-tight hover:text-blue-100">
            E-Shop
          </Link>
          <div className="flex items-center gap-6">
            {user ? (
              <>
                <span className="text-blue-100">Welcome, {user.username}</span>
                {user.role === 'admin' && (
                  <Link to="/admin" className="hover:text-blue-100 font-medium">
                    Admin Panel
                  </Link>
                )}
                {user.role === 'user' && (
                  <Link to="/cart" className="relative hover:text-blue-100">
                    <ShoppingCartIcon className="h-6 w-6" />
                    {cartItemCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {cartItemCount}
                      </span>
                    )}
                  </Link>
                )}
                <button 
                  onClick={logout}
                  className="bg-blue-700 hover:bg-blue-600 px-4 py-2 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login"
                  className="hover:text-blue-100 font-medium"
                >
                  Login
                </Link>
                <Link 
                  to="/register"
                  className="bg-blue-700 hover:bg-blue-600 px-4 py-2 rounded-lg transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}