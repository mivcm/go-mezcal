"use client";
import { useEffect, useState } from "react";
import { useUserAuthStore } from "@/hooks/use-user-auth-store";
import { Card } from "@/components/ui/card";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function AdminStatsPage() {
  const { token, isAdmin } = useUserAuthStore();
  const [sales, setSales] = useState<any>(null);
  const [abandoned, setAbandoned] = useState<any>(null);
  const [userStats, setUserStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!token || !isAdmin) return;
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const [salesRes, abandonedRes, usersRes] = await Promise.all([
          api.get("/api/v1/admin/stats/sales"),
          api.get("/api/v1/admin/stats/abandoned_carts"),
          api.get("/api/v1/admin/stats/user_stats"),
        ]);
        setSales(salesRes.data);
        setAbandoned(abandonedRes.data);
        setUserStats(usersRes.data);
      } catch (err: any) {
        setError(err.message || "Error al cargar estadísticas");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [token, isAdmin]);

  if (!token || !isAdmin) return <div className="container py-16 text-center">Acceso restringido</div>;
  if (loading) return <div className="container py-16 text-center">Cargando estadísticas...</div>;
  if (error) return <div className="container py-16 text-center text-red-500">{error}</div>;

  console.log(userStats);
      

  return (
    <div className="container py-12 max-w-4xl">
      <h1 className="text-2xl font-bold mb-8">Estadísticas de la tienda</h1>
      <div className="flex gap-4 mb-8">
        <Button variant="outline" onClick={() => router.push("/dashboard/products")}>Ver productos</Button>
        <Button variant="outline" onClick={() => router.push("/dashboard/orders")}>Ver órdenes</Button>
        <Button variant="outline" onClick={() => router.push("/dashboard/carts")}>Ver carritos abandonados</Button>
        <Button variant="outline" onClick={() => router.push("/dashboard/stats")}>Ver estadísticas</Button>
        <Button variant="outline" onClick={() => router.push("/dashboard")}>Dashboard</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Card className="p-6 flex flex-col items-center justify-center bg-gradient-to-br from-amber-100 to-amber-300 dark:from-zinc-800 dark:to-zinc-900 shadow-lg">
          <h2 className="text-lg font-bold mb-2 text-amber-800 dark:text-amber-300 flex items-center gap-2">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" className="inline-block text-amber-600"><path d="M12 8v4l3 3"/></svg>
            Ventas totales
          </h2>
          <div className="text-4xl font-extrabold text-amber-600 mb-2">${sales?.total_sales ?? 0}</div>
          <div className="text-muted-foreground">Órdenes: {sales?.total_orders ?? 0}</div>
        </Card>
        <Card className="p-6 flex flex-col items-center justify-center bg-gradient-to-br from-red-100 to-red-300 dark:from-zinc-800 dark:to-zinc-900 shadow-lg">
          <h2 className="text-lg font-bold mb-2 text-red-800 dark:text-red-300 flex items-center gap-2">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" className="inline-block text-red-600"><circle cx="12" cy="12" r="10"/><path d="M8 12h8M12 8v8"/></svg>
            Carritos abandonados
          </h2>
          <div className="text-4xl font-extrabold text-red-600 mb-2">{abandoned?.total_abandoned ?? 0}</div>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Card className="p-6 mb-8 flex-1 bg-gradient-to-br from-emerald-100 to-emerald-300 dark:from-zinc-800 dark:to-zinc-900 shadow-lg">
          <h2 className="text-lg font-bold mb-4 text-emerald-800 dark:text-emerald-300">Productos más vendidos</h2>
          <div className="h-48 flex items-center justify-center">
            {Array.isArray(sales?.best_selling_products) && sales.best_selling_products.length > 0 ? (
              <BarChart data={sales.best_selling_products} />
            ) : (
              <span className="text-muted-foreground">No hay datos</span>
            )}
          </div>
          <ul className="list-disc ml-6 mt-4">
            {Array.isArray(sales?.best_selling_products) && sales.best_selling_products.length > 0 ? (
              sales.best_selling_products.map((prod: [string, number], idx: number) => (
                <li key={idx} className="text-emerald-900 dark:text-emerald-200">
                  {prod[0]} <span className="font-bold">({prod[1]} vendidos)</span>
                </li>
              ))
            ) : null}
          </ul>
        </Card>
        <Card className="p-6 flex-1 bg-gradient-to-br from-blue-100 to-blue-300 dark:from-zinc-800 dark:to-zinc-900 shadow-lg">
          <h2 className="text-lg font-bold mb-4 text-blue-800 dark:text-blue-300">Usuarios con más compras</h2>
          <div className="h-48 flex items-center justify-center">
            {Array.isArray(userStats?.top_users) && userStats.top_users.length > 0 ? (
              <PieChart data={userStats.top_users.map((u: [string, number]) => ({ email: u[0], orders_count: u[1] }))} />
            ) : (
              <span className="text-muted-foreground">No hay datos</span>
            )}
          </div>
          <ul className="list-disc ml-6 mt-4">
            {Array.isArray(userStats?.top_users) && userStats.top_users.length > 0 ? (
              userStats.top_users.map((user: [string, number], idx: number) => (
                <li key={idx} className="text-blue-900 dark:text-blue-200">
                  {user[0]} <span className="font-bold">({user[1]} órdenes)</span>
                </li>
              ))
            ) : <li>No hay datos</li>}
          </ul>
        </Card>
      </div>
    </div>
  );
}

// --- COMPONENTES DE GRAFICOS ---
import { ResponsiveContainer, BarChart as RBarChart, Bar, XAxis, YAxis, Tooltip, PieChart as RPieChart, Pie, Cell, Legend } from 'recharts';

function BarChart({ data }: { data: [string, number][] }) {
  const chartData = data.map(([name, value]) => ({ name, value }));
  return (
    <ResponsiveContainer width="100%" height={180}>
      <RBarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
      </RBarChart>
    </ResponsiveContainer>
  );
}

function PieChart({ data }: { data: any[] }) {
  const chartData = data.map((user) => ({ name: user.email, value: user.orders_count }));
  const COLORS = ["#2563eb", "#60a5fa", "#818cf8", "#a5b4fc", "#38bdf8", "#0ea5e9"];
  return (
    <ResponsiveContainer width="100%" height={180}>
      <RPieChart>
        <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} label>
          {chartData.map((entry, idx) => (
            <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </RPieChart>
    </ResponsiveContainer>
  );
}
