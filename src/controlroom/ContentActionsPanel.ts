import ConfigUtils from "@jangaroo/runtime/ConfigUtils";
import Panel from "@jangaroo/ext-ts/panel/Panel";
import Config from "@jangaroo/runtime/Config";
import PanelSkin from "@coremedia/studio-client.ext.ui-components/skins/PanelSkin";
import CheckInAction from "@coremedia/studio-client.ext.cap-base-components/actions/CheckInAction";
import WorkArea from "@coremedia/studio-client.main.editor-components/sdk/desktop/WorkArea";
import Button from "@jangaroo/ext-ts/button/Button";
import VBoxLayout from "@jangaroo/ext-ts/layout/container/VBox";
import RevertAction from "@coremedia/studio-client.ext.cap-base-components/actions/RevertAction";
import WithdrawAction from "@coremedia/studio-client.ext.cap-base-components/actions/WithdrawAction";
import ApprovePublishAction from "@coremedia/studio-client.ext.cap-base-components/actions/ApprovePublishAction";
import ShowStartPublicationWorkflowWindowAction
    from "@coremedia/studio-client.main.control-room-editor-components/actions/ShowStartPublicationWorkflowWindowAction";
import ShowStartTranslationWorkflowWindowAction
    from "@coremedia/studio-client.main.control-room-editor-components/actions/ShowStartTranslationWorkflowWindowAction";
import ContentActions_properties from "../ContentActions_properties";
import DeleteAction from "@coremedia/studio-client.main.editor-components/sdk/actions/DeleteAction";
import BookmarkAction from "@coremedia/studio-client.main.editor-components/sdk/bookmarks/BookmarkAction";
import BindPropertyPlugin from "@coremedia/studio-client.ext.ui-components/plugins/BindPropertyPlugin";
import DisplayFieldSkin from "@coremedia/studio-client.ext.ui-components/skins/DisplayFieldSkin";
import ExtendedDisplayField from "@coremedia/studio-client.ext.ui-components/components/ExtendedDisplayField";
import ShowInRepositoryAction
    from "@coremedia/studio-client.ext.library-services-toolkit/actions/ShowInRepositoryAction";
import CustomRenameAction from "../actions/CustomRenameAction";
import ButtonSkin from "@coremedia/studio-client.ext.ui-components/skins/ButtonSkin";
import Content from "@coremedia/studio-client.cap-rest-client/content/Content";

interface ContentActionsPanelConfig extends Config<Panel> {
}

class ContentActionsPanel extends Panel {
    declare Config: ContentActionsPanelConfig;

    static override readonly xtype: string = "com.coremedia.cms.editor.controlroom.config.contentActionsPanel";

    constructor(config: Config<ContentActionsPanel> = null) {
        // @ts-expect-error Ext JS semantics
        const this$ = this;
        const contentValueExpression = WorkArea.ACTIVE_CONTENT_VALUE_EXPRESSION;
        const btnSkin = ButtonSkin.SIMPLE.getSkin();
        super(ConfigUtils.apply(Config(ContentActionsPanel, {
                    title: "Quick Actions",
                    ariaLabel: "content-actions-panel",
                    ui: PanelSkin.ACCORDION.getSkin(),
                    flex: 1,
                    border: false,
                    stateId: "contentActionControlRoomPanelStateId",
                    layout: Config(VBoxLayout),
                    items: [
                        Config(Panel, {
                            layout: Config(VBoxLayout),
                            style: "margin: 10px 10px;",
                            items: [
                                Config(ExtendedDisplayField, {value: "for content:", ui: DisplayFieldSkin.LABEL_UPPERCASE.getSkin()}),
                                Config(ExtendedDisplayField, {
                                    plugins: [Config(BindPropertyPlugin, {
                                        componentProperty: "value",
                                        bindTo: contentValueExpression,
                                        transformer: (value: Content) => {
                                            if (!value) return undefined;
                                            let name = value.getName();
                                            let locale = value.get("properties").get("locale");
                                            return (locale) ? name +" (" + locale+ ")" : name;
                                        }
                                    })]
                                }),
                            ]
                        }),
                        Config(Button, {
                            text: ContentActions_properties.ContentAction_checkin_text,
                            scale: "medium",
                            ui: btnSkin,
                            cls: "controlroom-content-action-button",
                            baseAction: Config(CheckInAction, {contentValueExpression: contentValueExpression})
                        }),
                        Config(Button, {
                            text: ContentActions_properties.ContentAction_revert_text,
                            scale: "medium",
                            ui: btnSkin,
                            cls: "controlroom-content-action-button",
                            baseAction: Config(RevertAction, {contentValueExpression: contentValueExpression})
                        }),
                        Config(Button, {
                            text: ContentActions_properties.ContentAction_withdraw_text,
                            scale: "medium",
                            ui: btnSkin,
                            cls: "controlroom-content-action-button",
                            baseAction: Config(WithdrawAction, {contentValueExpression: contentValueExpression})
                        }),
                        Config(Button, {
                            text: ContentActions_properties.ContentAction_approvepublish_text,
                            scale: "medium",
                            ui: btnSkin,
                            cls: "controlroom-content-action-button",
                            baseAction: Config(ApprovePublishAction, {contentValueExpression: contentValueExpression})
                        }),
                        Config(Button, {
                            scale: "medium",
                            ui: btnSkin,
                            cls: "controlroom-content-action-button",
                            baseAction: Config(DeleteAction, {contentValueExpression: contentValueExpression})
                        }),
                        Config(Button, {
                            scale: "medium",
                            ui: btnSkin,
                            cls: "controlroom-content-action-button",
                            baseAction: Config(CustomRenameAction, {
                                text: ContentActions_properties.ContentAction_rename_text,
                                contentValueExpression: contentValueExpression,
                                iconCls: "rename-icon"
                            })
                        }),
                        Config(Button, {
                            scale: "medium",
                            ui: btnSkin,
                            cls: "controlroom-content-action-button",
                            baseAction: Config(ShowStartPublicationWorkflowWindowAction, {contentValueExpression: contentValueExpression})
                        }),
                        Config(Button, {
                            scale: "medium",
                            ui: btnSkin,
                            cls: "controlroom-content-action-button",
                            baseAction: Config(ShowStartTranslationWorkflowWindowAction, {contentValueExpression: contentValueExpression})
                        }),
                        Config(Button, {
                            scale: "medium",
                            ui: btnSkin,
                            cls: "controlroom-content-action-button",
                            baseAction: Config(BookmarkAction, {contentValueExpression: contentValueExpression})
                        }),
                        Config(Button, {
                            scale: "medium",
                            ui: btnSkin,
                            cls: "controlroom-content-action-button",
                            baseAction: Config(ShowInRepositoryAction, {contentValueExpression: contentValueExpression})
                        }),
                    ],
                }),
                config
            )
        );
    }
}

export default ContentActionsPanel;
