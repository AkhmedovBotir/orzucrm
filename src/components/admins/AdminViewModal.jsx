export default function AdminViewModal({ show, onClose, admin }) {
  if (!show) return null;

  return (
    <div className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Admin ma'lumotlari
                </h3>
                <div className="mt-4 border-t border-gray-200">
                  <dl className="divide-y divide-gray-200">
                    <div className="py-4">
                      <dt className="text-sm font-medium text-gray-500">To'liq ismi</dt>
                      <dd className="mt-1 text-sm text-gray-900">{admin.firstName} {admin.lastName}</dd>
                    </div>
                    <div className="py-4">
                      <dt className="text-sm font-medium text-gray-500">Telefon</dt>
                      <dd className="mt-1 text-sm text-gray-900">{admin.phone}</dd>
                    </div>
                    <div className="py-4">
                      <dt className="text-sm font-medium text-gray-500">Username</dt>
                      <dd className="mt-1 text-sm text-gray-900">{admin.username}</dd>
                    </div>
                    <div className="py-4">
                      <dt className="text-sm font-medium text-gray-500">Status</dt>
                      <dd className="mt-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          admin.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {admin.status === 'active' ? 'Faol' : 'Nofaol'}
                        </span>
                      </dd>
                    </div>
                    <div className="py-4">
                      <dt className="text-sm font-medium text-gray-500">Ruxsatlar</dt>
                      <dd className="mt-1">
                        <div className="flex flex-wrap gap-2">
                          {admin.permissions.map(permission => (
                            <span
                              key={permission}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                            >
                              {permission}
                            </span>
                          ))}
                        </div>
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={onClose}
              className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
            >
              Yopish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
