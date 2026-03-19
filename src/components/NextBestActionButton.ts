import Config from "@jangaroo/runtime/Config";
import ValueExpression from "@coremedia/studio-client.client-core/data/ValueExpression";
import ConfigUtils from "@jangaroo/runtime/ConfigUtils";
import BindPlugin from "@coremedia/studio-client.ext.ui-components/plugins/BindPlugin";
import WorkArea from "@coremedia/studio-client.main.editor-components/sdk/desktop/WorkArea";
import IconDisplayFieldSkin from "@coremedia/studio-client.ext.ui-components/skins/IconDisplayFieldSkin";
import CheckInAction from "@coremedia/studio-client.ext.cap-base-components/actions/CheckInAction";
import ShowStartPublicationWorkflowWindowAction
  from "@coremedia/studio-client.main.control-room-editor-components/actions/ShowStartPublicationWorkflowWindowAction";
import ContentActions_properties from "../ContentActions_properties";
import SplitButton from "@jangaroo/ext-ts/button/Split";
import {
  observeFormCollapsed
} from "@coremedia/studio-client.form-models/premular/premularUserPreferences";
import editorContext from "@coremedia/studio-client.main.editor-components/sdk/editorContext";
import {as} from "@jangaroo/runtime";
import Premular from "@coremedia/studio-client.main.editor-components/sdk/premular/Premular";
import PremularBase from "@coremedia/studio-client.main.editor-components/sdk/premular/PremularBase";

interface NextBestActionButtonConfig extends Config<SplitButton>, Partial<Pick<NextBestActionButton,
    "contentValueExpression"|"preview"
>> {
}

class NextBestActionButton extends SplitButton {
  declare Config: NextBestActionButtonConfig;
  contentValueExpression: ValueExpression;
  lifecycleStatus: string;
  checkedIn: string;
  published: string;
  stateCls:string;
  preview: boolean = false;
  subscriber: any;

  static updateStatus(button: NextBestActionButton) {
    if (button.lifecycleStatus === undefined || button.checkedIn === undefined) return;
    button.removeCls("next_best_action_btn_state_"+button.stateCls);
    button.setDisabled(false);
    if (button.lifecycleStatus === "published") {
      button.stateCls = "published";
      button.setText(ContentActions_properties.state_published);
    } else if (button.checkedIn) {
      button.setText(ContentActions_properties.next_action_publish);
      button.stateCls = "in-production";
    } else {
      button.setText(ContentActions_properties.next_action_checkin);
      button.stateCls = "checked-out";
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

    // handle visibility if next best action button is in preview toolbar
    if (this.preview){
      //handle form collaps actions
      this.subscriber = observeFormCollapsed().subscribe((value: boolean)=>{
        this.setHidden(!value);
      });

      // handle tab change events
      WorkArea.ACTIVE_CONTENT_VALUE_EXPRESSION.addChangeListener(this.handleActiveTabChanged());

      //handle active toolbar type changed -> shrinking document form so that overflow toolbar is shown
      let premular = as(editorContext._.getWorkArea().getActiveTab(), Premular);
      if (premular) {
        let activeToolbarItemExpression = premular.getActiveToolbarItemExpression();
        if (activeToolbarItemExpression) {
          activeToolbarItemExpression.addChangeListener(this.handleActiveToolbarItemChanged())
        }
      }
    }
  }

  private handleActiveToolbarItemChanged() {
    return (valueExpression) => {
      let value = valueExpression.getValue();
      this.setHidden(value !== Premular.OVERFLOW_CONTAINER_ITEM_ID);
    };
  }

  private handleActiveTabChanged() {
    return () => {
      let premular = as(editorContext._.getWorkArea().getActiveTab(), Premular);
      if (premular) {
        let activeToolbarItemExpression = premular.getActiveToolbarItemExpression();
        if (activeToolbarItemExpression) {
          let activeToolbar = activeToolbarItemExpression.getValue();
          let isDocumentFormCollapsed = activeToolbar === PremularBase.DOCUMENT_FORM_TOOLBAR_ITEM_ID;
          this.setHidden(isDocumentFormCollapsed);
        }
      }
    };
  }

  protected override onDestroy(): any {
    if (this.subscriber){
      this.subscriber.unsubscribe();
    }

    WorkArea.ACTIVE_CONTENT_VALUE_EXPRESSION.removeChangeListener(this.handleActiveTabChanged());

    let premular = as(editorContext._.getWorkArea().getActiveTab(), Premular);
    if (premular) {
      let activeToolbarItemExpression = premular.getActiveToolbarItemExpression();
      if (activeToolbarItemExpression) {
        activeToolbarItemExpression.removeChangeListener(this.handleActiveToolbarItemChanged);
      }
    }
    return super.onDestroy();
  }
}

export default NextBestActionButton
