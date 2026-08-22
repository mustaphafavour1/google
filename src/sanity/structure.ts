import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Site settings")
        .id("siteSettings")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
      S.divider(),
      S.documentTypeListItem("project").title("Projects"),
      S.documentTypeListItem("processTrack").title("Process tracks"),
      S.documentTypeListItem("skill").title("Skills"),
      S.divider(),
      S.documentTypeListItem("jobApplicationVariant").title("Job applications"),
    ]);
