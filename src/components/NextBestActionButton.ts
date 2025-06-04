import Config from "@jangaroo/runtime/Config";
import ValueExpression from "@coremedia/studio-client.client-core/data/ValueExpression";
import ConfigUtils from "@jangaroo/runtime/ConfigUtils";
import BindPlugin from "@coremedia/studio-client.ext.ui-components/plugins/BindPlugin";
import WorkArea from "@coremedia/studio-client.main.editor-components/sdk/desktop/WorkArea";
import {ContentLocalizationUtil} from "@coremedia/studio-client.cap-base-models";
import IconDisplayFieldSkin from "@coremedia/studio-client.ext.ui-components/skins/IconDisplayFieldSkin";
import CheckInAction from "@coremedia/studio-client.ext.cap-base-components/actions/CheckInAction";
import ShowStartPublicationWorkflowWindowAction
  from "@coremedia/studio-client.main.control-room-editor-components/actions/ShowStartPublicationWorkflowWindowAction";
import {SvgIconUtil} from "@coremedia/studio-client.base-models";
import { inProduction } from "@coremedia/studio-client.common-icons";
import ContentActions_properties from "../ContentActions_properties";
import SplitButton from "@jangaroo/ext-ts/button/Split";

interface NextBestActionButtonConfig extends Config<SplitButton>, Partial<Pick<NextBestActionButton,
  "contentValueExpression"
>> {
}


class NextBestActionButton extends SplitButton {
  declare Config: NextBestActionButtonConfig;
  contentValueExpression: ValueExpression;
  lifecycleStatus: string;
  checkedIn: string;
  published: string;
  stateCls:string;
  private changeLifecycleStatus: (...params: any[]) => any;

  static updateStatus(button: NextBestActionButton) {
    if (button.lifecycleStatus === undefined || button.checkedIn === undefined) return;
    button.removeCls("next_best_action_btn_state_"+button.stateCls);
    button.setDisabled(false);
    if (button.lifecycleStatus === "published") {
      button.stateCls = "published";
      button.setText(ContentActions_properties.state_published);
      button.setIconCls(ContentLocalizationUtil.getIconStyleClassForStatus(button.stateCls));
    } else if (button.checkedIn) {
      button.setText(ContentActions_properties.next_action_publish);
      button.stateCls = "in-production";
      button.setIconCls(SvgIconUtil.getIconStyleClassForSvgIcon(inProduction));
    } else {
      button.setText(ContentActions_properties.next_action_checkin);
      button.stateCls = "checked-out";
      button.setIconCls(ContentLocalizationUtil.getIconStyleClassForStatus(button.stateCls));
    }
    button.addCls("next_best_action_btn_state_"+button.stateCls);
  }

  constructor(config) {
    // @ts-expect-error Ext JS semantics
    const this$ = this;

    function setCheckedInStatus(button: NextBestActionButton, ve: ValueExpression) {
      this$.checkedIn = ve.getValue();
      NextBestActionButton.updateStatus(button);
    }

    function setLifecycletatus(button: NextBestActionButton, ve: ValueExpression) {
      this$.lifecycleStatus = ve.getValue();
      NextBestActionButton.updateStatus(button);
    }


    function nextBestActionHandler(button: NextBestActionButton) {
      if (!button.checkedIn) {
        let checkInAction = new CheckInAction({contentValueExpression: WorkArea.ACTIVE_CONTENT_VALUE_EXPRESSION});
        checkInAction.execute();
      }
      else if (button.checkedIn && button.lifecycleStatus === 'in-production') {
        let startPublicationAction = new ShowStartPublicationWorkflowWindowAction({contentValueExpression: WorkArea.ACTIVE_CONTENT_VALUE_EXPRESSION});
        startPublicationAction.execute();
      }
    }

    super(ConfigUtils.apply(Config(NextBestActionButton, {
      itemId: "NextBestActionButtonId",
      scale: "medium",
      ui: IconDisplayFieldSkin.WORKAREA.getSkin(),
      handler: nextBestActionHandler,
      cls: "next_best_action_btn",
      overCls: "",
      plugins: [
        Config(BindPlugin, {
          bindTo: WorkArea.ACTIVE_CONTENT_VALUE_EXPRESSION.extendBy("checkedIn"),
          boundValueChanged: setCheckedInStatus,
        }),
        Config(BindPlugin, {
          bindTo: WorkArea.ACTIVE_CONTENT_VALUE_EXPRESSION.extendBy("lifecycleStatus"),
          boundValueChanged: setLifecycletatus,
        }),
      ]
    }), config));
  }




}




export default NextBestActionButton
