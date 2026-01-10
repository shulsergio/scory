"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function One() {
  const router = useRouter();
  useEffect(() => {
    // toast.success("You are signed");
    router.push("/enter");
  }, [router]);
  return (
    <>
      <div className="one"></div>
    </>
  );
}
