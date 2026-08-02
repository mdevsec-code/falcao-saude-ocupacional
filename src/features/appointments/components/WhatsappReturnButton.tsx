import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageCircle, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/Dialog';
import { buildWhatsappUrl, normalizeBrazilPhone } from '@/utils/exports/whatsapp';
import type { PhoneContact } from '@/utils/exports/types';

interface WhatsappReturnButtonProps {
  /** Contato pré-preenchido. Se o telefone vier vazio, o botão abre um modal para digitá-lo. */
  contact?: PhoneContact;
  /** Texto da mensagem (sem o nome do paciente, que é acrescentado automaticamente). */
  message: string;
  /** Rótulo do botão. */
  label?: string;
  /** Variante do botão. */
  variant?: 'primary' | 'outline' | 'secondary' | 'ghost';
  /** Tamanho do botão. */
  size?: 'sm' | 'md' | 'lg';
}

export function WhatsappReturnButton({
  contact,
  message,
  label,
  variant = 'secondary',
  size = 'sm',
}: WhatsappReturnButtonProps) {
  const { t } = useTranslation('appointments');
  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState(contact?.phone ?? '');
  const [name, setName] = useState(contact?.name ?? '');

  const buttonLabel = label ?? t('whatsappReturn.label');
  const effectiveName = contact?.name ?? name;

  const handleClick = () => {
    if (contact?.phone) {
      // Se o contato já tem telefone, abre direto.
      launch(contact.phone, contact.name);
      return;
    }
    // Senão, abre o modal para capturar.
    if (!phone) {
      setOpen(true);
      return;
    }
    launch(phone, name);
  };

  const launch = (rawPhone: string, recipient: string | undefined) => {
    if (!normalizeBrazilPhone(rawPhone)) {
      toast.error(t('whatsappReturn.toast.invalid'));
      return;
    }
    const url = buildWhatsappUrl({ phone: rawPhone, name: recipient }, message);
    if (!url) {
      toast.error(t('whatsappReturn.toast.invalid'));
      return;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
    toast.success(t('whatsappReturn.toast.sent'));
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={variant}
          size={size}
          leftIcon={<MessageCircle className="h-4 w-4" />}
          onClick={handleClick}
        >
          {buttonLabel}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('whatsappReturn.label')}</DialogTitle>
          <DialogDescription>
            {effectiveName
              ? t('appointments:whatsappReturn.dialog.confirmWithName', { name: effectiveName })
              : t('appointments:whatsappReturn.dialog.confirmNoName')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div>
            <Label htmlFor="wp-name">{t('appointments:whatsappReturn.dialog.nameLabel')}</Label>
            <Input
              id="wp-name"
              className="mt-1 w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('appointments:whatsappReturn.dialog.namePlaceholder')}
            />
          </div>
          <div>
            <Label htmlFor="wp-phone">{t('appointments:whatsappReturn.dialog.phoneLabel')}</Label>
            <Input
              id="wp-phone"
              className="mt-1 w-full"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(11) 99999-9999"
              autoComplete="tel"
              inputMode="tel"
            />
            {phone && !normalizeBrazilPhone(phone) && (
              <p className="mt-1 inline-flex items-center gap-1 text-xs text-danger">
                <AlertCircle className="h-3 w-3" aria-hidden="true" />
                {t('appointments:whatsappReturn.dialog.phoneInvalid')}
              </p>
            )}
            {phone && normalizeBrazilPhone(phone) && (
              <p className="mt-1 inline-flex items-center gap-1 text-xs text-success">
                <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                {t('appointments:whatsappReturn.dialog.phoneValid', {
                  phone: normalizeBrazilPhone(phone),
                })}
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            {t('appointments:whatsappReturn.dialog.cancel')}
          </Button>
          <Button
            onClick={() => launch(phone, name)}
            disabled={!normalizeBrazilPhone(phone)}
            leftIcon={<MessageCircle className="h-4 w-4" />}
          >
            {t('appointments:whatsappReturn.dialog.open')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default WhatsappReturnButton;
