import Config from "@jangaroo/runtime/Config";
import AbstractItemsPlugin from "@coremedia/studio-client.ext.ui-components/plugins/AbstractItemsPlugin";
import Component from "@jangaroo/ext-ts/Component";
import Container from "@jangaroo/ext-ts/container/Container";
import { as } from "@jangaroo/runtime";
import Array from "@jangaroo/ext-ts/data/field/Array";
import Ext from "@jangaroo/ext-ts";

interface HideItemsPluginConfig extends Config<AbstractItemsPlugin> {

}

/**
 * Hides all items of the container that match any item from the provided list of items.
 */
class HideItemsPlugin extends AbstractItemsPlugin {

  declare Config: HideItemsPluginConfig;

  #componentIds: Record<string, any> = {};

  #itemIds: Record<string, any> = {};

  #xclasses: Record<string, any> = {};

  #indexHandled: boolean = false;

  constructor(config: Config<HideItemsPlugin> = null) {
    super(config);

    this.analysePositionList(config.items, this.#itemIds, this.#componentIds, this.#xclasses);
  }

  // @ts-ignore
  protected override doManipulateItems(container: Container, items: Array<any>): void {
    if (!items) {
      items = [];
    }

    //noinspection JSMismatchedCollectionQueryUpdateInspection
    if (container.items) {
      container.items.each((component: Component, itemIndex: number): boolean => {
        if (component) {
          const itemId = component.getItemId();
          const id = component.getId();
          const xclass = Ext.getClassName(as(component, Object));
          if ((!this.#indexHandled && itemIndex === this.getIndex() && !this.isRecursive()) || this.#componentIds[id] === true || this.#itemIds[itemId] === true || this.#xclasses[xclass] === true) {
            items.push(component);
          }
          if (this.isRecursive()) {
            this.manipulateItems(component, items);
          }
        }
        return true;
      });
    }
    items.forEach((componentToHide: Component): void => {
      componentToHide.hide();
    });
  }
}

export default HideItemsPlugin;
