import { XMarkIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

export default function OrderViewModal({ order, onClose, onConfirm, onCancel }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('uz-UZ', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'new':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'new':
        return 'Yangi';
      case 'confirmed':
        return 'Tasdiqlangan';
      case 'cancelled':
        return 'Bekor qilingan';
      default:
        return status;
    }
  };

  const getPaymentTypeText = (type) => {
    switch (type) {
      case 'cash':
        return 'Naqd';
      case 'card':
        return 'Plastik';
      case 'transfer':
        return "O'tkazma";
      default:
        return type;
    }
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

          <div className="p-6">
            {/* Header */}
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Buyurtma #{order.orderNumber}
              </h3>
              <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
                <div>Buyurtma sanasi: {formatDate(order.orderDate)}</div>
                <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusBadgeClass(order.status)}`}>
                  {getStatusText(order.status)}
                </span>
              </div>
            </div>

            {/* Customer Info */}
            <div className="py-4 border-b border-gray-200">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Mijoz ma'lumotlari</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Mijoz: </span>
                  <span className="text-gray-900">{order.customerName}</span>
                </div>
                <div>
                  <span className="text-gray-500">Yetkazib berish sanasi: </span>
                  <span className="text-gray-900">{formatDate(order.deliveryDate)}</span>
                </div>
                <div>
                  <span className="text-gray-500">To'lov turi: </span>
                  <span className="text-gray-900">{getPaymentTypeText(order.paymentType)}</span>
                </div>
                <div>
                  <span className="text-gray-500">Buyurtma turi: </span>
                  <span className="text-gray-900">{order.orderType === 'wholesale' ? 'Optom' : 'Dona'}</span>
                </div>
              </div>
            </div>

            {/* Products */}
            <div className="py-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Mahsulotlar</h4>
              <div className="mt-2">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Mahsulot</th>
                      <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Soni</th>
                      <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Narxi</th>
                      <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Jami</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {order.items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-3 py-2 text-sm text-gray-900">{item.name}</td>
                        <td className="px-3 py-2 text-sm text-gray-900">{item.quantity}</td>
                        <td className="px-3 py-2 text-sm text-gray-900 text-right">{item.price.toLocaleString()} so'm</td>
                        <td className="px-3 py-2 text-sm text-gray-900 text-right">{(item.price * item.quantity).toLocaleString()} so'm</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="3" className="px-3 py-2 text-sm font-medium text-gray-900 text-right">Jami:</td>
                      <td className="px-3 py-2 text-sm font-medium text-gray-900 text-right">{order.total.toLocaleString()} so'm</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Footer */}
            {order.status === 'new' && (
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onCancel}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <XCircleIcon className="h-5 w-5 mr-2" />
                  Bekor qilish
                </button>
                <button
                  type="button"
                  onClick={onConfirm}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <CheckCircleIcon className="h-5 w-5 mr-2" />
                  Tasdiqlash
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
