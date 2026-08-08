import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "AI Learning Reader | Toni",
  description: "AI material collection reading edition.",
};

export default function AiLearningPage() {
  redirect("/ai-learning/ai-learning-collection.html");
}
