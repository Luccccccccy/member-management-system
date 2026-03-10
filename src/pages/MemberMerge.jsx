import { useState, useEffect } from 'react';
import { findDuplicateGroups } from '../utils/duplicates';

// ─── 合併欄位定義 ─────────────────────────────────────────────────────────────
const MERGE_FIELDS = [
  { key: 'name',                label: '姓名',            readonly: false },
  { key: 'idNumber',            label: '身份證/居留證號',  readonly: false },
  { key: 'bindingStatus',       label: '綁定狀態',         readonly: true  },
  { key: 'channelActive',       label: '發送管道',         readonly: true  },
  { key: 'phone',               label: '電話',             readonly: false },
  { key: 'birthday',            label: '生日',             readonly: false },
  { key: 'medicalRecordNumber', label: '病歷編號',         readonly: false },
  { key: 'memberNumber',        label: '會員編號',         readonly: true  },
  { key: 'passportNumber',      label: '護照號碼',         readonly: false },
  { key: 'tags',                label: '標籤',             readonly: false },
  { key: 'caseTracking',        label: '個案追蹤',         readonly: false },
  { key: 'note',                label: '會員備註',         readonly: false },
];

// ─── 欄位值顯示元件 ───────────────────────────────────────────────────────────
function FieldDisplay({ member, fieldKey }) {
  const val = member[fieldKey];

  if (fieldKey === 'bindingStatus') {
    return val === 'linked' ? (
      <div className="flex items-center gap-1.5">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#06C755" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
          <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
        </svg>
        <span className="text-xs text-green-600 font-medium">已綁定</span>
      </div>
    ) : (
      <div className="flex items-center gap-1.5">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
          <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
          <line x1="2" y1="2" x2="22" y2="22"/>
        </svg>
        <span className="text-xs text-gray-400">未綁定</span>
      </div>
    );
  }

  if (fieldKey === 'channelActive') {
    return val ? (
      <div className="flex items-center gap-1.5">
        <div className="w-6 h-6 rounded-full bg-[#06C755] flex items-center justify-center">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
            <path d="M12 2C6.477 2 2 6.065 2 11.1c0 2.647 1.168 5.023 3.04 6.727.126.112.204.27.204.44 0 .09-.013.178-.04.263l-.394 1.475c-.11.412.192.812.618.812.09 0 .18-.02.264-.06l1.74-.812a.82.82 0 01.364-.086c.09 0 .18.013.266.038C8.825 20.226 10.385 20.5 12 20.5c5.523 0 10-4.065 10-9.1S17.523 2 12 2z"/>
          </svg>
        </div>
        <span className="text-xs text-gray-700">LINE</span>
      </div>
    ) : <span className="text-gray-400 text-sm">-</span>;
  }

  if (fieldKey === 'tags' || fieldKey === 'caseTracking') {
    if (!val || val.length === 0) return <span className="text-gray-400 text-sm">-</span>;
    return (
      <div className="flex flex-wrap gap-1">
        {val.map(t => (
          <span key={t} className={`px-2 py-0.5 text-xs rounded-full ${
            fieldKey === 'tags' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
          }`}>{t}</span>
        ))}
      </div>
    );
  }

  return <span className={`text-sm ${val ? 'text-gray-800' : 'text-gray-400'}`}>{val || '-'}</span>;
}

