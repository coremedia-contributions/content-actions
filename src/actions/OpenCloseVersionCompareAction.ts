import Config from "@jangaroo/runtime/Config";
import ConfigUtils from "@jangaroo/runtime/ConfigUtils";
import editorContext from "@coremedia/studio-client.main.editor-components/sdk/editorContext";
import {as, bind} from "@jangaroo/runtime";
import Premular from "@coremedia/studio-client.main.editor-components/sdk/premular/Premular";
import ValueExpression from "@coremedia/studio-client.client-core/data/ValueExpression";
import {Version} from "@coremedia/studio-client.cap-rest-client";
import { PremularConfiguration } from "@coremedia/studio-client.form-models";
import {SvgIconUtil} from "@coremedia/studio-client.base-models";
import {versionComparison} from "@coremedia/studio-client.common-icons";
import ContentActions_properties from "../ContentActions_properties";
import ContentAction from "@coremedia/studio-client.ext.cap-base-components/actions/ContentAction";
import Content from "@coremedia/studio-client.cap-rest-client/content/Content";


interface OpenCloseVersionCompareActionConfig extends Config<ContentAction> {
}

const openCompareVersionsText = ContentActions_properties.ContentAction_versionComparison_open_text;
const closeCompareVersionsText = ContentActions_properties.ContentAction_versionComparison_close_text;

class OpenCloseVersionCompareAction extends ContentAction {
  declare Config: OpenCloseVersionCompareActionConfig;
  isVersionCompareOpen: boolean = false;
  versionValueExpression: ValueExpression = null;
  #ve: ValueExpression = null;

  constructor(config: OpenCloseVersionCompareActionConfig) {
    // @ts-expect-error Ext JS semantics
    const this$ = this;
    this$.#ve = config.contentValueExpression;

    function buttonPressed() {
      if (editorContext._.getWorkArea()) {
        if (!this$.isVersionCompareOpen){
          this$.openVersionComparison(this$.#ve)
        }
      }
    }

    super(ConfigUtils.apply(Config(OpenCloseVersionCompareAction, {
      text: openCompareVersionsText,
      itemId: "openCloseVersionControlAcvtionItemId",
      iconCls: SvgIconUtil.getIconStyleClassForSvgIcon(versionComparison),
      handler: buttonPressed,
    }), config));
  }


  protected override onFirstComponentAdded() {
    let premular = as(editorContext._.getWorkArea().getActiveTab(), Premular);
    premular.getReadOnlyContentValueExpression().addChangeListener(bind(this, this.updateStatus))
    super.onFirstComponentAdded();
  }

  protected override onLastComponentRemoved(): void {
    super.onLastComponentRemoved();
    let premular = as(editorContext._.getWorkArea().getActiveTab(), Premular);
    premular.getReadOnlyContentValueExpression().removeChangeListener(bind(this, this.updateStatus));
  }

  openVersionComparison(ve: ValueExpression): void {
    const content: Content = ve ? as(ve.getValue(), Content) : null;
    const version = this.#computeVersionToCompare(content);
    if (version) {
      const contentTabManager = editorContext._.getContentTabManager();
      const content = version.getContainingContent();
      const contentToVersionMap: Record<string, any> = {};
      contentToVersionMap[content.getUriPath()] = version;
      contentTabManager.openPremulars([new PremularConfiguration(content, version, false, true)]);
      this.isVersionCompareOpen = true;
      this.updateStatus();
    }
  }

  private updateStatus() {
    let premular = as(editorContext._.getWorkArea().getActiveTab(), Premular);
    this.isVersionCompareOpen = premular.isReadOnlyDocumentPanelVisible();
    if (!this.isVersionCompareOpen){
      this.setText(openCompareVersionsText);
      this.setDisabled(false);
    }else{
      this.setDisabled(true);
    }
  }

  #computeVersionToCompare(content: Content): Version {
    const latestPublishedVersion = content.getLatestPublishedVersion();
    if (latestPublishedVersion) {
      return latestPublishedVersion;
    }

    const versionHistory = content.getVersionHistory();
    if (!versionHistory || !versionHistory.isLoaded()) {
      versionHistory && versionHistory.load();
      return undefined;
    }

    const versions = versionHistory.getItems();
    if (!versions || versions.length === 0) {
      return null;
    }

    if (versions.length === 1) {
      return versions[0];
    }
    if (content.isCheckedIn()) {
      return versions[versions.length - 2];
    } else {
      return versions[versions.length - 1];
    }
  }
}



export default OpenCloseVersionCompareAction;
