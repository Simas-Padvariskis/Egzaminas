import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCategories } from '../context/CategoryContext';
import { useLoading } from '../context/LoadingContext';
import { deleteCategory } from '../services/CategoryServices';
import { updateCategory } from '../services/CategoryServices';
import { createCategory } from '../services/CategoryServices';
import EditCategoryModal from '../components/EditCategoryModal';
import CategoryDetails from '../components/CategoryDetails';

function Categories() {
    const { accessToken, logout } = useAuth();
    const { getCategories } = useCategories();
    const { setLoading } = useLoading();
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [modal, setModal] = useState({ type: null, data: null });
    
    const openModal = (type, data) => {
        setModal({ type, data });
    };

    useEffect(() => {
        document.title = 'Movie Application - Kategorijų sąrašas';

        const token = localStorage.getItem('jwtToken');  // Fallback to localStorage

        if (!token) {
            navigate('/login');
        } else {
            fetchCategories();
        }
    }, [navigate]);

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                setModal({ type: null, data: null });
                setSuccess(false);
            }, 2500);
            return () => clearTimeout(timer);
        }
    }, [success]);

    const fetchCategories = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getCategories(accessToken);
            console.log('Categories data:', data); // Log the response
            setCategories(Array.isArray(data) ? data : []); // Make sure it's always an array
        } catch (err) {
            setError(`Klaida: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCategory = async (categoryId) => {
            try {
                await deleteCategory(categoryId, accessToken);
                setCategories((prev) => prev.filter((category) => category.id !== categoryId));
                setSuccess(true);
            } catch (err) {
                setError(`Nepavyko ištrinti kategorijos: ${err.message}`);
            }
        };

    const handleLogout = () => {
        setLoading(true);
        logout();
        navigate('/');
        setLoading(false);
    };

    if (error) return <p>{error}</p>;

        return (
        <main className="content">
            <div className="dashboard-wrapper">
                <nav className="sidebar">
                    <div className="sidebar-header">
                        <h4 className="text-white">Kategorijų sąrašas</h4>
                    </div>
                    <ul className="nav flex-column">
                        <li className="nav-item">
                            <Link to="/dashboard" className="nav-link text-white">Grįžti į Dashboard</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/movies" className="nav-link text-white">Filmų sąrašas</Link>
                        </li>
                        <li className="nav-item">
                            <button onClick={handleLogout} className="nav-link text-white w-100 text-start">Atsijungti</button>
                        </li>
                    </ul>
                </nav>

                <div className="main-content">
                    <div className="container-fluid p-5">
                        <h1 className="title">Kategorijų sąrašas</h1>
                        <button
                            className="btn btn-primary mb-3 AddCategoryButton"
                            onClick={() => openModal('create', null)}
                            >
                            Pridėti Kategoriją
                        </button>
                        {/* Safe rendering: Ensure categories is always an array */}
                        {Array.isArray(categories) && categories.length > 0 ? (
                            <div className="row row-cols-1 row-cols-md-2 g-4">
                                {categories.map((category) => (
                                    <CategoryDetails
                                        key={category.id}
                                        category={category}
                                        onEdit={(data) => openModal('update', data)}
                                        onDelete={(data) => openModal('delete', data)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <p>Nėra Kategorijų.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal window for deleting category*/}
            {modal.type === 'delete' && (
                <div className="modal-backdrop">
                    <div className="modal-content bg-white p-4 rounded shadow">
                        <h5>Ar tikrai norite ištrinti kategoriją „{modal.data.title}“?</h5>
                        <div className="mt-3 d-flex gap-2">
                            <button
                                className="btn btn-danger"
                                onClick={() => {
                                    handleDeleteCategory(modal.data.id);
                                    setModal({ type: null, data: null });
                                }}
                            >
                                Taip
                            </button>
                            <button className="btn btn-secondary" onClick={() => setModal({ type: null, data: null })}>
                                Atšaukti
                            </button>
                        </div>
                    </div>
                </div>
            )}            
            
            {/* Modal window for editing category*/}
            {modal.type === 'update' && (
                <EditCategoryModal
                    category={modal.data}
                    onSave={async (updatedCategory) => {
                        try {
                            setLoading(true);
                                       
                            await updateCategory(updatedCategory.id, updatedCategory, accessToken);
                                       
                            setCategories((prevCategories) =>
                                prevCategories.map((m) => (m.id === updatedCategory.id ? updatedCategory : m))
                            );
                            setSuccess(true);
                        } catch (err) {
                                        setError(`Nepavyko atnaujinti filmo: ${err.message}`);
                        } finally {
                            setLoading(false);
                            setModal({ type: null, data: null });
                        }
                    }}
                    onClose={() => setModal({ type: null, data: null })}
                    />
                )}

                {/* Modal window for creating a new category */}
                {modal.type === 'create' && (
                    <EditCategoryModal
                        category={null}
                        onSave={async (newCategory) => {
                            try {
                                setLoading(true);
                                const createdCategory = await createCategory(newCategory, accessToken);
                                setCategories((prevCategories) => [...prevCategories, createdCategory]);
                                setSuccess(true);
                            } catch (err) {
                                setError(`Nepavyko sukurti kategorijos: ${err.message}`);
                            } finally {
                                setLoading(false);
                                setModal({ type: null, data: null });
                            }
                        }}
                        onClose={() => setModal({ type: null, data: null })}
                    />
                )}

        </main>
    );
}

export default Categories;