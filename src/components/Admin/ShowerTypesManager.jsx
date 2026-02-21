import React, { useState, useEffect } from 'react';
import { ID, Query } from 'appwrite';
import {
    tables,
    storage,
    DATABASE_ID,
    TABLE_SHOWER_TYPES,
    BUCKET_ID,
    APPWRITE_ENDPOINT,
    APPWRITE_PROJECT_ID
} from '../../appwrite/config';
import {
    Plus,
    Edit2,
    Trash2,
    Image as ImageIcon,
    Check,
    X,
    Loader2,
    Upload
} from 'lucide-react';

const ShowerTypesManager = () => {
    const [types, setTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingType, setEditingType] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        pricePerM2: '',
        active: true,
        mainImageId: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchTypes();
    }, []);

    const fetchTypes = async () => {
        try {
            const response = await tables.listDocuments(
                DATABASE_ID,
                TABLE_SHOWER_TYPES,
                [Query.orderDesc('$createdAt')]
            );
            setTypes(response.documents.map(doc => ({ id: doc.$id, ...doc })));
        } catch (error) {
            console.error("Error fetching types:", error);
        } finally {
            setLoading(false);
        }
    };

    const getImageUrl = (fileId) => {
        return `${APPWRITE_ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${fileId}/view?project=${APPWRITE_PROJECT_ID}`;
    };

    const handleOpenModal = (type = null) => {
        if (type) {
            setEditingType(type);
            setFormData({
                name: type.name,
                description: type.description || '',
                pricePerM2: type.pricePerM2,
                active: type.active,
                mainImageId: type.mainImageId
            });
        } else {
            setEditingType(null);
            setFormData({
                name: '',
                description: '',
                pricePerM2: '',
                active: true,
                mainImageId: ''
            });
        }
        setImageFile(null);
        setIsModalOpen(true);
    };

    const handleUploadImage = async (file) => {
        const response = await storage.createFile(BUCKET_ID, ID.unique(), file);
        return response.$id;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);
        try {
            let mainImageId = formData.mainImageId;
            if (imageFile) {
                mainImageId = await handleUploadImage(imageFile);
            }

            const data = {
                name: formData.name,
                description: formData.description,
                pricePerM2: Number(formData.pricePerM2),
                active: formData.active,
                mainImageId: mainImageId
            };

            if (editingType) {
                await tables.updateDocument(DATABASE_ID, TABLE_SHOWER_TYPES, editingType.$id, data);
            } else {
                await tables.createDocument(DATABASE_ID, TABLE_SHOWER_TYPES, ID.unique(), {
                    ...data,
                    createdAt: new Date().toISOString()
                });
            }
            setIsModalOpen(false);
            fetchTypes();
        } catch (error) {
            console.error("Error saving shower type:", error);
            alert("Failed to save shower type.");
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id, imageId) => {
        if (window.confirm("Are you sure you want to delete this glass type?")) {
            try {
                await tables.deleteDocument(DATABASE_ID, TABLE_SHOWER_TYPES, id);
                if (imageId) {
                    await storage.deleteFile(BUCKET_ID, imageId);
                }
                fetchTypes();
            } catch (error) {
                console.error("Error deleting:", error);
            }
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="animate-spin text-blue-500" size={40} />
            </div>
        );
    }

    return (
                <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                    <h2 className="text-xl sm:text-2xl font-display font-semibold text-gray-900">Shower Glass Models</h2>
                    <p className="text-gray-500 text-sm hidden sm:block">Create and manage your catalog</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-3 rounded-xl transition-all shadow-lg shadow-blue-600/20 touch-target w-full sm:w-auto"
                >
                    <Plus size={20} />
                    Add New Model
                </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {types.map((type) => (
                    <div key={type.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden group shadow-sm hover:shadow-md transition-shadow">
                        <div className="aspect-video relative overflow-hidden bg-gray-100">
                            {type.mainImageId ? (
                                <img
                                    src={getImageUrl(type.mainImageId)}
                                    alt={type.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-600">
                                    <ImageIcon size={48} />
                                </div>
                            )}
                                <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex gap-2">
                                <button
                                    onClick={() => handleOpenModal(type)}
                                    className="p-2.5 sm:p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white shadow-md transition-all touch-target"
                                    aria-label="Edit"
                                >
                                    <Edit2 size={18} className="text-gray-700 sm:w-4 sm:h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(type.id, type.mainImageId)}
                                    className="p-2.5 sm:p-2 bg-red-50 backdrop-blur-sm rounded-lg hover:bg-red-100 transition-all touch-target"
                                    aria-label="Delete"
                                >
                                    <Trash2 size={18} className="text-red-600 sm:w-4 sm:h-4" />
                                </button>
                            </div>
                            {!type.active && (
                                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                                    <span className="bg-gray-900/80 text-white px-3 py-1 rounded-full text-xs font-semibold">
                                        INACTIVE
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="p-4 sm:p-5">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 mb-2">
                                <h3 className="text-base sm:text-lg font-bold">{type.name}</h3>
                                <span className="text-blue-400 font-bold text-sm sm:text-base">{type.pricePerM2} ILS<span className="text-xs text-gray-500 font-normal">/m²</span></span>
                            </div>
                            <p className="text-gray-400 text-sm line-clamp-2 mb-3 sm:mb-4">
                                {type.description || "No description provided."}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} aria-hidden="true"></div>
                            <div className="relative bg-white border border-gray-200 sm:rounded-2xl rounded-t-2xl w-full max-w-2xl max-h-[90vh] sm:max-h-[85vh] shadow-xl overflow-hidden flex flex-col">
                        <div className="p-4 sm:p-6 border-b border-gray-200 flex justify-between items-center shrink-0">
                            <h3 className="text-lg sm:text-xl font-bold">{editingType ? 'Edit Glass Model' : 'Add New Glass Model'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 -mr-2 text-gray-500 hover:text-gray-900 touch-target" aria-label="Close">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 min-h-0">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Model Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-gray-900 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
                                        placeholder="e.g. Sliding Door Deluxe"
                                    />
                                </div>

                                <div className="sm:col-span-1">
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Price per m² (ILS)</label>
                                    <input
                                        type="number"
                                        required
                                        value={formData.pricePerM2}
                                        onChange={(e) => setFormData({ ...formData, pricePerM2: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-gray-900 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
                                        placeholder="250"
                                    />
                                </div>

                                <div className="sm:col-span-1">
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Status</label>
                                    <select
                                        value={formData.active}
                                        onChange={(e) => setFormData({ ...formData, active: e.target.value === 'true' })}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-gray-900 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
                                    >
                                    <option value="true">Active</option>
                                    <option value="false">Inactive</option>
                                    </select>
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                                    <textarea
                                        rows="3"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500/50 outline-none resize-none"
                                        placeholder="Optional details about this glass type..."
                                    ></textarea>
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Main Image</label>
                                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                                        <div className="w-24 h-24 rounded-2xl bg-gray-100 border border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                                            {imageFile ? (
                                                <img src={URL.createObjectURL(imageFile)} alt="Preview" className="w-full h-full object-cover" />
                                            ) : formData.mainImageId ? (
                                                <img src={getImageUrl(formData.mainImageId)} alt="Current" className="w-full h-full object-cover" />
                                            ) : (
                                                <ImageIcon size={24} className="text-gray-400" />
                                            )}
                                        </div>
                                        <label className="flex-1 cursor-pointer touch-target">
                                            <div className="bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl py-3 px-4 flex items-center justify-center gap-2 transition-all min-h-[44px] text-gray-600">
                                                <Upload size={18} />
                                                <span>{imageFile ? imageFile.name : 'Upload Image'}</span>
                                            </div>
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={(e) => setImageFile(e.target.files[0])}
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 flex flex-col-reverse sm:flex-row gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition-all touch-target"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={uploading}
                                    className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 touch-target"
                                >
                                    {uploading ? <Loader2 className="animate-spin" size={20} /> : <Check size={20} />}
                                    {editingType ? 'Update Model' : 'Save Model'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShowerTypesManager;
