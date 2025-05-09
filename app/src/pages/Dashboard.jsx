import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { getInventoryItems, deleteInventoryItem } from '../services/inventoryService';

function Dashboard() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const fetchedItems = await getInventoryItems(currentUser.uid);
        setItems(fetchedItems);
      } catch (error) {
        toast.error('Failed to fetch items');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [currentUser]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteInventoryItem(id);
        setItems(items.filter(item => item.id !== id));
        toast.success('Item deleted successfully');
      } catch (error) {
        toast.error('Failed to delete item');
        console.error(error);
      }
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Inventory</h1>
        <Link 
          to="/add-item" 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add New Item
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded">
          <p className="mb-4">You don't have any items yet.</p>
          <Link 
            to="/add-item" 
            className="text-blue-500 hover:underline"
          >
            Add your first item
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(item => (
            <div key={item.id} className="border rounded p-4 bg-white shadow-sm">
              <h2 className="text-xl font-semibold mb-2">{item.name}</h2>
              <p className="text-gray-600 mb-2">{item.description}</p>
              <div className="flex justify-between text-sm mb-4">
                <span>Quantity: {item.quantity}</span>
                <span>Price: ${item.price}</span>
              </div>
              <div className="flex justify-between">
                <Link 
                  to={`/edit-item/${item.id}`}
                  className="text-blue-500 hover:underline"
                >
                  Edit
                </Link>
                <button 
                  onClick={() => handleDelete(item.id)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
