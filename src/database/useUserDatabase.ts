import { useSQLiteContext } from "expo-sqlite";

export interface User {
  id: number;
  name: string;
  username: string;
  registration: string;
  locker_id: string;
}

export function useUserDatabase() {
  const database = useSQLiteContext();

  async function create(data: Omit<User, "id">) {
    const statement = await database.prepareAsync(
      `INSERT INTO users (name, username, registration, locker_id) VALUES ($name, $username, $registration, $locker_id);`
    );

    try {
      const result = await statement.executeAsync({
        $name: data.name,
        $username: data.username,
        $registration: data.registration,
        $locker_id: data.locker_id,
      });

      const insertedRowId = result.lastInsertRowId.toLocaleString();
      return { insertedRowId };
    } catch (error) {
      throw new Error(
        `Failed to create user: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      await statement.finalizeAsync();
    }
  }

  return {
    create,
  };
}
