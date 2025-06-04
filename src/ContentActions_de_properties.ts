import ResourceBundleUtil from "@jangaroo/runtime/l10n/ResourceBundleUtil";
import ContentActions_properties from "./ContentActions_properties";

ResourceBundleUtil.override(ContentActions_properties, {
  ContentAction_revert_text : "Änderungen verwerfen",
  ContentAction_checkin_text : "Zurückgeben",
  ContentAction_withdraw_text : "Depublizieren",
  ContentAction_approvepublish_text: "Freigeben & Publizieren",
  ContentAction_delete_text: "Löschen",
  ContentAction_rename_text: "Umbenennen",
  ContentAction_reset_form_config: "Formular zurücksetzen",
  ContentAction_versionComparison_open_text: "Versionen vergleichen",
  ContentAction_versionComparison_close_text: "Versionsvergleich schließen",
  ContentAction_masterComparison_open_text: "Vergleich mit Master",

  state_checked_out: "In Bearbeitung",
  state_published: "Publiziert",
  state_checked_in: "Aktuell",

  next_action_checkin: "Änderungen zurückgeben",
  next_action_publish: "Publizieren",
})
