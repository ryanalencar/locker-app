import { Href, Link } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { View } from "react-native";
import { Button } from "./ui/button";
import { Text } from "./ui/text";

interface HeaderProps {
  title: string;
  subtitle?: string;
  href: Href;
}

export function Header({ title, href, subtitle }: HeaderProps) {
  return (
    <View className="mb-6 flex flex-row gap-2 items-center">
      <Link href={href}>
        <Button variant="ghost" size="icon" className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </Link>
      <View className="flex gap-0">
        <Text className="text-2xl font-bold">{title}</Text>
        {subtitle && <Text className="text-muted-foreground">{subtitle}</Text>}
      </View>
    </View>
  )
}