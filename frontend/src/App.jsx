import React, { useEffect, useState } from 'react';
import { checkHealth } from './services/api';
import { Activity, Database, Server, ShieldCheck, Cpu, Terminal } from 'lucide-react';

function App() {
  const [apiStatus, setApiStatus] = useState({ status: 'checking', message: 'Connecting to backend...' });

  useEffect(() => {
    checkHealth()
      .then((data) => {
        setApiStatus({ status: 'online', message: data.message || 'API Connected Successfully' });
      })
      .catch(() => {
        setApiStatus({ status: 'offline', message: 'Backend service offline or initializing' });
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-between p-6 md:p-12 relative overflow-hidden bg-gradient-to-br from-[#07110e] via-[#0b1916] to-[#0d221c]">
      {/* Background Glow Overlay */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="flex justify-between items-center max-w-6xl mx-auto w-full z-10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <span className="font-extrabold text-slate-950 text-xl tracking-tight">PK</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-100 tracking-tight">FreelanceHub PK</h1>
            <p className="text-xs text-emerald-400 font-medium">Scalable Full-Stack Architecture</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className={`inline-block w-2.5 h-2.5 rounded-full ${apiStatus.status === 'online' ? 'bg-emerald-400 animate-pulse' : apiStatus.status === 'offline' ? 'bg-rose-500' : 'bg-amber-400 animate-ping'}`}></span>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            {apiStatus.status}
          </span>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto w-full my-auto py-12 z-10">
        <div className="glass-panel p-8 md:p-12 rounded-3xl border border-emerald-500/20 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 text-emerald-300 pointer-events-none">
            <Terminal size={180} />
          </div>

          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium mb-6">
            <ShieldCheck size={14} />
            <span>Production Ready Baseline</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
            FreelanceHub PK <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-green-400 bg-clip-text text-transparent">
              Core Environment Initialized
            </span>
          </h2>

          <p className="text-slate-400 max-w-2xl text-base md:text-lg mb-8 leading-relaxed">
            Clean, modular project workspace configured with React 18, Vite, Tailwind CSS, Express API architecture, CORS policies, centralized error middleware, and MongoDB Object Data Modeling (Mongoose).
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="glass-card p-5 rounded-2xl border border-slate-800 hover:border-emerald-500/40 transition-colors">
              <div className="flex items-center space-x-3 mb-2 text-emerald-400">
                <Cpu size={20} />
                <h3 className="font-semibold text-slate-200">Frontend Stack</h3>
              </div>
              <p className="text-xs text-slate-400">React + Vite + Tailwind CSS with modular component hierarchy.</p>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-slate-800 hover:border-emerald-500/40 transition-colors">
              <div className="flex items-center space-x-3 mb-2 text-teal-400">
                <Server size={20} />
                <h3 className="font-semibold text-slate-200">Backend API</h3>
              </div>
              <p className="text-xs text-slate-400">Node.js + Express with Helmet security, CORS, & health checks.</p>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-slate-800 hover:border-emerald-500/40 transition-colors">
              <div className="flex items-center space-x-3 mb-2 text-green-400">
                <Database size={20} />
                <h3 className="font-semibold text-slate-200">Database Layer</h3>
              </div>
              <p className="text-xs text-slate-400">Mongoose ORM integration & environment schema setup.</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs font-mono text-slate-300 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Activity size={16} className="text-emerald-400" />
              <span>Status: <strong className="text-slate-100">{apiStatus.message}</strong></span>
            </div>
            <span className="text-slate-500">PORT 5000 / 5173</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto w-full flex justify-between items-center text-xs text-slate-500 z-10 pt-4 border-t border-slate-800/60">
        <div>&copy; {new Date().getFullYear()} FreelanceHub PK. Built for scale.</div>
        <div className="flex space-x-4">
          <span className="hover:text-emerald-400 cursor-pointer transition-colors">Docs</span>
          <span className="hover:text-emerald-400 cursor-pointer transition-colors">API Architecture</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
