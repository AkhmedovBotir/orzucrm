import { useState, useMemo, useEffect } from 'react';
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
import {
  getCategories,
  createCategory,
  updateCategory,
  createSubcategory,
  updateSubcategory,
  deleteCategory,
  deleteSubcategory,
  getCategoryWithSubs
} from '../../api/categories';
import AddCategoryModal from '../../components/categories/AddCategoryModal';
import EditCategoryModal from '../../components/categories/EditCategoryModal';
import DeleteConfirmModal from '../../components/categories/DeleteConfirmModal';
import ViewCategoryModal from '../../components/categories/ViewCategoryModal';
import SubcategoryFormModal from '../../components/categories/SubcategoryFormModal';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showSubcategoryModal, setShowSubcategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteType, setDeleteType] = useState(null); // 'category' yoki 'subcategory'
  const [currentPage, setCurrentPage] = useState(1);
  const [showSubcategoryFormModal, setShowSubcategoryFormModal] = useState(false);
  const [selectedCategoryForSub, setSelectedCategoryForSub] = useState(null);
  const itemsPerPage = 5;

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const getSubCategories = (category) => {
    return category?.subcategories || [];
  };

  // Filtered categories
  const filteredCategories = useMemo(() => {
    if (!Array.isArray(categories)) return [];

    return categories.filter(category => {
      const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase());
      const subCategories = getSubCategories(category);
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

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleAdd = () => {
    setShowAddModal(true);
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setShowEditModal(true);
  };

  const handleView = (category) => {
    setSelectedCategory(category);
    setShowViewModal(true);
  };

  const handleDeleteCategory = (categoryId) => {
    setItemToDelete({ _id: categoryId });
    setDeleteType('category');
    setShowDeleteModal(true);
  };

  const handleDeleteSubcategory = (categoryId, subcategoryId) => {
    setItemToDelete({ categoryId, subcategoryId });
    setDeleteType('subcategory');
    setShowDeleteModal(true);
  };

  const handleSubcategoryClick = (subCategory) => {
    setSelectedSubcategory(subCategory);
    setShowSubcategoryModal(true);
  };

  const handleAddSubcategory = (category) => {
    setSelectedCategoryForSub(category);
    setShowSubcategoryFormModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      if (!itemToDelete) return;

      if (deleteType === 'subcategory') {
        const { categoryId, subcategoryId } = itemToDelete;
        if (!categoryId || !subcategoryId) {
          throw new Error('Category ID or Subcategory ID is missing');
        }
        await deleteSubcategory(categoryId, subcategoryId);
      } else {
        const { _id } = itemToDelete;
        if (!_id) {
          throw new Error('Category ID is missing');
        }
        await deleteCategory(_id);
      }

      setShowDeleteModal(false);
      setItemToDelete(null);
      setDeleteType(null);
      setSelectedSubcategory(null);
      await fetchCategories();
    } catch (error) {
      console.error('Error deleting:', error);
      setError(error.message || 'Error occurred while deleting');
    }
  };

  const handleSubcategorySave = async (data) => {
    try {
      const categoryId = selectedCategory?._id;
      const subcategoryId = selectedSubcategory?._id;
      if (!categoryId || !subcategoryId) return;

      await updateSubcategory(categoryId, subcategoryId, {
        name: data.name,
      });
      setShowSubcategoryModal(false);
      setSelectedSubcategory(null);
      await fetchCategories();
    } catch (error) {
      console.error('Error updating subcategory:', error);
    }
  };

  const handleCategorySubmit = async (data) => {
    try {
      if (data._id) {
        await updateCategory(data._id, { name: data.name });
        setShowEditModal(false);
        setSelectedCategory(null);
      } else {
        await createCategory({ name: data.name });
        setShowAddModal(false);
      }
      await fetchCategories();
    } catch (error) {
      console.error('Error submitting category:', error);
      setError(error.message);
    }
  };

  const handleCreateSubcategory = async (data) => {
    try {
      if (!selectedCategoryForSub) return;
      await createSubcategory(selectedCategoryForSub._id, {
        name: data.name,
      });
      setShowSubcategoryFormModal(false);
      setSelectedCategoryForSub(null);
      await fetchCategories();
    } catch (error) {
      console.error('Error creating subcategory:', error);
    }
  };


  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await getCategories();
      setCategories(response || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
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
          Kategoriya qo'shish
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
              <div className="col-span-5">Subkategoriyalar</div>
              <div className="col-span-2 text-right">Amallar</div>
            </div>
          </div>
          <div className="bg-white divide-y divide-gray-200">
            {filteredCategories.map((category) => (
              <div key={category._id} className="grid grid-cols-12 px-6 py-4 gap-4 hover:bg-gray-50">
                <div className="col-span-5 flex items-center">
                  <span className="text-sm font-medium text-gray-900">{category.name}</span>
                </div>
                <div className="col-span-5">
                  <div className="flex flex-wrap gap-2">
                    {category.subcategories?.map((sub) => (
                      <div
                        key={sub._id}
                        className="inline-flex items-center rounded-full px-2 bg-gray-200 hover:bg-gray-300 transition-colors"
                      >
                        <button
                          onClick={() => {
                            setSelectedCategory(category);
                            setSelectedSubcategory(sub);
                            setShowSubcategoryModal(true);
                          }}
                          className="inline-flex items-center px-2.5 py-1.5 text-sm text-gray-900"
                        >
                          {sub.name}
                        </button>
                        <button
                          onClick={() => handleDeleteSubcategory(category._id, sub._id)}
                          className="ml-1 text-gray-400 hover:text-red-600 p-0.5"
                        >
                          <TrashIcon className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="col-span-2 flex justify-end space-x-2">
                  <button
                    onClick={() => {
                      setSelectedCategory(category);
                      setShowEditModal(true);
                    }}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    <PencilSquareIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCategoryForSub(category);
                      setShowSubcategoryFormModal(true);
                    }}
                    className="text-green-600 hover:text-green-900"
                  >
                    <PlusIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-4">
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
                Jami <span className="font-medium">{filteredCategories.length}</span> ta kategoriyadan{' '}
                <span className="font-medium">{startIndex + 1}</span>-
                <span className="font-medium">
                  {Math.min(endIndex, filteredCategories.length)}
                </span>{' '}
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
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === index + 1
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

      {/* Delete Confirm Modal */}
      <DeleteConfirmModal
        show={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setItemToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        category={itemToDelete}
        categories={categories}
      />

      {/* View Modal */}
      <ViewCategoryModal
        show={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedCategory(null);
        }}
        categoryId={selectedCategory?.id}
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
                    id: selectedSubcategory.id,
                    category_id: selectedSubcategory.category_id,
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

      {/* Subcategory Form Modal */}
      <SubcategoryFormModal
        show={showSubcategoryFormModal}
        onClose={() => {
          setShowSubcategoryFormModal(false);
          setSelectedCategoryForSub(null);
        }}
        onSubmit={handleCreateSubcategory}
        category={selectedCategoryForSub}
      />

      {/* Category Modals */}
      <AddCategoryModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleCategorySubmit}
      />
      <EditCategoryModal
        show={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedCategory(null);
        }}
        onSubmit={handleCategorySubmit}
        initialData={selectedCategory}
      />
    </div>
  );
}
