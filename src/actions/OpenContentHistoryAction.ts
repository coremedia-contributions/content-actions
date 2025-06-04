import Config from "@jangaroo/runtime/Config";
import ConfigUtils from "@jangaroo/runtime/ConfigUtils";
import editorContext from "@coremedia/studio-client.main.editor-components/sdk/editorContext";
import Premular from "@coremedia/studio-client.main.editor-components/sdk/premular/Premular";
import {cast, is} from "@jangaroo/runtime";
import TabPanel from "@jangaroo/ext-ts/tab/Panel";
import PremularBase from "@coremedia/studio-client.main.editor-components/sdk/premular/PremularBase";
import Action from "@jangaroo/ext-ts/Action";
import VersionHistory from "@coremedia/studio-client.main.editor-components/sdk/premular/VersionHistory";
import createComponentSelector from "@coremedia/studio-client.ext.ui-components/util/createComponentSelector";
import SvgIconUtil from "@coremedia/studio-client.base-models/util/SvgIconUtil";
import {bulletedList} from "@coremedia/studio-client.common-icons";

interface OpenContentHistoryActionConfig extends Config<Action> {
}

class OpenContentHistoryAction extends Action {
  declare Config: OpenContentHistoryActionConfig;

  constructor(config: OpenContentHistoryActionConfig) {
    super(ConfigUtils.apply(Config(OpenContentHistoryAction, {
      iconCls: SvgIconUtil.getIconStyleClassForSvgIcon(bulletedList),
      handler: () => {
        let workArea = editorContext._.getWorkArea();
        const premular: Premular = cast(Premular, workArea.getActiveTab());
        if (premular && is(premular, Premular)) {
          let tabPanel: TabPanel =  cast(TabPanel, premular.queryById(PremularBase.TABS_ITEM_ID));
          let index = tabPanel.items.indexOfKey("infoTab");
          if (index) {
            tabPanel.setActiveTab(index);
            const findByType: Array<any> = premular.query(
              createComponentSelector()._xtype(VersionHistory.xtype, true).build(),
            );
            if (findByType && findByType.length > 0 ){
              findByType[0].setCollapsed(false)
            }
          }
        }
      }
    }), config));
  }

}

export default OpenContentHistoryAction;
