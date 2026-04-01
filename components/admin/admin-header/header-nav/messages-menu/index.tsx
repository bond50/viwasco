import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

import { markAllContactMessagesRead } from '@/actions/contact-messages';

type MessageRow = {
  id: string;
  full_name: string;
  subject: string;
  message: string;
  created_at: Date;
};

type Props = {
  id: string;
  messages: MessageRow[];
};

export function MessagesMenu({ id, messages }: Props) {
  const count = messages.length;

  return (
    <li className="nav-item dropdown">
      <button
        type="button"
        id={id}
        className="nav-link nav-icon bg-transparent border-0 p-0"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        aria-label="Messages"
      >
        <i className="bi bi-chat-left-text" aria-hidden="true" />
        {count > 0 && <span className="badge bg-success badge-number">{count}</span>}
      </button>

      <ul
        className="dropdown-menu dropdown-menu-end dropdown-menu-arrow messages"
        aria-labelledby={id}
      >
        <li className="dropdown-header d-flex align-items-center justify-content-between gap-2">
          <span>{count > 0 ? `You have ${count} unread messages` : 'No unread messages'}</span>
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
            <li key={message.id} className="message-item">
              <Link href={`/dashboard/contact-messages/${message.id}`}>
                <div className="d-flex align-items-start gap-3">
                  <div
                    className="rounded-circle bg-primary-subtle text-primary d-inline-flex align-items-center justify-content-center flex-shrink-0"
                    style={{ width: 40, height: 40 }}
                  >
                    <i className="bi bi-person" aria-hidden="true" />
                  </div>
                  <div>
                    <h4>{message.full_name}</h4>
                    <p>{message.subject}</p>
                    <p>{formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}</p>
                  </div>
                </div>
              </Link>
              {index < messages.length - 1 && <hr className="dropdown-divider" />}
            </li>
          ))
        ) : (
          <>
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li className="dropdown-item text-muted">No unread contact messages.</li>
          </>
        )}

        <li className="dropdown-footer">
          <Link href="/dashboard/contact-messages">Show all messages</Link>
        </li>
      </ul>
    </li>
  );
}
