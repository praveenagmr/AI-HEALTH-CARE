/**
 * AI HEALTH CARE - Page 7: Admin Control Center (Restricted Access)
 * Real-time MongoDB Management: Users, Clinical Screenings, Medicine Orders & Voice Logs with Edit and Delete
 */
import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Database,
  Users,
  Activity,
  ShoppingBag,
  MessageSquare,
  Edit,
  Trash2,
  Save,
  X,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Search,
  Lock,
} from 'lucide-react';
import {
  SupportedLanguage,
  UserProfile,
  ScreeningFinding,
  MedicineOrder,
  VoiceInteractionLog,
} from '../../../database/schema.ts';
import { TRANSLATIONS } from '../translations/index.ts';
import { voiceAssistant } from '../services/voiceAssistant.ts';

interface Page7AdminControlProps {
  language: SupportedLanguage;
  currentUser: UserProfile | null;
}

export const Page7AdminControl: React.FC<Page7AdminControlProps> = ({
  language,
  currentUser,
}) => {
  const t = TRANSLATIONS[language];

  // Tab: users | screenings | orders | voice
  const [activeTab, setActiveTab] = useState<'users' | 'screenings' | 'orders' | 'voice'>('users');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [mongoInfo, setMongoInfo] = useState<{ connected: boolean; url: string }>({
    connected: false,
    url: '',
  });

  // Admin Data Collections
  const [usersList, setUsersList] = useState<UserProfile[]>([]);
  const [screeningsList, setScreeningsList] = useState<ScreeningFinding[]>([]);
  const [ordersList, setOrdersList] = useState<MedicineOrder[]>([]);
  const [voiceLogsList, setVoiceLogsList] = useState<VoiceInteractionLog[]>([]);

  // Editing state modals
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [editingScreening, setEditingScreening] = useState<ScreeningFinding | null>(null);
  const [editingOrder, setEditingOrder] = useState<MedicineOrder | null>(null);
  const [editingVoiceLog, setEditingVoiceLog] = useState<VoiceInteractionLog | null>(null);

  // Status message
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const isAdmin = currentUser?.role === 'admin';

  useEffect(() => {
    if (isAdmin) {
      fetchAllAdminData();
      voiceAssistant.speak(t.page7.voiceGuidance, 'page7_admin');
    }
  }, [isAdmin, language]);

  const fetchAllAdminData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Users
      const uRes = await fetch('/api/auth/admin/users');
      const uData = await uRes.json();
      if (uData.success) {
        setUsersList(uData.users || []);
        if (uData.mongoStatus) setMongoInfo(uData.mongoStatus);
      }

      // 2. Fetch Screenings
      const sRes = await fetch('/api/screening/admin/all');
      const sData = await sRes.json();
      if (sData.success) setScreeningsList(sData.screenings || []);

      // 3. Fetch Orders
      const oRes = await fetch('/api/medicines/admin/all');
      const oData = await oRes.json();
      if (oData.success) setOrdersList(oData.orders || []);

      // 4. Fetch Voice Logs
      const vRes = await fetch('/api/history/admin/voice-logs');
      const vData = await vRes.json();
      if (vData.success) setVoiceLogsList(vData.logs || []);
    } catch (e) {
      console.error('Admin data fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  const showNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3000);
  };

  // --- USER ACTIONS ---
  const handleSaveUser = async () => {
    if (!editingUser) return;
    try {
      const res = await fetch(`/api/auth/admin/users/${editingUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingUser),
      });
      const data = await res.json();
      if (data.success) {
        setUsersList((prev) =>
          prev.map((u) => (u.id === editingUser.id ? editingUser : u))
        );
        setEditingUser(null);
        showNotice('User record updated in MongoDB successfully!');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user from the database?')) return;
    try {
      const res = await fetch(`/api/auth/admin/users/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setUsersList((prev) => prev.filter((u) => u.id !== id));
        showNotice('User deleted from MongoDB.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // --- SCREENING ACTIONS ---
  const handleSaveScreening = async () => {
    if (!editingScreening) return;
    try {
      const res = await fetch(`/api/screening/admin/${editingScreening.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingScreening),
      });
      const data = await res.json();
      if (data.success) {
        setScreeningsList((prev) =>
          prev.map((s) => (s.id === editingScreening.id ? editingScreening : s))
        );
        setEditingScreening(null);
        showNotice('Screening record updated in MongoDB.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteScreening = async (id: string) => {
    if (!confirm('Delete this screening diagnosis record from MongoDB?')) return;
    try {
      const res = await fetch(`/api/screening/admin/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setScreeningsList((prev) => prev.filter((s) => s.id !== id));
        showNotice('Screening record deleted from database.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // --- ORDER ACTIONS ---
  const handleSaveOrder = async () => {
    if (!editingOrder) return;
    try {
      const res = await fetch(`/api/medicines/admin/${editingOrder.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingOrder),
      });
      const data = await res.json();
      if (data.success) {
        setOrdersList((prev) =>
          prev.map((o) => (o.id === editingOrder.id ? editingOrder : o))
        );
        setEditingOrder(null);
        showNotice('Medicine order status updated in MongoDB.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteOrder = async (id: string) => {
    if (!confirm('Delete this medicine order from database?')) return;
    try {
      const res = await fetch(`/api/medicines/admin/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setOrdersList((prev) => prev.filter((o) => o.id !== id));
        showNotice('Order record removed from database.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // --- VOICE LOG ACTIONS ---
  const handleSaveVoiceLog = async () => {
    if (!editingVoiceLog) return;
    try {
      const res = await fetch(`/api/history/admin/voice-logs/${editingVoiceLog.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingVoiceLog),
      });
      const data = await res.json();
      if (data.success) {
        setVoiceLogsList((prev) =>
          prev.map((v) => (v.id === editingVoiceLog.id ? editingVoiceLog : v))
        );
        setEditingVoiceLog(null);
        showNotice('Voice dialogue record updated in MongoDB.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteVoiceLog = async (id: string) => {
    if (!confirm('Delete this voice communication record?')) return;
    try {
      const res = await fetch(`/api/history/admin/voice-logs/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setVoiceLogsList((prev) => prev.filter((v) => v.id !== id));
        showNotice('Voice communication log deleted.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // If user is not admin, show restricted screen
  if (!isAdmin) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-3xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4 border border-rose-300">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Restricted Administrator Access
        </h2>
        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
          This control center is strictly protected. Only authorized administrators with verified credentials can inspect or modify database records.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* Header with MongoDB Database Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
              Admin Exclusive
            </span>
            <span className="text-xs font-mono text-slate-400">
              User: {currentUser?.phone}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            {t.page7.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {t.page7.subtitle}
          </p>
        </div>

        {/* MongoDB Connection Status Pill */}
        <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <Database className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-bold text-slate-900">
                MongoDB Active
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono block truncate max-w-xs">
              {mongoInfo.url}
            </span>
          </div>
          <button
            onClick={fetchAllAdminData}
            title="Refresh database collections"
            className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-slate-100 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Action Notification Toast */}
      {actionNotice && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Registered Users</span>
          <span className="text-2xl font-black text-slate-900 block mt-1">
            {usersList.length}
          </span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Clinical Screenings</span>
          <span className="text-2xl font-black text-emerald-700 block mt-1">
            {screeningsList.length}
          </span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Medicine Orders</span>
          <span className="text-2xl font-black text-cyan-700 block mt-1">
            {ordersList.length}
          </span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Voice Interaction Logs</span>
          <span className="text-2xl font-black text-rose-700 block mt-1">
            {voiceLogsList.length}
          </span>
        </div>
      </div>

      {/* 4 Tabs Selector */}
      <div className="flex overflow-x-auto space-x-2 p-1.5 bg-slate-100 rounded-2xl mb-8 no-scrollbar">
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'users'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4 text-emerald-600" />
          <span>{t.page7.tabUsers} ({usersList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('screenings')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'screenings'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Activity className="w-4 h-4 text-emerald-600" />
          <span>{t.page7.tabScreenings} ({screeningsList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'orders'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShoppingBag className="w-4 h-4 text-cyan-600" />
          <span>{t.page7.tabOrders} ({ordersList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('voice')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'voice'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <MessageSquare className="w-4 h-4 text-rose-600" />
          <span>{t.page7.tabVoice} ({voiceLogsList.length})</span>
        </button>
      </div>

      {/* TAB 1: USERS MANAGEMENT (EDIT & DELETE) */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200">
          <h3 className="text-base font-bold text-slate-900 mb-4">
            Patient & User Accounts (MongoDB Collection: `users`)
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-3">User ID</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Registered</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {usersList.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 font-mono text-slate-500">{u.id}</td>
                    <td className="p-3 font-bold text-slate-900">{u.name}</td>
                    <td className="p-3 font-mono">{u.phone}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        u.role === 'admin'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3 text-slate-600 truncate max-w-xs">
                      {u.location?.city || u.location?.address || 'N/A'}
                    </td>
                    <td className="p-3 text-slate-400 font-mono text-[11px]">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-right space-x-1.5">
                      <button
                        onClick={() => setEditingUser({ ...u })}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] inline-flex items-center space-x-1 cursor-pointer"
                      >
                        <Edit className="w-3 h-3 text-emerald-600" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[11px] inline-flex items-center space-x-1 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3 text-rose-600" />
                        <span>Delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: SCREENINGS MANAGEMENT (EDIT & DELETE) */}
      {activeTab === 'screenings' && (
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200">
          <h3 className="text-base font-bold text-slate-900 mb-4">
            Patient Screened Findings (MongoDB Collection: `screenings`)
          </h3>

          <div className="space-y-4">
            {screeningsList.map((scr) => (
              <div
                key={scr.id}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs text-slate-400 font-bold">{scr.id}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 capitalize">
                      {scr.category}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700">
                      Severity: {scr.severity}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mt-1">
                    {scr.conditionName}
                  </h4>
                  <p className="text-xs text-slate-600 line-clamp-2 mt-1">
                    {scr.clinicalSummary}
                  </p>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => setEditingScreening({ ...scr })}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center space-x-1 cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteScreening(scr.id)}
                    className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold flex items-center space-x-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: MEDICINE ORDERS (EDIT & DELETE) */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200">
          <h3 className="text-base font-bold text-slate-900 mb-4">
            Patient Medicine Orders (MongoDB Collection: `orders`)
          </h3>

          <div className="space-y-4">
            {ordersList.map((ord) => (
              <div
                key={ord.id}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-emerald-800">{ord.id}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-100 text-cyan-800">
                      {ord.status}
                    </span>
                    <span className="text-xs font-bold text-slate-900">₹{ord.totalAmountInr}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    Delivery: {ord.deliveryAddress} • Phone: {ord.contactPhone}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Items: {ord.items.map((i) => `${i.medicine.name} (x${i.quantity})`).join(', ')}
                  </p>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => setEditingOrder({ ...ord })}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center space-x-1 cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5 text-cyan-600" />
                    <span>Edit Status</span>
                  </button>
                  <button
                    onClick={() => handleDeleteOrder(ord.id)}
                    className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold flex items-center space-x-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: VOICE INTERACTION LOGS (EDIT & DELETE) */}
      {activeTab === 'voice' && (
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200">
          <h3 className="text-base font-bold text-slate-900 mb-4">
            Patient Voice Communications (MongoDB Collection: `voice_logs`)
          </h3>

          <div className="space-y-3">
            {voiceLogsList.map((log) => (
              <div
                key={log.id}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 flex items-start justify-between gap-4"
              >
                <div>
                  <div className="flex items-center space-x-2 text-[10px] font-mono text-slate-500 mb-1">
                    <span className="font-bold text-slate-800 capitalize">
                      {log.speaker === 'assistant' ? 'AI Voice Assistant' : 'User Speech'}
                    </span>
                    <span>•</span>
                    <span className="uppercase">{log.language}</span>
                    <span>•</span>
                    <span>{log.pageContext}</span>
                    <span>•</span>
                    <span>{new Date(log.timestamp).toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-slate-800 font-sans">"{log.text}"</p>
                </div>

                <div className="flex items-center space-x-1 shrink-0">
                  <button
                    onClick={() => setEditingVoiceLog({ ...log })}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-slate-200 transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteVoiceLog(log.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* EDIT MODAL: USER */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">Edit User Profile in MongoDB</h3>
              <button onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Name</label>
              <input
                type="text"
                value={editingUser.name}
                onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Phone</label>
              <input
                type="text"
                value={editingUser.phone}
                onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Role</label>
              <select
                value={editingUser.role}
                onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as any })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
              >
                <option value="user">User</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
            <div className="flex space-x-2 pt-2">
              <button
                onClick={handleSaveUser}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
              >
                Save to MongoDB
              </button>
              <button
                onClick={() => setEditingUser(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL: SCREENING */}
      {editingScreening && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">Edit Screening Record</h3>
              <button onClick={() => setEditingScreening(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Condition Name</label>
              <input
                type="text"
                value={editingScreening.conditionName}
                onChange={(e) => setEditingScreening({ ...editingScreening, conditionName: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Severity</label>
              <select
                value={editingScreening.severity}
                onChange={(e) => setEditingScreening({ ...editingScreening, severity: e.target.value as any })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
              >
                <option value="mild">Mild</option>
                <option value="moderate">Moderate</option>
                <option value="attention_needed">Attention Needed</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Confidence Score (%)</label>
              <input
                type="number"
                value={editingScreening.confidenceScore}
                onChange={(e) => setEditingScreening({ ...editingScreening, confidenceScore: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Clinical Notes</label>
              <textarea
                rows={3}
                value={editingScreening.clinicalSummary}
                onChange={(e) => setEditingScreening({ ...editingScreening, clinicalSummary: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
              />
            </div>
            <div className="flex space-x-2 pt-2">
              <button
                onClick={handleSaveScreening}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
              >
                Save to Database
              </button>
              <button
                onClick={() => setEditingScreening(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL: ORDER */}
      {editingOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">Update Order & Tracking</h3>
              <button onClick={() => setEditingOrder(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Order Status</label>
              <select
                value={editingOrder.status}
                onChange={(e) => setEditingOrder({ ...editingOrder, status: e.target.value as any })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
              >
                <option value="Confirmed">Confirmed</option>
                <option value="Processing">Processing</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Delivery Address</label>
              <textarea
                rows={2}
                value={editingOrder.deliveryAddress}
                onChange={(e) => setEditingOrder({ ...editingOrder, deliveryAddress: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
              />
            </div>
            <div className="flex space-x-2 pt-2">
              <button
                onClick={handleSaveOrder}
                className="flex-1 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs"
              >
                Save Order Changes
              </button>
              <button
                onClick={() => setEditingOrder(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL: VOICE LOG */}
      {editingVoiceLog && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">Edit Voice Transcript</h3>
              <button onClick={() => setEditingVoiceLog(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Transcript Content</label>
              <textarea
                rows={4}
                value={editingVoiceLog.text}
                onChange={(e) => setEditingVoiceLog({ ...editingVoiceLog, text: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
              />
            </div>
            <div className="flex space-x-2 pt-2">
              <button
                onClick={handleSaveVoiceLog}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
              >
                Update Transcript
              </button>
              <button
                onClick={() => setEditingVoiceLog(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
