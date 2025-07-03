// src/components/GPXUploader.tsx
import React, { useRef, useState } from 'react';
import { useGPXParser } from '../hooks/useGPXParser';
import { GPXMap } from './GPXMap';

export const GPXUploader: React.FC = () => {
    const { parseGPXFile, clearData, gpxData, isLoading, error } = useGPXParser();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragOver, setIsDragOver] = useState(false);

    const handleFileSelect = async (files: FileList | null) => {
        if (!files || files.length === 0) return;

        const file = files[0];
        if (!file.name.toLowerCase().endsWith('.gpx')) {
            alert('Bitte wählen Sie eine GPX-Datei aus.');
            return;
        }

        await parseGPXFile(file);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        handleFileSelect(e.dataTransfer.files);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const formatDistance = (meters: number): string => {
        if (meters >= 1000) {
            return `${(meters / 1000).toFixed(1)} km`;
        }
        return `${meters} m`;
    };

    const formatElevation = (meters: number): string => {
        return `${meters} m`;
    };

    return (
        <div className="space-y-6">
            {/* Upload Area */}
            {!gpxData && (
                <div
                    className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer
            ${isDragOver
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <div className="space-y-4">
                        <div className="mx-auto w-12 h-12 text-gray-400">
                            <svg fill="currentColor" viewBox="0 0 24 24">
                                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-lg font-medium text-gray-900">
                                GPX-Datei hochladen
                            </p>
                            <p className="text-sm text-gray-500">
                                Ziehen Sie Ihre GPX-Datei hierher oder klicken Sie zum Auswählen
                            </p>
                        </div>
                        {isLoading && (
                            <div className="flex items-center justify-center space-x-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                <span className="text-sm text-gray-600">Datei wird verarbeitet...</span>
                            </div>
                        )}
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".gpx"
                        onChange={(e) => handleFileSelect(e.target.files)}
                        className="hidden"
                    />
                </div>
            )}

            {/* Error Display */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">Fehler beim Laden der Datei</h3>
                            <p className="mt-1 text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* GPX Data Display */}
            {gpxData && (
                <div className="space-y-6">
                    {/* Header with Clear Button */}
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Route geladen: {gpxData.metadata.name || 'Unbenannte Route'}
                        </h2>
                        <button
                            onClick={clearData}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Neue Datei laden
                        </button>
                    </div>

                    {/* Route Statistics */}
                    {gpxData.tracks.map((track, index) => (
                        <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">{track.name}</h3>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-blue-50 rounded-lg p-4">
                                    <div className="text-2xl font-bold text-blue-600">
                                        {formatDistance(track.distance)}
                                    </div>
                                    <div className="text-sm text-gray-600">Gesamtdistanz</div>
                                </div>

                                <div className="bg-green-50 rounded-lg p-4">
                                    <div className="text-2xl font-bold text-green-600">
                                        {formatElevation(track.elevationGain)}
                                    </div>
                                    <div className="text-sm text-gray-600">Höhenmeter aufwärts</div>
                                </div>

                                <div className="bg-red-50 rounded-lg p-4">
                                    <div className="text-2xl font-bold text-red-600">
                                        {formatElevation(track.elevationLoss)}
                                    </div>
                                    <div className="text-sm text-gray-600">Höhenmeter abwärts</div>
                                </div>

                                <div className="bg-purple-50 rounded-lg p-4">
                                    <div className="text-2xl font-bold text-purple-600">
                                        {track.points.length.toLocaleString()}
                                    </div>
                                    <div className="text-sm text-gray-600">Trackpunkte</div>
                                </div>
                            </div>

                            <div className="mt-4 grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <div className="text-sm text-gray-600">Niedrigster Punkt</div>
                                    <div className="text-lg font-semibold text-gray-900">
                                        {formatElevation(track.minElevation)}
                                    </div>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <div className="text-sm text-gray-600">Höchster Punkt</div>
                                    <div className="text-lg font-semibold text-gray-900">
                                        {formatElevation(track.maxElevation)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Karte statt Placeholder */}
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <div className="h-96">
                            <GPXMap tracks={gpxData.tracks} className="h-full" />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};