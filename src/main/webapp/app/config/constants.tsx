import { Gene, OncoKBInfo } from 'app/shared/api/generated/OncoKbAPI';
import {
  GeneNumber,
  MainNumber,
  VariantAnnotation,
} from 'app/shared/api/generated/OncoKbPrivateAPI';
import React from 'react';
import { Link } from 'react-router-dom';
import { Feedback, FeedbackType } from 'app/components/feedback/types';

/* eslint no-shadow: 0 */

const config = {
  VERSION: process.env.VERSION,
};

export default config;

export const SERVER_API_URL = process.env.SERVER_API_URL;

export const LOCAL_DEV_OPT = 'localdev';
export const DISABLE_BANNER_OPT = 'disablebanner';

export const DEV_URL = 'http://localhost:9095';

export const AUTHORITIES = {
  ADMIN: 'ROLE_ADMIN',
  API: 'ROLE_API',
  USER: 'ROLE_USER',
};

export const messages = {
  DATA_ERROR_ALERT: 'Internal Error',
};

export const ONCOKB = 'OncoKB';
export const ONCOKB_TM = `${ONCOKB}™`;

export const MSKCC = 'Memorial Sloan Kettering Cancer Center';

export const MSK_IMPACT_TM = 'MSK-IMPACT™';

export const APP_DATE_FORMAT = 'MM/DD/YY HH:mm';
export const APP_TIMESTAMP_FORMAT = 'MM/DD/YY HH:mm:ss';
export const APP_LOCAL_DATE_FORMAT = 'MM/DD/YYYY';
export const APP_LOCAL_DATETIME_FORMAT = 'YYYY-MM-DDTHH:mm:ss';
export const APP_LOCAL_DATETIME_FORMAT_Z = 'YYYY-MM-DDTHH:mm:ssZ';
export const APP_LOCAL_DATETIME_FORMAT_Z_FORCE = 'YYYY-MM-DDTHH:MM:SS[Z]';
export const APP_WHOLE_NUMBER_FORMAT = '0,0';
export const APP_TWO_DIGITS_AFTER_POINT_NUMBER_FORMAT = '0,0.[00]';
export const NEWS_DATE_FORMAT = 'MMDDYYYY';
export const NEWS_TITLE_DATE_FORMAT = 'MMMM D, YYYY';
export const YEAR_END_SUMMARY_DATE_FORMAT = 'YYYY';
export const YEAR_END_SUMMARY_TITLE_DATE_FORMAT = 'YYYY';
export const TABLE_MONTH_FORMAT = 'YYYY-MM';
export const TABLE_DAY_FORMAT = 'YYYY-MM-DD';

export const ONCOKB_NEWS_GROUP_SUBSCRIPTION_LINK =
  'http://groups.google.com/group/oncokb-news/boxsubscribe';

export const ONCOKB_CONTACT_EMAIL = 'contact@oncokb.org';
export const ONCOKB_LICENSE_EMAIL = 'licenses@oncokb.org';
export const GRID_BREAKPOINTS = {
  SM: 576,
  MD: 768,
  LG: 1050,
  XL: 1500,
};
export const MSK_LOGO_ICON_CUTOFF = 1260;
export const SOP_LINK = 'https://sop.oncokb.org';
export const FAQ_LINK = 'https://faq.oncokb.org';
export const FAQ_URL_PATTERNS_LINK = `${FAQ_LINK}/technical#what-are-the-url-patterns-of-oncokb-website`;
export const API_DOCUMENT_LINK = 'https://api.oncokb.org/oncokb-website/api';
export const DEMO_WEBSITE_LINK = 'https://demo.oncokb.org';
export const FACULTY_COI_WEBSITE_LINK = 'https://www.mskcc.org/disclosures';
export const ONCOKB_DATAHUB_LINK = 'https://github.com/oncokb/oncokb-datahub';
export const NONE_FACULTY_COI_WEBSITE_LINK =
  'https://docs.google.com/spreadsheets/d/1PKHV8ArVm4AFu4Rj-URWHcCAqnbWlm7p2-LOxhe0aFU/edit?usp=sharing';
export const FDA_LEVELS_OF_EVIDENCE_LINK =
  'https://www.fda.gov/media/109050/download';
export enum VIDEO_TYPES {
  WEBINAR_INTRO = 'WEBINAR_INTRO',
  WEBINAR_API = 'WEBINAR_API',
  INTRO = 'INTRO',
  INTRO_LONG = 'INTRO_LONG',
}

