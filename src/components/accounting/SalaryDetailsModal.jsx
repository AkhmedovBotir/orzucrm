import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function SalaryDetailsModal({ 
  open, 
  onClose, 
  agent,
  onSave 
}) {
  // Calculate totals
  const commissionAmount = agent ? (agent.sales * agent.commission / 100) : 0;
  const totalSalary = agent ? (agent.salary + commissionAmount + agent.bonuses) : 0;

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
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
                    <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                      {agent?.name} - Oylik ma'lumotlari
                    </Dialog.Title>

                    <div className="mt-4">
                      <form className="space-y-4" onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.target);
                        onSave({
                          ...agent,
                          salary: Number(formData.get('salary')),
                          commission: Number(formData.get('commission')),
                          bonuses: Number(formData.get('bonuses')),
                        });
                      }}>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Savdolar
                          </label>
                          <p className="mt-1 text-sm text-gray-900">{agent?.sales?.toLocaleString()} so'm</p>
                        </div>

                        <div>
                          <label htmlFor="salary" className="block text-sm font-medium text-gray-700">
                            Asosiy oylik
                          </label>
                          <div className="mt-1">
                            <input
                              type="number"
                              name="salary"
                              id="salary"
                              defaultValue={agent?.salary}
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="commission" className="block text-sm font-medium text-gray-700">
                            Komissiya foizi
                          </label>
                          <div className="mt-1">
                            <input
                              type="number"
                              step="0.1"
                              name="commission"
                              id="commission"
                              defaultValue={agent?.commission}
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                          </div>
                          <p className="mt-1 text-sm text-gray-500">
                            Komissiya summasi: {commissionAmount.toLocaleString()} so'm
                          </p>
                        </div>

                        <div>
                          <label htmlFor="bonuses" className="block text-sm font-medium text-gray-700">
                            Bonus
                          </label>
                          <div className="mt-1">
                            <input
                              type="number"
                              name="bonuses"
                              id="bonuses"
                              defaultValue={agent?.bonuses}
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                          </div>
                        </div>

                        <div className="bg-gray-50 px-4 py-3 rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="text-base font-medium text-gray-900">Jami:</span>
                            <span className="text-base font-medium text-gray-900">{totalSalary.toLocaleString()} so'm</span>
                          </div>
                        </div>

                        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                          <button
                            type="submit"
                            className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto"
                          >
                            Saqlash
                          </button>
                          <button
                            type="button"
                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
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
