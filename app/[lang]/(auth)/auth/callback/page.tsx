import { Suspense } from "react";
import AuthCallbackClient from "./callback-client";

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
          <div className="size-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <AuthCallbackClient />
    </Suspense>
  );
}
