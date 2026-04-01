import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

import { markAllContactMessagesRead } from '@/actions/contact-messages';

type NotificationRow = {
  id: string;
  full_name: string;
  subject: string;
  status: string;
  created_at: Date;
};

type Props = {
  id: string;
  messages: NotificationRow[];
};

export function NotificationMenu({ id, messages }: Props) {
  const count = messages.length;

  return (
    <li className="nav-item dropdown">
      <button
        type="button"
        id={id}
        className="nav-link nav-icon bg-transparent border-0 p-0"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        aria-label="Notifications"
      >
        <i className="bi bi-bell" aria-hidden="true" />
        {count > 0 && <span className="badge bg-primary badge-number">{count}</span>}
      </button>

      <ul
        className="dropdown-menu dropdown-menu-end dropdown-menu-arrow notifications"
        aria-labelledby={id}
      >
        <li className="dropdown-header d-flex align-items-center justify-content-between gap-2">
          <span>{count > 0 ? `You have ${count} unread contact alerts` : 'No new alerts'}</span>
          <div className="d-flex align-items-center gap-2">
            {count > 0 ? (
              <form action={markAllContactMessagesRead}>
                <button type="submit" className="btn btn-link btn-sm p-0 text-decoration-none">
                  Clear
                </button>
              </form>
            ) : null}
            <Link href="/dashboard/contact-messages" className="badge rounded-pill bg-primary p-2">
              Open inbox
            </Link>
          </div>
        </li>

        {messages.length > 0 ? (
          messages.map((message, index) => (
            <li key={message.id} className="notification-item">
              <i className="bi bi-exclamation-circle text-warning" />
              <div>
                <h4>{message.full_name}</h4>
                <p>{message.subject}</p>
                <p>{formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}</p>
              </div>
              {index < messages.length - 1 && <hr className="dropdown-divider" />}
            </li>
          ))
        ) : (
          <>
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li className="dropdown-item text-muted">No new alerts.</li>
          </>
        )}
        <li className="dropdown-footer">
          <Link href="/dashboard/contact-messages">Show all notifications</Link>
        </li>
      </ul>
    </li>
  );
}
