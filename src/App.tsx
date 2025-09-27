import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Perfect Tour</h1>
              <p className="text-gray-600 mt-1">Wetteroptimierte Gravelbike-Touren</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Willkommen bei Perfect Tour
          </h2>
          <p className="text-gray-600 mb-6">
            Lade deine GPX-Datei hoch und finde die besten Zeiträume für deine Gravelbike-Tour
            basierend auf historischen Wetterdaten.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800">
              🚧 Projekt-Setup abgeschlossen - Bereit für die Entwicklung!
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;