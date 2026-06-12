import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiService from '../../services/api';
import PackageCard from '../../components/packages/PackageCard';
import SkeletonLoader from '../../components/common/SkeletonLoader';

const CategoryPage = () => {
  const { catName } = useParams();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryPackages = async () => {
      setLoading(true);
      try {
        const response = await apiService.packages.getAll({
          category: catName,
          isPublished: true
        });
        if (response.data?.success) {
          setPackages(response.data.data);
        }
      } catch (err) {
        console.error('Failed to load category packages:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryPackages();
    window.scrollTo(0, 0);
  }, [catName]);

  return (
    <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* 1. Header */}
      <div className="text-left mb-10 space-y-2">
        <span className="text-xs font-bold text-gold uppercase tracking-widest">
          Curated Experiences
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif text-primary font-bold">
          {catName} Tours
        </h1>
        <div className="h-1 w-20 bg-gold mt-2 rounded-full" />
      </div>

      {/* 2. Grid */}
      {loading ? (
        <SkeletonLoader count={3} />
      ) : packages.length === 0 ? (
        <div className="bg-white border border-black/5 p-16 rounded-3xl text-center space-y-4">
          <span className="text-4xl">🧘‍♂️</span>
          <h3 className="text-xl font-bold font-serif text-primary">No Packages Found</h3>
          <p className="text-sm text-gray-400 max-w-md mx-auto">
            We currently don't have any tour packages active in the "{catName}" category. Please contact us to create a customized package!
          </p>
          <Link
            to="/inquiry"
            className="inline-block bg-gold text-primary font-bold text-xs px-6 py-3 rounded-full hover:bg-gold-light transition-colors"
          >
            Create Custom Tour
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pack) => (
            <PackageCard key={pack._id} pack={pack} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
