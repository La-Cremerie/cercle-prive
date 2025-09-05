import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import type { UserRegistration } from '../types/database';

interface StatsChartsProps {
  users: UserRegistration[];
}

const StatsCharts: React.FC<StatsChartsProps> = ({ users }) => {
  // Préparer les données pour les graphiques
  const getRegistrationsByDay = () => {
    const last7Days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const count = users.filter(user => {
        if (!user.created_at) return false;
        const userDate = new Date(user.created_at);
        return userDate.toISOString().split('T')[0] === dateStr;
      }).length;
      
      last7Days.push({
        date: date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' }),
        inscriptions: count
      });
    }
    
    return last7Days;
  };

  const getRegistrationsByMonth = () => {
    const monthlyData: { [key: string]: number } = {};
    
    users.forEach(user => {
      if (!user.created_at) return;
      const date = new Date(user.created_at);
      const monthKey = date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
      monthlyData[monthKey] = (monthlyData[monthKey] || 0) + 1;
    });
    
    return Object.entries(monthlyData).map(([month, count]) => ({
      month,
      inscriptions: count
    })).slice(-6); // Derniers 6 mois
  };

  const getHourlyDistribution = () => {
    const hourlyData: { [key: number]: number } = {};
    
    // Initialiser toutes les heures
    for (let i = 0; i < 24; i++) {
      hourlyData[i] = 0;
    }
    
    users.forEach(user => {
      if (!user.created_at) return;
      const hour = new Date(user.created_at).getHours();
      hourlyData[hour]++;
    });
    
    return Object.entries(hourlyData).map(([hour, count]) => ({
      heure: `${hour}h`,
      inscriptions: count
    }));
  };

  const dailyData = getRegistrationsByDay();
  const monthlyData = getRegistrationsByMonth();
  const hourlyData = getHourlyDistribution();

  const COLORS = ['#D97706', '#F59E0B', '#FBBF24', '#FCD34D'];

  return (
    <div className="space-y-8">
      {/* Inscriptions par jour (7 derniers jours) */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">
          Inscriptions des 7 derniers jours
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dailyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="inscriptions" fill="#D97706" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Évolution mensuelle */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">
            Évolution mensuelle
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="inscriptions" 
                stroke="#D97706" 
                strokeWidth={3}
                dot={{ fill: '#D97706', strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Distribution par heure */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">
            Répartition par heure
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={hourlyData.filter(d => d.inscriptions > 0)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="heure" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="inscriptions" fill="#F59E0B" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default StatsCharts;