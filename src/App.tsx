import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center">
          <h1 className="text-4xl font-light text-yellow-600 tracking-wide mb-8">
            CERCLE PRIVÉ
          </h1>
          <div className="w-24 h-1 bg-yellow-600 mx-auto mb-8"></div>
          <p className="text-lg text-gray-700 font-light leading-relaxed max-w-3xl mx-auto mb-12">
            L'excellence immobilière en toute discrétion. Découvrez nos biens d'exception 
            sélectionnés avec soin pour votre patrimoine.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="bg-gray-50 rounded-lg p-8">
              <h3 className="text-xl font-medium text-gray-900 mb-4">
                Concept
              </h3>
              <p className="text-gray-600 font-light">
                Une approche exclusive de l'immobilier de prestige
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-8">
              <h3 className="text-xl font-medium text-gray-900 mb-4">
                Services
              </h3>
              <p className="text-gray-600 font-light">
                Accompagnement personnalisé pour vos projets
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-8">
              <h3 className="text-xl font-medium text-gray-900 mb-4">
                Contact
              </h3>
              <p className="text-gray-600 font-light">
                <a href="mailto:nicolas.c@lacremerie.fr" className="text-yellow-600 hover:text-yellow-700">
                  nicolas.c@lacremerie.fr
                </a>
              </p>
            </div>
          </div>
          
          <div className="mt-16">
            <a
              href="mailto:nicolas.c@lacremerie.fr"
              className="inline-block border-2 border-yellow-600 text-yellow-600 px-8 py-3 text-sm font-light tracking-wider hover:bg-yellow-600 hover:text-white transition-all duration-300"
            >
              ENTRER EN RELATION
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;