import { signOut } from '@/auth';
import Link from 'next/link';
import Image from 'next/image';

type SessionUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string | null;
};

type Props = {
  id: string;
  user: SessionUser | null;
};

async function signOutToLogin() {
  'use server';
  await signOut({ redirectTo: '/auth/login' });
}

function getInitials(name?: string | null, email?: string | null) {
  const source = name || email || 'A';
  const parts = source.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'A';
  const first = parts[0]?.[0] ?? 'A';
  const second = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : '';
  return `${first}${second}`.toUpperCase();
}

export function ProfileMenu({ id, user }: Props) {
  const name = user?.name?.trim() || user?.email?.trim() || 'Admin';
  const email = user?.email?.trim() || null;
  const role = user?.role?.trim() || 'Admin';
  const initials = getInitials(user?.name, user?.email);

  return (
    <li className="nav-item dropdown pe-3">
      <button
        type="button"
        id={id}
        className="nav-link nav-profile d-flex align-items-center pe-0 bg-transparent border-0"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        aria-label="Profile menu"
      >
        {user?.image ? (
          <Image src={user.image} alt={name} width={36} height={36} className="rounded-circle" />
        ) : (
          <span
            className="rounded-circle d-inline-flex align-items-center justify-content-center bg-primary-subtle text-primary fw-semibold"
            style={{ width: 36, height: 36, fontSize: '0.8rem' }}
            aria-hidden="true"
          >
            {initials}
          </span>
        )}
        <span className="d-none d-md-block dropdown-toggle ps-2">{name}</span>
      </button>

      <ul
        className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile"
        aria-labelledby={id}
      >
        <li className="dropdown-header">
          <h6>{name}</h6>
          {email && <span>{email}</span>}
          {!email && <span>{role}</span>}
        </li>

        <li>
          <hr className="dropdown-divider" />
        </li>

        <li>
          <Link
            className="dropdown-item d-flex align-items-center"
            href="/dashboard/about/organization"
          >
            <i className="bi bi-building" />
            <span className="ms-2">Organization settings</span>
          </Link>
        </li>

        <li>
          <hr className="dropdown-divider" />
        </li>

        <li>
          <Link className="dropdown-item d-flex align-items-center" href="/dashboard/content-guide">
            <i className="bi bi-journal-check" />
            <span className="ms-2">Content guide</span>
          </Link>
        </li>

        <li>
          <hr className="dropdown-divider" />
        </li>

        <li>
          <Link
            className="dropdown-item d-flex align-items-center"
            href="/dashboard/contact-messages"
          >
            <i className="bi bi-chat-left-text" />
            <span className="ms-2">Contact messages</span>
          </Link>
        </li>

        <li>
          <hr className="dropdown-divider" />
        </li>

        <li>
          <form action={signOutToLogin}>
            <button type="submit" className="dropdown-item d-flex align-items-center">
              <i className="bi bi-box-arrow-right" />
              <span className="ms-2">Sign out</span>
            </button>
          </form>
        </li>
      </ul>
    </li>
  );
}
