import _ from 'lodash';
import {
  LEVEL_PRIORITY,
  LEVEL_TYPES,
  LEVELS,
  MUTATIONS_TABLE_COLUMN_KEY,
  ONCOGENICITY,
  MUTATION_EFFECT,
  TREATMENTS_TABLE_COLUMN_KEY,
} from './../config/constants';
import { Alteration, Citations } from '../config/constants';
import html2pdf from 'html2pdf.js';
import InfoIcon from './icons/InfoIcon';
import {
  DEFAULT_REFERENCE_GENOME,
  PAGE_ROUTE,
  REFERENCE_GENOME,
} from './../config/constants';
import { PAGE_TITLE } from './../config/constants';
import {
  AlterationPageHashQueries,
  AlterationPageSearchQueries,
  GenePageHashQueries,
  GenePageSearchQueries,
  Version,
  CATEGORICAL_ALTERATIONS,
} from './../config/constants';
import * as QueryString from 'querystring';
import React from 'react';
import { LevelWithDescription } from './icons/LevelWithDescription';
import { HOSTNAME } from './../config/constants';
import ReadMore from './readMore/ReadMore';
import './styles/index.module.scss';
import 'jspdf-autotable';
import logoImage from './../public/logo.png';
import { COLOR_BLUE } from './../config/theme';

export interface IAlteration {
  alteration: string;
  name: string;
}

export const isCategoricalAlteration = (alteration: string) => {
  return (
    alteration &&
    CATEGORICAL_ALTERATIONS.filter(alt =>
      alteration.toLowerCase().startsWith(alt.toLowerCase())
    ).length > 0
  );
};

export const getCategoricalAlteration = (alteration: string) => {
  if (isCategoricalAlteration(alteration)) {
    const matched = CATEGORICAL_ALTERATIONS.filter(categoricalAlt => {
      return alteration.toLowerCase().startsWith(categoricalAlt.toLowerCase());
    });
    return matched.pop();
  }
  return alteration;
};

/**
 *
 * @param alteration Alteration, either in string or in IAlteration
 * @param showNameDiff show alteration when name is different. Default: false
 */
export function getAlterationName(
  alteration: IAlteration | string,
  showNameDiff?: boolean
): string {
  const alt: string =
    typeof alteration === 'string' ? alteration : alteration.alteration;
  const name: string =
    typeof alteration === 'string' ? alteration : alteration.name;
  const isCategoricalAlt = isCategoricalAlteration(alt);
  const hasExclusionArm = alt.includes('{');
  if (
    !showNameDiff ||
    alt === name ||
    isCategoricalAlt ||
    hasExclusionArm ||
    name.includes(alt)
  ) {
    return name;
  } else {
    return `${name} (${alt})`;
  }
}

const SLASH_HTML_ENTITY_CODE = '%2F';
export function encodeSlash(content: string | undefined) {
  return content
    ? content.replace(new RegExp('/', 'g'), SLASH_HTML_ENTITY_CODE)
    : content;
}

const getLevelPageLink = (levelType: LEVEL_TYPES, version?: Version) => {
  let levelLink = `${HOSTNAME}`;
  switch (levelType) {
    case LEVEL_TYPES.TX:
      levelLink += PAGE_ROUTE.V2;
      break;
    case LEVEL_TYPES.DX:
      levelLink += PAGE_ROUTE.DX;
      break;
    case LEVEL_TYPES.PX:
      levelLink += PAGE_ROUTE.PX;
      break;
    case LEVEL_TYPES.FDA:
      levelLink += PAGE_ROUTE.FDA_NGS;
      break;
    default:
      break;
  }
  if (version) {
    levelLink = `${levelLink}#version=${version}`;
  }
  return levelLink;
};

const getDefaultLinkContent = (levelType: LEVEL_TYPES, version?: Version) => {
  let content = '';
  switch (levelType) {
    case LEVEL_TYPES.TX:
      content = PAGE_TITLE.V2;
      if (version) {
        switch (version) {
          case Version.AAC:
            content = PAGE_TITLE.AAC;
            break;
          case Version.FDA:
            content = PAGE_TITLE.FDA;
            break;
          case Version.V1:
            content = PAGE_TITLE.V1;
            break;
          default:
            break;
        }
      }
      break;
    case LEVEL_TYPES.DX:
      content = PAGE_TITLE.V2;
      break;
    case LEVEL_TYPES.PX:
      content = PAGE_TITLE.V2;
      break;
    case LEVEL_TYPES.FDA:
      content = PAGE_TITLE.FDA_NGS;
      break;
    default:
      content = 'level of evidence';
      break;
  }
  return content;
};

