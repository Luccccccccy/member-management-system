import { useState, useEffect } from 'react';

function LineIcon({ active }) {
  return (
    <div className={`w-9 h-9 rounded-full flex items-center justify-center ${active ? 'bg-[#06C755]' : 'bg-gray-200'}`}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill={active ? 'white' : '#9ca3af'}>
        <path d="M12 2C6.477 2 2 6.065 2 11.1c0 2.647 1.168 5.023 3.04 6.727.126.112.204.27.204.44 0 .09-.013.178-.04.263l-.394 1.475c-.11.412.192.812.618.812.09 0 .18-.02.264-.06l1.74-.812a.82.82 0 01.364-.086c.09 0 .18.013.266.038C8.825 20.226 10.385 20.5 12 20.5c5.523 0 10-4.065 10-9.1S17.523 2 12 2z" />
      </svg>
    </div>
  );
}

function LinkIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#06C755' : '#9ca3af'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
      {!active && <line x1="2" y1="2" x2="22" y2="22" />}
    </svg>
  );
}

const NAV_ITEMS = [
  { key: 'overview', label: '總覽' },
  { key: 'treatment', label: '療程足跡' },
  { key: 'caseTracking', label: '個案追蹤', count: 0 },
  { key: 'questionnaire', label: '問卷', count: 0 },
  { key: 'labReport', label: '檢驗報告', count: 0 },
  { key: 'mergeRecord', label: '會員合併紀錄' },
];

function TagSection({ title, tags, onAdd }) {
  return (
    <div className="mb-4">
      <p className="text-xs text-gray-500 mb-1.5">{title}</p>
      <div className="flex items-center gap-2 flex-wrap">
        {tags.map(t => (
          <span key={t} className="flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded-full border border-gray-200">
            {t}
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="cursor-pointer hover:text-red-500">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </span>
        ))}
        <button
          onClick={onAdd}
          className="flex items-center gap-1 px-2.5 py-1 border border-dashed border-gray-300 text-gray-500 text-xs rounded-full hover:border-blue-400 hover:text-blue-500 transition-colors"
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          新增標籤
        </button>
      </div>
    </div>
  );
}

function InfoRow({ label, value, icon }) {
  return (
    <div className="py-3 border-b border-gray-50 last:border-0">
      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
      <div className="flex items-center gap-1.5">
        {icon && (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
        )}
        <p className="text-sm text-gray-800 font-medium">{value || '-'}</p>
      </div>
    </div>
  );
}

// ─── Delete Confirmation Modal ────────────────────────────────────────────────

