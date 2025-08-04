// src/app/dashboard/perfil/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Tab } from "@headlessui/react";
import { toast } from "react-hot-toast";
import {
  changePassword,
  toggle2FA,
  updatePrivacySettings,
  fetchSessions,
  revokeSession,
  deleteAccount,
  exportData,
} from "@/lib/api";

const tabs = ["Seguridad", "Privacidad", "Sesiones", "Cuenta"] as const;

export default function PerfilSettings() {
  const [activeTab, setActiveTab] = useState<typeof tabs[number]>("Seguridad");
  const [is2FAEnabled, set2FA] = useState(false);
  const [sessions, setSessions] = useState<any[]>([]);
  const { register, handleSubmit, formState } = useForm({
    defaultValues: { publicProfile: true, emailNotifications: true },
  });

  // Cargar estado inicial de 2FA (opcionalmente pide al backend)
  useEffect(() => {
    // Aquí podrías hacer un GET /users/me para saber si 2FA está activo
    // set2FA(data.is2FAEnabled)
  }, []);

  const onPasswordSubmit = handleSubmit(async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      return toast.error("Las contraseñas no coinciden");
    }
    await changePassword({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
    toast.success("Contraseña actualizada");
  });

  async function loadSessions() {
    const s = await fetchSessions();
    setSessions(s);
  }

  const onRevoke = async (id: string) => {
    await revokeSession(id);
    toast.success("Sesión cerrada");
    loadSessions();
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-semibold mb-4">Configuración</h1>
      <Tab.Group
        selectedIndex={tabs.indexOf(activeTab)}
        onChange={(i) => setActiveTab(tabs[i])}
      >
        <Tab.List className="flex space-x-2 border-b">
          {tabs.map((t) => (
            <Tab
              key={t}
              className={({ selected }) =>
                `px-4 py-2 font-medium ${
                  selected ? "border-b-2 border-blue-600" : "text-gray-600"
                }`
              }
            >
              {t}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-6">
          {/* —— Seguridad —— */}
          <Tab.Panel>
            <form onSubmit={onPasswordSubmit} className="space-y-4 max-w-md">
              <div>
                <label>Contraseña actual</label>
                <input
                  type="password"
                  {...register("currentPassword", { required: true })}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label>Nueva contraseña</label>
                <input
                  type="password"
                  {...register("newPassword", { minLength: 8 })}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label>Confirmar nueva contraseña</label>
                <input
                  type="password"
                  {...register("confirmPassword", { minLength: 8 })}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded">
                Guardar contraseña
              </button>
            </form>

            <div className="mt-8">
              <h2 className="font-semibold mb-2">Autenticación de dos factores</h2>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={is2FAEnabled}
                  onChange={async () => {
                    await toggle2FA(!is2FAEnabled);
                    set2FA(!is2FAEnabled);
                    toast.success(
                      `2FA ${!is2FAEnabled ? "activada" : "desactivada"}`
                    );
                  }}
                />
                <span>Activar 2FA</span>
              </label>
            </div>
          </Tab.Panel>

          {/* —— Privacidad —— */}
          <Tab.Panel>
            <form
              onSubmit={handleSubmit(updatePrivacySettings)}
              className="space-y-4 max-w-md"
            >
              <label className="flex items-center">
                <input
                  type="checkbox"
                  {...register("publicProfile")}
                  className="mr-2"
                />
                Perfil público
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  {...register("emailNotifications")}
                  className="mr-2"
                />
                Recibir notificaciones por email
              </label>
              <button className="px-4 py-2 bg-green-600 text-white rounded">
                Guardar preferencias
              </button>
            </form>
            <button
              onClick={exportData}
              className="mt-6 px-4 py-2 bg-gray-200 rounded"
            >
              Exportar mis datos
            </button>
          </Tab.Panel>

          {/* —— Sesiones —— */}
          <Tab.Panel>
            <button
              onClick={loadSessions}
              className="mb-4 text-sm text-blue-600"
            >
              Actualizar sesiones
            </button>
            <ul>
              {sessions.map((s) => (
                <li
                  key={s.id}
                  className="flex justify-between py-2 border-b"
                >
                  <span>
                    {s.device} — {new Date(s.lastActive).toLocaleString()}
                  </span>
                  <button
                    onClick={() => onRevoke(s.id)}
                    className="text-red-500 text-sm"
                  >
                    Cerrar
                  </button>
                </li>
              ))}
            </ul>
          </Tab.Panel>

          {/* —— Cuenta —— */}
          <Tab.Panel>
            <button
              onClick={() => {
                if (
                  confirm(
                    "¿Seguro quieres eliminar tu cuenta? Esta acción es irreversible."
                  )
                ) {
                  deleteAccount();
                  toast.success("Cuenta eliminada");
                }
              }}
              className="px-4 py-2 bg-red-600 text-white rounded"
            >
              Eliminar cuenta
            </button>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
