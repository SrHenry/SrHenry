import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect the root path to the default locale (English)
  redirect('/en');
  return null;
}
