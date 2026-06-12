import React, { useEffect, useState } from 'react';
import { HiChevronDown } from 'react-icons/hi';
import apiService from '../../services/api';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white p-5 rounded-2xl border border-black/5 shadow-premium text-left space-y-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left focus:outline-none group"
      >
        <span className="text-md sm:text-lg font-serif font-bold text-primary group-hover:text-gold transition-colors">
          {question}
        </span>
        <HiChevronDown
          className={`h-5 w-5 text-gold transform transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      
      <div
        className={`transition-all duration-300 overflow-hidden ${
          isOpen ? 'max-h-96 mt-2 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <p className="text-sm text-gray-500 leading-relaxed pr-4 pt-2 border-t border-gray-100">
          {answer}
        </p>
      </div>
    </div>
  );
};

const FAQsPage = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const response = await apiService.faqs.getAll();
        if (response.data?.success) {
          setFaqs(response.data.data);
        }
      } catch (err) {
        console.error('Failed to load FAQs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFAQs();
  }, []);

  return (
    <div className="bg-pearl pb-20">
      
      {/* Hero Banner */}
      <div className="relative h-[45vh] w-full overflow-hidden bg-primary-dark">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1920&q=80')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-dark via-primary-dark/30 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-white text-4xl sm:text-6xl font-serif font-bold tracking-wide">
            FAQ Help Desk
          </h1>
          <p className="text-gold uppercase tracking-[0.25em] text-xs sm:text-sm font-semibold mt-4">
            Answers to your booking and planning policies
          </p>
        </div>
      </div>

      {/* Accordions */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 space-y-6">
        {loading ? (
          <div className="text-center py-10 font-bold text-gray-400">Loading answers...</div>
        ) : faqs.length === 0 ? (
          <div className="text-center py-10 text-gray-400">No FAQs currently posted.</div>
        ) : (
          faqs.map((faq) => (
            <FAQItem key={faq._id} question={faq.question} answer={faq.answer} />
          ))
        )}
      </div>

    </div>
  );
};

export default FAQsPage;
