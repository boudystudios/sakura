
import React from 'react';

const TableLogin: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-800 text-white">
      <h1 className="text-4xl font-orbitron text-amber-400 mb-8">SAKURA - Table Login</h1>
      <div className="w-full max-w-xs">
        <form className="bg-gray-900 shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="table-number">
              Numero Tavolo
            </label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-700 text-white leading-tight focus:outline-none focus:shadow-outline" id="table-number" type="text" placeholder="e.g., 12" />
          </div>
          <div className="mb-6">
            <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="password">
              Codice Accesso
            </label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-700 text-white mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="******************" />
          </div>
          <div className="flex items-center justify-between">
            <button className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
              Accedi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TableLogin;
