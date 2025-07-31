import { eq } from "drizzle-orm";
import { useState } from "react";
import { Locker, lockers as lockersSchema } from "~/db/schema";
import { useDatabase } from "../hooks/use-database";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Text } from "./ui/text";

interface DeleteLockerDialogProps {
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  locker: Locker;
}

export function DeleteLockerDialog({ isDeleteDialogOpen, setIsDeleteDialogOpen, locker }: DeleteLockerDialogProps) {
  const { drizzleDb } = useDatabase();
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteLocker = async () => {
    setIsLoading(true);
    try {
      await drizzleDb.delete(lockersSchema).where(eq(lockersSchema.id, locker.id)).execute();
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting locker:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir Armário</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir este armário? Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onPress={() => setIsDeleteDialogOpen(false)} disabled={isLoading}>
            <Text>Cancelar</Text>
          </Button>
          <Button variant="destructive" onPress={handleDeleteLocker} disabled={isLoading}>
            <Text>{isLoading ? "Excluindo..." : "Excluir"}</Text>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}