import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";
import { lockers, LockerStatus, users as usersSchema } from "~/db/schema";
import { useDatabase } from "../hooks/use-database";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Text } from "./ui/text";

interface AddLockerDialogProps {
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: (open: boolean) => void;
}

interface FormData {
  status: LockerStatus;
  user_id: number;
}

export function AddLockerDialog({ isAddDialogOpen, setIsAddDialogOpen }: AddLockerDialogProps) {
  const { drizzleDb } = useDatabase()
  const [users, setUsers] = useState<number[]>([]);

  const {
    control,
    formState: { isLoading },
    handleSubmit,
  } = useForm<FormData>();

  useEffect(() => {
    async function fetchUsers() {
      try {
        const result = drizzleDb.select().from(usersSchema).all();
        const usersIds = result.map(user => user.id);
        setUsers(usersIds);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    }

    fetchUsers();
  }, []);

  const handleAddLocker = handleSubmit(async (data) => {
    try {
      await drizzleDb.insert(lockers).values({
        status: data.status,
        user_id: data.user_id
      }).execute();
    } catch (error) {
      console.error("Error adding locker:", error);
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
          <DialogTitle>Adicionar Armário</DialogTitle>
          <DialogDescription>Preencha os dados para adicionar um novo armário</DialogDescription>
        </DialogHeader>
        <View className="gap-4 py-4">
          <View className="gap-2">
            <Label htmlFor="status">Status</Label>
            <Controller
              control={control}
              name="status"
              render={({ field: { onChange, onBlur, value } }) => (
                <Select onValueChange={(option) => onChange(option.value)}>
                  <SelectTrigger>
                    <SelectValue
                      className='text-foreground text-sm native:text-lg'
                      placeholder='Status'
                    />
                  </SelectTrigger>
                  <SelectContent className="w-auto">
                    <SelectItem label="Disponível" value={LockerStatus.AVAILABLE}>Disponível</SelectItem>
                    <SelectItem label="Ocupado" value={LockerStatus.OCCUPIED}>Ocupado</SelectItem>
                    <SelectItem label="Manutenção" value={LockerStatus.MAINTENANCE}>Manutenção</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </View>
          <View className="gap-2">
            <Label htmlFor="user_id">Usuário</Label>
            <Controller
              control={control}
              name="user_id"
              render={({ field: { onChange, onBlur, value } }) => (
                <Select onValueChange={(option) => onChange(option.value)}>
                  <SelectTrigger>
                    <SelectValue
                      className='text-foreground text-sm native:text-lg'
                      placeholder='Selecione um usuário'
                    />
                  </SelectTrigger>
                  <SelectContent className="w-auto">
                    {users.map(user => (
                      <SelectItem key={user} label={`ID: ${user?.toString()}`} value={`${user?.toString()}`} />
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </View>
        </View>
        <DialogFooter>
          <Button variant="outline" onPress={closeDialog} disabled={isLoading}>
            <Text>Cancelar</Text>
          </Button>
          <Button
            onPress={handleAddLocker}
            disabled={isLoading}
          >
            <Text>{isLoading ? "Adicionando..." : "Adicionar"}</Text>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}