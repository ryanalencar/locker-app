import { drizzle } from "drizzle-orm/expo-sqlite";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { useSQLiteContext } from "expo-sqlite";
import * as schema from "~/db/schema";

export function useDatabase() {
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });
  
  useDrizzleStudio(db);

  return { drizzleDb };
}
