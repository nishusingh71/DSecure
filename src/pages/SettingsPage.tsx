import React, { useState } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import Card from '../components/ui/Card';
import Chatbot from '../components/Chatbot';
import { User, Lock, Bell, CreditCard } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { profileService } from '../services/supabaseService';
import toast from 'react-hot-toast';

interface ProfileForm {
  full_name: string;
}

const SettingsPage: React.FC = () => {
  const { user, profile } = useAuth();
  const { register, handleSubmit, formState: { isDirty } } = useForm<ProfileForm>({
    defaultValues: {
      full_name: profile?.full_name || '',
    }
  });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: ProfileForm) => {
    if (!user) return;
    setLoading(true);
    try {
      await profileService.updateProfile(user.id, { full_name: data.full_name });
      toast.success('Profile updated successfully!');
      // The auth context will automatically refetch the profile, no need to manually update state here.
    } catch (error: any) {
      toast.error('Failed to update profile: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="mt-1 text-gray-600">Manage your account settings and preferences.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card className="p-0">
              <nav className="p-4 space-y-1">
                <a href="#profile" className="flex items-center px-3 py-2 text-gray-900 bg-gray-100 rounded-md">
                  <User className="w-5 h-5 mr-3" />
                  <span className="font-medium">Profile</span>
                </a>
                <a href="#security" className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md">
                  <Lock className="w-5 h-5 mr-3" />
                  <span className="font-medium">Security</span>
                </a>
                <a href="#notifications" className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md">
                  <Bell className="w-5 h-5 mr-3" />
                  <span className="font-medium">Notifications</span>
                </a>
                <a href="#billing" className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md">
                  <CreditCard className="w-5 h-5 mr-3" />
                  <span className="font-medium">Billing</span>
                </a>
              </nav>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card title="Profile Information">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    {...register('full_name')}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    defaultValue={user?.email}
                    readOnly
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 sm:text-sm cursor-not-allowed"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={!isDirty || loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </div>
      <Chatbot />
    </DashboardLayout>
  );
};

export default SettingsPage;
