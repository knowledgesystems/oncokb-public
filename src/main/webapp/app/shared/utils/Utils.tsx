import {
  Article,
  Citations,
  TreatmentDrug,
} from 'app/shared/api/generated/OncoKbAPI';
import React, { ReactNode } from 'react';
import {
  AMPLIFICATION,
  APP_LOCAL_DATE_FORMAT,
  APP_LOCAL_DATETIME_FORMAT,
  APP_LOCAL_DATETIME_FORMAT_Z,
  APP_TIMESTAMP_FORMAT,
  CATEGORICAL_ALTERATIONS,
  DELETION,
  FUSIONS,
  GAIN_OF_FUNCTION_MUTATIONS,
  GENERAL_ONCOGENICITY,
  GENERAL_PATHOGENICITY,
  LEVEL_PRIORITY,
  LEVEL_TYPES,
  LEVELS,
  LOSS_OF_FUNCTION_MUTATIONS,
  ONCOGENIC_MUTATIONS,
  ONCOGENICITY,
  ONCOGENICITY_CLASS_NAMES,
  ONCOKB,
  ONCOKB_TM,
  PAGE_ROUTE,
  SHORTEN_TEXT_FROM_LIST_THRESHOLD,
  SWITCH_OF_FUNCTION_MUTATIONS,
  TABLE_COLUMN_KEY,
  TRUNCATING_MUTATIONS,
} from 'app/config/constants';
import classnames from 'classnames';
import {
  Alteration,
  EnsemblGene,
  Evidence,
  Treatment,
  TumorType,
} from 'app/shared/api/generated/OncoKbPrivateAPI';
import {
  citationsSortMethod,
  defaultSortMethod,
  mutationEffectSortMethod,
  oncogenicitySortMethod,
  sortByAlteration,
} from 'app/shared/utils/ReactTableUtils';
import { TableCellRenderer } from 'react-table';
import { LevelWithDescription } from 'app/components/LevelWithDescription';
import { DefaultTooltip } from 'cbioportal-frontend-commons';
import { CitationTooltip } from 'app/components/CitationTooltip';
import {
  AlterationPageLink,
  GenePageLink,
  OncoTreeLink,
  SopPageLink,
} from 'app/shared/utils/UrlUtils';
import moment from 'moment';
import InfoIcon from 'app/shared/icons/InfoIcon';
import { COLOR_BLUE } from 'app/config/theme';
import * as styles from 'app/index.module.scss';
import { Version } from 'app/pages/LevelOfEvidencePage';
import { Link } from 'react-router-dom';
import { LevelOfEvidencePageLink } from 'app/shared/links/LevelOfEvidencePageLink';
import { sortBy, sortByKey } from 'app/shared/utils/LodashUtils';

// Likely Oncogenic, Predicted Oncogenic will be converted to Oncogenic
// Likely Neutral will be converted to Neutral
export function shortenOncogenicity(oncogenicity: string): string {
  return GENERAL_ONCOGENICITY[oncogenicity];
}

