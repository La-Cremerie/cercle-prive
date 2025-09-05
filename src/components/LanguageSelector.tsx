import React from 'react';
import { Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex items-center space-x-2">
      <Globe className="w-4 h-4 text-white" />
      <select
        value={i18n.language}
        onChange={(e) => changeLanguage(e.target.value)}
        className="bg-transparent text-white text-sm border border-white/30 rounded px-2 py-1 focus:outline-none focus:border-white/50"
      >
        <option value="fr" className="text-gray-900">FR</option>
        <option value="en" className="text-gray-900">EN</option>
      </select>
    </div>
  );
};

export default LanguageSelector;