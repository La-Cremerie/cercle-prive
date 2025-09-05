import React, { useState } from 'react';
import { TrendingUp, Star, User, Mail, Phone, Calendar, Target } from 'lucide-react';
import type { UserRegistration } from '../types/database';

interface LeadScoringProps {
  users: UserRegistration[];
}

interface ScoredLead extends UserRegistration {
  score: number;
  factors: {
    engagement: number;
    profile: number;
    timing: number;
    budget: number;
  };
  priority: 'high' | 'medium' | 'low';
}

const LeadScoring: React.FC<LeadScoringProps> = ({ users }) => {
  const [scoredLeads, setScoredLeads] = useState<ScoredLead[]>(() => {
    return users.map(user => {
      // Simulation du scoring basé sur différents facteurs
      const engagement = Math.floor(Math.random() * 30) + 20; // 20-50
      const profile = Math.floor(Math.random() * 25) + 15; // 15-40
      const timing = Math.floor(Math.random() * 20) + 10; // 10-30
      const budget = Math.floor(Math.random() * 25) + 15; // 15-40
      
      const totalScore = engagement + profile + timing + budget;
      
      let priority: 'high' | 'medium' | 'low' = 'low';
      if (totalScore >= 80) priority = 'high';
      else if (totalScore >= 60) priority = 'medium';
      
      return {
        ...user,
        score: totalScore,
        factors: { engagement, profile, timing, budget },
        priority
      };
    }).sort((a, b) => b.score - a.score);
  });

  const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    }
  };

  const getPriorityLabel = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high': return 'Priorité haute';
      case 'medium': return 'Priorité moyenne';
      case 'low': return 'Priorité basse';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-red-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-green-600';
  };

  const highPriorityLeads = scoredLeads.filter(lead => lead.priority === 'high');
  const mediumPriorityLeads = scoredLeads.filter(lead => lead.priority === 'medium');
  const lowPriorityLeads = scoredLeads.filter(lead => lead.priority === 'low');

  return (
    <div className="space-y-8">
      {/* Header avec statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Score moyen</p>
              <p className="text-2xl font-light text-gray-900 dark:text-white">
                {Math.round(scoredLeads.reduce((acc, lead) => acc + lead.score, 0) / scoredLeads.length) || 0}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Priorité haute</p>
              <p className="text-2xl font-light text-gray-900 dark:text-white">
                {highPriorityLeads.length}
              </p>
            </div>
            <Target className="w-8 h-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Priorité moyenne</p>
              <p className="text-2xl font-light text-gray-900 dark:text-white">
                {mediumPriorityLeads.length}
              </p>
            </div>
            <Star className="w-8 h-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Priorité basse</p>
              <p className="text-2xl font-light text-gray-900 dark:text-white">
                {lowPriorityLeads.length}
              </p>
            </div>
            <User className="w-8 h-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Tableau des leads scorés */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Scoring des Leads
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Score Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Priorité
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Facteurs
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {scoredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                          <User className="w-5 h-5 text-yellow-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {lead.prenom} {lead.nom}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {lead.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Star className={`w-4 h-4 mr-2 ${getScoreColor(lead.score)}`} />
                      <span className={`text-lg font-medium ${getScoreColor(lead.score)}`}>
                        {lead.score}/100
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(lead.priority)}`}>
                      {getPriorityLabel(lead.priority)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Engagement:</span>
                        <span className="font-medium">{lead.factors.engagement}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Profil:</span>
                        <span className="font-medium">{lead.factors.profile}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Timing:</span>
                        <span className="font-medium">{lead.factors.timing}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Budget:</span>
                        <span className="font-medium">{lead.factors.budget}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <a
                        href={`mailto:${lead.email}`}
                        className="text-blue-600 hover:text-blue-700 transition-colors"
                        title="Envoyer un email"
                      >
                        <Mail className="w-4 h-4" />
                      </a>
                      <a
                        href={`tel:${lead.telephone}`}
                        className="text-green-600 hover:text-green-700 transition-colors"
                        title="Appeler"
                      >
                        <Phone className="w-4 h-4" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Analyse des facteurs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
          Analyse des Facteurs de Scoring
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Engagement</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Interactions avec le site, temps passé, pages visitées
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-3">
              <User className="w-8 h-8 text-green-600" />
            </div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Profil</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Qualité des informations fournies, cohérence du profil
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-3">
              <Calendar className="w-8 h-8 text-purple-600" />
            </div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Timing</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Urgence du projet, disponibilité pour les visites
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mx-auto mb-3">
              <Target className="w-8 h-8 text-yellow-600" />
            </div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Budget</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Capacité financière estimée, solvabilité
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadScoring;