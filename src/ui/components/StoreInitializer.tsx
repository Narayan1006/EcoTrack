"use client";

import { useEffect } from "react";
import { initializeStore } from "@/ui/store";

export default function StoreInitializer() {
  useEffect(() => {
    initializeStore();
  }, []);
  return null;
}
