import React, { useEffect, useState } from 'react';
import ProductCard from '../Component/ProductCard';
import { Carousel } from "flowbite-react";

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/product/getProducts');
        const data = await res.json();
        setProducts(data.products);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      {/* Header */}
      <header className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 py-10 shadow-lg mb-8">
        <h1 className="text-4xl text-white font-extrabold text-center tracking-wide sm:text-5xl">
          Discover Our Exclusive Products
        </h1>
        <p className="text-white text-center mt-3 text-lg sm:text-xl">
          Curated for quality and style. Shop now and experience the difference!
        </p>
      </header>

      {/* Carousel */}
      <div className="w-full p-5 h-[650px] sm:h-[500px] lg:h-[750px] 2xl:h-[850px] mb-12">
          <img
            src="https://builtfront.com/blog/wp-content/uploads/2024/12/construction-supply-chain-management-1300x700.webp"
            alt="IMAGE"
            className="w-full h-full object-fill"
          />
      </div>

      {/* Product Grid */}
      <section className="w-full px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center sm:text-3xl">
          Our selling Products
        </h2>
        {products && products.length > 0 ? (
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transform hover:scale-105 transition-all"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-700 text-xl font-semibold">
              No products available at the moment.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
