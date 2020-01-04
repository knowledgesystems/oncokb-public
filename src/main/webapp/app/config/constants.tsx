import { OncoKBInfo, Gene } from 'app/shared/api/generated/OncoKbAPI';
import {
  MainNumber,
  VariantAnnotation
} from 'app/shared/api/generated/OncoKbPrivateAPI';
import React from 'react';
import { Link } from 'react-router-dom';

/* eslint no-shadow: 0 */

const config = {
  VERSION: process.env.VERSION
};

export default config;

export const SERVER_API_URL = process.env.SERVER_API_URL;

export interface OncokbAppProps {
  profile: 'PROD' | 'DEV';
}

export const ONCOKB_APP_PROPS = 'oncokbAppProps';
export const ONCOKB_APP_PUBLIC_TOKEN = 'oncokbAppPublicToken';

export const AUTHORITIES = {
  ADMIN: 'ROLE_ADMIN',
  USER: 'ROLE_USER'
};

export const messages = {
  DATA_ERROR_ALERT: 'Internal Error'
};

export const APP_DATE_FORMAT = 'MM/DD/YY HH:mm';
export const APP_TIMESTAMP_FORMAT = 'MM/DD/YY HH:mm:ss';
export const APP_LOCAL_DATE_FORMAT = 'MM/DD/YYYY';
export const APP_LOCAL_DATETIME_FORMAT = 'YYYY-MM-DDTHH:mm:ss';
export const APP_LOCAL_DATETIME_FORMAT_Z = 'YYYY-MM-DDTHH:mm:ssZ';
export const APP_WHOLE_NUMBER_FORMAT = '0,0';
export const APP_TWO_DIGITS_AFTER_POINT_NUMBER_FORMAT = '0,0.[00]';
export const NEWS_DATE_FORMAT = 'MMDDYYYY';
export const NEWS_TITLE_DATE_FORMAT = 'MMMM D, YYYY';

export const ONCOKB_CONTACT_EMAIL = 'contact@oncokb.org';
export const ONCOKB_LICENSE_EMAIL = 'licenses@oncokb.org';
export const GRID_BREAKPOINTS = {
  LG: 1010,
  XL: 1450
};

export const REDIRECT_TIMEOUT_MILLISECONDS = 10000;
export const NOTIFICATION_TIMEOUT_MILLISECONDS = 5000;

export enum ONCOGENICITY {
  ONCOGENIC = 'Oncogenic',
  LIKELY_ONCOGENIC = 'Likely Oncogenic',
  PREDICTED_ONCOGENIC = 'Predicted Oncogenic',
  LIKELY_NEUTRAL = 'Likely Neutral',
  NEUTRAL = 'Neutral',
  INCONCLUSIVE = 'Inconclusive',
  UNKNOWN = 'Unknown'
}

export const GENERAL_ONCOGENICITY: { [key: string]: ONCOGENICITY } = {
  [ONCOGENICITY.ONCOGENIC]: ONCOGENICITY.ONCOGENIC,
  [ONCOGENICITY.LIKELY_ONCOGENIC]: ONCOGENICITY.ONCOGENIC,
  [ONCOGENICITY.PREDICTED_ONCOGENIC]: ONCOGENICITY.ONCOGENIC,
  [ONCOGENICITY.NEUTRAL]: ONCOGENICITY.NEUTRAL,
  [ONCOGENICITY.LIKELY_NEUTRAL]: ONCOGENICITY.NEUTRAL,
  [ONCOGENICITY.INCONCLUSIVE]: ONCOGENICITY.INCONCLUSIVE,
  [ONCOGENICITY.UNKNOWN]: ONCOGENICITY.UNKNOWN
};

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
  UNKNOWN = 'Unknown'
}

const EVIDENCE_TYPE = {
  FDA_APPROVED: 'FDA-approved',
  STANDARD_CARE: 'Standard care',
  CLINICAL_EVIDENCE: 'Clinical evidence',
  BIOLOGICAL_EVIDENCE: 'Biological evidence'
};

