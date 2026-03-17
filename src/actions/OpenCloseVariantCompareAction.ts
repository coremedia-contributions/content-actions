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
import {sitesService, SitesService} from "@coremedia/studio-client.multi-site-models";
import SvgIconUtil from "@coremedia/studio-client.base-models/util/SvgIconUtil";
import WorkArea from "@coremedia/studio-client.main.editor-components/sdk/desktop/WorkArea";
import {RemoteBeanUtil} from "@coremedia/studio-client.client-core";


interface OpenCloseVariantCompareActionConfig extends Config<ContentAction> {
}

const openCompareVariantText = ContentActions_properties.ContentAction_variantComparison_open_text;

class OpenCloseVariantCompareAction extends ContentAction {
  declare Config: OpenCloseVariantCompareActionConfig;
  isVersionCompareOpen: boolean = false;
  #ve: ValueExpression = null;
  #sitesService: SitesService;

  constructor(config: OpenCloseVariantCompareActionConfig) {
    // @ts-expect-error Ext JS semantics
    const this$ = this;
    this$.#ve = config.contentValueExpression;

    this$.#sitesService = editorContext._.getSitesService();

    function buttonPressed() {
      if (editorContext._.getWorkArea()) {
        if (!this$.isVersionCompareOpen){
          this$.openVariantComparison(this$.#ve)
        }
      }
    }

    super(ConfigUtils.apply(Config(OpenCloseVariantCompareAction, {
      text: openCompareVariantText,
      itemId: "openCloseMasterControlAcvtionItemId",
      iconCls: SvgIconUtil.getIconStyleClassForSvgIcon(versionComparison),
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

  openVariantComparison(ve: ValueExpression): void {
    const content: Content = ve ? as(ve.getValue(), Content) : null;
    const contentObject = this.#computeBaselineContentObjectToCompare(content);
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
      this.setText(openCompareVariantText);
      this.setDisabled(false);
    } else {
      this.setDisabled(true);
    }
  }

  #computeBaselineContentObjectToCompare(variant: Content): ContentObject | null | undefined {
    const baselines = variant.getProperties()?.get("base") as Content[] | undefined;
    if (baselines === undefined) {
      return undefined;
    }
    const baseline = baselines[0] ?? null;
    const masterVersion = sitesService._.getMasterVersion(variant);
    if (masterVersion === undefined) {
      return undefined;
    }
    if (masterVersion?.getContainingContent() === baseline) {
      switch (RemoteBeanUtil.isAccessible(masterVersion)) {
        case undefined:
          return undefined;
        case true:
          return masterVersion;
      }
    }
    return baseline;
  }
}



export default OpenCloseVariantCompareAction;
