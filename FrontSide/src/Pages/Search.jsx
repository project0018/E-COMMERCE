import { Button, Label, Select, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProductCard from '../Component/ProductCard';

export default function Search() {
  const [data, setData] = useState({
    searchTerm: '',
    category: 'uncategorized',
  });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSearch, setShowSearch] = useState(false); // State to toggle search form
 
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm') || '';
    const categoryFromUrl = urlParams.get('category') || 'uncategorized';

    setData({
      searchTerm: searchTermFromUrl,
      category: categoryFromUrl,
    });

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const searchQuery = location.search ? location.search : '';
        const res = await fetch(`/api/product/getproducts${searchQuery}`);
        if (res.ok) {
          const data = await res.json();
          setProducts(data.products);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [location.search]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setData((prev) => ({
      ...prev,
      [id]: id === 'category' && !value ? 'uncategorized' : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    if (data.searchTerm) urlParams.set('searchTerm', data.searchTerm);
    if (data.category !== 'uncategorized') urlParams.set('category', data.category);
    navigate(`/search?${urlParams.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Button to Show Search Form */}
      <div className="flex justify-center py-4">
        <Button
          gradientDuoTone="purpleToPink"
          onClick={() => setShowSearch((prev) => !prev)} // Toggle state
          className="hover:scale-105 transform transition-transform duration-300"
        >
          {showSearch ? 'Hide Filter' : 'Show Filter'}
        </Button>
      </div>

      {/* Search Form Container */}
      {showSearch && (
        <div
          className={`w-full bg-gradient-to-r from-purple-500 to-pink-500 py-8 px-4 md:px-10 flex justify-center items-center shadow-lg transition-all duration-500`}
        >
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-5xl bg-white p-6 rounded-lg shadow-md flex flex-col gap-4 md:flex-row md:items-end"
          >
            <div className="flex-1">
              <Label htmlFor="searchTerm" className="text-gray-700 font-semibold">
                Search Term
              </Label>
              <TextInput
                id="searchTerm"
                value={data.searchTerm}
                onChange={handleChange}
                placeholder="Enter product name..."
                className="w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 transition-all"
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="category" className="text-gray-700 font-semibold">
                Category
              </Label>
              <Select
                id="category"
                value={data.category}
                onChange={handleChange}
                className="w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 transition-all"
              >
                <option value="uncategorized">Select the Category</option>
                <option value="stone">Rock Stone</option>
                <option value="sand">Sand</option>
                <option value="steel">Steel</option>
                <option value="sement">Sement</option>
                <option value="electrical">Electrical</option>
                <option value="pipe">Pipes</option>
                <option value="paint">Color Paint</option>
              </Select>
            </div>
            <Button
              type="submit"
              gradientDuoTone="purpleToPink"
              className="transform hover:scale-105 transition-transform duration-300"
            >
              Filter
            </Button>
          </form>
        </div>
      )}

      {/* Product Results */}
      <div className="container mx-auto mt-8 px-4">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="w-12 h-12 border-4 border-purple-300 border-dashed rounded-full animate-spin"></div>
          </div>
        ) : products.length === 0 ? (
          <p className="text-center text-lg text-gray-500">No products found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