export const LevelOfEvidencePageLink: React.FunctionComponent<{
  levelType: LEVEL_TYPES;
  version?: Version;
  children?: React.ReactNode;
}> = props => {
  return (
    <a href={getLevelPageLink(props.levelType, props.version)}>
      {props.children ? (
        props.children
      ) : (
        <span>{getDefaultLinkContent(props.levelType, props.version)}</span>
      )}
    </a>
  );
};

export const getGenePageLink = (props: {
  hugoSymbol: string;
  searchQueries?: GenePageSearchQueries;
  hashQueries?: GenePageHashQueries;
}): string => {
  let pageLink = `${HOSTNAME}${PAGE_ROUTE.GENE_HEADER}/${props.hugoSymbol}`;
  if (props.searchQueries && Object.keys(props.searchQueries).length > 0) {
    pageLink = `${pageLink}?${QueryString.stringify(props.searchQueries)}`;
  }
  if (props.hashQueries) {
    pageLink = `${pageLink}#${QueryString.stringify(props.hashQueries)}`;
  }
  return pageLink;
};

export const GenePageLink: React.FunctionComponent<{
  hugoSymbol: string;
  highlightContent?: boolean;
  searchQueries?: GenePageSearchQueries;
  hashQueries?: GenePageHashQueries;
  onClick?: () => void;
  children?: React.ReactNode;
}> = props => {
  const highlightContent =
    props.highlightContent === undefined ? true : props.highlightContent;
  const pageLink = getGenePageLink({
    hugoSymbol: props.hugoSymbol,
    searchQueries: props.searchQueries,
    hashQueries: props.hashQueries,
  });
  return (
    <a
      style={{ color: highlightContent ? undefined : 'black' }}
      href={pageLink}
      onClick={props.onClick}
    >
      {props.children ? props.children : props.hugoSymbol}
    </a>
  );
};

export const getAlterationPageLink = (props: {
  hugoSymbol: string;
  alteration: IAlteration | string;
  alterationRefGenomes?: REFERENCE_GENOME[];
  cancerType?: string;
  searchQueries?: AlterationPageSearchQueries;
  hashQueries?: AlterationPageHashQueries;
}): string => {
  const linkoutAltName = getCategoricalAlteration(
    typeof props.alteration === 'string'
      ? props.alteration
      : props.alteration.name
  );

  let pageLink = `${HOSTNAME}${PAGE_ROUTE.GENE_HEADER}/${props.hugoSymbol}/${linkoutAltName}`;
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
  onClick?: () => void;
  children?: React.ReactNode;
}> = props => {
  const alterationName = getAlterationName(props.alteration, true);
  const pageLink = getAlterationPageLink({
    hugoSymbol: props.hugoSymbol,
    alteration: props.alteration,
    alterationRefGenomes: props.alterationRefGenomes,
    cancerType: props.cancerType,
    searchQueries: props.searchQueries,
    hashQueries: props.hashQueries,
  });
  return (
    <>
      <a href={pageLink} onClick={props.onClick}>
        {props.children
          ? props.children
          : props.showGene
          ? `${props.hugoSymbol} ${alterationName}`
          : alterationName}
      </a>
    </>
  );
};

export function sortNumber(a: number, b: number): number {
  if (!_.isNumber(a)) {
    if (!_.isNumber(b)) {
      return 0;
    } else {
      return 1;
    }
  }
  if (!_.isNumber(b)) {
    return -1;
  }
  return a - b;
}

export function sortByAlteration(a: Alteration, b: Alteration): number {
  // force null and undefined to the bottom
  let result = sortNumber(a.proteinStart, b.proteinStart);

  if (result === 0) {
    result = sortNumber(a.proteinEnd, b.proteinEnd);
  }

  if (result === 0) {
    result = a.name.localeCompare(b.name);
  }
  return result;
}

