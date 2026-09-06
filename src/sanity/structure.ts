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
      S.documentTypeListItem("product").title("My Products"),
      S.documentTypeListItem("industry").title("Industries"),
      S.documentTypeListItem("processTrack").title("Process tracks"),
      S.documentTypeListItem("skill").title("Skills"),
      S.documentTypeListItem("skillGroup").title("Skill groups (landing page)"),
      S.documentTypeListItem("designSuperpower").title("Design superpowers"),
      S.divider(),
      S.documentTypeListItem("blogPost").title("Blog posts"),
      S.documentTypeListItem("dddWeek").title("Daily Design Dose"),
      S.divider(),
      S.listItem()
        .title("AI Context")
        .id("aiContext")
        .child(
          S.list()
            .title("AI Context")
            .items([
              S.listItem()
                .title("Guidelines")
                .id("aiGuidelines")
                .child(S.document().schemaType("aiGuidelines").documentId("aiGuidelines")),
              S.divider(),
              S.documentTypeListItem("aiContextEntry").title("Context entries"),
            ]),
        ),
      S.divider(),
      S.documentTypeListItem("jobApplicationVariant").title("Job applications"),
      S.documentTypeListItem("portfolioArchive").title("Portfolio archive"),
      S.documentTypeListItem("backgroundPattern").title("Background patterns"),
    ]);
