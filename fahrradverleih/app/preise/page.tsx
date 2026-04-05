'use client'

import { useFahrradverleih } from '../lib/context'
import Link from 'next/link'

export default function PreisePage() {
  const { fahrraeder } = useFahrradverleih()

  const getUniqueTypes = () => {
    const types = [...new Set(fahrraeder.map(f => f.type))]
    return types.map(type => {
      const fahrraederOfType = fahrraeder.filter(f => f.type === type)
      const minPrice = Math.min(...fahrraederOfType.map(f => f.preis))
      const maxPrice = Math.max(...fahrraederOfType.map(f => f.preis))
      
      return {
        type,
        minPrice,
        maxPrice,
        count: fahrraederOfType.length
      }
    })
  }

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'stadtrad': 'Stadtrad',
      'ebike': 'E-Bike',
      'mountainbike': 'Mountainbike',
      'rennrad': 'Rennrad'
    }
    return labels[type] || type
  }

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      'stadtrad': '🚴‍♀️',
      'ebike': '⚡',
      'mountainbike': '🚵‍♂️',
      'rennrad': '🚴‍♂️'
    }
    return icons[type] || '🚲'
  }

  const getTypeDescription = (type: string) => {
    const descriptions: Record<string, string> = {
      'stadtrad': 'Ideal für entspannte Fahrten durch die Münchener Innenstadt',
      'ebike': 'Mit elektrischer Unterstützung für längere Strecken ohne Anstrengung',
      'mountainbike': 'Robuste Räder für Trails und Touren im Umland',
      'rennrad': 'Leichte, aerodynamische Räder für sportliche Fahrer'
    }
    return descriptions[type] || 'Hochwertige Fahrräder für jeden Bedarf'
  }

  const uniqueTypes = getUniqueTypes()

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Unsere Preise</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transparente Tagespreise ohne versteckte Kosten. 
            Je länger Sie mieten, desto günstiger wird es!
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {uniqueTypes.map((typeInfo) => (
            <div key={typeInfo.type} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-500 to-green-500 p-6 text-white text-center">
                <div className="text-5xl mb-3">{getTypeIcon(typeInfo.type)}</div>
                <h3 className="text-2xl font-bold">{getTypeLabel(typeInfo.type)}</h3>
                <p className="text-blue-100 mt-1">{typeInfo.count} Fahrräder verfügbar</p>
              </div>

              {/* Price */}
              <div className="p-6">
                <div className="text-center mb-4">
                  {typeInfo.minPrice === typeInfo.maxPrice ? (
                    <div className="text-3xl font-bold text-gray-900">
                      {typeInfo.minPrice}€<span className="text-lg text-gray-600">/Tag</span>
                    </div>
                  ) : (
                    <div className="text-3xl font-bold text-gray-900">
                      {typeInfo.minPrice}€ - {typeInfo.maxPrice}€<span className="text-lg text-gray-600">/Tag</span>
                    </div>
                  )}
                </div>

                <p className="text-gray-600 text-center mb-6">
                  {getTypeDescription(typeInfo.type)}
                </p>

                <Link
                  href={`/fahrraeder?type=${typeInfo.type}`}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors block text-center"
                >
                  Fahrräder ansehen
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Price Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-12">
          <div className="bg-gray-50 px-6 py-4 border-b">
            <h2 className="text-2xl font-bold text-gray-900">Detaillierte Preisübersicht</h2>
            <p className="text-gray-600">Alle Preise verstehen sich inklusive Helme, Schlösser und Grundausstattung</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fahrradtyp</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">1 Tag</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">3 Tage</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">7 Tage</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Monat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {uniqueTypes.map((typeInfo, index) => {
                  const basePrice = typeInfo.minPrice
                  const threeDayPrice = Math.round(basePrice * 3 * 0.9) // 10% Rabatt
                  const weekPrice = Math.round(basePrice * 7 * 0.8) // 20% Rabatt
                  const monthPrice = Math.round(basePrice * 30 * 0.6) // 40% Rabatt

                  return (
                    <tr key={typeInfo.type} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">{getTypeIcon(typeInfo.type)}</span>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{getTypeLabel(typeInfo.type)}</div>
                            <div className="text-sm text-gray-500">ab {typeInfo.minPrice}€/Tag</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="text-lg font-semibold text-gray-900">{basePrice}€</div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="text-lg font-semibold text-gray-900">{threeDayPrice}€</div>
                        <div className="text-xs text-green-600">(-10%)</div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="text-lg font-semibold text-gray-900">{weekPrice}€</div>
                        <div className="text-xs text-green-600">(-20%)</div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="text-lg font-semibold text-gray-900">{monthPrice}€</div>
                        <div className="text-xs text-green-600">(-40%)</div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Additional Info */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Including */}
          <div className="bg-green-50 rounded-xl p-6">
            <h3 className="text-xl font-bold text-green-900 mb-4 flex items-center">
              <span className="mr-2">✅</span> Im Preis enthalten
            </h3>
            <ul className="space-y-2 text-green-800">
              <li className="flex items-center"><span className="mr-2">•</span>Hochwertiges Fahrradschloss</li>
              <li className="flex items-center"><span className="mr-2">•</span>Verstellbarer Helm</li>
              <li className="flex items-center"><span className="mr-2">•</span>Grundausstattung (Licht, Klingel)</li>
              <li className="flex items-center"><span className="mr-2">•</span>24/7 Pannenhilfe</li>
              <li className="flex items-center"><span className="mr-2">•</span>Diebstahlversicherung</li>
            </ul>
          </div>

          {/* Additional Services */}
          <div className="bg-blue-50 rounded-xl p-6">
            <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center">
              <span className="mr-2">💫</span> Zusatzleistungen
            </h3>
            <ul className="space-y-2 text-blue-800">
              <li className="flex items-center justify-between">
                <span>Kinderanhänger</span>
                <span className="font-semibold">+5€/Tag</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Fahrradtasche</span>
                <span className="font-semibold">+2€/Tag</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Smartphone-Halterung</span>
                <span className="font-semibold">+1€/Tag</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Premium-Helm</span>
                <span className="font-semibold">+3€/Tag</span>
              </li>
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            href="/buchung"
            className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors inline-block"
          >
            Jetzt Fahrrad buchen
          </Link>
        </div>
      </div>
    </div>
  )
}