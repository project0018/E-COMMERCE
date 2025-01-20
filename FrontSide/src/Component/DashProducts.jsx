import { Button, Modal, Table } from 'flowbite-react';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

export default function DashProducts() {
  const { currentUser } = useSelector((state) => state.user);
  const [userProducts, setUserProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState('');
console.log(userProducts);

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
      const res = await fetch(`/api/product/deleteproduct/${productIdToDelete}/${currentUser._id}`,
        {
          method: 'DELETE',
        }
      );
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setUserProducts((prev) =>
          prev.filter((product) => product._id !== productIdToDelete)
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="p-4 w-full">
      {currentUser?.role === "seller" && userProducts.length > 0 ? (
        <div className="overflow-x-auto">
          <Table hoverable className="w-full border-collapse">
            <Table.Head className="bg-transparent">
              <Table.HeadCell className='bg-gray-600 text-white'>Date Updated</Table.HeadCell>
              <Table.HeadCell className='bg-gray-600 text-white'>Product Image</Table.HeadCell>
              <Table.HeadCell className='bg-gray-600 text-white'>Product Title</Table.HeadCell>
              <Table.HeadCell className='bg-gray-600 text-white'>Category</Table.HeadCell>
              <Table.HeadCell className='bg-gray-600 text-white'>Delete</Table.HeadCell>
              <Table.HeadCell className='bg-gray-600 text-white'>Edit</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y border border-b-3">
              {userProducts.map((product) => (
                <Table.Row key={product._id} className="bg-transparent">
                  <Table.Cell>{new Date(product.updatedAt).toLocaleDateString()}</Table.Cell>
                  <Table.Cell>
                    <img
                      src={product.image || 'https://via.placeholder.com/150'}
                      alt={product.title}
                      className="w-20 h-10 object-cover"
                    />
                  </Table.Cell>
                  <Link to={`/product/${product.slug}`}><Table.Cell>{product.title}</Table.Cell></Link>
                  <Table.Cell>{product.category}</Table.Cell>
                  <Table.Cell>
                    <span  onClick={() => {
                      setShowModal(true);
                      setProductIdToDelete(product._id);
                    }} className="text-red-500 cursor-pointer hover:underline">Delete</span>
                  </Table.Cell>
                  <Table.Cell>
                    <Link className='text-teal-500 hover:underline' to={`/updateproduct/${product._id}`}><span>Edit</span></Link>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      ) : (
        <p>You have no posts yet!</p>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size='md'
      >
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
              Are you sure you want to delete this post?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeleteProduct }>
                Yes, I'm sure
              </Button>
              <Button color='gray' onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
