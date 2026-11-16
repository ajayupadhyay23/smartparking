import React, { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Zap,
  SlidersHorizontal,
  Star,
  CheckCircle2,
  Navigation,
  Sparkles,
  ArrowRight,
  Filter,
  Car
} from "lucide-react";
import { useParkVoltStore } from "../store/useParkVoltStore";
import { api, MOCK_PARKING_LOCATIONS } from "../services/api";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Card, CardContent } from "../components/ui/Card";

export const ExploreSearch = ({ onSelectLocation }) => {
  const {
    searchQuery,
    setSearchQuery,
    selectedCity,
    setSelectedCity,
    filterEVOnly,
    setFilterEVOnly,
    filterFastChargeOnly,
    setFilterFastChargeOnly,
    maxPricePerHour,
    setMaxPricePerHour
  } = useParkVoltStore();

  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch locations whenever filters change
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    api
      .getParkingLocations({
        search: searchQuery,
        city: selectedCity,
        evOnly: filterEVOnly,
        fastChargeOnly: filterFastChargeOnly,
        maxPrice: maxPricePerHour
      })
      .then((data) => {
        if (isMounted) {
          setLocations(data);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [
    searchQuery,
    selectedCity,
    filterEVOnly,
    filterFastChargeOnly,
    maxPricePerHour
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Header & Filter Controls Bar */}
      <div className="space-y-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>STEP 3: GEOSPATIAL SEARCH & EV FILTERS</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Explore Smart Parking & EV Superchargers
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Browse live verified parking hubs with real-time bay availability and high-power DC fast chargers.
          </p>
        </div>

        {/* Search & Filter Strip */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/[0.08] backdrop-blur-xl shadow-xl space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="md:col-span-6 relative flex items-center">
              <Search className="absolute left-3.5 w-4 h-4 text-emerald-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by area, landmark or hub name..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30"
              />
            </div>

            {/* City Selector */}
            <div className="md:col-span-3">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-emerald-500"
              >
                <option value="All Cities">All Cities (NCR, BLR, BOM)</option>
                <option value="Gurugram">Gurugram</option>
                <option value="New Delhi">New Delhi</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Bengaluru">Bengaluru</option>
              </select>
            </div>

            {/* Price Filter Summary */}
            <div className="md:col-span-3 flex items-center justify-between px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-700/80 text-xs">
              <span className="text-slate-400">Max Tariff:</span>
              <span className="font-mono font-bold text-white">₹{maxPricePerHour}/hr</span>
              <input
                type="range"
                min="40"
                max="250"
                step="10"
                value={maxPricePerHour}
                onChange={(e) => setMaxPricePerHour(Number(e.target.value))}
                className="w-20 accent-emerald-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Quick Filter Pill Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5 text-xs">
            <span className="text-slate-400 flex items-center gap-1 font-mono">
              <Filter className="w-3.5 h-3.5" /> Filters:
            </span>

            <button
              type="button"
              onClick={() => setFilterEVOnly(!filterEVOnly)}
              className={`px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 ${
                filterEVOnly
                  ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400 font-semibold"
                  : "bg-slate-800/60 border-slate-700 text-slate-300 hover:text-white"
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              EV Chargers Available
            </button>

            <button
              type="button"
              onClick={() => setFilterFastChargeOnly(!filterFastChargeOnly)}
              className={`px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 ${
                filterFastChargeOnly
                  ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-400 font-semibold"
                  : "bg-slate-800/60 border-slate-700 text-slate-300 hover:text-white"
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              100+ kW Ultra-Fast DC
            </button>

            {(searchQuery || selectedCity !== "All Cities" || filterEVOnly || filterFastChargeOnly) && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCity("All Cities");
                  setFilterEVOnly(false);
                  setFilterFastChargeOnly(false);
                  setMaxPricePerHour(200);
                }}
                className="text-xs text-rose-400 hover:text-rose-300 underline underline-offset-2 ml-auto"
              >
                Reset All Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Locations Results Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>
            SHOWING <strong className="text-white">{locations.length}</strong> VERIFIED HUBS
          </span>
          <span className="flex items-center gap-1 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" /> Live Availability Synced
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {locations.map((loc) => (
            <Card
              key={loc.id}
              hoverEffect
              className="flex flex-col justify-between overflow-hidden group cursor-pointer"
              onClick={() => onSelectLocation(loc)}
            >
              <div>
                {/* Location Image with Overlays */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-800">
                  <img
                    src={loc.image}
                    alt={loc.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <Badge variant="glass" size="sm">
                      {loc.city}
                    </Badge>
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-amber-400 text-xs font-bold border border-white/10">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{loc.rating}</span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        ({loc.reviewsCount})
                      </span>
                    </div>
                  </div>

                  {/* Bottom Stats on Image */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="emerald" size="sm" dot>
                        {loc.availableSlots} Bays Open
                      </Badge>
                      {loc.evSlotsAvailable > 0 && (
                        <Badge variant="cyan" size="sm">
                          ⚡ {loc.evSlotsAvailable} EV Free
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="font-bold text-white text-base group-hover:text-emerald-400 transition-colors">
                      {loc.name}
                    </h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-1 truncate">
                      <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-500" />
                      <span className="truncate">{loc.address}</span>
                    </p>
                  </div>

                  {/* Amenities Chips */}
                  <div className="flex flex-wrap gap-1.5 text-[11px] text-slate-400">
                    {loc.amenities.slice(0, 3).map((amenity) => (
                      <span
                        key={amenity}
                        className="px-2 py-0.5 rounded bg-slate-800/80 border border-white/5"
                      >
                        {amenity}
                      </span>
                    ))}
                    {loc.amenities.length > 3 && (
                      <span className="px-1.5 py-0.5 text-slate-500">
                        +{loc.amenities.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Footer: Pricing & Action Button */}
              <div className="px-5 py-3.5 bg-slate-950/60 border-t border-white/[0.06] flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-mono">Rate from</div>
                  <div className="text-base font-bold text-white font-mono">
                    ₹{loc.hourlyRate}
                    <span className="text-xs text-slate-400 font-normal">/hr</span>
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  iconRight={<ArrowRight className="w-3.5 h-3.5" />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectLocation(loc);
                  }}
                >
                  Inspect Bays
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
