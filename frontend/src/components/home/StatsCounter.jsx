import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const StatItem = ({ label, target, suffix = '', duration = 2000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(target, 10);
    if (start === end) return;

    const totalMiliseconds = duration;
    const incrementTime = Math.max(Math.floor(totalMiliseconds / end), 20);
    
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) {
        clearInterval(timer);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [target, duration]);

  return (
    <div className="flex flex-col items-center justify-center p-6 text-center">
      <span className="text-4xl sm:text-5xl font-bold text-gold tracking-tight mb-2">
        {count}
        {suffix}
      </span>
      <span className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-gray-400">
        {label}
      </span>
    </div>
  );
};

const StatsCounter = () => {
  const stats = [
    { label: 'Happy Travelers', target: '15', suffix: 'K+', duration: 1500 },
    { label: 'Premium Tours', target: '250', suffix: '+', duration: 1800 },
    { label: 'Customer Satisfaction', target: '99', suffix: '%', duration: 1200 },
    { label: 'Years Experience', target: '12', suffix: '+', duration: 1000 }
  ];

  return (
    <section className="bg-primary py-12 border-y border-gold/15 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-light/30 via-primary to-transparent opacity-60" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/5">
          {stats.map((stat, i) => (
            <StatItem
              key={i}
              label={stat.label}
              target={stat.target}
              suffix={stat.suffix}
              duration={stat.duration}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsCounter;
