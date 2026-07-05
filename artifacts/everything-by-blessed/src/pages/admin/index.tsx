import { useGetAdminSession } from "@workspace/api-client-react";
import { Spinner } from "@/components/ui/spinner";
import Login from "./login";
import Dashboard from "./dashboard";

export default function Admin() {
  const { data: session, isLoading } = useGetAdminSession();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Spinner className="w-12 h-12 text-primary" />
      </div>
    );
  }

  if (!session?.authenticated) {
    return <Login />;
  }

  return <Dashboard />;
}