export const YOUTUBE_VIDEO_IDS: { [key in VIDEO_TYPES]: string } = {
  [VIDEO_TYPES.WEBINAR_INTRO]: 'XqoKrrm2Boc',
  [VIDEO_TYPES.WEBINAR_API]: 'mTTe7CTdw-g',
  [VIDEO_TYPES.INTRO]: 'aY2E7-Hhbs0',
  [VIDEO_TYPES.INTRO_LONG]: 'bYIim5WNL5A',
};
export const BILIBILI_VIDEO_IDS: { [key in VIDEO_TYPES]: string } = {
  [VIDEO_TYPES.WEBINAR_INTRO]: '370552044',
  [VIDEO_TYPES.WEBINAR_API]: '328647655',
  [VIDEO_TYPES.INTRO]: '',
  [VIDEO_TYPES.INTRO_LONG]: '',
};

export const REDIRECT_TIMEOUT_MILLISECONDS = 10000;
export const NOTIFICATION_TIMEOUT_MILLISECONDS = 5000;
export const SHORTEN_TEXT_FROM_LIST_THRESHOLD = 5;
export const TOKEN_ABOUT_2_EXPIRE_NOTICE_IN_DAYS = 14;
export const USAGE_TOP_USERS_LIMIT = 10000;
export const USAGE_ALL_TIME_KEY = 'All';
export const USAGE_ALL_TIME_VALUE = 'Year To Date';
export const USAGE_DETAIL_TIME_KEY = 'Detail';
export const USAGE_DAY_DETAIL_TIME_KEY = 'Day Detail';

export const LONG_TEXT_CUTOFF = 200;
export const LONG_TEXT_CUTOFF_COMPACT = 80;

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

export const GENERAL_ONCOGENICITY: { [key: string]: ONCOGENICITY } = {
  [ONCOGENICITY.ONCOGENIC]: ONCOGENICITY.ONCOGENIC,
  [ONCOGENICITY.LIKELY_ONCOGENIC]: ONCOGENICITY.ONCOGENIC,
  [ONCOGENICITY.PREDICTED_ONCOGENIC]: ONCOGENICITY.ONCOGENIC,
  [ONCOGENICITY.RESISTANCE]: ONCOGENICITY.RESISTANCE,
  [ONCOGENICITY.NEUTRAL]: ONCOGENICITY.NEUTRAL,
  [ONCOGENICITY.LIKELY_NEUTRAL]: ONCOGENICITY.NEUTRAL,
  [ONCOGENICITY.INCONCLUSIVE]: ONCOGENICITY.INCONCLUSIVE,
  [ONCOGENICITY.UNKNOWN]: ONCOGENICITY.UNKNOWN,
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
  UNKNOWN = 'Unknown',
}

const EVIDENCE_TYPE = {
  FDA_APPROVED: 'FDA-approved drugs',
  STANDARD_CARE: 'Standard care',
  CLINICAL_EVIDENCE: 'Clinical evidence',
  BIOLOGICAL_EVIDENCE: 'Biological evidence',
};

export enum LEVEL_TYPES {
  TX = 'Tx',
  DX = 'Dx',
  PX = 'Px',
  FDA = 'FDA',
}

export enum ANNOTATION_PAGE_TAB_KEYS {
  BIOLOGICAL = 'Biological',
  TX = 'Tx',
  DX = 'Dx',
  PX = 'Px',
  FDA = 'FDA',
}

export const LEVEL_TYPE_NAMES: { [key in LEVEL_TYPES]: string } = {
  [LEVEL_TYPES.TX]: 'Therapeutic',
  [LEVEL_TYPES.DX]: 'Diagnostic',
  [LEVEL_TYPES.PX]: 'Prognostic',
  [LEVEL_TYPES.FDA]: 'FDA',
};

export const ACTIONABLE_GENES_LEVEL_TITLE: { [key in LEVEL_TYPES]: string } = {
  [LEVEL_TYPES.TX]: LEVEL_TYPE_NAMES[LEVEL_TYPES.TX],
  [LEVEL_TYPES.DX]: `${
    LEVEL_TYPE_NAMES[LEVEL_TYPES.DX]
  } (for hematologic malignancies only)`,
  [LEVEL_TYPES.PX]: `${
    LEVEL_TYPE_NAMES[LEVEL_TYPES.PX]
  } (for hematologic malignancies only)`,
  [LEVEL_TYPES.FDA]: `${LEVEL_TYPE_NAMES[LEVEL_TYPES.FDA]}-Recognized Content`,
};

