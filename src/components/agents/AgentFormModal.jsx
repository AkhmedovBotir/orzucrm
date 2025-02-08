import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function AgentFormModal({ agent, onSave, onClose }) {
  const [formData, setFormData] = useState({
    first_name: agent?.first_name || '',
    last_name: agent?.last_name || '',
    phone: agent?.phone || '',
    passport: agent?.passport || '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>

        {/* Modal */}
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
          <form onSubmit={handleSubmit}>
            {/* Close button */}
            <div className="absolute top-0 right-0 pt-4 pr-4">
              <button
                type="button"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Header */}
            <div className="px-6 pt-6 pb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {agent ? "Agentni tahrirlash" : "Yangi agent qo'shish"}
              </h3>
            </div>

            {/* Form Content */}
            <div className="px-6 pb-4">
              <div className="space-y-4">
                {/* Ism */}
                <div>
                  <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                    Ism
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    id="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  />
                </div>

                {/* Familiya */}
                <div>
                  <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                    Familiya
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    id="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  />
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  />
                </div>

                {/* Passport */}
                <div>
                  <label htmlFor="passport" className="block text-sm font-medium text-gray-700">
                    Pasport
                  </label>
                  <div className="mt-1 flex gap-2">
                    <input
                      type="text"
                      name="passportSeries"
                      id="passportSeries"
                      value={formData.passport.slice(0, 2)}
                      onChange={(e) => {
                        const value = e.target.value.toUpperCase();
                        if (value.length <= 2 && /^[A-Z]*$/.test(value)) {
                          const newPassport = value + formData.passport.slice(2);
                          setFormData(prev => ({ ...prev, passport: newPassport }));
                          if (value.length === 2) {
                            document.getElementById('passportNumber').focus();
                          }
                        }
                      }}
                      placeholder="AA"
                      className="w-20 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm uppercase"
                      required
                    />
                    <input
                      type="text"
                      name="passportNumber"
                      id="passportNumber"
                      value={formData.passport.slice(2)}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value.length <= 7 && /^\d*$/.test(value)) {
                          const newPassport = formData.passport.slice(0, 2) + value;
                          setFormData(prev => ({ ...prev, passport: newPassport }));
                        }
                      }}
                      placeholder="1234567"
                      className="flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Parol
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required={!agent} // Tahrirlashda parol majburiy emas
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-3 rounded-b-lg">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
              >
                Bekor qilish
              </button>
              <button
                type="submit"
                className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
              >
                Saqlash
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
