import React, { useState, useEffect } from 'react';
import { HardDrive, FileText, Users, Activity } from 'lucide-react';
import StatCard from './StatCard';
import Card from '../ui/Card';
import ErasureChart from './ErasureChart';
import { dashboardService, Command, Log } from '../../services/supabaseService';
import Badge from '../ui/Badge';

const DashboardOverview: React.FC = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalDevices: 0, reportsGenerated: 0, activeSessions: 0 });
  const [recentCommands, setRecentCommands] = useState<Command[]>([]);
  const [recentLogs, setRecentLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsData, commandsData, logsData] = await Promise.all([
          dashboardService.getStats(),
          dashboardService.getRecentCommands(),
          dashboardService.getRecentLogs(),
        ]);
        setStats(statsData);
        setRecentCommands(commandsData as Command[]);
        setRecentLogs(logsData as Log[]);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Users" value={stats.totalUsers.toLocaleString()} icon={Users} />
        <StatCard title="Total Devices" value={stats.totalDevices.toLocaleString()} icon={HardDrive} />
        <StatCard title="Total Reports" value={stats.reportsGenerated.toLocaleString()} icon={FileText} />
        <StatCard title="Active Sessions" value={stats.activeSessions.toLocaleString()} icon={Activity} />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Erasure Activity Chart */}
        <div className="lg:col-span-2">
          <Card title="Erasure Activity (Last 7 Days)">
            <ErasureChart />
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="space-y-8">
          <Card title="Recent Commands">
            <div className="space-y-3">
              {recentCommands.map(cmd => (
                <div key={cmd.id} className="text-sm">
                  <p className="font-medium text-gray-800 truncate">{cmd.command}</p>
                  <p className="text-gray-500">{new Date(cmd.created_at).toLocaleString('en-GB')}</p>
                </div>
              ))}
            </div>
          </Card>
          <Card title="Recent System Logs">
            <div className="space-y-3">
              {recentLogs.map(log => (
                <div key={log.id} className="flex items-start space-x-2 text-sm">
                   <Badge color={log.level === 'ERROR' ? 'red' : log.level === 'WARN' ? 'yellow' : 'gray'} size="sm">{log.level}</Badge>
                   <p className="text-gray-600 truncate">{log.message}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
