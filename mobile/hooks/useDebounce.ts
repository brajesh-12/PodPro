import { useEffect, useState } from "react";

const useDebounce = (query: string, delay: number) => {
  const [debounceValue, setDebounceValue] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => setDebounceValue(query), delay);

    return () => clearTimeout(handler);
  }, [query, delay]);

  return debounceValue;
}

export default useDebounce;