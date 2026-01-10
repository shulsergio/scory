"use client";

import css from "./page.module.css";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { toast } from "react-hot-toast";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    toast.success("You are signed");
    router.push("/enter");
  }, [router]);
  return (
    <div className={css.page}>
      <main className={css.main}></main>
    </div>
  );
}
