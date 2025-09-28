import React from 'react';
import { motion } from 'framer-motion';
import { Users, Globe, Award, Zap } from 'lucide-react';

const About: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Leading the Future of Data Security
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                DSecure has been at the forefront of data security solutions for over a decade. 
                We specialise in providing comprehensive data erasure and security services that 
                meet the highest industry standards.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Our commitment to innovation and security has made us the trusted choice for 
                enterprises, government agencies, and organisations worldwide who require 
                absolute certainty in data destruction.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">10+</div>
                <div className="text-sm text-gray-600">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
                <div className="text-sm text-gray-600">Countries Served</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">99.9%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
                <div className="text-sm text-gray-600">Support</div>
              </div>
            </div>
          </motion.div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <Users className="w-8 h-8 text-blue-600 mb-4" />
                  <h4 className="font-semibold text-gray-900 mb-2">Expert Team</h4>
                  <p className="text-sm text-gray-600">Certified security professionals</p>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <Globe className="w-8 h-8 text-blue-600 mb-4" />
                  <h4 className="font-semibold text-gray-900 mb-2">Global Reach</h4>
                  <p className="text-sm text-gray-600">Worldwide service coverage</p>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <Award className="w-8 h-8 text-blue-600 mb-4" />
                  <h4 className="font-semibold text-gray-900 mb-2">Certified</h4>
                  <p className="text-sm text-gray-600">Industry-leading certifications</p>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <Zap className="w-8 h-8 text-blue-600 mb-4" />
                  <h4 className="font-semibold text-gray-900 mb-2">Innovation</h4>
                  <p className="text-sm text-gray-600">Cutting-edge technology</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
