import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Crown, Zap } from 'lucide-react';
import PaymentModal from './PaymentModal';

const Pricing: React.FC = () => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      price: '£49',
      period: '/month',
      description: 'Perfect for small businesses',
      icon: Zap,
      popular: false,
      features: [
        '10 device erasures per month',
        'Basic erasure algorithms',
        'Email support',
        'Compliance certificates',
        'Progress tracking',
        '30-day data retention'
      ]
    },
    {
      id: 'professional',
      name: 'Professional',
      price: '£149',
      period: '/month',
      description: 'Most popular for growing companies',
      icon: Star,
      popular: true,
      features: [
        '100 device erasures per month',
        'All erasure algorithms',
        'Priority support',
        'Advanced certificates',
        'Real-time monitoring',
        '90-day data retention',
        'API access',
        'Bulk operations'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '£499',
      period: '/month',
      description: 'For large-scale operations',
      icon: Crown,
      popular: false,
      features: [
        'Unlimited device erasures',
        'Custom algorithms',
        '24/7 phone support',
        'White-label certificates',
        'Advanced analytics',
        'Unlimited data retention',
        'Full API access',
        'Dedicated account manager',
        'Custom integrations',
        'On-premise deployment'
      ]
    }
  ];

  const handleSelectPlan = (plan: any) => {
    setSelectedPlan(plan);
    setIsPaymentModalOpen(true);
  };

  return (
    <>
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your Security Plan
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Flexible pricing options to meet your data security needs. All plans include 
              our core security features with varying levels of support and capacity.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 items-start">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative bg-white rounded-2xl border-2 p-8 transition-all duration-300 hover:shadow-xl ${
                  plan.popular 
                    ? 'border-blue-500 shadow-lg md:scale-105' 
                    : 'border-gray-200 hover:border-blue-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                    plan.popular ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    <plan.icon className={`w-8 h-8 ${
                      plan.popular ? 'text-blue-600' : 'text-gray-600'
                    }`} />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-500 ml-1">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5 mr-3" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSelectPlan(plan)}
                  className={`w-full py-4 px-6 rounded-lg font-semibold transition-all duration-300 ${
                    plan.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  Get Started
                </button>
              </motion.div>
            ))}
          </div>

          {/* Enterprise Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-8 text-center"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Need a Custom Solution?
            </h3>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              For organisations with specific requirements, we offer tailored solutions 
              including on-premise deployments, custom integrations, and dedicated support.
            </p>
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Contact Sales Team
            </button>
          </motion.div>
        </div>
      </section>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        plan={selectedPlan}
      />
    </>
  );
};

export default Pricing;
