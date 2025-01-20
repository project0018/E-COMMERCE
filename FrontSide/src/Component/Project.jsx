import { Label } from 'flowbite-react';
import React from 'react';

export default function Project({ image, title, location, description }) {
  return (
    <div className="w-full flex flex-col md:flex-row bg-white shadow-lg rounded overflow-hidden mb-6">
      <div className="w-full md:w-1/2 h-64 p-5">
        <img
          src={image}
          alt="Project"
          className="w-full h-full object-cover transition-transform duration-500 ease-in-out transform hover:scale-105"
        />
      </div>
      <div className="w-full md:w-1/2 p-6 flex flex-col justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 md:gap-y-6">
          <div>
            <Label className="text-lg font-semibold text-gray-600">Project Name:</Label>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800">{title}</h2>
          </div>
          <div>
            <Label className="text-lg font-semibold text-gray-600">Location:</Label>
          </div>
          <div>
            <p className="text-lg text-gray-600">{location}</p>
          </div>
          <div>
            <Label className="text-lg font-semibold text-gray-600">Description:</Label>
          </div>
          <div>
            <p className="text-gray-700 text-base leading-relaxed">
              {description.length > 150
                ? `${description.substring(0, 150)}...`
                : description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
