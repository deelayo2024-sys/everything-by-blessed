import { useState } from "react";
import { useAdminLogin } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { getGetAdminSessionQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Spinner } from "@/components/ui/spinner";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = useAdminLogin();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login.mutateAsync({ data: { email, password } });
      queryClient.invalidateQueries({ queryKey: getGetAdminSessionQueryKey() });
      toast({ title: "Welcome back", description: "Successfully logged in." });
    } catch (err: any) {
      toast({
        title: "Access Denied",
        description: err?.message || "Invalid credentials",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(200,50,120,0.15),transparent_50%)]" />
      
      <div className="w-full max-w-md relative z-10 bg-card/40 backdrop-blur-xl border border-primary/20 p-8 rounded-2xl shadow-2xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-serif text-primary mb-2">Admin Portal</h1>
          <p className="text-sm text-muted-foreground uppercase tracking-widest">Everything by Blessed</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="uppercase tracking-widest text-xs text-muted-foreground">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-background/50 border-primary/20 focus-visible:border-primary/50 text-foreground"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="uppercase tracking-widest text-xs text-muted-foreground">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-background/50 border-primary/20 focus-visible:border-primary/50 text-foreground"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 uppercase tracking-widest"
            disabled={login.isPending}
          >
            {login.isPending ? <Spinner className="w-5 h-5" /> : "Authenticate"}
          </Button>
        </form>
      </div>
    </div>
  );
}
