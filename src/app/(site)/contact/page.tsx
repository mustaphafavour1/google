import { PageContainer } from "@/components/shell/page-container";
import { PageHeader } from "@/components/shell/page-header";
import { getSiteSettings } from "@/lib/content";
import { ContactForm } from "./contact-form";

export default async function ContactPage() {
  const { contact } = await getSiteSettings();

  return (
    <PageContainer>
      <PageHeader
        title="Contact"
        subtitle="Have a project in mind, or just want to say hi? I'd love to hear from you."
      />
      <ContactForm contact={contact} />
    </PageContainer>
  );
}
