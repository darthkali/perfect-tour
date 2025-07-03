// src/App.tsx
import { GPXUploader } from './components/GPXUploader';

function App() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12,2C8.13,2 5,5.13 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9C19,5.13 15.87,2 12,2M12,4A5,5 0 0,1 17,9C17,11.88 12,16.19 12,16.19C12,16.19 7,11.88 7,9A5,5 0 0,1 12,4M12,7A2,2 0 0,0 10,9A2,2 0 0,0 12,11A2,2 0 0,0 14,9A2,2 0 0,0 12,7Z" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">Perfect Tour</h1>
                                <p className="text-sm text-gray-500">Wetteroptimierte Fahrradtouren</p>
                            </div>
                        </div>

                        <nav className="flex space-x-4">
                            <button className="px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md">
                                GPX Upload
                            </button>
                            <button className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-md">
                                Analyse
                            </button>
                            <button className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-md">
                                Einstellungen
                            </button>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="space-y-6">
                    {/* Page Title */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">GPX-Route hochladen</h2>
                        <p className="mt-1 text-sm text-gray-600">
                            Laden Sie Ihre Fahrradroute hoch, um die optimalen Wetterbedingungen zu finden.
                        </p>
                    </div>

                    {/* GPX Uploader */}
                    <GPXUploader />
                </div>
            </main>
        </div>
    );
}

export default App;