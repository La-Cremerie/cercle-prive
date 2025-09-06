import React from 'react';
import { Wifi, WifiOff, Users, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

interface RealTimeSyncIndicatorProps {
  connected: boolean;
  subscribers: number;
  className?: string;
}

const RealTimeSyncIndicator: React.FC<RealTimeSyncIndicatorProps> = ({ 
  connected, 
  subscribers, 
  className = '' 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`flex items-center space-x-2 ${className}`}
    >
      {/* Indicateur de connexion */}
      <div className="flex items-center space-x-1">
        {connected ? (
          <Wifi className="w-4 h-4 text-green-500" />
        ) : (
          <WifiOff className="w-4 h-4 text-red-500" />
        )}
        <span className={`text-xs font-medium ${
          connected ? 'text-green-600' : 'text-red-600'
        }`}>
          {connected ? 'LIVE' : 'OFFLINE'}
        </span>
      </div>

      {/* Nombre d'abonnés */}
      {connected && subscribers > 0 && (
        <div className="flex items-center space-x-1">
          <Users className="w-3 h-3 text-blue-500" />
          <span className="text-xs text-blue-600">{subscribers}</span>
        </div>
      )}

      {/* Animation de pulsation pour indiquer l'activité */}
      {connected && (
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-2 h-2 bg-green-400 rounded-full"
        />
      )}
    </motion.div>
  );
};

export default RealTimeSyncIndicator;