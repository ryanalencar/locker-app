import { router } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";

import { Button } from "~/src/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/src/components/ui/card";
import { Input } from "~/src/components/ui/input";
import { Label } from "~/src/components/ui/label";
import { Text } from "~/src/components/ui/text";

export default function AdminLogin() {
  const {
    control,
    handleSubmit,
    formState: { errors, isLoading },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  })

  const handleLogin = handleSubmit((data) => {
    const { username, password } = data;

    if (username === "admin" && password === "admin") {
    }
    router.navigate("/dashboard")
  });

  return (
    <View className="flex min-h-full items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader className="flex flex-col items-center gap-2">
          <CardTitle className="text-3xl font-bold">Smart Locker</CardTitle>
          <CardDescription className="text-lg">Sistema de Gestão de Armários Inteligentes</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <View className="flex flex-col gap-4">
            <View>
              <Label nativeID='username'>Usuário</Label>
              <Controller
                control={control}
                name="username"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    placeholder="Usuário"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                  />
                )}
              />
            </View>
            <View>
              <Label nativeID='password'>Senha</Label>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    placeholder="Senha"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    secureTextEntry
                  />
                )}
              />
            </View>

            <Button onPress={handleLogin}>
              <Text>
                {isLoading ? "Autenticando..." : "Entrar"}
              </Text>
            </Button>
            <Button className="flex-row gap-2" variant="secondary" onPress={() => router.back()}>
              <ChevronLeft />
              <Text>
                Voltar
              </Text>
            </Button>
          </View>
        </CardContent>
      </Card>
    </View>
  );
}
