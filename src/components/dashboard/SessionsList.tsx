import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import Table from '../ui/Table';
import Badge from '../ui/Badge';
import { tableService } from '../../services/supabaseService';
import toast from 'react-hot-toast';

interface Session {
  id: string;
  user_id: string;
  ip_address: string;
  user_agent: string;
  created_at: string;
  status: 'Active' | 'Expired';
}

const SessionsList: React.FC = () => {
  const [data, setData] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const sessions = await tableService.getData('sessions');
        setData(sessions as Session[]);
      } catch (error: any) {
        toast.error("Failed to fetch sessions: " + error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const columns = [
    {
      header: 'Login Time',
      accessor: 'created_at',
      cell: (row: Session) => new Date(row.created_at).toLocaleString('en-GB'),
    },
    { header: 'User ID', accessor: 'user_id' },
    { header: 'IP Address', accessor: 'ip_address' },
    { header: 'User Agent', accessor: 'user_agent' },
    {
      header: 'Status',
      accessor: 'status',
      cell: (row: Session) => (
        <Badge color={row.status === 'Active' ? 'green' : 'gray'}>{row.status}</Badge>
      ),
    },
  ];

  return (
    <Card title="User Sessions">
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <Table columns={columns} data={data} />
      )}
    </Card>
  );
};

export default SessionsList;