export const LEVEL_BUTTON_DESCRIPTION = {
  '1': EVIDENCE_TYPE.FDA_APPROVED,
  '2': EVIDENCE_TYPE.STANDARD_CARE,
  '3': EVIDENCE_TYPE.CLINICAL_EVIDENCE,
  '4': EVIDENCE_TYPE.BIOLOGICAL_EVIDENCE,
  R1: EVIDENCE_TYPE.STANDARD_CARE,
  R2: EVIDENCE_TYPE.CLINICAL_EVIDENCE
};
export const LEVELS = ['1', '2', '3', '4', 'R1', 'R2'];
export const LEVEL_OF_EVIDENCE = [
  'LEVEL_1',
  'LEVEL_2',
  'LEVEL_3',
  'LEVEL_4',
  'LEVEL_R1',
  'LEVEL_R2'
];
export const ONCOGENICITY_CLASS_NAMES: { [oncogenic: string]: string } = {
  [ONCOGENICITY.NEUTRAL]: 'neutral',
  [ONCOGENICITY.LIKELY_NEUTRAL]: 'neutral',
  [ONCOGENICITY.UNKNOWN]: 'unknown',
  [ONCOGENICITY.INCONCLUSIVE]: 'inconclusive',
  [ONCOGENICITY.PREDICTED_ONCOGENIC]: 'oncogenic',
  [ONCOGENICITY.LIKELY_ONCOGENIC]: 'oncogenic',
  [ONCOGENICITY.ONCOGENIC]: 'oncogenic'
};

export enum EVIDENCE_TYPES {
  GENE_SUMMARY = 'GENE_SUMMARY',
  GENE_BACKGROUND = 'GENE_BACKGROUND',
  MUTATION_EFFECT = 'MUTATION_EFFECT',
  TUMOR_TYPE_SUMMARY = 'TUMOR_TYPE_SUMMARY',
  GENE_TUMOR_TYPE_SUMMARY = 'GENE_TUMOR_TYPE_SUMMARY',
  PROGNOSTIC_SUMMARY = 'PROGNOSTIC_SUMMARY',
  DIAGNOSTIC_SUMMARY = 'DIAGNOSTIC_SUMMARY',
  ONCOGENIC = 'ONCOGENIC',
  VUS = 'VUS',
  PROGNOSTIC_IMPLICATION = 'PROGNOSTIC_IMPLICATION',
  DIAGNOSTIC_IMPLICATION = 'DIAGNOSTIC_IMPLICATION',
  STANDARD_THERAPEUTIC_IMPLICATIONS_FOR_DRUG_SENSITIVITY = 'STANDARD_THERAPEUTIC_IMPLICATIONS_FOR_DRUG_SENSITIVITY',
  STANDARD_THERAPEUTIC_IMPLICATIONS_FOR_DRUG_RESISTANCE = 'STANDARD_THERAPEUTIC_IMPLICATIONS_FOR_DRUG_RESISTANCE',
  INVESTIGATIONAL_THERAPEUTIC_IMPLICATIONS_DRUG_SENSITIVITY = 'INVESTIGATIONAL_THERAPEUTIC_IMPLICATIONS_DRUG_SENSITIVITY',
  INVESTIGATIONAL_THERAPEUTIC_IMPLICATIONS_DRUG_RESISTANCE = 'INVESTIGATIONAL_THERAPEUTIC_IMPLICATIONS_DRUG_RESISTANCE'
}

export const TREATMENT_EVIDENCE_TYPES = [
  EVIDENCE_TYPES.STANDARD_THERAPEUTIC_IMPLICATIONS_FOR_DRUG_SENSITIVITY,
  EVIDENCE_TYPES.STANDARD_THERAPEUTIC_IMPLICATIONS_FOR_DRUG_RESISTANCE,
  EVIDENCE_TYPES.INVESTIGATIONAL_THERAPEUTIC_IMPLICATIONS_DRUG_SENSITIVITY,
  EVIDENCE_TYPES.INVESTIGATIONAL_THERAPEUTIC_IMPLICATIONS_DRUG_RESISTANCE
];

export const QUERY_SEPARATOR_FOR_QUERY_STRING = 'comma';

