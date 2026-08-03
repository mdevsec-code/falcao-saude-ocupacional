import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/Dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';

import {
  atestadoFormSchema,
  SECTORS,
  toFormInput,
  type AtestadoFormInput,
  type AtestadoRecord,
} from '../types';

function emptyValues(): AtestadoFormInput {
  const today = new Date().toISOString().slice(0, 10);
  return {
    nome: '',
    ponto: undefined,
    setor: SECTORS[0],
    funcao: undefined,
    cid: undefined,
    inicioAtestado: '',
    terminoAtestado: '',
    dataLancamento: today,
    liderancaDireta: undefined,
    medico: undefined,
    crmCro: undefined,
    localAtendimento: undefined,
    observacao: undefined,
  };
}

interface AtestadoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingRecord: AtestadoRecord | null;
  onSubmit: (input: AtestadoFormInput) => void;
  isSubmitting: boolean;
}

export function AtestadoDialog({
  open,
  onOpenChange,
  editingRecord,
  onSubmit,
  isSubmitting,
}: AtestadoDialogProps) {
  const { t } = useTranslation('atestados');
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AtestadoFormInput>({
    resolver: zodResolver(atestadoFormSchema),
    mode: 'onTouched',
    defaultValues: emptyValues(),
  });

  useEffect(() => {
    if (!open) return;
    reset(editingRecord ? toFormInput(editingRecord) : emptyValues());
  }, [open, editingRecord, reset]);

  const submit = handleSubmit((data) => onSubmit(data));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {editingRecord ? t('atestados:dialog.editTitle') : t('atestados:dialog.createTitle')}
          </DialogTitle>
          <DialogDescription>
            {editingRecord
              ? t('atestados:dialog.editDescription')
              : t('atestados:dialog.createDescription')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} noValidate className="max-h-[70vh] space-y-4 overflow-y-auto pr-1">
          <div className="grid grid-cols-2 gap-3">
            <Input
              {...register('nome')}
              label={t('atestados:dialog.fields.nome.label')}
              placeholder={t('atestados:dialog.fields.nome.placeholder')}
              error={errors.nome?.message}
              required
              className="col-span-2"
            />

            <Input
              {...register('ponto')}
              label={t('atestados:dialog.fields.ponto.label')}
              placeholder={t('atestados:dialog.fields.ponto.placeholder')}
              error={errors.ponto?.message}
            />

            <Input
              {...register('funcao')}
              label={t('atestados:dialog.fields.funcao.label')}
              placeholder={t('atestados:dialog.fields.funcao.placeholder')}
              error={errors.funcao?.message}
            />
          </div>

          <div>
            <Label htmlFor="atestado-setor">{t('atestados:dialog.fields.setor.label')}</Label>
            <Controller
              control={control}
              name="setor"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="atestado-setor" className="mt-1 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SECTORS.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              {...register('inicioAtestado')}
              type="date"
              label={t('atestados:dialog.fields.inicioAtestado.label')}
              error={errors.inicioAtestado?.message}
              required
            />
            <Input
              {...register('terminoAtestado')}
              type="date"
              label={t('atestados:dialog.fields.terminoAtestado.label')}
              error={errors.terminoAtestado?.message}
              required
            />
          </div>

          <Input
            {...register('dataLancamento')}
            type="date"
            label={t('atestados:dialog.fields.dataLancamento.label')}
            error={errors.dataLancamento?.message}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              {...register('cid')}
              label={t('atestados:dialog.fields.cid.label')}
              placeholder={t('atestados:dialog.fields.cid.placeholder')}
              error={errors.cid?.message}
            />
            <Input
              {...register('liderancaDireta')}
              label={t('atestados:dialog.fields.liderancaDireta.label')}
              placeholder={t('atestados:dialog.fields.liderancaDireta.placeholder')}
              error={errors.liderancaDireta?.message}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              {...register('medico')}
              label={t('atestados:dialog.fields.medico.label')}
              placeholder={t('atestados:dialog.fields.medico.placeholder')}
              error={errors.medico?.message}
            />
            <Input
              {...register('crmCro')}
              label={t('atestados:dialog.fields.crmCro.label')}
              placeholder={t('atestados:dialog.fields.crmCro.placeholder')}
              error={errors.crmCro?.message}
            />
          </div>

          <Input
            {...register('localAtendimento')}
            label={t('atestados:dialog.fields.localAtendimento.label')}
            placeholder={t('atestados:dialog.fields.localAtendimento.placeholder')}
            error={errors.localAtendimento?.message}
          />

          <Textarea
            {...register('observacao')}
            label={t('atestados:dialog.fields.observacao.label')}
            placeholder={t('atestados:dialog.fields.observacao.placeholder')}
            error={errors.observacao?.message}
            rows={2}
          />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t('atestados:dialog.cancel')}
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              {editingRecord
                ? t('atestados:dialog.submitEdit')
                : t('atestados:dialog.submitCreate')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
