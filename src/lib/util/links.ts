import type { PartialWithout } from '$lib/util/types';

export type Link =
  | {
    displayText: string;
  }
  | LinkGroup;

export interface LinkGroup {
  displayText: string;
  isOpen: boolean
  links: Link[];
}

export function link(name: string): Link {
  return {
    displayText: name
  };
}

export function group(displayText: string, links: Link[], linkGroup: PartialWithout<LinkGroup, 'displayText' | 'links'> = {}): LinkGroup {
  return {
    displayText,
    links,
    // other defaults
    isOpen: false,
    // overrides
    ...linkGroup,
  };
}

export function isLinkGroup(link: Link): link is LinkGroup {
  return 'links' in link;
}
