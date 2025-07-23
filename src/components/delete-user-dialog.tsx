import { eq } from "drizzle-orm";
import { useState } from "react";
import { User, users } from "~/db/schema";
import { useDatabase } from "../hooks/use-database";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Text } from "./ui/text";

interface DeleteUserDialogProps {
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  user: User;
}

export function DeleteUserDialog({ isDeleteDialogOpen, setIsDeleteDialogOpen, user }: DeleteUserDialogProps) {
  const { drizzleDb } = useDatabase();
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteUser = async () => {
    setIsLoading(true);
    try {
      await drizzleDb.delete(users).where(eq(users.id, user.id)).execute();
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir Usuário</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onPress={() => setIsDeleteDialogOpen(false)} disabled={isLoading}>
            <Text>Cancelar</Text>
          </Button>
          <Button variant="destructive" onPress={handleDeleteUser} disabled={isLoading}>
            <Text>{isLoading ? "Excluindo..." : "Excluir"}</Text>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}