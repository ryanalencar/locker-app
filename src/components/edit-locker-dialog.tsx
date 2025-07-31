import { eq } from "drizzle-orm";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";
import { Locker, LockerStatus, lockers as lockersSchema, users as usersSchema } from "~/db/schema";
import { useDatabase } from "../hooks/use-database";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Text } from "./ui/text";

interface FormData {
  id: number;
  status: string;
  user_id: number;
}

interface EditLockerDialogProps {
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  locker: Locker;
}

export function EditLockerDialog({ isEditDialogOpen, setIsEditDialogOpen, locker }: EditLockerDialogProps) {
  const { drizzleDb } = useDatabase();
  const [users, setUsers] = useState<number[]>([]);

  const {
    control,
    formState: { isLoading },
    handleSubmit,
  } = useForm<FormData>({ values: locker });

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

  const handleEditLocker = handleSubmit(async (data) => {
    try {
      await drizzleDb.update(lockersSchema).set({
        status: data.status,
        user_id: data.user_id
      }).where(eq(lockersSchema.id, locker.id)).execute();
    } catch (error) {
      console.error("Error editing locker:", error);
      return;
    } finally {
      closeDialog();
    }
  });

  const closeDialog = () => {
    setIsEditDialogOpen(false);
  };

  const statusLabel = {
    [LockerStatus.AVAILABLE]: "Disponível",
    [LockerStatus.OCCUPIED]: "Ocupado",
    [LockerStatus.MAINTENANCE]: "Manutenção"
  }

  return (
    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Armário</DialogTitle>
          <DialogDescription>Altere os dados do armário</DialogDescription>
        </DialogHeader>
        <View className="gap-4 py-4">
          <View className="gap-2">
            <Label htmlFor="status">Status</Label>
            <Controller
              control={control}
              name="status"
              render={({ field: { onChange, onBlur, value } }) => (
                <Select onValueChange={(option) => onChange(option.value)} value={{ label: statusLabel[value], value }}>
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
                <Select onValueChange={(option) => onChange(option.value)} value={{ label: `ID: ${value}`, value: value?.toString() }}>
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
          <Button variant="outline" onPress={() => setIsEditDialogOpen(false)} disabled={isLoading}>
            <Text>Cancelar</Text>
          </Button>
          <Button
            onPress={handleEditLocker}
            disabled={isLoading}
          >
            <Text>{isLoading ? "Salvando..." : "Salvar"}</Text>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}