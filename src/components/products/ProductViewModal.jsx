import { useState } from 'react';
import { formatPrice } from '../../utils/format';

export default function ProductViewModal({ show, onClose, product, categories }) {
  const [selectedImage, setSelectedImage] = useState(null);

  if (!show) return null;

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId && cat.type === 'category');
    return category ? category.name : '';
  };

  const getSubcategoryName = (subcategoryId) => {
    const subcategory = categories.find(cat => cat.id === subcategoryId && cat.type === 'subcategory');
    return subcategory ? subcategory.name : '';
  };

  return (
    <>
      <div className="fixed z-50 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity" aria-hidden="true">
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>

          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

          <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Mahsulot ma'lumotlari
                  </h3>

                  <div className="mt-4">
                    <dl className="divide-y divide-gray-200">
                      <div className="py-4">
                        <dt className="text-sm font-medium text-gray-500">Nomi</dt>
                        <dd className="mt-1 text-sm text-gray-900">{product.name}</dd>
                      </div>

                      <div className="py-4">
                        <dt className="text-sm font-medium text-gray-500">Narxi (dona)</dt>
                        <dd className="mt-1 text-sm text-gray-900">{formatPrice(product.price)}</dd>
                      </div>

                      <div className="py-4">
                        <dt className="text-sm font-medium text-gray-500">Narxi (optom)</dt>
                        <dd className="mt-1 text-sm text-gray-900">{formatPrice(product.wholesalePrice)}</dd>
                      </div>

                      <div className="py-4">
                        <dt className="text-sm font-medium text-gray-500">Kategoriya</dt>
                        <dd className="mt-1 text-sm text-gray-900">{getCategoryName(product.categoryId)}</dd>
                      </div>

                      <div className="py-4">
                        <dt className="text-sm font-medium text-gray-500">Subkategoriya</dt>
                        <dd className="mt-1 text-sm text-gray-900">{getSubcategoryName(product.subcategoryId)}</dd>
                      </div>

                      <div className="py-4">
                        <dt className="text-sm font-medium text-gray-500">Soni</dt>
                        <dd className="mt-1 text-sm text-gray-900">{product.quantity}</dd>
                      </div>
                      
                      <div className="py-4">
                        <dt className="text-sm font-medium text-gray-500">Rasmlar</dt>
                        <dd className="mt-1">
                          <div className="flex flex-wrap gap-4">
                            {Array.isArray(product.images) ? (
                              product.images.map((image, index) => (
                                <button
                                  key={index}
                                  onClick={() => setSelectedImage(image)}
                                  className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-lg"
                                >
                                  <img
                                    src={image}
                                    alt={`${product.name} ${index + 1}`}
                                    className="h-24 w-24 rounded-lg object-cover shadow-sm hover:opacity-75 transition-opacity"
                                  />
                                </button>
                              ))
                            ) : (
                              <button
                                onClick={() => setSelectedImage(product.image)}
                                className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-lg"
                              >
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="h-24 w-24 rounded-lg object-cover shadow-sm hover:opacity-75 transition-opacity"
                                />
                              </button>
                            )}
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

      {/* Rasm modali */}
      {selectedImage && (
        <div className="fixed z-[60] inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-900 opacity-90"></div>
            </div>

            <div className="relative max-w-4xl w-full">
              <div className="relative">
                <img
                  src={selectedImage}
                  alt="Katta rasm"
                  className="w-full h-auto rounded-lg shadow-xl"
                />
                <button
                  type="button"
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-4 right-4 rounded-full bg-gray-900 bg-opacity-50 p-2 hover:bg-opacity-75 focus:outline-none"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
