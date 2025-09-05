import React, { useState } from 'react';
import { User, Phone, Mail, Calendar, MessageSquare, Star, Filter, Plus, Edit, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import type { UserRegistration } from '../types/database';
import toast from 'react-hot-toast';

interface CRMSystemProps {
  users: UserRegistration[];
}

interface Lead extends UserRegistration {
  score: number;
  status: 'nouveau' | 'contacte' | 'interesse' | 'negocie' | 'converti' | 'perdu';
  tags: string[];
  notes: string[];
  lastContact: string | null;
  source: string;
}

const CRMSystem: React.FC<CRMSystemProps> = ({ users }) => {
  const [leads, setLeads] = useState<Lead[]>(() => 
    users.map(user => ({
      ...user,
      score: Math.floor(Math.random() * 100) + 1,
      status: ['nouveau', 'contacte', 'interesse'][Math.floor(Math.random() * 3)] as Lead['status'],
      tags: ['Investisseur', 'Particulier', 'Première acquisition'][Math.floor(Math.random() * 3)] ? 
        [['Investisseur', 'Particulier', 'Première acquisition'][Math.floor(Math.random() * 3)]] : [],
      notes: [],
      lastContact: Math.random() > 0.5 ? new Date().toISOString() : null,
      source: ['Site web', 'Référencement', 'Bouche à oreille'][Math.floor(Math.random() * 3)]
    }))
  );

  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | Lead['status']>('all');
  const [newNote, setNewNote] = useState('');

  const statusColors = {
    nouveau: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    contacte: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    interesse: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    negocie: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    converti: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
    perdu: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  };

  const filteredLeads = statusFilter === 'all' 
    ? leads 
    : leads.filter(lead => lead.status === statusFilter);

  const updateLeadStatus = (leadId: string, newStatus: Lead['status']) => {
    setLeads(prev => prev.map(lead => 
      lead.id === leadId 
        ? { ...lead, status: newStatus, lastContact: new Date().toISOString() }
        : lead
    ));
    toast.success('Statut mis à jour');
  };

  const addNote = (leadId: string) => {
    if (!newNote.trim()) return;
    
    setLeads(prev => prev.map(lead => 
      lead.id === leadId 
        ? { 
            ...lead, 
            notes: [...lead.notes, `${new Date().toLocaleDateString('fr-FR')} : ${newNote}`]
          }
        : lead
    ));
    setNewNote('');
    toast.success('Note ajoutée');
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-8">
      {/* Pipeline Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Object.entries(statusColors).map(([status, colorClass]) => {
          const count = leads.filter(lead => lead.status === status).length;
          return (
            <div key={status} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 text-center">
              <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-2 ${colorClass}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </div>
              <div className="text-2xl font-light text-gray-900 dark:text-white">{count}</div>
            </div>
          );
        })}
      </div>

      {/* Filtres et actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">Tous les statuts</option>
              <option value="nouveau">Nouveau</option>
              <option value="contacte">Contacté</option>
              <option value="interesse">Intéressé</option>
              <option value="negocie">En négociation</option>
              <option value="converti">Converti</option>
              <option value="perdu">Perdu</option>
            </select>
          </div>
          
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {filteredLeads.length} lead(s) affiché(s)
          </div>
        </div>
      </div>

      {/* Liste des leads */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Gestion des Leads
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
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Source
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Dernier contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredLeads.map((lead) => (
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
                      <span className={`text-sm font-medium ${getScoreColor(lead.score)}`}>
                        {lead.score}/100
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={lead.status}
                      onChange={(e) => updateLeadStatus(lead.id, e.target.value as Lead['status'])}
                      className={`px-3 py-1 rounded-full text-xs font-medium border-0 ${statusColors[lead.status]}`}
                    >
                      <option value="nouveau">Nouveau</option>
                      <option value="contacte">Contacté</option>
                      <option value="interesse">Intéressé</option>
                      <option value="negocie">En négociation</option>
                      <option value="converti">Converti</option>
                      <option value="perdu">Perdu</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {lead.source}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {lead.lastContact 
                      ? new Date(lead.lastContact).toLocaleDateString('fr-FR')
                      : 'Jamais'
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedLead(lead)}
                        className="text-yellow-600 hover:text-yellow-700 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <a
                        href={`mailto:${lead.email}`}
                        className="text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        <Mail className="w-4 h-4" />
                      </a>
                      <a
                        href={`tel:${lead.telephone}`}
                        className="text-green-600 hover:text-green-700 transition-colors"
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

      {/* Modal de détail du lead */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                  {selectedLead.prenom} {selectedLead.nom}
                </h3>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Informations de contact */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Informations de Contact
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">{selectedLead.email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">{selectedLead.telephone}</span>
                  </div>
                </div>
              </div>

              {/* Score et statut */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Évaluation
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Score de qualification
                    </label>
                    <div className="flex items-center space-x-3">
                      <Star className={`w-5 h-5 ${getScoreColor(selectedLead.score)}`} />
                      <span className={`text-lg font-medium ${getScoreColor(selectedLead.score)}`}>
                        {selectedLead.score}/100
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Statut
                    </label>
                    <select
                      value={selectedLead.status}
                      onChange={(e) => {
                        const newStatus = e.target.value as Lead['status'];
                        updateLeadStatus(selectedLead.id, newStatus);
                        setSelectedLead(prev => prev ? { ...prev, status: newStatus } : null);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="nouveau">Nouveau</option>
                      <option value="contacte">Contacté</option>
                      <option value="interesse">Intéressé</option>
                      <option value="negocie">En négociation</option>
                      <option value="converti">Converti</option>
                      <option value="perdu">Perdu</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Notes et Historique
                </h4>
                
                {/* Ajouter une note */}
                <div className="flex space-x-3 mb-4">
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Ajouter une note..."
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <button
                    onClick={() => addNote(selectedLead.id)}
                    className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Liste des notes */}
                <div className="space-y-3 max-h-40 overflow-y-auto">
                  {selectedLead.notes.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 text-sm italic">
                      Aucune note pour ce contact
                    </p>
                  ) : (
                    selectedLead.notes.map((note, index) => (
                      <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-md p-3">
                        <div className="flex items-start space-x-3">
                          <MessageSquare className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{note}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Actions rapides */}
              <div className="flex space-x-3">
                <a
                  href={`mailto:${selectedLead.email}`}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>Envoyer un email</span>
                </a>
                <a
                  href={`tel:${selectedLead.telephone}`}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>Appeler</span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );

};

export default CRMSystem;