import React from 'react';
import { FiFilter, FiRefreshCw } from 'react-icons/fi';

const FilterSidebar = ({
  search,
  setSearch,
  category,
  setCategory,
  maxPrice,
  setMaxPrice,
  duration,
  setDuration,
  destination,
  setDestination,
  destinations = [],
  onReset
}) => {
  const categories = [
    'Honeymoon',
    'Spiritual',
    'Beaches',
    'Mountains',
    'Adventure',
    'Luxury',
    'Wildlife',
    'International',
    'Family Trips',
    'Group Tours',
    'Custom Tours'
  ];

  return (
    <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-premium space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div className="flex items-center space-x-2 text-primary font-bold">
          <FiFilter className="text-gold h-5 w-5" />
          <span className="font-serif">Filter Journeys</span>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-gold hover:text-gold-dark flex items-center space-x-1 font-semibold focus:outline-none"
        >
          <FiRefreshCw className="h-3 w-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* 1. Keyword search */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block text-left">Search Tour</label>
        <input
          type="text"
          placeholder="e.g. Kerala, Varanasi..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-pearl border border-gray-200 focus:border-gold px-4 py-2.5 rounded-xl text-sm text-primary focus:outline-none transition-colors"
        />
      </div>

      {/* 2. Destination select */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block text-left">Destination Location</label>
        <select
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="w-full bg-pearl border border-gray-200 focus:border-gold px-4 py-2.5 rounded-xl text-sm text-primary focus:outline-none transition-colors cursor-pointer"
        >
          <option value="">Any Destination</option>
          {destinations.map((d) => (
            <option key={d._id} value={d.name}>{d.name}</option>
          ))}
        </select>
      </div>

      {/* 3. Category selector */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block text-left">Travel Style</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full bg-pearl border border-gray-200 focus:border-gold px-4 py-2.5 rounded-xl text-sm text-primary focus:outline-none transition-colors cursor-pointer"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* 4. Budget maximum price slider */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block text-left">Max Budget</label>
          <span className="text-xs font-bold text-gold">₹{maxPrice?.toLocaleString('en-IN')}</span>
        </div>
        <input
          type="range"
          min="4000"
          max="50000"
          step="1000"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-gold h-1.5 bg-gray-200 rounded-lg cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-gray-400 font-bold">
          <span>₹4,000</span>
          <span>₹50,000</span>
        </div>
      </div>

      {/* 5. Duration filter */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block text-left">Tour Duration</label>
        <select
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="w-full bg-pearl border border-gray-200 focus:border-gold px-4 py-2.5 rounded-xl text-sm text-primary focus:outline-none transition-colors cursor-pointer"
        >
          <option value="">Any Duration</option>
          <option value="3 D">Short Getaway (3 Days)</option>
          <option value="4 D">Short Break (4 Days)</option>
          <option value="6 D">Standard Tour (6 Days)</option>
          <option value="8 D">In-Depth Tour (8 Days)</option>
          <option value="16 D">Grand Odyssey (16 Days)</option>
        </select>
      </div>

    </div>
  );
};

export default FilterSidebar;
