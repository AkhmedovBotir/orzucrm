import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { getClient } from '../../api/clients';

export default function ClientViewModal({ clientId, onClose }) {
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadClient = async () => {
      setLoading(true);
      try {
        const data = await getClient(clientId);
        setClient(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (clientId) {
      loadClient();
    }
  }, [clientId]);

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
                      Mijoz ma'lumotlari
                    </Dialog.Title>

                    {loading ? (
                      <div className="mt-4 flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
                      </div>
                    ) : error ? (
                      <div className="mt-4 text-red-500 text-center">{error}</div>
                    ) : client ? (
                      <div className="mt-4">
                        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                          <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Ism</dt>
                            <dd className="mt-1 text-sm text-gray-900">{client.first_name}</dd>
                          </div>
                          <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Familiya</dt>
                            <dd className="mt-1 text-sm text-gray-900">{client.last_name}</dd>
                          </div>
                          <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Telefon</dt>
                            <dd className="mt-1 text-sm text-gray-900">{client.phone}</dd>
                          </div>
                          <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Viloyat</dt>
                            <dd className="mt-1 text-sm text-gray-900">{client.region.name}</dd>
                          </div>
                          <div className="sm:col-span-2">
                            <dt className="text-sm font-medium text-gray-500">Do'kon</dt>
                            <dd className="mt-1 text-sm text-gray-900">
                              <div>{client.store.name}</div>
                              <div className="text-gray-500">{client.store.address}</div>
                              <div className="text-gray-500">{client.store.phone}</div>
                            </dd>
                          </div>
                          <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Status</dt>
                            <dd className="mt-1">
                              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                client.status === 'active' 
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {client.status === 'active' ? 'Faol' : 'Faol emas'}
                              </span>
                            </dd>
                          </div>
                          <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Yaratilgan sana</dt>
                            <dd className="mt-1 text-sm text-gray-900">
                              {new Date(client.createdAt).toLocaleDateString()}
                            </dd>
                          </div>
                        </dl>
                      </div>
                    ) : null}

                    <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                      <button
                        type="button"
                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                        onClick={onClose}
                      >
                        Yopish
                      </button>
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