// Defaults for margin spaces between sections
export const DEFAULT_MARGIN_TOP_SM = 'mt-2';
export const DEFAULT_MARGIN_TOP_LG = 'mt-3';
export const DEFAULT_MARGIN_BOTTOM_SM = 'mb-2';
export const DEFAULT_MARGIN_BOTTOM_LG = 'mb-3';
export const THRESHOLD_TABLE_FIXED_HEIGHT = 10;
export const THRESHOLD_ALTERATION_PAGE_TABLE_FIXED_HEIGHT = 5;
export const LG_TABLE_FIXED_HEIGHT = 650;
export const SM_TABLE_FIXED_HEIGHT = 400;
export const IMG_MAX_WIDTH = 700;
export const COMPONENT_PADDING = ['pl-2', 'pr-2', 'mb-2'];
export const H5_FONT_SIZE = '1.25rem';

// Defaults for the models
export const DEFAULT_ONCOKB_INFO: OncoKBInfo = {
  dataVersion: {
    date: '',
    version: ''
  },
  levels: [],
  ncitVersion: '',
  oncoTreeVersion: ''
};

export const DEFAULT_MAIN_NUMBERS: MainNumber = {
  gene: 0,
  alteration: 0,
  tumorType: 0,
  drug: 0,
  level: []
};

export const DEFAULT_GENE: Gene = {
  curatedIsoform: '',
  curatedRefSeq: '',
  entrezGeneId: -1,
  geneAliases: [],
  genesets: [],
  hugoSymbol: '',
  name: '',
  oncogene: false,
  tsg: false
};

export const DEFAULT_MUTATION_EFFECT = {
  citations: {
    abstracts: [],
    pmids: []
  },

  description: '',

  knownEffect: ''
};

export const DEFAULT_QUERY = {
  alteration: '',
  alterationType: '',
  consequence: '',
  entrezGeneId: -1,
  hgvs: '',
  hugoSymbol: '',
  id: '',
  proteinEnd: -1,
  proteinStart: -1,
  svType: 'UNKNOWN' as 'UNKNOWN',
  tumorType: '',
  type: ''
};

export const DEFAULT_ANNOTATION: VariantAnnotation = {
  alleleExist: false,
  background: '',
  dataVersion: '',
  diagnosticImplications: [],
  diagnosticSummary: '',
  geneExist: false,
  geneSummary: '',
  highestDiagnosticImplicationLevel: 'NO',
  highestPrognosticImplicationLevel: 'NO',
  highestResistanceLevel: 'NO',
  highestSensitiveLevel: 'NO',
  hotspot: false,
  lastUpdate: '',
  mutationEffect: DEFAULT_MUTATION_EFFECT,
  oncogenic: '',
  otherSignificantResistanceLevels: [],
  otherSignificantSensitiveLevels: [],
  prognosticImplications: [],
  prognosticSummary: '',
  query: DEFAULT_QUERY,
  treatments: [],
  tumorTypeSummary: '',
  tumorTypes: [],

  variantExist: false,

  variantSummary: '',

  vus: false
};

export enum PAGE_TITLE {
  ACCOUNT = 'Account',
  ACCOUNT_SETTINGS = 'Account Settings',
  ACCOUNT_PASSWORD = 'Change Password',
  ADMIN_USER_MANAGEMENT = 'Manage Users',
  ADMIN_SEND_EMAILS = 'Send Emails to Users',
  LOGOUT = 'Log out',
  LOGIN = 'Log in',
  REGISTER = 'Register',
  TERMS = 'Terms of Use - Academic Research'
}

export enum PAGE_ROUTE {
  LOGIN = '/login',
  LOGOUT = '/logout',
  DATA_ACCESS = '/dataAccess',
  CANCER_GENES = '/cancerGenes',
  ACTIONABLE_GENE = '/actionableGenes',
  GENE_HEADER = '/gene',
  GENE = '/gene/:hugoSymbol',
  ALTERATION = '/gene/:hugoSymbol/:alteration',
  ALTERATION_TUMOR_TYPE = '/gene/:hugoSymbol/:alteration/:tumorType',
  HOME = '/',
  ABOUT = '/about',
  TERMS = '/terms',
  TEAM = '/team',
  NEWS = '/news',
  LEVELS = '/levels',
  SWAGGER_UI = '/swagger-ui/index.html',
  ADMIN = '/admin',
  ADMIN_USER_MANAGEMENT = '/admin/user-management',
  ADMIN_SEND_EMAILS = '/admin/send-emails',
  ACCOUNT = '/account',
  REGISTER = '/account/register',
  ACCOUNT_VERIFY = '/account/verify',
  ACCOUNT_SETTINGS = '/account/settings',
  ACCOUNT_PASSWORD = '/account/password',
  ACCOUNT_PASSWORD_RESET_REQUEST = '/account/reset/request',
  ACCOUNT_PASSWORD_RESET_FINISH = '/account/reset/finish'
}

