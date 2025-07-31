import { FlashList } from "@shopify/flash-list";
import { Edit, Plus, X } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import { ScrollView, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Locker, LockerStatus, lockers as schemaLockers } from "~/db/schema";
import { AddLockerDialog } from "~/src/components/add-locker-dialog";
import { DeleteLockerDialog } from "~/src/components/delete-locker-dialog";
import { EditLockerDialog } from "~/src/components/edit-locker-dialog";
import { Header } from "~/src/components/header";
import { Badge } from "~/src/components/ui/badge";
import { Button } from "~/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/src/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/src/components/ui/table";
import { Text } from "~/src/components/ui/text";
import { useDatabase } from "~/src/hooks/use-database";
import { cn } from "~/src/lib/utils";

const MIN_COLUMN_WIDTHS = [50, 120, 50, 120];

export default function ManageUsers() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { drizzleDb } = useDatabase();
  const [selectedLocker, setSelectedLocker] = useState<Locker | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [lockers, setLockers] = useState<Locker[]>([]);

  const columnWidths = useMemo(() => {
    return MIN_COLUMN_WIDTHS.map((minWidth) => {
      const evenWidth = width / MIN_COLUMN_WIDTHS.length;
      return evenWidth > minWidth ? evenWidth : minWidth;
    });
  }, [width]);

  useEffect(() => {
    async function fetchLockers() {
      try {
        const response = drizzleDb.select().from(schemaLockers).all();
        setLockers(response);
      } catch (error) {
        console.error("Failed to fetch lockers:", error);
      }
    }

    fetchLockers();
  }, [isAddDialogOpen,
    isEditDialogOpen,
    isDeleteDialogOpen])

  const openDeleteLockerDialog = (locker: Locker) => {
    setSelectedLocker(locker);
    setIsDeleteDialogOpen(true);
  }

  const openEditLockerDialog = (locker: Locker) => {
    setSelectedLocker(locker);
    setIsEditDialogOpen(true);
  };

  const openAddLockerDialog = () => {
    setIsAddDialogOpen(true);
  };

  const badgeColor = (status: LockerStatus) => {
    switch (status) {
      case LockerStatus.AVAILABLE:
        return "bg-green-100";
      case LockerStatus.OCCUPIED:
        return "bg-blue-100";
      case LockerStatus.MAINTENANCE:
        return "bg-amber-100";
      default:
        return "bg-gray-200";
    }
  };

  const badgeTextColor = (status: LockerStatus) => {
    switch (status) {
      case LockerStatus.AVAILABLE:
        return "text-green-800";
      case LockerStatus.OCCUPIED:
        return "text-blue-800";
      case LockerStatus.MAINTENANCE:
        return "text-amber-800";
      default:
        return "text-gray-800";
    }
  };

  return (
    <>
      <ScrollView bounces={false} className="min-h-full bg-gray-50 py-10">
        <Header title="Gerenciar Armários" subtitle="Adicione, edite e remova armários do sistema" />
        <View className="flex flex-col px-6 gap-4">
          <Button
            onPress={openAddLockerDialog}
            className="mt-4 md:mt-0 gap-2"
          >
            <View className="flex flex-row items-center gap-2">
              <Plus color='white' className="h-4 w-4" />
              <Text>Adicionar Armário</Text>
            </View>
          </Button>

          <Card>
            <CardHeader>
              <CardTitle>Lista de Armários</CardTitle>
            </CardHeader>
            <CardContent>
              <Table aria-labelledby='lockers-table'>
                <TableHeader>
                  <TableRow>
                    <TableHead style={{ width: 80 }}>
                      <Text>Número</Text>
                    </TableHead>
                    <TableHead style={{ width: columnWidths[1] }}>
                      <Text>Status</Text>
                    </TableHead>
                    <TableHead style={{ width: columnWidths[2] }}>
                      <Text>Usuário</Text>
                    </TableHead>
                    <TableHead style={{ width: columnWidths[3] }}>
                      <Text>Ações</Text>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lockers.length > 0 &&
                    <FlashList
                      showsVerticalScrollIndicator={false}
                      contentContainerStyle={{
                        paddingBottom: insets.bottom,
                      }}
                      estimatedItemSize={110}
                      data={lockers}
                      renderItem={({ item: locker, index }) => {
                        return (
                          <TableRow className={cn('active:bg-secondary', index % 2 && 'bg-muted/40 ')}
                            key={locker.id}>
                            <TableCell style={{ width: 80 }}>
                              <Text>A{locker.id}</Text>
                            </TableCell>
                            <TableCell style={{ width: columnWidths[1] }}>
                              <Badge className={badgeColor(locker.status as LockerStatus)}>
                                <Text className={badgeTextColor(locker.status as LockerStatus)}>{locker.status.toUpperCase()}</Text>
                              </Badge>
                            </TableCell>
                            <TableCell style={{ width: columnWidths[2] }}>
                              <Text>ID:{locker.user_id}</Text>
                            </TableCell>
                            <TableCell style={{ width: columnWidths[3] }} className='flex-1 flex-row gap-2'>
                              <Button size='icon' variant="outline" onPress={() => openEditLockerDialog(locker)}>
                                <Edit />
                              </Button>
                              <Button size='icon' variant="destructive" onPress={() => openDeleteLockerDialog(locker)}>
                                <X color='white' />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      }} />}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </View>
      </ScrollView>
      <AddLockerDialog isAddDialogOpen={isAddDialogOpen} setIsAddDialogOpen={setIsAddDialogOpen} />
      <EditLockerDialog isEditDialogOpen={isEditDialogOpen} setIsEditDialogOpen={setIsEditDialogOpen} locker={selectedLocker} />
      <DeleteLockerDialog isDeleteDialogOpen={isDeleteDialogOpen} setIsDeleteDialogOpen={setIsDeleteDialogOpen} locker={selectedLocker} />
    </>
  )
} 