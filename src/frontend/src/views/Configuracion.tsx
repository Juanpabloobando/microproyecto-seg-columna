import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Bell, Shield, Database, Mail, Save } from 'lucide-react';

export default function Configuracion() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [alertThreshold, setAlertThreshold] = useState([70]);
  const [autoAnalysis, setAutoAnalysis] = useState(false);

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Configuración</h2>
          <p className="text-gray-500">Personaliza las preferencias del sistema</p>
        </div>

        <Tabs defaultValue="perfil" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="perfil" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Perfil
            </TabsTrigger>
            <TabsTrigger value="notificaciones" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notificaciones
            </TabsTrigger>
            <TabsTrigger value="sistema" className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              Sistema
            </TabsTrigger>
            <TabsTrigger value="seguridad" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Seguridad
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="perfil">
            <Card>
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="text-lg">Información del Perfil</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center gap-6 mb-6">
                  <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-12 h-12 text-blue-600" />
                  </div>
                  <div>
                    <Button variant="outline" size="sm">
                      Cambiar Foto
                    </Button>
                    <p className="text-sm text-gray-500 mt-2">JPG, PNG. Máximo 2MB</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Nombre</Label>
                    <Input id="firstName" defaultValue="Carlos" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Apellido</Label>
                    <Input id="lastName" defaultValue="Pineda" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Correo Electrónico</Label>
                    <Input id="email" type="email" defaultValue="c.pineda@uni.edu" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input id="phone" defaultValue="+52 55 1234 5678" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="title">Cargo</Label>
                    <Input id="title" defaultValue="Psicólogo - Bienestar Estudiantil" />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button className="bg-blue-600">
                    <Save className="w-4 h-4 mr-2" />
                    Guardar Cambios
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notificaciones">
            <Card>
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="text-lg">Preferencias de Notificaciones</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Mail className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Notificaciones por Email</p>
                      <p className="text-sm text-gray-500">Recibe alertas en tu correo</p>
                    </div>
                  </div>
                  <Switch
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Bell className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Notificaciones Push</p>
                      <p className="text-sm text-gray-500">Alertas en tiempo real</p>
                    </div>
                  </div>
                  <Switch
                    checked={pushNotifications}
                    onCheckedChange={setPushNotifications}
                  />
                </div>

                <div className="space-y-4">
                  <Label className="text-gray-700 font-medium">Umbral de Alerta (%)</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={alertThreshold}
                      onValueChange={setAlertThreshold}
                      max={100}
                      min={0}
                      step={5}
                      className="flex-1"
                    />
                    <span className="text-2xl font-bold text-blue-600 w-16">
                      {alertThreshold[0]}%
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Se enviará una alerta cuando el riesgo supere este porcentaje
                  </p>
                </div>

                <div className="flex justify-end">
                  <Button className="bg-blue-600">
                    <Save className="w-4 h-4 mr-2" />
                    Guardar Preferencias
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Tab */}
          <TabsContent value="sistema">
            <Card>
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="text-lg">Configuración del Sistema</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">Análisis Automático</p>
                    <p className="text-sm text-gray-500">
                      Ejecutar análisis automáticamente al ingresar datos
                    </p>
                  </div>
                  <Switch checked={autoAnalysis} onCheckedChange={setAutoAnalysis} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Idioma</Label>
                  <select
                    id="language"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="es">Español</option>
                    <option value="en">English</option>
                    <option value="pt">Português</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Zona Horaria</Label>
                  <select
                    id="timezone"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="America/Mexico_City">Ciudad de México (GMT-6)</option>
                    <option value="America/Bogota">Bogotá (GMT-5)</option>
                    <option value="America/Lima">Lima (GMT-5)</option>
                    <option value="America/Santiago">Santiago (GMT-4)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dataRetention">Retención de Datos (meses)</Label>
                  <Input id="dataRetention" type="number" defaultValue="24" />
                </div>

                <div className="flex justify-end">
                  <Button className="bg-blue-600">
                    <Save className="w-4 h-4 mr-2" />
                    Guardar Configuración
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="seguridad">
            <Card>
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="text-lg">Seguridad de la Cuenta</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-800">Cambiar Contraseña</h3>
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Contraseña Actual</Label>
                    <Input id="currentPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Nueva Contraseña</Label>
                    <Input id="newPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                    <Input id="confirmPassword" type="password" />
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="font-medium text-gray-800 mb-4">
                    Autenticación de Dos Factores (2FA)
                  </h3>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">Habilitar 2FA</p>
                      <p className="text-sm text-gray-500">
                        Añade una capa extra de seguridad
                      </p>
                    </div>
                    <Button variant="outline">Configurar</Button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button className="bg-blue-600">
                    <Save className="w-4 h-4 mr-2" />
                    Actualizar Seguridad
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
