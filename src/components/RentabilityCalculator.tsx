import React, { useState } from 'react';
import { Calculator, X, TrendingUp, DollarSign } from 'lucide-react';

interface RentabilityCalculatorProps {
  onClose: () => void;
}

const RentabilityCalculator: React.FC<RentabilityCalculatorProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    purchasePrice: '',
    renovationCosts: '',
    monthlyRent: '',
    charges: '',
    taxes: '',
    managementFees: ''
  });

  const [results, setResults] = useState<{
    grossYield: number;
    netYield: number;
    monthlyProfit: number;
    annualProfit: number;
  } | null>(null);

  const calculateRentability = () => {
    const purchase = parseFloat(formData.purchasePrice.replace(/[^\d]/g, '')) || 0;
    const renovation = parseFloat(formData.renovationCosts.replace(/[^\d]/g, '')) || 0;
    const rent = parseFloat(formData.monthlyRent.replace(/[^\d]/g, '')) || 0;
    const charges = parseFloat(formData.charges.replace(/[^\d]/g, '')) || 0;
    const taxes = parseFloat(formData.taxes.replace(/[^\d]/g, '')) || 0;
    const management = parseFloat(formData.managementFees.replace(/[^\d]/g, '')) || 0;

    const totalInvestment = purchase + renovation;
    const monthlyExpenses = charges + taxes + management;
    const netMonthlyRent = rent - monthlyExpenses;
    const annualNetRent = netMonthlyRent * 12;

    const grossYield = totalInvestment > 0 ? (rent * 12 / totalInvestment) * 100 : 0;
    const netYield = totalInvestment > 0 ? (annualNetRent / totalInvestment) * 100 : 0;

    setResults({
      grossYield,
      netYield,
      monthlyProfit: netMonthlyRent,
      annualProfit: annualNetRent
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Calculator className="w-6 h-6 text-yellow-600" />
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                Calculateur de Rentabilité
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Formulaire */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Prix d'achat (€)
              </label>
              <input
                type="text"
                value={formData.purchasePrice}
                onChange={(e) => setFormData(prev => ({ ...prev, purchasePrice: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="2 500 000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Coûts de rénovation (€)
              </label>
              <input
                type="text"
                value={formData.renovationCosts}
                onChange={(e) => setFormData(prev => ({ ...prev, renovationCosts: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="200 000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Loyer mensuel (€)
              </label>
              <input
                type="text"
                value={formData.monthlyRent}
                onChange={(e) => setFormData(prev => ({ ...prev, monthlyRent: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="15 000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Charges mensuelles (€)
              </label>
              <input
                type="text"
                value={formData.charges}
                onChange={(e) => setFormData(prev => ({ ...prev, charges: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="2 000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Taxes mensuelles (€)
              </label>
              <input
                type="text"
                value={formData.taxes}
                onChange={(e) => setFormData(prev => ({ ...prev, taxes: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Frais de gestion (€)
              </label>
              <input
                type="text"
                value={formData.managementFees}
                onChange={(e) => setFormData(prev => ({ ...prev, managementFees: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="1 000"
              />
            </div>
          </div>

          <button
            onClick={calculateRentability}
            className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
          >
            <Calculator className="w-5 h-5" />
            <span>Calculer la rentabilité</span>
          </button>

          {/* Résultats */}
          {results && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                  <h4 className="text-lg font-medium text-green-800 dark:text-green-200">
                    Rendement Brut
                  </h4>
                </div>
                <div className="text-3xl font-light text-green-600 mb-2">
                  {results.grossYield.toFixed(2)}%
                </div>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Rendement avant charges et taxes
                </p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                  <h4 className="text-lg font-medium text-blue-800 dark:text-blue-200">
                    Rendement Net
                  </h4>
                </div>
                <div className="text-3xl font-light text-blue-600 mb-2">
                  {results.netYield.toFixed(2)}%
                </div>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Rendement après déduction des charges
                </p>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
                <h4 className="text-lg font-medium text-yellow-800 dark:text-yellow-200 mb-4">
                  Profit Mensuel
                </h4>
                <div className="text-2xl font-light text-yellow-600 mb-2">
                  {results.monthlyProfit.toLocaleString('fr-FR')} €
                </div>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Bénéfice net par mois
                </p>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
                <h4 className="text-lg font-medium text-purple-800 dark:text-purple-200 mb-4">
                  Profit Annuel
                </h4>
                <div className="text-2xl font-light text-purple-600 mb-2">
                  {results.annualProfit.toLocaleString('fr-FR')} €
                </div>
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  Bénéfice net par an
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RentabilityCalculator;