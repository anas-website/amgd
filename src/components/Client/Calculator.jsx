import React, { useState, useEffect } from 'react';
import {
    tables,
    DATABASE_ID,
    TABLE_PRICING_LOCATIONS,
    TABLE_PRICING_FLOORS
} from '../../appwrite/config';
import {
    Calculator as CalcIcon,
    Maximize2,
    Ruler,
    MapPin,
    Layers,
    ChevronDown,
    Loader2
} from 'lucide-react';

const Calculator = ({ product }) => {
    const [width, setWidth] = useState(100);
    const [height, setHeight] = useState(200);
    const [location, setLocation] = useState(null);
    const [selectedLocationId, setSelectedLocationId] = useState('');
    const [floor, setFloor] = useState(0);

    const [locations, setLocations] = useState([]);
    const [floors, setFloors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPricingData = async () => {
            try {
                const locRes = await tables.listDocuments(DATABASE_ID, TABLE_PRICING_LOCATIONS);
                const floorRes = await tables.listDocuments(DATABASE_ID, TABLE_PRICING_FLOORS);
                setLocations(locRes.documents);
                setFloors(floorRes.documents);
            } catch (error) {
                console.error("Error fetching pricing dependencies from tables:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPricingData();
    }, []);

    const calculatePrice = () => {
        if (!product) return 0;

        const area = (width / 100) * (height / 100);
        let basePrice = area * product.pricePerM2;

        // Location adjustment
        if (location) {
            if (location.pricingMode === 'fixed') {
                basePrice += location.value;
            } else {
                basePrice *= location.value;
            }
        }

        // Floor adjustment
        const floorRule = floors.find(f =>
            floor >= f.minFloor && (!f.maxFloor || floor <= f.maxFloor)
        );
        if (floorRule) {
            basePrice += floorRule.value;
        }

        return Math.round(basePrice);
    };

    const handleLocationChange = (e) => {
        const id = e.target.value;
        setSelectedLocationId(id);
        const loc = locations.find(l => l.$id === id);
        setLocation(loc);
    };

    if (loading) return <div className="p-8 bg-gray-100 rounded-2xl animate-pulse flex items-center justify-center"><Loader2 className="animate-spin text-blue-500" /></div>;

    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-8">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <CalcIcon size={24} className="text-white" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-gray-900">Instant Quote</h3>
                    <p className="text-gray-500 text-sm">Professional calculation based on real-time data</p>
                </div>
            </div>

            <div className="space-y-8">
                {/* Dimensions */}
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                            <Maximize2 size={16} /> Width (cm)
                        </label>
                        <input
                            type="number"
                            value={width}
                            onChange={(e) => setWidth(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all font-mono text-gray-900"
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                            <Ruler size={16} /> Height (cm)
                        </label>
                        <input
                            type="number"
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all font-mono text-gray-900"
                        />
                    </div>
                </div>

                {/* Location */}
                <div className="space-y-3">
                    <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                        <MapPin size={16} /> Installation Location
                    </label>
                    <div className="relative">
                        <select
                            value={selectedLocationId}
                            onChange={handleLocationChange}
                            className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all pr-12 text-gray-900"
                        >
                            <option value="">Select your area...</option>
                            {locations.map(loc => (
                                <option key={loc.$id} value={loc.$id}>{loc.name}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={20} />
                    </div>
                </div>

                {/* Floor */}
                <div className="space-y-3">
                    <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                        <Layers size={16} /> Floor Level
                    </label>
                    <div className="grid grid-cols-5 gap-2 sm:gap-3">
                        {[0, 1, 2, 3, 4].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFloor(f)}
                                className={`py-2.5 sm:py-3 rounded-xl border transition-all font-bold touch-target ${floor === f
                                        ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20'
                                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                {f === 0 ? 'G' : f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Result */}
                <div className="pt-6 sm:pt-8 border-t border-gray-200">
                    <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-0 sm:items-end">
                        <div>
                            <p className="text-gray-500 font-medium mb-1 uppercase tracking-tighter text-xs">Estimated Total</p>
                            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 flex items-baseline">
                                {calculatePrice()}
                                <span className="text-xl font-bold text-blue-500 ml-2 not-italic">ILS</span>
                            </h2>
                        </div>
                        <button className="bg-blue-600 text-white font-bold uppercase tracking-wider px-6 sm:px-8 py-3 sm:py-4 rounded-xl hover:bg-blue-700 transition-all duration-200 text-sm shadow-lg shadow-blue-500/20 touch-target w-full sm:w-auto">
                            Book Now
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-4 leading-relaxed">
                        * Prices include installation and premium hardware. Final quote subject to site survey.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Calculator;
