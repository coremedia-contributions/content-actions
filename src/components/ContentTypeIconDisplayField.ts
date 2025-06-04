import Config from "@jangaroo/runtime/Config";
import ConfigUtils from "@jangaroo/runtime/ConfigUtils";
import IconDisplayField from "@coremedia/studio-client.ext.ui-components/components/IconDisplayField";
import IconDisplayFieldSkin from "@coremedia/studio-client.ext.ui-components/skins/IconDisplayFieldSkin";
import OverflowBehaviour from "@coremedia/studio-client.ext.ui-components/mixins/OverflowBehaviour";
import BindPlugin from "@coremedia/studio-client.ext.ui-components/plugins/BindPlugin";
import DocumentFormToolbarBase
  from "@coremedia/studio-client.main.editor-components/sdk/premular/DocumentFormToolbarBase";
import ValueExpression from "@coremedia/studio-client.client-core/data/ValueExpression";

interface ContentTypeIconDisplayFieldConfig extends Config<IconDisplayField>, Partial<Pick<ContentTypeIconDisplayField, "bindTo">> {

}

class ContentTypeIconDisplayField extends IconDisplayField {

  declare Config: ContentTypeIconDisplayFieldConfig;

  constructor(config: Config<ContentTypeIconDisplayField> = null) {
    super(ConfigUtils.apply(Config(ContentTypeIconDisplayField, {
      itemId: "contentTypeIconDisplayField",
      ui: IconDisplayFieldSkin.WORKAREA.getSkin(),
      overflowBehaviour: OverflowBehaviour.ELLIPSIS,
      tooltipOnValue: true,
      plugins: [
        Config(BindPlugin, {
          bindTo: config.bindTo.extendBy("type"),
          boundValueChanged: DocumentFormToolbarBase.changeType
        })
      ]
    }), config));
  }

  bindTo: ValueExpression = null;
}

export default ContentTypeIconDisplayField;
