"use client";

import { useState, useEffect } from "react";
import { useUserAuthStore } from "@/hooks/use-user-auth-store";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function UserLoginPage() {
  const { login, loading, error, token, isAdmin, setTokenFromStorage } =
    useUserAuthStore();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    setTokenFromStorage();
  }, [setTokenFromStorage]);

  useEffect(() => {
    if (token) {
      if (isAdmin) {
        router.push("/dashboard");
      } else {
        router.push("/productos");
      }
    }
  }, [token, isAdmin, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="container max-w-md py-16">
      <h1 className="text-2xl font-bold mb-6">Iniciar sesión</h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white dark:bg-zinc-900 p-8 rounded shadow"
      >
        <div>
          <label className="block font-medium mb-1">Email</label>
          <Input
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Contraseña</label>
          <Input
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <Button type="submit" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </Button>
      </form>
      <div className="mt-4 text-center text-sm">
        ¿No tienes cuenta?{" "}
        <a href="/register" className="text-amber-600 hover:underline">
          Regístrate
        </a>
      </div>
    </div>
  );
}
