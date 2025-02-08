import { XMarkIcon, MapPinIcon, PhoneIcon } from '@heroicons/react/24/outline';

export default function StoreViewModal({ store, onClose }) {
  if (!store) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>

        {/* Modal */}
        <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full">
          {/* Close button */}
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Store Image */}
          <div className="relative h-64 sm:h-72">
            <img
              src={`https://backend.milliycrm.uz/${store.image}`}
              alt={store.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Store Details */}
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {store.name}
            </h3>
            
            <div className="space-y-4">
              {/* Address */}
              <div className="flex items-start">
                <MapPinIcon className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Manzil</h4>
                  <p className="mt-1 text-sm text-gray-900">{store.address}</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start">
                <PhoneIcon className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Telefon</h4>
                  <p className="mt-1 text-sm text-gray-900">{store.phone}</p>
                </div>
              </div>

              {/* Status */}
              <div>
                <h4 className="text-sm font-medium text-gray-500">Status</h4>
                <span
                  className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    store.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {store.status === 'active' ? 'Faol' : 'Nofaol'}
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 flex justify-end">
            <button
              onClick={onClose}
              className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
            >
              Yopish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
