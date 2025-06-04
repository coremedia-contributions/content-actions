import Config from "@jangaroo/runtime/Config";
import ConfigUtils from "@jangaroo/runtime/ConfigUtils";
import BindPlugin from "@coremedia/studio-client.ext.ui-components/plugins/BindPlugin";
import { bind } from "@jangaroo/runtime";
import Component from "@jangaroo/ext-ts/Component";
import ValueExpression from "@coremedia/studio-client.client-core/data/ValueExpression";

interface HideComponentPluginConfig extends Config<BindPlugin> {

}

class HideComponentPlugin extends BindPlugin {

  declare Config: HideComponentPluginConfig;

  constructor(config: Config<HideComponentPlugin> = null) {
    // @ts-expect-error Ext JS semantics
    const this$ = this;
    super(ConfigUtils.apply(Config(HideComponentPlugin, {
      boundValueChanged: bind(this$, this$.hideOrShowComponent)
    }), config));
  }

  hideOrShowComponent(component: Component, valueExpression: ValueExpression): void {
    let value = valueExpression.getValue();
    value === true ? component.hide() : component.show();
  }

}

export default HideComponentPlugin;
