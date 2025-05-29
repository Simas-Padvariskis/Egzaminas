import { useState, useEffect } from 'react';

const EditCategoryModal = ({ category, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        title: '',
    });

    useEffect(() => {
        if (category) {
            setFormData({
                title: category.title || '',
            });
        }
    }, [category]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.title.trim()) {
            alert('Pavadinimas negali būti tuščias');
            return;
        }
        onSave({ ...(category || {}), ...formData });
    };

    return (
        <div className="edit-modal-backdrop">
            <div className="edit-modal-content">
                <h5>{category ? 'Redaguoti kategoriją' : 'Pridėti kategoriją'}</h5>
                <form onSubmit={handleSubmit} className="edit-form">
                    <label>Pavadinimas</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                    />
                    <div className="actions">
                        <button type="submit" className="btn btn-primary">Išsaugoti</button>
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Atšaukti</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditCategoryModal;