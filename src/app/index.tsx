import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Text } from "../components/ui/text";

interface LockerFormData {
  registration: string;
}

export default function Index() {
  const {
    control,
    handleSubmit,
    formState: { errors, isLoading },
  } = useForm<LockerFormData>({})

  const handleOpenLocker = handleSubmit((data) => {

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
              <Label nativeID='registration'>Matrícula</Label>
              <Controller
                control={control}
                name="registration"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    placeholder="Matrícula"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                  />
                )}
              />
            </View>

            <Button onPress={handleOpenLocker}>
              <Text>
                {isLoading ? "Abrindo Armário..." : "Abrir Armário"}
              </Text>
            </Button>
            <Button variant="secondary" onPress={() => router.navigate('/admin-login')}>
              <Text>
                Acessar painel admin
              </Text>
            </Button>
          </View>
        </CardContent>
      </Card>
    </View>
  );
}
