import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function ClientFormModal({ client, regions, stores, onSave, onClose }) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    region: '',
    store: ''
  });

  useEffect(() => {
    if (client) {
      setFormData({
        first_name: client.first_name,
        last_name: client.last_name,
        phone: client.phone,
        region: client.region._id,
        store: client.store._id
      });
    }
  }, [client]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Transition.Root show={true} as={Fragment}>
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
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={onClose}
                  >
                    <span className="sr-only">Yopish</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                    <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                      {client ? 'Mijozni tahrirlash' : 'Yangi mijoz qo\'shish'}
                    </Dialog.Title>
                    <div className="mt-4">
                      <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                          <div>
                            <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                              Ism
                            </label>
                            <div className="mt-1">
                              <input
                                type="text"
                                name="first_name"
                                id="first_name"
                                required
                                value={formData.first_name}
                                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              />
                            </div>
                          </div>

                          <div>
                            <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                              Familiya
                            </label>
                            <div className="mt-1">
                              <input
                                type="text"
                                name="last_name"
                                id="last_name"
                                required
                                value={formData.last_name}
                                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              />
                            </div>
                          </div>

                          <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                              Telefon
                            </label>
                            <div className="mt-1">
                              <input
                                type="text"
                                name="phone"
                                id="phone"
                                required
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              />
                            </div>
                          </div>

                          <div>
                            <label htmlFor="region" className="block text-sm font-medium text-gray-700">
                              Viloyat
                            </label>
                            <div className="mt-1">
                              <select
                                id="region"
                                name="region"
                                required
                                value={formData.region}
                                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              >
                                <option value="">Tanlang</option>
                                {regions.map((region) => (
                                  <option key={region._id} value={region._id}>
                                    {region.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div className="sm:col-span-2">
                            <label htmlFor="store" className="block text-sm font-medium text-gray-700">
                              Do'kon
                            </label>
                            <div className="mt-1">
                              <select
                                id="store"
                                name="store"
                                required
                                value={formData.store}
                                onChange={(e) => setFormData({ ...formData, store: e.target.value })}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              >
                                <option value="">Tanlang</option>
                                {stores.map((store) => (
                                  <option key={store._id} value={store._id}>
                                    {store.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>

                        <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                          <button
                            type="submit"
                            className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                          >
                            Saqlash
                          </button>
                          <button
                            type="button"
                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                            onClick={onClose}
                          >
                            Bekor qilish
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
