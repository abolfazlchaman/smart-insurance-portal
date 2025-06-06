import en from '@/messages/en.json';
import fa from '@/messages/fa.json';
import de from '@/messages/de.json';
import tr from '@/messages/tr.json';
import fr from '@/messages/fr.json';

const messages = {
  en,
  fa,
  de,
  tr,
  fr,
} as const;

export type Locale = keyof typeof messages;

export function getMessages(locale: Locale) {
  return messages[locale];
}