export const ANNOTATION_PAGE_TAB_NAMES: {
  [key in ANNOTATION_PAGE_TAB_KEYS]: string;
} = {
  [ANNOTATION_PAGE_TAB_KEYS.BIOLOGICAL]: 'Annotated Alterations',
  [ANNOTATION_PAGE_TAB_KEYS.TX]: 'Therapeutic',
  [ANNOTATION_PAGE_TAB_KEYS.DX]: 'Diagnostic',
  [ANNOTATION_PAGE_TAB_KEYS.PX]: 'Prognostic',
  [ANNOTATION_PAGE_TAB_KEYS.FDA]: 'FDA-Recognized Content',
};

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
}

export const FDA_LEVELS = [LEVELS.Fda1, LEVELS.Fda2, LEVELS.Fda3];
export const TX_LEVELS = [
  LEVELS.Tx1,
  LEVELS.Tx2,
  LEVELS.Tx3,
  LEVELS.Tx3A,
  LEVELS.Tx3B,
  LEVELS.Tx4,
  LEVELS.R1,
  LEVELS.R2,
];
export const DX_LEVELS = [LEVELS.Dx1, LEVELS.Dx2, LEVELS.Dx3];
export const PX_LEVELS = [LEVELS.Px1, LEVELS.Px2, LEVELS.Px3];
export const ONCOKB_LEVELS = TX_LEVELS.concat(DX_LEVELS).concat(PX_LEVELS);

// bigger the index, higher the priority
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
];

export const LEVEL_PRIORITY_BY_TYPE: LEVELS[] = [
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
  LEVELS.R1,
  LEVELS.Tx4,
  LEVELS.Tx3B,
  LEVELS.Tx3A,
  LEVELS.Tx3,
  LEVELS.Tx2,
  LEVELS.Tx1,
];

export const LEVEL_BUTTON_DESCRIPTION: { [key in LEVELS]: string } = {
  [LEVELS.Tx1]: EVIDENCE_TYPE.FDA_APPROVED,
  [LEVELS.Tx2]: EVIDENCE_TYPE.STANDARD_CARE,
  [LEVELS.Tx3]: EVIDENCE_TYPE.CLINICAL_EVIDENCE,
  [LEVELS.Tx3A]: EVIDENCE_TYPE.CLINICAL_EVIDENCE,
  [LEVELS.Tx3B]: EVIDENCE_TYPE.CLINICAL_EVIDENCE,
  [LEVELS.Tx4]: EVIDENCE_TYPE.BIOLOGICAL_EVIDENCE,
  [LEVELS.R1]: EVIDENCE_TYPE.STANDARD_CARE,
  [LEVELS.R2]: EVIDENCE_TYPE.CLINICAL_EVIDENCE,
  [LEVELS.Dx1]: 'Required for diagnosis',
  [LEVELS.Dx2]: 'Supports diagnosis',
  [LEVELS.Dx3]: 'Investigational diagnosis',
  [LEVELS.Px1]: 'Guideline-recognized with well-powered data',
  [LEVELS.Px2]: 'Guideline-recognized with limited data',
  [LEVELS.Px3]: 'Investigational',
  [LEVELS.Fda1]: 'With CDx',
  [LEVELS.Fda2]: 'Clinical Significance',
  [LEVELS.Fda3]: 'Potential Clinical Significance',
};

export const LEVEL_CLASSIFICATION: { [key in LEVELS]: LEVEL_TYPES } = {
  [LEVELS.Dx1]: LEVEL_TYPES.DX,
  [LEVELS.Dx2]: LEVEL_TYPES.DX,
  [LEVELS.Dx3]: LEVEL_TYPES.DX,
  [LEVELS.Px1]: LEVEL_TYPES.PX,
  [LEVELS.Px2]: LEVEL_TYPES.PX,
  [LEVELS.Px3]: LEVEL_TYPES.PX,
  [LEVELS.Tx1]: LEVEL_TYPES.TX,
  [LEVELS.Tx2]: LEVEL_TYPES.TX,
  [LEVELS.Tx3]: LEVEL_TYPES.TX,
  [LEVELS.Tx3A]: LEVEL_TYPES.TX,
  [LEVELS.Tx3B]: LEVEL_TYPES.TX,
  [LEVELS.Tx3]: LEVEL_TYPES.TX,
  [LEVELS.Tx4]: LEVEL_TYPES.TX,
  [LEVELS.R1]: LEVEL_TYPES.TX,
  [LEVELS.R2]: LEVEL_TYPES.TX,
  [LEVELS.Fda1]: LEVEL_TYPES.FDA,
  [LEVELS.Fda2]: LEVEL_TYPES.FDA,
  [LEVELS.Fda3]: LEVEL_TYPES.FDA,
};

