import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Card } from '../../components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { mockCommonExpenses } from '../../data/mockData';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { CommonExpense } from '../../types';
import { formatCurrency, formatDate } from '../../lib/utils';
import { toast } from 'sonner';

export const ExpensesPage = () => {
  const [expenses, setExpenses] = useState(mockCommonExpenses);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<CommonExpense | null>(null);
  const [formData, setFormData] = useState<Partial<CommonExpense>>({
    concept: '',
    amount: 0,
    month: '',
    description: '',
    status: 'draft',
  });

  const handleOpenDialog = (expense?: CommonExpense) => {
    if (expense) {
      setEditingExpense(expense);
      setFormData(expense);
    } else {
      setEditingExpense(null);
      setFormData({
        concept: '',
        amount: 0,
        month: '',
        description: '',
        status: 'draft',
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (editingExpense) {
      setExpenses(
        expenses.map((e) =>
          e.id === editingExpense.id
            ? { ...e, ...formData }
            : e
        )
      );
      toast.success('Gasto actualizado correctamente');
    } else {
      const newExpense: CommonExpense = {
        id: (expenses.length + 1).toString(),
        createdAt: new Date(),
        ...(formData as Omit<CommonExpense, 'id' | 'createdAt'>),
      };
      setExpenses([newExpense, ...expenses]);
      toast.success('Gasto creado correctamente');
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setExpenses(expenses.filter((e) => e.id !== id));
    toast.success('Gasto eliminado correctamente');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Gestión de Gastos Comunes</h1>
          <p className="text-muted-foreground">
            Registra y administra los gastos comunes mensuales
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Gasto
        </Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Concepto</TableHead>
              <TableHead>Mes</TableHead>
              <TableHead>Monto</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Fecha Creación</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{expense.concept}</div>
                    <div className="text-sm text-muted-foreground">
                      {expense.description}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{expense.month}</TableCell>
                <TableCell className="font-medium">
                  {formatCurrency(expense.amount)}
                </TableCell>
                <TableCell>
                  <Badge variant={expense.status === 'published' ? 'success' : 'pending'}>
                    {expense.status === 'published' ? 'Publicado' : 'Borrador'}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(expense.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenDialog(expense)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(expense.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingExpense ? 'Editar Gasto Común' : 'Nuevo Gasto Común'}
            </DialogTitle>
            <DialogDescription>
              Completa la información del gasto común
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="concept">Concepto</Label>
              <Input
                id="concept"
                value={formData.concept}
                onChange={(e) => setFormData({ ...formData, concept: e.target.value })}
                placeholder="Gastos Comunes Junio 2026"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="amount">Monto</Label>
              <Input
                id="amount"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="month">Mes</Label>
              <Input
                id="month"
                type="month"
                value={formData.month}
                onChange={(e) => setFormData({ ...formData, month: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Descripción</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Gastos de mantenimiento, agua, luz común"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status">Estado</Label>
              <select
                id="status"
                className="flex h-10 w-full rounded-lg border border-input bg-input-background px-3 py-2"
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as 'draft' | 'published' })
                }
              >
                <option value="draft">Borrador</option>
                <option value="published">Publicado</option>
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
