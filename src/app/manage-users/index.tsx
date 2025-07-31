import { FlashList } from '@shopify/flash-list';
import { Edit, Plus, X } from "lucide-react-native";
import { useEffect, useMemo, useState } from 'react';
import { ScrollView, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { users as schemaUsers, User } from "~/db/schema";
import { AddUserDialog } from '~/src/components/add-user-dialog';
import { DeleteUserDialog } from '~/src/components/delete-user-dialog';
import { EditUserDialog } from '~/src/components/edit-user-dialog';
import { Header } from "~/src/components/header";
import { Button } from "~/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from '~/src/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/src/components/ui/table";
import { Text } from "~/src/components/ui/text";
import { useDatabase } from "~/src/hooks/use-database";
import { cn } from '~/src/lib/utils';

const MIN_COLUMN_WIDTHS = [120, 120, 100, 120];

export default function ManageUsers() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { drizzleDb } = useDatabase();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  const columnWidths = useMemo(() => {
    return MIN_COLUMN_WIDTHS.map((minWidth) => {
      const evenWidth = width / MIN_COLUMN_WIDTHS.length;
      return evenWidth > minWidth ? evenWidth : minWidth;
    });
  }, [width]);

  const openAddUserDialog = () => {
    setIsAddDialogOpen(true);
  };

  useEffect(() => {
    async function fetchUsers() {
      try {
        const result = drizzleDb.select().from(schemaUsers).all();
        setUsers(result);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    }

    fetchUsers();
  }, [isAddDialogOpen,
    isEditDialogOpen,
    isDeleteDialogOpen])

  console.log('users', JSON.stringify(users, null, 2));

  const openDeleteUserDialog = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  }

  const openEditUserDialog = (user: User) => {
    setSelectedUser(user)
    setIsEditDialogOpen(true);
  };

  return (
    <>
      <ScrollView bounces={false} className="min-h-full bg-gray-50 py-10">
        <Header title="Gerenciar Usuários" subtitle="Adicione, edite e remova usuários do sistema" />
        <View className="flex flex-col px-6 gap-4">
          <Button
            onPress={openAddUserDialog}
            className="mt-4 md:mt-0 gap-2"
          >
            <View className="flex flex-row items-center gap-2">
              <Plus color='white' className="h-4 w-4" />
              <Text>Adicionar Usuário</Text>
            </View>
          </Button>

          <Card>
            <CardHeader>
              <CardTitle>Lista de Usuários</CardTitle>
            </CardHeader>
            <CardContent>
              <Table aria-labelledby='users-table'>
                <TableHeader>
                  <TableRow>
                    <TableHead style={{ width: 80 }}>
                      <Text>Nome</Text>
                    </TableHead>
                    <TableHead style={{ width: columnWidths[1] }}>
                      <Text>Usuário</Text>
                    </TableHead>
                    <TableHead style={{ width: columnWidths[2] }}>
                      <Text>Matrícula</Text>
                    </TableHead>
                    <TableHead style={{ width: columnWidths[4] }}>
                      <Text>Ações</Text>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.length > 0 &&
                    <FlashList
                      showsVerticalScrollIndicator={false}
                      contentContainerStyle={{
                        paddingBottom: insets.bottom,
                      }}
                      estimatedItemSize={110}
                      data={users}
                      renderItem={({ item: user, index }) => {
                        return (
                          <TableRow className={cn('active:bg-secondary', index % 2 && 'bg-muted/40 ')}
                            key={user.id}>
                            <TableCell style={{ width: 80 }}>
                              <Text>{user.name}</Text>
                            </TableCell>
                            <TableCell style={{ width: columnWidths[1] }}>
                              <Text>{user.username}</Text>
                            </TableCell>
                            <TableCell style={{ width: columnWidths[2] }}>
                              <Text>{user.registration}</Text>
                            </TableCell>
                            <TableCell style={{ width: columnWidths[4] }} className='flex-1 flex-row gap-2'>
                              <Button size='icon' variant="outline" onPress={() => openEditUserDialog(user)}>
                                <Edit />
                              </Button>
                              <Button size='icon' variant="destructive" onPress={() => openDeleteUserDialog(user)}>
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
      <AddUserDialog isAddDialogOpen={isAddDialogOpen} setIsAddDialogOpen={setIsAddDialogOpen} />
      <EditUserDialog isEditDialogOpen={isEditDialogOpen} setIsEditDialogOpen={setIsEditDialogOpen} user={selectedUser} />
      <DeleteUserDialog isDeleteDialogOpen={isDeleteDialogOpen} setIsDeleteDialogOpen={setIsDeleteDialogOpen} user={selectedUser} />
    </>

  )
} 