export enum TABLE_COLUMN_KEY {
  HUGO_SYMBOL = 'HUGO_SYMBOL',
  ALTERATION = 'ALTERATION',
  ALTERATIONS = 'ALTERATIONS',
  TUMOR_TYPE = 'TUMOR_TYPE',
  EVIDENCE_CANCER_TYPE = 'EVIDENCE_CANCER_TYPE',
  DRUGS = 'DRUGS',
  LEVEL = 'LEVEL',
  CITATIONS = 'CITATIONS',
  ONCOGENICITY = 'ONCOGENICITY',
  MUTATION_EFFECT = 'MUTATION_EFFECT'
}

export enum LicenseType {
  ACADEMIC = 'ACADEMIC',
  RESEARCH_IN_COMMERCIAL = 'RESEARCH_IN_COMMERCIAL',
  HOSPITAL = 'HOSPITAL',
  COMMERCIAL = 'COMMERCIAL'
}

export const LICENSE_TITLES: { [key: string]: string } = {
  [LicenseType.ACADEMIC]: 'Research use in an academic setting',
  [LicenseType.RESEARCH_IN_COMMERCIAL]: 'Research use in a commercial setting',
  [LicenseType.HOSPITAL]:
    'Use for patient services or reports in hospital/care setting',
  [LicenseType.COMMERCIAL]: 'Use in a commercial product'
};

export type License = {
  key: LicenseType;
  title: string;
};

export const LICENSE_TYPES: License[] = [
  {
    key: LicenseType.ACADEMIC,
    title: LICENSE_TITLES[LicenseType.ACADEMIC]
  },
  {
    key: LicenseType.RESEARCH_IN_COMMERCIAL,
    title: LICENSE_TITLES[LicenseType.RESEARCH_IN_COMMERCIAL]
  },
  {
    key: LicenseType.HOSPITAL,
    title: LICENSE_TITLES[LicenseType.HOSPITAL]
  },
  {
    key: LicenseType.COMMERCIAL,
    title: LICENSE_TITLES[LicenseType.COMMERCIAL]
  }
];

export enum ACCOUNT_TITLES {
  USER_NAME = 'Username',
  FIRST_NAME = 'First Name',
  LAST_NAME = 'Last Name',
  NAME = 'Name',
  EMAIL = 'Email',
  POSITION = 'Job Title',
  COMPANY = 'Company',
  CITY = 'City',
  COUNTRY = 'Country',
  API_TOKEN = 'API Token',
  LICENSE_TYPE = 'License'
}

export enum API_CALL_STATUS {
  SUCCESSFUL,
  FAILURE
}

export enum TERM_DEFINITION {
  IS_ACADEMIC_GROUP = 'IS_ACADEMIC_GROUP',
  ONLY_ACADEMIC_USAGE = 'ONLY_ACADEMIC_USAGE',
  NO_COMPANY_USAGE = 'NO_COMPANY_USAGE',
  OK_WITH_TERMS_OF_USE = 'OK_WITH_TERMS_OF_USE'
}

export enum DOCUMENT_TITLES {
  HOME = 'OncoKB',
  LEVELS = 'OncoKB Levels of Evidence',
  TEAM = 'OncoKB Team',
  ABOUT = 'About OncoKB',
  ACTIONABLE_GENES = 'OncoKB Actionable Genes',
  TERMS = 'OncoKB Terms of Use - Academic Research',
  NEWS = 'OncoKB Latest News',
  DATA_ACCESS = 'Ways to Access OncoKB Data',
  CANCER_GENES = 'OncoKB Cancer Gene List'
}

