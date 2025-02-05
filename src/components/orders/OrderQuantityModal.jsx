import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function OrderQuantityModal({ product, onSave, onClose }) {
  const [quantity, setQuantity] = useState(product.quantity || 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...product, quantity: Number(quantity) });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>

        {/* Modal */}
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Mahsulot sonini kiriting
              </h3>

              <div className="space-y-4">
                {/* Product Info */}
                <div className="flex items-center space-x-4">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="h-16 w-16 rounded-lg object-cover"
                  />
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{product.name}</h4>
                    <p className="text-sm text-gray-500">{product.price.toLocaleString()} so'm</p>
                  </div>
                </div>

                {/* Quantity Input */}
                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                    Soni
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    id="quantity"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  />
                </div>

                {/* Total */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Jami:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {(product.price * quantity).toLocaleString()} so'm
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-3 rounded-b-lg">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
              >
                Bekor qilish
              </button>
              <button
                type="submit"
                className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
              >
                Saqlash
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
