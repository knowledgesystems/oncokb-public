import { Link } from 'react-router-dom';
import React from 'react';
import {
  DEFAULT_REFERENCE_GENOME,
  ONCOKB_TM,
  PAGE_ROUTE,
  REFERENCE_GENOME,
  SOP_LINK,
  YOUTUBE_VIDEO_IDS,
} from 'app/config/constants';
import {
  encodeSlash,
  getAlterationName,
  getCategoricalAlteration,
  getYouTubeLink,
  IAlteration,
} from 'app/shared/utils/Utils';
import { Linkout } from 'app/shared/links/Linkout';
import ExternalLinkIcon from 'app/shared/icons/ExternalLinkIcon';
import {
  AlterationPageHashQueries,
  AlterationPageSearchQueries,
  GenePageHashQueries,
  GenePageSearchQueries,
} from 'app/shared/route/types';
import * as QueryString from 'querystring';
import { YEAR_END_SUMMARY_RANGE } from 'app/pages/newsPage/NewsPageNavTab';
import { ALTERNATIVE_ALLELES_REGEX } from 'app/config/constants/regex';
import WithSeparator from 'react-with-separator';
import { GENETIC_TYPE } from 'app/components/geneticTypeTabs/GeneticTypeTabs';

export const getHostLinkWithProtocol = (): string => {
  return `${window.location.protocol}//${window.location.host}`;
};

export const getGenePageLink = (props: {
  hugoSymbol: string;
  searchQueries?: GenePageSearchQueries;
  hashQueries?: GenePageHashQueries;
  withProtocolHostPrefix?: boolean;
  germline?: boolean;
}): string => {
  let pageLink = `${PAGE_ROUTE.GENE_HEADER}/${props.hugoSymbol}`;
  if (props.germline !== undefined) {
    pageLink += `/${
      props.germline ? GENETIC_TYPE.GERMLINE : GENETIC_TYPE.SOMATIC
    }`;
  }
  if (props.searchQueries && Object.keys(props.searchQueries).length > 0) {
    pageLink = `${pageLink}?${QueryString.stringify(props.searchQueries)}`;
  }
  if (props.hashQueries) {
    pageLink = `${pageLink}#${QueryString.stringify(props.hashQueries)}`;
  }
  if (props.withProtocolHostPrefix) {
    pageLink = `${getHostLinkWithProtocol()}${pageLink}`;
  }
  return pageLink;
};

export const GenePageLink: React.FunctionComponent<{
  hugoSymbol: string;
  highlightContent?: boolean;
  searchQueries?: GenePageSearchQueries;
  hashQueries?: GenePageHashQueries;
  onClick?: () => void;
}> = props => {
  const highlightContent =
    props.highlightContent === undefined ? true : props.highlightContent;
  const pageLink = getGenePageLink({
    hugoSymbol: props.hugoSymbol,
    searchQueries: props.searchQueries,
    hashQueries: props.hashQueries,
  });
  return (
    <Link
      style={{ color: highlightContent ? undefined : 'black' }}
      to={pageLink}
      onClick={props.onClick}
    >
      {props.children ? props.children : props.hugoSymbol}
    </Link>
  );
};

export const getAlterationPageLink = (props: {
  hugoSymbol: string;
  alteration: IAlteration | string;
  alterationRefGenomes?: REFERENCE_GENOME[];
  cancerType?: string;
  searchQueries?: AlterationPageSearchQueries;
  hashQueries?: AlterationPageHashQueries;
  withProtocolHostPrefix?: boolean;
  germline?: boolean;
}): string => {
  const linkoutAltName = getCategoricalAlteration(
    typeof props.alteration === 'string'
      ? props.alteration
      : props.alteration.name
  );

  const geneTypePath =
    props.germline !== undefined
      ? `/${props.germline ? 'germline' : 'somatic'}`
      : '';

  let pageLink = `${PAGE_ROUTE.GENE_HEADER}/${props.hugoSymbol}${geneTypePath}/${linkoutAltName}`;
  if (props.cancerType) {
    pageLink = `${pageLink}/${encodeSlash(props.cancerType)}`;
  }
  const sq = props.searchQueries || {};

  // Prop alterationRefGenomes is just a convenient way to process reference genomes when it's a list.
  if (!sq.refGenome && props.alterationRefGenomes) {
    if (!props.alterationRefGenomes.includes(DEFAULT_REFERENCE_GENOME)) {
      sq.refGenome = props.alterationRefGenomes[0];
    }
  }
  if (Object.keys(sq).length > 0) {
    pageLink = `${pageLink}?${QueryString.stringify(sq)}`;
  }
  if (props.hashQueries) {
    pageLink = `${pageLink}#${QueryString.stringify(props.hashQueries)}`;
  }
  if (props.withProtocolHostPrefix) {
    pageLink = `${getHostLinkWithProtocol()}${pageLink}`;
  }
  return pageLink;
};