export function defaultSortMethod(a: any, b: any): number {
  // force null and undefined to the bottom
  a = a === null || a === undefined ? -Infinity : a;
  b = b === null || b === undefined ? -Infinity : b;

  // force any string values to lowercase
  a = typeof a === 'string' ? a.toLowerCase() : a;
  b = typeof b === 'string' ? b.toLowerCase() : b;

  // Return either 1 or -1 to indicate a sort priority
  if (a > b) {
    return 1;
  }
  if (a < b) {
    return -1;
  }

  // returning 0 or undefined will use any subsequent column sorting methods or the row index as a tiebreaker
  return 0;
}

export function citationsSortMethod(a: Citations, b: Citations) {
  const numOfReferencesA = a.abstracts.length + a.pmids.length;
  const numOfReferencesB = b.abstracts.length + b.pmids.length;

  return numOfReferencesA - numOfReferencesB;
}

const oncogenicityOrder = [
  ONCOGENICITY.ONCOGENIC,
  ONCOGENICITY.LIKELY_ONCOGENIC,
  ONCOGENICITY.PREDICTED_ONCOGENIC,
  ONCOGENICITY.RESISTANCE,
  ONCOGENICITY.NEUTRAL,
  ONCOGENICITY.LIKELY_NEUTRAL,
  ONCOGENICITY.INCONCLUSIVE,
  ONCOGENICITY.UNKNOWN,
];
const mutationEffectOrder = [
  MUTATION_EFFECT.GAIN_OF_FUNCTION,
  MUTATION_EFFECT.LIKELY_GAIN_OF_FUNCTION,
  MUTATION_EFFECT.LOSS_OF_FUNCTION,
  MUTATION_EFFECT.LIKELY_LOSS_OF_FUNCTION,
  MUTATION_EFFECT.NEUTRAL,
  MUTATION_EFFECT.LIKELY_NEUTRAL,
  MUTATION_EFFECT.SWITCH_OF_FUNCTION,
  MUTATION_EFFECT.LIKELY_SWITCH_OF_FUNCTION,
  MUTATION_EFFECT.INCONCLUSIVE,
  MUTATION_EFFECT.UNKNOWN,
];

export function sortByArrayIndexAsc(aIndex: number, bIndex: number) {
  if (aIndex === bIndex) {
    return 0;
  } else if (aIndex === -1) {
    return 1;
  } else if (bIndex === -1) {
    return -1;
  } else {
    return aIndex - bIndex;
  }
}

export function sortByArrayIndexDesc(aIndex: number, bIndex: number) {
  if (aIndex === bIndex) {
    return 0;
  } else if (aIndex === -1) {
    return 1;
  } else if (bIndex === -1) {
    return -1;
  } else {
    return bIndex - aIndex;
  }
}

export function oncogenicitySortMethod(a: ONCOGENICITY, b: ONCOGENICITY) {
  return sortByArrayIndexDesc(
    oncogenicityOrder.indexOf(a),
    oncogenicityOrder.indexOf(b)
  );
}

export function mutationEffectSortMethod(
  a: MUTATION_EFFECT,
  b: MUTATION_EFFECT
) {
  return sortByArrayIndexAsc(
    mutationEffectOrder.indexOf(a),
    mutationEffectOrder.indexOf(b)
  );
}

export function level2LevelOfEvidence(level: LEVELS) {
  switch (level) {
    case LEVELS.Tx3:
    case LEVELS.Tx3A:
      return 'LEVEL_3A';
    default:
      return `LEVEL_${level}`;
  }
}

export function OncogenicityToClassnames(oncogenicity: string): string {
  if (oncogenicity === 'Predicted Oncogenic') {
    return 'likely-oncogenic';
  } else {
    const oncogenicityTerms = oncogenicity.split(' ');
    return oncogenicityTerms.length === 1
      ? oncogenicityTerms[0].toLowerCase()
      : oncogenicityTerms.map(term => term.toLowerCase()).join('-');
  }
}

export function LevelOfEvidenceToClassnames(level: string): string | null {
  if (level.startsWith('LEVEL_')) {
    const remainingString = level.substring(6);
    return 'level-' + remainingString;
  }
  return null;
}

