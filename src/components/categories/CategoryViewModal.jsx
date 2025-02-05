export default function CategoryViewModal({ show, onClose, category, categories }) {
  if (!show || !category) return null;

  const subCategories = category.type === 'category'
    ? categories.filter(cat => cat.categoryId === category.id)
    : [];

  const parentCategory = category.type === 'subcategory'
    ? categories.find(cat => cat.id === category.categoryId)
    : null;

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
                  {category.type === 'category' ? 'Kategoriya' : 'Subkategoriya'} ma'lumotlari
                </h3>
                <div className="mt-4 border-t border-gray-200">
                  <dl className="divide-y divide-gray-200">
                    <div className="py-4">
                      <dt className="text-sm font-medium text-gray-500">Nomi</dt>
                      <dd className="mt-1 text-sm text-gray-900">{category.name}</dd>
                    </div>

                    {category.type === 'subcategory' && parentCategory && (
                      <div className="py-4">
                        <dt className="text-sm font-medium text-gray-500">Asosiy kategoriya</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {parentCategory.name}
                        </dd>
                      </div>
                    )}

                    {category.type === 'category' && (
                      <div className="py-4">
                        <dt className="text-sm font-medium text-gray-500">
                          Subkategoriyalar ({subCategories.length})
                        </dt>
                        {subCategories.length > 0 ? (
                          <dd className="mt-2">
                            <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                              {subCategories.map((sub) => (
                                <li key={sub.id} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                                  <div className="w-0 flex-1 flex items-center">
                                    <span className="ml-2 flex-1 w-0 truncate text-gray-900">
                                      {sub.name}
                                    </span>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </dd>
                        ) : (
                          <dd className="mt-1 text-sm text-gray-500">
                            Subkategoriyalar mavjud emas
                          </dd>
                        )}
                      </div>
                    )}
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
