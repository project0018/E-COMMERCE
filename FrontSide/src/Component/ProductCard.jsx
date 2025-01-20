import React from 'react';
import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  return (
    <div className="group relative w-100 border border-teal-500 rounded-lg overflow-hidden h-[350px] transition-all duration-300 hover:shadow-lg">
      <Link to={`/product/${product.slug}`} className="block w-full h-full">
        <div className="relative w-full h-[70%] overflow-hidden">
          <img
            src={product.image}
            alt={product.title}
            className="object-cover w-full h-full transform group-hover:scale-110 group-hover:h-full transition-all duration-500"
          />
        </div>
        <div className="p-3 flex flex-col gap-2 h-[30%]">
          <p className="text-xl font-semibold line-clamp-2">{product.title}</p>
          <span className="italic text-lg text-gray-700">{product.category}</span>
        </div>
      </Link>
    </div>
  );
}
