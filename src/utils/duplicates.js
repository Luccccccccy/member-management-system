// 判斷重複的欄位條件
export const MATCH_CRITERIA = [
  { key: 'name',                label: '姓名' },
  { key: 'idNumber',            label: '身份證/居留證號' },
  { key: 'phone',               label: '手機' },
  { key: 'birthday',            label: '生日' },
  { key: 'medicalRecordNumber', label: '病歷編號' },
  { key: 'memberNumber',        label: '會員編號' },
  { key: 'passportNumber',      label: '護照號碼' },
];

function hasValue(val) {
  return val !== null && val !== undefined && String(val).trim() !== '';
}

function getMatchedFields(a, b) {
  return MATCH_CRITERIA
    .filter(c => hasValue(a[c.key]) && hasValue(b[c.key]) && a[c.key] === b[c.key])
    .map(c => c.label);
}

/**
 * 使用 Union-Find 將有任一欄位重複的會員分群
 * 回傳 Array<{ id, members, matchReasons }>
 */
export function findDuplicateGroups(members) {
  // Union-Find setup
  const parent = {};
  members.forEach(m => { parent[m.id] = m.id; });

  function find(id) {
    if (parent[id] !== id) parent[id] = find(parent[id]);
    return parent[id];
  }
  function union(a, b) {
    const ra = find(a), rb = find(b);
    if (ra !== rb) parent[ra] = rb;
  }

  // 記錄每對配對的重複欄位
  const pairReasons = {};
  for (let i = 0; i < members.length; i++) {
    for (let j = i + 1; j < members.length; j++) {
      const fields = getMatchedFields(members[i], members[j]);
      if (fields.length > 0) {
        pairReasons[`${members[i].id}-${members[j].id}`] = fields;
        union(members[i].id, members[j].id);
      }
    }
  }

  // 依 root 分組
  const roots = {};
  members.forEach(m => {
    const root = find(m.id);
    if (!roots[root]) roots[root] = [];
    roots[root].push(m);
  });

  return Object.values(roots)
    .filter(g => g.length > 1)
    .map((g, i) => {
      const reasons = new Set();
      for (let a = 0; a < g.length; a++) {
        for (let b = a + 1; b < g.length; b++) {
          const key = `${g[a].id}-${g[b].id}`;
          (pairReasons[key] || []).forEach(r => reasons.add(r));
        }
      }
      return {
        id: `dup-group-${i}`,
        members: g,
        matchReasons: [...reasons],
      };
    });
}
