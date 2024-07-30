import { default as URL } from 'url';
import { ActionMeta, ValueType } from 'react-select/src/types';

export const ONCOGENIC_MUTATIONS = 'Oncogenic Mutations';
export const FUSIONS = 'Fusions';
export const TRUNCATING_MUTATIONS = 'Truncating Mutations';
export const GAIN_OF_FUNCTION_MUTATIONS = 'Gain-of-function Mutations';
export const LOSS_OF_FUNCTION_MUTATIONS = 'Loss-of-function Mutations';
export const SWITCH_OF_FUNCTION_MUTATIONS = 'Switch-of-function Mutations';

export const CATEGORICAL_ALTERATIONS = [
  ONCOGENIC_MUTATIONS,
  FUSIONS,
  TRUNCATING_MUTATIONS,
  GAIN_OF_FUNCTION_MUTATIONS,
  LOSS_OF_FUNCTION_MUTATIONS,
  SWITCH_OF_FUNCTION_MUTATIONS,
];

export enum ANNOTATION_TYPE {
  MUTATION = 'MUTATION',
  COPY_NUMBER_ALTERATION = 'COPY_NUMBER_ALTERATION',
  STRUCTURAL_VARIANT = 'STRUCTURAL_VARIANT',
}

type AnnotationPageSearchQueries = {
  refGenome?: REFERENCE_GENOME;
  tumorType?: string;
};
type AnnotationPageHashQueries = {
  tab?: ANNOTATION_PAGE_TAB_KEYS;
};

export type GenePageSearchQueries = AnnotationPageSearchQueries & {};
export type GenePageHashQueries = AnnotationPageHashQueries & {};

export type AlterationPageSearchQueries = AnnotationPageSearchQueries & {};
export type AlterationPageHashQueries = AnnotationPageHashQueries & {};

export enum ANNOTATION_PAGE_TAB_KEYS {
  BIOLOGICAL = 'Biological',
  TX = 'Tx',
  DX = 'Dx',
  PX = 'Px',
  FDA = 'FDA',
}

export enum Version {
  V1 = 'V1',
  V2 = 'V2',
  FDA = 'FDA',
  FDA_NGS = 'FDA_NGS',
  AAC = 'AAC',
  DX = 'DX',
  PX = 'PX',
}

export enum REFERENCE_GENOME {
  GRCh37 = 'GRCh37',
  GRCh38 = 'GRCh38',
}

export const DEFAULT_REFERENCE_GENOME = REFERENCE_GENOME.GRCh37;

export const HOSTNAME = 'https://www.oncokb.org';

export enum PAGE_ROUTE {
  GENE_HEADER = '/gene',
  DX = '/diagnostic-levels',
  PX = '/prognostic-levels',
  V2 = '/therapeutic-levels',
  FDA_NGS = '/fda-levels',
}

export enum PAGE_TITLE {
  V1 = 'OncoKB™ Therapeutic Level of Evidence V1',
  V2 = 'OncoKB™ Therapeutic Level of Evidence V2',
  FDA = 'Mapping between the OncoKB™ Levels of Evidence and the FDA Levels of Evidence',
  AAC = 'Mapping between the OncoKB™ Levels of Evidence and the AMP/ASCO/CAP Consensus Recommendation',
  FDA_NGS = 'FDA fact sheet',
}

export enum MUTATIONS_TABLE_COLUMN_KEY {
  GENE = 'GENE',
  MUTATION = 'MUTATION',
  CONSEQUENCE_TYPE = 'CONSEQUENCE_TYPE',
  LOCATION = 'LOCATION',
  ONCOGENICITY = 'ONCOGENICITY',
  BIOLOGICAL_EFFECT = 'BIOLOGICAL_EFFECT',
  LEVEL = 'LEVEL',
  MUTATION_DESCRIPTION = 'MUTATION_DESCRIPTION',
  TUMOR_TYPE = 'TUMOR_TYPE',
  FDA_LEVEL = 'FDA_LEVEL',
}
export enum TREATMENTS_TABLE_COLUMN_KEY {
  BIOMARKER = 'BIOMARKER',
  DRUG = 'DRUG',
  TREATMENTS_LEVEL = 'TREATMENTS_LEVEL',
  ANNOTATION = 'ANNOTATION',
  TREATMENT_FDA_LEVEL = 'TREATMENT_FDA_LEVEL',
  TREATMENT_DESCRIPTION = 'TREATMENT_DESCRIPTION',
}
export const TOOLTIP_MAX_HEIGHT = 300;
export const LG_TABLE_FIXED_HEIGHT = 640;
export const THRESHOLD_TABLE_FIXED_HEIGHT = 15;
export const LONG_TEXT_CUTOFF = 200;

export enum ONCOGENICITY {
  ONCOGENIC = 'Oncogenic',
  LIKELY_ONCOGENIC = 'Likely Oncogenic',
  PREDICTED_ONCOGENIC = 'Predicted Oncogenic',
  RESISTANCE = 'Resistance',
  LIKELY_NEUTRAL = 'Likely Neutral',
  NEUTRAL = 'Neutral',
  INCONCLUSIVE = 'Inconclusive',
  UNKNOWN = 'Unknown',
}

