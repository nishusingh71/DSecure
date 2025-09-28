import React from 'react';
import { motion } from 'framer-motion';
import { HardDrive, Smartphone, Server, Monitor, Shield, FileCheck } from 'lucide-react';

const Services: React.FC = () => {
  const services = [
    {
      icon: HardDrive,
      title: 'Hard Drive Erasure',
      description: 'Complete data destruction for HDDs and SSDs with multiple overwriting algorithms.',
      features: ['DOD 5220.22-M', 'Gutmann Method', 'Random Overwrite', 'Certificate Generation']
    },
    {
      icon: Smartphone,
      title: 'Mobile Device Wiping',
      description: 'Secure erasure for smartphones, tablets, and other mobile devices.',
      features: ['iOS & Android', 'Factory Reset+', 'MDM Integration', 'Compliance Reports']
    },
    {
      icon: Server,
      title: 'Server & Enterprise',
      description: 'Large-scale data destruction for servers and enterprise storage systems.',
      features: ['RAID Arrays', 'Network Storage', 'Virtual Machines', 'Batch Processing']
    },
    {
      icon: Monitor,
      title: 'Workstation Cleaning',
      description: 'Complete PC and workstation data sanitisation for office environments.',
      features: ['Windows & Mac', 'Linux Support', 'Registry Cleaning', 'File Shredding']
    },
    {
      icon: Shield,
      title: 'Security Auditing',
      description: 'Comprehensive security assessments and vulnerability scanning.',
      features: ['Risk Assessment', 'Compliance Check', 'Security Reports', 'Recommendations']
    },
    {
      icon: FileCheck,
      title: 'Compliance Solutions',
      description: 'Meet regulatory requirements with certified data destruction processes.',
      features: ['GDPR Compliant', 'HIPAA Standards', 'SOX Requirements', 'Custom Policies']
    }
  ];

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Comprehensive Data Security Solutions
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Professional-grade data erasure and security services for businesses of all sizes.
            Ensure complete data destruction with industry-leading standards.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl border border-gray-200 p-8 hover:shadow-xl transition-all duration-300 hover:border-blue-200 group"
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-700 transition-colors">
                  <service.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 ml-4">{service.title}</h3>
              </div>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                {service.description}
              </p>
              
              <ul className="space-y-2">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-sm text-gray-500">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-3"></div>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <button className="mt-6 text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                Learn More →
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