export const FdaLevelIcon: React.FunctionComponent<{
  level: LEVELS;
  withDescription?: boolean;
}> = ({ level, withDescription = true }) => {
  const fdaIcon = level ? (
    <span className="fa-stack" style={{ fontSize: 9, lineHeight: '18px' }}>
      <span className="fa fa-circle-thin fa-stack-2x"></span>
      <strong className="fa-stack-1x">{level.replace('LEVEL_Fda', '')}</strong>
    </span>
  ) : (
    'NA'
  );

  let levelDescription = '';
  switch (level) {
    case LEVELS.Fda1:
      levelDescription = 'Companion Diagnostics';
      break;
    case LEVELS.Fda2:
      levelDescription =
        'Cancer Mutations with Evidence of Clinical Significance';
      break;
    case LEVELS.Fda3:
      levelDescription =
        'Cancer Mutations with Evidence of Potential Clinical Significance';
      break;
    default:
      break;
  }
  return withDescription && level ? (
    <LevelWithDescription level={level} description={levelDescription}>
      {fdaIcon}
    </LevelWithDescription>
  ) : (
    <>{fdaIcon}</>
  );
};

export function filterByKeyword(
  value: string | undefined | null,
  keyword: string
): boolean {
  return value ? value.toLowerCase().includes(keyword.trim()) : false;
}

export const OncoKBLevelIcon: React.FunctionComponent<{
  level: LEVELS;
  withDescription?: boolean;
}> = ({ level, withDescription = true }) => {
  const oncokbIcon = level ? (
    <i className={`oncokb icon ${OncogenicityToClassnames(level)}`} />
  ) : (
    'NA'
  );
  return withDescription && level ? (
    <LevelWithDescription level={level}>{oncokbIcon}</LevelWithDescription>
  ) : (
    <>{oncokbIcon}</>
  );
};

export const EvidenceLevelIcon: React.FunctionComponent<{
  level: LEVELS;
  withDescription?: boolean;
}> = ({ level, withDescription = true }) => {
  const oncokbIcon = level ? (
    <i className={`oncokb icon ${LevelOfEvidenceToClassnames(level)}`} />
  ) : (
    'NA'
  );
  return withDescription && level ? (
    <LevelWithDescription level={level}>{oncokbIcon}</LevelWithDescription>
  ) : (
    <>{oncokbIcon}</>
  );
};

