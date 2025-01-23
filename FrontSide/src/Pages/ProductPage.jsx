import { Button, Spinner, Modal, Label, TextInput, Textarea } from "flowbite-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux"; // Ensure correct import
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import ReviewSection from "../Component/ReviewSection";
import ProductCard from "../Component/ProductCard";

export default function ProductPage() {
  const { currentUser } = useSelector((state) => state.user);
  const { productSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [product, setProduct] = useState(null);
  const [liked, setLiked] = useState(false);
  const [moreProducts, setMoreProducts] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [quantity, setQuantity] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/product/getproducts?slug=${productSlug}`);
        const data = await res.json();
        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }
        setProduct(data.products[0]);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productSlug]);

  useEffect(() => {
    const fetchMoreProducts = async () => {
      try {
        const res = await fetch(`/api/product/getproducts?limit=5`);
        const data = await res.json();
        if (res.ok) {
          setMoreProducts(data.products);
        }
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchMoreProducts();
  }, []);

  const toggleLike = (e) => {
    e.preventDefault();
    setLiked(!liked);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleSubmit = async () => {
    try {
      const orderDetails = {
        productId: product?._id,
        userId: currentUser?._id,
        sellerId: product?.userId,
        quantity,
        date: deliveryDate,
        address: additionalDetails,
      };

      const res = await fetch("/api/order/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderDetails),
      });

      if (!res.ok) {
        throw new Error("Failed to place the order");
      }

      const data = await res.json();
      alert("Order placed successfully:", data);

      // Reset modal and form fields
      setShowModal(false);
      setQuantity("");
      setDeliveryDate("");
      setAdditionalDetails("");
    } catch (error) {
      console.error("Error placing order:", error.message);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );

  return (
    <>
      <div className="min-h-screen flex items-center justify-center p-6 flex-col">
        <div className="bg-teal-50 p-8 rounded-lg shadow-lg max-w-5xl w-full flex flex-col md:flex-row items-start">
          <div className="md:w-1/3 w-full mb-4 md:mb-0">
            <img
              src={product && product.image}
              alt={product?.title || "Product Image"}
              className="w-full h-auto object-cover rounded-lg"
            />
          </div>

          <div className="md:w-2/3 w-full md:ml-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-semibold text-gray-800 mb-2">
                {product && product.companyname}
              </h1>
              <div
                className="cursor-pointer text-red-500 text-2xl"
                onClick={toggleLike}
              >
                {liked ? <AiFillHeart /> : <AiOutlineHeart />}
              </div>
            </div>
            <h1 className="text-2xl font-medium text-gray-700 mb-2">
              {product && product.title}
            </h1>
            <h6 className="text-red-500 line-through text-sm mb-1">
              M.R.P:₹{product && product.previousprice}
            </h6>
            <h1 className="text-green-600 font-bold text-3xl mb-1">
              ₹{product && product.price}
            </h1>

            <div className="w-full mt-6">
              <div>
                <h1 className="font-bold">Description:</h1>
                <p className="text-gray-600">{product && product.content}</p>
              </div>
            </div>
            {currentUser ? (
              currentUser.role === 'seller' ? (
                  <Button
                    className="px-4 py-2 rounded-lg mt-3 text-black text-3xl bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200"
                    onClick={handleAddToCart}
                    disabled>
                    Buy Now
                  </Button>
               ) : (
                  <Button
                   className="px-4 py-2 rounded-lg mt-3 text-black text-3xl bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200"
                   onClick={handleAddToCart}>
                   Buy Now
                  </Button>
                )
             ) : (
               <Button
                className="px-4 py-2 rounded-lg mt-3 text-black text-3xl bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200"
                disabled>
                Buy Now
              </Button>
             )}
            <ReviewSection productId={product?._id} />
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center items-center mb-5 w-full m-auto">
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5 max-w-screen-xl">
    {moreProducts &&
      moreProducts.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
  </div>
</div>


      {/* Modal */}
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <Modal.Header>Buy Now</Modal.Header>
        <Modal.Body>
          <div>
            <Label htmlFor="quantity">Quantity</Label>
            <TextInput
              id="quantity"
              type="text"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="deliveryDate">Delivery Date</Label>
            <TextInput
              id="deliveryDate"
              type="text"
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
            />
          </div>
          <div className="mt-4">
            <Label htmlFor="additionalDetails">Additional Details</Label>
            <Textarea
              id="additionalDetails"
              placeholder="Enter additional details about delivery"
              value={additionalDetails}
              onChange={(e) => setAdditionalDetails(e.target.value)}
            />
          </div>
        </Modal.Body>
        <Modal.Footer className="flex justify-center">
          <Button onClick={handleSubmit} className="bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 text-black">
            Submit
          </Button>
          <Button color="gray" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
