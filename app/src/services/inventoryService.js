import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase';

const inventoryCollection = collection(db, 'inventory');

// Add a new inventory item
export const addInventoryItem = async (itemData, userId) => {
  return await addDoc(inventoryCollection, {
    ...itemData,
    userId,
    createdAt: serverTimestamp()
  });
};

// Get all inventory items for a user
export const getInventoryItems = async (userId) => {
  const q = query(inventoryCollection, where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

// Get a single inventory item
export const getInventoryItem = async (itemId) => {
  const docRef = doc(db, 'inventory', itemId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return {
      id: docSnap.id,
      ...docSnap.data()
    };
  } else {
    return null;
  }
};

// Update an inventory item
export const updateInventoryItem = async (itemId, itemData) => {
  const docRef = doc(db, 'inventory', itemId);
  return await updateDoc(docRef, {
    ...itemData,
    updatedAt: serverTimestamp()
  });
};

// Delete an inventory item
export const deleteInventoryItem = async (itemId) => {
  const docRef = doc(db, 'inventory', itemId);
  return await deleteDoc(docRef);
};
