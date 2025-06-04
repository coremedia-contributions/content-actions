import ButtonSkin from "@coremedia/studio-client.ext.ui-components/skins/ButtonSkin";
import ConfigUtils from "@jangaroo/runtime/ConfigUtils";
import Config from "@jangaroo/runtime/Config";
import ValueExpression from "@coremedia/studio-client.client-core/data/ValueExpression";
import IconButton from "@coremedia/studio-client.ext.ui-components/components/IconButton";

interface ContentActionsDocumentToolbarButtonConfig extends Config<IconButton>, Partial<Pick<ContentActionsDocumentToolbarButton,
  "contentValueExpression"
>> {
}

class ContentActionsDocumentToolbarButton extends IconButton {
  declare Config: ContentActionsDocumentToolbarButtonConfig;
  contentValueExpression: ValueExpression;
  content: any;

  constructor(config) {
    // @ts-expect-error Ext JS semantics
    const this$ = this;

    super(ConfigUtils.apply(Config(ContentActionsDocumentToolbarButton, {
      itemId: "ContentActionsDocumentToolbarButtonIds",
      scale: "medium",
      ui: ButtonSkin.WORKAREA.getSkin(),
    }), config));
  }

}

export default ContentActionsDocumentToolbarButton;

