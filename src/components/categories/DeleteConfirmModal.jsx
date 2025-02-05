import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function DeleteConfirmModal({ show, onClose, onConfirm, category, categories }) {
  if (!show || !category) return null;

  const subCategories = category.type === 'category' 
    ? categories.filter(cat => cat.categoryId === category.id)
    : [];

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
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {category.type === 'category' ? 'Kategoriyani' : 'Subkategoriyani'} o'chirish
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Siz rostdan ham <span className="font-medium">{category.name}</span> {category.type === 'category' ? 'kategoriyasini' : 'subkategoriyasini'} o'chirmoqchimisiz?
                  </p>
                  {subCategories.length > 0 && (
                    <div className="mt-2 p-3 bg-yellow-50 rounded-md">
                      <p className="text-sm text-yellow-700">
                        <strong>Diqqat!</strong> Bu kategoriyaning {subCategories.length} ta subkategoriyasi mavjud. 
                        Ularni ham o'chirib yuborasiz.
                      </p>
                      <ul className="mt-1 list-disc list-inside">
                        {subCategories.map(sub => (
                          <li key={sub.id} className="text-sm text-yellow-700">{sub.name}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={onConfirm}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              O'chirish
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Bekor qilish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
