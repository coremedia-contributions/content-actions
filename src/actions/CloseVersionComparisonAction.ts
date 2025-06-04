import Config from "@jangaroo/runtime/Config";
import ValueExpression from "@coremedia/studio-client.client-core/data/ValueExpression";
import {as} from "@jangaroo/runtime";
import editorContext from "@coremedia/studio-client.main.editor-components/sdk/editorContext";
import Premular from "@coremedia/studio-client.main.editor-components/sdk/premular/Premular";
import Content from "@coremedia/studio-client.cap-rest-client/content/Content";
import ContentAction from "@coremedia/studio-client.ext.cap-base-components/actions/ContentAction";
import {PremularConfiguration} from "@coremedia/studio-client.form-models";
import SvgIconUtil from "@coremedia/studio-client.base-models/util/SvgIconUtil";
import {removeSmall} from "@coremedia/studio-client.common-icons";

interface CloseVersionComparisonActionConfig extends Config<ContentAction> {
}


class CloseVersionComparisonAction extends ContentAction {
  static ACTION_ID: string = "closeVersionComparisonAction";

  #ve: ValueExpression = null;


  constructor(config: CloseVersionComparisonActionConfig = null) {
    // @ts-expect-error Ext JS semantics
    const this$ = this;
    this$.#ve = config.contentValueExpression;
    config.handler = buttonPressed;
    config.iconCls= SvgIconUtil.getIconStyleClassForSvgIcon(removeSmall);
    super(config);


    function buttonPressed() {
      if (editorContext._.getWorkArea()) {
        const content: Content = this$.#ve ? as(this$.#ve.getValue(), Content) : null;
        if (content) {
          let premular = as(editorContext._.getWorkArea().getActiveTab(), Premular);
          premular.closeReadOnlyDocumentPanel();
          const contentTabManager = editorContext._.getContentTabManager();
          contentTabManager.openPremulars([new PremularConfiguration(content, null, true, true)]);
        }
      }
    }
  }

}





export  default CloseVersionComparisonAction
