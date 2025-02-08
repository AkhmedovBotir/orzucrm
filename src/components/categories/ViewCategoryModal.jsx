import { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { getCategoryWithSubs } from '../../api/categories';

export default function ViewCategoryModal({ show, onClose, categoryId }) {
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (show && categoryId) {
      fetchCategory();
    }
  }, [show, categoryId]);

  const fetchCategory = async () => {
    try {
      setLoading(true);
      const data = await getCategoryWithSubs(categoryId);
      setCategory(data);
    } catch (error) {
      console.error('Error fetching category:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                {loading ? (
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  </div>
                ) : category ? (
                  <div>
                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 mb-4">
                      Kategoriya ma'lumotlari
                    </Dialog.Title>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Nomi</h4>
                        <p className="mt-1 text-sm text-gray-900">{category.name}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Yaratilgan vaqti</h4>
                        <p className="mt-1 text-sm text-gray-900">
                          {new Date(category.created_at).toLocaleString()}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Subkategoriyalar</h4>
                        {category.subcategories?.length > 0 ? (
                          <ul className="mt-2 divide-y divide-gray-200">
                            {category.subcategories.map((sub) => (
                              <li key={sub.id} className="py-2">
                                <div className="flex justify-between">
                                  <p className="text-sm text-gray-900">{sub.name}</p>
                                  <p className="text-sm text-gray-500">
                                    {new Date(sub.created_at).toLocaleString()}
                                  </p>
                                </div>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="mt-1 text-sm text-gray-500">Subkategoriyalar mavjud emas</p>
                        )}
                      </div>
                    </div>

                    <div className="mt-6">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={onClose}
                      >
                        Yopish
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500">
                    Kategoriya topilmadi
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
