import React from 'react';

interface AdminTableProps<T> {
  data: T[];
  columns: { key: string; header: string; render?: (item: T) => React.ReactNode }[];
  onEdit: (item: T) => void;
  onDelete: (id: number) => void;
}

export function AdminTable<T extends { id: number }>({
  data,
  columns,
  onEdit,
  onDelete,
}: AdminTableProps<T>) {
  return (
    <table className="admin-table">
      <thead>
        <tr>
          {columns.map(col => (
            <th key={col.key}>{col.header}</th>
          ))}
          <th>إجراءات</th>
        </tr>
      </thead>
      <tbody>
        {data.map(item => (
          <tr key={item.id}>
            {columns.map(col => (
              <td key={`${item.id}-${col.key}`}>
                {col.render ? col.render(item) : (
                  // معالجة الحقول المتداخلة مثل user.name أو bookable.name
                  col.key.includes('.') ? 
                    (() => {
                      const keys = col.key.split('.');
                      let value = item as any;
                      for (const k of keys) {
                        if (!value || value[k] === undefined || value[k] === null) {
                          return '-';
                        }
                        value = value[k];
                      }
                      return value || '-';
                    })() : 
                    ((item as any)[col.key] !== undefined && (item as any)[col.key] !== null) ? (item as any)[col.key] : '-'
                )}
              </td>
            ))}
            <td>
              <button onClick={() => onEdit(item)}>تعديل</button>
              <button onClick={() => onDelete(item.id)} className="delete">حذف</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
