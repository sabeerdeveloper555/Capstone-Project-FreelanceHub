import { useEffect, useMemo, useState } from 'react';
import { Eye, Pencil, Plus, RefreshCcw, Trash2, Users } from 'lucide-react';
import { AppLayout } from '../components/layout';
import { Button, Card, EmptyState, Input, LoadingSkeleton, Modal, PageHeader } from '../components/ui';
import { createClient, deleteClient, getClients, updateClient } from '../services/clientService';
import { getErrorMessage } from '../utils';

const emptyForm = { name: '', email: '', phone: '', company: '', country: '', notes: '' };

function ClientForm({ initialValue, onSubmit, onCancel, isSubmitting }) {
  const [form, setForm] = useState(initialValue || emptyForm);
  const [formError, setFormError] = useState('');
  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const submit = async (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.email.trim()) { setFormError('Name and email are required.'); return; }
    setFormError('');
    await onSubmit({ ...form, name: form.name.trim(), email: form.email.trim() });
  };
  return <form onSubmit={submit} className="space-y-4">
    {formError && <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-400">{formError}</p>}
    <div className="grid gap-4 sm:grid-cols-2"><Input label="Name" id="client-name" name="name" value={form.name} onChange={update} required /><Input label="Email" id="client-email" name="email" type="email" value={form.email} onChange={update} required /><Input label="Company" id="client-company" name="company" value={form.company} onChange={update} /><Input label="Phone" id="client-phone" name="phone" value={form.phone} onChange={update} /><Input label="Country" id="client-country" name="country" value={form.country} onChange={update} /></div>
    <div><label className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300" htmlFor="client-notes">Notes</label><textarea id="client-notes" name="notes" value={form.notes} onChange={update} rows="3" className="w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-sm text-neutral-900 outline-none focus:border-brand-700 focus:ring-2 focus:ring-brand-700/10 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100" /></div>
    <div className="flex justify-end gap-2"><Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button><Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save client'}</Button></div>
  </form>;
}

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialog, setDialog] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadClients = async () => { setIsLoading(true); setError(''); try { setClients(await getClients()); } catch (err) { setError(getErrorMessage(err, 'Unable to load clients.')); } finally { setIsLoading(false); } };
  useEffect(() => { loadClients(); }, []);
  const visibleClients = useMemo(() => clients.filter((client) => `${client.name} ${client.email} ${client.company} ${client.phone}`.toLowerCase().includes(search.toLowerCase())), [clients, search]);
  const saveClient = async (data) => { setIsSubmitting(true); try { const saved = dialog.client ? await updateClient(dialog.client._id, data) : await createClient(data); setClients((current) => dialog.client ? current.map((client) => client._id === saved._id ? saved : client) : [saved, ...current]); setDialog(null); } catch (err) { setError(getErrorMessage(err, 'Unable to save client.')); } finally { setIsSubmitting(false); } };
  const removeClient = async (client) => { if (!window.confirm(`Delete ${client.name}?`)) return; try { await deleteClient(client._id); setClients((current) => current.filter((item) => item._id !== client._id)); } catch (err) { setError(getErrorMessage(err, 'Unable to delete client.')); } };

  return <AppLayout><div className="space-y-6">
    <PageHeader title="Clients" description="Manage your clients and their project relationships." action={<Button onClick={() => setDialog({ type: 'form' })}><Plus size={16} /> Add Client</Button>} />
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end"><div className="w-full sm:max-w-md"><Input label="Search clients" id="client-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Name, email, company, or phone" /></div><p className="pb-2 text-sm text-neutral-500 dark:text-neutral-400">{visibleClients.length} {visibleClients.length === 1 ? 'client' : 'clients'}</p></div>
    {error && <Card className="flex items-center gap-3 border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-400"><span className="flex-1">{error}</span><Button variant="danger" onClick={loadClients}><RefreshCcw size={15} /> Retry</Button></Card>}
    {isLoading ? <div className="space-y-3"><LoadingSkeleton className="h-16" /><LoadingSkeleton className="h-16" /><LoadingSkeleton className="h-16" /></div> : visibleClients.length === 0 ? <EmptyState compact icon={Users} title={search ? 'No matching clients' : 'No clients yet'} description={search ? 'Try a different search.' : 'Add your first client to start building your directory.'} action={!search && <Button onClick={() => setDialog({ type: 'form' })}><Plus size={16} /> Add Client</Button>} /> : <Card className="overflow-hidden"><div className="overflow-x-auto"><table className="w-full min-w-[700px] text-left"><thead className="border-b border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-800/50"><tr>{['Client', 'Company', 'Phone', 'Country', 'Actions'].map((heading) => <th key={heading} className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">{heading}</th>)}</tr></thead><tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">{visibleClients.map((client) => <tr key={client._id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40"><td className="max-w-[260px] px-5 py-4"><p className="truncate text-sm font-semibold text-neutral-900 dark:text-neutral-100">{client.name}</p><p className="truncate text-xs text-neutral-500 dark:text-neutral-400">{client.email}</p></td><td className="max-w-[180px] truncate px-5 py-4 text-sm text-neutral-600 dark:text-neutral-300">{client.company || '—'}</td><td className="whitespace-nowrap px-5 py-4 text-sm text-neutral-600 dark:text-neutral-300">{client.phone || '—'}</td><td className="px-5 py-4 text-sm text-neutral-600 dark:text-neutral-300">{client.country || '—'}</td><td className="px-5 py-4"><div className="flex gap-1"><Button variant="ghost" aria-label={`View ${client.name}`} onClick={() => setDialog({ type: 'view', client })}><Eye size={16} /></Button><Button variant="ghost" aria-label={`Edit ${client.name}`} onClick={() => setDialog({ type: 'form', client })}><Pencil size={16} /></Button><Button variant="ghost" className="text-red-700 hover:bg-red-50 hover:text-red-800" aria-label={`Delete ${client.name}`} onClick={() => removeClient(client)}><Trash2 size={16} /></Button></div></td></tr>)}</tbody></table></div></Card>}
    {dialog?.type === 'form' && <Modal title={dialog.client ? 'Edit client' : 'Add client'} onClose={() => setDialog(null)}><ClientForm initialValue={dialog.client} onSubmit={saveClient} onCancel={() => setDialog(null)} isSubmitting={isSubmitting} /></Modal>}
    {dialog?.type === 'view' && <Modal title={dialog.client.name} onClose={() => setDialog(null)}><div className="space-y-3 text-sm text-neutral-600 dark:text-neutral-300"><p><strong className="text-neutral-900 dark:text-neutral-100">Email:</strong> {dialog.client.email}</p><p><strong className="text-neutral-900 dark:text-neutral-100">Phone:</strong> {dialog.client.phone || '—'}</p><p><strong className="text-neutral-900 dark:text-neutral-100">Company:</strong> {dialog.client.company || '—'}</p><p><strong className="text-neutral-900 dark:text-neutral-100">Country:</strong> {dialog.client.country || '—'}</p><p><strong className="text-neutral-900 dark:text-neutral-100">Notes:</strong> {dialog.client.notes || '—'}</p></div></Modal>}
  </div></AppLayout>;
};

export default Clients;
