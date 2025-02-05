import { XMarkIcon } from '@heroicons/react/24/outline';

export default function DeleteConfirmModal({ store, onConfirm, onClose }) {
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

          {/* Content */}
          <div className="p-6">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Do'konni o'chirish
              </h3>
              <p className="text-sm text-gray-500">
                Siz rostdan ham <span className="font-medium text-gray-900">{store.name}</span> do'konini o'chirmoqchimisiz?
                <br />
                Bu amalni ortga qaytarib bo'lmaydi.
              </p>
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
              type="button"
              onClick={() => onConfirm(store)}
              className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm"
            >
              O'chirish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
