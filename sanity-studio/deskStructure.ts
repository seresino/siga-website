// This structure will:
// 1. Create a single item for "Site Settings" (includes About page content)
// 2. List out all other document types (like "Project") automatically

export const myStructure = (S: any) =>
  S.list()
    .title('Content')
    .items([
      // Site Settings singleton (includes About page content)
      S.listItem().title('Site Settings').child(
        S.document().schemaType('siteSettings').documentId('siteSettings'),
      ),
      S.divider(),
      // The rest of our document types
      ...S.documentTypeListItems().filter((listItem: any) => 
        !['siteSettings'].includes(listItem.getId())
      ),
    ])
