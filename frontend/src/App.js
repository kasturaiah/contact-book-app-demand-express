import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { FaHeart, FaRegHeart, FaEdit, FaTrashAlt } from 'react-icons/fa';

function App() {
  const [contacts, setContacts] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [editContact, setEditContact] = useState(null);
  const limit = 10;

  useEffect(() => {
    fetchContacts();
  }, [page]);

  const fetchContacts = async () => {
    setIsLoading(true);
    try {
      const BACKEND_URL = 'https://contact-book-app-demand-express.onrender.com';
      const res = await axios.get(`${BACKEND_URL}/contacts?page=${page}&limit=${limit}`);
      setContacts(res.data.contacts);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editContact) {
      setEditContact({ ...editContact, [name]: value });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleAddOrUpdateContact = async (e) => {
    e.preventDefault();
    try {
      if (editContact) {
        await axios.put(`/contacts/${editContact.id}`, { ...editContact, is_favorite: editContact.is_favorite });
        setEditContact(null);
      } else {
        await axios.post('/contacts', { ...formData, is_favorite: false });
        setFormData({ name: '', email: '', phone: '' });
      }
      fetchContacts();
    } catch (error) {
            console.error('Error adding/updating contact:', error);
            if (error.response && error.response.data && error.response.data.error) {
                alert(`Failed to add or update contact: ${error.response.data.error}`);
            } else {
                alert('Failed to add or update contact. Please try again.');
            }
        }
  };

  const handleDeleteContact = async (id) => {
    try {
      await axios.delete(`/contacts/${id}`);
      fetchContacts();
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  const handleToggleFavorite = async (contact) => {
    const updatedContact = { ...contact, is_favorite: !contact.is_favorite };
    try {
      await axios.put(`/contacts/${contact.id}`, updatedContact);
      fetchContacts();
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const favoriteContacts = contacts.filter(c => c.is_favorite);
  const otherContacts = contacts.filter(c => !c.is_favorite);

  return (
    <div className="container">
      <h1 className="title">Contact Book</h1>
      <form className="form" onSubmit={handleAddOrUpdateContact}>
        <input type="text" name="name" placeholder="Name" value={editContact ? editContact.name : formData.name} onChange={handleInputChange} required />
        <input type="email" name="email" placeholder="Email" value={editContact ? editContact.email : formData.email} onChange={handleInputChange} required />
        <input type="tel" name="phone" placeholder="Phone" value={editContact ? editContact.phone : formData.phone} onChange={handleInputChange} required />
        <button type="submit" className="add-button">{editContact ? 'Update Contact' : 'Add Contact'}</button>
        {editContact && <button type="button" onClick={() => setEditContact(null)} className="cancel-button">Cancel</button>}
      </form>
      {favoriteContacts.length > 0 && (
        <div className="favorite-section">
          <h2>⭐ Favorites</h2>
          <ul className="contact-list favorite-list">
            {favoriteContacts.map(contact => (
              <li key={contact.id} className="contact-item">
                <div className="contact-info">
                  <strong>{contact.name}</strong>
                  <span>{contact.email}</span>
                  <span>{contact.phone}</span>
                </div>
                <div className="contact-actions">
                  <button onClick={() => setEditContact(contact)} className="action-button edit-button"><FaEdit /></button>
                  <button onClick={() => handleToggleFavorite(contact)} className="action-button favorite-button"><FaHeart /></button>
                  <button onClick={() => handleDeleteContact(contact.id)} className="action-button delete-button"><FaTrashAlt /></button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      {otherContacts.length > 0 && (
        <div className="contacts-section">
          <h2>All Contacts</h2>
          <ul className="contact-list">
            {otherContacts.map(contact => (
              <li key={contact.id} className="contact-item">
                <div className="contact-info">
                  <strong>{contact.name}</strong>
                  <span>{contact.email}</span>
                  <span>{contact.phone}</span>
                </div>
                <div className="contact-actions">
                  <button onClick={() => setEditContact(contact)} className="action-button edit-button"><FaEdit /></button>
                  <button onClick={() => handleToggleFavorite(contact)} className="action-button unfavorite-button"><FaRegHeart /></button>
                  <button onClick={() => handleDeleteContact(contact.id)} className="action-button delete-button"><FaTrashAlt /></button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="pagination">
        <button onClick={handlePrevPage} disabled={page === 1}>Previous</button>
        <span>Page {page} of {totalPages}</span>
        <button onClick={handleNextPage} disabled={page === totalPages}>Next</button>
      </div>
    </div>
  );
}

export default App;