function DeleteConfirmModal({ memberName, onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
        <div className="px-6 py-6 text-center">
          <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
              <path d="M10 11v6"/>
              <path d="M14 11v6"/>
              <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
            </svg>
          </div>
          <h3 className="text-base font-bold text-gray-900 mb-2">確認刪除會員</h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            確定要刪除會員「<span className="font-semibold text-gray-800">{memberName}</span>」？<br />
            此操作無法復原。
          </p>
        </div>
        <div className="flex items-center gap-2 px-6 pb-5">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600 transition-colors"
          >
            確認刪除
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function MemberDetail({ member, onBack, onUpdate, onDelete }) {
  const [activeNav, setActiveNav] = useState('overview');
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({ ...member });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Sync editData when member prop changes (e.g. after save propagates back)
  useEffect(() => {
    setEditData({ ...member });
  }, [member]);

  const handleSave = () => {
    onUpdate(member.id, editData);
    setEditMode(false);
  };

  const handleCancel = () => {
    setEditMode(false);
    setEditData({ ...member });
  };

  const editFields = [
    { key: 'name',                label: '自定義姓名' },
    { key: 'lineId',              label: 'LINE 名稱' },
    { key: 'hisId',               label: 'HIS 名稱' },
    { key: 'gender',              label: '性別' },
    { key: 'birthday',            label: '生日' },
    { key: 'phone',               label: '手機' },
    { key: 'idNumber',            label: '身份證/居留證號' },
    { key: 'medicalRecordNumber', label: '病歷編號' },
    { key: 'passportNumber',      label: '護照號碼' },
    { key: 'note',                label: '會員備註' },
  ];

  return (
    <div className="min-h-screen bg-[#f5f6fa]">
      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <DeleteConfirmModal
          memberName={member.name}
          onCancel={() => setShowDeleteConfirm(false)}
          onConfirm={() => onDelete(member.id)}
        />
      )}

      {/* Top bar */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-gray-500 hover:text-gray-800 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </button>
          <h1 className="text-lg font-bold text-gray-900">會員資訊</h1>
        </div>
        {/* Delete button in top bar */}
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-red-200 text-red-500 rounded-lg text-sm hover:bg-red-50 transition-colors"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
            <path d="M10 11v6"/><path d="M14 11v6"/>
            <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
          </svg>
          刪除會員
        </button>
      </div>

      <div className="flex min-h-[calc(100vh-65px)]">
        {/* Left sidebar */}
        <div className="w-64 bg-white border-r border-gray-100 flex flex-col">
          {/* Profile card */}
          <div className="p-6 flex flex-col items-center border-b border-gray-100">
            <div className="relative mb-3">
              {member.avatar ? (
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-24 h-24 rounded-full object-cover border-2 border-gray-100 shadow"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center border-2 border-gray-100 shadow">
                  <span className="text-2xl font-bold text-blue-500">
                    {member.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 mb-2">
              <LinkIcon active={member.bindingStatus === 'linked'} />
              <LineIcon active={member.channelActive} />
            </div>
            <p className="font-bold text-gray-900 text-base">{member.name}</p>
            <p className="text-xs text-gray-400 mt-0.5">{member.memberNumber}</p>
          </div>

          {/* Nav menu */}
          <nav className="flex-1 py-2">
            {NAV_ITEMS.map(item => (
              <button
                key={item.key}
                onClick={() => setActiveNav(item.key)}
                className={`w-full flex items-center justify-between px-5 py-3 text-sm font-medium transition-colors ${
                  activeNav === item.key
                    ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                }`}
              >
                <span>{item.label}</span>
                {item.count !== undefined && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeNav === item.key ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                    {item.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1 p-6 overflow-auto">
          {activeNav === 'overview' && (
            <div className="flex flex-col gap-5">
              {/* Tags section */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <h2 className="text-base font-bold text-gray-900 mb-4">標籤</h2>
                <TagSection title="標籤" tags={member.tags} onAdd={() => {}} />
                <TagSection title="醫令" tags={[]} onAdd={() => {}} />
                <TagSection title="診斷碼" tags={[]} onAdd={() => {}} />
                <div>
                  <p className="text-xs text-gray-500 mb-1.5">個案追蹤</p>
                  <div className="flex items-center gap-2">
                    {member.caseTracking.map(t => (
                      <span key={t} className="px-2.5 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">{t}</span>
                    ))}
                    <button className="w-7 h-7 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:border-purple-400 hover:text-purple-400 transition-colors">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Member info section */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold text-gray-900">會員資訊</h2>
                  {!editMode ? (
                    <button
                      onClick={() => setEditMode(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                      編輯
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={handleCancel}
                        className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
                      >
                        取消
                      </button>
                      <button
                        onClick={handleSave}
                        className="px-3 py-1.5 bg-blue-600 rounded-lg text-sm text-white hover:bg-blue-700"
                      >
                        儲存
                      </button>
                    </div>
                  )}
                </div>

                {editMode ? (
                  <div className="grid grid-cols-2 gap-4">
                    {editFields.map(({ key, label }) => (
                      <div key={key}>
                        <label className="block text-xs text-gray-500 mb-1">{label}</label>
                        <input
                          type="text"
                          value={editData[key] || ''}
                          onChange={e => setEditData(prev => ({ ...prev, [key]: e.target.value }))}
                          className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div>
                    <InfoRow label="自定義姓名" value={member.name} />
                    <InfoRow label="LINE 名稱" value={member.lineId} icon />
                    <InfoRow label="HIS 名稱" value={member.hisId} icon />
                    <InfoRow label="性別" value={member.gender} />
                    <InfoRow label="生日" value={member.birthday} />
                    <InfoRow label="手機" value={member.phone} />
                    <div className="py-3 border-b border-gray-50">
                      <p className="text-xs text-gray-400 mb-0.5">識別號</p>
                      <p className="text-sm text-gray-800 font-medium">
                        <span className="text-gray-500 text-xs mr-2">身分/居留證號</span>
                        {member.idNumber || '-'}
                      </p>
                    </div>
                    <InfoRow label="病歷編號" value={member.medicalRecordNumber} />
                    <InfoRow label="護照號碼" value={member.passportNumber} />
                    <InfoRow label="會員備註" value={member.note} />
                    <div className="flex gap-8 pt-3">
                      <div>
                        <p className="text-xs text-gray-400 mb-0.5">新增日期</p>
                        <p className="text-sm text-gray-700">{member.createdAt}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-0.5">近期更新</p>
                        <p className="text-sm text-gray-700">{member.updatedAt}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeNav === 'treatment' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
              <svg className="mx-auto mb-3 text-gray-300" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
                <rect x="9" y="3" width="6" height="4" rx="2" />
              </svg>
              <p className="text-gray-400 text-sm">尚無療程足跡</p>
            </div>
          )}

          {activeNav === 'caseTracking' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
              <p className="text-gray-400 text-sm">尚無個案追蹤紀錄</p>
            </div>
          )}

          {activeNav === 'questionnaire' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
              <p className="text-gray-400 text-sm">尚無問卷紀錄</p>
            </div>
          )}

          {activeNav === 'labReport' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
              <p className="text-gray-400 text-sm">尚無檢驗報告</p>
            </div>
          )}

          {activeNav === 'mergeRecord' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
              <p className="text-gray-400 text-sm">尚無會員合併紀錄</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
