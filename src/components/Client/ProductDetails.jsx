import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    tables,
    DATABASE_ID,
    TABLE_SHOWER_TYPES,
    BUCKET_ID,
    APPWRITE_ENDPOINT,
    APPWRITE_PROJECT_ID
} from '../../appwrite/config';
import {
    ArrowLeft,
    Droplets,
    Loader2,
    ShieldCheck,
    Tag
} from 'lucide-react';
import Calculator from './Calculator';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await tables.getDocument(
                    DATABASE_ID,
                    TABLE_SHOWER_TYPES,
                    id
                );
                setProduct({ id: response.$id, ...response });
            } catch (error) {
                console.error("Error fetching product from showerTypes table:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const getImageUrl = (fileId) => {
        return `${APPWRITE_ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${fileId}/view?project=${APPWRITE_PROJECT_ID}`;
    };

    const designerUrl = useMemo(() => {
        if (!product) return '/designer';
        const params = new URLSearchParams({
            modelId: product.id,
            modelName: product.name,
            pricePerM2: String(product.pricePerM2 ?? ''),
            layout: 'straight',
        });
        return `/designer?${params.toString()}`;
    }, [product]);

    if (loading) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center bg-gray-100">
                <Loader2 className="animate-spin text-blue-500" size={48} />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 bg-gray-100">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
                <Link to="/" className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2">
                    <ArrowLeft size={20} /> Back to Catalog
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-gray-100 min-h-[60vh]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
                <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 font-medium text-sm transition-colors">
                    <ArrowLeft size={18} />
                    Back to Catalog
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16">
                    {/* Visual Side */}
                    <div className="space-y-6">
                        <div className="aspect-[4/5] md:aspect-square bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm relative group">
                            {product.mainImageId ? (
                                <img
                                    src={getImageUrl(product.mainImageId)}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500">
                                    <Droplets size={80} />
                                </div>
                            )}

                            <div className="absolute top-5 left-5">
                                <div className="flex items-center gap-2 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-gray-100">
                                    <ShieldCheck size={16} className="text-blue-500" />
                                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-700">Verified Design</span>
                                </div>
                            </div>
                        </div>

                        {/* Price Info Card */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                                    <Tag className="text-blue-600" size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">Base Price</p>
                                    <h4 className="text-xl font-bold text-gray-900">{product.pricePerM2} ILS <span className="text-sm font-normal text-gray-500">/ m²</span></h4>
                                </div>
                            </div>
                            <div className="hidden sm:block text-right">
                                <p className="text-xs text-gray-500 font-semibold uppercase tracking-tighter mb-1">Includes</p>
                                <div className="flex gap-2">
                                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg">10mm Glass</span>
                                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg">Hinges</span>
                                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg">Fitting</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Configuration Side */}
                    <div className="space-y-8">
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">{product.name}</h1>
                            <p className="text-gray-600 text-base leading-relaxed">
                                {product.description || "Our signature shower glass enclosure. Precision-cut from high-grade tempered glass with premium stainless steel hardware."}
                            </p>
                            <div className="mt-5">
                                <Link
                                    to={designerUrl}
                                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-3 rounded-xl shadow-sm transition-colors"
                                >
                                    Create My 3D
                                </Link>
                            </div>
                        </div>

                        <div className="h-px bg-gray-200" />

                        {/* Calculator Component */}
                        <Calculator product={product} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
