import React, { useState } from 'react';
import testDriveService from '../../services/testDriveService';
import { Dealer, Vehicle } from '../../types/testDrive';

interface ApiResults {
  dealers?: Dealer[];
  dealersError?: string;
  vehicles?: Vehicle[];
  vehiclesError?: string;
}

const ApiDebug: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ApiResults>({});

  const testDealersApi = async () => {
    setLoading(true);
    try {
      console.log('Testing Dealers API...');
      const dealers = await testDriveService.getDealers();
      setResults(prev => ({ ...prev, dealers }));
      console.log('Dealers result:', dealers);
    } catch (error) {
      console.error('Dealers API error:', error);
      setResults(prev => ({ ...prev, dealersError: error instanceof Error ? error.message : String(error) }));
    } finally {
      setLoading(false);
    }
  };

  const testVehiclesApi = async () => {
    setLoading(true);
    try {
      console.log('Testing Vehicles API...');
      const vehicles = await testDriveService.getVehicles();
      setResults(prev => ({ ...prev, vehicles }));
      console.log('Vehicles result:', vehicles);
    } catch (error) {
      console.error('Vehicles API error:', error);
      setResults(prev => ({ ...prev, vehiclesError: error instanceof Error ? error.message : String(error) }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 m-4">
      <h3 className="text-sm font-medium text-yellow-800 mb-2">🔧 API Debug</h3>
      
      <div className="space-y-2 mb-4">
        <button
          onClick={testDealersApi}
          disabled={loading}
          className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Test Dealers API
        </button>
        
        <button
          onClick={testVehiclesApi}
          disabled={loading}
          className="px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 ml-2"
        >
          Test Vehicles API
        </button>
      </div>

      <div className="text-xs text-yellow-700 space-y-1">
        {results.dealers && (
          <div>
            <strong>Dealers ({results.dealers.length}):</strong>
            <pre className="mt-1 p-2 bg-white rounded text-xs overflow-auto max-h-32">
              {JSON.stringify(results.dealers, null, 2)}
            </pre>
          </div>
        )}
        
        {results.dealersError && (
          <div className="text-red-600">
            <strong>Dealers Error:</strong> {results.dealersError}
          </div>
        )}

        {results.vehicles && (
          <div>
            <strong>Vehicles ({results.vehicles.length}):</strong>
            <pre className="mt-1 p-2 bg-white rounded text-xs overflow-auto max-h-32">
              {JSON.stringify(results.vehicles, null, 2)}
            </pre>
          </div>
        )}
        
        {results.vehiclesError && (
          <div className="text-red-600">
            <strong>Vehicles Error:</strong> {results.vehiclesError}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiDebug;
