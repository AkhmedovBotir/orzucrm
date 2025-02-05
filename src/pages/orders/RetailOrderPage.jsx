import { useState } from 'react';
import {
  TrashIcon,
  ShoppingCartIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import OrderQuantityModal from '../../components/orders/OrderQuantityModal';
import OrderConfirmModal from '../../components/orders/OrderConfirmModal';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

// Mock data
const mockProducts = [
  {
    id: 1,
    name: 'Sport krossovka',
    image: 'https://picsum.photos/200',
    price: 180000, // Chakana narx
    wholesalePrice: 150000, // Optom narx
    category: 'Poyabzal',
    subcategory: 'Krossovkalar',
    quantity: 0
  },
  {
    id: 2,
    name: 'Klassik tufli',
    image: 'https://picsum.photos/200',
    price: 250000, // Chakana narx
    wholesalePrice: 200000, // Optom narx
    category: 'Poyabzal',
    subcategory: 'Tuflilar',
    quantity: 0
  },
  // Add more mock data as needed
];

export default function RetailOrderPage() {
  const [products, setProducts] = useState(mockProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [showQuantityModal, setShowQuantityModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter products based on search and category filters
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    const matchesSubcategory = !selectedSubcategory || product.subcategory === selectedSubcategory;
    return matchesSearch && matchesCategory && matchesSubcategory;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  // Calculate total
  const total = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);

  const handleQuantitySave = (updatedProduct) => {
    setProducts(products.map(product => 
      product.id === updatedProduct.id ? updatedProduct : product
    ));
    setShowQuantityModal(false);
  };

  const handleAddClick = (product) => {
    setSelectedProduct(product);
    setShowQuantityModal(true);
  };

  const handleRemoveProduct = (productId) => {
    setProducts(products.map(product => 
      product.id === productId ? { ...product, quantity: 0 } : product
    ));
  };

  const handleCreateOrder = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmOrder = (orderData) => {
    // API call to create order would go here
    console.log('Order created:', orderData);
    
    // Reset products
    setProducts(products.map(product => ({ ...product, quantity: 0 })));
    setShowConfirmModal(false);

    // Show success message
    alert('Buyurtma muvaffaqiyatli yaratildi!');
  };

  // Get unique categories and subcategories
  const categories = [...new Set(products.map(p => p.category))];
  const subcategories = [...new Set(products
    .filter(p => !selectedCategory || p.category === selectedCategory)
    .map(p => p.subcategory))];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dona buyurtma berish</h1>
          <p className="mt-1 text-sm text-gray-600">
            Mahsulotlarni tanlang va miqdorini kiriting
          </p>
        </div>
        <button
          onClick={handleCreateOrder}
          disabled={!products.some(p => p.quantity > 0)}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingCartIcon className="h-5 w-5 mr-2" />
          Buyurtma berish ({products.filter(p => p.quantity > 0).length})
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Mahsulot nomini kiriting..."
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setSelectedSubcategory('');
          }}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">Barcha kategoriyalar</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        <select
          value={selectedSubcategory}
          onChange={(e) => setSelectedSubcategory(e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">Barcha subkategoriyalar</option>
          {subcategories.map(subcategory => (
            <option key={subcategory} value={subcategory}>{subcategory}</option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="min-w-full divide-y divide-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mahsulot
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Narxi
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategoriya
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subkategoriya
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Soni
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jami
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amallar
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img className="h-10 w-10 rounded-full object-cover" src={product.image} alt={product.name} />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{product.price.toLocaleString()} so'm</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{product.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{product.subcategory}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{product.quantity || 0}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm text-gray-900">{(product.price * (product.quantity || 0)).toLocaleString()} so'm</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleAddClick(product)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <PlusIcon className="h-5 w-5" />
                      </button>
                      {product.quantity > 0 && (
                        <button
                          onClick={() => handleRemoveProduct(product.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <td colSpan="5" className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                  Jami summa:
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                  {total.toLocaleString()} so'm
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
        <div className="flex flex-1 justify-between sm:hidden">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Oldingi
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Keyingi
          </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Jami <span className="font-medium">{filteredProducts.length}</span> tadan{' '}
              <span className="font-medium">{startIndex + 1}</span> dan{' '}
              <span className="font-medium">{Math.min(startIndex + itemsPerPage, filteredProducts.length)}</span> gacha ko'rsatilmoqda
            </p>
          </div>
          <div>
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
              >
                <span className="sr-only">Oldingi</span>
                <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                    page === currentPage
                      ? 'z-10 bg-indigo-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                      : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
              >
                <span className="sr-only">Keyingi</span>
                <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Quantity Modal */}
      {showQuantityModal && selectedProduct && (
        <OrderQuantityModal
          product={selectedProduct}
          onSave={handleQuantitySave}
          onClose={() => setShowQuantityModal(false)}
        />
      )}

      {/* Confirm Order Modal */}
      {showConfirmModal && (
        <OrderConfirmModal
          products={products}
          total={total}
          onConfirm={handleConfirmOrder}
          onClose={() => setShowConfirmModal(false)}
        />
      )}
    </div>
  );
}
