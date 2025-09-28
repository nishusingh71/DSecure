import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import Table from '../ui/Table';
import Badge from '../ui/Badge';
import { tableService } from '../../services/supabaseService';
import { Search, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

interface Machine {
  id: string;
  name: string;
  type: 'SSD' | 'HDD' | 'Mobile' | 'Server';
  status: 'Online' | 'Offline' | 'Wiping';
  last_seen: string;
  ip_address: string;
}

const MachinesList: React.FC = () => {
  const [data, setData] = useState<Machine[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const machines = await tableService.getData('devices');
        setData(machines as Machine[]);
      } catch (error: any) {
        toast.error("Failed to fetch machines: " + error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  
  const filteredData = data.filter(m =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.ip_address.includes(searchTerm)
  );

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Type', accessor: 'type' },
    {
      header: 'Status',
      accessor: 'status',
      cell: (row: Machine) => {
        const color = row.status === 'Online' ? 'green' : row.status === 'Wiping' ? 'blue' : 'gray';
        return <Badge color={color}>{row.status}</Badge>;
      },
    },
    { header: 'IP Address', accessor: 'ip_address' },
    {
      header: 'Last Seen',
      accessor: 'last_seen',
      cell: (row: Machine) => new Date(row.last_seen).toLocaleString('en-GB'),
    },
  ];

  return (
    <Card
      title="Managed Machines"
      actions={
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search machines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 w-full"
            />
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 flex-shrink-0">
            <Plus className="w-5 h-5" />
            <span>Add Machine</span>
          </button>
        </div>
      }
    >
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <Table columns={columns} data={filteredData} />
      )}
    </Card>
  );
};

export default MachinesList;
