// Panel router - maps sidebar tab IDs to their respective panel components
import type { SidebarTab } from "../EditorSidebar.tsx";
import VersionsPanel from "./versions-panel.tsx";
import CodePanel from "./code-panel.tsx";
import FilesPanel from "./files-panel.tsx";
import DatabasePanel from "./database-panel.tsx";
import SecretsPanel from "./secrets-panel.tsx";
import DomainsPanel from "./domains-panel.tsx";
import MonetizePanel from "./monetize-panel.tsx";
import BrandingPanel from "./branding-panel.tsx";
import MorePanel from "./more-panel.tsx";

export default function SidebarPanel({ tab }: { tab: SidebarTab }) {
  switch (tab) {
    case "versions":
      return <VersionsPanel />;
    case "code":
      return <CodePanel />;
    case "files":
      return <FilesPanel />;
    case "database":
      return <DatabasePanel />;
    case "secrets":
      return <SecretsPanel />;
    case "domains":
      return <DomainsPanel />;
    case "monetize":
      return <MonetizePanel />;
    case "branding":
      return <BrandingPanel />;
    case "more":
      return <MorePanel />;
    default:
      return null;
  }
}
