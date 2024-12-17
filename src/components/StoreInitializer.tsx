"use client";

import { useEffect } from "react";
import { usePersonaStore } from "@/store/usePersonaStore";

export default function StoreInitializer() {
  const fetchPersonas = usePersonaStore((state) => state.fetchPersonas);
  useEffect(() => {
    fetchPersonas();
  }, [fetchPersonas]);

  return null;
}
