import { useState } from 'react';
import { members as initialMembers } from './data/members';
import MemberList from './pages/MemberList';
import MemberDetail from './pages/MemberDetail';
import MemberMerge from './pages/MemberMerge';
import './App.css';
import './index.css';

function nowStr() {
  const d = new Date();
  const p = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}/${p(d.getMonth() + 1)}/${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

function App() {
  const [view, setView] = useState('list'); // 'list' | 'detail' | 'merge'
  const [selectedMemberId, setSelectedMemberId] = useState(null);
  const [members, setMembers] = useState(initialMembers);
  const [mergeInitialIds, setMergeInitialIds] = useState(null); // pre-selected IDs from list

  // Always derive the selected member from current state so edits reflect immediately
  const selectedMember = members.find(m => m.id === selectedMemberId) ?? null;

  // ── CRUD handlers ────────────────────────────────────────────────────────────

  function addMember(data) {
    const id = Math.max(0, ...members.map(m => m.id)) + 1;
    const ts = nowStr();
    const newMember = {
      id,
      bindingStatus: 'broken',
      channel: 'line',
      channelActive: false,
      tags: [],
      caseTracking: [],
      avatar: null,
      memberNumber: `MB-${String(id).padStart(4, '0')}`,
      lineId: data.name,
      hisId: data.name,
      medicalRecordNumber: '',
      passportNumber: '',
      note: '-',
      createdAt: ts,
      updatedAt: ts,
      ...data,
    };
    setMembers(prev => [newMember, ...prev]);
  }

  function updateMember(id, data) {
    setMembers(prev =>
      prev.map(m => m.id === id ? { ...m, ...data, updatedAt: nowStr() } : m)
    );
  }

  function deleteMember(id) {
    setMembers(prev => prev.filter(m => m.id !== id));
    setView('list');
  }

  // primaryId     – which member to keep as primary
  // fieldChoices  – { fieldKey: memberId } per non-readonly field
  // comparedMembers – all member objects in the comparison
  function mergeMembers(primaryId, fieldChoices, comparedMembers) {
    const primary = members.find(m => m.id === primaryId);
    if (!primary) return;

    // Build merged data: start with primary, overwrite selectable fields
    const mergedData = { ...primary };
    Object.entries(fieldChoices).forEach(([fieldKey, chosenId]) => {
      const chosen = comparedMembers.find(m => m.id === chosenId);
      if (chosen) mergedData[fieldKey] = chosen[fieldKey];
    });
    mergedData.updatedAt = nowStr();

    // IDs of members to remove (all compared except primary)
    const toRemove = new Set(
      comparedMembers.map(m => m.id).filter(id => id !== primaryId)
    );

    setMembers(prev =>
      prev
        .filter(m => !toRemove.has(m.id))
        .map(m => m.id === primaryId ? mergedData : m)
    );
  }

  // ── Routing ──────────────────────────────────────────────────────────────────

  // ids = array of member IDs to pre-load (optional, from multi-select)
  function goMerge(ids = null) {
    setMergeInitialIds(ids);
    setView('merge');
  }

  if (view === 'merge') {
    return (
      <MemberMerge
        members={members}
        initialMemberIds={mergeInitialIds}
        onBack={() => { setMergeInitialIds(null); setView('list'); }}
        onMerge={mergeMembers}
      />
    );
  }

  if (view === 'detail' && selectedMember) {
    return (
      <MemberDetail
        member={selectedMember}
        onBack={() => setView('list')}
        onUpdate={updateMember}
        onDelete={deleteMember}
        onGoMerge={goMerge}
      />
    );
  }

  return (
    <MemberList
      members={members}
      onSelectMember={(m) => { setSelectedMemberId(m.id); setView('detail'); }}
      onGoMerge={goMerge}
      onAddMember={addMember}
    />
  );
}

export default App;
