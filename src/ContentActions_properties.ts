interface ContentActions_properties {
  ContentAction_revert_text: string;
  ContentAction_checkin_text: string;
  ContentAction_withdraw_text: string;
  ContentAction_approvepublish_text: string;
  ContentAction_delete_text:string;
  ContentAction_rename_text: string;
  ContentAction_reset_form_config: string;
  ContentAction_versionComparison_open_text: string;
  ContentAction_masterComparison_open_text: string;
  ContentAction_versionComparison_close_text: string

  state_checked_out: string;
  state_published: string;
  state_checked_in: string;

  next_action_checkin: string;
  next_action_publish: string;
}

const ContentActions_properties: ContentActions_properties = {
  ContentAction_revert_text : "Revert",
  ContentAction_checkin_text : "Check-In",
  ContentAction_withdraw_text : "Withdraw",
  ContentAction_approvepublish_text: "Approve & Publish",
  ContentAction_delete_text: "Delete",
  ContentAction_rename_text: "Rename",
  ContentAction_reset_form_config: "Reset Form Configuration",
  ContentAction_versionComparison_open_text: "Compare Versions",
  ContentAction_versionComparison_close_text: "Close Version Compare",
  ContentAction_masterComparison_open_text: "Compare with Master",

  state_checked_out: "Checked-Out",
  state_published: "Version Published",
  state_checked_in: "Checked-In",

  next_action_checkin: "Check-In Changes",
  next_action_publish: "Publish"
}

export default ContentActions_properties