export const ONCOGENICITY_CLASS_NAMES: { [key in ONCOGENICITY]: string } = {
  [ONCOGENICITY.NEUTRAL]: 'neutral',
  [ONCOGENICITY.LIKELY_NEUTRAL]: 'neutral',
  [ONCOGENICITY.UNKNOWN]: 'unknown',
  [ONCOGENICITY.INCONCLUSIVE]: 'inconclusive',
  [ONCOGENICITY.RESISTANCE]: 'oncogenic',
  [ONCOGENICITY.PREDICTED_ONCOGENIC]: 'oncogenic',
  [ONCOGENICITY.LIKELY_ONCOGENIC]: 'oncogenic',
  [ONCOGENICITY.ONCOGENIC]: 'oncogenic',
};
export const DEFAULT_MESSAGE_UNKNOWN_GENE =
  'We do not have any information for this gene';
export const DEFAULT_MESSAGE_HEME_ONLY_DX =
  'Diagnostic implications are curated for hematologic malignancies only.';
export const DEFAULT_MESSAGE_HEME_ONLY_PX =
  'Prognostic implications are curated for hematologic malignancies only.';

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
  INVESTIGATIONAL_THERAPEUTIC_IMPLICATIONS_DRUG_RESISTANCE = 'INVESTIGATIONAL_THERAPEUTIC_IMPLICATIONS_DRUG_RESISTANCE',
}

export const TREATMENT_EVIDENCE_TYPES: EVIDENCE_TYPES[] = [
  EVIDENCE_TYPES.STANDARD_THERAPEUTIC_IMPLICATIONS_FOR_DRUG_SENSITIVITY,
  EVIDENCE_TYPES.STANDARD_THERAPEUTIC_IMPLICATIONS_FOR_DRUG_RESISTANCE,
  EVIDENCE_TYPES.INVESTIGATIONAL_THERAPEUTIC_IMPLICATIONS_DRUG_SENSITIVITY,
  EVIDENCE_TYPES.INVESTIGATIONAL_THERAPEUTIC_IMPLICATIONS_DRUG_RESISTANCE,
];

export const QUERY_SEPARATOR_FOR_QUERY_STRING = 'comma';

// Defaults for margin spaces between sections
export const DEFAULT_MARGIN_TOP_SM = 'mt-2';
export const DEFAULT_MARGIN_TOP_LG = 'mt-3';
export const DEFAULT_MARGIN_BOTTOM_SM = 'mb-2';
export const DEFAULT_MARGIN_BOTTOM_LG = 'mb-3';
export const THRESHOLD_TABLE_FIXED_HEIGHT = 15;
export const THRESHOLD_ALTERATION_PAGE_TABLE_FIXED_HEIGHT = 5;
export const THRESHOLD_TRIAL_TOKEN_VALID_DEFAULT = 90;
export const LG_TABLE_FIXED_HEIGHT = 640;
export const SM_TABLE_FIXED_HEIGHT = 400;
export const IMG_MAX_WIDTH = 800;
export const COMPONENT_PADDING = ['pl-2', 'pr-2', 'mb-2'];
export const H5_FONT_SIZE = '1.25rem';
export const FONT_FAMILY = "'Gotham Book', sans-serif";

// Defaults for tooltip size
export const TOOLTIP_MAX_HEIGHT = 300;

// Defaults for the models
export const DEFAULT_ONCOKB_INFO: OncoKBInfo = {
  dataVersion: {
    date: '',
    version: '',
  },
  appVersion: {
    major: 0,
    minor: 0,
    patch: 1,
    stable: true,
    suffixTokens: [],
    version: 'v0.0.1',
  },
  levels: [],
  ncitVersion: '',
  apiVersion: {
    major: 1,
    minor: 0,
    patch: 0,
    stable: true,
    suffixTokens: [],
    version: 'v1.0.0',
  },
  publicInstance: false,
  oncoTreeVersion: '',
};

export const DEFAULT_MAIN_NUMBERS: MainNumber = {
  gene: 0,
  alteration: 0,
  tumorType: 0,
  drug: 0,
  level: [],
};

export const DEFAULT_GENE: Gene = {
  grch37Isoform: '',
  grch37RefSeq: '',
  grch38Isoform: '',
  grch38RefSeq: '',
  entrezGeneId: -1,
  geneAliases: [],
  genesets: [],
  hugoSymbol: '',
  oncogene: false,
  tsg: false,
};

export const DEFAULT_GENE_NUMBER: GeneNumber = {
  gene: DEFAULT_GENE,
  alteration: 0,
  highestSensitiveLevel: '',
  highestResistanceLevel: '',
  highestDiagnosticImplicationLevel: '',
  highestPrognosticImplicationLevel: '',
  highestFdaLevel: '',
  tumorType: 0,
};

