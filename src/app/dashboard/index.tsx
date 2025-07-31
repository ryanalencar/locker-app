import { router } from "expo-router";
import { LogOut, User } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { LockerStatus, lockers as schemaLockers } from "~/db/schema";
import { Button } from "~/src/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/src/components/ui/card";
import { Text } from "~/src/components/ui/text";
import { useDatabase } from "~/src/hooks/use-database";

export default function Dashboard() {
  const { drizzleDb } = useDatabase();
  const [lockerStats, setLockerStats] = useState({
    total: 24,
    available: 18,
    inUse: 6,
    maintenance: 2,
  })

  const handleLogout = () => {
    router.navigate("/")
  }

  useEffect(() => {
    async function fetchLockerStats() {
      const response = drizzleDb.select().from(schemaLockers).all();
      const total = response.length;
      const available = response.filter(locker => locker.status === LockerStatus.AVAILABLE).length;
      const inUse = response.filter(locker => locker.status === LockerStatus.OCCUPIED).length;
      const maintenance = response.filter(locker => locker.status === LockerStatus.MAINTENANCE).length;
      setLockerStats({ total, available, inUse, maintenance });
    }
    fetchLockerStats();
  }, [])

  return (
    <ScrollView className="min-h-full bg-gray-50">
      <View className="border-b border-muted-foreground bg-white p-4 shadow-md">
        <View className="flex flex-row items-center justify-between">
          <View className="flex items-center gap-2">
            <Text className="text-2xl font-bold">Locker App</Text>
          </View>
          <View className="flex flex-row items-center gap-3">
            <Button variant="ghost" size="icon" className="h-10 w-10" onPress={handleLogout}>
              <LogOut className="h-5 w-5" />
              <Text className="sr-only">Sair</Text>
            </Button>
          </View>
        </View>
      </View>

      <View className="max-w-7xl p-6">
        <View className="mb-8 flex flex-col justify-between gap-4">
          <View>
            <Text className="text-3xl font-bold">Painel de Controle</Text>
            <Text className="text-muted-foreground">Gerencie os armários e acesse as funcionalidades do sistema</Text>
          </View>
        </View>

        <View className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Total de Armários</CardTitle>
            </CardHeader>
            <CardContent>
              <Text className="text-4xl font-bold">{lockerStats.total}</Text>
            </CardContent>
          </Card>

          <Card className="border-green-100 bg-green-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-green-700">Disponíveis</CardTitle>
            </CardHeader>
            <CardContent>
              <Text className="text-4xl font-bold text-green-700">{lockerStats.available}</Text>
            </CardContent>
          </Card>

          <Card className="border-blue-100 bg-blue-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-blue-700">Em Uso</CardTitle>
            </CardHeader>
            <CardContent>
              <Text className="text-4xl font-bold text-blue-700">{lockerStats.inUse}</Text>
            </CardContent>
          </Card>

          <Card className="border-amber-100 bg-amber-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-amber-700">Manutenção</CardTitle>
            </CardHeader>
            <CardContent>
              <Text className="text-4xl font-bold text-amber-700">{lockerStats.maintenance}</Text>
            </CardContent>
          </Card>
        </View>

        <View className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-8">
          <Card onTouchEnd={() => router.navigate('/manage-users')} className="w-full shadow-md h-auto transition-all hover:shadow-md border-l-4 border-primary">
            <CardHeader>
              <User color='black' />
              <CardTitle className="mt-4">Gerenciar Usuários</CardTitle>
              <CardDescription>Cadastre e gerencie usuários dos armários</CardDescription>
            </CardHeader>
          </Card>

          <Card onTouchEnd={() => router.navigate('/manage-lockers')} className="w-full shadow-md h-auto transition-all hover:shadow-md border-l-4 border-primary">
            <CardHeader>
              <User color='black' />
              <CardTitle className="mt-4">Gerenciar Armários</CardTitle>
              <CardDescription>Cadastre e gerencie armários</CardDescription>
            </CardHeader>
          </Card>
        </View>

      </View>
    </ScrollView>
  )
}