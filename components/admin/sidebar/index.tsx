import { signOut } from '@/auth';
import { SidebarSimpleLink } from '@/components/admin/sidebar/sidebar-simple-link';
import { SidebarCollapseGroup } from '@/components/admin/sidebar/sidebar-collapse-group';
import { SidebarContentLink } from '@/components/admin/sidebar/sidebar-content-link';

async function signOutToLogin() {
  'use server';
  await signOut({ redirectTo: '/auth/login' });
}

export function Sidebar() {
  return (
    <aside id="sidebar" className="sidebar d-flex flex-column">
      <div className="flex-grow-1">
        <ul className="sidebar-nav" id="sidebar-nav">
          <SidebarSimpleLink href="/dashboard" iconClass="bi bi-grid" label="Dashboard" exact />

          <SidebarSimpleLink
            href="/dashboard/content-guide"
            iconClass="bi bi-journal-check"
            label="Content Guide"
          />

          <SidebarSimpleLink
            href="/dashboard/about/organization"
            iconClass="bi bi-building"
            label="Company Settings"
          />

          <SidebarCollapseGroup
            id="about-profile-nav"
            iconClass="bi bi-layers"
            label="About & Profile"
          >
            <SidebarContentLink label="Awards" href="/dashboard/about/awards" />
            <SidebarContentLink label="Certifications" href="/dashboard/about/certifications" />
            <SidebarContentLink label="FAQs" href="/dashboard/about/faqs" />
            <SidebarContentLink label="Milestones" href="/dashboard/about/milestones" />
            <SidebarContentLink label="Testimonials" href="/dashboard/about/testimonials" />
            <SidebarContentLink label="Core Values" href="/dashboard/about/values" />
            <SidebarContentLink label="Metrics" href="/dashboard/about/metrics" />
            <SidebarContentLink
              label="Leadership — Categories"
              href="/dashboard/about/leadership/categories"
            />
            <SidebarContentLink
              label="Leadership — Team"
              href="/dashboard/about/leadership/teams"
            />
            <SidebarContentLink label="Leadership — Message" href="/dashboard/about/messages" />
            <SidebarContentLink href="/dashboard/about/partners" label="Partners" />
          </SidebarCollapseGroup>

          <SidebarCollapseGroup id="services-nav" iconClass="bi bi-briefcase" label="Services">
            <SidebarContentLink href="/dashboard/services" label="All Services" />
          </SidebarCollapseGroup>

          <SidebarCollapseGroup id="projects-nav" iconClass="bi bi-kanban" label="Projects">
            <SidebarContentLink href="/dashboard/projects" label="All Projects" />
            <SidebarContentLink href="/dashboard/projects/categories" label="Project Categories" />
          </SidebarCollapseGroup>

          <SidebarCollapseGroup
            id="news-updates-nav"
            iconClass="bi bi-megaphone"
            label="News & Updates"
          >
            <SidebarContentLink href="/dashboard/news" label="News" />
            <SidebarContentLink href="/dashboard/news/categories" label="News Categories" />
            <SidebarContentLink href="/dashboard/newsletters" label="Newsletters" />
            <SidebarContentLink
              href="/dashboard/newsletters/categories"
              label="Newsletter Categories"
            />
          </SidebarCollapseGroup>

          <SidebarSimpleLink
            href="/dashboard/contact-messages"
            iconClass="bi bi-chat-left-text"
            label="Contact Messages"
          />

          <SidebarSimpleLink
            href="/dashboard/tenders"
            iconClass="bi bi-file-earmark-text"
            label="Tenders"
          />

          <SidebarCollapseGroup id="careers-nav" iconClass="bi bi-briefcase-fill" label="Careers">
            <SidebarContentLink href="/dashboard/careers" label="All Careers" />
            <SidebarContentLink href="/dashboard/careers/types" label="Types" />
          </SidebarCollapseGroup>

          <SidebarCollapseGroup id="resources-nav" iconClass="bi bi-journal-text" label="Resources">
            <SidebarContentLink href="/dashboard/resources" label="All Resources" />
            <SidebarContentLink href="/dashboard/resources/kinds" label="Kinds" />
            <SidebarContentLink href="/dashboard/resources/categories" label="Categories" />
          </SidebarCollapseGroup>
        </ul>
      </div>

      <form action={signOutToLogin} className="mt-auto pt-3">
        <button
          type="submit"
          className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2"
        >
          <i className="bi bi-box-arrow-right" aria-hidden="true" />
          <span>Logout</span>
        </button>
      </form>
    </aside>
  );
}

export default Sidebar;