export function getDefaultColumnDefinition<T>(
  columnKey: MUTATIONS_TABLE_COLUMN_KEY | TREATMENTS_TABLE_COLUMN_KEY,
  viewportWidth: number,
  alterationType: string
):
  | {
      id: string;
      Header: React.ReactNode;
      accessor: string;
      minWidth?: number;
      width: number;
      style?: object;
      defaultSortDesc: boolean;
      Cell?: React.FC<{ original: any }>;
      sortMethod?: (a: any, b: any) => number;
      sortable?: boolean;
    }
  | undefined {
  switch (columnKey) {
    case MUTATIONS_TABLE_COLUMN_KEY.GENE:
      return {
        id: MUTATIONS_TABLE_COLUMN_KEY.GENE,
        Header: <span className="font-medium">Gene</span>,
        accessor: 'gene',
        width: 100,
        minWidth: 100,
        defaultSortDesc: false,
        sortMethod: defaultSortMethod,
        Cell: (props: { original: any }) => (
          <GenePageLink hugoSymbol={props.original.gene} />
        ),
      };
    case MUTATIONS_TABLE_COLUMN_KEY.MUTATION:
      return {
        id: MUTATIONS_TABLE_COLUMN_KEY.MUTATION,
        Header: <span className="font-medium">{alterationType}</span>,
        accessor: 'mutation',
        width: 120,
        minWidth: 120,
        defaultSortDesc: false,
        sortMethod: defaultSortMethod,
        Cell: (props: { original: any }) => (
          <AlterationPageLink
            hugoSymbol={props.original.gene}
            alteration={props.original.mutation}
          />
        ),
      };
    case MUTATIONS_TABLE_COLUMN_KEY.ONCOGENICITY:
      return {
        id: MUTATIONS_TABLE_COLUMN_KEY.ONCOGENICITY,
        Header: <span className="font-medium">Oncogenicity</span>,
        accessor: 'oncogenicity',
        width: 150,
        minWidth: 150,
        defaultSortDesc: true,
        sortable: true,
        sortMethod: oncogenicitySortMethod,
        Cell: (props: any) => (
          <div className={'d-flex justify-content-center'}>
            <span className="fa-stack">
              <OncoKBLevelIcon
                level={props.original.oncogenicity}
                withDescription={false}
              />
            </span>
          </div>
        ),
      };
    case MUTATIONS_TABLE_COLUMN_KEY.LEVEL:
      return {
        id: MUTATIONS_TABLE_COLUMN_KEY.LEVEL,
        Header: (
          <div className={'d-flex justify-content-center'}>
            <span className="font-medium">
              Level of evidence
              <InfoIcon
                style={{ marginLeft: '5px' }}
                overlay={
                  <span>
                    For more information about the FDA Level of Evidence, please
                    see{' '}
                    <LevelOfEvidencePageLink levelType={LEVEL_TYPES.FDA}>
                      <b>HERE</b>
                    </LevelOfEvidencePageLink>
                    .
                  </span>
                }
              />
            </span>
          </div>
        ),
        accessor: 'level',
        width: 140,
        minWidth: 140,
        defaultSortDesc: true,
        sortMethod(a: string, b: string) {
          return (
            LEVEL_PRIORITY.indexOf(a.replace('LEVEL_', '') as LEVELS) -
            LEVEL_PRIORITY.indexOf(b.replace('LEVEL_', '') as LEVELS)
          );
        },
        Cell: (props: any) => (
          <div className={'d-flex justify-content-center'}>
            <span className="fa-stack">
              {props.original.level === 'NA' ? (
                'NA'
              ) : props.original.level[6] === 'F' ? (
                <FdaLevelIcon
                  level={props.original.level}
                  withDescription={false}
                />
              ) : (
                <EvidenceLevelIcon
                  level={props.original.level}
                  withDescription={false}
                />
              )}
            </span>
          </div>
        ),
      };
    case MUTATIONS_TABLE_COLUMN_KEY.BIOLOGICAL_EFFECT:
      return {
        id: MUTATIONS_TABLE_COLUMN_KEY.BIOLOGICAL_EFFECT,
        Header: <span className="font-medium">Biological effect</span>,
        accessor: 'biologicalEffect',
        width: 150,
        minWidth: 150,
        defaultSortDesc: false,
        sortable: false,
      };
    case MUTATIONS_TABLE_COLUMN_KEY.MUTATION_DESCRIPTION:
      return {
        id: MUTATIONS_TABLE_COLUMN_KEY.MUTATION_DESCRIPTION,
        Header: <span className="font-medium">Description</span>,
        accessor: 'mutationDescription',
        style: { whiteSpace: 'normal' },
        width: viewportWidth * 0.275,
        minWidth: viewportWidth * 0.275,
        defaultSortDesc: false,
        sortable: false,
        Cell: (props: any) => (
          <div className={'d-flex my-1'}>
            {props.original.mutationDescription !== 'NA' ? (
              <ReadMore text={props.original.mutationDescription} />
            ) : (
              <div>{props.original.mutationDescription}</div>
            )}
          </div>
        ),
      };
    case MUTATIONS_TABLE_COLUMN_KEY.CONSEQUENCE_TYPE:
      return {
        id: MUTATIONS_TABLE_COLUMN_KEY.CONSEQUENCE_TYPE,
        Header: <span className="font-medium">Consequence type</span>,
        accessor: 'consequenceType',
        style: { whiteSpace: 'normal' },
        width: 150,
        minWidth: 150,
        defaultSortDesc: false,
        sortMethod: defaultSortMethod,
      };
    case TREATMENTS_TABLE_COLUMN_KEY.BIOMARKER:
      return {
        id: TREATMENTS_TABLE_COLUMN_KEY.BIOMARKER,
        Header: <span className="font-medium">Biomarker</span>,
        accessor: 'biomarker',
        style: { whiteSpace: 'normal' },
        width: 150,
        minWidth: 150,
        defaultSortDesc: false,
        sortMethod: defaultSortMethod,
      };
    case TREATMENTS_TABLE_COLUMN_KEY.DRUG:
      return {
        id: TREATMENTS_TABLE_COLUMN_KEY.DRUG,
        Header: <span className="font-medium">Drug</span>,
        accessor: 'drug',
        style: { whiteSpace: 'normal' },
        width: 200,
        minWidth: 200,
        defaultSortDesc: false,
        sortMethod: defaultSortMethod,
        Cell: (props: any) => (
          <div className={'d-flex justify-content-center'}>
            <span>{props.original.drug}</span>
          </div>
        ),
      };
    case TREATMENTS_TABLE_COLUMN_KEY.TREATMENTS_LEVEL:
      return {
        id: TREATMENTS_TABLE_COLUMN_KEY.TREATMENTS_LEVEL,
        Header: (
          <div className={'d-flex justify-content-center'}>
            <div className="font-medium">
              Level of evidence
              <InfoIcon
                style={{ marginLeft: '5px' }}
                overlay={
                  <span>
                    For more information about the FDA Level of Evidence, please
                    see{' '}
                    <LevelOfEvidencePageLink levelType={LEVEL_TYPES.FDA}>
                      <b>HERE</b>
                    </LevelOfEvidencePageLink>
                    .
                  </span>
                }
              />
            </div>
          </div>
        ),
        accessor: 'treatmentLevel',
        width: 150,
        minWidth: 150,
        defaultSortDesc: true,
        sortMethod(a: string, b: string) {
          return (
            LEVEL_PRIORITY.indexOf(a.replace('LEVEL_', '') as LEVELS) -
            LEVEL_PRIORITY.indexOf(b.replace('LEVEL_', '') as LEVELS)
          );
        },
        Cell: (props: any) => (
          <div className={'d-flex justify-content-center'}>
            {props.original.level === 'NA' ? (
              'NA'
            ) : props.original.level[6] === 'F' ? (
              <span
                className="fa-stack"
                style={{ fontSize: 9, lineHeight: '18px' }}
              >
                <span className="fa fa-circle-thin fa-sm"></span>
                <strong style={{ fontSize: '0.8rem' }}>
                  {props.original.level.replace('LEVEL_Fda', '')}
                </strong>
              </span>
            ) : (
              <span className="fa-stack">
                <EvidenceLevelIcon
                  level={props.original.level}
                  withDescription={false}
                />
              </span>
            )}
          </div>
        ),
      };
    case MUTATIONS_TABLE_COLUMN_KEY.LOCATION:
      return {
        id: MUTATIONS_TABLE_COLUMN_KEY.LOCATION,
        Header: <span className="font-medium">Location</span>,
        accessor: 'location',
        width: 140,
        minWidth: 140,
        defaultSortDesc: false,
        sortable: false,
      };
    case TREATMENTS_TABLE_COLUMN_KEY.ANNOTATION:
      return {
        id: TREATMENTS_TABLE_COLUMN_KEY.ANNOTATION,
        Header: <span className="font-medium">Annotation</span>,
        accessor: 'annotation',
        width: viewportWidth / 2.5,
        minWidth: viewportWidth / 2.5,
        defaultSortDesc: false,
        sortable: false,
        Cell: (props: any) => (
          <div
            className={'d-flex justify-content-center my-1 left-align-content'}
          >
            {props.original.annotation}
          </div>
        ),
      };
    case MUTATIONS_TABLE_COLUMN_KEY.TUMOR_TYPE:
      return {
        id: MUTATIONS_TABLE_COLUMN_KEY.TUMOR_TYPE,
        Header: <span className="font-medium">Tumor Type</span>,
        accessor: 'tumorType',
        style: { whiteSpace: 'normal' },
        width: 130,
        minWidth: 130,
        defaultSortDesc: false,
        sortMethod: defaultSortMethod,
      };
    case MUTATIONS_TABLE_COLUMN_KEY.FDA_LEVEL:
      return {
        id: MUTATIONS_TABLE_COLUMN_KEY.FDA_LEVEL,
        Header: <span className="font-medium">FDA Level</span>,
        accessor: 'fdaLevel',
        style: { whiteSpace: 'normal' },
        width: 150,
        minWidth: 150,
        defaultSortDesc: false,
        sortMethod(a: string, b: string) {
          return (
            LEVEL_PRIORITY.indexOf(a.replace('LEVEL_', '') as LEVELS) -
            LEVEL_PRIORITY.indexOf(b.replace('LEVEL_', '') as LEVELS)
          );
        },
        Cell: (props: any) => (
          <div className={'d-flex justify-content-center'}>
            <span className="fa-stack">
              {props.original.fdaLevel === 'NA' ? (
                'NA'
              ) : (
                <span
                  className="fa-stack"
                  style={{ fontSize: 9, lineHeight: '18px' }}
                >
                  <span className="fa fa-circle-thin fa-stack-2x"></span>
                  <strong className="fa-stack-1x">
                    {props.original.fdaLevel.replace('LEVEL_Fda', '')}
                  </strong>
                </span>
              )}
            </span>
          </div>
        ),
      };
    case TREATMENTS_TABLE_COLUMN_KEY.TREATMENT_FDA_LEVEL:
      return {
        id: TREATMENTS_TABLE_COLUMN_KEY.TREATMENT_FDA_LEVEL,
        Header: <span className="font-medium">FDA Level</span>,
        accessor: 'treatmentFdaLevel',
        style: { whiteSpace: 'normal' },
        width: 130,
        minWidth: 130,
        defaultSortDesc: false,
        sortMethod(a: string, b: string) {
          return (
            LEVEL_PRIORITY.indexOf(a.replace('LEVEL_', '') as LEVELS) -
            LEVEL_PRIORITY.indexOf(b.replace('LEVEL_', '') as LEVELS)
          );
        },
        Cell: (props: any) => (
          <div className={'d-flex justify-content-center'}>
            <span className="fa-stack">
              {props.original.treatmentFdaLevel === 'NA' ? (
                'NA'
              ) : (
                <span
                  className="fa-stack"
                  style={{ fontSize: 9, lineHeight: '18px' }}
                >
                  <span className="fa fa-circle-thin fa-stack-2x"></span>
                  <strong className="fa-stack-1x">
                    {props.original.treatmentFdaLevel.replace('LEVEL_Fda', '')}
                  </strong>
                </span>
              )}
            </span>
          </div>
        ),
      };
    default:
      return undefined;
  }
}

