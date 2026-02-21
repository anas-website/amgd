import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Query } from 'appwrite';
import {
    tables,
    DATABASE_ID,
    TABLE_SHOWER_TYPES,
    BUCKET_ID,
    APPWRITE_ENDPOINT,
    APPWRITE_PROJECT_ID
} from '../../appwrite/config';
import {
    ArrowRight,
    Droplets,
    Info,
    Loader2
} from 'lucide-react';

const Catalog = () => {
    const [types, setTypes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTypes();
    }, []);

    const fetchTypes = async () => {
        try {
            const response = await tables.listDocuments(
                DATABASE_ID,
                TABLE_SHOWER_TYPES,
                [Query.equal('active', true)]
            );
            setTypes(response.documents.map(doc => ({ id: doc.$id, ...doc })));
        } catch (error) {
            console.error("Error fetching catalog from showerTypes table:", error);
        } finally {
            setLoading(false);
        }
    };

    const getImageUrl = (fileId) => {
        return `${APPWRITE_ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${fileId}/view?project=${APPWRITE_PROJECT_ID}`;
    };

    if (loading) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center bg-gray-100">
                <Loader2 className="animate-spin text-blue-500" size={48} />
            </div>
        );
    }

    return (
        <div className="bg-gray-100">
            {/* Hero Section */}
            <section className="relative min-h-[28vh] sm:min-h-[36vh] flex items-center justify-center overflow-hidden py-12 sm:py-16 bg-white border-b border-gray-200">
                <div className="absolute inset-0 bg-gradient-to-b from-blue-50/80 to-transparent z-0" />
                <div className="relative z-10 text-center px-4 sm:px-6">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 tracking-tight text-gray-900">
                        Our Shower Glass <span className="text-blue-600">Collection</span>
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base md:text-lg">
                        Premium custom-made shower enclosures designed for modern living.
                        Choose your style and calculate your price instantly.
                    </p>
                </div>
            </section>

            {/* Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {types.map((type) => (
                        <Link
                            key={type.id}
                            to={`/product/${type.id}`}
                            className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-200 hover:border-blue-200 transition-all duration-300"
                        >
                            <div className="aspect-[4/3] relative overflow-hidden">
                                {type.mainImageId ? (
                                    <img
                                        src={getImageUrl(type.mainImageId)}
                                        alt={type.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                                        <Droplets size={64} />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className="absolute bottom-5 left-5 right-5 flex justify-between items-end">
                                    <div>
                                        <span className="text-xs font-semibold text-blue-500 uppercase tracking-wider mb-1 block">Premium Series</span>
                                        <h3 className="text-xl font-bold leading-tight text-white drop-shadow-lg">{type.name}</h3>
                                    </div>
                                    <div className="w-11 h-11 bg-white/90 rounded-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-lg">
                                        <ArrowRight size={22} className="text-gray-900 group-hover:text-white" />
                                    </div>
                                </div>
                            </div>

                            <div className="p-5 sm:p-6">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <Info size={16} />
                                        <span className="text-sm">From</span>
                                    </div>
                                    <span className="text-lg font-bold text-gray-900">
                                        {type.pricePerM2} <span className="text-xs font-normal text-gray-500">ILS/m²</span>
                                    </span>
                                </div>
                                <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                                    {type.description || "Elegant and durable glass solution for your bathroom renovation project."}
                                </p>

                                <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-2">
                                    <span className="px-3 py-1.5 bg-gray-100 rounded-lg text-xs font-medium text-gray-600">Custom Sizing</span>
                                    <span className="px-3 py-1.5 bg-gray-100 rounded-lg text-xs font-medium text-gray-600">10mm Tempered</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {types.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No glass models available.</h3>
                        <p className="text-gray-500 text-sm">Please check back later or contact us for inquiries.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Catalog;
