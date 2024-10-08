"use client";

import qs from "query-string";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDebounceValue } from "usehooks-ts";
import {
  ChangeEvent,
  useEffect,
  useState,
} from "react";
import { Input } from "@/components/ui/input";

export const SearchInput = () => {
  const router = useRouter();
  const [value, setValue] = useState("");
  // Trigger 500ms after stopped typing
  const debouncedValue = useDebounceValue(value, 500);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  }

  useEffect(() => {
    const url = qs.stringifyUrl({
      url: "/",
      query: {
        search: debouncedValue[0],
      },
    }, { skipEmptyString: true, skipNull: true });
    router.push(url);
    }, [debouncedValue, router]);

  return (
    <div className="w-full relative">
      < Search
        className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500 h-4 w-4"
      />
      <Input 
        className="pl-10 w-full max-w-[516px]"
        placeholder="Search boards..."
        onChange={handleChange}
        value={value}
      />
    </div>
  );
} 