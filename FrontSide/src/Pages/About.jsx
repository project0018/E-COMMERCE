import React from 'react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 py-10 shadow-md">
        <h1 className="text-4xl text-white font-bold text-center sm:text-5xl">
          Simplify Your Supply Chain Management
        </h1>
        <p className="text-white text-center mt-2 text-lg sm:text-xl">
          Empowering small businesses with streamlined, modern technology.
        </p>
      </header>

      {/* About Section */}
      <section className="max-w-7xl mx-auto p-6 sm:p-10">
        <div className="bg-white shadow-lg rounded-lg p-8 sm:p-12">
          <h2 className="text-2xl font-bold text-gray-800 sm:text-3xl">
            About the Project
          </h2>
          <p className="text-gray-600 mt-4 text-lg leading-relaxed">
            Our web-based application is built to revolutionize supply chain management for small businesses. 
            Entrepreneurs often face challenges such as inefficiency, delays, and high operational costs. 
            This platform is tailored to meet their unique needs by providing real-time data visibility, 
            process automation, and intuitive tools that require no advanced technical expertise.
          </p>
          <p className="text-gray-600 mt-4 text-lg leading-relaxed">
            Designed with scalability and simplicity in mind, our solution integrates inventory tracking, 
            order management, and shipment updates in one unified interface. This ensures that businesses 
            can operate efficiently, minimize errors, and keep customers satisfied. Whether you're managing 
            a local store or scaling up to handle multiple locations, this platform grows with your business.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-100 py-10">
        <h2 className="text-3xl font-bold text-center text-gray-800 sm:text-4xl">
          Features
        </h2>
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-6 mt-8">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-semibold text-blue-600">
              Inventory Management
            </h3>
            <p className="text-gray-600 mt-2">
              Stay on top of your stock levels effortlessly. Our platform provides detailed reports on inventory 
              movements, low-stock alerts, and insights to help optimize storage space. With real-time updates, 
              you'll never run out of essential items again.
            </p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-semibold text-purple-600">
              Order Management
            </h3>
            <p className="text-gray-600 mt-2">
              Simplify customer order tracking from placement to fulfillment. Manage bulk orders, process 
              payments seamlessly, and ensure timely communication with clients. Customizable order statuses 
              help you keep both your team and customers informed.
            </p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-semibold text-pink-600">
              Shipment Tracking
            </h3>
            <p className="text-gray-600 mt-2">
              Monitor your deliveries in real time with our shipment tracking feature. Get instant updates on 
              delivery schedules, locations, and potential delays. Keep your customers informed with automated 
              delivery notifications for an enhanced user experience.
            </p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-semibold text-green-600">
              Customizable Reports
            </h3>
            <p className="text-gray-600 mt-2">
              Access analytics that matter to you. Generate customizable reports on sales trends, stock 
              efficiency, and delivery performance. Make data-driven decisions to grow your business.
            </p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-semibold text-indigo-600">
              Integration Ready
            </h3>
            <p className="text-gray-600 mt-2">
              Seamlessly integrate with third-party tools such as payment gateways, CRM platforms, and 
              e-commerce systems. Simplify your operations with our plug-and-play integrations.
            </p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-semibold text-yellow-600">
              Mobile-Friendly Design
            </h3>
            <p className="text-gray-600 mt-2">
              Manage your supply chain on the go with our mobile-friendly interface. Stay connected and 
              in control, whether you're in the office or on-site.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-10">
        <h2 className="text-3xl font-bold text-center text-gray-800 sm:text-4xl">
          Benefits
        </h2>
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-6 mt-8">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-semibold text-blue-600">
              Increased Efficiency
            </h3>
            <p className="text-gray-600 mt-2">
              Save time by automating repetitive tasks, reducing manual entry, and eliminating errors 
              from outdated systems.
            </p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-semibold text-purple-600">
              Cost Savings
            </h3>
            <p className="text-gray-600 mt-2">
              Reduce operational costs by improving inventory turnover, cutting down on waste, and avoiding 
              overstocking or understocking issues.
            </p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-semibold text-pink-600">
              Enhanced Customer Satisfaction
            </h3>
            <p className="text-gray-600 mt-2">
              Ensure on-time delivery and clear communication, which leads to happy customers and repeat business.
            </p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-semibold text-green-600">
              Real-Time Visibility
            </h3>
            <p className="text-gray-600 mt-2">
              Access real-time updates on inventory levels, order statuses, and shipment progress, empowering 
              you to make informed decisions quickly.
            </p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-semibold text-indigo-600">
              Scalability
            </h3>
            <p className="text-gray-600 mt-2">
              Start small and grow with the platform. Our application adapts to your business size and complexity.
            </p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-semibold text-yellow-600">
              Improved Team Collaboration
            </h3>
            <p className="text-gray-600 mt-2">
              Keep your team aligned with centralized communication, task assignments, and shared progress updates.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-gray-100 py-10">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8 sm:p-12">
          <h2 className="text-2xl font-bold text-gray-800 sm:text-3xl">
            Contact Us
          </h2>
          <ul className="mt-4 space-y-3 text-gray-600">
            <li>
              <strong>Email:</strong> <a href="mailto:Vairavanm44@gmail.com" className="text-blue-600 underline">Vairavanm44@gmail.com</a>
            </li>
            <li>
              <strong>Phone:</strong> <a href="tel:+8681874354" className="text-blue-600 underline">8681874354</a>
            </li>
            <li>
              <strong>Address:</strong>
              <p>Kamaraj Nagar, Theni Main Road, Kamatchipuram</p>
            </li>
          </ul>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="py-10 text-center">
        <h2 className="text-3xl font-bold text-gray-800 sm:text-4xl">
          Get Started Today!
        </h2>
        <p className="text-gray-600 mt-2 text-lg">
          Take control of your supply chain management now.
        </p>
        <div className="mt-6 space-x-4">
          <Link to="/sign-up">
            <button className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600">
              Sign Up
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
