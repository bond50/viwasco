import { auth } from '@/auth';
import { listContactMessages } from '@/lib/data/admin/contact-messages';
import { NotificationMenu } from '@/components/admin/admin-header/header-nav/notification-menu';
import { MessagesMenu } from '@/components/admin/admin-header/header-nav/messages-menu';
import { ProfileMenu } from '@/components/admin/admin-header/header-nav/profile-menu';

export async function HeaderNav() {
  const [session, messages] = await Promise.all([auth(), listContactMessages()]);

  const notifBtnId = 'notifDropdown';
  const msgBtnId = 'messagesDropdown';
  const profileBtnId = 'profileDropdown';
  const unreadItems = messages.filter((row) => row.status === 'NEW');
  const inboxItems = unreadItems.slice(0, 3);
  const alertItems = unreadItems.slice(0, 4);

  return (
    <nav className="header-nav ms-auto">
      <ul className="d-flex align-items-center">
        <li className="nav-item d-block d-lg-none">
          <button
            type="button"
            className="nav-link nav-icon search-bar-toggle bg-transparent border-0 p-0"
            aria-label="Toggle search"
          >
            <i className="bi bi-search" aria-hidden="true" />
          </button>
        </li>

        <NotificationMenu id={notifBtnId} messages={alertItems} />
        <MessagesMenu id={msgBtnId} messages={inboxItems} />
        <ProfileMenu id={profileBtnId} user={session?.user ?? null} />
      </ul>
    </nav>
  );
}
