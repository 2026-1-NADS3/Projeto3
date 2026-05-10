import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { authService } from "@/services/auth.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/auth/recover-password")({
  head: () => ({
    meta: [
      { title: "Recuperar Senha — Maya RPG" },
      { name: "description", content: "Recupere o acesso ao painel da Clínica Maya RPG." },
    ],
  }),
  component: RecoverPasswordPage,
});

function RecoverPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMessage("Informe seu e-mail.");
      return;
    }
    setIsLoading(true);
    setErrorMessage("");
    try {
      await authService.recoverPassword(email);
      setSent(true);
      toast.success("Código de recuperação enviado!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao enviar código de recuperação.";
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-primary/80 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 h-64 w-64 rounded-full bg-white" />
          <div className="absolute bottom-20 right-20 h-48 w-48 rounded-full bg-white" />
        </div>
        <div className="relative z-10 text-center">
          <div className="mx-auto mb-4 grid h-20 w-20 place-items-center rounded-2xl bg-gold text-gold-foreground shadow-elevated">
            <span className="font-display text-3xl font-semibold">M</span>
          </div>
          <h1 className="font-display text-5xl font-semibold text-primary-foreground">maya</h1>
          <p className="font-display text-2xl text-primary-foreground/80">yamamoto</p>
          <p className="mt-2 text-xs uppercase tracking-[0.3em] text-primary-foreground/60">
            rpg • fisioterapia
          </p>
        </div>
      </div>

      <div className="flex w-full items-center justify-center px-4 lg:w-1/2 bg-background">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center lg:text-left">
            <div className="lg:hidden mb-6 text-center">
              <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-xl bg-gold text-gold-foreground shadow-elevated">
                <span className="font-display text-2xl font-semibold">M</span>
              </div>
              <h1 className="font-display text-3xl font-semibold">maya yamamoto</h1>
              <p className="text-xs uppercase tracking-[0.3em] text-gold">rpg • fisioterapia</p>
            </div>
            <h2 className="font-display text-2xl font-semibold">Recuperar Senha</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {sent
                ? "Verifique sua caixa de entrada para o código de recuperação."
                : "Informe seu e-mail para receber um código de recuperação."}
            </p>
          </div>

          {sent ? (
            <div className="space-y-4">
              <div className="rounded-2xl border border-border bg-muted/30 p-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Um código de recuperação foi enviado para{" "}
                  <strong className="text-foreground">{email}</strong>.
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Verifique também a pasta de spam ou lixo eletrônico.
                </p>
              </div>
              <Button asChild variant="outline" className="h-11 w-full rounded-full">
                <a href="/auth/login">Voltar para o login</a>
              </Button>
              <Button
                variant="ghost"
                className="h-11 w-full rounded-full"
                onClick={() => {
                  setSent(false);
                  setEmail("");
                }}
              >
                Enviar novamente
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail cadastrado</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="exemplo@clinicamaya.com.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 rounded-xl"
                  required
                />
              </div>

              {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}

              <Button
                type="submit"
                className="h-11 w-full rounded-full text-sm font-medium"
                disabled={isLoading}
              >
                {isLoading ? "Enviando..." : "Enviar Código"}
              </Button>

              <div className="text-center">
                <a href="/auth/login" className="text-sm text-primary hover:underline">
                  Lembrou a senha? Faça login
                </a>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
