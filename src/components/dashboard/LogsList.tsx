import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import Table from '../ui/Table';
import Badge from '../ui/Badge';
import { tableService } from '../../services/supabaseService';
import toast from 'react-hot-toast';

interface Log {
  id: string;
  created_at: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  service: string;
  message: string;
}

const LogsList: React.FC = () => {
  const [data, setData] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const logs = await tableService.getData('logs');
        setData(logs as Log[]);
      } catch (error: any) {
        toast.error("Failed to fetch logs: " + error.message);
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
      cell: (row: Log) => new Date(row.created_at).toLocaleString('en-GB'),
    },
    {
      header: 'Level',
      accessor: 'level',
      cell: (row: Log) => {
        const color = row.level === 'ERROR' ? 'red' : row.level === 'WARN' ? 'yellow' : 'gray';
        return <Badge color={color}>{row.level}</Badge>;
      },
    },
    { header: 'Service', accessor: 'service' },
    { header: 'Message', accessor: 'message' },
  ];

  return (
    <Card title="System Logs">
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <Table columns={columns} data={data} />
      )}
    </Card>
  );
};

export default LogsList;