export const DEFAULT_MUTATION_EFFECT = {
  citations: {
    abstracts: [],
    pmids: [],
  },

  description: '',

  knownEffect: '',
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
  referenceGenome: 'GRCH37' as any,
  svType: 'UNKNOWN' as 'UNKNOWN',
  tumorType: '',
  type: '',
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
  highestFdaLevel: 'NO',
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

  vue: false,
  vus: false,
};

export enum PAGE_TITLE {
  ABOUT = 'About OncoKB™',
  ACCOUNT = 'Account',
  ACCOUNT_SETTINGS = 'Account Settings',
  ACCOUNT_PASSWORD = 'Change Password',
  ACTIONABLE_GENES = 'OncoKB™ Actionable Genes',
  ADMIN_USER_DETAILS = 'Registered Users',
  ADMIN_SEND_EMAILS = 'Send Emails to Users',
  ADMIN_CREATE_ACCOUNT = 'Create New Account',
  ADMIN_USAGE_ANALYSIS = 'Usage Analysis',
  ADMIN_ADD_COMPANY = 'Add New Company',
  ADMIN_COMPANY_DETAILS = 'Companies',
  API_ACCESS = 'API Access',
  CANCER_GENES = 'OncoKB™ Cancer Gene List',
  FAQ = 'Frequently Asked Question',
  FDA_RECOGNITION = 'OncoKB™ is now an FDA-recognized Public Human Genetic Variant Database*',
  HOME = "OncoKB™ - MSK's Precision Oncology Knowledge Base",
  DX = 'OncoKB™ Diagnostic Levels of Evidence',
  PX = 'OncoKB™ Prognostic Levels of Evidence',
  V1 = 'OncoKB™ Therapeutic Level of Evidence V1',
  V2 = 'OncoKB™ Therapeutic Level of Evidence V2',
  FDA = 'Mapping between the OncoKB™ Levels of Evidence and the FDA Levels of Evidence',
  AAC = 'Mapping between the OncoKB™ Levels of Evidence and the AMP/ASCO/CAP Consensus Recommendation',
  FDA_NGS = 'FDA fact sheet',

  LOGOUT = 'Log out',
  LOGIN = 'Log in',
  NEWS = 'Latest News',
  REGISTER = 'Register',
  TEAM = 'OncoKB™ Team',
  TERMS = 'Terms of Use',
  SOP = 'OncoKB™ Standard Operating Procedure',
  YEAR_END_SUMMARY = 'Year End Summary',
}

export enum PAGE_ROUTE {
  LOGIN = '/login',
  LOGOUT = '/logout',
  LEGACY_DATA_ACCESS = '/dataAccess',
  LEGACY_API_ACCESS = '/apiAccess',
  API_ACCESS = '/api-access',
  FAQ_ACCESS = '/faq',
  LEGACY_CANCER_GENES = '/cancerGenes',
  CANCER_GENES = '/cancer-genes',
  LEGACY_ACTIONABLE_GENE = '/actionableGenes',
  ACTIONABLE_GENE = '/actionable-genes',
  PO_TX = '/precision-oncology-therapies',
  ONCOLOGY_TX = '/oncology-therapies',
  CDX = '/companion-diagnostic-devices',
  GENE_HEADER = '/gene',
  GENE = '/gene/:hugoSymbol',
  ALTERATION = '/gene/:hugoSymbol/:alteration',
  HGVSG = '/hgvsg',
  HGVSG_WITH_QUERY = '/hgvsg/:query',
  GENOMIC_CHANGE = '/genomic-change',
  GENOMIC_CHANGE_WITH_QUERY = '/genomic-change/:query',
  ALTERATION_TUMOR_TYPE = '/gene/:hugoSymbol/:alteration/:tumorType',
  HOME = '/',
  ABOUT = '/about',
  TERMS = '/terms',
  SOP = '/sop',
  TEAM = '/team',
  YEAR_END_SUMMARY = '/year-end-summary',
  NEWS = '/news',
  FDA_RECOGNITION = '/fda-recognition',
  LEVELS = '/levels',
  DX = '/diagnostic-levels',
  PX = '/prognostic-levels',
  V2 = '/therapeutic-levels',
  FDA_NGS = '/fda-levels',

