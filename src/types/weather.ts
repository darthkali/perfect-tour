export interface WeatherData {
    datetime: string;
    temperature: number; // °C
    precipitation: number; // mm/h
    windSpeed: number; // m/s
    coordinates: {
        lat: number;
        lon: number;
    };
}

export interface WeatherScore {
    temperature: number;
    precipitation: number;
    wind: number;
    total: number;
}