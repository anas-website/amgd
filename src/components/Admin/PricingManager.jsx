import React, { useState, useEffect } from 'react';
import { ID, Query } from 'appwrite';
import {
    tables,
    DATABASE_ID,
    TABLE_PRICING_LOCATIONS,
    TABLE_PRICING_FLOORS
} from '../../appwrite/config';
import {
    Plus,
    Trash2,
    MapPin,
    Layers,
    Loader2,
    X
} from 'lucide-react';

const PricingManager = () => {
    const [locations, setLocations] = useState([]);
    const [floors, setFloors] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal states
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
    const [isFloorModalOpen, setIsFloorModalOpen] = useState(false);

    useEffect(() => {
        fetchPricingData();
    }, []);

    const fetchPricingData = async () => {
        try {
            setLoading(true);
            const locRes = await tables.listDocuments(DATABASE_ID, TABLE_PRICING_LOCATIONS);
            const floorRes = await tables.listDocuments(DATABASE_ID, TABLE_PRICING_FLOORS);
            setLocations(locRes.documents.map(doc => ({ id: doc.$id, ...doc })));
            setFloors(floorRes.documents.map(doc => ({ id: doc.$id, ...doc })));
        } catch (error) {
            console.error("Error fetching pricing data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteLocation = async (id) => {
        if (window.confirm("Delete this location?")) {
            await tables.deleteDocument(DATABASE_ID, TABLE_PRICING_LOCATIONS, id);
            fetchPricingData();
        }
    };

    const handleDeleteFloor = async (id) => {
        if (window.confirm("Delete this floor rule?")) {
            await tables.deleteDocument(DATABASE_ID, TABLE_PRICING_FLOORS, id);
            fetchPricingData();
        }
    };

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-blue-500" /></div>;

    return (
        <div className="space-y-8 sm:space-y-12 pb-12 sm:pb-20">
            {/* Locations Section */}
            <section className="space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-display font-semibold text-gray-900 flex items-center gap-2">
                            <MapPin className="text-blue-500 shrink-0" /> Service Locations
                        </h2>
                        <p className="text-gray-500 text-sm hidden sm:block">Manage geography-based pricing</p>
                    </div>
                    <button
                        onClick={() => setIsLocationModalOpen(true)}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-3 rounded-xl flex items-center justify-center gap-2 transition-all touch-target w-full sm:w-auto"
                    >
                        <Plus size={18} /> Add Location
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {locations.map(loc => (
                        <div key={loc.id} className="bg-white border border-gray-200 p-6 rounded-2xl flex justify-between items-center group shadow-sm hover:shadow-md transition-shadow">
                            <div>
                                <h4 className="font-semibold text-lg text-gray-900">{loc.name}</h4>
                                <p className="text-sm text-gray-600">
                                    {loc.pricingMode === 'fixed' ? `+${loc.value} ILS Fixed` : `${((loc.value - 1) * 100).toFixed(0)}% Surcharge`}
                                </p>
                            </div>
                            <button
                                onClick={() => handleDeleteLocation(loc.id)}
                                className="p-3 bg-red-500/10 text-red-400 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/20"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Floors Section */}
            <section className="space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-display font-semibold text-gray-900 flex items-center gap-2">
                            <Layers className="text-blue-500 shrink-0" /> Floor Modifiers
                        </h2>
                        <p className="text-gray-500 text-sm hidden sm:block">Additional fees for higher floors</p>
                    </div>
                    <button
                        onClick={() => setIsFloorModalOpen(true)}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-3 rounded-xl flex items-center justify-center gap-2 transition-all touch-target w-full sm:w-auto"
                    >
                        <Plus size={18} /> Add Floor Rule
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {floors.sort((a, b) => a.minFloor - b.minFloor).map(floor => (
                        <div key={floor.id} className="bg-white border border-gray-200 p-6 rounded-2xl flex justify-between items-center group shadow-sm hover:shadow-md transition-shadow">
                            <div>
                                <h4 className="font-semibold text-lg text-gray-900">
                                    Floor {floor.minFloor}{floor.maxFloor ? ` - ${floor.maxFloor}` : '+'}
                                </h4>
                                <p className="text-sm text-gray-600">+{floor.value} ILS Surcharge</p>
                            </div>
                            <button
                                onClick={() => handleDeleteFloor(floor.id)}
                                className="p-3 bg-red-500/10 text-red-400 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/20"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            <LocationModal
                isOpen={isLocationModalOpen}
                onClose={() => setIsLocationModalOpen(false)}
                onSuccess={fetchPricingData}
            />
            <FloorModal
                isOpen={isFloorModalOpen}
                onClose={() => setIsFloorModalOpen(false)}
                onSuccess={fetchPricingData}
            />
        </div>
    );
};

const LocationModal = ({ isOpen, onClose, onSuccess }) => {
    const [data, setData] = useState({ name: '', pricingMode: 'fixed', value: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const now = new Date().toISOString();
            await tables.createDocument(DATABASE_ID, TABLE_PRICING_LOCATIONS, ID.unique(), {
                name: data.name,
                location: data.name,
                pricingMode: data.pricingMode,
                value: Number(data.value),
                status: 'active',
                effectiveDate: now
            });
            onSuccess();
            onClose();
        } catch (err) {
            console.error('Location error:', err);
            alert(err?.message || 'Error saving location');
        }
    };

    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-white border border-gray-200 p-6 sm:p-8 rounded-t-3xl sm:rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto relative shadow-xl">
                <button onClick={onClose} className="absolute top-6 right-6 text-gray-400"><X /></button>
                <h3 className="text-2xl font-display font-semibold text-gray-900 mb-6">Add New Location</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 outline-none text-gray-900 focus:ring-2 focus:ring-blue-500/50"
                        placeholder="Location Name"
                        required
                        onChange={e => setData({ ...data, name: e.target.value })}
                    />
                    <select
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 outline-none text-gray-900 focus:ring-2 focus:ring-blue-500/50"
                        onChange={e => setData({ ...data, pricingMode: e.target.value })}
                    >
                        <option value="fixed">Fixed Amount (ILS)</option>
                        <option value="multiplier">Percentage Surcharge</option>
                    </select>
                    <input
                        type="number" step="0.01"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 outline-none text-gray-900 focus:ring-2 focus:ring-blue-500/50"
                        placeholder="Value (e.g. 50 or 1.15)"
                        required
                        onChange={e => setData({ ...data, value: e.target.value })}
                    />
                    <button className="w-full bg-blue-600 py-4 rounded-xl font-bold shadow-lg shadow-blue-600/20 text-white">Save Location</button>
                </form>
            </div>
        </div>
    );
};

const FloorModal = ({ isOpen, onClose, onSuccess }) => {
    const [data, setData] = useState({ minFloor: '', maxFloor: '', value: '', currency: 'ILS' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const doc = {
                minFloor: parseInt(data.minFloor, 10),
                value: parseFloat(data.value),
                currency: data.currency || 'ILS',
                active: true,
                updatedAt: new Date().toISOString()
            };
            if (data.maxFloor && data.maxFloor.trim() !== '') {
                doc.maxFloor = parseInt(data.maxFloor, 10);
            }
            await tables.createDocument(DATABASE_ID, TABLE_PRICING_FLOORS, ID.unique(), doc);
            onSuccess();
            onClose();
        } catch (err) {
            console.error('Floor rule error:', err);
            alert(err?.message || 'Error saving floor rule');
        }
    };

    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-white border border-gray-200 p-6 sm:p-8 rounded-t-3xl sm:rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto relative shadow-xl">
                <button onClick={onClose} className="absolute top-6 right-6 text-gray-400"><X /></button>
                <h3 className="text-2xl font-display font-semibold text-gray-900 mb-6">Add Floor Rule</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="number"
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 outline-none text-gray-900 focus:ring-2 focus:ring-blue-500/50"
                            placeholder="Min Floor"
                            required
                            onChange={e => setData({ ...data, minFloor: e.target.value })}
                        />
                        <input
                            type="number"
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 outline-none text-gray-900 focus:ring-2 focus:ring-blue-500/50"
                            placeholder="Max Floor (Optional)"
                            onChange={e => setData({ ...data, maxFloor: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="number"
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 outline-none text-gray-900 focus:ring-2 focus:ring-blue-500/50"
                            placeholder="Fee Amount"
                            required
                            onChange={e => setData({ ...data, value: e.target.value })}
                        />
                        <select
                            value={data.currency}
                            onChange={e => setData({ ...data, currency: e.target.value })}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 outline-none text-gray-900 focus:ring-2 focus:ring-blue-500/50"
                        >
                            <option value="ILS">ILS</option>
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                        </select>
                    </div>
                    <button className="w-full bg-blue-600 py-4 rounded-xl font-bold shadow-lg shadow-blue-600/20 text-white">Save Rule</button>
                </form>
            </div>
        </div>
    );
};

export default PricingManager;