export function shortenTextByCharacters(text: string, cutoff: number) {
  const shortText = (text || '').trim();
  if (shortText.length <= cutoff) {
    return shortText;
  } else {
    const separator = ' ';
    const words = (text || '').slice(0, cutoff).split(separator);
    words.pop();
    return words.join(separator);
  }
}

export const compareDates = (date1: string | null, date2: string | null) => {
  const [day1, month1, year1] =
    date1 !== null ? date1.split('/').map(Number) : [0, 0, 0];
  const [day2, month2, year2] =
    date2 !== null ? date2.split('/').map(Number) : [0, 0, 0];

  if (year1 !== year2) return year1 - year2;
  if (month1 !== month2) return month1 - month2;
  return day1 - day2;
};

export const compareVersions = (
  version1: string | null,
  version2: string | null
) => {
  const [major1, minor1] =
    version1 !== null ? version1.substring(1).split('.').map(Number) : [0, 0];
  const [major2, minor2] =
    version2 !== null ? version2.substring(1).split('.').map(Number) : [0, 0];

  if (major1 !== major2) return major1 - major2;
  return minor1 - minor2;
};

export const loadImageAsBase64 = path => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = path;
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = img.width;
      c.height = img.height;
      const ctx = c.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const dataURL = c.toDataURL('image/png');
      resolve(dataURL);
    };
    img.onerror = error =>
      reject(new Error(`Failed to load image at path: ${path}`));
  });
};

