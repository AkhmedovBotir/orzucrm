import { formatPrice } from '../../utils/format';
import { useState, useEffect } from 'react';
import { getCategoryWithSubs } from '../../api/categories';

export default function ProductViewModal({ show, onClose, product }) {
  const [subcategories, setSubcategories] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchSubcategories = async () => {
      if (product?.category?._id) {
        try {
          const categoryData = await getCategoryWithSubs(product.category._id);
          setSubcategories(categoryData.subcategories);
        } catch (error) {
          console.error('Error fetching subcategories:', error);
        }
      }
    };

    fetchSubcategories();
  }, [product]);

  if (!show) return null;

  return (
    <div className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Mahsulot ma'lumotlari
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-12 gap-6 pb-4">
              {/* Rasm */}
              <div className="col-span-4">
                <div className="relative">
                  {Array.isArray(product.images) && product.images.length > 0 ? (
                    <>
                      <img
                        src={`https://backend.milliycrm.uz/${product.images[currentImageIndex]}`}
                        alt={product.name}
                        className="w-full h-64 object-cover rounded-lg shadow-sm"
                      />
                      {/* Thumbnail Gallery */}
                      {product.images.length > 1 && (
                        <div className="mt-4">
                          <div className="flex items-center justify-start space-x-2 overflow-x-auto pb-2">
                            {product.images.map((image, index) => (
                              <button
                                key={index}
                                onClick={() => setCurrentImageIndex(index)}
                                className={`relative flex-shrink-0 w-16 h-16 rounded-md overflow-hidden ${index === currentImageIndex ? 'ring-2 ring-indigo-500' : 'ring-1 ring-gray-200'}`}
                              >
                                <img
                                  src={`https://backend.milliycrm.uz/${image}`}
                                  alt={`${product.name} ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400">Rasm yo'q</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Ma'lumotlar */}
              <div className="col-span-8">
                <dl className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Nomi</dt>
                    <dd className="mt-1 text-lg font-semibold text-gray-900">{product.name}</dd>
                  </div>

                  <div>
                    <dt className="text-sm font-medium text-gray-500">Kategoriya</dt>
                    <dd className="mt-1 text-sm text-gray-900">{product.category?.name}</dd>
                  </div>

                  <div>
                    <dt className="text-sm font-medium text-gray-500">Subkategoriya</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {subcategories.find(sub => sub._id === product.subcategory)?.name || '-'}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-sm font-medium text-gray-500">Narxi</dt>
                    <dd className="mt-1 text-sm text-gray-900">{formatPrice(product.price)} so'm</dd>
                  </div>

                  <div>
                    <dt className="text-sm font-medium text-gray-500">Optom narxi</dt>
                    <dd className="mt-1 text-sm text-gray-900">{formatPrice(product.packagePrice)} so'm</dd>
                  </div>

                  <div>
                    <dt className="text-sm font-medium text-gray-500">Soni</dt>
                    <dd className="mt-1 text-sm text-gray-900">{product.quantity} dona</dd>
                  </div>

                  <div>
                    <dt className="text-sm font-medium text-gray-500">Optom soni</dt>
                    <dd className="mt-1 text-sm text-gray-900">{product.packageQuantity} dona</dd>
                  </div>

                  <div className="col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Yaratilgan vaqti</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {new Date(product.createdAt).toLocaleString('uz-UZ')}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                    <dd className="mt-1">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                      >
                        {product.status === 'active' ? 'Faol' : 'Nofaol'}
                      </span>
                    </dd>
                  </div>
                  
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}