import type { RequiredKeys } from '$lib/util/types';

export type Link =
  | SingleLink
  | GroupLink;

export interface SingleLink {
  id: string;
  displayText: string;
  href: string;
  newTab?: boolean
  state: 'active' | 'child-active' | 'inactive'
}

const SINGLE_LINK_DEFAULTS = {
  newTab: false,
  state: 'inactive',
} satisfies Partial<SingleLink>

type DefaultedSingleLinkKeys = keyof typeof SINGLE_LINK_DEFAULTS
export type DefaultedSingleLinkValues = {
  [K in DefaultedSingleLinkKeys]: SingleLink[K]
}

type MandatorySingleLinkKeys = Exclude<RequiredKeys<SingleLink>, DefaultedSingleLinkKeys>
type OptionalSingleLinkKeys = keyof Omit<SingleLink, MandatorySingleLinkKeys>
export type MandatorySingleLinkValues = Pick<SingleLink, MandatorySingleLinkKeys> & Partial<Pick<SingleLink, OptionalSingleLinkKeys>>

export interface GroupLink {
  id: string;
  displayText: string;
  isOpen: boolean
  links: Link[];
  state: 'active' | 'child-active' | 'inactive'
}

const GROUP_LINK_DEFAULTS = {
  isOpen: true,
  state: 'inactive',
} satisfies Partial<GroupLink>

type DefaultedGroupLinkKeys = keyof typeof GROUP_LINK_DEFAULTS
export type DefaultedGroupLinkValues = {
  [K in DefaultedGroupLinkKeys]: GroupLink[K]
}

type MandatoryGroupLinkKeys = Exclude<RequiredKeys<GroupLink>, DefaultedGroupLinkKeys>
type OptionalGroupLinkKeys = keyof Omit<GroupLink, MandatoryGroupLinkKeys>
export type MandatoryGroupLinkValues = Pick<GroupLink, MandatoryGroupLinkKeys> & Partial<Pick<GroupLink, OptionalGroupLinkKeys>>

export function link(link: MandatorySingleLinkValues): Link {
  return {
    ...SINGLE_LINK_DEFAULTS,
    ...link,
  };
}

export function group(link: MandatoryGroupLinkValues): GroupLink {
  return {
    ...GROUP_LINK_DEFAULTS,
    ...link,
  };
}

export function isGroupLink(link: Link): link is GroupLink {
  return 'links' in link;
}

export function setLinkState(link: Link, state: Link['state'], options: {
  recursive: boolean;
}) {
  const checklist: Set<Link> = new Set()
  const setState = (link: Link, state: Link['state']) => {
    if (!checklist.has(link)) {
      checklist.add(link)
      link.state = state
      if (isGroupLink(link) && options.recursive) {
        link.links.forEach(child => setState(child, state))
      }
    }
  }

  setState(link, state)
}
