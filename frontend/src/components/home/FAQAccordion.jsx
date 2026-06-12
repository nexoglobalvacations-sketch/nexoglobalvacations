import React, { useEffect, useState } from 'react';
import { HiChevronDown } from 'react-icons/hi';
import apiService from '../../services/api';

const FAQItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="border-b border-gray-200 py-5">
      <button
        onClick={onClick}
        className="w-full flex justify-between items-center text-left focus:outline-none group"
      >
        <span className="text-base sm:text-lg font-serif font-semibold text-primary group-hover:text-gold transition-colors">
          {question}
        </span>
        <HiChevronDown
          className={`h-5 w-5 text-gold transform transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      
      {/* Expandable answer panel */}
      <div
        className={`transition-all duration-300 overflow-hidden ${
          isOpen ? 'max-h-96 mt-3 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <p className="text-sm text-gray-500 leading-relaxed pr-6">
          {answer}
        </p>
      </div>
    </div>
  );
};

const FAQAccordion = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState(0); // Open the first item by default

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

  if (loading || faqs.length === 0) return null;

  return (
    <section className="bg-white py-20 border-b border-black/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Title */}
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-serif text-primary">
            Frequently Asked <span className="font-bold">Questions</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 uppercase tracking-widest mt-2">
            Everything You Need to Know Before You Book
          </p>
          <div className="h-1 w-24 bg-gold mx-auto mt-4 rounded-full" />
        </div>

        {/* Accordions */}
        <div className="bg-pearl p-6 sm:p-10 rounded-3xl border border-black/5">
          {faqs.slice(0, 4).map((faq, idx) => (
            <FAQItem
              key={faq._id}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === idx}
              onClick={() => setOpenIndex(openIndex === idx ? -1 : idx)}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default FAQAccordion;
