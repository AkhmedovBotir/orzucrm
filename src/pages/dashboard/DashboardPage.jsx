import AppLayout from '../../components/layout/AppLayout';
import {
  CurrencyDollarIcon,
  UsersIcon,
  ShoppingCartIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

const stats = [
  {
    name: 'Jami savdo',
    value: '12,500,000 UZS',
    icon: CurrencyDollarIcon,
    change: '+12%',
    changeType: 'positive',
  },
  {
    name: 'Faol mijozlar',
    value: '245',
    icon: UsersIcon,
    change: '+3%',
    changeType: 'positive',
  },
  {
    name: 'Yangi buyurtmalar',
    value: '23',
    icon: ShoppingCartIcon,
    change: '-2%',
    changeType: 'negative',
  },
  {
    name: 'O\'rtacha savdo',
    value: '850,000 UZS',
    icon: ChartBarIcon,
    change: '+8%',
    changeType: 'positive',
  },
];

const recentOrders = [
  {
    id: 1,
    customer: 'Aziz Rahimov',
    date: '2024-02-04',
    amount: '1,250,000 UZS',
    status: 'Tugallangan',
    statusColor: 'green',
  },
  {
    id: 2,
    customer: 'Malika Karimova',
    date: '2024-02-04',
    amount: '850,000 UZS',
    status: 'Jarayonda',
    statusColor: 'yellow',
  },
  {
    id: 3,
    customer: 'Jamshid Toshmatov',
    date: '2024-02-03',
    amount: '2,100,000 UZS',
    status: 'Tugallangan',
    statusColor: 'green',
  },
  {
    id: 4,
    customer: 'Nilufar Saidova',
    date: '2024-02-03',
    amount: '750,000 UZS',
    status: 'Bekor qilingan',
    statusColor: 'red',
  },
];

export default function DashboardPage() {
  return (
    <>
      <div className="max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>

        {/* Stats */}
        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => (
            <div
              key={item.name}
              className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:px-6 sm:py-6"
            >
              <dt>
                <div className="absolute rounded-md bg-indigo-500 p-3">
                  <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <p className="ml-16 truncate text-sm font-medium text-gray-500">
                  {item.name}
                </p>
              </dt>
              <dd className="ml-16 flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">{item.value}</p>
                <p
                  className={`ml-2 flex items-baseline text-sm font-semibold ${
                    item.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {item.change}
                </p>
              </dd>
            </div>
          ))}
        </div>

        {/* Recent orders */}
        <h2 className="mt-8 text-lg font-medium text-gray-900">
          So'nggi buyurtmalar
        </h2>
        <div className="mt-4 overflow-hidden rounded-lg bg-white shadow">
          <div className="p-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mijoz
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sana
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Summa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.customer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                          order.statusColor === 'green'
                            ? 'bg-green-100 text-green-800'
                            : order.statusColor === 'yellow'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
