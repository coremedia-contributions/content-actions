import StudioPlugin from "@coremedia/studio-client.main.editor-components/configuration/StudioPlugin";
import ConfigUtils from "@jangaroo/runtime/ConfigUtils";
import DocumentFormToolbar from "@coremedia/studio-client.main.editor-components/sdk/premular/DocumentFormToolbar";
import Component from "@jangaroo/ext-ts/Component";
import AddItemsPlugin from "@coremedia/studio-client.ext.ui-components/plugins/AddItemsPlugin";
import WorkArea from "@coremedia/studio-client.main.editor-components/sdk/desktop/WorkArea";
import ActionsToolbar from "@coremedia/studio-client.main.editor-components/sdk/desktop/ActionsToolbar";
import BindVisibilityPlugin from "@coremedia/studio-client.ext.ui-components/plugins/BindVisibilityPlugin";
import ValueExpressionFactory from "@coremedia/studio-client.client-core/data/ValueExpressionFactory";
import ContentActions_properties from "./ContentActions_properties";
import CopyResourceBundleProperties
  from "@coremedia/studio-client.main.editor-components/configuration/CopyResourceBundleProperties";
import resourceManager from "@jangaroo/runtime/l10n/resourceManager";
import CustomLabels_properties from "@coremedia-blueprint/studio-client.main.blueprint-forms/CustomLabels_properties";
import {Config, bind} from "@jangaroo/runtime";
import IEditorContext from "@coremedia/studio-client.main.editor-components/sdk/IEditorContext";
import Premular from "@coremedia/studio-client.main.editor-components/sdk/premular/Premular";
import ContentTypeIconDisplayField from "./components/ContentTypeIconDisplayField";
import Spacer from "@jangaroo/ext-ts/toolbar/Spacer";
import NextBestActionButton from "./components/NextBestActionButton";
import PremularBase from "@coremedia/studio-client.main.editor-components/sdk/premular/PremularBase";
import ContentActionMenu from "./components/ContentActionMenu";
import Container from "@jangaroo/ext-ts/container/Container";
import IconButton from "@coremedia/studio-client.ext.ui-components/components/IconButton";
import VersionComparisonDocumentFormToolbar
  from "@coremedia/studio-client.main.editor-components/sdk/premular/VersionComparisonDocumentFormToolbar";
import CloseVersionComparisonAction from "./actions/CloseVersionComparisonAction";
import ButtonSkin from "@coremedia/studio-client.ext.ui-components/skins/ButtonSkin";
import MasterComparisonDocumentFormToolbar
  from "@coremedia/studio-client.main.editor-components/sdk/premular/MasterComparisonDocumentFormToolbar";
import HideServiceSplitButton
  from "@coremedia/studio-client.main.hideservice-components/components/HideServiceSplitButton";
import HideComponentPlugin from "./plugins/HideComponentPlugin";
import HideItemsPlugin from "./plugins/HideItemsPlugin";
import AdditionalStyleClassPlugin from "@coremedia/studio-client.ext.ui-components/plugins/AdditionalStyleClassPlugin";
import PreviewPanelToolbar from "@coremedia/studio-client.main.editor-components/sdk/preview/PreviewPanelToolbar";
import ControlRoom from "@coremedia/studio-client.main.control-room-editor-components/ControlRoom";
import MultiItemSplitter from "@coremedia/studio-client.ext.ui-components/layouts/MultiItemSplitter";
import SplitterSkin from "@coremedia/studio-client.ext.ui-components/skins/SplitterSkin";
import ContentActionsPanel from "./controlroom/ContentActionsPanel";

interface ContentActionsPluginConfig extends Config<StudioPlugin> {
}

class ContentActionsPlugin extends StudioPlugin {
  declare Config: ContentActionsPluginConfig;



  override init(editorContext: IEditorContext) {
    super.init(editorContext);
  }

