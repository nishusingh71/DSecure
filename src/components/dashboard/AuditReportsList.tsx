import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import Table from '../ui/Table';
import Badge from '../ui/Badge';
import { tableService } from '../../services/supabaseService';
import { Download } from 'lucide-react';
import toast from 'react-hot-toast';

interface AuditReport {
  id: string;
  device_id: string;
  algorithm: string;
  created_at: string;
  status: 'Completed' | 'Failed';
  certificate_id: string;
}

const AuditReportsList: React.FC = () => {
  const [data, setData] = useState<AuditReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const reports = await tableService.getData('audit_reports');
        setData(reports as AuditReport[]);
      } catch (error: any) {
        toast.error("Failed to fetch audit reports: " + error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const columns = [
    { header: 'Certificate ID', accessor: 'certificate_id' },
    { header: 'Algorithm', accessor: 'algorithm' },
    {
      header: 'Date',
      accessor: 'created_at',
      cell: (row: AuditReport) => new Date(row.created_at).toLocaleString('en-GB'),
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (row: AuditReport) => (
        <Badge color={row.status === 'Completed' ? 'green' : 'red'}>{row.status}</Badge>
      ),
    },
    {
      header: 'Actions',
      accessor: 'actions',
      cell: () => (
        <button className="text-blue-600 hover:text-blue-800">
          <Download className="w-5 h-5" />
        </button>
      ),
    },
  ];

  return (
    <Card title="Audit Reports">
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <Table columns={columns} data={data} />
      )}
    </Card>
  );
};

export default AuditReportsList;
