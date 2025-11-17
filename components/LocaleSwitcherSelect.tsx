"use client";

import clsx from "clsx";
import { Locale } from "next-intl";
import { useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { SelectViewport } from "@radix-ui/react-select";
import { useParams } from "next/navigation";

type Props = {
  options: { value: Locale; label: string; flag: string }[];
  defaultValue: string;
};

export default function LocaleSwitcherSelect({ options, defaultValue }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [isPending, startTransition] = useTransition();

  const switchLocale = (nextLocale: Locale) => {
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks.
        { pathname, params },
        { locale: nextLocale }
      );
    });
  };

  return (
    <div className="flex flex-col">
      <Select value={defaultValue} onValueChange={switchLocale}>
        <SelectTrigger
          className={clsx(
            "inline-flex items-center justify-between rounded px-3 py-2 text-sm",
            isPending && "opacity-50"
          )}
          
        >
          <SelectValue placeholder="Select language" />
        </SelectTrigger>
        <SelectContent className="rounded mt-1">
          <SelectViewport>
            {options.map(({ value, label, flag }) => (
              <SelectItem
                key={value}
                value={value}
                className="px-3 py-2 cursor-pointer hover:bg-gray-100"
              >
                <span>{flag}</span>{label}
              </SelectItem>
            ))}
          </SelectViewport>
        </SelectContent>
      </Select>
    </div>
  );
}