  SWAGGER_UI = '/swagger-ui/index.html',
  ADMIN = '/admin',
  ADMIN_USER_DETAILS = '/admin/user-details',
  ADMIN_SEND_EMAILS = '/admin/send-emails',
  ADMIN_CREATE_ACCOUNT = '/admin/create-account',
  ADMIN_USAGE_ANALYSIS = '/admin/usage-analysis',
  ADMIN_USER_USAGE_DETAILS = '/admin/usage-analysis/users/:id',
  ADMIN_USER_USAGE_DETAILS_LINK = '/admin/usage-analysis/users/',
  ADMIN_RESOURCE_DETAILS = '/admin/usage-analysis/resources/:endpoint',
  ADMIN_RESOURCE_DETAILS_LINK = '/admin/usage-analysis/resources/',
  ADMIN_ADD_COMPANY = '/admin/create-company',
  ADMIN_COMPANY_DETAILS = '/admin/company-details',
  COMPANY = '/companies/:id',
  CREATE_COMPANY_USERS = '/companies/:id/create-users',
  USER = '/users/:login',
  ACCOUNT = '/account',
  REGISTER = '/account/register',
  ACCOUNT_VERIFY = '/account/verify',
  ACCOUNT_SETTINGS = '/account/settings',
  ACCOUNT_PASSWORD = '/account/password',
  ACCOUNT_PASSWORD_RESET_REQUEST = '/account/reset/request',
  ACCOUNT_PASSWORD_RESET_FINISH = '/account/reset/finish',
  ACCOUNT_ACTIVE_TRIAL_FINISH = '/account/active-trial/finish',
  ANNOTATION_VISUALISATION = '/annotate',
}

export enum TABLE_COLUMN_KEY {
  HUGO_SYMBOL = 'HUGO_SYMBOL',
  ALTERATION = 'ALTERATION',
  ALTERATIONS = 'ALTERATIONS',
  EVIDENCE_CANCER_TYPE = 'EVIDENCE_CANCER_TYPE',
  CANCER_TYPE = 'CANCER_TYPE',
  DRUGS = 'DRUGS',
  LEVEL = 'LEVEL',
  FDA_LEVEL = 'FDA_LEVEL',
  CITATIONS = 'CITATIONS',
  ONCOGENICITY = 'ONCOGENICITY',
  MUTATION_EFFECT = 'MUTATION_EFFECT',
  DESCRIPTION = 'DESCRIPTION',
}

export const ONCOGENIC_MUTATIONS = 'Oncogenic Mutations';
export const AMPLIFICATION = 'Amplification';
export const DELETION = 'Deletion';
export const FUSIONS = 'Fusions';
export const TRUNCATING_MUTATIONS = 'Truncating Mutations';
export const OTHER_BIOMARKERS = 'Other Biomarkers';
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
export enum SEARCH_QUERY_KEY {
  REFERENCE_GENOME = 'refGenome',
}

export enum LicenseType {
  ACADEMIC = 'ACADEMIC',
  RESEARCH_IN_COMMERCIAL = 'RESEARCH_IN_COMMERCIAL',
  HOSPITAL = 'HOSPITAL',
  COMMERCIAL = 'COMMERCIAL',
}

export const LICENSE_TITLES: { [key in LicenseType]: string } = {
  [LicenseType.ACADEMIC]: 'Research use in an academic setting',
  [LicenseType.RESEARCH_IN_COMMERCIAL]: 'Research use in a commercial setting',
  [LicenseType.HOSPITAL]:
    'Use for patient services or reports in a hospital setting',
  [LicenseType.COMMERCIAL]: 'Use in a commercial product',
};

export type License = {
  key: LicenseType;
  title: string;
};

export const LICENSE_TYPES: License[] = [
  {
    key: LicenseType.ACADEMIC,
    title: LICENSE_TITLES[LicenseType.ACADEMIC],
  },
  {
    key: LicenseType.RESEARCH_IN_COMMERCIAL,
    title: LICENSE_TITLES[LicenseType.RESEARCH_IN_COMMERCIAL],
  },
  {
    key: LicenseType.HOSPITAL,
    title: LICENSE_TITLES[LicenseType.HOSPITAL],
  },
  {
    key: LicenseType.COMMERCIAL,
    title: LICENSE_TITLES[LicenseType.COMMERCIAL],
  },
];

export enum CompanyType {
  PARENT = 'PARENT',
  BRANCH = 'BRANCH',
  UNKNOWN = 'UNKNOWN',
}

export const COMPANY_TYPE_TITLES: { [key in CompanyType]: string } = {
  [CompanyType.PARENT]: 'Parent',
  [CompanyType.BRANCH]: 'Branch',
  [CompanyType.UNKNOWN]: 'Unknown',
};

export enum LicenseStatus {
  REGULAR = 'REGULAR',
  TRIAL = 'TRIAL',
  TRIAL_EXPIRED = 'TRIAL_EXPIRED',
  EXPIRED = 'EXPIRED',
  UNKNOWN = 'UNKNOWN',
}

