"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUserAuthStore } from "@/hooks/use-user-auth-store";

export default function RegisterPage() {
  const router = useRouter();
  const { token, isAdmin } = useUserAuthStore();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (token && !isAdmin) {
      // Si es usuario normal, redirigir a productos
      router.push("/productos");
    }
    if (token && isAdmin) {
      // Si es admin, redirigir a dashboard
      router.push("/dashboard");
    }
  }, [token, isAdmin, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await fetch("http://localhost:3001/api/v1/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form), // Enviar solo el objeto plano, no anidado
      });
      if (!res.ok) throw new Error("Error al registrar usuario");
      setSuccess(true);
      setTimeout(() => router.push("/login"), 1500);
    } catch (err: any) {
      setError(err.message || "Error al registrar usuario");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-md py-16">
      <h1 className="text-2xl font-bold mb-6">Crear cuenta</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-zinc-900 p-8 rounded shadow">
        <div>
          <label className="block font-medium mb-1">Email</label>
          <Input name="email" type="email" value={form.email} onChange={handleChange} required />
        </div>
        <div>
          <label className="block font-medium mb-1">Contraseña</label>
          <Input name="password" type="password" value={form.password} onChange={handleChange} required />
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {success && <div className="text-green-600 text-sm">¡Registro exitoso! Redirigiendo...</div>}
        <Button type="submit" disabled={loading}>{loading ? "Registrando..." : "Registrarse"}</Button>
      </form>
      <div className="mt-4 text-center text-sm">
        ¿Ya tienes cuenta?{" "}
        <a href="/login" className="text-amber-600 hover:underline">
          Inicia sesión
        </a>
      </div>
    </div>
  );
}
