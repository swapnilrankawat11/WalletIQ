import { useEffect, useState } from "react";
import { getCategories, deleteCategory } from "../services/categoriesApi";
import { toast } from "react-toastify";
import CategoryList from "../components/Categories/CategoryList";
import CategoryDetailsModal from "../components/Categories/CategoryDetailsModal";
import AddEditCategoryModal from "../components/Categories/AddEditCategoryModal";
import "../styles/categories/CategoriesPage.css";

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCategoryDetails, setEditingCategoryDetails] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await getCategories();
      setCategories(response.data);
    } catch (err) {
      const errorMsg =
        err?.response?.data?.error || "Something went wrong! Try Again.";
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    await deleteCategory(id);
    fetchCategories();
  };

  const handleEdit = (item) => {
    setEditingCategoryDetails(item);
    setShowModal(true);
  };

  const handleSuccess = () => {
    fetchCategories();
  };

  const handleViewDetails = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div className="categories-page">
      <div className="categories-header">
        <h2>Manage Transaction Categories</h2>
        <button
          className="add-category-button"
          onClick={() => {
            setEditingCategoryDetails(null);
            setShowModal(true);
          }}
        >
          + Add Category
        </button>
      </div>

      {showModal && (
        <AddEditCategoryModal
          editingCategoryDetails={editingCategoryDetails}
          onSuccess={handleSuccess}
          onCancel={() => {
            setEditingCategoryDetails(null);
            setShowModal(false);
          }}
        />
      )}

      {categories && (
        <CategoryList
          categories={categories}
          loading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onViewDetails={handleViewDetails}
        />
      )}

      {selectedCategory && (
        <CategoryDetailsModal
          category={selectedCategory}
          onClose={() => {
            setSelectedCategory(null);
          }}
        />
      )}
    </div>
  );
};

export default CategoriesPage;
