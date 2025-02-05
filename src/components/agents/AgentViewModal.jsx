import { XMarkIcon } from '@heroicons/react/24/outline';

export default function AgentViewModal({ agent, onClose }) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>

        {/* Modal */}
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
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
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Agent ma'lumotlari
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Ism familiya
                </label>
                <p className="mt-1 text-sm text-gray-900">{agent.fullName}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Telefon
                </label>
                <p className="mt-1 text-sm text-gray-900">{agent.phone}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Pasport/ID
                </label>
                <p className="mt-1 text-sm text-gray-900">{agent.passportId}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