export const generatePDF = async (
  patientData,
  processedData,
  processedTreatmentData
) => {
  try {
    const logoBase64 = await loadImageAsBase64(logoImage);
    const groupedData = processedData.reduce((acc, row) => {
      const { alterationType } = row;
      if (!acc[alterationType]) {
        acc[alterationType] = [];
      }
      acc[alterationType].push(row);
      return acc;
    }, {});

    const groupedTreatmentData = processedTreatmentData.reduce((acc, row) => {
      const { alterationType } = row;
      if (!acc[alterationType]) {
        acc[alterationType] = [];
      }
      acc[alterationType].push(row);
      return acc;
    }, {});

    // Create a container for the HTML content
    const container = document.createElement('div');
    container.innerHTML = `
      <div style="text-align: center;">
        <div style="display: flex; justify-content: center; align-items: center; margin-bottom: 20px;">
          <img src="${logoBase64}" width="50" height="50" style="margin-right: 10px;" />
          <h4 style="color: ${COLOR_BLUE}; font-weight: bold; margin: 0;">Sample Report</h4>
        </div>
      </div>
      <table style="width: 100%; border-collapse: collapse;">
        <tbody>
          ${patientData
            .map(
              item => `
            <tr style="border-top: 1px solid #ffc63c; border-bottom: 1px solid #ffc63c;">
              <td style="background-color: #ffeecc; padding: 8px; font-weight: bold;">${item.col1}</td>
              <td style="background-color: #ffeecc; padding: 8px;">${item.col2}</td>
              <td style="background-color: #ffeecc; padding: 8px; font-weight: bold;">${item.col3}</td>
              <td style="background-color: #ffeecc; padding: 8px;">${item.col4}</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>
      <h5 style="color: ${COLOR_BLUE}; font-weight: bold; margin: 20px 0;">Alterations within the sample</h5>
      <table border="0.5" cellspacing="0" cellpadding="5" style="width: 100%; border-collapse: collapse; border-color: black;">
        <thead>
          <tr>
            <th style="background-color: ${COLOR_BLUE}; color: white; width: 20%;">Gene</th>
            <th style="background-color: ${COLOR_BLUE}; color: white; width: 20%;">Mutation</th>
            <th style="background-color: ${COLOR_BLUE}; color: white; width: 15%;">Oncogenicity</th>
            <th style="background-color: ${COLOR_BLUE}; color: white; width: 15%;">Level of Evidence</th>
            <th style="background-color: ${COLOR_BLUE}; color: white; width: 20%;">Biological Effect</th>
            <th style="background-color: ${COLOR_BLUE}; color: white; width: 15%;">Tumor Type</th>
          </tr>
        </thead>
        <tbody>
          ${Object.entries(groupedData)
            .map(
              ([alterationType, rows]) => `
            <tr style="background-color: lightgrey; font-weight: bold; font-size: 14px; font-style: italic; text-align: left; page-break-inside: avoid;">
              <td colspan="6">Alteration Type: ${alterationType}</td>
            </tr>
            ${rows
              .map((row, index) => {
                const levelClass = LevelOfEvidenceToClassnames(
                  row.levelOfEvidence
                );
                const oncogenicityClass = OncogenicityToClassnames(
                  row.oncogenicity
                );
                const backgroundColor = index % 2 === 0 ? '#f3f3f3' : '#ffffff'; // Alternate row color
                return `
                <tr style="background-color: ${backgroundColor}; page-break-inside: avoid;">
                  <td style="width: 10%; text-align: center;">${row.gene}</td>
                  <td style="width: 20%; text-align: center;">${row.mutation}</td>
                  <td style="width: 15%; text-align: center;">
                    <div style="display: flex; align-items: center; justify-content: center;">
                      <i class="oncokb icon ${oncogenicityClass}"></i>
                    </div>
                  </td>
                  <td style="width: 15%; text-align: center;">
                    <div style="display: flex; align-items: center; justify-content: center;">
                      <i class="oncokb icon ${levelClass}"></i>
                    </div>
                  </td>
                  <td style="width: 20%; text-align: center;">${row.biologicalEffect}</td>
                  <td style="width: 15%; text-align: center;">${row.tumorType}</td>
                </tr>
              `;
              })
              .join('')}
          `
            )
            .join('')}
        </tbody>
      </table>
      <h5 style="color: ${COLOR_BLUE}; font-weight: bold; margin: 20px 0;">Treatment for the biomarker</h5>
      <table border="0.5" cellspacing="0" cellpadding="5" style="width: 100%; border-collapse: collapse; border-color: black;">
        <thead>
          <tr>
            <th style="background-color: ${COLOR_BLUE}; color: white; width: 20%;">Biomarker</th>
            <th style="background-color: ${COLOR_BLUE}; color: white; width: 30%;">Drug Names</th>
            <th style="background-color: ${COLOR_BLUE}; color: white; width: 50%;">Annotation</th>
          </tr>
        </thead>
        <tbody>
          ${Object.entries(groupedTreatmentData)
            .map(
              ([alterationType, rows]) => `
            <tr style="background-color: lightgrey; font-weight: bold; font-style: italic; text-align: left; page-break-inside: avoid;">
              <td colspan="3">Alteration Type: ${alterationType}</td>
            </tr>
            ${rows
              .map((row, index) => {
                const backgroundColor = index % 2 === 0 ? '#f3f3f3' : '#ffffff'; // Alternate row color
                return `
                <tr style="background-color: ${backgroundColor}; page-break-inside: avoid;">
                  <td style="width: 20%; text-align: center;">${row.biomarker}</td>
                  <td style="width: 30%; text-align: center;">${row.drugNames}</td>
                  <td style="width: 50%; text-align: center;">${row.annotation}</td>
                </tr>
              `;
              })
              .join('')}
          `
            )
            .join('')}
        </tbody>
      </table>
    `;

    const opt = {
      margin: 1,
      filename: 'report.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    };

    // Generate PDF from the HTML content
    html2pdf().from(container).set(opt).save();
  } catch (error) {
    console.error('Failed to generate PDF:', error);
  }
};
