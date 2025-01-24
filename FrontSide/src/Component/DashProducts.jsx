import { Button, Modal } from 'flowbite-react';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

export default function DashProducts() {
  const { currentUser } = useSelector((state) => state.user);
  const [userProducts, setUserProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`/api/product/getproducts?userId=${currentUser._id}`);
        const data = await res.json();
        if (res.ok) {
          setUserProducts(data.products);
        }
      } catch (error) {
        console.error(error.message);
      }
    };

    if (currentUser?.role === "seller") {
      fetchProducts();
    }
  }, [currentUser]);

  const handleDeleteProduct = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/product/deleteproduct/${productIdToDelete}/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok) {
        setUserProducts((prev) =>
          prev.filter((product) => product._id !== productIdToDelete)
        );
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="p-4 w-full">
      {currentUser?.role === "seller" && userProducts.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-600 text-white">
              <tr>
                <th className="p-2 border border-gray-300">Date Updated</th>
                <th className="p-2 border border-gray-300">Product Image</th>
                <th className="p-2 border border-gray-300">Product Title</th>
                <th className="p-2 border border-gray-300">Category</th>
                <th className="p-2 border border-gray-300">Delete</th>
                <th className="p-2 border border-gray-300">Edit</th>
              </tr>
            </thead>
            <tbody>
              {userProducts.map((product) => (
                <tr key={product._id} className="text-center bg-white hover:bg-gray-100">
                  <td className="p-2 border border-gray-300">{new Date(product.updatedAt).toLocaleDateString()}</td>
                  <td className="p-2 border border-gray-300">
                    <img
                      src={product.image || 'https://via.placeholder.com/150'}
                      alt={product.title}
                      className="w-20 h-10 object-cover mx-auto"
                    />
                  </td>
                  <td className="p-2 border border-gray-300">
                    <Link to={`/product/${product.slug}`} className="text-blue-500 hover:underline">
                      {product.title}
                    </Link>
                  </td>
                  <td className="p-2 border border-gray-300">{product.category}</td>
                  <td className="p-2 border border-gray-300">
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setProductIdToDelete(product._id);
                      }}
                      className="text-red-500 cursor-pointer hover:underline"
                    >
                      Delete
                    </span>
                  </td>
                  <td className="p-2 border border-gray-300">
                    <Link to={`/updateproduct/${product._id}`} className="text-teal-500 hover:underline">
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>You have no products yet!</p>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this post?
            </h3>
            <div className="flex justify-center gap-4">
              <Button className='text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm text-center' onClick={handleDeleteProduct}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
