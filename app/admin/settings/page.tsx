import AdminShell from "../_ui/AdminShell";
import ThemePicker from "../_ui/ThemePicker";
import TypographyPanel from "../_ui/TypographyPanel";

export default function SettingsPage() {
  return (
    <AdminShell>
      <div className="space-y-12">
        <ThemePicker />
        <TypographyPanel />
      </div>
    </AdminShell>
  );
}
