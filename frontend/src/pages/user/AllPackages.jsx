import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import apiService from '../../services/api';
import PackageCard from '../../components/packages/PackageCard';
import FilterSidebar from '../../components/packages/FilterSidebar';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import { FiGrid } from 'react-icons/fi';

const AllPackages = () => {
  const [packages, setPackages] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Read URL search params for pre-filling search inputs (e.g. from Hero search)
  const loc = useLocation();
  const searchParams = new URLSearchParams(loc.search);
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || '';
  const initialDest = searchParams.get('destination') || '';
  const initialDestType = searchParams.get('destType') || '';

  // Filter States
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [destination, setDestination] = useState(initialDest);
  const [destType, setDestType] = useState(initialDestType);
  const [maxPrice, setMaxPrice] = useState(50000);
  const [duration, setDuration] = useState('');

  // Synchronize initial URL state changes
  useEffect(() => {
    setSearch(searchParams.get('search') || '');
    setCategory(searchParams.get('category') || '');
    setDestination(searchParams.get('destination') || '');
    setDestType(searchParams.get('destType') || '');
  }, [loc.search]);

  // Fetch Destinations for the sidebar dropdown
  useEffect(() => {
    const fetchDests = async () => {
      try {
        const response = await apiService.destinations.getAll();
        if (response.data?.success) {
          setDestinations(response.data.data);
        }
      } catch (err) {
        console.error('Failed to load destinations:', err);
      }
    };
    fetchDests();
  }, []);

  // Fetch packages based on filters
  useEffect(() => {
    const fetchFilteredPackages = async () => {
      setLoading(true);
      try {
        const params = {
          isPublished: true
        };
        if (search) params.search = search;
        if (category) params.category = category;
        if (destination) params.destination = destination;
        if (destType) params.destType = destType;
        if (maxPrice) params.maxPrice = maxPrice;
        if (duration) params.duration = duration;

        const response = await apiService.packages.getAll(params);
        if (response.data?.success) {
          setPackages(response.data.data);
        }
      } catch (err) {
        console.error('Failed to load packages:', err);
      } finally {
        setLoading(false);
      }
    };

    // Debounce package fetching slightly to prevent firing too many queries during slider dragging
    const delayDebounceFn = setTimeout(() => {
      fetchFilteredPackages();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search, category, destination, destType, maxPrice, duration]);

  const handleResetFilters = () => {
    setSearch('');
    setCategory('');
    setDestination('');
    setDestType('');
    setMaxPrice(50000);
    setDuration('');
  };

  return (
    <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* 1. Breadcrumbs & Header */}
      <div className="text-left mb-10 space-y-2">
        <span className="text-xs font-bold text-gold uppercase tracking-widest">
          Explore the World
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif text-primary font-bold">
          Bespoke Tour Packages
        </h1>
        <div className="h-1 w-20 bg-gold mt-2 rounded-full" />
      </div>

      {/* 2. Main Grid Layout: Sidebar Filter & Card Listings */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Filters Column */}
        <div className="lg:col-span-1">
          <FilterSidebar
            search={search}
            setSearch={setSearch}
            category={category}
            setCategory={setCategory}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            duration={duration}
            setDuration={setDuration}
            destination={destination}
            setDestination={setDestination}
            destinations={destinations}
            onReset={handleResetFilters}
          />
        </div>

        {/* Card Listings Column */}
        <div className="lg:col-span-3 space-y-6">
          {/* Header Actions */}
          <div className="bg-white border border-black/5 p-4 rounded-2xl shadow-premium flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-500">
              Showing {packages.length} premium tour packages
            </span>
            <div className="flex items-center space-x-2 text-gold">
              <FiGrid className="h-5 w-5" />
            </div>
          </div>

          {/* Cards Render */}
          {loading ? (
            <SkeletonLoader count={6} />
          ) : packages.length === 0 ? (
            <div className="bg-white border border-black/5 p-16 rounded-3xl text-center space-y-4">
              <span className="text-4xl">🏝️</span>
              <h3 className="text-xl font-bold font-serif text-primary">No Packages Found</h3>
              <p className="text-sm text-gray-400 max-w-md mx-auto">
                We couldn't find any tour packages matching your search filters. Try widening your budget or selecting a different category.
              </p>
              <button
                onClick={handleResetFilters}
                className="bg-gold text-primary font-bold text-xs px-6 py-3 rounded-full hover:bg-gold-light transition-colors cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {packages.map((pack) => (
                <PackageCard key={pack._id} pack={pack} />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AllPackages;
