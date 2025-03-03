import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Modal, Button } from "flowbite-react";

export default function Order() {
  const [userOrders, setUserOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [userProducts, setUserProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSellerId, setSelectedSellerId] = useState(null);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`/api/order/getOrders/${currentUser._id}`);
        const data = await res.json();
        if (res.ok) {
          setUserOrders(data.orders);
        } else {
          setError("Failed to fetch orders");
        }
      } catch (error) {
        setError(error.message);
      }
    };

    if (currentUser?._id) {
      fetchOrders();
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchProducts = async () => {
      const products = [];
      try {
        for (const order of userOrders) {
          const res = await fetch(`/api/product/getproducts?productId=${order.productId}`);
          if (res.ok) {
            const data = await res.json();
            products.push(data.product);
          } else {
            products.push({
              title: "Unknown Product",
              image: "",
              _id: order.productId,
              price: 0,
            });
          }
        }
        setUserProducts(products);
      } catch (error) {
        console.error("Error fetching product details:", error.message);
      }
    };

    if (userOrders.length > 0) {
      fetchProducts();
    }
  }, [userOrders]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`/api/user/getusers`);
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
        }
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetch(`/api/transaction/gettransactions/${currentUser._id}`);
        const data = await res.json();
        if (res.ok) {
          setTransactions(data);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error.message);
      }
    };

    if (currentUser?._id) {
      fetchTransactions();
    }
  }, [currentUser]);

  useEffect(() => {
    const checkAndCreateTransaction = async () => {
      for (const order of userOrders) {
        const matchingProduct = userProducts.find(
          (product) =>
            product._id === order.productId && product.userId === order.sellerId
        );

        if (matchingProduct) {
          const sellerId = order.sellerId;

          // Check if there's an existing transaction for this user and seller combination
          const existingTransaction = transactions.find(
            (transaction) =>
              transaction.sellerId === sellerId &&
              transaction.userId === currentUser._id
          );

          if (existingTransaction) {
            console.log("Existing Transaction:", existingTransaction);
            // Skip creating a new transaction if one exists
            continue;
          } else {
            // Create a new transaction only if it doesn't exist
            try {
              const res = await fetch("/api/transaction/createtransaction", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  userId: currentUser._id,
                  sellerId,
                  totalAmount: matchingProduct.price.toString(), // Use the product's price directly
                }),
              });

              if (res.ok) {
                const newTransaction = await res.json();
                setTransactions((prev) => [...prev, newTransaction]);
                console.log("New transaction created successfully:", newTransaction);
              } else {
                const errorData = await res.json();
                console.error("Failed to create transaction:", errorData);
              }
            } catch (error) {
              console.error("Error creating transaction:", error.message);
            }
          }
        }
      }
    };

    // Run transaction logic only if there are new orders or products
    if (userOrders.length > 0 && userProducts.length > 0) {
      checkAndCreateTransaction();
    }
  }, [userOrders, userProducts, currentUser._id, transactions]);

  const openModal = (order) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setModalOpen(false);
  };

  const filteredOrders =
    selectedSellerId && userOrders.length > 0 && userProducts.length > 0
      ? userOrders.filter((order) => {
          const product = userProducts.find(
            (prod) =>
              prod._id === order.productId && prod.userId === selectedSellerId
          );
          return product && order.sellerId === selectedSellerId;
        })
      : userOrders;

  const handleUserClick = (sellerId) => {
    setSelectedSellerId(sellerId);
  };

  const getTransactionDetails = (sellerId) => {
    return transactions.find(
      (transaction) =>
        transaction.sellerId === sellerId && transaction.userId === currentUser._id
    );
  };

  if (error) {
    return <p>Error loading orders: {error}</p>;
  }

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Left Side - User Details */}
      <div className="md:w-1/3 lg:w-1/4 bg-gray-100 p-4">
        <h1 className="text-xl font-bold text-gray-800 mb-4">Seller List</h1>
        <div className="space-y-4">
          {users
            .filter((user) => user.role === "seller")
            .map((user) => (
              <div
                key={user._id}
                className={`flex items-center p-2 bg-white shadow rounded-lg cursor-pointer hover:bg-gray-200 ${
                  selectedSellerId === user._id ? "ring-2 ring-blue-500" : ""
                }`}
                onClick={() => handleUserClick(user._id)}
              >
                <img
                  src={user.profilePicture || "/placeholder-image.png"}
                  alt={user.username}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <h3 className="text-lg font-bold text-gray-800">
                  {user.username}
                </h3>
              </div>
            ))}
        </div>
      </div>

      {/* Right Side - Order Details */}
      <div className="md:w-2/3 lg:w-3/4 p-4 overflow-y-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Order Details</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredOrders.map((order) => {
            const product = userProducts.find(
              (prod) => prod._id === order.productId
            );
            const transaction = getTransactionDetails(order.sellerId);

            return (
              <div
                key={order._id}
                className="shadow-md rounded-lg p-2 cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300"
                onClick={() => openModal({ order, product, transaction })}
              >
                <img
                  src={product?.image || "/placeholder-image.png"}
                  alt={product?.title || "Unknown Product"}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
                <h3 className="text-lg font-bold text-gray-800">
                  {product?.title || "Unknown Product"}
                </h3>
                <p className="text-gray-600">Price: {product?.price || "N/A"}</p>
                <p className="text-gray-600">Delivery Status: {order?.deliverystatus}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {modalOpen && selectedOrder && (
        <Modal show={modalOpen} onClose={closeModal}>
          <Modal.Header>Order & Transaction Details</Modal.Header>
          <Modal.Body>
            <div className="space-y-4">
              <div>
                <img
                  src={selectedOrder.product?.image || "/placeholder-image.png"}
                  alt={selectedOrder.product?.title || "Unknown Product"}
                  className="w-full h-64 object-cover rounded-md mb-4"
                />
              </div>
              <h3 className="text-lg font-bold">
                {selectedOrder.product?.title || "Unknown Product"}
              </h3>
              <p>Price: {selectedOrder.product?.price || "N/A"}</p>
              <p>Quantity: {selectedOrder.order?.quantity}</p>
              <p>Paid Status: {selectedOrder.order?.paidstatus}</p>
              <p>Delivery Status: {selectedOrder.order?.deliverystatus}</p>
              <p>Delivery Date: {selectedOrder.order?.date || "N/A"}</p>
              {selectedOrder.transaction && (
                <>
                  <h3 className="text-lg font-bold mt-4">Transaction Details</h3>
                  <p>Total Amount: {selectedOrder.transaction.totalAmount}</p>
                  <p>Paid Amount: {selectedOrder.transaction.paidAmount}</p>
                  <p>Balance Amount: {selectedOrder.transaction.balanceAmount}</p>
                  <p>
                    Transaction Date:{" "}
                    {new Date(selectedOrder.transaction.createdAt).toLocaleDateString()}
                  </p>
                </>
              )}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button className="text-black" onClick={closeModal}>Close</Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}
