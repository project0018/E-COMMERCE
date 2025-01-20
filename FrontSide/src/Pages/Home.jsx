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
      <div className="w-full p-5 h-[450px] sm:h-[300px] lg:h-[550px] 2xl:h-[650px] mb-12">
        <Carousel>
          <img
            src="https://us.123rf.com/450wm/ideyweb/ideyweb1503/ideyweb150300025/37771784-flat-design-vector-concept-illustration-with-icons-of-building-construction-urban-landscape-and.jpg?ver=6"
            alt="Slide 1"
            className="w-full h-full object-fill"
          />
          <img
            src="https://us.123rf.com/450wm/macrovectorart/macrovectorart2102/macrovectorart210200291/164078802-construction-industry-house-building-stages-elements-flat-design-vector-illustration.jpg?ver=6"
            alt="Slide 2"
            className="w-full h-full object-fill"
          />
          <img
            src="https://us.123rf.com/450wm/macrovectorart/macrovectorart2103/macrovectorart210301082/164944398-flat-construction-design-concept-with-hand-holding-magnifier-building-elements-tools-equipment-and.jpg?ver=6"
            alt="Slide 3"
            className="w-full h-full object-fill"
          />
          <img
            src="https://us.123rf.com/450wm/macrovector/macrovector1405/macrovector140500294/28133584-logistic-pointing-hand-and-delivery-network-chain-concept-vector-illustration.jpg?ver=6"
            alt="Slide 4"
            className="w-full h-full object-fill"
          />
          <img
            src="https://us.123rf.com/450wm/vmaster2012/vmaster20121409/vmaster2012140900039/31424768-delivery-truck-sign-icon-cargo-van-symbol-and-cloud-on-abstract-colorful-watercolor-background-with.jpg?ver=6"
            alt="Slide 5"
            className="w-full h-full object-fill"
          />
          <img
            src="https://us.123rf.com/450wm/yupiramos/yupiramos1503/yupiramos150303159/37306550-delivery-design-over-blue-background-vector-illustration.jpg?ver=6"
            alt="Slide 6"
            className="w-full h-full object-fill"
          />
        </Carousel>
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