export const AlterationPageLink: React.FunctionComponent<{
  hugoSymbol: string;
  alteration: IAlteration | string;
  alterationRefGenomes?: REFERENCE_GENOME[];
  cancerType?: string;
  searchQueries?: AlterationPageSearchQueries;
  hashQueries?: AlterationPageHashQueries;
  showGene?: boolean;
  germline?: boolean;
  onClick?: () => void;
}> = props => {
  const alterationName = getAlterationName(props.alteration, true);
  const pageLink = getAlterationPageLink({
    hugoSymbol: props.hugoSymbol,
    alteration: props.alteration,
    alterationRefGenomes: props.alterationRefGenomes,
    cancerType: props.cancerType,
    searchQueries: props.searchQueries,
    hashQueries: props.hashQueries,
    germline: props.germline,
  });
  return (
    <>
      <Link to={pageLink} onClick={props.onClick}>
        {props.children
          ? props.children
          : props.showGene
          ? `${props.hugoSymbol} ${alterationName}`
          : alterationName}
      </Link>
    </>
  );
};

export const getAlternativeAllelesPageLinks = (
  hugoSymbol: string,
  alterations: string
) => {
  if (ALTERNATIVE_ALLELES_REGEX.test(alterations)) {
    const matches = ALTERNATIVE_ALLELES_REGEX.exec(alterations);
    if (matches) {
      const positionalVar = matches[1];
      const alternativeAlleles = matches[2];
      const alleleLines = alternativeAlleles.split('/').map((allele, index) => {
        return (
          <AlterationPageLink
            key={index}
            hugoSymbol={hugoSymbol}
            alteration={`${positionalVar}${allele}`}
          >
            {index === 0 ? `${positionalVar}${allele}` : allele}
          </AlterationPageLink>
        );
      });
      return <WithSeparator separator={'/'}>{alleleLines}</WithSeparator>;
    }
  }
};

export const getAlternativeGenePageLinks = (genes: string) => {
  const splits = genes.split('/');
  const temp = splits[0];
  const baseHugoSymbol = temp.substring(0, temp.length - 1);
  const geneLinks = [temp[temp.length - 1], ...splits.slice(1)].map(
    (ending, index) => {
      const hugoSymbol = `${baseHugoSymbol}${ending}`;
      return (
        <GenePageLink hugoSymbol={hugoSymbol}>
          {index === 0 ? hugoSymbol : ending}
        </GenePageLink>
      );
    }
  );
  return <WithSeparator separator={'/'}>{geneLinks}</WithSeparator>;
};

export type GenePagePath = {
  hugoSymbol?: string;
  geneticType?: GENETIC_TYPE;
};

