import DependencyTrackedAction from "@coremedia/studio-client.ext.ui-components/actions/DependencyTrackedAction";
import Config from "@jangaroo/runtime/Config";
import ConfigUtils from "@jangaroo/runtime/ConfigUtils";
import editorContext from "@coremedia/studio-client.main.editor-components/sdk/editorContext";
import {as, bind} from "@jangaroo/runtime";
import Premular from "@coremedia/studio-client.main.editor-components/sdk/premular/Premular";
import ValueExpression from "@coremedia/studio-client.client-core/data/ValueExpression";
import {ContentObject, session, Version} from "@coremedia/studio-client.cap-rest-client";
import { PremularConfiguration } from "@coremedia/studio-client.form-models";
import {languageComparison, versionComparison} from "@coremedia/studio-client.common-icons";
import ContentActions_properties from "../ContentActions_properties";
import ContentAction from "@coremedia/studio-client.ext.cap-base-components/actions/ContentAction";
import Content from "@coremedia/studio-client.cap-rest-client/content/Content";
import {SitesService} from "@coremedia/studio-client.multi-site-models";
import SvgIconUtil from "@coremedia/studio-client.base-models/util/SvgIconUtil";
import WorkArea from "@coremedia/studio-client.main.editor-components/sdk/desktop/WorkArea";


interface OpenCloseMasterCompareActionConfig extends Config<ContentAction> {
}

const openCompareMasterText = ContentActions_properties.ContentAction_masterComparison_open_text;
const closeCompareVersionsText = ContentActions_properties.ContentAction_versionComparison_close_text;

class OpenCloseMasterCompareAction extends ContentAction {
  declare Config: OpenCloseMasterCompareActionConfig;
  isVersionCompareOpen: boolean = false;
  #ve: ValueExpression = null;
  #sitesService: SitesService;

  constructor(config: OpenCloseMasterCompareActionConfig) {
    // @ts-expect-error Ext JS semantics
    const this$ = this;
    this$.#ve = config.contentValueExpression;

    this$.#sitesService = editorContext._.getSitesService();

    function buttonPressed() {
      if (editorContext._.getWorkArea()) {
        if (!this$.isVersionCompareOpen){
          this$.openMasterComparison(this$.#ve)
        }
      }
    }

    super(ConfigUtils.apply(Config(OpenCloseMasterCompareAction, {
      text: openCompareMasterText,
      itemId: "openCloseMasterControlAcvtionItemId",
      iconCls: SvgIconUtil.getIconStyleClassForSvgIcon(languageComparison),
      handler: buttonPressed,
    }), config));
  }


  protected override calculateDisabled(): boolean {
    const content: Content = as(WorkArea.ACTIVE_CONTENT_VALUE_EXPRESSION.getValue(), Content);
    if (content === null) return undefined;
    if (!content.isLoaded()) return undefined;
    let master = editorContext._.getSitesService().getMaster(content);
    return (master === null || master === undefined);
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

  openMasterComparison(ve: ValueExpression): void {
    const content: Content = ve ? as(ve.getValue(), Content) : null;
    const contentObject = this.#computeMasterContentObjectToCompare(content);
    if (contentObject) {
      const contentTabManager = editorContext._.getContentTabManager();
      contentTabManager.openPremulars([new PremularConfiguration(content, contentObject, false, true)]);
      this.isVersionCompareOpen = true;
      this.updateStatus();
    }
  }

  private updateStatus() {
    let premular = as(editorContext._.getWorkArea().getActiveTab(), Premular);
    this.isVersionCompareOpen = premular.isReadOnlyDocumentPanelVisible();
    if (!this.isVersionCompareOpen){
      this.setText(openCompareMasterText);
      this.setDisabled(false);
    } else {
      this.setDisabled(true);
    }
  }

  #computeMasterContentObjectToCompare(content: Content): ContentObject {

    const masterContent = this.#sitesService.getMaster(content);
    if (masterContent === undefined) {
      return undefined;
    }
    if (masterContent === null) {
      return null;
    }
    if (!masterContent.isLoaded()) {
      masterContent.load();
      return undefined;
    }
    if (!masterContent.getState().readable) {
      return null;
    }

    const masterVersion = this.#sitesService.getMasterVersionOrDerivedFromVersion(content);
    if (masterVersion === undefined) {
      return undefined;
    }
    if (masterVersion) {
      return masterVersion;
    }

    return masterContent.getCheckedInVersion() || masterContent.getCheckedOutVersion();
  }
}



export default OpenCloseMasterCompareAction;
