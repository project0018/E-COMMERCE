import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Modal, Button, TextInput, Label } from "flowbite-react";

export default function DashOrderLists() {
  const [userOrders, setUserOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [userProducts, setUserProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBuyerId, setSelectedBuyerId] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  // Fetch orders for the current seller

  console.log(userOrders);
  

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`/api/order/getOrders/${currentUser._id}`);
        const data = await res.json();
        if (res.ok) {
          setUserOrders(data.orders);
        } else {
          console.error("Failed to fetch orders");
        }
      } catch (error) {
        console.error(error.message);
      }
    };

    if (currentUser?._id) {
      fetchOrders();
    }
  }, [currentUser]);

  // Fetch products for the orders
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = [];
        for (const order of userOrders) {
          const res = await fetch(`/api/product/getproducts?productId=${order.productId}`);
          if (res.ok) {
            const data = await res.json();
            products.push(data.product);
          } else {
            console.error("Failed to fetch product details");
          }
        }
        setUserProducts(products);
      } catch (error) {
        console.error(error.message);
      }
    };

    if (userOrders.length > 0) {
      fetchProducts();
    }
  }, [userOrders]);

  // Fetch all users
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

  // Fetch transactions for the current seller
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

  const openModal = (order) => {
    const product = userProducts.find((prod) => prod?._id === order?.productId);
    const matchingTransaction = transactions?.find(
      (transaction) =>
        transaction?.userId === order?.userId && transaction?.sellerId === currentUser._id
    );
    console.log(matchingTransaction._id);
    console.log(currentUser._id + " " + matchingTransaction.sellerId);
    
    
    setSelectedOrder({ order, product, matchingTransaction });
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setModalOpen(false);
  };

  const handleUserClick = (buyerId) => {
    setSelectedBuyerId(buyerId);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `/api/order/updateOrder/${selectedOrder.order._id}/${currentUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentUser.token}`, 
          },
          body: JSON.stringify({
            deliverystatus: selectedOrder.order.deliverystatus,
            paidstatus: selectedOrder.order.paidstatus,
            date: selectedOrder.order.date, // Delivery date
          }),
        }
      );

      if (response.ok) {
        const updatedOrder = await response.json();
        setUserOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === updatedOrder._id ? updatedOrder : order
          )
        );
        setModalOpen(false);
      } else {
        console.error("Failed to update the order");
      }
    } catch (error) {
      console.error("Error updating the order:", error.message);
    }
  };

  const updateTransactionDetails = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `/api/transaction/updatetransaction/${selectedOrder.matchingTransaction._id}/${currentUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            totalAmount: selectedOrder.matchingTransaction.totalAmount,
            balanceAmount: selectedOrder.matchingTransaction.balanceAmount,
            paidAmount: selectedOrder.matchingTransaction.paidAmount,
            date: selectedOrder.matchingTransaction.date,
          }),
        }
      );

      if (response.ok) {
        const updatedTransaction = await response.json();
        setTransactions((prevTransactions) =>
          prevTransactions.map((transaction) =>
            transaction._id === updatedTransaction._id
              ? updatedTransaction
              : transaction
          )
        );
        setModalOpen(false);
      } else {
        console.error("Failed to update the transaction");
      }
    } catch (error) {
      console.error("Error updating the transaction:", error.message);
    }
  };

  const filteredOrders = userOrders.filter(
    (order) =>
      order.sellerId === currentUser._id &&
      (!selectedBuyerId || order.userId === selectedBuyerId)
  );

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="md:w-1/3 lg:w-1/4 bg-gray-100 p-4">
        <h1 className="text-xl font-bold text-gray-800 mb-4">Buyer List</h1>
        <div className="space-y-4">
          {users
            .filter((user) => user.role === "buyer")
            .map((user) => (
              <div
                key={user._id}
                className={`flex items-center p-2 bg-white shadow rounded-lg cursor-pointer hover:bg-gray-200 ${
                  selectedBuyerId === user._id ? "ring-2 ring-blue-500" : ""
                }`}
                onClick={() => handleUserClick(user._id)}
              >
                <img
                  src={user.profilePicture || "/placeholder-image.png"}
                  alt={user.username}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <h3 className="text-lg font-bold text-gray-800">{user.username}</h3>
              </div>
            ))}
        </div>
      </div>

      <div className="md:w-2/3 lg:w-3/4 p-4 overflow-y-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Order Details</h1>
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-3">
  {filteredOrders.map((order) => {
    const product = userProducts.find((prod) => prod._id === order.productId);
    return (
      <div
        key={order?._id}
        className="shadow-lg rounded-lg p-2 bg-white cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300"
        onClick={() => openModal(order)}
      >
        <img
          src={product?.image || "/placeholder-image.png"}
          alt={product?.title || "Unknown Product"}
          className="w-full h-48 object-cover rounded-md mb-4"
        />
        <h3 className="text-lg font-bold text-gray-800 mb-2">
          {product?.title || "Unknown Product"}
        </h3>
        <p className="text-gray-600 mb-1">Price: {product?.price}</p>
        <p className="text-gray-600">Delivery Status: {order?.deliverystatus}</p>
      </div>
    );
  })}
</div>

      </div>

      {modalOpen && selectedOrder && (
        <Modal show={modalOpen} onClose={closeModal}>
          <Modal.Header>Order & Transaction Details</Modal.Header>
          <Modal.Body>
            <div className="space-y-4">
              <div>
                <img src={selectedOrder.product?.image || "/placeholder-image.png"} 
                     alt="Product" className="w-full h-48 object-cover rounded-md mb-2" />
              </div>
              <h3 className="text-lg font-bold">
                {selectedOrder.product?.title || "Unknown Product"}
              </h3>
              <p>Price: {selectedOrder.product?.price || "N/A"}</p>
              <p>Quantity: {selectedOrder.order.quantity}</p>
            <form onSubmit={handleSubmit}>
              <Label>Delivery Status</Label>
              <TextInput
                label="Delivery Status"
                value={selectedOrder.order.deliverystatus}
                onChange={(e) =>
                  setSelectedOrder((prev) => ({
                    ...prev,
                    order: { ...prev.order, deliverystatus: e.target.value },
                  }))
                }
              />
              <Label>Paid Status</Label>
              <TextInput
                label="Paid Status"
                value={selectedOrder.order.paidstatus}
                onChange={(e) =>
                  setSelectedOrder((prev) => ({
                    ...prev,
                    order: { ...prev.order, paidstatus: e.target.value },
                  }))
                }
              />
              <Label>Ordered Date:</Label>
              <TextInput 
              label="orderd Date"
              type="text"
              value={new Date(selectedOrder.order.createdAt).toLocaleDateString()}
              />
              <Label>Delivery Date</Label>
              <TextInput
                label="Delivery Date"
                type="text"
                value={selectedOrder.order.date}
              />
              <Button className="m-auto ml-60 mt-3 relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-red-200 via-red-300 to-yellow-200 group-hover:from-red-200 group-hover:via-red-300 group-hover:to-yellow-200 mt-3" gradientDuoTone="greenToBlue" type="submit">Update Order List</Button>
            </form>
            <form onSubmit={updateTransactionDetails}>
                {selectedOrder.matchingTransaction && (
                  <>
                    <Label>Overall Balance Amount:</Label>
                    <TextInput
                      type="text"
                      value={selectedOrder.matchingTransaction.totalAmount}
                      onChange={(e) =>
                        setSelectedOrder((prev) => ({
                          ...prev,
                          matchingTransaction: {
                            ...prev.matchingTransaction,
                            totalAmount: e.target.value,
                          },
                        }))
                      }
                    />
                    <Label>Total Amount of the Last Bill:</Label>
                    <TextInput
                      type="text"
                      value={selectedOrder.matchingTransaction.paidAmount}
                      onChange={(e) =>
                        setSelectedOrder((prev) => ({
                          ...prev,
                          matchingTransaction: {
                            ...prev.matchingTransaction,
                            paidAmount: e.target.value,
                          },
                        }))
                      }
                    />
                    <Label>Remaining Balance:</Label>
                    <TextInput
                      type="text"
                      value={selectedOrder.matchingTransaction.balanceAmount}
                      onChange={(e) =>
                        setSelectedOrder((prev) => ({
                          ...prev,
                          matchingTransaction: {
                            ...prev.matchingTransaction,
                            balanceAmount: e.target.value,
                          },
                        }))
                      }
                    />
                    <Label>Last Amount Paid Date:</Label>
                    <TextInput
                      type="text"
                      value={selectedOrder.matchingTransaction.date}
                      onChange={(e) =>
                        setSelectedOrder((prev) => ({
                          ...prev,
                          matchingTransaction: {
                            ...prev.matchingTransaction,
                            date: e.target.value,
                          },
                        }))
                      }
                    />
                    <Button className="m-auto ml-60 mt-3 relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-red-200 via-red-300 to-yellow-200 group-hover:from-red-200 group-hover:via-red-300 group-hover:to-yellow-200" type="submit">Update Transaction</Button>
                  </>
                )}
              </form>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300" onClick={closeModal}>Close</Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}
