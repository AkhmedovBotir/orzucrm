import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';

export default function SubcategoryFormModal({ show, onClose, onSubmit, category, subcategory = null }) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show && subcategory) {
      setName(subcategory.name);
    } else {
      setName('');
    }
  }, [show, subcategory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (subcategory) {
        // Tahrirlash
        await onSubmit({
          id: subcategory.id,
          name: name.trim()
        });
      } else {
        // Yangi qo'shish
        await onSubmit({
          category_id: category.id,
          name: name.trim()
        });
      }
      setName('');
      onClose();
    } catch (error) {
      console.error('Error saving subcategory:', error);
    } finally {
      setLoading(false);
    }
  };

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
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  {subcategory ? 'Subkategoriyani tahrirlash' : 'Yangi Subkategoriya Qo\'shish'}
                </Dialog.Title>

                <form onSubmit={handleSubmit} className="mt-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Kategoriya: {category?.name}
                    </label>
                  </div>

                  <div className="mt-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Subkategoriya nomi
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      required
                    />
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                      Bekor qilish
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      {loading ? 'Saqlanmoqda...' : 'Saqlash'}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
