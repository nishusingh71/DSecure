import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Shield, Check } from 'lucide-react';
import { paymentService } from '../services/supabaseService';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: any;
}

const useScript = (src: string) => {
  const [status, setStatus] = useState(src ? 'loading' : 'idle');

  useEffect(() => {
    if (!src) {
      setStatus('idle');
      return;
    }

    let script = document.querySelector(`script[src="${src}"]`) as HTMLScriptElement;

    if (!script) {
      script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.setAttribute('data-status', 'loading');
      document.body.appendChild(script);

      const setAttributeFromEvent = (event: Event) => {
        script.setAttribute('data-status', event.type === 'load' ? 'ready' : 'error');
      };

      script.addEventListener('load', setAttributeFromEvent);
      script.addEventListener('error', setAttributeFromEvent);
    }

    const setStateFromEvent = (event: Event) => {
      setStatus(event.type === 'load' ? 'ready' : 'error');
    };

    script.addEventListener('load', setStateFromEvent);
    script.addEventListener('error', setStateFromEvent);

    return () => {
      if (script) {
        script.removeEventListener('load', setStateFromEvent);
        script.removeEventListener('error', setStateFromEvent);
      }
    };
  }, [src]);

  return status;
};

const RazorpayPaymentButton: React.FC<{ plan: any; onSuccess: () => void; }> = ({ plan, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const { user, profile } = useAuth();

  const handlePayment = async () => {
    if (!user || !profile) {
      toast.error('You must be logged in to make a purchase.');
      return;
    }

    setLoading(true);

    try {
      const order = await paymentService.createRazorpayOrder(
        parseInt(plan.price.replace('£', '')),
        plan.id
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'DSecure',
        description: `Payment for ${plan.name} Plan`,
        order_id: order.id,
        handler: async (response: any) => {
          try {
            await paymentService.verifyRazorpayPayment(user.id, plan.id, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            toast.success('Payment successful! Welcome to DSecure.');
            onSuccess();
          } catch (verifyError) {
            toast.error('Payment verification failed.');
          }
        },
        prefill: {
          name: profile.full_name,
          email: user.email,
        },
        theme: {
          color: '#2563EB',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response: any){
        toast.error(`Payment failed: ${response.error.description}`);
      });
      rzp.open();

    } catch (error: any) {
      toast.error(error.message || 'Payment processing failed');
    }

    setLoading(false);
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center"
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      ) : (
        <>
          <CreditCard className="w-5 h-5 mr-2" />
          Pay {plan?.price}/month with Razorpay
        </>
      )}
    </button>
  );
};


const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, plan }) => {
  const scriptStatus = useScript('https://checkout.razorpay.com/v1/checkout.js');
  const { isAuthenticated } = useAuth();

  if (!isOpen || !plan) return null;

  const handleSuccess = () => {
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Complete Your Purchase</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <plan.icon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{plan.name} Plan</h3>
                  <p className="text-gray-600">{plan.description}</p>
                </div>
              </div>

              <div className="space-y-2">
                {plan.features.slice(0, 4).map((feature: string, index: number) => (
                  <div key={index} className="flex items-center text-sm text-gray-600">
                    <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    {feature}
                  </div>
                ))}
                {plan.features.length > 4 && (
                  <div className="text-sm text-gray-500">
                    +{plan.features.length - 4} more features
                  </div>
                )}
              </div>
            </div>

            {!isAuthenticated && (
                <div className="text-center text-red-600 bg-red-50 p-3 rounded-lg mb-4">
                    Please sign in to complete your purchase.
                </div>
            )}

            {scriptStatus === 'ready' && isAuthenticated ? (
              <RazorpayPaymentButton plan={plan} onSuccess={handleSuccess} />
            ) : (
              <div className="text-center text-gray-500 py-4">
                {isAuthenticated ? 'Loading payment options...' : 'Please sign in to proceed.'}
              </div>
            )}
            
            <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-gray-600">
              <Shield className="w-4 h-4 text-green-500" />
              <span>Secure payments by Razorpay</span>
            </div>

            <div className="mt-6 text-xs text-gray-500 text-center">
              By completing this purchase, you agree to our Terms of Service and Privacy Policy.
              You can cancel your subscription at any time.
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PaymentModal;