export enum MUTATION_EFFECT {
  GAIN_OF_FUNCTION = 'Gain-of-function',
  LIKELY_GAIN_OF_FUNCTION = 'Likely Gain-of-function',
  LOSS_OF_FUNCTION = 'Loss-of-function',
  LIKELY_LOSS_OF_FUNCTION = 'Likely Loss-of-function',
  SWITCH_OF_FUNCTION = 'Switch-of-function',
  LIKELY_SWITCH_OF_FUNCTION = 'Likely Switch-of-function',
  NEUTRAL = 'Neutral',
  LIKELY_NEUTRAL = 'Likely Neutral',
  INCONCLUSIVE = 'Inconclusive',
  UNKNOWN = 'Unknown',
}

export type HandleColumnsChange = (
  value: ValueType<ColumnOption>,
  actionMeta: ActionMeta<ColumnOption>
) => void;

interface ColumnOption {
  value: TREATMENTS_TABLE_COLUMN_KEY | MUTATIONS_TABLE_COLUMN_KEY | undefined;
  label: string | undefined;
}

export const treatmentColumns = [
  {
    key: TREATMENTS_TABLE_COLUMN_KEY.BIOMARKER,
    label: 'Biomarker',
    prop: 'biomarker',
  },
  { key: TREATMENTS_TABLE_COLUMN_KEY.DRUG, label: 'Drug', prop: 'drug' },
  {
    key: TREATMENTS_TABLE_COLUMN_KEY.TREATMENTS_LEVEL,
    label: 'Treatments level',
    prop: 'treatmentLevel',
  },
  {
    key: TREATMENTS_TABLE_COLUMN_KEY.ANNOTATION,
    label: 'Annotation',
    prop: 'annotation',
  },
  {
    key: TREATMENTS_TABLE_COLUMN_KEY.TREATMENT_FDA_LEVEL,
    label: 'Treatment FDA Level',
    prop: 'treatmentFdaLevel',
  },
];

export const annotationColumns = [
  { key: MUTATIONS_TABLE_COLUMN_KEY.GENE, label: 'Gene', prop: 'gene' },
  {
    key: MUTATIONS_TABLE_COLUMN_KEY.MUTATION,
    label: 'Mutation',
    prop: 'mutation',
  },
  {
    key: MUTATIONS_TABLE_COLUMN_KEY.ONCOGENICITY,
    label: 'Oncogenicity',
    prop: 'oncogenicity',
  },
  {
    key: MUTATIONS_TABLE_COLUMN_KEY.LEVEL,
    label: 'Level of Evidence',
    prop: 'level',
  },
  {
    key: MUTATIONS_TABLE_COLUMN_KEY.BIOLOGICAL_EFFECT,
    label: 'Biological Effect',
    prop: 'biologicalEffect',
  },
  {
    key: MUTATIONS_TABLE_COLUMN_KEY.MUTATION_DESCRIPTION,
    label: 'Description',
    prop: 'mutationDescription',
  },

  {
    key: MUTATIONS_TABLE_COLUMN_KEY.LOCATION,
    label: 'Location',
    prop: 'location',
  },
  {
    key: MUTATIONS_TABLE_COLUMN_KEY.CONSEQUENCE_TYPE,
    label: 'Consequence Type',
    prop: 'consequenceType',
  },
  {
    key: MUTATIONS_TABLE_COLUMN_KEY.TUMOR_TYPE,
    label: 'Tumor Type',
    prop: 'tumorType',
  },
  {
    key: MUTATIONS_TABLE_COLUMN_KEY.FDA_LEVEL,
    label: 'FDA Level',
    prop: 'fdaLevel',
  },
];

export const defaultAnnotationColumns = [
  MUTATIONS_TABLE_COLUMN_KEY.GENE,
  MUTATIONS_TABLE_COLUMN_KEY.MUTATION,
  MUTATIONS_TABLE_COLUMN_KEY.ONCOGENICITY,
  MUTATIONS_TABLE_COLUMN_KEY.LEVEL,
  MUTATIONS_TABLE_COLUMN_KEY.BIOLOGICAL_EFFECT,
  MUTATIONS_TABLE_COLUMN_KEY.MUTATION_DESCRIPTION,
];
export const defaultTreatmentColumns = [
  TREATMENTS_TABLE_COLUMN_KEY.BIOMARKER,
  TREATMENTS_TABLE_COLUMN_KEY.DRUG,
  TREATMENTS_TABLE_COLUMN_KEY.TREATMENTS_LEVEL,
  TREATMENTS_TABLE_COLUMN_KEY.ANNOTATION,
];

export enum NOTIFICATION_TYPE {
  INFO = 'primary',
  ERROR = 'danger',
  WARNING = 'warning',
  SUCCESS = 'success',
}

