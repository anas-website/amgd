import React, { useState, useEffect } from 'react';
import { Upload, X } from 'lucide-react';

const AdminPanel = ({ onClose }) => {
    const [images, setImages] = useState([]);

    useEffect(() => {
        const saved = localStorage.getItem('admin_images');
        if (saved) setImages(JSON.parse(saved));
    }, []);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const newImages = [...images, { id: Date.now(), src: reader.result, name: file.name }];
                setImages(newImages);
                localStorage.setItem('admin_images', JSON.stringify(newImages));
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = (id) => {
        const newImages = images.filter(img => img.id !== id);
        setImages(newImages);
        localStorage.setItem('admin_images', JSON.stringify(newImages));
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="glass-panel w-full max-w-2xl p-6 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-white hover:text-red-500">
                    <X size={24} />
                </button>

                <h2 className="text-2xl font-bold mb-6 text-white text-center">Admin: Upload Reference Images</h2>

                <div className="border-2 border-dashed border-glass-border rounded-xl p-8 text-center mb-8 hover:bg-glass-highlight transition-colors relative">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                        <Upload size={48} />
                        <p>Click or Drag to Upload Image</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto">
                    {images.map((img) => (
                        <div key={img.id} className="relative group">
                            <img src={img.src} alt={img.name} className="w-full h-32 object-cover rounded-lg border border-white/10" />
                            <button
                                onClick={() => removeImage(img.id)}
                                className="absolute top-2 right-2 p-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X size={12} />
                            </button>
                        </div>
                    ))}
                    {images.length === 0 && <p className="col-span-full text-center text-gray-500">No images uploaded yet.</p>}
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;
