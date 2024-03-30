import { JWTData } from "@/context/AuthContext";

export default function (text: Language, data: JWTData | null): string {
    return text[(data?.user?.preferredLanguage || "eng") as keyof Language] as string;
}