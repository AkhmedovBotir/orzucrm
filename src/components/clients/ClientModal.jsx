import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function ClientModal({ 
  open, 
  onClose, 
  title,
  client,
  onSave,
  mode // 'create', 'edit', or 'view'
}) {
  return (
    <Transition.Root show={open} as={Fragment}>
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
                      {title}
                    </Dialog.Title>
                    <div className="mt-4">
                      <form className="space-y-4" onSubmit={(e) => {
                        e.preventDefault();
                        onSave(Object.fromEntries(new FormData(e.target)));
                      }}>
                        <div>
                          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                            Ism va familya
                          </label>
                          <input
                            type="text"
                            name="fullName"
                            id="fullName"
                            defaultValue={client?.fullName}
                            disabled={mode === 'view'}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-100"
                          />
                        </div>

                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                            Telefon raqam
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            id="phone"
                            defaultValue={client?.phone}
                            disabled={mode === 'view'}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-100"
                            placeholder="+998 90 123 45 67"
                          />
                        </div>

                        <div>
                          <label htmlFor="region" className="block text-sm font-medium text-gray-700">
                            Viloyat
                          </label>
                          <select
                            id="region"
                            name="region"
                            defaultValue={client?.region}
                            disabled={mode === 'view'}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-100"
                          >
                            <option value="">Tanlang</option>
                            <option value="Toshkent">Toshkent</option>
                            <option value="Samarqand">Samarqand</option>
                            <option value="Buxoro">Buxoro</option>
                            <option value="Andijon">Andijon</option>
                            <option value="Farg'ona">Farg'ona</option>
                            <option value="Namangan">Namangan</option>
                            <option value="Qashqadaryo">Qashqadaryo</option>
                            <option value="Surxondaryo">Surxondaryo</option>
                            <option value="Xorazm">Xorazm</option>
                            <option value="Navoiy">Navoiy</option>
                            <option value="Sirdaryo">Sirdaryo</option>
                            <option value="Jizzax">Jizzax</option>
                          </select>
                        </div>

                        <div>
                          <label htmlFor="shopName" className="block text-sm font-medium text-gray-700">
                            Do'kon nomi
                          </label>
                          <input
                            type="text"
                            name="shopName"
                            id="shopName"
                            defaultValue={client?.shopName}
                            disabled={mode === 'view'}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-100"
                          />
                        </div>

                        {mode !== 'view' && (
                          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                            <button
                              type="submit"
                              className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto"
                            >
                              {mode === 'create' ? 'Qo\'shish' : 'Saqlash'}
                            </button>
                            <button
                              type="button"
                              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                              onClick={onClose}
                            >
                              Bekor qilish
                            </button>
                          </div>
                        )}
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
