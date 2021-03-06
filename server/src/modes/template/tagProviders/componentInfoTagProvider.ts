import {
  HTMLTagSpecification,
  IHTMLTagProvider,
  ITagSet,
  collectTagsDefault,
  collectAttributesDefault,
  collectValuesDefault,
  genAttribute,
  Priority,
  Attribute
} from './common';
import { ChildComponent } from '../../../services/vueInfoService';
import { MarkupContent } from 'vscode-languageserver-types';

export function getComponentInfoTagProvider(childComponents: ChildComponent[]): IHTMLTagProvider {
  const tags: ITagSet = {};
  for (const cc of childComponents) {
    const props: Attribute[] = [];
    if (cc.info && cc.info.componentInfo.props) {
      cc.info.componentInfo.props.forEach(p => {
        props.push(genAttribute(p.name, undefined, { kind: 'markdown', value: p.documentation || '' }));
      });
    }
    tags[cc.name] = new HTMLTagSpecification({
      kind: 'markdown',
      value: cc.documentation || ''
    }, props);
  }
  return {
    getId: () => 'component',
    priority: Priority.UserCode,
    collectTags: collector => collectTagsDefault(collector, tags),
    collectAttributes: (
      tag: string,
      collector: (attribute: string, type?: string, documentation?: string | MarkupContent) => void
    ) => {
      collectAttributesDefault(tag, collector, tags, []);
    },
    collectValues: (tag: string, attribute: string, collector: (value: string) => void) => {
      collectValuesDefault(tag, attribute, collector, tags, [], {});
    }
  };
}
