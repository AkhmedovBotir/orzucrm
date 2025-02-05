import { useState } from 'react';
import { CurrencyDollarIcon, DocumentTextIcon, ArrowTrendingUpIcon, UserGroupIcon, ChartBarIcon, ClockIcon, WalletIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import SalaryDetailsModal from '../../components/accounting/SalaryDetailsModal';

// Mock data
const mockAgents = [
  {
    id: 1,
    name: 'Abdullayev Jasur',
    sales: 15000000,
    commission: 3, // 3%
    salary: 2000000,
    bonuses: 500000,
  },
  {
    id: 2,
    name: 'Karimov Sardor',
    sales: 12000000,
    commission: 2.5, // 2.5%
    salary: 1800000,
    bonuses: 300000,
  },
];

const mockSalaryHistory = [
  {
    id: 1,
    agentId: 1,
    agentName: 'Abdullayev Jasur',
    month: '2025-01',
    baseSalary: 2000000,
    commission: 450000,
    bonuses: 500000,
    total: 2950000,
    status: 'paid', // 'paid' or 'pending'
    paidAt: '2025-02-01',
  },
  {
    id: 2,
    agentId: 2,
    agentName: 'Karimov Sardor',
    month: '2025-01',
    baseSalary: 1800000,
    commission: 300000,
    bonuses: 300000,
    total: 2400000,
    status: 'pending',
    paidAt: null,
  },
];

const tabs = [
  { id: 'overview', name: 'Umumiy', icon: ChartBarIcon },
  { id: 'salaries', name: 'Oyliklar', icon: WalletIcon },
  { id: 'history', name: 'To\'lovlar tarixi', icon: ClockIcon },
];

export default function AccountingPage() {
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [showSalaryModal, setShowSalaryModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [agents, setAgents] = useState(mockAgents);
  const [activeTab, setActiveTab] = useState('overview');

  // Calculate total stats
  const totalStats = {
    totalSalaries: mockSalaryHistory.reduce((sum, item) => sum + item.total, 0),
    totalAgents: mockAgents.length,
    totalSales: mockAgents.reduce((sum, agent) => sum + agent.sales, 0),
    averageSalary: mockSalaryHistory.reduce((sum, item) => sum + item.total, 0) / mockAgents.length,
  };

  // Handle salary update
  const handleSalaryUpdate = (updatedAgent) => {
    setAgents(agents.map(agent => 
      agent.id === updatedAgent.id ? updatedAgent : agent
    ));
    setShowSalaryModal(false);
  };

  const renderOverviewTab = () => (
    <>
      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CurrencyDollarIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Jami oyliklar</dt>
                  <dd className="text-lg font-medium text-gray-900">{totalStats.totalSalaries.toLocaleString()} so'm</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserGroupIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Jami agentlar</dt>
                  <dd className="text-lg font-medium text-gray-900">{totalStats.totalAgents}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ArrowTrendingUpIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Jami savdolar</dt>
                  <dd className="text-lg font-medium text-gray-900">{totalStats.totalSales.toLocaleString()} so'm</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DocumentTextIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">O'rtacha oylik</dt>
                  <dd className="text-lg font-medium text-gray-900">{Math.round(totalStats.averageSalary).toLocaleString()} so'm</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const renderSalariesTab = () => (
    <>
      {/* Filters */}
      <div className="bg-white shadow-sm rounded-lg mb-8">
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Filterlar</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="month" className="block text-sm font-medium text-gray-700">
                Oy
              </label>
              <input
                type="month"
                name="month"
                id="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Agents Table */}
      <div className="bg-white shadow-sm rounded-lg mb-8">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Agentlar</h2>
          <div className="mt-4 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                        Agent
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Savdolar
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Komissiya
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Asosiy oylik
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Bonus
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Jami
                      </th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                        <span className="sr-only">Amallar</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {agents.map((agent) => {
                      const totalSalary = agent.salary + (agent.sales * agent.commission / 100) + agent.bonuses;
                      return (
                        <tr key={agent.id}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                            {agent.name}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {agent.sales.toLocaleString()} so'm
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {agent.commission}%
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {agent.salary.toLocaleString()} so'm
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {agent.bonuses.toLocaleString()} so'm
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">
                            {totalSalary.toLocaleString()} so'm
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                            <button
                              onClick={() => {
                                setSelectedAgent(agent);
                                setShowSalaryModal(true);
                              }}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              Batafsil
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const renderHistoryTab = () => (
    <>
      {/* Salary History */}
      <div className="bg-white shadow-sm rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Oylik to'lovlar tarixi</h2>
          <div className="mt-4 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                        Agent
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Oy
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Asosiy oylik
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Komissiya
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Bonus
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Jami
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Status
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        To'langan sana
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {mockSalaryHistory.map((history) => (
                      <tr key={history.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                          {history.agentName}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {format(new Date(history.month), 'MMMM yyyy')}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {history.baseSalary.toLocaleString()} so'm
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {history.commission.toLocaleString()} so'm
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {history.bonuses.toLocaleString()} so'm
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">
                          {history.total.toLocaleString()} so'm
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              history.status === 'paid'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {history.status === 'paid' ? 'To\'langan' : 'Kutilmoqda'}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {history.paidAt ? format(new Date(history.paidAt), 'dd.MM.yyyy') : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Bugalteriya</h1>
        <p className="mt-2 text-sm text-gray-700">
          Agentlar maoshi va moliyaviy hisobotlar
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  ${activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }
                  group inline-flex items-center border-b-2 py-4 px-1 text-sm font-medium
                `}
              >
                <Icon
                  className={`
                    ${activeTab === tab.id ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'}
                    -ml-0.5 mr-2 h-5 w-5
                  `}
                  aria-hidden="true"
                />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-8">
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'salaries' && renderSalariesTab()}
        {activeTab === 'history' && renderHistoryTab()}
      </div>

      {/* Salary Details Modal */}
      <SalaryDetailsModal
        open={showSalaryModal}
        onClose={() => setShowSalaryModal(false)}
        agent={selectedAgent}
        onSave={handleSalaryUpdate}
      />
    </div>
  );
}
