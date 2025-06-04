import ContentAction from "@coremedia/studio-client.ext.cap-base-components/actions/ContentAction";
import Config from "@jangaroo/runtime/Config";
import {bind} from "@jangaroo/runtime";
import RenameActionUtil from "@coremedia/studio-client.main.editor-components/sdk/actions/RenameActionUtil";
import Actions_properties from "@coremedia/studio-client.main.editor-components/sdk/actions/Actions_properties";
import {AnyFunction} from "@jangaroo/runtime/types";
import contentTreeRelationRegistry from "@coremedia/studio-client.cap-base-models/content/contentTreeRelationRegistry";
import ContentTreeRelation from "@coremedia/studio-client.cap-base-models/content/ContentTreeRelation";
import StringUtil from "@jangaroo/ext-ts/String";
import MessageBoxUtil from "@coremedia/studio-client.ext.ui-components/messagebox/MessageBoxUtil";
import Content from "@coremedia/studio-client.cap-rest-client/content/Content";


interface CustomRenameActionConfig extends Config<ContentAction>{}

class CustomRenameAction extends ContentAction {
  declare Config: CustomRenameActionConfig;
    static ACTION_ID: string = "customRenameAction";

  constructor(config: Config<CustomRenameAction> = null) {
    // @ts-expect-error Ext JS semantics
    const this$ = this;
    config.text = "Rename";
    config.handler = bind(this$, this$.#doRename);
    super(config);
  }

  #doRename(): void {
    const contents: Array<any> = this.getContents();
    if (!contents || !contents.length) {
      return;
    }
    const content: Content = contents[0];

    const title = Actions_properties.Action_renameTabContentAction_title_text;
    const message = Actions_properties.Action_renameTabContentAction_message_text;
    const clickedContent = content;
    const callback: AnyFunction = (btn: string, newName: string): void => {
      if (btn === "ok") {
        contentTreeRelationRegistry._.findExtension(clickedContent, (treeRelation: ContentTreeRelation): void => {
          if (treeRelation) {
            RenameActionUtil.renameWithPromptForFolders(treeRelation, clickedContent, StringUtil.trim(newName));
          }
        });
      }
    };
    const value = clickedContent.getName();
    MessageBoxUtil.prompt(title, message, callback, value);
  }

}

export  default CustomRenameAction;