export const ACADEMIC_TERMS = [
  {
    key: TERM_DEFINITION.IS_ACADEMIC_GROUP,
    description:
      'I confirm that I am a student or employee at the academic institution specified above.'
  },
  {
    key: TERM_DEFINITION.ONLY_ACADEMIC_USAGE,
    description:
      'I agree that my use of OncoKB is solely for research or educational purposes.'
  },
  {
    key: TERM_DEFINITION.NO_COMPANY_USAGE,
    description:
      'I confirm that I will NOT use OncoKB data for use in medical reports or in an electronic health care system.'
  },
  {
    key: TERM_DEFINITION.OK_WITH_TERMS_OF_USE,
    description: (
      <span>
        I have read and agree with the OncoKB{' '}
        <Link to={PAGE_ROUTE.TERMS}>Terms of Use</Link>.
      </span>
    )
  }
];

export type DataRelease = {
  version: string;
  date: string;
};

export const DATA_RELEASES: DataRelease[] = [
  { date: '12202019', version: 'v2.0' },
  { date: '12162019', version: 'v1.24_patch_1' },
  { date: '12122019', version: 'v1.24' },
  { date: '08282019', version: 'v1.23' },
  { date: '08042019', version: 'v1.22' },
  { date: '06212019', version: 'v1.21' },
  { date: '05092019', version: 'v1.20' },
  { date: '03112019', version: 'v1.19_patch_1' },
  { date: '01242019', version: 'v1.19' },
  { date: '12142018', version: 'v1.18' },
  { date: '11022018', version: 'v1.17_patch_1' },
  { date: '10262018', version: 'v1.17' },
  { date: '10012018', version: 'v1.16' },
  { date: '08202018', version: 'v1.15' },
  { date: '07122018', version: 'v1.14' },
  { date: '04032018', version: 'v1.13_patch_2' },
  { date: '02282018', version: 'v1.13_patch_1' },
  { date: '02022018', version: 'v1.13' },
  { date: '10262017', version: 'v1.12_patch_1' },
  { date: '10192017', version: 'v1.12' },
  { date: '08302017', version: 'v1.11_patch_1' },
  { date: '08172017', version: 'v1.11' },
  { date: '05152017', version: 'v1.10_patch_1' },
  { date: '04192017', version: 'v1.9_patch_2' },
  { date: '04172017', version: 'v1.9_patch_1' },
  { date: '04052017', version: 'v1.9' },
  { date: '03072017', version: 'v1.8' }
];

export const UNAUTHORIZED_ALLOWED_PATH = [
  PAGE_ROUTE.LOGIN,
  PAGE_ROUTE.ACCOUNT_PASSWORD,
  PAGE_ROUTE.ACCOUNT_PASSWORD_RESET_REQUEST,
  PAGE_ROUTE.ACCOUNT_PASSWORD_RESET_FINISH,
  PAGE_ROUTE.ACCOUNT_VERIFY,
  PAGE_ROUTE.REGISTER
];

export enum USER_AUTHORITY {
  ROLE_USER = 'ROLE_USER',
  ROLE_PREMIUM_USER = 'ROLE_PREMIUM_USER',
  ROLE_ADMIN = 'ROLE_ADMIN',
  ROLE_PUBLIC_WEBSITE = 'ROLE_PUBLIC_WEBSITE'
}

export const USER_AUTHORITIES = [
  USER_AUTHORITY.ROLE_ADMIN,
  USER_AUTHORITY.ROLE_PREMIUM_USER,
  USER_AUTHORITY.ROLE_USER,
  USER_AUTHORITY.ROLE_PUBLIC_WEBSITE
];

export const NOT_CHANGEABLE_AUTHORITIES = [
  USER_AUTHORITY.ROLE_USER,
  USER_AUTHORITY.ROLE_PUBLIC_WEBSITE
];

export enum REGEXP {
  PMID = 'PMID:\\s*([0-9]+,*\\s*)+',
  NCTID = 'NCT[0-9]+'
}

export const REGEXP_LINK: { [key: string]: string } = {
  [REGEXP.PMID]: 'https://www.ncbi.nlm.nih.gov/pubmed/',
  [REGEXP.NCTID]: 'http://clinicaltrials.gov/show/'
};
