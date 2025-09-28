import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HardDrive, Smartphone, Server, Monitor, Play, Pause, CheckCircle, AlertCircle, Download, Shield } from 'lucide-react';
import { deviceService, Device } from '../services/supabaseService';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import AuthModal from '../components/Auth/AuthModal';

const ErasureTools: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('dod-5220');
  const [erasingDevices, setErasingDevices] = useState<Set<string>>(new Set());
  const [showAuthModal, setShowAuthModal] = useState(false);

  const algorithms = [
    { id: 'dod-5220', name: 'DoD 5220.22-M', passes: 3, description: 'US Department of Defence standard' },
    { id: 'nist-800', name: 'NIST 800-88', passes: 1, description: 'NIST Clear/Purge guidelines' },
    { id: 'gutmann', name: 'Gutmann Method', passes: 35, description: 'Most secure overwriting method' },
    { id: 'random', name: 'Random Overwrite', passes: 1, description: 'Single pass random data' }
  ];

  useEffect(() => {
    if (isAuthenticated && user) {
      loadDevices();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  const loadDevices = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const userDevices = await deviceService.getDevices(user.id);
      setDevices(userDevices);
    } catch (error: any) {
      toast.error('Failed to load devices: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'hdd':
      case 'ssd':
        return HardDrive;
      case 'mobile':
        return Smartphone;
      case 'server':
        return Server;
      default:
        return Monitor;
    }
  };

  const startErasure = async () => {
    if (!isAuthenticated || !user) {
      setShowAuthModal(true);
      return;
    }

    if (!selectedDevice) {
      toast.error('Please select a device first');
      return;
    }

    setErasingDevices(prev => new Set(prev).add(selectedDevice));
    
    try {
      await deviceService.startErasure(user.id, selectedDevice, selectedAlgorithm);
      setDevices(prev => prev.map(d => d.id === selectedDevice ? { ...d, status: 'erasing' } : d));
      toast.success('Data erasure started successfully');
      
      // Simulate completion
      setTimeout(async () => {
        await deviceService.updateDeviceStatus(selectedDevice, 'completed');
        setDevices(prev => prev.map(d => d.id === selectedDevice ? { ...d, status: 'completed' } : d));
        setErasingDevices(prev => {
          const newSet = new Set(prev);
          newSet.delete(selectedDevice);
          return newSet;
        });
        toast.success('Data erasure completed');
      }, 5000);
      
    } catch (error: any) {
      toast.error('Erasure failed: ' + error.message);
      setDevices(prev => prev.map(d => d.id === selectedDevice ? { ...d, status: 'error' } : d));
      setErasingDevices(prev => {
        const newSet = new Set(prev);
        newSet.delete(selectedDevice);
        return newSet;
      });
    }
  };

  const generateCertificate = async (deviceId: string) => {
    try {
      const certificate = await deviceService.generateCertificate(deviceId);
      if (!certificate) {
        toast.error('No certificate found for this device.');
        return;
      }
      
      const blob = new Blob([JSON.stringify(certificate, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dsecure-certificate-${certificate.id}.json`;
      a.click();
      URL.revokeObjectURL(url);
      
      toast.success('Certificate downloaded successfully');
    } catch (error: any) {
      toast.error('Failed to download certificate: ' + error.message);
    }
  };
  
  const isErasing = erasingDevices.size > 0;

  return (
    <>
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Data Erasure Tools</h1>
            <p className="text-xl text-gray-600">Securely wipe sensitive data from your devices with military-grade algorithms.</p>
            
            {!isAuthenticated && (
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center">
                  <Shield className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="text-blue-800">Sign in to access advanced erasure tools and save your certificates.</span>
                  <button onClick={() => setShowAuthModal(true)} className="ml-2 text-blue-600 hover:text-blue-700 font-semibold">Sign In</button>
                </div>
              </div>
            )}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Connected Devices</h2>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {loading ? (
                    <div className="p-6 text-center text-gray-500">Loading devices...</div>
                  ) : devices.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">No devices found. Add a device to get started.</div>
                  ) : (
                    devices.map((device) => {
                      const IconComponent = getDeviceIcon(device.type);
                      return (
                        <motion.div
                          key={device.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className={`p-6 cursor-pointer transition-colors ${selectedDevice === device.id ? 'bg-blue-50 border-l-4 border-blue-600' : 'hover:bg-gray-50'}`}
                          onClick={() => setSelectedDevice(device.id)}
                        >
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center space-x-4">
                              <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                device.status === 'completed' ? 'bg-green-100' :
                                device.status === 'erasing' ? 'bg-blue-100' :
                                device.status === 'error' ? 'bg-red-100' : 'bg-gray-100'
                              }`}>
                                <IconComponent className={`w-6 h-6 ${
                                  device.status === 'completed' ? 'text-green-600' :
                                  device.status === 'erasing' ? 'text-blue-600' :
                                  device.status === 'error' ? 'text-red-600' : 'text-gray-600'
                                }`} />
                              </div>
                              
                              <div>
                                <h3 className="font-semibold text-gray-900">{device.name}</h3>
                                <p className="text-sm text-gray-500">{device.size} • {device.type.toUpperCase()}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2 self-start sm:self-center">
                              {device.status === 'completed' && (
                                <>
                                  <CheckCircle className="w-5 h-5 text-green-600" />
                                  <button onClick={(e) => { e.stopPropagation(); generateCertificate(device.id); }} className="text-blue-600 hover:text-blue-700 transition-colors">
                                    <Download className="w-5 h-5" />
                                  </button>
                                </>
                              )}
                              {device.status === 'error' && <AlertCircle className="w-5 h-5 text-red-600" />}
                              {device.status === 'erasing' && <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Erasure Algorithm</h3>
                <div className="space-y-3">
                  {algorithms.map((algorithm) => (
                    <label key={algorithm.id} className="flex items-start space-x-3 cursor-pointer">
                      <input type="radio" name="algorithm" value={algorithm.id} checked={selectedAlgorithm === algorithm.id} onChange={(e) => setSelectedAlgorithm(e.target.value)} className="mt-1 text-blue-600 focus:ring-blue-500"/>
                      <div>
                        <div className="font-medium text-gray-900">{algorithm.name}</div>
                        <div className="text-sm text-gray-500">{algorithm.description}</div>
                        <div className="text-xs text-gray-400">{algorithm.passes} pass(es)</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Start Erasure</h3>
                {selectedDevice ? (
                  <div className="space-y-4">
                    <div className="text-sm text-gray-600">Selected: {devices.find(d => d.id === selectedDevice)?.name}</div>
                    <button onClick={startErasure} disabled={isErasing} className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-semibold transition-colors ${isErasing ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-red-600 text-white hover:bg-red-700'}`}>
                      {erasingDevices.has(selectedDevice) ? <><Pause className="w-5 h-5" /><span>Erasing...</span></> : <><Play className="w-5 h-5" /><span>Start Secure Erasure</span></>}
                    </button>
                    <p className="text-xs text-gray-500 text-center">This action cannot be undone. All data will be permanently destroyed.</p>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">Select a device to begin erasure</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} initialMode="login" />
    </>
  );
};

export default ErasureTools;
