import { useState, useMemo } from 'react';
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import AppLayout from '../../components/layout/AppLayout';
import CategoryFormModal from '../../components/categories/CategoryFormModal';
import DeleteConfirmModal from '../../components/categories/DeleteConfirmModal';
import CategoryViewModal from '../../components/categories/CategoryViewModal';

// Test uchun ma'lumotlar
const initialCategories = [
  { id: 1, name: 'Elektronika', type: 'category' },
  { id: 2, name: 'Kiyim', type: 'category' },
  { id: 3, name: 'Smartfonlar', categoryId: 1, type: 'subcategory' },
  { id: 4, name: 'Noutbuklar', categoryId: 1, type: 'subcategory' },
  { id: 5, name: 'Erkaklar kiyimi', categoryId: 2, type: 'subcategory' },
  { id: 6, name: 'Ayollar kiyimi', categoryId: 2, type: 'subcategory' },
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState(initialCategories);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [showSubcategoryModal, setShowSubcategoryModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalType, setModalType] = useState('category'); // 'category' yoki 'subcategory'
  const itemsPerPage = 5;

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'category', 'subcategory'
  const [selectedParentCategory, setSelectedParentCategory] = useState('');

  // Get main categories
  const mainCategories = categories.filter(cat => cat.type === 'category');

  // Filter categories
  const filteredCategories = useMemo(() => {
    return mainCategories.filter(category => {
      const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase());
      const subCategories = categories.filter(cat => cat.categoryId === category.id);
      const subCategoryMatchesSearch = subCategories.some(sub => 
        sub.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      if (filterType === 'category') {
        return matchesSearch;
      } else if (filterType === 'subcategory') {
        return subCategoryMatchesSearch;
      }
      
      return matchesSearch || subCategoryMatchesSearch;
    });
  }, [categories, searchTerm, filterType]);

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCategories = filteredCategories.slice(startIndex, endIndex);

  // Faqat asosiy kategoriyalarni olish
  const getSubCategories = (categoryId) => {
    return categories.filter(cat => cat.categoryId === categoryId);
  };

  const handleAdd = (type) => {
    setSelectedCategory(null);
    setModalType(type);
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setSelectedCategory(item);
    setModalType(item.type);
    setShowModal(true);
  };

  const handleDelete = (item) => {
    setSelectedCategory(item);
    setShowDeleteModal(true);
  };

  const handleView = (item) => {
    setSelectedCategory(item);
    setShowViewModal(true);
  };

  const handleConfirmDelete = () => {
    if (selectedCategory.type === 'category') {
      // Kategoriya va uning ichki kategoriyalarini o'chirish
      setCategories(categories.filter(cat => 
        cat.id !== selectedCategory.id && cat.categoryId !== selectedCategory.id
      ));
    } else {
      // Faqat subkategoriyani o'chirish
      setCategories(categories.filter(cat => cat.id !== selectedCategory.id));
    }
    setShowDeleteModal(false);
    setSelectedCategory(null);
  };

  const handleSubmit = async (data) => {
    try {
      if (selectedCategory) {
        // Update category
        const updatedCategory = await updateCategory({
          id: selectedCategory.id,
          name: data.name,
          type: 'category'
        });

        // Update or create subcategories
        const existingSubcategories = categories.filter(cat => cat.categoryId === selectedCategory.id);
        const updatedSubcategories = data.subcategories;

        // Remove deleted subcategories
        for (const existingSub of existingSubcategories) {
          if (!updatedSubcategories.find(sub => sub.id === existingSub.id)) {
            await deleteCategory(existingSub.id);
          }
        }

        // Update or create subcategories
        for (const sub of updatedSubcategories) {
          if (sub.id) {
            // Update existing subcategory
            await updateCategory({
              id: sub.id,
              name: sub.name,
              type: 'subcategory',
              categoryId: selectedCategory.id
            });
          } else {
            // Create new subcategory
            await createCategory({
              name: sub.name,
              type: 'subcategory',
              categoryId: selectedCategory.id
            });
          }
        }
      } else {
        // Create new category
        const newCategory = await createCategory({
          name: data.name,
          type: 'category'
        });

        // Create subcategories
        for (const sub of data.subcategories) {
          await createCategory({
            name: sub.name,
            type: 'subcategory',
            categoryId: newCategory.id
          });
        }
      }

      setShowModal(false);
      setSelectedCategory(null);
      fetchCategories();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSubcategoryClick = (subcategory) => {
    setSelectedSubcategory(subcategory);
    setShowSubcategoryModal(true);
  };

  const handleSubcategorySave = (updatedSubcategory) => {
    // Subkategoriyani yangilash logikasi
    const updatedCategories = categories.map(category => {
      if (category.id === selectedSubcategory.categoryId) {
        return {
          ...category,
          subcategories: category.subcategories.map(sub => 
            sub.id === updatedSubcategory.id ? updatedSubcategory : sub
          )
        };
      }
      return category;
    });
    setCategories(updatedCategories);
    setShowSubcategoryModal(false);
  };

  return (
    <>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Kategoriyalar</h1>
            <p className="mt-1 text-sm text-gray-600">
              Mahsulot kategoriyalari va ularning subkategoriyalari
            </p>
          </div>
          <button
            onClick={() => handleAdd('category')}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Kategoriya
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                  Qidirish
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    type="text"
                    name="search"
                    id="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    placeholder="Kategoriya yoki subkategoriya nomi"
                  />
                </div>
              </div>

              {/* Type Filter */}
              <div>
                <label htmlFor="filterType" className="block text-sm font-medium text-gray-700">
                  Turi
                </label>
                <select
                  id="filterType"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="all">Barchasi</option>
                  <option value="category">Faqat kategoriyalar</option>
                  <option value="subcategory">Faqat subkategoriyalar</option>
                </select>
              </div>

              {/* Reset Filters */}
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilterType('all');
                  }}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <FunnelIcon className="h-5 w-5 mr-2 text-gray-400" />
                  Filterni tozalash
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="min-w-full divide-y divide-gray-200">
            <div className="bg-gray-50">
              <div className="grid grid-cols-12 px-6 py-3 gap-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="col-span-5">Kategoriya</div>
                <div className="col-span-6">Subkategoriya</div>
                <div className="col-span-1 text-right">Amallar</div>
              </div>
            </div>
            <div className="bg-white divide-y divide-gray-200">
              {currentCategories.map((category) => (
                <div key={category.id} className="grid grid-cols-12 px-6 py-4 gap-4 hover:bg-gray-50">
                  <div className="col-span-5">
                    <div className="text-sm font-medium text-gray-900">
                      {category.name}
                    </div>
                  </div>
                  <div className="col-span-6">
                    <div className="flex flex-wrap gap-2">
                      {getSubCategories(category.id).map(subCat => (
                        <div key={subCat.id} className="flex items-center rounded-full px-2 bg-gray-200 hover:bg-gray-300 transition-colors">
                          <button
                            onClick={() => handleSubcategoryClick(subCat)}
                            className="inline-flex items-center px-2.5 py-1.5 text-sm text-gray-900"
                          >
                            {subCat.name}
                          </button>
                          <button
                            onClick={() => handleDelete(subCat)}
                            className="ml-1 text-gray-400 hover:text-red-600 p-0.5"
                          >
                            <TrashIcon className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="col-span-1 flex justify-end items-center space-x-2">
                    <button
                      onClick={() => handleView(category)}
                      className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleEdit(category)}
                      className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-50"
                    >
                      <PencilSquareIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(category)}
                      className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {categories.length === 0 && (
            <div className="text-center py-12">
              <div className="text-sm text-gray-500">Hozircha kategoriyalar yo'q</div>
            </div>
          )}

          {/* Pagination */}
          {mainCategories.length > 0 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Oldingi
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Keyingi
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Jami <span className="font-medium">{mainCategories.length}</span> ta kategoriyadan{' '}
                    <span className="font-medium">{startIndex + 1}</span>-
                    <span className="font-medium">{Math.min(endIndex, mainCategories.length)}</span>{' '}
                    ko'rsatilyapti
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Oldingi</span>
                      <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                    {[...Array(totalPages)].map((_, index) => (
                      <button
                        key={index + 1}
                        onClick={() => handlePageChange(index + 1)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === index + 1
                            ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Keyingi</span>
                      <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Category Form Modal */}
        <CategoryFormModal
          show={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedCategory(null);
          }}
          onSubmit={handleSubmit}
          initialData={selectedCategory}
          categories={categories}
          modalType={modalType}
        />

        {/* Delete Confirm Modal */}
        <DeleteConfirmModal
          show={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedCategory(null);
          }}
          onConfirm={handleConfirmDelete}
          category={selectedCategory}
          categories={categories}
        />

        {/* View Category Modal */}
        <CategoryViewModal
          show={showViewModal}
          onClose={() => {
            setShowViewModal(false);
            setSelectedCategory(null);
          }}
          category={selectedCategory}
          categories={categories}
        />

        {/* Subcategory Edit Modal */}
        {showSubcategoryModal && selectedSubcategory && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
              {/* Backdrop */}
              <div
                className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={() => setShowSubcategoryModal(false)}
              ></div>

              {/* Modal */}
              <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
                {/* Close button */}
                <div className="absolute top-0 right-0 pt-4 pr-4">
                  <button
                    onClick={() => setShowSubcategoryModal(false)}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Subkategoriyani tahrirlash
                  </h3>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    handleSubcategorySave({
                      ...selectedSubcategory,
                      name: e.target.name.value
                    });
                  }}>
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Nomi
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        defaultValue={selectedSubcategory.name}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required
                      />
                    </div>

                    {/* Footer */}
                    <div className="mt-6 flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setShowSubcategoryModal(false)}
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
          </div>
        )}
      </div>
    </>
  );
}
