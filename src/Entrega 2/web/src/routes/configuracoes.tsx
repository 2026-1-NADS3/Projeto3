import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, Button, Badge, ShellTitle } from "@/components/app-shell";
import { Mail, ShieldCheck, Download, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { lgpdService } from "@/services/lgpd.service";
import { authService } from "@/services/auth.service";
import { useAuth } from "@/contexts/auth";

export const Route = createFileRoute("/configuracoes")({
  head: () => ({
    meta: [
      { title: "Configurações — Maya RPG" },
      { name: "description", content: "Ajustes básicos do painel profissional da clínica." },
    ],
  }),
  component: ConfiguracoesPage,
});

const inputCls =
  "h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition focus:border-primary";

function ConfiguracoesPage() {
  const { user } = useAuth();

  const emailChangeMutation = useMutation({
    mutationFn: () => authService.requestCurrentEmailChangeCode(),
    onSuccess: () => {
      toast.success("Código enviado para o e-mail atual");
    },
    onError: () => {
      toast.error("Erro ao enviar código");
    },
  });

  const exportDataMutation = useMutation({
    mutationFn: () => lgpdService.exportData(),
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "meus-dados.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success("Exportação concluída");
    },
    onError: () => {
      toast.error("Erro ao exportar dados");
    },
  });

  const anonymizeMutation = useMutation({
    mutationFn: () => lgpdService.anonymizeData(),
    onSuccess: () => {
      toast.success("Solicitação de anonimização registrada");
    },
    onError: () => {
      toast.error("Erro ao solicitar anonimização");
    },
  });

  return (
    <>
      <ShellTitle
        title="Configurações"
        subtitle="Personalize a clínica, sua conta e preferências de privacidade."
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <div className="flex items-center gap-2 text-primary">
            <Mail className="h-4 w-4" />
            <h3 className="font-display text-lg">Troca segura de e-mail</h3>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Enviaremos uma confirmação para o e-mail atual e o novo.
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                E-mail atual
              </label>
              <input
                className={inputCls}
                defaultValue={user?.email ?? "maya@mayarpg.com"}
                readOnly
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Novo e-mail
              </label>
              <input className={inputCls} type="email" placeholder="novo@email.com" />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button
              variant="gold"
              onClick={() => emailChangeMutation.mutate()}
              disabled={emailChangeMutation.isPending}
            >
              {emailChangeMutation.isPending ? "Enviando..." : "Solicitar troca"}
            </Button>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-2 text-coral-foreground">
            <ShieldCheck className="h-4 w-4" />
            <h3 className="font-display text-lg">Privacidade & LGPD</h3>
          </div>
          <ul className="mt-3 space-y-2 text-sm">
            <li className="flex items-center justify-between rounded-lg border border-border p-3">
              <span className="flex items-center gap-2">
                <Download className="h-4 w-4 text-muted-foreground" /> Exportar dados
              </span>
              <Button
                variant="outline"
                onClick={() => exportDataMutation.mutate()}
                disabled={exportDataMutation.isPending}
              >
                {exportDataMutation.isPending ? "Exportando..." : "Exportar"}
              </Button>
            </li>
            <li className="flex items-center justify-between rounded-lg border border-border p-3">
              <span className="flex items-center gap-2">
                <EyeOff className="h-4 w-4 text-muted-foreground" /> Anonimizar dados
              </span>
              <Button
                variant="outline"
                onClick={() => {
                  if (
                    confirm(
                      "Tem certeza que deseja anonimizar seus dados? Esta ação é irreversível.",
                    )
                  )
                    anonymizeMutation.mutate();
                }}
                disabled={anonymizeMutation.isPending}
              >
                {anonymizeMutation.isPending ? "Anonimizando..." : "Anonimizar"}
              </Button>
            </li>
          </ul>
          <Badge tone="success">Conformidade LGPD ativa</Badge>
        </Card>
      </div>
    </>
  );
}
