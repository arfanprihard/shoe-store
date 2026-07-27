import React, { useEffect, useState, useMemo } from 'react';
import { Shield, ShieldOff, Loader2 } from 'lucide-react';
import api from '../../utils/api';
import Pagination from '../../components/common/Pagination';
import { useUIStore } from '../../store/uiStore';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const showToast = useUIStore(s => s.showToast);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/users');
      setUsers(data.data);
      setCurrentPage(1);
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const totalPages = Math.ceil(users.length / itemsPerPage);
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return users.slice(start, start + itemsPerPage);
  }, [users, currentPage, itemsPerPage]);

  const toggleRole = async (userId, currentRole) => {
    const newRole = currentRole === 'ADMIN' ? 'CUSTOMER' : 'ADMIN';
    const action = newRole === 'ADMIN' ? 'menjadikan admin' : 'mengembalikan ke customer';
    if (!confirm(`Yakin ingin ${action}?`)) return;
    try {
      await api.patch(`/admin/users/${userId}/role`, { role: newRole });
      showToast(`Role berhasil diubah ke ${newRole}`, 'success');
      fetchUsers();
    } catch {
      showToast('Gagal mengubah role', 'error');
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <p className="text-sm text-gray-500 dark:text-gray-400">{users.length} pengguna terdaftar</p>

      <div className="bg-white dark:bg-dark-card rounded-2xl shadow-card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48"><Loader2 className="w-7 h-7 animate-spin text-brand" /></div>
        ) : (
          <div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                    <th className="text-left py-3.5 px-4 text-gray-500 dark:text-gray-400 font-semibold">Nama</th>
                    <th className="text-left py-3.5 px-4 text-gray-500 dark:text-gray-400 font-semibold">Email</th>
                    <th className="text-left py-3.5 px-4 text-gray-500 dark:text-gray-400 font-semibold">Telepon</th>
                    <th className="text-left py-3.5 px-4 text-gray-500 dark:text-gray-400 font-semibold">Role</th>
                    <th className="text-left py-3.5 px-4 text-gray-500 dark:text-gray-400 font-semibold">Pesanan</th>
                    <th className="text-left py-3.5 px-4 text-gray-500 dark:text-gray-400 font-semibold">Terdaftar</th>
                    <th className="text-right py-3.5 px-4 text-gray-500 dark:text-gray-400 font-semibold">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.map(u => (
                    <tr key={u.id} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-brand/10 flex items-center justify-center text-brand font-bold text-xs shrink-0">
                            {u.firstName?.[0]}{u.lastName?.[0]}
                          </div>
                          <span className="font-semibold text-gray-900 dark:text-white">{u.firstName} {u.lastName}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{u.email}</td>
                      <td className="py-3 px-4 text-gray-500">{u.phone || '-'}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-700 dark:text-gray-300 font-medium">{u.orderCount}</td>
                      <td className="py-3 px-4 text-gray-500">{new Date(u.createdAt).toLocaleDateString('id-ID')}</td>
                      <td className="py-3 px-4 text-right">
                        <button onClick={() => toggleRole(u.id, u.role)}
                          className={`p-2 rounded-lg transition-colors ${u.role === 'ADMIN' ? 'text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20' : 'text-gray-400 hover:text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20'}`}
                          title={u.role === 'ADMIN' ? 'Kembalikan ke Customer' : 'Jadikan Admin'}>
                          {u.role === 'ADMIN' ? <ShieldOff className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={users.length}
              itemsPerPage={itemsPerPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
