import type { ReactNode } from 'react';
import ProfileLayout from '../../../views/profile-layout';

export default function ProfileRouteLayout({ children }: { children: ReactNode }) {
  return <ProfileLayout>{children}</ProfileLayout>;
}
