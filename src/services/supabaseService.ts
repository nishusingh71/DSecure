import { supabase } from '../lib/supabase';
import { PostgrestError } from '@supabase/supabase-js';

// Re-export supabase for direct use if needed
export { supabase };

// Define types based on your database schema
export interface Profile {
  id: string;
  updated_at?: string;
  full_name: string;
  avatar_url?: string;
  plan_id?: string;
  subscription_status?: 'active' | 'inactive' | 'past_due';
}

export interface Device {
  id: string;
  user_id: string;
  name: string;
  type: 'hdd' | 'ssd' | 'mobile' | 'server';
  size: string;
  status: 'idle' | 'erasing' | 'completed' | 'error';
  last_seen: string;
}

export interface Command {
  id: string;
  created_at: string;
  command: string;
  user_id: string;
  device_id: string;
  status: 'Success' | 'Pending' | 'Error';
}

export interface Log {
  id: string;
  created_at: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  service: string;
  message: string;
}

// Generic error handler
const handleSupabaseError = (error: PostgrestError | null, context: string) => {
  if (error) {
    console.error(`Error in ${context}:`, error);
    throw new Error(error.message);
  }
};

// Profile Service
export const profileService = {
  getProfile: async (userId: string): Promise<Profile | null> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    handleSupabaseError(error, 'getProfile');
    return data;
  },

  updateProfile: async (userId: string, updates: Partial<Profile>): Promise<Profile> => {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    handleSupabaseError(error, 'updateProfile');
    return data;
  },
};

// Dashboard Data Service
export const dashboardService = {
  getStats: async () => {
    const [
      { count: totalUsers },
      { count: totalDevices },
      { count: reportsGenerated },
      { count: activeSessions },
    ] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('devices').select('*', { count: 'exact', head: true }),
      supabase.from('audit_reports').select('*', { count: 'exact', head: true }),
      supabase.from('sessions').select('*', { count: 'exact', head: true }).eq('status', 'Active'),
    ]);

    return {
      totalUsers: totalUsers ?? 0,
      totalDevices: totalDevices ?? 0,
      reportsGenerated: reportsGenerated ?? 0,
      activeSessions: activeSessions ?? 0,
    };
  },

  getErasureActivity: async () => {
    const { data, error } = await supabase.rpc('get_daily_erasure_counts', {
      days: 7,
    });
    handleSupabaseError(error as any, 'getErasureActivity');
    return data || [];
  },
  
  getRecentCommands: async (limit = 5) => {
    const { data, error } = await supabase
      .from('commands')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    handleSupabaseError(error, 'getRecentCommands');
    return data || [];
  },

  getRecentLogs: async (limit = 5) => {
    const { data, error } = await supabase
      .from('logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    handleSupabaseError(error, 'getRecentLogs');
    return data || [];
  },
};

// Device/Erasure Service
export const deviceService = {
  getDevices: async (userId: string): Promise<Device[]> => {
    const { data, error } = await supabase
      .from('devices')
      .select('*')
      .eq('user_id', userId);
    handleSupabaseError(error, 'getDevices');
    return data || [];
  },

  startErasure: async (userId: string, deviceId: string, algorithm: string) => {
    const { data: commandData, error: commandError } = await supabase
      .from('commands')
      .insert({
        user_id: userId,
        device_id: deviceId,
        command: `erase --algorithm=${algorithm}`,
        status: 'pending',
      })
      .select()
      .single();
    handleSupabaseError(commandError, 'startErasure:insertCommand');

    const { data: deviceData, error: deviceError } = await supabase
      .from('devices')
      .update({ status: 'erasing' })
      .eq('id', deviceId)
      .select()
      .single();
    handleSupabaseError(deviceError, 'startErasure:updateDevice');

    return { command: commandData, device: deviceData };
  },

  updateDeviceStatus: async (deviceId: string, status: Device['status']) => {
    const { data, error } = await supabase
        .from('devices')
        .update({ status })
        .eq('id', deviceId)
        .select()
        .single();
    handleSupabaseError(error, 'updateDeviceStatus');
    return data;
  },

  generateCertificate: async (deviceId: string) => {
     const { data, error } = await supabase
      .from('audit_reports')
      .select('*')
      .eq('device_id', deviceId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    handleSupabaseError(error, 'generateCertificate');
    return data;
  }
};

// Other Services
export const contactService = {
  createMessage: async (message: { name: string; email: string; company?: string; message: string }) => {
    const { data, error } = await supabase.from('contact_messages').insert(message);
    handleSupabaseError(error, 'createMessage');
    return data;
  },
};

export const paymentService = {
    createRazorpayOrder: async (amount: number, planId: string) => {
        console.log('Simulating Razorpay order creation for:', { amount, planId });
        return Promise.resolve({
            id: `order_${Date.now()}`,
            amount: amount * 100,
            currency: 'GBP',
        });
    },
    verifyRazorpayPayment: async (userId: string, planId: string, paymentDetails: any) => {
        console.log('Simulating Razorpay payment verification for user:', userId, paymentDetails);
        const { data, error } = await supabase
            .from('profiles')
            .update({ plan_id: planId, subscription_status: 'active' })
            .eq('id', userId)
            .select()
            .single();
        handleSupabaseError(error, 'verifyRazorpayPayment:updateProfile');
        return { status: 'success', profile: data };
    },
};

// Generic table fetchers for dashboard lists
export const tableService = {
  getData: async (tableName: string) => {
    const { data, error } = await supabase.from(tableName).select('*');
    handleSupabaseError(error, `getData:${tableName}`);
    return data || [];
  }
}
