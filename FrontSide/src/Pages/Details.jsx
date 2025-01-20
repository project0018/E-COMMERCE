import { Label, Spinner, Button } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProjectSection from "../Component/ProjectSection";
import ProductCard from "../Component/ProductCard";

export default function Details() {
  const { userDetail } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [detail, setDetail] = useState(null);
  const [userProducts, setUserProducts] = useState([]);
  
  
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`/api/product/getproducts?userId=${userDetail}`);
        const data = await res.json();
        if (res.ok) {
          setUserProducts(data.products);
        }
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchProducts();
  }, [userDetail]);
  

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/user/getusers?userId=${userDetail}`);
        const data = await res.json();
        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }
        if (res.ok) {
          setDetail(data.detail[0]);
          setLoading(false);
          setError(false);
        }
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchDetail();
  }, [userDetail]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <Spinner size="xl" />
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 flex items-center justify-center p-6 flex-col">
      <div className="bg-white shadow-xl w-full max-w-5xl p-10 grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fadeIn">
        <div className="flex flex-col items-center text-center">
          <Label className="text-2xl font-extrabold text-gray-700 mb-6">
            Profile Image
          </Label>
          <div className="h-64 w-full relative group">
            <img
              src={detail && detail.profilePicture}
              alt="User Profile"
              className="rounded-xl border-4 border-purple-400 shadow-lg h-150 w-30 object-cover transition-transform duration-300 hover:scale-105 hover:rotate-2"
            />
          </div>
        </div>
        <div className="space-y-8 w-full">
          <div>
            <Label className="block text-lg font-bold text-gray-600">
              Name :
            </Label>
            <p className="text-xl font-bold text-gray-800">
              {detail && detail.username}
            </p>
          </div>
          <div>
            <Label className="block text-lg font-bold text-gray-600">
              Email :
            </Label>
            <p className="text-gray-700 text-lg">{detail && detail.email}</p>
          </div>
          <div>
            <Label className="block text-lg font-bold text-gray-600">
              Address :
            </Label>
            <p className="text-gray-700 text-lg">{detail && detail.address}</p>
          </div>
          <div>
            <Label className="block text-lg font-bold text-gray-600">
              Company Name :
            </Label>
            <p className="text-gray-700 text-lg">
              {detail && detail.companyname}
            </p>
          </div>
          <div>
            <Label className="block text-lg font-bold text-gray-600">
              Description :
            </Label>
            <p className="text-gray-700 text-lg">
              {detail && detail.description}
            </p>
          </div>
          <div>
            <Label className="block text-lg font-bold text-gray-600">
              Phone Number :
            </Label>
            <p className="text-gray-700 text-lg">
              {detail && detail.contactno}
            </p>
          </div>
        </div>
      </div>
      <div className="bg-white shadow-xl w-full max-w-5xl p-10 grid grid-cols-1">
        <ProjectSection 
        key={detail._id}
        projectId={detail._id}/>
        <div>
  <div>
    { detail.role=='seller' && userProducts.length > 0 ? (
      <>
      <h1 className="text-2xl font-bold mb-6 text-gray-700">Product Details</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {userProducts.map((product) => (
          <div
            key={product._id}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
      </>
    ) : (
      <>
      </>
    )}
  </div>
</div>

</div>
</div>
  );
}
