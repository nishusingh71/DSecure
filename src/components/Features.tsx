import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Shield, Zap, Award, Lock, FileText } from 'lucide-react';

const Features: React.FC = () => {
  const features = [
    {
      icon: Shield,
      title: 'Military-Grade Security',
      description: 'Advanced encryption and security protocols used by defence organisations worldwide.'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Optimised algorithms ensure quick data destruction without compromising security.'
    },
    {
      icon: Award,
      title: 'Certified Compliance',
      description: 'Meet all major international standards including NIST, DoD, and GDPR requirements.'
    },
    {
      icon: Lock,
      title: 'Secure Process',
      description: 'End-to-end encrypted processes with audit trails and verification at every step.'
    },
    {
      icon: FileText,
      title: 'Detailed Reports',
      description: 'Comprehensive certificates and reports for compliance and audit purposes.'
    },
    {
      icon: CheckCircle,
      title: 'Verification',
      description: 'Multiple verification methods to ensure complete and permanent data destruction.'
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why Choose DSecure?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Industry-leading features that set us apart from the competition.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center group"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-6 group-hover:bg-blue-700 transition-colors">
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
