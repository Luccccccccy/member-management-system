import { useState, useMemo } from 'react';
import { findDuplicateGroups } from '../utils/duplicates';

// ─── Icons ────────────────────────────────────────────────────────────────────

function LineIcon({ active }) {
  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${active ? 'bg-[#06C755]' : 'bg-gray-200'}`}>
      <svg width="17" height="17" viewBox="0 0 24 24" fill={active ? 'white' : '#9ca3af'}>
        <path d="M12 2C6.477 2 2 6.065 2 11.1c0 2.647 1.168 5.023 3.04 6.727.126.112.204.27.204.44 0 .09-.013.178-.04.263l-.394 1.475c-.11.412.192.812.618.812.09 0 .18-.02.264-.06l1.74-.812a.82.82 0 01.364-.086c.09 0 .18.013.266.038C8.825 20.226 10.385 20.5 12 20.5c5.523 0 10-4.065 10-9.1S17.523 2 12 2z" />
      </svg>
    </div>
  );
}

function BindingIcon({ status }) {
  if (status === 'linked') {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#06C755" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
      </svg>
    );
  }
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
      <line x1="2" y1="2" x2="22" y2="22" />
    </svg>
  );
}

function FilterButton({ label, icon }) {
  return (
    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors font-medium shadow-sm">
      {icon && <span className="text-gray-400">{icon}</span>}
      {label}
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 ml-0.5">
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </button>
  );
}

// ─── Add Member Modal ─────────────────────────────────────────────────────────

const EMPTY_FORM = {
  name: '', gender: '女', birthday: '', phone: '',
  idNumber: '', medicalRecordNumber: '', passportNumber: '',
  lineId: '', hisId: '', note: '',
};

function AddMemberModal({ onClose, onConfirm }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  function set(key, val) {
    setForm(prev => ({ ...prev, [key]: val }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: '' }));
  }

  function validate() {
    const errs = {};
    if (!form.name.trim()) errs.name = '姓名為必填欄位';
    return errs;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onConfirm({
      name: form.name.trim(),
      gender: form.gender,
      birthday: form.birthday.trim(),
      phone: form.phone.trim(),
      idNumber: form.idNumber.trim(),
      medicalRecordNumber: form.medicalRecordNumber.trim(),
      passportNumber: form.passportNumber.trim(),
      lineId: form.lineId.trim() || form.name.trim(),
      hisId: form.hisId.trim() || form.name.trim(),
      note: form.note.trim() || '-',
    });
    onClose();
  }

  const fields = [
    { key: 'name',                label: '姓名',        required: true,  placeholder: '請輸入姓名' },
    { key: 'birthday',            label: '生日',        required: false, placeholder: 'YYYY/MM/DD' },
    { key: 'phone',               label: '手機',        required: false, placeholder: '09xxxxxxxx' },
    { key: 'idNumber',            label: '身份證/居留證號', required: false, placeholder: 'A123456789' },
    { key: 'medicalRecordNumber', label: '病歷編號',    required: false, placeholder: 'MRxxxxxxxx' },
    { key: 'passportNumber',      label: '護照號碼',    required: false, placeholder: 'AB1234567' },
    { key: 'lineId',              label: 'LINE 名稱',   required: false, placeholder: '同姓名（選填）' },
    { key: 'hisId',               label: 'HIS 名稱',    required: false, placeholder: '同姓名（選填）' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">新增會員</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5 max-h-[65vh] overflow-y-auto">
            {/* Gender row (full width) */}
            <div className="mb-4">
              <label className="block text-xs text-gray-500 mb-1.5 font-medium">性別</label>
              <div className="flex gap-3">
                {['女', '男'].map(g => (
                  <label key={g} className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all text-sm ${
                    form.gender === g
                      ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="gender"
                      value={g}
                      checked={form.gender === g}
                      onChange={() => set('gender', g)}
                      className="sr-only"
                    />
                    {g}
                  </label>
                ))}
              </div>
            </div>

            {/* 2-column grid */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              {fields.map(({ key, label, required, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs text-gray-500 mb-1.5 font-medium">
                    {label}
                    {required && <span className="text-red-500 ml-0.5">*</span>}
                  </label>
                  <input
                    type="text"
                    value={form[key]}
                    onChange={e => set(key, e.target.value)}
                    placeholder={placeholder}
                    className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors ${
                      errors[key] ? 'border-red-400 bg-red-50' : 'border-gray-200'
                    }`}
                  />
                  {errors[key] && (
                    <p className="text-xs text-red-500 mt-1">{errors[key]}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Note – full width */}
            <div className="mt-3">
              <label className="block text-xs text-gray-500 mb-1.5 font-medium">會員備註</label>
              <textarea
                value={form.note}
                onChange={e => set('note', e.target.value)}
                placeholder="選填備註內容..."
                rows={2}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-100 bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              新增會員
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function MemberList({ members, onSelectMember, onGoMerge, onAddMember }) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifDismissed, setNotifDismissed] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Recompute duplicate groups whenever members change
  const duplicateGroups = useMemo(() => findDuplicateGroups(members), [members]);

  const filtered = members.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.phone.includes(search)
  );
  const totalPages = Math.ceil(filtered.length / pageSize);
  const displayMembers = filtered.slice((page - 1) * pageSize, page * pageSize);

  const toggleSelect = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };
  const toggleAll = () => {
    if (selected.length === displayMembers.length) setSelected([]);
    else setSelected(displayMembers.map(m => m.id));
  };

  const pages = [];
  for (let i = 1; i <= Math.min(5, totalPages); i++) pages.push(i);

  return (
    <div className="min-h-screen bg-[#f5f6fa] p-6">
      {/* Add Member Modal */}
      {showAddModal && (
        <AddMemberModal
          onClose={() => setShowAddModal(false)}
          onConfirm={(data) => { onAddMember(data); setPage(1); }}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold text-gray-900">會員</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="姓名、手機搜尋"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm bg-white w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(o => !o)}
              onBlur={() => setTimeout(() => setDropdownOpen(false), 150)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
              新增
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9" /></svg>
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-40 bg-white border border-gray-100 rounded-xl shadow-lg z-50 overflow-hidden">
                <button
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  onMouseDown={e => e.preventDefault()}
                  onClick={() => { setDropdownOpen(false); setShowAddModal(true); }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                  新增會員
                </button>
                <button
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  onMouseDown={e => e.preventDefault()}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  匯入會員名單
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Duplicate member notification */}
      {duplicateGroups.length > 0 && !notifDismissed && (
        <div className="mb-4 flex items-center gap-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          <div className="flex-shrink-0 w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-amber-900">
              發現 {duplicateGroups.length} 組可能重複的會員
            </p>
            <p className="text-xs text-amber-700 mt-0.5">
              系統依姓名、身份證號、手機、生日等欄位偵測到疑似重複資料，建議進行合併整理
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setNotifDismissed(true)}
              className="text-xs text-amber-600 hover:text-amber-800 px-2 py-1 rounded hover:bg-amber-100 transition-colors"
            >
              略過
            </button>
            <button
              onClick={onGoMerge}
              className="flex items-center gap-1.5 text-xs font-semibold bg-amber-500 text-white px-3 py-1.5 rounded-lg hover:bg-amber-600 transition-colors shadow-sm"
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 00-3-3.87"/>
                <path d="M16 3.13a4 4 0 010 7.75"/>
              </svg>
              查看並合併
            </button>
          </div>
        </div>
      )}

      {/* Filter bar */}
      <div className="flex items-center gap-2 mb-4">
        <FilterButton label="綁定狀態" icon={
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /></svg>
        } />
        <FilterButton label="發送管道" icon={
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13" /><path d="M22 2L15 22 11 13 2 9l20-7z" /></svg>
        } />
        <FilterButton label="個案追蹤" icon={
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
        } />
        <FilterButton label="標籤" icon={
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" /></svg>
        } />
        <FilterButton label="來源" icon={
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
        } />
        <div className="ml-auto">
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 shadow-sm">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="3" y1="15" x2="21" y2="15" /><line x1="9" y1="3" x2="9" y2="21" /><line x1="15" y1="3" x2="15" y2="21" /></svg>
            欄位
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selected.length === displayMembers.length && displayMembers.length > 0}
                    onChange={toggleAll}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 accent-blue-600 cursor-pointer"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider min-w-[140px]">
                  <span className="flex items-center gap-1 cursor-pointer hover:text-gray-700">
                    姓名
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 5 5 12" /></svg>
                  </span>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <span className="flex items-center gap-1">綁定狀態</span>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <span className="flex items-center gap-1">發送管道</span>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider min-w-[160px]">
                  <span className="flex items-center gap-1 cursor-pointer hover:text-gray-700">
                    標籤
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 5 5 12" /></svg>
                  </span>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider min-w-[200px]">個案追蹤</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider min-w-[200px]">單發訊息</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <span className="flex items-center gap-1 cursor-pointer hover:text-gray-700">
                    手機
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 5 5 12" /></svg>
                  </span>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <span className="flex items-center gap-1 cursor-pointer hover:text-gray-700">
                    生日
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 5 5 12" /></svg>
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {displayMembers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-sm text-gray-400">
                    找不到符合的會員
                  </td>
                </tr>
              ) : displayMembers.map(member => (
                <tr
                  key={member.id}
                  className="hover:bg-blue-50/40 transition-colors cursor-pointer group"
                  onClick={() => onSelectMember(member)}
                >
                  <td className="px-4 py-4" onClick={e => { e.stopPropagation(); toggleSelect(member.id); }}>
                    <input
                      type="checkbox"
                      checked={selected.includes(member.id)}
                      onChange={() => toggleSelect(member.id)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 accent-blue-600 cursor-pointer"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {member.name}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <BindingIcon status={member.bindingStatus} />
                  </td>
                  <td className="px-4 py-4">
                    <LineIcon active={member.channelActive} />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1 flex-wrap">
                      {member.tags.map(tag => (
                        <span key={tag} className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">{tag}</span>
                      ))}
                      <button
                        onClick={e => e.stopPropagation()}
                        className="w-6 h-6 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:border-blue-400 hover:text-blue-400 transition-colors"
                      >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1">
                      {member.caseTracking.map(t => (
                        <span key={t} className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">{t}</span>
                      ))}
                      <button
                        onClick={e => e.stopPropagation()}
                        className="w-6 h-6 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:border-purple-400 hover:text-purple-400 transition-colors"
                      >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                      <input
                        type="text"
                        placeholder="在此填寫單筆發送的訊息"
                        className="text-xs text-gray-400 bg-transparent focus:outline-none w-40 placeholder:text-gray-300"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-gray-700">{member.phone}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-gray-700">{member.birthday}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-white">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>單頁顯示數量</span>
            <select
              value={pageSize}
              onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}
              className="font-bold bg-transparent border-none focus:outline-none cursor-pointer"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
          </div>
          <div className="text-sm text-gray-500">
            第 {filtered.length === 0 ? 0 : (page - 1) * pageSize + 1} – {Math.min(page * pageSize, filtered.length)} 筆，共 {filtered.length.toLocaleString()} 筆
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-8 h-8 rounded flex items-center justify-center text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
            </button>
            {pages.map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 rounded text-sm font-medium transition-colors ${page === p ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                {p}
              </button>
            ))}
            {totalPages > 5 && <span className="text-gray-400 px-1">...</span>}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || totalPages === 0}
              className="w-8 h-8 rounded flex items-center justify-center text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
