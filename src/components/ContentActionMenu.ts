import Menu from "@jangaroo/ext-ts/menu/Menu";
import Config from "@jangaroo/runtime/Config";
import ConfigUtils from "@jangaroo/runtime/ConfigUtils";
import ActionFilterTextField from "./ActionFilterTextField";
import Item from "@jangaroo/ext-ts/menu/Item";
import ContentActions_properties from "../ContentActions_properties";
import ActionRef from "@jangaroo/ext-ts/ActionRef";
import CheckInAction from "@coremedia/studio-client.ext.cap-base-components/actions/CheckInAction";
import RevertAction from "@coremedia/studio-client.ext.cap-base-components/actions/RevertAction";
import WithdrawAction from "@coremedia/studio-client.ext.cap-base-components/actions/WithdrawAction";
import ApprovePublishAction from "@coremedia/studio-client.ext.cap-base-components/actions/ApprovePublishAction";
import Separator from "@jangaroo/ext-ts/menu/Separator";
import ShowStartPublicationWorkflowWindowAction
  from "@coremedia/studio-client.main.control-room-editor-components/actions/ShowStartPublicationWorkflowWindowAction";
import WorkArea from "@coremedia/studio-client.main.editor-components/sdk/desktop/WorkArea";
import ShowStartTranslationWorkflowWindowAction
  from "@coremedia/studio-client.main.control-room-editor-components/actions/ShowStartTranslationWorkflowWindowAction";
import BookmarkAction from "@coremedia/studio-client.main.editor-components/sdk/bookmarks/BookmarkAction";
import CustomRenameAction from "../actions/CustomRenameAction";
import ShowInRepositoryAction
  from "@coremedia/studio-client.ext.library-services-toolkit/actions/ShowInRepositoryAction";
import OpenCloseVersionCompareAction from "../actions/OpenCloseVersionCompareAction";
import OpenHideServiceAction from "@coremedia/studio-client.main.hideservice-components/actions/OpenHideServiceAction";
import HideService_properties from "@coremedia/studio-client.main.hideservice-components/HideService_properties";
import ResetHideServiceAction
  from "@coremedia/studio-client.main.hideservice-components/actions/ResetHideServiceAction";
import DeleteAction from "@coremedia/studio-client.main.editor-components/sdk/actions/DeleteAction";
import OpenContentHistoryAction from "../actions/OpenContentHistoryAction";
import OpenCloseMasterCompareAction from "../actions/OpenCloseMasterCompareAction";

interface ContentActionMenuConfig extends Config<Menu> {
}

class ContentActionMenu extends Menu {
  declare Config: ContentActionMenuConfig;
  static override readonly xtype: string = "com.coremedia.blueprint.c12s.studio.config.contentActionMenu";

  static readonly CONTENT_ACTIONS_MENU_ITEMID: string = "contentActionsBtnMenuItemId";

  constructor(config: ContentActionMenuConfig) {
    super(ConfigUtils.apply(Config(ContentActionMenu, {
      itemId: ContentActionMenu.CONTENT_ACTIONS_MENU_ITEMID,
      items: [
        Config(ActionFilterTextField, {}),
        Config(Item, {
          text: ContentActions_properties.ContentAction_checkin_text,
          baseAction: Config(ActionRef, { actionId: CheckInAction.ACTION_ID })
        }),
        Config(Item, {
          text: ContentActions_properties.ContentAction_revert_text,
          baseAction: Config(ActionRef, { actionId: RevertAction.ACTION_ID })
        }),
        Config(Item, {
          text: ContentActions_properties.ContentAction_withdraw_text,
          baseAction: Config(ActionRef, { actionId: WithdrawAction.ACTION_ID })
        }),
        Config(Item, {
          text: ContentActions_properties.ContentAction_approvepublish_text,
          baseAction: Config(ActionRef, { actionId: ApprovePublishAction.ACTION_ID })
        }),
        Config(Separator),
        Config(Item, {
          itemId: "StartPublicationWorkflowId",
          baseAction: new ShowStartPublicationWorkflowWindowAction({
            contentValueExpression: WorkArea.ACTIVE_CONTENT_VALUE_EXPRESSION
          })
        }),
        Config(Item, {
          itemId: "StartLocalizationWorkflowId",
          baseAction: new ShowStartTranslationWorkflowWindowAction({
            contentValueExpression: WorkArea.ACTIVE_CONTENT_VALUE_EXPRESSION
          })
        }),
        Config(Separator, {itemId: "contentActionSectionBookmark"}),
        Config(Item, {
          itemId: "bookmarkActionId",
          baseAction: Config(ActionRef, { actionId: BookmarkAction.ACTION_ID })
        }),
        Config(Item, {
          text: ContentActions_properties.ContentAction_rename_text,
          baseAction: Config(CustomRenameAction, { contentValueExpression: WorkArea.ACTIVE_CONTENT_VALUE_EXPRESSION, iconCls: "rename-icon"})
        }),
        Config(Separator),
        Config(Item, {
          baseAction: new ShowInRepositoryAction({
            contentValueExpression: WorkArea.ACTIVE_CONTENT_VALUE_EXPRESSION
          })
        }),
        Config(Separator),
        Config(Item, {
          itemId: "closeVersionControlButtonItemId",
          baseAction: Config(OpenCloseVersionCompareAction, {contentValueExpression: WorkArea.ACTIVE_CONTENT_VALUE_EXPRESSION}),
        }),
        Config(Item, {
          itemId: "closeMasterControlButtonItemId",
          baseAction: Config(OpenCloseMasterCompareAction, {contentValueExpression: WorkArea.ACTIVE_CONTENT_VALUE_EXPRESSION}),
        }),
        Config(Item, {
          text: "Open Editing History",
          baseAction: Config(OpenContentHistoryAction, {} )
        }),
        Config(Separator),
        Config(Item, { baseAction: Config(ActionRef, { actionId: OpenHideServiceAction.ACTION_ID }) , iconCls: HideService_properties.openHideService_btn_iconCls}),
        Config(Item, { baseAction: Config(ActionRef, { actionId: ResetHideServiceAction.ACTION_ID }) , iconCls: HideService_properties.resetHideService_btn_iconCls, text: ContentActions_properties.ContentAction_reset_form_config}),
        Config(Separator),
        Config(Item, {
          text: ContentActions_properties.ContentAction_delete_text,
          baseAction: Config(DeleteAction, { contentValueExpression: WorkArea.ACTIVE_CONTENT_VALUE_EXPRESSION })
        })
      ]
    }), config));
  }
}

export default ContentActionMenu;
