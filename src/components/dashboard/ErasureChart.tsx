import React, { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import { dashboardService } from '../../services/supabaseService';
import toast from 'react-hot-toast';

interface DailyCount {
  day: string;
  count: number;
}

const ErasureChart: React.FC = () => {
  const [chartData, setChartData] = useState<{ labels: string[]; values: number[] }>({ labels: [], values: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        setLoading(true);
        const activity: DailyCount[] = await dashboardService.getErasureActivity();
        
        const labels = activity.map(item => new Date(item.day).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })).reverse();
        const values = activity.map(item => item.count).reverse();

        setChartData({ labels, values });

      } catch (error: any) {
        toast.error('Failed to load chart data: ' + error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchActivity();
  }, []);

  const options = {
    grid: { top: 20, right: 20, bottom: 40, left: 50 },
    xAxis: {
      type: 'category',
      data: chartData.labels,
    },
    yAxis: {
      type: 'value',
      name: 'Devices Wiped',
    },
    series: [
      {
        data: chartData.values,
        type: 'bar',
        itemStyle: {
          color: '#3B82F6',
        },
        name: 'Devices Wiped',
      }
    ],
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: ['Devices Wiped'],
      bottom: 0,
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return <ReactECharts option={options} style={{ height: 400 }} />;
};

export default ErasureChart;
