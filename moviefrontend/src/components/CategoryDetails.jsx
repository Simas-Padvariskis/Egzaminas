const CategoryDetails = ({ category, onEdit, onDelete }) => {
    return (
        <div className="col">
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">{category.title || 'Be pavadinimo'}</h5>
                    <div className="card-actions">
                        {/* Removed the undefined onTasks */}
                        <button onClick={() => onEdit(category)} className="btn btn-sm btn-warning">Redaguoti</button>
                        <button onClick={() => onDelete(category)} className="btn btn-sm btn-danger">Ištrinti</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryDetails;