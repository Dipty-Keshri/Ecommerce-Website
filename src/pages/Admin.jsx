import { useState, useEffect } from 'react';
import { db } from '../db/db';
import { useLiveQuery } from 'dexie-react-hooks';

export default function Admin() {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

  const products = useLiveQuery(() => db.products.toArray());

  const handleSubmit = async (e) => {
    e.preventDefault();
    await db.products.add({
      title,
      price: Number(price),
      description,
      image
    });
    setTitle('');
    setPrice('');
    setDescription('');
    setImage('');
  };

  const handleDelete = async (id) => {
    await db.products.delete(id);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
      
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div>
          <label className="block mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-2">Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-2">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Product
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products?.map(product => (
          <div key={product.id} className="border p-4 rounded">
            <img src={product.image} alt={product.title} className="w-full h-48 object-cover mb-2" />
            <h3 className="font-bold">{product.title}</h3>
            <p>${product.price}</p>
            <p className="text-gray-600">{product.description}</p>
            <button
              onClick={() => handleDelete(product.id)}
              className="bg-red-500 text-white px-4 py-2 rounded mt-2"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}