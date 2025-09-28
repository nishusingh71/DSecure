import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import Table from '../ui/Table';
import Badge from '../ui/Badge';
import { tableService } from '../../services/supabaseService';
import toast from 'react-hot-toast';

interface Command {
  id: string;
  created_at: string;
  command: string;
  user_id: string;
  device_id: string;
  status: 'Success' | 'Pending' | 'Error';
}

const CommandsList: React.FC = () => {
  const [data, setData] = useState<Command[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const commands = await tableService.getData('commands');
        setData(commands as Command[]);
      } catch (error: any) {
        toast.error("Failed to fetch commands: " + error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const columns = [
    {
      header: 'Timestamp',
      accessor: 'created_at',
      cell: (row: Command) => new Date(row.created_at).toLocaleString('en-GB'),
    },
    { header: 'Command', accessor: 'command' },
    { header: 'User ID', accessor: 'user_id' },
    { header: 'Device ID', accessor: 'device_id' },
    {
      header: 'Status',
      accessor: 'status',
      cell: (row: Command) => {
        const color = row.status === 'Success' ? 'green' : row.status === 'Pending' ? 'yellow' : 'red';
        return <Badge color={color}>{row.status}</Badge>;
      },
    },
  ];

  return (
    <Card title="Command History">
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <Table columns={columns} data={data} />
      )}
    </Card>
  );
};

export default CommandsList;
