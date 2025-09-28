import React from 'react';
import { motion } from 'framer-motion';
import { Users, Shield, Award, Clock } from 'lucide-react';

const Stats: React.FC = () => {
  const stats = [
    {
      icon: Users,
      value: '1000+',
      label: 'Enterprise Clients',
      description: 'Trusted worldwide'
    },
    {
      icon: Shield,
      value: '50M+',
      label: 'Devices Secured',
      description: 'Data wiped safely'
    },
    {
      icon: Award,
      value: '15+',
      label: 'Certifications',
      description: 'Industry standards'
    },
    {
      icon: Clock,
      value: '24/7',
      label: 'Support',
      description: 'Always available'
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center group"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4 group-hover:bg-blue-700 transition-colors">
                <stat.icon className="w-8 h-8 text-white" />
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-lg font-semibold text-gray-700">{stat.label}</div>
                <div className="text-sm text-gray-500">{stat.description}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