export const parseGenePagePath = (pathname: string) => {
  const startsWithGene = pathname.startsWith(PAGE_ROUTE.GENE_HEADER);
  const inBasicGenePage = (pathname.match(/\//g) || []).length === 2;
  const inExtendedGenePage =
    (pathname.match(/\//g) || []).length === 3 &&
    (pathname.endsWith(GENETIC_TYPE.SOMATIC) ||
      pathname.endsWith(GENETIC_TYPE.GERMLINE));
  if (startsWithGene && (inBasicGenePage || inExtendedGenePage)) {
    const segments = pathname.split('/') || [];
    const result: GenePagePath = {
      hugoSymbol: segments[1],
    };
    if (segments.length > 3) {
      result.geneticType = segments[3] as GENETIC_TYPE;
    }
    return result;
  } else {
    return {};
  }
};

export type AlterationPagePath = {
  hugoSymbol?: string;
  geneticType?: GENETIC_TYPE;
};

export const parseAlterationPagePath = (pathname: string) => {
  const startsWithGene = pathname.startsWith(PAGE_ROUTE.GENE_HEADER);
  const inExtendedGenePage = (pathname.match(/\//g) || []).length >= 4;
  if (startsWithGene && inExtendedGenePage) {
    const segments = pathname.split('/') || [];
    const result: GenePagePath = {
      hugoSymbol: segments[1],
    };
    if (segments.length > 3) {
      result.geneticType = segments[3] as GENETIC_TYPE;
    }
    return result;
  } else {
    return {};
  }
};

export const getGenomicPageLocation = (props: {
  rootRoute: PAGE_ROUTE.GENOMIC_CHANGE | PAGE_ROUTE.HGVSG;
  query: string;
  refGenome?: REFERENCE_GENOME;
  cancerType?: string;
}): any => {
  const location = {
    pathname: `${props.rootRoute}/${props.query}`,
    search: {} as any,
  };
  if (props.refGenome) {
    location.search.refGenome = props.refGenome;
  }
  if (props.cancerType) {
    location.search.tumorType = encodeSlash(props.cancerType);
  }
  return location;
};

export const getGenomicPageLink = (props: {
  rootRoute: PAGE_ROUTE.GENOMIC_CHANGE | PAGE_ROUTE.HGVSG;
  query: string;
  refGenome?: REFERENCE_GENOME;
  cancerType?: string;
}): string => {
  const location = getGenomicPageLocation(props);
  let pageLink = location.pathname;
  if (Object.keys(location.search).length > 0) {
    pageLink = `${pageLink}?${QueryString.stringify(location.search)}`;
  }
  return pageLink;
};

export const TumorTypePageLink: React.FunctionComponent<{
  hugoSymbol: string;
  alteration: string;
  tumorType: string;
  content?: string;
}> = props => {
  return (
    <Link
      to={`${PAGE_ROUTE.GENE_HEADER}/${props.hugoSymbol}/${encodeSlash(
        props.alteration
      )}/${encodeSlash(props.tumorType)}`}
    >
      {props.content ? props.content : props.tumorType}
    </Link>
  );
};

export const MSILink: React.FunctionComponent<{}> = () => {
  return (
    <AlterationPageLink hugoSymbol={'Other Biomarkers'} alteration={'MSI-H'}>
      microsatellite instability high (MSI-H)
    </AlterationPageLink>
  );
};

export const OncoTreeLink: React.FunctionComponent<{}> = props => {
  return (
    <ExternalLinkIcon link="https://oncotree.info">OncoTree</ExternalLinkIcon>
  );
};

export const getActionableGenesPageLink = (
  levels?: string,
  sections?: string
) => {
  const hashes = [];
  if (levels) {
    hashes.push(`levels=${levels}`);
  }
  if (sections) {
    hashes.push(`sections=${sections}`);
  }
  return `${PAGE_ROUTE.ACTIONABLE_GENE}${
    hashes.length > 0 ? '#' : ''
  }${hashes.join('&')}`;
};

export const SopPageLink: React.FunctionComponent<{
  version?: number;
}> = props => {
  let link = SOP_LINK;
  let defaultContent = `${ONCOKB_TM} SOP`;
  if (props.version) {
    link += `/?version=v${props.version}`;
    defaultContent += ` v${props.version}`;
  }
  return <Linkout link={link}>{props.children || defaultContent}</Linkout>;
};

export const TrialActivationPageLink: React.FunctionComponent<{
  trialActivationKey: string;
  onRedirect?: () => void;
}> = props => {
  return (
    <Link
      to={`${PAGE_ROUTE.ACCOUNT_ACTIVE_TRIAL_FINISH}?key=${props.trialActivationKey}`}
      onClick={props.onRedirect}
    >
      Go to trial license agreement
    </Link>
  );
};

export const getAccountActivationLink = (
  activationKey: string,
  login: string
) => {
  return `${PAGE_ROUTE.ACCOUNT_VERIFY}?key=${activationKey}&login=${login}`;
};
export const getPasswordResetLink = (resetKey: string) => {
  return `${PAGE_ROUTE.ACCOUNT_PASSWORD_RESET_FINISH}?key=${resetKey}`;
};

export const YearEndReviewPageLink: React.FunctionComponent<{
  year?: typeof YEAR_END_SUMMARY_RANGE[number];
}> = props => {
  const link = `${PAGE_ROUTE.YEAR_END_SUMMARY}${
    props.year ? '#' + props.year : ''
  }`;
  return <Link to={link}>{props.children}</Link>;
};
