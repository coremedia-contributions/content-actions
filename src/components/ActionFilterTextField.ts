import TextField from "@jangaroo/ext-ts/form/field/Text";
import ConfigUtils from "@jangaroo/runtime/ConfigUtils";
import Config from "@jangaroo/runtime/Config";
import Menu from "@jangaroo/ext-ts/menu/Menu";
import Item from "@jangaroo/ext-ts/menu/Item";
import Component from "@jangaroo/ext-ts/Component";
import Separator from "@jangaroo/ext-ts/menu/Separator";

const SEARCH_MIN_CHARACTERS = 1;

class ActionFilterTextField extends TextField {

  constructor(config: Config<ActionFilterTextField> = null) {
    super(ConfigUtils.apply(Config(ActionFilterTextField, {
      emptyText:"Search...",
      height: 30,
    }), config));
  }

  protected override onChange(newVal: string, oldVal: any): any {
      let menu: Menu = this.findParentByType(Menu.xtype) as Menu;
      if (menu){
        let items = menu.items;

        items.each((item)=> {
          // if search input hide all menu items not starting with search string
          if (item.xtype === Item.xtype && !this.contains(item, newVal) && newVal.length >= SEARCH_MIN_CHARACTERS) {
              item.setHidden(true);
            }
          // if search input hide all separators
          else if (item.xtype === Separator.xtype && newVal.length >= SEARCH_MIN_CHARACTERS){
              item.setHidden(true);
            }
          // in al other cases show all items
          else {
              item.setHidden(false);
            }
        });
        menu.items = items;
      }
  }

  private contains(item: Component, value: string) {
    return (item as Item).text.toUpperCase().indexOf(value.toUpperCase()) > -1;
  }
}

export default ActionFilterTextField;