export const LICENSE_STATUS_TITLES: { [key in LicenseStatus]: string } = {
  [LicenseStatus.REGULAR]: 'Regular',
  [LicenseStatus.TRIAL]: 'Trial',
  [LicenseStatus.TRIAL_EXPIRED]: 'Trial Expired',
  [LicenseStatus.EXPIRED]: 'Expired',
  [LicenseStatus.UNKNOWN]: 'Unknown',
};

export enum LicenseModel {
  FULL = 'FULL',
  LIMITED = 'LIMITED',
}

export const LICENSE_MODEL_TITLES: { [key in LicenseModel]: string } = {
  [LicenseModel.FULL]: 'Full License',
  [LicenseModel.LIMITED]: 'Limited License',
};

export const LICENSE_MODEL_DESCRIPTIONS: { [key in LicenseModel]: string } = {
  [LicenseModel.FULL]: `This tier will allow any user with a matching email address domain to be automatically approved.`,
  [LicenseModel.LIMITED]:
    'This tier is appropriate when we want to restrict the license to a group of users. ',
};

export enum ACCOUNT_TITLES {
  ID = 'User ID',
  USER_NAME = 'Username',
  FIRST_NAME = 'First Name',
  LAST_NAME = 'Last Name',
  NAME = 'Name',
  EMAIL = 'Email',
  POSITION = 'Job Title / Position',
  COMPANY = 'Company',
  COMPANY_SECTION_TITLE = 'Company Information',
  CITY = 'City',
  COUNTRY = 'Country',
  API_TOKEN = 'API Token',
  LICENSE_TYPE = 'License',
  ADDITIONAL_INFO_USE_CASE = 'Use Case',
}

export enum API_CALL_STATUS {
  SUCCESSFUL,
  FAILURE,
}

export enum TERM_DEFINITION {
  IS_ACADEMIC_GROUP = 'IS_ACADEMIC_GROUP',
  ONLY_ACADEMIC_USAGE = 'ONLY_ACADEMIC_USAGE',
  NO_COMPANY_USAGE = 'NO_COMPANY_USAGE',
  OK_WITH_TERMS_OF_USE = 'OK_WITH_TERMS_OF_USE',
  NOT_USED_IN_AI_MODELS = 'NOT_USED_IN_AI_MODELS',
}

export const FDA_RECOGNITION_DISCLAIMER: React.FunctionComponent<{
  enableLink: boolean;
}> = props => (
  <span>
    {props.enableLink ? (
      <Link to={PAGE_ROUTE.FDA_RECOGNITION}>FDA recognition</Link>
    ) : (
      'FDA recognition'
    )}{' '}
    of {ONCOKB_TM} is for the content that is clearly marked
  </span>
);
export const AsteriskMark = () => <span>&#42;</span>;
export const FdaRecognitionDisclaimer: React.FunctionComponent<{
  enableLink: boolean;
}> = props => (
  <span>
    <AsteriskMark />
    <FDA_RECOGNITION_DISCLAIMER enableLink={props.enableLink} />
  </span>
);

export const ACADEMIC_TERMS = [
  {
    key: TERM_DEFINITION.IS_ACADEMIC_GROUP,
    description:
      'I confirm that I am a student or employee at the academic institution specified above.',
  },
  {
    key: TERM_DEFINITION.ONLY_ACADEMIC_USAGE,
    description: `I agree that my use of ${ONCOKB_TM} is solely for research or educational purposes.`,
  },
  {
    key: TERM_DEFINITION.NOT_USED_IN_AI_MODELS,
    description: `I confirm that I will NOT use ${ONCOKB_TM} data for the purpose of creating and training AI models.`,
  },
  {
    key: TERM_DEFINITION.NO_COMPANY_USAGE,
    description: `I confirm that I will NOT use ${ONCOKB_TM} data for use in medical reports or in an electronic health care system.`,
  },
  {
    key: TERM_DEFINITION.OK_WITH_TERMS_OF_USE,
    description: (
      <span>
        I have read and agree with the {ONCOKB_TM}{' '}
        <Link to={PAGE_ROUTE.TERMS}>Terms of Use</Link>.
      </span>
    ),
  },
];

export type DataRelease = {
  version: string;
  date: string;
};

