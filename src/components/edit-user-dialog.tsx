import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";
import { User, users } from "~/db/schema";
import { useDatabase } from "../hooks/use-database";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Text } from "./ui/text";

interface FormData {
  name: string;
  registration: string;
  username: string;
}

interface EditUserDialogProps {
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  user: User;
}

export function EditUserDialog({ isEditDialogOpen, setIsEditDialogOpen, user }: EditUserDialogProps) {
  const { drizzleDb } = useDatabase();

  const {
    control,
    formState: { isLoading },
    handleSubmit,
  } = useForm<FormData>({ values: user });

  const handleEditUser = handleSubmit(async (data) => {
    try {
      await drizzleDb.update(users).set({
        name: data.name,
        registration: data.registration,
        username: data.username
      }).execute();
    } catch (error) {
      console.error("Error editing user:", error);
      return;
    } finally {
      closeDialog();
    }
  });

  const closeDialog = () => {
    setIsEditDialogOpen(false);
  };

  return (
    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Usuário</DialogTitle>
          <DialogDescription>Altere os dados do usuário</DialogDescription>
        </DialogHeader>
        <View className="gap-4 py-4">
          <View className="gap-2">
            <Label htmlFor="name">Nome Completo</Label>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  id="name"
                  placeholder="Nome Completo"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                />
              )}
            />
          </View>
          <View className="gap-2">
            <Label htmlFor="username">Usuário</Label>
            <Controller
              control={control}
              name="username"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  id="username"
                  placeholder="Usuário"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                />
              )}
            />
          </View>
          <View className="gap-2">
            <Label htmlFor="registration">Matrícula</Label>
            <Controller
              control={control}
              name="registration"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  id="registration"
                  keyboardType="numeric"
                  placeholder="Matrícula"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                />
              )}
            />
          </View>
        </View>
        <DialogFooter>
          <Button variant="outline" onPress={() => setIsEditDialogOpen(false)} disabled={isLoading}>
            <Text>Cancelar</Text>
          </Button>
          <Button
            onPress={handleEditUser}
            disabled={isLoading}
          >
            <Text>{isLoading ? "Salvando..." : "Salvar"}</Text>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}