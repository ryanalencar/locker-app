import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";
import { users } from "~/db/schema";
import { useDatabase } from "../hooks/use-database";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Text } from "./ui/text";

interface AddUserDialogProps {
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: (open: boolean) => void;
}

interface FormData {
  name: string;
  registration: string;
  locker_id: string;
  username: string;
}

export function AddUserDialog({ isAddDialogOpen, setIsAddDialogOpen }: AddUserDialogProps) {
  const { drizzleDb } = useDatabase()

  const {
    control,
    formState: { isLoading },
    handleSubmit,
  } = useForm<FormData>();

  const handleAddUser = handleSubmit(async (data) => {
    try {
      await drizzleDb.insert(users).values({
        name: data.name,
        registration: data.registration,
        locker_id: data.locker_id,
        username: data.username
      }).execute();
    } catch (error) {
      console.error("Error adding user:", error);
      return;
    } finally {
      closeDialog();
    }
  });

  const closeDialog = () => {
    setIsAddDialogOpen(false);
  };

  return (
    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Usuário</DialogTitle>
          <DialogDescription>Preencha os dados para adicionar um novo usuário</DialogDescription>
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
          <View className="gap-2">
            <Label htmlFor="locker">Armário</Label>
            <Controller
              control={control}
              name="locker_id"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  id="locker"
                  placeholder="Armário"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                />
              )}
            />
          </View>
        </View>
        <DialogFooter>
          <Button variant="outline" onPress={closeDialog} disabled={isLoading}>
            <Text>Cancelar</Text>
          </Button>
          <Button
            onPress={handleAddUser}
            disabled={isLoading}
          >
            <Text>{isLoading ? "Adicionando..." : "Adicionar"}</Text>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}