  constructor(config: Config<ContentActionsPlugin> = null) {
    // @ts-expect-error Ext JS semantics
    const this$ = this;
    super(ConfigUtils.apply(Config(ContentActionsPlugin, {
      rules: [

        // hiding the default action toolbar
        Config(ActionsToolbar, {
          plugins: [
            Config(BindVisibilityPlugin, {
              bindTo: ValueExpressionFactory.createFromFunction(bind(this$, this$.#isContentActionsDisabled))
            })
          ]
        }),

        Config(Premular, {
          plugins: [
            Config(HideItemsPlugin, {
              onlyIf: bind(this$, this$.#isContentActionsEnabled),
              recursive: true,
              items: [
                Config(Component, { itemId: PremularBase.SWITCH_DIFFERENCING_BUTTON_ITEM_ID })
              ]
            }),
          ]
        }),

        Config(VersionComparisonDocumentFormToolbar, {
          plugins: [
            Config(AddItemsPlugin, {
              onlyIf: bind(this$, this$.#isContentActionsEnabled),
              after: [Config(Component, {itemId: "openDifferencesButton"})],
              items: [
                Config(IconButton, {
                  text: "Close Version Compare",
                  scale: "medium",
                  ui: ButtonSkin.WORKAREA.getSkin(),
                  baseAction: Config(CloseVersionComparisonAction, {contentValueExpression: WorkArea.ACTIVE_CONTENT_VALUE_EXPRESSION}),
                }),
              ]
            }),
            Config(AdditionalStyleClassPlugin, {cls: "readonly-toolbar"}),
          ]
        }),

        Config(MasterComparisonDocumentFormToolbar, {
          plugins: [
            Config(AddItemsPlugin, {
              onlyIf: bind(this$, this$.#isContentActionsEnabled),
              after: [Config(Component, {itemId: "openDifferencesButton"})],
              items: [
                Config(IconButton, {
                  scale: "medium",
                  ui: ButtonSkin.WORKAREA.getSkin(),
                  baseAction: Config(CloseVersionComparisonAction, {contentValueExpression: WorkArea.ACTIVE_CONTENT_VALUE_EXPRESSION}),
                }),
              ]
            }),
            Config(AdditionalStyleClassPlugin, {cls: "readonly-toolbar"}),
          ]
        }),


        Config(DocumentFormToolbar, {
          plugins: [
            // hiding obsolete document toolbar buttons
            Config(HideItemsPlugin, {
              onlyIf: bind(this$, this$.#isContentActionsEnabled),
              items: [
                Config(Component, { itemId: DocumentFormToolbar.BOOKMARK_BUTTON_ITEM_ID }),
                Config(Component, { itemId: DocumentFormToolbar.LIFECYCLE_STATUS_ITEM_ID }),
                Config(Component, { itemId: DocumentFormToolbar.DOCUMENT_TYPE_ITEM_ID })
              ]
            }),
            Config(AddItemsPlugin, {
              onlyIf: isDocumentFormToolbar,
              index: 0,
              items: [
                Config(ContentTypeIconDisplayField, {itemId: "contentTypeToolbarFieldItemId", bindTo: WorkArea.ACTIVE_CONTENT_VALUE_EXPRESSION}),
                Config(Spacer, {width: 20, itemId: "spacerXItemId"}),
                Config(NextBestActionButton, {itemId: "nextBestActionItemIdForm", contentValueExpression: WorkArea.ACTIVE_CONTENT_VALUE_EXPRESSION,
                  menu: Config(ContentActionMenu)}),
              ]
            }),
          ]
        }),
        Config(PreviewPanelToolbar, {
          plugins: [
            Config(AddItemsPlugin, {
              onlyIf: isPreviewPanelToolbar,
              after: [Config(Component, {itemId: PreviewPanelToolbar.COLLAPSE_BUTTON_ITEM_ID})],
              items: [
                Config(NextBestActionButton, {
                  itemId: "nextBestActionItemIdPreview", contentValueExpression: WorkArea.ACTIVE_CONTENT_VALUE_EXPRESSION,
                  preview: true,
                  menu: Config(ContentActionMenu),
                }),
              ]
            }),
          ]
        }),

        Config(HideServiceSplitButton, {
          plugins: [
            Config(HideComponentPlugin, {
              bindTo: ValueExpressionFactory.createFromFunction(bind(this$, this$.#isContentActionsEnabled))
            })
          ]
        }),

        Config(ControlRoom, {
          plugins: [
            Config(AddItemsPlugin, {
              index: 0,
              items: [
                Config(ContentActionsPanel),
                Config(MultiItemSplitter, {
                  stateId: "control-room-internal-splitter-actions",
                  ui: SplitterSkin.ACCORDION.getSkin(),
                  size: 3,
                }),
              ]
            })
          ]
        })

      ],

      configuration: [
        new CopyResourceBundleProperties({
          destination: resourceManager.getResourceBundle(null, CustomLabels_properties),
          source: resourceManager.getResourceBundle(null, ContentActions_properties)
        })]
    }), config));
  }

  #isContentActionsEnabled(): boolean {
    return true;
  }

  #isContentActionsDisabled(): boolean {
    return true;
  }

}

const isDocumentFormToolbar = (container: Container): boolean => {
  return container.xtype === DocumentFormToolbar.xtype && featureFlagService.isEnabled(ContentActionsPlugin.FEATURE_CONTENT_ACTIONS_MENU);
};

const isPreviewPanelToolbar = (container: Container): boolean => {
  return container.xtype === PreviewPanelToolbar.xtype && featureFlagService.isEnabled(ContentActionsPlugin.FEATURE_CONTENT_ACTIONS_MENU);
};


export default ContentActionsPlugin;
