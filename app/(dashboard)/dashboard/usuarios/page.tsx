import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getUsers } from '@/lib/queries';
import { updateUserRoleAction } from './actions';
import { SubmitButton } from '@/components/forms/submit-button';

const roles = ['admin', 'recepcion', 'especialista', 'caja', 'gerencia', 'paciente'];

export default async function UsuariosPage() {
  const users = await getUsers();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Usuarios y roles</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {users.map((user: any) => (
          <form key={user.id} action={updateUserRoleAction} className="grid gap-3 rounded-2xl border border-slate-200 p-4 md:grid-cols-5">
            <input type="hidden" name="id" value={user.id} />
            <input name="full_name" defaultValue={user.full_name} className="rounded-xl border border-slate-200 px-3 py-2" />
            <input name="phone" defaultValue={user.phone ?? ''} className="rounded-xl border border-slate-200 px-3 py-2" />
            <select name="role" defaultValue={user.role} className="rounded-xl border border-slate-200 px-3 py-2">
              {roles.map((role) => <option key={role} value={role}>{role}</option>)}
            </select>
            <select name="status" defaultValue={user.status} className="rounded-xl border border-slate-200 px-3 py-2">
              <option value="activo">activo</option>
              <option value="inactivo">inactivo</option>
            </select>
            <SubmitButton>Actualizar</SubmitButton>
          </form>
        ))}
      </CardContent>
    </Card>
  );
}