// ─── 左側群組卡片 ─────────────────────────────────────────────────────────────
function GroupCard({ group, selected, status, onClick }) {
  const statusMap = {
    merged:  { label: '已合併', bg: 'bg-green-100', text: 'text-green-700' },
    skipped: { label: '已略過', bg: 'bg-gray-100',  text: 'text-gray-500'  },
  };
  const s = statusMap[status];

  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3.5 border-b border-gray-100 transition-all ${
        selected
          ? 'bg-blue-50 border-l-[3px] border-l-blue-600'
          : 'hover:bg-gray-50 border-l-[3px] border-l-transparent'
      } ${status ? 'opacity-60' : ''}`}
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <p className="text-sm font-semibold text-gray-900 leading-snug">
          {group.members.map(m => m.name).join(' & ')}
        </p>
        {s && (
          <span className={`flex-shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${s.bg} ${s.text}`}>
            {s.label}
          </span>
        )}
      </div>
      <p className="text-xs text-amber-600 mb-2">
        {group.matchReasons.join('、')}相同
      </p>
      <div className="flex items-center gap-1.5">
        {group.members.map(m => (
          <div key={m.id} className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-[9px] font-bold flex-shrink-0">
            {m.name.charAt(0)}
          </div>
        ))}
        <span className="text-xs text-gray-400">{group.members.length} 位會員</span>
      </div>
    </button>
  );
}

// ─── 比對面板 ─────────────────────────────────────────────────────────────────
function ComparisonPanel({ group, allMembers, onMerge, onSkip }) {
  const [compMembers, setCompMembers] = useState(group.members);
  const [primaryId, setPrimaryId] = useState(group.members[0].id);
  const [choices, setChoices] = useState(() => {
    const init = {};
    MERGE_FIELDS.filter(f => !f.readonly).forEach(f => { init[f.key] = group.members[0].id; });
    return init;
  });
  const [addSearchQuery, setAddSearchQuery] = useState('');

  // 切換群組時重置
  useEffect(() => {
    setCompMembers(group.members);
    setPrimaryId(group.members[0].id);
    const init = {};
    MERGE_FIELDS.filter(f => !f.readonly).forEach(f => { init[f.key] = group.members[0].id; });
    setChoices(init);
    setAddSearchQuery('');
  }, [group.id]);

  // 新增比對會員的搜尋結果
  const addSearchResults = addSearchQuery
    ? allMembers.filter(m =>
        !compMembers.find(cm => cm.id === m.id) &&
        (m.name.toLowerCase().includes(addSearchQuery.toLowerCase()) || m.phone.includes(addSearchQuery))
      ).slice(0, 5)
    : [];

  function addMember(m) {
    setCompMembers(prev => [...prev, m]);
    setAddSearchQuery('');
  }

  function removeMember(id) {
    const updated = compMembers.filter(m => m.id !== id);
    setCompMembers(updated);
    if (primaryId === id) {
      setPrimaryId(updated[0]?.id);
      const newPrimary = updated[0]?.id;
      setChoices(prev => {
        const next = { ...prev };
        MERGE_FIELDS.filter(f => !f.readonly).forEach(f => {
          if (next[f.key] === id) next[f.key] = newPrimary;
        });
        return next;
      });
    } else {
      setChoices(prev => {
        const next = { ...prev };
        MERGE_FIELDS.filter(f => !f.readonly).forEach(f => {
          if (next[f.key] === id) next[f.key] = updated[0]?.id;
        });
        return next;
      });
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Sub-header */}
      <div className="px-6 py-4 border-b border-gray-100 bg-white">
        <h2 className="text-sm font-bold text-gray-900">比對會員資訊</h2>
        <p className="text-xs text-gray-500 mt-0.5">
          重複原因：<span className="text-amber-600 font-medium">{group.matchReasons.join('、')}相同</span>
        </p>
      </div>

      {/* Add comparison member search bar */}
      <div className="px-6 py-3 bg-white border-b border-gray-100">
        <div className="relative">
          <div className="flex items-center gap-2.5 px-3 py-2.5 border border-dashed border-gray-300 rounded-xl bg-gray-50/60 hover:border-blue-300 focus-within:border-blue-400 focus-within:border-solid focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            <input
              type="text"
              placeholder="新增比對會員：輸入姓名或手機搜尋..."
              value={addSearchQuery}
              onChange={e => setAddSearchQuery(e.target.value)}
              onBlur={() => setTimeout(() => setAddSearchQuery(''), 200)}
              className="flex-1 text-sm bg-transparent focus:outline-none text-gray-700 placeholder-gray-400 min-w-0"
            />
            {addSearchQuery && (
              <button
                onMouseDown={e => e.preventDefault()}
                onClick={() => setAddSearchQuery('')}
                className="text-gray-400 hover:text-gray-600 flex-shrink-0 transition-colors"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            )}
          </div>
          {/* Dropdown results */}
          {addSearchQuery && addSearchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-gray-100 rounded-xl shadow-xl z-30 overflow-hidden">
              {addSearchResults.map(m => (
                <button
                  key={m.id}
                  onMouseDown={e => e.preventDefault()}
                  onClick={() => addMember(m)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors text-left border-b border-gray-50 last:border-0"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center text-blue-600 text-xs font-bold flex-shrink-0">
                    {m.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{m.name}</p>
                    <p className="text-xs text-gray-400 truncate">{m.phone} · {m.birthday}</p>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                </button>
              ))}
            </div>
          )}
          {addSearchQuery && addSearchResults.length === 0 && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-gray-100 rounded-xl shadow-md z-30 px-4 py-4 text-center">
              <p className="text-sm text-gray-400">找不到符合的會員</p>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto p-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-100 bg-gray-50">
                  {/* Field label column */}
                  <th className="w-40 min-w-[160px] px-5 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider sticky left-0 bg-gray-50 border-r border-gray-100 z-10">
                    欄位
                  </th>
                  {/* Member columns */}
                  {compMembers.map((member) => (
                    <th key={member.id} className={`min-w-[220px] px-5 py-4 border-l border-gray-100 ${primaryId === member.id ? 'bg-blue-50' : 'bg-gray-50'}`}>
                      <div className="flex flex-col items-center gap-2">
                        {/* Avatar */}
                        {member.avatar ? (
                          <img src={member.avatar} alt={member.name} className="w-11 h-11 rounded-full object-cover border-2 border-white shadow"/>
                        ) : (
                          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center text-blue-600 font-bold text-base border-2 border-white shadow">
                            {member.name.charAt(0)}
                          </div>
                        )}
                        <div className="text-center">
                          <p className="text-sm font-semibold text-gray-900 leading-tight">{member.name}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{member.memberNumber}</p>
                        </div>
                        {/* Primary radio — FIX: also sync choices.name */}
                        <label className={`flex items-center gap-1.5 cursor-pointer px-2.5 py-1 rounded-full border transition-all text-xs font-medium ${
                          primaryId === member.id
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'border-gray-200 text-gray-500 hover:border-blue-400 hover:text-blue-500'
                        }`}>
                          <input
                            type="radio"
                            name="primaryMember"
                            value={member.id}
                            checked={primaryId === member.id}
                            onChange={() => {
                              setPrimaryId(member.id);
                              setChoices(prev => ({ ...prev, name: member.id }));
                            }}
                            className="sr-only"
                          />
                          {primaryId === member.id ? '✓ 主要會員' : '設為主要'}
                        </label>
                        {/* Remove button (only if 3+ members) */}
                        {compMembers.length > 2 && (
                          <button
                            onClick={() => removeMember(member.id)}
                            className="text-xs text-red-400 hover:text-red-600 transition-colors flex items-center gap-0.5"
                          >
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                            </svg>
                            移除
                          </button>
                        )}
                      </div>
                    </th>
                  ))}

                </tr>
              </thead>

              <tbody>
                {MERGE_FIELDS.map(field => (
                  <tr
                    key={field.key}
                    className={`border-b border-gray-50 last:border-0 ${field.readonly ? 'bg-gray-50/60' : ''}`}
                  >
                    {/* Field label */}
                    <td className={`px-5 py-3.5 sticky left-0 border-r border-gray-100 z-10 ${field.readonly ? 'bg-gray-50/80' : 'bg-white'}`}>
                      <div className="flex items-center gap-2">
                        {field.readonly ? (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                            <path d="M7 11V7a5 5 0 0110 0v4"/>
                          </svg>
                        ) : (
                          <div className="w-3 h-3"/>
                        )}
                        <span className={`text-sm font-medium ${field.readonly ? 'text-gray-400' : 'text-gray-700'}`}>
                          {field.label}
                        </span>
                      </div>
                      {field.readonly && (
                        <p className="text-[10px] text-gray-400 ml-5 mt-0.5">跟隨主要會員</p>
                      )}
                    </td>

                    {/* Member cells */}
                    {compMembers.map(member => {
                      const isSelected = field.readonly
                        ? member.id === primaryId
                        : choices[field.key] === member.id;

                      return (
                        <td
                          key={member.id}
                          className={`px-5 py-3.5 border-l border-gray-100 transition-colors ${
                            isSelected
                              ? field.readonly ? 'bg-blue-50' : 'bg-blue-50 ring-1 ring-inset ring-blue-200'
                              : field.readonly ? 'bg-gray-50/40' : ''
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            {!field.readonly && (
                              <label className="cursor-pointer flex-shrink-0">
                                <input
                                  type="radio"
                                  name={`field-${field.key}`}
                                  value={member.id}
                                  checked={choices[field.key] === member.id}
                                  onChange={() => {
                                    setChoices(prev => ({ ...prev, [field.key]: member.id }));
                                    // 姓名 and primary are two-way bound
                                    if (field.key === 'name') setPrimaryId(member.id);
                                  }}
                                  className="w-4 h-4 accent-blue-600"
                                />
                              </label>
                            )}
                            <div className={`flex-1 min-w-0 ${field.readonly && !isSelected ? 'opacity-50' : ''}`}>
                              <FieldDisplay member={member} fieldKey={field.key}/>
                            </div>
                          </div>
                        </td>
                      );
                    })}

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Action bar */}
          <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-100">
            <div className="text-xs text-gray-500">
              主要會員：<span className="font-semibold text-gray-800">
                {compMembers.find(m => m.id === primaryId)?.name}
              </span>
              ，合併後保留其綁定狀態、發送管道與會員編號
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onSkip}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors"
              >
                略過此組
              </button>
              <button
                onClick={() => onMerge(primaryId, choices, compMembers)}
                className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                確認合併
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── 主頁面 ───────────────────────────────────────────────────────────────────
export default function MemberMerge({ members, onBack, onMerge, initialMemberIds }) {
  // Snapshot groups at mount time so resolved items remain visible in sidebar
  const [allGroups] = useState(() => {
    const detected = findDuplicateGroups(members);
    // If caller passed specific member IDs (from list multi-select), inject a manual group
    if (initialMemberIds && initialMemberIds.length >= 2) {
      const manualMembers = initialMemberIds
        .map(id => members.find(m => m.id === id))
        .filter(Boolean);
      if (manualMembers.length >= 2) {
        // Only inject if these members aren't already grouped together
        const alreadyCovered = detected.some(g =>
          manualMembers.every(m => g.members.some(gm => gm.id === m.id))
        );
        if (!alreadyCovered) {
          const manualGroup = {
            id: `manual-${[...initialMemberIds].sort().join('-')}`,
            members: manualMembers,
            matchReasons: ['手動選取'],
          };
          return [manualGroup, ...detected];
        }
      }
    }
    return detected;
  });

  // Auto-select first group; if initial IDs were passed, jump to their group
  const [selectedGroupId, setSelectedGroupId] = useState(() => {
    if (initialMemberIds && initialMemberIds.length >= 2) {
      const group = allGroups.find(g =>
        initialMemberIds.every(id => g.members.some(m => m.id === id))
      );
      if (group) return group.id;
    }
    return allGroups[0]?.id ?? null;
  });
  const [statuses, setStatuses] = useState({}); // groupId → 'merged' | 'skipped'
  const [toast, setToast] = useState(null);

  const pendingGroups  = allGroups.filter(g => !statuses[g.id]);
  const resolvedGroups = allGroups.filter(g => statuses[g.id]);
  const selectedGroup  = allGroups.find(g => g.id === selectedGroupId);

  function showToast(msg, type = 'success') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  function handleSelectGroup(group) {
    setSelectedGroupId(group.id);
  }

  function handleMerge(primaryId, choices, compMembers) {
    onMerge(primaryId, choices, compMembers);
    setStatuses(prev => ({ ...prev, [selectedGroupId]: 'merged' }));
    const count = compMembers.length;
    showToast(`✓ 已成功合併 ${count} 位會員`);
    // Auto-advance to next pending group
    const next = pendingGroups.find(g => g.id !== selectedGroupId);
    setSelectedGroupId(next?.id ?? null);
  }

  function handleSkip() {
    setStatuses(prev => ({ ...prev, [selectedGroupId]: 'skipped' }));
    const next = pendingGroups.find(g => g.id !== selectedGroupId);
    setSelectedGroupId(next?.id ?? null);
  }

  const allDone = pendingGroups.length === 0;

  return (
    <div className="min-h-screen bg-[#f5f6fa] flex flex-col">
      {/* Toast — FIX: centered at top instead of top-right */}
      {toast && (
        <div className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-5 py-3 rounded-xl shadow-xl text-white text-sm font-medium whitespace-nowrap transition-all ${
          toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        }`}>
          {toast.msg}
        </div>
      )}

      {/* Page header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-3 flex-shrink-0">
        <button
          onClick={onBack}
          className="p-1.5 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"/>
            <polyline points="12 19 5 12 12 5"/>
          </svg>
        </button>
        <h1 className="text-lg font-bold text-gray-900">可能重複的會員</h1>
        <div className="flex items-center gap-2 ml-1">
          {pendingGroups.length > 0 && (
            <span className="px-2.5 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">
              {pendingGroups.length} 組待確認
            </span>
          )}
          {resolvedGroups.length > 0 && (
            <span className="px-2.5 py-1 bg-gray-100 text-gray-500 text-xs font-medium rounded-full">
              已處理 {resolvedGroups.length} 組
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden" style={{ height: 'calc(100vh - 65px)' }}>
        {/* ── Left sidebar ── */}
        <div className="w-72 bg-white border-r border-gray-100 flex flex-col flex-shrink-0 overflow-y-auto">
          {allGroups.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <p className="text-sm font-semibold text-gray-700">未發現重複會員</p>
              <p className="text-xs text-gray-400 mt-1">所有會員資料均不重複</p>
            </div>
          ) : (
            <>
              {/* Pending groups */}
              {pendingGroups.length > 0 && (
                <div>
                  <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">待確認</p>
                  </div>
                  {pendingGroups.map(g => (
                    <GroupCard
                      key={g.id}
                      group={g}
                      selected={selectedGroupId === g.id}
                      status={null}
                      onClick={() => handleSelectGroup(g)}
                    />
                  ))}
                </div>
              )}

              {/* All done state */}
              {allDone && (
                <div className="p-6 text-center border-b border-gray-100">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-gray-700">全部處理完畢！</p>
                  <p className="text-xs text-gray-400 mt-1">所有重複組已完成確認</p>
                </div>
              )}

              {/* Resolved groups */}
              {resolvedGroups.length > 0 && (
                <div>
                  <div className="px-4 py-2.5 bg-gray-50 border-b border-t border-gray-100">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">已處理</p>
                  </div>
                  {resolvedGroups.map(g => (
                    <GroupCard
                      key={g.id}
                      group={g}
                      selected={selectedGroupId === g.id}
                      status={statuses[g.id]}
                      onClick={() => handleSelectGroup(g)}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* ── Right panel ── */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {!selectedGroup ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 00-3-3.87"/>
                  <path d="M16 3.13a4 4 0 010 7.75"/>
                </svg>
              </div>
              <p className="text-sm font-semibold text-gray-600">
                {allDone ? '所有重複會員已處理完畢' : '請從左側選擇一組重複會員'}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {allDone ? '點擊左側群組可查看詳情' : '點擊群組以開始比對並合併'}
              </p>
              {allDone && (
                <button
                  onClick={onBack}
                  className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  返回會員列表
                </button>
              )}
            </div>
          ) : (
            <ComparisonPanel
              key={selectedGroup.id}
              group={selectedGroup}
              allMembers={members}
              onMerge={handleMerge}
              onSkip={handleSkip}
            />
          )}
        </div>
      </div>
    </div>
  );
}
