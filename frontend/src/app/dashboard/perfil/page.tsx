// src/app/dashboard/perfil/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Tab } from "@headlessui/react";
import { toast } from "react-hot-toast";
import {
  authAPI,
  changePassword,
  toggle2FA,
  updatePrivacySettings,
  fetchSessions,
  revokeSession,
  deleteAccount,
  exportData,
  updateProfile,
  type User,
} from "@/lib/api";

const tabs = ["Perfil", "Seguridad", "Privacidad", "Sesiones", "Cuenta"] as const;

interface SessionInfo {
  id: string;
  device: string;
  lastActive: string;
}
interface FormValues {
  nombre: string;
  apellido: string;
  email: string;
  username: string;
  bio: string;
  profilePicture: File | null; 
  telefono: string;
  ciudad: string;
  departamento: string;
  publicProfile: boolean;
  emailNotifications: boolean;
}

interface PasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function PerfilSettings() {
  const [activeTab, setActiveTab] = useState<typeof tabs[number]>("Perfil");
  const [is2FAEnabled, set2FA] = useState(false);
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [usuario, setUsuario] = useState<User | null>(null);
  const [errorContrasena, setErrorContrasena] = useState<string | null>(null);
  const { register, handleSubmit, reset, setValue } = useForm<FormValues>({
    defaultValues: {
      nombre: "",
      apellido: "",
      telefono: "",
      ciudad: "",
      departamento: "",
      bio: "",
      publicProfile: true,
      emailNotifications: true,
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
  } = useForm<PasswordFormValues>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    async function cargarPerfil() {
      const data = await authAPI.getProfile();
      setUsuario(data);
      reset({
        nombre: data.nombre,
        apellido: data.apellido,
        telefono: data.telefono || "",
        ciudad: data.ciudad || "",
        departamento: data.departamento || "",
        bio: data.bio || "",
        publicProfile: data.publicProfile,
        emailNotifications: data.emailNotifications,
      });
      resetPassword();
    }
    cargarPerfil();
  }, [reset, resetPassword]);

  const onProfileSubmit = handleSubmit(async (data) => {
    await updateProfile({
      nombre: data.nombre,
      apellido: data.apellido,
      telefono: data.telefono,
      ciudad: data.ciudad,
      departamento: data.departamento,
      bio: data.bio,
    });
    toast.success("Perfil actualizado");
    const actualizado = await authAPI.getProfile();
    setUsuario(actualizado);
  });

    const onPasswordSubmit = handlePasswordSubmit(async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      const mensaje = "Las contraseñas no coinciden";
      toast.error(mensaje);
      alert(mensaje);
      setErrorContrasena(mensaje);
      return;
    }
    try {
      await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      const mensaje = "Contraseña actualizada";
      toast.success(mensaje);
      alert(mensaje);
      setErrorContrasena(null);
      resetPassword();
    } catch (error: unknown) {
      const mensaje =
        (error as { response?: { data?: { message?: string } } }).response?.data?.message ||
        "Contraseña actual incorrecta";
      toast.error(mensaje);
      alert(mensaje);
      setErrorContrasena(mensaje);
    }
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
      <h1 className="text-2xl font-semibold mb-4">Perfil</h1>
      {usuario && (
        <div className="flex items-center space-x-4 mb-6">
          {usuario.avatar ? (
            <img
              src={usuario.avatar}
              alt="Avatar"
              className="h-16 w-16 rounded-full"
            />
          ) : (
            <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center text-xl">
              {usuario.nombre.charAt(0)}
            </div>
          )}
          <div>
            <p className="text-xl font-semibold">
              {usuario.nombre} {usuario.apellido}
            </p>
            <p className="text-gray-600">{usuario.email}</p>
          </div>
        </div>
      )}
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
          {/* —— Perfil —— */}
          <Tab.Panel>
            <form onSubmit={onProfileSubmit} className="space-y-4 max-w-md">
              <div>
                <label>Nombre</label>
                <input
                  type="text"
                  {...register("nombre", { required: true })}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label>Apellido</label>
                <input
                  type="text"
                  {...register("apellido", { required: true })}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label>Teléfono</label>
                <input
                  type="text"
                  {...register("telefono")}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label>Ciudad</label>
                <input
                  type="text"
                  {...register("ciudad")}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label>Departamento</label>
                <input
                  type="text"
                  {...register("departamento")}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label>Bio</label>
                <textarea
                  {...register("bio")}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded">
                Guardar perfil
              </button>
            </form>
          </Tab.Panel>

          {/* —— Seguridad —— */}
          <Tab.Panel>
            <form onSubmit={onPasswordSubmit} className="space-y-4 max-w-md">
              <div>
                <label>Contraseña actual</label>
                <input
                  type="password"
                  {...registerPassword("currentPassword", { required: true })}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label>Nueva contraseña</label>
                <input
                  type="password"
                  {...registerPassword("newPassword", { minLength: 8 })}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label>Confirmar nueva contraseña</label>
                <input
                  type="password"
                  {...registerPassword("confirmPassword", { minLength: 8 })}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              {errorContrasena && (
                <p className="text-red-500 text-sm">{errorContrasena}</p>
              )}
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
            onSubmit={handleSubmit((data) =>
                updatePrivacySettings({
                  publicProfile: data.publicProfile,
                  emailNotifications: data.emailNotifications,
                })
              )}
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