export const DATA_RELEASES: DataRelease[] = [
  { date: '07042024', version: 'v4.19' },
  { date: '07022024', version: 'v4.18' },
  { date: '06042024', version: 'v4.17' },
  { date: '05012024', version: 'v4.16' },
  { date: '03212024', version: 'v4.15' },
  { date: '02082024', version: 'v4.14' },
  { date: '12212023', version: 'v4.13' },
  { date: '12062023', version: 'v4.12' },
  { date: '11132023', version: 'v4.11' },
  { date: '10242023', version: 'v4.10' },
  { date: '10022023', version: 'v4.9' },
  { date: '09012023', version: 'v4.8' },
  { date: '07282023', version: 'v4.7' },
  { date: '07122023', version: 'v4.6' },
  { date: '05192023', version: 'v4.5' },
  { date: '04122023', version: 'v4.4' },
  { date: '03222023', version: 'v4.3' },
  { date: '02102023', version: 'v4.2' },
  { date: '02012023', version: 'v4.1' },
  { date: '12222022', version: 'v4.0' },
  { date: '12132022', version: 'v3.19' },
  { date: '11302022', version: 'v3.18' },
  { date: '10282022', version: 'v3.17' },
  { date: '09062022', version: 'v3.16' },
  { date: '07252022', version: 'v3.15' },
  { date: '06062022', version: 'v3.14' },
  { date: '05052022', version: 'v3.13' },
  { date: '03292022', version: 'v3.12' },
  { date: '02282022', version: 'v3.11' },
  { date: '01072022', version: 'v3.10' },
  { date: '12302021', version: 'v3.9_patch_1' },
  { date: '11292021', version: 'v3.9' },
  { date: '10262021', version: 'v3.8' },
  { date: '09292021', version: 'v3.7' },
  { date: '08312021', version: 'v3.6' },
  { date: '07162021', version: 'v3.5' },
  { date: '06172021', version: 'v3.4' },
  { date: '04142021', version: 'v3.3' },
  { date: '03122021', version: 'v3.2' },
  { date: '02102021', version: 'v3.1' },
  { date: '01142021', version: 'v3.0' },
  { date: '12172020', version: 'v2.10' },
  { date: '11132020', version: 'v2.9' },
  { date: '09172020', version: 'v2.8' },
  { date: '08282020', version: 'v2.7' },
  { date: '08052020', version: 'v2.6_patch_1' },
  { date: '07232020', version: 'v2.6' },
  { date: '07092020', version: 'v2.5' },
  { date: '06092020', version: 'v2.4' },
  { date: '05112020', version: 'v2.3' },
  { date: '04232020', version: 'v2.2' },
  { date: '03262020', version: 'v2.1_patch_1' },
  { date: '02122020', version: 'v2.1' },
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
  { date: '03072017', version: 'v1.8' },
];

export const UNAUTHORIZED_ALLOWED_PATH = [
  PAGE_ROUTE.LOGIN,
  PAGE_ROUTE.ACCOUNT_PASSWORD,
  PAGE_ROUTE.ACCOUNT_PASSWORD_RESET_REQUEST,
  PAGE_ROUTE.ACCOUNT_PASSWORD_RESET_FINISH,
  PAGE_ROUTE.ACCOUNT_VERIFY,
  PAGE_ROUTE.REGISTER,
];

export enum USER_AUTHORITY {
  ROLE_USER = 'ROLE_USER',
  ROLE_API = 'ROLE_API',
  ROLE_PREMIUM_USER = 'ROLE_PREMIUM_USER',
  ROLE_ADMIN = 'ROLE_ADMIN',
  ROLE_DATA_DOWNLOAD = 'ROLE_DATA_DOWNLOAD',
  ROLE_PUBLIC_WEBSITE = 'ROLE_PUBLIC_WEBSITE',
}

export const USER_AUTHORITIES = [
  USER_AUTHORITY.ROLE_ADMIN,
  USER_AUTHORITY.ROLE_API,
  USER_AUTHORITY.ROLE_PREMIUM_USER,
  USER_AUTHORITY.ROLE_DATA_DOWNLOAD,
  USER_AUTHORITY.ROLE_USER,
  USER_AUTHORITY.ROLE_PUBLIC_WEBSITE,
];

export const NOT_CHANGEABLE_AUTHORITIES = [
  USER_AUTHORITY.ROLE_USER,
  USER_AUTHORITY.ROLE_PUBLIC_WEBSITE,
];

export enum REFERENCE_GENOME {
  GRCh37 = 'GRCh37',
  GRCh38 = 'GRCh38',
}

export const DEFAULT_REFERENCE_GENOME = REFERENCE_GENOME.GRCh37;

export const DEFAULT_FEEDBACK_ANNOTATION: Feedback = {
  type: FeedbackType.ANNOTATION,
};

export const FDA_SUBMISSION_URL_SUFFIX = {
  PMA: 'cfpma/pma.cfm',
  PMN: 'cfpmn/pmn.cfm',
  HDE: 'cfhde/hde.cfm',
  DEN: 'cfpmn/denovo.cfm',
};
