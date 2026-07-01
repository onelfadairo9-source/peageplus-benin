import { useEffect, useState } from "react";
import { useRouter } from "next/router";

/** Vérifie la session admin ; redirige vers /admin/login si non authentifié. */
export function useAdminGuard() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    fetch("/api/admin/me")
      .then((res) => {
        if (!res.ok) {
          router.replace("/admin/login");
        } else {
          setReady(true);
        }
      })
      .catch(() => router.replace("/admin/login"));
  }, [router]);

  return ready;
}
