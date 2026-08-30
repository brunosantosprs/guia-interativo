'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Loader2, Pencil, Plus, Trash2, UserPlus } from 'lucide-react';
import { ROLE_LABELS } from '@/lib/constants';
import { formatDateShort, initials } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Field } from '@/components/admin/form-fields';
import { ImageField } from '@/components/admin/image-field';
import { AvatarPosition } from '@/components/admin/avatar-position';
import { useToast } from '@/hooks/use-toast';
import type { Role } from '@prisma/client';

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: Role;
  image: string | null;
  imagePosition: string | null;
  bio: string | null;
  active: boolean;
  createdAt: Date;
  _count: { posts: number };
}

interface UserManagerProps {
  users: UserRow[];
  currentUserId: string;
}

const EMPTY = {
  name: '',
  email: '',
  password: '',
  role: 'AUTHOR' as Role,
  bio: '',
  image: '',
  imagePosition: '',
  active: true,
};

/** Gerenciamento de contas com acesso ao painel. */
export function UserManager({ users, currentUserId }: UserManagerProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [editing, setEditing] = useState<UserRow | null>(null);
  const [creating, setCreating] = useState(false);
  const [removing, setRemoving] = useState<UserRow | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(EMPTY);

  function openCreate() {
    setForm(EMPTY);
    setCreating(true);
  }

  function openEdit(user: UserRow) {
    setForm({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      bio: user.bio ?? '',
      image: user.image ?? '',
      imagePosition: user.imagePosition ?? '',
      active: user.active,
    });
    setEditing(user);
  }

  async function save() {
    setSaving(true);
    const isEdit = Boolean(editing);

    try {
      const payload: Record<string, unknown> = { ...form };
      // Em edição, senha vazia significa "manter a atual"
      if (isEdit && !form.password) delete payload.password;

      const response = await fetch(isEdit ? `/api/users/${editing!.id}` : '/api/users', {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        toast({
          variant: 'destructive',
          title: 'Não foi possível salvar',
          description: result.error ?? 'Verifique os dados informados.',
        });
        return;
      }

      toast({ variant: 'success', title: 'Salvo', description: result.message });
      setCreating(false);
      setEditing(null);
      router.refresh();
    } catch {
      toast({ variant: 'destructive', title: 'Falha de conexão' });
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!removing) return;
    setSaving(true);

    try {
      const response = await fetch(`/api/users/${removing.id}`, { method: 'DELETE' });
      const result = await response.json();

      if (!response.ok || !result.success) {
        toast({
          variant: 'destructive',
          title: 'Não foi possível excluir',
          description: result.error,
        });
        return;
      }

      toast({ variant: 'success', title: 'Usuário excluído' });
      setRemoving(null);
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  const dialogOpen = creating || Boolean(editing);

  return (
    <>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl">Usuários</h1>
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            <strong className="font-medium text-foreground">Administrador</strong> tem acesso total.{' '}
            <strong className="font-medium text-foreground">Editor</strong> gerencia todo o
            conteúdo. <strong className="font-medium text-foreground">Autor</strong> cria e edita
            apenas os próprios artigos.
          </p>
        </div>

        <Button onClick={openCreate}>
          <UserPlus className="h-4 w-4" />
          Novo usuário
        </Button>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-background">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {['Usuário', 'Papel', 'Artigos', 'Desde', 'Status', ''].map((column) => (
                  <th
                    key={column}
                    className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground last:text-right"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {users.map((user) => (
                <tr key={user.id} className="transition-colors hover:bg-surface">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      {user.image ? (
                        <Image
                          src={user.image}
                          alt={user.name}
                          width={36}
                          height={36}
                          className="h-9 w-9 rounded-full border border-border"
                        />
                      ) : (
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-surface text-xs font-medium">
                          {initials(user.name)}
                        </span>
                      )}
                      <div className="min-w-0">
                        <p className="truncate font-medium">
                          {user.name}
                          {user.id === currentUserId ? (
                            <span className="ml-2 text-xs text-muted-foreground">(você)</span>
                          ) : null}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-3.5">
                    <Badge variant={user.role === 'ADMIN' ? 'accent' : 'muted'}>
                      {ROLE_LABELS[user.role]}
                    </Badge>
                  </td>

                  <td className="px-5 py-3.5 text-muted-foreground">{user._count.posts}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">
                    {formatDateShort(user.createdAt)}
                  </td>

                  <td className="px-5 py-3.5">
                    <Badge variant={user.active ? 'success' : 'muted'}>
                      {user.active ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </td>

                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => openEdit(user)}
                        className="rounded-md p-2 text-muted-foreground transition-colors hover:text-foreground"
                        title="Editar"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>

                      {user.id !== currentUserId ? (
                        <button
                          type="button"
                          onClick={() => setRemoving(user)}
                          className="rounded-md p-2 text-muted-foreground transition-colors hover:text-destructive"
                          title="Excluir"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Criação / edição */}
      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setCreating(false);
            setEditing(null);
          }
        }}
      >
        <DialogContent className="max-h-[85dvh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? 'Editar usuário' : 'Novo usuário'}</DialogTitle>
            <DialogDescription>
              {editing
                ? 'Deixe a senha em branco para mantê-la inalterada.'
                : 'A senha inicial pode ser alterada depois pelo próprio usuário.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Field label="Nome" required htmlFor="user-name">
              <Input
                id="user-name"
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
              />
            </Field>

            <Field label="E-mail" required htmlFor="user-email">
              <Input
                id="user-email"
                type="email"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
              />
            </Field>

            <Field
              label={editing ? 'Nova senha' : 'Senha'}
              required={!editing}
              htmlFor="user-password"
              hint="Mínimo de 8 caracteres."
            >
              <Input
                id="user-password"
                type="password"
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                placeholder={editing ? 'Manter a senha atual' : ''}
              />
            </Field>

            <Field label="Papel" htmlFor="user-role">
              <Select
                value={form.role}
                onValueChange={(value) => setForm({ ...form, role: value as Role })}
              >
                <SelectTrigger id="user-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(['ADMIN', 'EDITOR', 'AUTHOR'] as const).map((role) => (
                    <SelectItem key={role} value={role}>
                      {ROLE_LABELS[role]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Biografia" htmlFor="user-bio" hint="Exibida ao final dos artigos.">
              <Textarea
                id="user-bio"
                rows={3}
                value={form.bio}
                onChange={(event) => setForm({ ...form, bio: event.target.value })}
              />
            </Field>

            {/*
              Mesmo campo dos outros formulários do painel: envia o arquivo,
              abre a biblioteca de mídia e ainda aceita colar uma URL. Antes
              aqui só cabia o caminho digitado, o que obrigava a subir a foto
              por outra tela e voltar com o endereço na mão.
            */}
            <ImageField
              label="Foto do autor"
              folder="autores"
              aspect="square"
              value={form.image}
              onChange={(url) => setForm({ ...form, image: url })}
              hint="Aparece no rodapé dos artigos assinados. Quadrada fica melhor."
            />

            <AvatarPosition
              src={form.image}
              value={form.imagePosition}
              onChange={(imagePosition) => setForm({ ...form, imagePosition })}
            />

            <div className="flex items-center justify-between gap-4 rounded-md border border-border p-3.5">
              <div>
                <Label htmlFor="user-active">Conta ativa</Label>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Contas inativas não conseguem fazer login.
                </p>
              </div>
              <Switch
                id="user-active"
                checked={form.active}
                onCheckedChange={(checked) => setForm({ ...form, active: checked })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setCreating(false);
                setEditing(null);
              }}
              disabled={saving}
            >
              Cancelar
            </Button>
            <Button onClick={save} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Exclusão */}
      <Dialog open={Boolean(removing)} onOpenChange={(open) => !open && setRemoving(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir usuário?</DialogTitle>
            <DialogDescription>
              <span className="font-medium text-foreground">{removing?.name}</span> perderá o acesso
              permanentemente. Usuários com artigos publicados não podem ser excluídos — desative a
              conta.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={() => setRemoving(null)} disabled={saving}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={remove} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
