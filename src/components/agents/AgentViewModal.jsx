import { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { getAgent } from '../../api/agents';

export default function AgentViewModal({ show, onClose, agentId }) {
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (show && agentId) {
      loadAgent();
    }
  }, [show, agentId]);

  const loadAgent = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getAgent(agentId);
      setAgent(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Transition.Root show={show} as={Fragment}>
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
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900 mb-4">
                      Agent ma'lumotlari
                    </Dialog.Title>

                    {loading ? (
                      <div className="flex justify-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
                      </div>
                    ) : error ? (
                      <div className="rounded-md bg-red-50 p-4">
                        <div className="flex">
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">{error}</h3>
                          </div>
                        </div>
                      </div>
                    ) : agent ? (
                      <dl className="divide-y divide-gray-200">
                        <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                          <dt className="text-sm font-medium text-gray-500">Ism</dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{agent.first_name}</dd>
                        </div>
                        <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                          <dt className="text-sm font-medium text-gray-500">Familiya</dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{agent.last_name}</dd>
                        </div>
                        <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                          <dt className="text-sm font-medium text-gray-500">Telefon</dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{agent.phone}</dd>
                        </div>
                        <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                          <dt className="text-sm font-medium text-gray-500">Passport</dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{agent.passport}</dd>
                        </div>
                        <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                          <dt className="text-sm font-medium text-gray-500">Status</dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                            <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${agent.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {agent.status === 'active' ? 'Faol' : 'Faol emas'}
                            </span>
                          </dd>
                        </div>
                        <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                          <dt className="text-sm font-medium text-gray-500">Yaratilgan sana</dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                            {new Date(agent.createdAt).toLocaleString('uz-UZ')}
                          </dd>
                        </div>
                      </dl>
                    ) : null}
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
