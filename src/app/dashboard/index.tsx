import { Link, router } from "expo-router";
import { DoorOpen, LogOut, User } from "lucide-react-native";
import { View } from "react-native";
import { Button } from "~/src/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "~/src/components/ui/card";
import { Text } from "~/src/components/ui/text";

export default function Dashboard() {
  const handleLogout = () => {
    // Lógica de logout aqui
    router.navigate("/")
  }

  return (
    <View className="min-h-full bg-gray-50">
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
          <Link href="/unlock">
            <Button size="lg" className="gap-2">
              <View className="flex flex-row items-center gap-2">
                <DoorOpen className="h-5 w-5" color='white' />
                <Text>Modo de Desbloqueio</Text>
              </View>
            </Button>
          </Link>
        </View>

        <Card onTouchEnd={() => router.navigate('/manage-users')} className="w-full shadow-md h-auto transition-all hover:shadow-md border-l-4 border-primary">
          <CardHeader>
            <User color='black' />
            <CardTitle className="mt-4">Gerenciar Usuários</CardTitle>
            <CardDescription>Cadastre e gerencie usuários dos armários</CardDescription>
          </CardHeader>
        </Card>

      </View>
    </View>
  )
}