export type AnnotationImplication = {
  level: string;
  gene: string;
  mutation: string;
  consequenceType: string;
  location: string;
  oncogenicity: string;
  biologicalEffect: string;
  alterationType: string;
  mutationDescription: string;
  tumorType: string;
  fdaLevel: string;
};

export type TreatmentImplication = {
  biomarker: string;
  drug: string;
  level: string;
  annotation: string;
  alterationType: string;
  treatmentFdaLevel: string;
  treatmentDescription: string;
};

export type NotificationImplication = {
  message: string;
  type: 'danger' | 'primary' | 'warning' | 'success';
  alterationType: string;
};

export type PatientInfo = {
  patientId: string;
  age: string;
  gender: string;
};

export type QueryParams = {
  [key: string]: undefined | null | string | string[];
};

export type BuildUrlParams = {
  pathname: string;
  query?: QueryParams;
  hash?: string;
};

export function getNCBIlink(
  pathnameOrParams?: BuildUrlParams | string
): string {
  const params =
    typeof pathnameOrParams === 'string'
      ? { pathname: pathnameOrParams }
      : pathnameOrParams;
  return URL.format({
    protocol: 'https',
    host: 'www.ncbi.nlm.nih.gov',
    ...params,
  });
}

export function getNCTlink(pathnameOrParams?: BuildUrlParams | string): string {
  const params =
    typeof pathnameOrParams === 'string'
      ? { pathname: pathnameOrParams }
      : pathnameOrParams;
  return URL.format({
    protocol: 'https',
    host: 'www.clinicaltrials.gov',
    ...params,
  });
}

// example reference groups to capture:
//     (PMID: 11900253)
//     (PMID: 11753428, 16007150, 21467160)
//     (NCT1234567)
export const REF_CAPTURE = /(\(\s*(?:PMID|NCT|Abstract):?.*?\))/i;

export enum LEVEL_TYPES {
  TX = 'Tx',
  DX = 'Dx',
  PX = 'Px',
  FDA = 'FDA',
}

export enum LEVELS {
  Dx1 = 'Dx1',
  Dx2 = 'Dx2',
  Dx3 = 'Dx3',
  Px1 = 'Px1',
  Px2 = 'Px2',
  Px3 = 'Px3',
  Tx1 = '1',
  Tx2 = '2',
  Tx3 = '3',
  Tx3A = '3A',
  Tx3B = '3B',
  Tx4 = '4',
  R1 = 'R1',
  R2 = 'R2',
  Fda1 = 'Fda1',
  Fda2 = 'Fda2',
  Fda3 = 'Fda3',
  NA = 'NA',
}

export const LEVEL_PRIORITY: LEVELS[] = [
  LEVELS.Fda3,
  LEVELS.Fda2,
  LEVELS.Fda1,
  LEVELS.Px3,
  LEVELS.Px2,
  LEVELS.Px1,
  LEVELS.Dx3,
  LEVELS.Dx2,
  LEVELS.Dx1,
  LEVELS.R2,
  LEVELS.Tx4,
  LEVELS.Tx3B,
  LEVELS.Tx3A,
  LEVELS.Tx3,
  LEVELS.Tx2,
  LEVELS.R1,
  LEVELS.Tx1,
  LEVELS.NA,
];

// OncoKB API constants

export type ArticleAbstract = {
  abstract: string;

  link: string;
};

export type Citations = {
  abstracts: Array<ArticleAbstract>;

  pmids: Array<string>;
};

export type InfoLevel = {
  colorHex: string;

  description: string;

  htmlDescription: string;

  levelOfEvidence:
    | 'LEVEL_1'
    | 'LEVEL_2'
    | 'LEVEL_3A'
    | 'LEVEL_3B'
    | 'LEVEL_4'
    | 'LEVEL_R1'
    | 'LEVEL_R2'
    | 'LEVEL_Px1'
    | 'LEVEL_Px2'
    | 'LEVEL_Px3'
    | 'LEVEL_Dx1'
    | 'LEVEL_Dx2'
    | 'LEVEL_Dx3'
    | 'LEVEL_Fda1'
    | 'LEVEL_Fda2'
    | 'LEVEL_Fda3'
    | 'NO';
};

export type Gene = {
  entrezGeneId: number;

  geneAliases: Array<string>;

  genesets: Array<Geneset>;

  grch37Isoform: string;

  grch37RefSeq: string;

  grch38Isoform: string;

  grch38RefSeq: string;

  hugoSymbol: string;

  oncogene: boolean;

  tsg: boolean;
};

export type Geneset = {
  genes: Array<Gene>;

  id: number;

  name: string;

  uuid: string;
};

export type VariantConsequence = {
  description: string;

  isGenerallyTruncating: boolean;

  term: string;
};

export type Alteration = {
  alteration: string;

  consequence: VariantConsequence;

  gene: Gene;

  name: string;

  proteinEnd: number;

  proteinStart: number;

  refResidues: string;

  referenceGenomes: Array<'GRCh37' | 'GRCh38'>;

  variantResidues: string;
};
