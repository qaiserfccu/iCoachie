"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Cloud, Sun, CloudRain, Wind, Thermometer, Droplets } from "lucide-react"

const currentWeather = {
  temperature: 72,
  condition: "Partly Cloudy",
  humidity: 45,
  wind: 8,
  precipitation: 10,
  uvIndex: 6,
}

const forecast = [
  { day: "Today", high: 75, low: 58, condition: "sunny", precipitation: 0 },
  { day: "Tomorrow", high: 72, low: 55, condition: "cloudy", precipitation: 20 },
  { day: "Wed", high: 68, low: 52, condition: "rainy", precipitation: 80 },
  { day: "Thu", high: 65, low: 50, condition: "rainy", precipitation: 60 },
  { day: "Fri", high: 70, low: 54, condition: "cloudy", precipitation: 30 },
  { day: "Sat", high: 74, low: 56, condition: "sunny", precipitation: 5 },
  { day: "Sun", high: 76, low: 58, condition: "sunny", precipitation: 0 },
]

const getWeatherIcon = (condition: string) => {
  switch (condition) {
    case "sunny": return <Sun className="w-8 h-8 text-yellow-500" />
    case "cloudy": return <Cloud className="w-8 h-8 text-gray-400" />
    case "rainy": return <CloudRain className="w-8 h-8 text-blue-500" />
    default: return <Cloud className="w-8 h-8 text-gray-400" />
  }
}

export default function WeatherPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Weather Monitoring</h1>
        <p className="text-muted-foreground">Track weather conditions for field management</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="glass-card border-white/20 lg:col-span-2">
          <CardHeader>
            <CardTitle>Current Conditions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-8">
              <div className="text-center">
                <Sun className="w-24 h-24 text-yellow-500 mx-auto" />
                <p className="text-lg mt-2">{currentWeather.condition}</p>
              </div>
              <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl glass-subtle text-center">
                  <Thermometer className="w-6 h-6 mx-auto mb-2 text-red-500" />
                  <p className="text-3xl font-bold">{currentWeather.temperature}°F</p>
                  <p className="text-sm text-muted-foreground">Temperature</p>
                </div>
                <div className="p-4 rounded-xl glass-subtle text-center">
                  <Droplets className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                  <p className="text-3xl font-bold">{currentWeather.humidity}%</p>
                  <p className="text-sm text-muted-foreground">Humidity</p>
                </div>
                <div className="p-4 rounded-xl glass-subtle text-center">
                  <Wind className="w-6 h-6 mx-auto mb-2 text-gray-500" />
                  <p className="text-3xl font-bold">{currentWeather.wind} mph</p>
                  <p className="text-sm text-muted-foreground">Wind</p>
                </div>
                <div className="p-4 rounded-xl glass-subtle text-center">
                  <CloudRain className="w-6 h-6 mx-auto mb-2 text-blue-400" />
                  <p className="text-3xl font-bold">{currentWeather.precipitation}%</p>
                  <p className="text-sm text-muted-foreground">Precipitation</p>
                </div>
                <div className="p-4 rounded-xl glass-subtle text-center">
                  <Sun className="w-6 h-6 mx-auto mb-2 text-orange-500" />
                  <p className="text-3xl font-bold">{currentWeather.uvIndex}</p>
                  <p className="text-sm text-muted-foreground">UV Index</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20">
          <CardHeader>
            <CardTitle>Field Recommendations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-xl bg-green-500/20 border border-green-500/30">
              <p className="font-medium text-green-500">Good Conditions</p>
              <p className="text-sm text-muted-foreground mt-1">All fields suitable for play</p>
            </div>
            <div className="p-4 rounded-xl glass-subtle">
              <p className="font-medium">Irrigation</p>
              <p className="text-sm text-muted-foreground mt-1">Schedule for evening watering</p>
            </div>
            <div className="p-4 rounded-xl glass-subtle">
              <p className="font-medium">Mowing</p>
              <p className="text-sm text-muted-foreground mt-1">Good conditions tomorrow AM</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card border-white/20">
        <CardHeader>
          <CardTitle>7-Day Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-4">
            {forecast.map((day, index) => (
              <div key={index} className="p-4 rounded-xl glass-subtle text-center">
                <p className="font-medium mb-2">{day.day}</p>
                {getWeatherIcon(day.condition)}
                <div className="mt-2">
                  <p className="font-bold">{day.high}°</p>
                  <p className="text-sm text-muted-foreground">{day.low}°</p>
                </div>
                <p className="text-xs text-blue-400 mt-1">{day.precipitation}%</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