export function shortenPathogenicity(pathogenicity: string): string {
  return GENERAL_PATHOGENICITY[pathogenicity];
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

export function getCancerTypeNameFromOncoTreeType(
  oncoTreeType: TumorType
): string {
  return oncoTreeType.subtype || oncoTreeType.mainType || 'NA';
}

export function getCancerTypesName(
  cancerTypes: string[],
  excludedCancerTypes?: string[]
): string {
  let name = cancerTypes.join(', ');
  if (excludedCancerTypes && excludedCancerTypes.length > 0) {
    name += ' (excluding ' + excludedCancerTypes.join(', ') + ')';
  }
  return name;
}

export function getCancerTypesNameFromOncoTreeType(
  cancerTypes: TumorType[],
  excludedCancerTypes?: TumorType[]
): string {
  return getCancerTypesName(
    cancerTypes.map(cancerType =>
      getCancerTypeNameFromOncoTreeType(cancerType)
    ),
    (excludedCancerTypes || []).map(cancerType =>
      getCancerTypeNameFromOncoTreeType(cancerType)
    )
  );
}

export function trimLevelOfEvidenceSubversion(levelOfEvidence: string) {
  return levelOfEvidence.replace(new RegExp('[AB]'), '');
}

export function levelOfEvidence2Level(
  levelOfEvidence: string | null,
  trimSubversion = false
): LEVELS {
  let level = levelOfEvidence?.replace('LEVEL_', '');
  if (trimSubversion && level) {
    level = trimLevelOfEvidenceSubversion(level);
  }
  return level as LEVELS;
}

export function toggleStrList(element: string, list: string[]) {
  if (list.includes(element)) {
    list.splice(list.indexOf(element), 1);
  } else {
    list.push(element);
  }
  return list;
}

export function level2LevelOfEvidence(level: LEVELS | undefined) {
  switch (level) {
    case LEVELS.Tx3:
    case LEVELS.Tx3A:
      return 'LEVEL_3A';
      break;
    default:
      return `LEVEL_${level}`;
  }
}

export function isFdaLevel(level: LEVELS) {
  switch (level) {
    case LEVELS.Fda1:
    case LEVELS.Fda2:
    case LEVELS.Fda3:
      return true;
    default:
      return false;
  }
}

export function getAllAlterationsName(alterations: Alteration[]) {
  return alterations
    ? alterations.map(alteration => alteration.name).join(', ')
    : '';
}

export function getAllTumorTypesName(tumorTypes: TumorType[]) {
  return tumorTypes
    ? tumorTypes.map(getCancerTypeNameFromOncoTreeType).sort().join(', ')
    : '';
}

export function getDrugNameFromTreatment(drug: TreatmentDrug) {
  // have to use ignore to escape the actual model structure. The swagger does not reflect the actually json structure
  // @ts-ignore
  return drug.drugName;
}

export function getTreatmentNameByPriority(treatment: Treatment) {
  return sortByKey(treatment.drugs, 'priority')
    .map(drug => getDrugNameFromTreatment(drug))
    .join(' + ');
}

export function getTreatmentNameFromEvidence(evidence: Evidence) {
  return sortByKey(evidence.treatments, 'priority')
    .map(getTreatmentNameByPriority)
    .join(', ');
}

export function articles2Citations(articles: Article[]): Citations {
  return {
    abstracts: articles
      .filter(article => !!article.abstract)
      .map(article => {
        return {
          abstract: article.abstract,
          link: article.link,
        };
      }),
    pmids: articles
      .filter(article => !!article.pmid)
      .map(article => article.pmid),
  };
}

export function citationsHasInfo(citations: Citations | null) {
  if (!citations) {
    return false;
  }

  const pmidsSize = citations.pmids ? citations.pmids.length : 0;
  const abstractsSize = citations.abstracts ? citations.abstracts.length : 0;
  return pmidsSize + abstractsSize > 0;
}

function getAnnotationLevelClassName(
  sensitiveLevel: string,
  resistanceLevel: string
) {
  const sensitiveLevelClassName = sensitiveLevel ? `-${sensitiveLevel}` : '';
  const resistanceLevelClassName = resistanceLevel ? `-${resistanceLevel}` : '';

  if (!sensitiveLevelClassName && !resistanceLevelClassName) {
    return 'no-level';
  }
  return `level${sensitiveLevelClassName}${resistanceLevelClassName}`;
}

function getAnnotationOncogenicityClassName(
  oncogenicity: string,
  vus: boolean
) {
  const map = ONCOGENICITY_CLASS_NAMES[oncogenicity];
  if (map) {
    return map;
  } else {
    if (vus) {
      return 'vus';
    } else {
      return 'unknown';
    }
  }
}

export const OncoKBAnnotationIcon: React.FunctionComponent<{
  oncogenicity: string;
  sensitiveLevel: string;
  resistanceLevel: string;
  vus: boolean;
  className?: string;
}> = props => {
  return (
    <i
      className={classnames(
        `oncokb annotation-icon ${getAnnotationOncogenicityClassName(
          props.oncogenicity,
          props.vus
        )} ${getAnnotationLevelClassName(
          props.sensitiveLevel,
          props.resistanceLevel
        )}`,
        props.className
      )}
    />
  );
};
export const OncoKBOncogenicityIcon: React.FunctionComponent<{
  oncogenicity: string | undefined;
  isVus: boolean;
  className?: string;
  classNameParent?: string;
}> = props => {
  let oncogenicity = props.oncogenicity;
  if (oncogenicity === undefined) {
    oncogenicity = ONCOGENICITY.UNKNOWN;
  }
  return (
    <span
      style={{ width: 16, marginTop: -3, marginLeft: 3 }}
      key={'oncokb-oncogenicity-icone'}
      className={props.classNameParent}
    >
      <i
        className={classnames(
          `oncokb annotation-icon ${getAnnotationOncogenicityClassName(
            oncogenicity,
            props.isVus
          )} no-level`,
          props.className
        )}
      />
    </span>
  );
};

export const OncoKBLevelIcon: React.FunctionComponent<{
  level: LEVELS;
  withDescription?: boolean;
  size?: 's1' | 's2' | 's3';
}> = ({ level, withDescription = true, size = 's1' }) => {
  const oncokbIcon = (
    <i className={`oncokb icon ${size === 's1' ? '' : size} level-${level}`} />
  );
  return withDescription ? (
    <LevelWithDescription level={level}>{oncokbIcon}</LevelWithDescription>
  ) : (
    oncokbIcon
  );
};

export const FdaLevelIcon: React.FunctionComponent<{
  level: LEVELS | undefined;
  withDescription?: boolean;
  size?: 's1' | 's2' | 's3';
}> = ({ level, withDescription = true, size = 's1' }) => {
  const scale = parseInt(size.slice(1), 0);
  const style = {
    fontSize: 8 * scale,
    lineHeight: `${16 * scale}px`,
    margin: '0 3px',
  };
  if (level === undefined) {
    return <></>;
  }
  const fdaIcon = (
    <span className="fa-stack" style={style}>
      <span className="fa fa-circle-thin fa-stack-2x"></span>
      <strong className="fa-stack-1x" style={{ fontSize: '1em' }}>
        {level?.toString().replace('Fda', '')}
      </strong>
    </span>
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
  return withDescription ? (
    <LevelWithDescription level={level} description={levelDescription}>
      {fdaIcon}
    </LevelWithDescription>
  ) : (
    fdaIcon
  );
};

export function getDefaultColumnDefinition<T>(
  columnKey: TABLE_COLUMN_KEY
):
  | {
      id: string;
      Header: TableCellRenderer;
      accessor: string;
      minWidth: number;
      width?: number;
      style?: object;
      defaultSortDesc: boolean;
      Cell?: TableCellRenderer;
      sortMethod?: typeof defaultSortMethod;
      sortable?: boolean;
    }
  | undefined {
  switch (columnKey) {
    case TABLE_COLUMN_KEY.HUGO_SYMBOL:
      return {
        id: TABLE_COLUMN_KEY.HUGO_SYMBOL,
        Header: <span>Gene</span>,
        accessor: 'hugoSymbol',
        minWidth: 100,
        defaultSortDesc: false,
        sortMethod: defaultSortMethod,
        Cell(props: { original: any }) {
          return <GenePageLink hugoSymbol={props.original.hugoSymbol} />;
        },
      };
    case TABLE_COLUMN_KEY.ALTERATION:
      return {
        id: TABLE_COLUMN_KEY.ALTERATION,
        Header: <span>Alteration</span>,
        accessor: 'alteration',
        minWidth: 100,
        defaultSortDesc: true,
        sortMethod: sortByAlteration,
        Cell(props: { original: any }) {
          return (
            <AlterationPageLink
              hugoSymbol={props.original.hugoSymbol}
              alteration={props.original.alteration}
            />
          );
        },
      };
    case TABLE_COLUMN_KEY.ALTERATIONS:
      return {
        id: TABLE_COLUMN_KEY.ALTERATION,
        Header: <span>Alterations</span>,
        accessor: 'alterations',
        style: { whiteSpace: 'normal' },
        minWidth: 100,
        defaultSortDesc: false,
        sortMethod: defaultSortMethod,
      };
    case TABLE_COLUMN_KEY.EVIDENCE_CANCER_TYPE:
      return {
        id: TABLE_COLUMN_KEY.EVIDENCE_CANCER_TYPE,
        Header: (
          <span>
            Level-associated cancer types{' '}
            <InfoIcon
              overlay={
                <span>
                  The cancer type is curated using <OncoTreeLink />
                </span>
              }
            />
          </span>
        ),
        accessor: 'cancerTypes',
        style: { whiteSpace: 'normal' },
        minWidth: 110,
        defaultSortDesc: false,
        sortMethod: defaultSortMethod,
      };
    case TABLE_COLUMN_KEY.DRUGS:
      return {
        id: TABLE_COLUMN_KEY.DRUGS,
        Header: <span>Drugs</span>,
        accessor: 'drugs',
        style: { whiteSpace: 'normal' },
        minWidth: 100,
        defaultSortDesc: false,
        sortMethod: defaultSortMethod,
      };
    case TABLE_COLUMN_KEY.LEVEL:
      return {
        id: TABLE_COLUMN_KEY.LEVEL,
        Header: <span>Level</span>,
        accessor: 'level',
        minWidth: 60,
        width: 60,
        defaultSortDesc: true,
        sortMethod(a: LEVELS, b: LEVELS) {
          return LEVEL_PRIORITY.indexOf(a) - LEVEL_PRIORITY.indexOf(b);
        },
        Cell(props: any) {
          return (
            <div className={'d-flex justify-content-center'}>
              <OncoKBLevelIcon
                level={props.original.level}
                withDescription={true}
              />
            </div>
          );
        },
      };
    case TABLE_COLUMN_KEY.FDA_LEVEL:
      return {
        id: TABLE_COLUMN_KEY.FDA_LEVEL,
        Header: (
          <div className={'d-flex justify-content-center'}>
            <span>FDA Level of Evidence</span>
            <InfoIcon
              className={'ml-1'}
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
        ),
        accessor: 'level',
        width: 250,
        minWidth: 60,
        defaultSortDesc: true,
        sortMethod(a: string, b: string) {
          return (
            LEVEL_PRIORITY.indexOf(a.replace('Level ', '') as LEVELS) -
            LEVEL_PRIORITY.indexOf(b.replace('Level ', '') as LEVELS)
          );
        },
        Cell(props: any) {
          return (
            <div className={'d-flex justify-content-center'}>
              <FdaLevelIcon
                level={props.original.level}
                withDescription={true}
              />
            </div>
          );
        },
      };
    case TABLE_COLUMN_KEY.CITATIONS:
      return {
        id: TABLE_COLUMN_KEY.CITATIONS,
        Header: <span>Citations</span>,
        accessor: 'citations',
        minWidth: 90,
        width: 90,
        defaultSortDesc: false,
        sortMethod: citationsSortMethod,
        Cell(props: any) {
          const numOfReferences =
            props.original.drugAbstracts.length +
            props.original.drugPmids.length;
          return (
            <div>
              <DefaultTooltip
                placement="left"
                trigger={['hover', 'focus']}
                overlay={() => (
                  <CitationTooltip
                    pmids={props.original.drugPmids}
                    abstracts={props.original.drugAbstracts}
                  />
                )}
              >
                <span>{numOfReferences}</span>
              </DefaultTooltip>
            </div>
          );
        },
      };
    case TABLE_COLUMN_KEY.ONCOGENICITY:
      return {
        id: TABLE_COLUMN_KEY.ONCOGENICITY,
        Header: <span>Oncogenic</span>,
        accessor: 'oncogenic',
        minWidth: 100,
        defaultSortDesc: false,
        sortMethod: oncogenicitySortMethod,
      };
    case TABLE_COLUMN_KEY.MUTATION_EFFECT:
      return {
        id: TABLE_COLUMN_KEY.MUTATION_EFFECT,
        Header: <span>Mutation Effect</span>,
        accessor: 'mutationEffect',
        minWidth: 100,
        defaultSortDesc: false,
        sortMethod: mutationEffectSortMethod,
      };
    case TABLE_COLUMN_KEY.DESCRIPTION:
      return {
        id: TABLE_COLUMN_KEY.DESCRIPTION,
        Header: <span>Description</span>,
        accessor: 'description',
        minWidth: 100,
        width: 100,
        defaultSortDesc: false,
        sortable: false,
      };
    default:
      return undefined;
  }
}

export function filterByKeyword(
  value: string | undefined | null,
  keyword: string
): boolean {
  return value ? value.toLowerCase().includes(keyword.trim()) : false;
}

export function getRouteFromPath(pathName: string) {
  const firstSplashIndex = pathName.indexOf('/');
  return firstSplashIndex === -1
    ? PAGE_ROUTE.HOME
    : pathName.substr(pathName.indexOf('/') + 1);
}

export function getRedirectLoginState(
  pathName: string,
  search: string,
  hash: string
) {
  return {
    from: { pathname: getRouteFromPath(pathName), search, hash },
  };
}

export function toAppTimestampFormat(utcTime: string | undefined) {
  if (!utcTime) return '';
  return moment(utcTime, APP_LOCAL_DATETIME_FORMAT_Z).format(
    APP_TIMESTAMP_FORMAT
  );
}

export function toAppLocalDateFormat(utcTime: string | undefined) {
  if (!utcTime) return '';
  return moment(utcTime, APP_LOCAL_DATETIME_FORMAT_Z).format(
    APP_LOCAL_DATE_FORMAT
  );
}

export function toUtcDateFormat(utcTime: string | undefined) {
  if (!utcTime) return '';
  return moment(utcTime, APP_LOCAL_DATETIME_FORMAT).format(
    APP_LOCAL_DATE_FORMAT
  );
}

export function getMomentInstance(utcTime: string) {
  return moment(utcTime, APP_LOCAL_DATETIME_FORMAT_Z);
}

export function daysDiff(date: string) {
  const today = moment.utc();
  const expiration = getMomentInstance(date);
  return expiration.diff(today, 'days');
}

export function secDiff(date: string) {
  const today = moment.utc();
  const expiration = getMomentInstance(date);
  return expiration.diff(today, 'hours');
}

const SLASH_HTML_ENTITY_CODE = '%2F';

export function encodeSlash(content: string | undefined) {
  return content
    ? content.replace(new RegExp('/', 'g'), SLASH_HTML_ENTITY_CODE)
    : content;
}

export function decodeSlash(content: string | undefined) {
  return content
    ? content.replace(new RegExp(SLASH_HTML_ENTITY_CODE, 'g'), '/')
    : content;
}

export const scrollWidthOffset = (el?: any) => {
  const yCoordinate =
    el === undefined ? 0 : el.getBoundingClientRect().top + window.pageYOffset;
  const yOffset = -90;
  window.scrollTo({ top: yCoordinate + yOffset, behavior: 'smooth' });
};

export function encodeResourceUsageDetailPageURL(endpoint: string) {
  return endpoint.split('/').join('!');
}

export function decodeResourceUsageDetailPageURL(url: string) {
  return url.split('!').join('/');
}

export const concatElements = (
  list: ReactNode[],
  separator: string | JSX.Element
) => {
  return list.length === 0 ? (
    <></>
  ) : (
    list.reduce((prev, curr) => [prev, separator, curr])
  );
};

export const concatElementsByComma = (list: ReactNode[]) => {
  return concatElements(list, ', ');
};

export function getShortenTextFromList(data: JSX.Element[] | string[]) {
  if (data.length > SHORTEN_TEXT_FROM_LIST_THRESHOLD) {
    return (
      <span>
        {data[0]} and{' '}
        <DefaultTooltip
          overlay={
            <div style={{ maxWidth: '400px' }}>
              {concatElementsByComma(data)}
            </div>
          }
          overlayStyle={{
            opacity: 1,
          }}
          placement="right"
          destroyTooltipOnHide={true}
        >
          <span
            style={{
              textDecoration: 'underscore',
              color: COLOR_BLUE,
            }}
          >
            {data.length - 1} others
          </span>
        </DefaultTooltip>
      </span>
    );
  } else {
    return concatElementsByComma(data);
  }
}

export function getShortenPmidsFromList(pmidList: string[]) {
  const pmidLinkouts = pmidList.map(pmid => (
    <DefaultTooltip overlay={<CitationTooltip pmids={[pmid]} abstracts={[]} />}>
      <span className={styles.linkOutText}>{pmid}</span>
    </DefaultTooltip>
  ));

  if (pmidList.length > SHORTEN_TEXT_FROM_LIST_THRESHOLD) {
    return (
      <span>
        <span>{pmidLinkouts[0]}</span> and{' '}
        <DefaultTooltip
          overlay={<CitationTooltip pmids={pmidList.slice(1)} abstracts={[]} />}
          overlayStyle={{
            opacity: 1,
          }}
          placement="right"
          destroyTooltipOnHide={true}
        >
          <span
            style={{
              textDecoration: 'underscore',
              color: COLOR_BLUE,
            }}
          >
            {pmidList.length - 1} others
          </span>
        </DefaultTooltip>
      </span>
    );
  } else {
    return concatElementsByComma(pmidLinkouts);
  }
}

export function getGenePageLinks(genes: string): ReactNode {
  return concatElementsByComma(
    genes.split(',').map(gene => <GenePageLink hugoSymbol={gene.trim()} />)
  );
}

export function isPositionalAlteration(
  proteinStart: number,
  proteinEnd: number,
  consequence: string
) {
  if (proteinStart && proteinEnd && consequence) {
    return proteinStart === proteinEnd && consequence === 'NA';
  } else {
    return false;
  }
}

export function getYouTubeLink(type: 'embed' | 'regular', videoId: string) {
  return `https://www.youtube-nocookie.com/${
    type === 'embed' ? 'embed/' : 'watch?v='
  }${videoId}`;
}

export function getBilibiliLink(videoId: string) {
  return `//player.bilibili.com/player.html?aid=${videoId}`;
}

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

export const getGeneCoordinates = (ensemblGenes: EnsemblGene[]) => {
  return sortBy(ensemblGenes, ensemblGene => ensemblGene.referenceGenome)
    .map(
      ensemblGene =>
        `${ensemblGene.referenceGenome}, Chr${ensemblGene.chromosome}:${ensemblGene.start}-${ensemblGene.end}`
    )
    .join('; ');
};

export const getCategoricalAlterationDescription = (
  hugoSymbol: string,
  alteration: string,
  oncogene?: boolean,
  tsg?: boolean
) => {
  const geneLink = (
    <GenePageLink hugoSymbol={hugoSymbol}>the {hugoSymbol} gene</GenePageLink>
  );
  let content;
  switch (alteration) {
    case AMPLIFICATION:
      content = (
        <span>
          Defined as focal copy number amplification that results in an increase
          in the gene copy number of {geneLink}.
        </span>
      );
      break;
    case DELETION:
      content = (
        <span>
          Defined as copy number loss resulting in partial or whole deletion of{' '}
          {geneLink}.
        </span>
      );
      break;
    case FUSIONS:
      content = (
        <span>
          Defined as deletion or chromosomal translocation events arising within{' '}
          {geneLink} that result in a functional fusion event.
        </span>
      );
      break;
    case TRUNCATING_MUTATIONS:
      content = (
        <span>
          Defined as nonsense, frameshift, or splice-site mutations within{' '}
          {geneLink} that are predicted to shorten the coding sequence of the
          gene.
        </span>
      );
      break;
    default:
      break;
  }
  if (ONCOGENIC_MUTATIONS.toLowerCase() === alteration.toLowerCase()) {
    let prefix =
      'Defined as point mutations, rearrangements/fusions or copy number alterations within';
    if (oncogene && !tsg) {
      prefix = 'Defined as point mutations or rearrangements/fusions within';
    } else if (!oncogene && tsg) {
      prefix =
        'Defined as point mutations, rearrangements/fusions or gene deletions within';
    }
    content = (
      <span>
        {prefix} {geneLink} considered "oncogenic", "likely oncogenic" or
        "resistance" as defined by{' '}
        <SopPageLink>
          {ONCOKB_TM} Curation Standard Operating Protocol, Chapter 1,
          Sub-Protocol 2.5
        </SopPageLink>
        .
      </span>
    );
  }

  return content;
};

export const isOncogenic = (oncogenicity: string) => {
  switch (oncogenicity) {
    case ONCOGENICITY.ONCOGENIC:
    case ONCOGENICITY.LIKELY_ONCOGENIC:
    case ONCOGENICITY.RESISTANCE:
      return true;
    default:
      return false;
  }
};

export const getPageTitle = (mainContent: string, withPostFix = true) => {
  const content = [];
  if (mainContent) {
    content.push(mainContent);
    if (withPostFix) {
      if (!mainContent.includes(ONCOKB)) {
        content.push(ONCOKB_TM);
      }
    }
  } else {
    content.push(ONCOKB_TM);
  }
  return `${content.join(' | ')}`;
};

export const convertObjectArrayToDelimitedString = (
  array: Array<object>,
  delimiter = '\t'
) => {
  if (array.length < 1) {
    return '';
  }

  const rows = [];

  // Add header using the keys of the object
  rows.push(Object.keys(array[0]).join(delimiter));

  for (const e of array) {
    rows.push(Object.values(e).join(delimiter));
  }
  return rows.join('\n');
};

export const getFdaSubmissionNumber = (
  primaryNumber: string,
  supplementNumber?: string
) => {
  return supplementNumber
    ? `${primaryNumber}/${supplementNumber}`
    : primaryNumber;
};
