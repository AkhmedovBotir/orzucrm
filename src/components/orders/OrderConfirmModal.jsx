import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function OrderConfirmModal({ products, total, onConfirm, onClose }) {
  const [note, setNote] = useState('');
  const [paymentType, setPaymentType] = useState('cash'); // cash, card, transfer
  const [deliveryDate, setDeliveryDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm({
      products: products.filter(p => p.quantity > 0),
      total,
      note,
      paymentType,
      deliveryDate,
      orderDate: new Date().toISOString(),
      status: 'new' // new, confirmed, delivered, cancelled
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>

        {/* Modal */}
        <div className="relative bg-white rounded-lg shadow-xl max-w-3xl w-full">
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
                Buyurtmani tasdiqlash
              </h3>

              <div className="space-y-6">
                {/* Products List */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Tanlangan mahsulotlar</h4>
                  <div className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="text-left text-xs font-medium text-gray-500 uppercase">Mahsulot</th>
                          <th className="text-left text-xs font-medium text-gray-500 uppercase">Soni</th>
                          <th className="text-right text-xs font-medium text-gray-500 uppercase">Narxi</th>
                          <th className="text-right text-xs font-medium text-gray-500 uppercase">Jami</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {products.filter(p => p.quantity > 0).map(product => (
                          <tr key={product.id}>
                            <td className="py-2">
                              <div className="flex items-center">
                                <img src={product.image} alt="" className="h-8 w-8 rounded-full object-cover" />
                                <span className="ml-2 text-sm text-gray-900">{product.name}</span>
                              </div>
                            </td>
                            <td className="py-2">
                              <span className="text-sm text-gray-900">{product.quantity}</span>
                            </td>
                            <td className="py-2 text-right">
                              <span className="text-sm text-gray-900">{product.price.toLocaleString()} so'm</span>
                            </td>
                            <td className="py-2 text-right">
                              <span className="text-sm text-gray-900">
                                {(product.price * product.quantity).toLocaleString()} so'm
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan="3" className="py-2 text-right font-medium">Jami:</td>
                          <td className="py-2 text-right font-medium">{total.toLocaleString()} so'm</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                {/* Payment Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    To'lov turi
                  </label>
                  <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        value="cash"
                        checked={paymentType === 'cash'}
                        onChange={(e) => setPaymentType(e.target.value)}
                        className="form-radio h-4 w-4 text-indigo-600"
                      />
                      <span className="ml-2 text-sm text-gray-700">Naqd</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        value="card"
                        checked={paymentType === 'card'}
                        onChange={(e) => setPaymentType(e.target.value)}
                        className="form-radio h-4 w-4 text-indigo-600"
                      />
                      <span className="ml-2 text-sm text-gray-700">Plastik</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        value="transfer"
                        checked={paymentType === 'transfer'}
                        onChange={(e) => setPaymentType(e.target.value)}
                        className="form-radio h-4 w-4 text-indigo-600"
                      />
                      <span className="ml-2 text-sm text-gray-700">O'tkazma</span>
                    </label>
                  </div>
                </div>

                {/* Delivery Date */}
                <div>
                  <label htmlFor="deliveryDate" className="block text-sm font-medium text-gray-700 mb-2">
                    Yetkazib berish sanasi
                  </label>
                  <input
                    type="date"
                    id="deliveryDate"
                    name="deliveryDate"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  />
                </div>

                {/* Note */}
                <div>
                  <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-2">
                    Izoh
                  </label>
                  <textarea
                    id="note"
                    name="note"
                    rows={3}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Qo'shimcha ma'lumotlar..."
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
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
                Buyurtma berish
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
