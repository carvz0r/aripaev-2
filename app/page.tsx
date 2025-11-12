import { TypographyH1 } from "@/components/ui/h1";
import Calculator from "./components/calculator";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 font-sans dark:bg-gray-900">
      <main className="flex min-h-screen w-full md:max-w-5xl flex-col items-center sm:items-start shadow-xl shadow-gray-200 dark:shadow-gray-700 bg-white dark:bg-gray-800 gap-16 px-8 py-10 md:py-20 md:px-16">
        <TypographyH1>🇪🇪 Estonian Salary Calculator</TypographyH1>
        <Calculator/>
      </main>
    </div>
  );
}
