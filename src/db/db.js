import Dexie from 'dexie';

export const db = new Dexie('ecommerceDB');

db.version(1).stores({
  users: '++id, username, password, role',
  products: '++id, title, price, image, description',
  cart: '++id, userId, productId, quantity'
});

// Initialize admin account if it doesn't exist
const initializeAdmin = async () => {
  const adminExists = await db.users.where('username').equals('admin').count();
  if (adminExists === 0) {
    await db.users.add({
      username: 'admin',
      password: 'admin123',
      role: 'admin'
    });
  }
};

initializeAdmin();