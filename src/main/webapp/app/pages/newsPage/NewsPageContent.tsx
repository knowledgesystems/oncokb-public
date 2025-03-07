import React from 'react';
import { Row, Col } from 'react-bootstrap';
import SearchOneImg from 'content/images/search_advanced_1.png';
import SearchTwoImg from 'content/images/search_advanced_2.png';
import ClinicalImg from 'content/images/cbioportal-clinical.png';
import BiologicalImg from 'content/images/cbioportal-biological.png';
import ERBBImg from 'content/images/ERBB.png';
import { ElementType, SimpleTable } from 'app/components/SimpleTable';
import {
  NewlyAddedGenesListItem,
  NewlyAddedGeneType,
} from 'app/pages/newsPage/NewlyAddedGenesListItem';
import { Link } from 'react-router-dom';
import {
  FAQ_URL_PATTERNS_LINK,
  LEVEL_TYPES,
  PAGE_ROUTE,
  ONCOKB_DATAHUB_LINK,
  ONCOKB_TM,
  MSK_IMPACT_TM,
} from 'app/config/constants';
import {
  AlterationPageLink,
  GenePageLink,
  MSILink,
  SopPageLink,
  YearEndReviewPageLink,
  getAlterationPageLink,
  getAlternativeAllelesPageLinks,
  getAlternativeGenePageLinks,
} from 'app/shared/utils/UrlUtils';
import { PMIDLink } from 'app/shared/links/PMIDLink';
import { Linkout } from 'app/shared/links/Linkout';
import { LevelOfEvidencePageLink } from 'app/shared/links/LevelOfEvidencePageLink';
import {
  AbstractLink,
  FdaApprovalLink,
  FdaBreakthroughLink,
  FdaWithdrawalLink,
  NccnLink,
} from 'app/pages/newsPage/Links';
import WithSeparator from 'react-with-separator';
import mainstyle from 'app/pages/newsPage/main.module.scss';
import { PMALink } from 'app/shared/links/PMALink';
import OptimizedImage from 'app/shared/image/OptimizedImage';
import { AnnotationColumnHeaderType } from './ChangedAnnotationListItem';
import { linkableMutationName, convertGeneInputToLinks } from './Util';
import NewsContent022025 from './code-generated/NewsContent022025';

export type ChangedAnnotation = {
  content: (ElementType | ElementType[])[][];
  title?: string;
  columnHeaderType?: AnnotationColumnHeaderType;
  headers?: { name: string }[];
  useOneLineRowClass?: boolean;
};

export type NewsData = {
  rawComponent?: JSX.Element;
  priorityNews?: ElementType[];
  news?: ElementType[];
  newlyAddedGenes?: string[];
  newlyAddedGenesTypes?: NewlyAddedGeneType[];
  updatedImplication?: ElementType[][];
  updatedImplicationTitle?: string;
  numOfAssociationsInUpdatedImplication?: number;
  updatedImplicationInOldFormat?: { [level: string]: ElementType[] };
  changedAnnotations?: ChangedAnnotation[];
};

export const GENE = 'Gene';
export const MUTATION = 'Mutation';
export const CANCER_TYPE = 'Cancer Type';
export const DRUG = 'Drug';
export const LEVEL = 'Level';
export const LEVELS = 'Level(s)';
export const DRUGS = 'Drug(s)';
export const EVIDENCE = 'Evidence';
export const PREVIOUS_LEVEL = 'Previous Level';
export const CURRENT_LEVEL = 'Current Level';
export const UPDATED_LEVEL = 'Updated Level';
export const REASON = 'Reason';
export const PREVIOUS_DRUG = 'Previous Drug';
export const CURRENT_DRUG = 'Current Drug';
export const UPDATE = 'Update';
export const LEVEL_OF_EVIDENCE = 'Level of Evidence';
export const CURRENT_LEVEL_OF_EVIDENCE = 'Current Level of Evidence';
export const PREVIOUS_LEVEL_OF_EVIDENCE = 'Previous Level of Evidence';
export const DRUGS_ADDED_TO_ONCOKB = `Drug(s) added to ${ONCOKB_TM}`;
export const DRUGS_UPDATE_IN_ONCOKB = `Drug(s) updated in ${ONCOKB_TM}`;
export const DRUGS_REMAINING_IN_ONCOKB = `Drug(s) remaining in ${ONCOKB_TM}`;
export const DRUGS_REMOVED_FROM_ONCOKB = `Drug(s) removed from ${ONCOKB_TM}`;
export const DRUGS_DEMOTED_IN_ONCOKB = `Drug(s) demoted in ${ONCOKB_TM}`;
export const DRUGS_PROMOTED_IN_ONCOKB = `Drug(s) promoted in ${ONCOKB_TM}`;
export const DRUGS_CHANGED_IN_ONCOKB = `Drug(s) changed in ${ONCOKB_TM}`;
export const LEVEL_ASSOCIATED_DRUGS_IN_ONCOKB = `Level-associated Drug(s) in ${ONCOKB_TM}`;
export const DRUGS_ASSOCIATED_WITH_CURRENT_LEVEL =
  'Drug(s) Associated with the Current Level';
export const UPDATED_SENSITIVITY_LEVEL = 'Updated Sensitivity Level';
export const UPDATED_RESISTANCE_LEVEL = 'Updated Resistance Level';
export const PREVIOUS_BIOMARKER_ASSOCIATION = 'Previous Biomarker Association';
export const CURRENT_BIOMARKER_ASSOCIATION = 'Current Biomarker Association';
export const PREVIOUS_LEVEL_ANNOTATION = 'Previous Variant Annotation';
export const CURRENT_LEVEL_ANNOTATION = 'Current Variant Annotation';

export const NEWLY_ADDED_LEVEL_FOUR_COLUMNS = [
  { name: GENE, size: 2 },
  { name: MUTATION, size: 6 },
  { name: CANCER_TYPE, size: 2 },
  { name: DRUG, size: 2 },
];

export const UPDATED_IMPLICATION_COLUMNS = [
  { name: LEVEL },
  { name: GENE },
  { name: MUTATION },
  { name: CANCER_TYPE },
  { name: DRUGS },
  { name: EVIDENCE },
];

export const UPDATED_IMPLICATION_OLD_FORMAT_COLUMNS = [
  { name: LEVEL },
  { name: UPDATE },
];

export const CHANGED_ANNOTATION_LEVEL_COLUMNS = [
  { name: GENE },
  { name: MUTATION },
  { name: CANCER_TYPE },
  { name: DRUGS },
  { name: PREVIOUS_LEVEL },
  { name: CURRENT_LEVEL },
  { name: REASON },
];

export const CHANGED_ANNOTATION_LEVEL_WITH_EVIDENCE_COLUMNS = [
  { name: GENE },
  { name: MUTATION },
  { name: CANCER_TYPE },
  { name: LEVEL_ASSOCIATED_DRUGS_IN_ONCOKB },
  { name: PREVIOUS_LEVEL },
  { name: UPDATED_LEVEL },
  { name: EVIDENCE },
];

export const CHANGED_ANNOTATION_DRUG_COLUMNS = [
  { name: LEVEL },
  { name: GENE },
  { name: MUTATION },
  { name: CANCER_TYPE },
  { name: PREVIOUS_DRUG },
  { name: CURRENT_DRUG },
  { name: EVIDENCE },
];

export const CHANGED_ANNOTATION_DRUG_SAME_HIGHEST_LEVEL_COLUMNS = [
  { name: LEVEL },
  { name: GENE },
  { name: MUTATION },
  { name: CANCER_TYPE },
  { name: DRUGS_REMAINING_IN_ONCOKB },
  { name: DRUGS_CHANGED_IN_ONCOKB },
  { name: EVIDENCE },
];

export const CHANGED_ANNOTATION_ADDITIONAL_DRUG_SAME_LEVEL_COLUMNS = [
  { name: GENE },
  { name: MUTATION },
  { name: CANCER_TYPE },
  { name: CURRENT_LEVEL_OF_EVIDENCE },
  { name: DRUGS_REMAINING_IN_ONCOKB },
  { name: DRUGS_ADDED_TO_ONCOKB },
  { name: EVIDENCE },
];

export const CHANGED_ANNOTATION_ADDITIONAL_DRUG_DIFF_LEVEL_COLUMNS = [
  { name: GENE },
  { name: MUTATION },
  { name: CANCER_TYPE },
  { name: PREVIOUS_LEVEL_OF_EVIDENCE },
  { name: CURRENT_LEVEL_OF_EVIDENCE },
  { name: DRUGS_REMAINING_IN_ONCOKB },
  { name: DRUGS_ADDED_TO_ONCOKB },
  { name: EVIDENCE },
];

export const CHANGED_ANNOTATION_DRUG_REMOVAL_COLUMNS = [
  { name: GENE },
  { name: MUTATION },
  { name: CANCER_TYPE },
  { name: PREVIOUS_LEVEL },
  { name: CURRENT_LEVEL_OF_EVIDENCE },
  { name: DRUGS_REMAINING_IN_ONCOKB },
  { name: DRUGS_REMOVED_FROM_ONCOKB },
  { name: EVIDENCE },
];

export const CHANGED_ANNOTATION_DRUG_REMOVAL_SAME_HIGHEST_LEVEL_COLUMNS = [
  { name: GENE },
  { name: MUTATION },
  { name: CANCER_TYPE },
  { name: CURRENT_LEVEL_OF_EVIDENCE },
  { name: DRUGS_REMOVED_FROM_ONCOKB },
  { name: DRUGS_REMAINING_IN_ONCOKB },
  { name: EVIDENCE },
];

export const CHANGED_ANNOTATION_SENSITIVITY_LEVEL_COLUMNS = [
  { name: GENE },
  { name: MUTATION },
  { name: CANCER_TYPE },
  { name: DRUGS_REMAINING_IN_ONCOKB },
  { name: DRUGS_ADDED_TO_ONCOKB },
  { name: UPDATED_SENSITIVITY_LEVEL },
  { name: UPDATED_RESISTANCE_LEVEL },
  { name: EVIDENCE },
];

export const UPDATED_ANNOTATION_LEVEL_COLUMNS = [
  { name: GENE },
  { name: MUTATION },
  { name: CANCER_TYPE },
  { name: DRUGS },
  { name: PREVIOUS_LEVEL },
  { name: UPDATED_LEVEL },
  { name: EVIDENCE },
];

export const CHANGED_ANNOTATION_ADDITIONAL_DRUG_SAME_HIGHEST_LEVEL_COLUMNS = [
  { name: GENE },
  { name: MUTATION },
  { name: CANCER_TYPE },
  { name: LEVEL_OF_EVIDENCE },
  { name: LEVEL_ASSOCIATED_DRUGS_IN_ONCOKB },
  { name: DRUGS_ADDED_TO_ONCOKB },
  { name: EVIDENCE },
];

export const CHANGED_ANNOTATION_UPDATED_DRUG_SAME_HIGHEST_LEVEL_COLUMNS = [
  { name: LEVEL },
  { name: GENE },
  { name: MUTATION },
  { name: CANCER_TYPE },
  { name: LEVEL_ASSOCIATED_DRUGS_IN_ONCOKB },
  { name: DRUGS_UPDATE_IN_ONCOKB },
  { name: EVIDENCE },
];

export const CDX_COLUMNS = [
  { name: LEVEL },
  { name: GENE },
  { name: CANCER_TYPE },
  { name: DRUG },
  { name: PREVIOUS_BIOMARKER_ASSOCIATION },
  { name: CURRENT_BIOMARKER_ASSOCIATION },
  { name: EVIDENCE },
];
export const NEWLY_ADDED_LEVEL_FOUR = [
  ['ATM', 'Oncogenic Mutations', 'Prostate Cancer', 'Olaparib'],
  [
    'BRAF',
    'D287H, D594A, D594G, D594H, D594N, F595L, G464E, G464V, G466A, G466E, G466V, G469A, G469E, G469R, G469V, G596D, G596R, K601N, K601T, L597Q, L597V, N581I, N581S, S467L, V459L',
    'All Tumors',
    'PLX8394',
  ],
  [
    'CDKN2A',
    'Oncogenic Mutations',
    'All Tumors',
    'Abemaciclib, Palbociclib, Ribociclib',
  ],
  ['EGFR', 'A289V, R108K, T263P', 'Glioma', 'Lapatinib'],
  ['EGFR', 'Amplification', 'Glioma', 'Lapatinib'],
  ['EWSR1', 'EWSR1-FLI1 Fusion', 'Ewing Sarcoma', 'TK216'],
  [
    'FGFR1',
    'Oncogenic Mutations',
    'All Tumors',
    'AZD4547, BGJ398, Debio1347, Erdafitinib',
  ],
  [
    'FGFR2',
    'Oncogenic Mutations',
    'All Tumors',
    'AZD4547, BGJ398, Debio1347, Erdafitinib',
  ],
  [
    'KRAS',
    'Oncogenic Mutations',
    'All Tumors',
    'KO-947, LY3214996, Ravoxertinib, Ulixertinib',
  ],
  ['MTOR', 'Oncogenic Mutations', 'All Tumors', 'Everolimus, Temsirolimus'],
  ['NF1', 'Oncogenic Mutations', 'All Tumors', 'Cobimetinib, Trametinib'],
  ['PTEN', 'Oncogenic Mutations', 'All Tumors', 'AZD8186, GSK2636771'],
  ['SMARCB1', 'Oncogenic Mutations', 'All Tumors', 'Tazemetostat'],
];

const EVIDENCE_COLUMN_SEPARATOR = '; ';

// NOTE: cannot associate a type to the object literal in order to have the CHANGED_ANNOTATION_DATE type works
// https://stackoverflow.com/questions/41947168/is-it-possible-to-use-keyof-operator-on-literals-instead-of-interfaces

export const NEWS_BY_DATE: { [date: string]: NewsData } = {
  '02272025': {
    rawComponent: <NewsContent022025 />,
  },
  '01302025': {
    priorityNews: [
      <span>
        Happy New Year! As of January 30th, 2025, fifteen Level 1, twelve Level
        2, eighteen Level 3 and eleven Level 4 treatments for unique
        biomarker-selected indications were added to OncoKB. A table summarizing
        these changes can be found here{' '}
        <YearEndReviewPageLink year={'2024'}>here</YearEndReviewPageLink>. The
        “Precision Oncology: 2024 in Review” article can be found{' '}
        <Linkout
          link={
            'https://aacrjournals.org/cancerdiscovery/article/14/12/2332/750142/Precision-Oncology-2024-in-ReviewPrecision'
          }
        >
          here
        </Linkout>
        .
      </span>,
    ],
    changedAnnotations: [
      {
        columnHeaderType: AnnotationColumnHeaderType.NEW_ALTERATION_WITH_LEVEL,
        content: [
          [
            '2',
            'ERBB2',
            'Oncogenic Mutations',
            'Cervical Cancer',
            'Neratinib',
            [
              <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
                <span>
                  Inclusion in Cervical Cancer NCCN Guidelines V1.2025
                </span>
                <PMIDLink pmids="38211393" />
              </WithSeparator>,
            ],
          ],
        ],
      },
      {
        columnHeaderType:
          AnnotationColumnHeaderType.PROMOTION_TUMOR_TYPE_SPECIFIC_EVIDENCE,
        content: [
          [
            'KRAS',
            'G12C',
            'Small Bowel Cancer',
            <div>
              <div style={{ fontStyle: 'italic' }}>
                {DRUGS_PROMOTED_IN_ONCOKB}:
              </div>
              <div>Adagrasib (Level 2, previously Level 3A)</div>
              <br></br>
              <div style={{ fontStyle: 'italic' }}>
                {DRUGS_ADDED_TO_ONCOKB}:
              </div>
              <div>Sotorasib (Level 2)</div>
            </div>,
            '3A',
            '2',
            <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
              <span>
                Inclusion in Small Bowel Adenocarcinoma NCCN Guidelines V1.2025
              </span>
              <PMIDLink pmids="32955176, 37099736, 36546659, 34919824" />
            </WithSeparator>,
          ],
        ],
      },
      {
        columnHeaderType: AnnotationColumnHeaderType.UPDATED_SAME_LEVEL_DRUG,
        content: [
          [
            '1',
            'ALK',
            <WithSeparator separator={', '}>
              <AlterationPageLink hugoSymbol="ALK" alteration="Fusions">
                Fusions
              </AlterationPageLink>
            </WithSeparator>,
            'Non-Small Cell Lung Cancer',
            <div>
              <div>
                Alectinib, Brigatinib, Certinib, Crizotinib, Lorlatinib (Level
                1)
              </div>
              <br />
              <div>NVL-655 (Level 3A)</div>
            </div>,
            'Ensartinib (Level 1)',
            <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
              <FdaApprovalLink
                approval="ensartinib"
                link="https://www.fda.gov/drugs/resources-information-approved-drugs/fda-approves-ensartinib-alk-positive-locally-advanced-or-metastatic-non-small-cell-lung-cancer"
              />
              <PMIDLink pmids="34473194" />
            </WithSeparator>,
          ],
          [
            '1',
            'KRAS',
            <WithSeparator separator={', '}>
              <AlterationPageLink hugoSymbol="KRAS" alteration="G12C">
                G12C
              </AlterationPageLink>
            </WithSeparator>,
            'Colorectal Cancer',
            <div>
              <div style={{ textDecoration: 'underline' }}>Sensitivity</div>
              <div>Adagrasib + Cetuximab (Level 1)</div>
              <br />
              <div>
                Adagrasib + Panitumumab, Sotorasib + Cetuximab, Sotorasib +
                Panitumumab (Level 2)
              </div>
              <br />
              <div>Binimetinib, Cobimetinib, Trametinib (Level 4)</div>
              <br />
              <div style={{ textDecoration: 'underline' }}>Resistance</div>
              <div>
                Cetuximab, Panitumumab, Tucatinib + Trastuzumab (Level R1)
              </div>
            </div>,
            'Sotorasib + Panitumumab (Level 1)',
            <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
              <FdaApprovalLink
                approval="sotorasib with panitumumab"
                link="https://www.fda.gov/drugs/resources-information-approved-drugs/fda-approves-sotorasib-panitumumab-kras-g12c-mutated-colorectal-cancer"
              />
              <PMIDLink pmids="37870968" />
            </WithSeparator>,
          ],
        ],
      },
    ],
    newlyAddedGenes: ['AKT1S1', 'ALOX15B'],
  },
  '12192024': {
    priorityNews: [
      <span>
        Update to our{' '}
        <Link to={PAGE_ROUTE.ONCOLOGY_TX}>FDA-Approved Oncology Therapies</Link>{' '}
        page
      </span>,
    ],
    changedAnnotations: [
      {
        columnHeaderType:
          AnnotationColumnHeaderType.PROMOTION_TUMOR_TYPE_SPECIFIC_EVIDENCE,
        title:
          'Updated therapeutic implications - Promotion of tumor type-specific level of evidence for an alteration',
        content: [
          [
            'NRG1',
            'Fusions',
            'Non-Small Cell Lung Cancer',
            <div>
              <div style={{ fontStyle: 'italic' }}>
                {DRUGS_PROMOTED_IN_ONCOKB}:
              </div>
              <div>Zenocutuzumab</div>
              <br></br>
              <div style={{ fontStyle: 'italic' }}>
                {DRUGS_REMAINING_IN_ONCOKB}:
              </div>
              <div>Seribantumab (Level 3A)</div>
            </div>,
            '3A',
            '1',
            <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
              <FdaApprovalLink
                approval="zenocutuzumab"
                link="https://www.fda.gov/drugs/resources-information-approved-drugs/fda-grants-accelerated-approval-zenocutuzumab-zbco-non-small-cell-lung-cancer-and-pancreatic"
              />
              <AbstractLink
                abstract="Schram, A. et al. Abstract# 1618P, Annals of Oncol. 2023"
                link="https://www.annalsofoncology.org/article/S0923-7534(23)03404-X/fulltext"
              />
            </WithSeparator>,
          ],
          [
            'NRG1',
            'Fusions',
            'Pancreatic Adenocarcinoma',
            'Zenocutuzumab',
            '3A',
            '1',
            <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
              <FdaApprovalLink
                approval="zenocutuzumab"
                link="https://www.fda.gov/drugs/resources-information-approved-drugs/fda-grants-accelerated-approval-zenocutuzumab-zbco-non-small-cell-lung-cancer-and-pancreatic"
              />
              <AbstractLink
                abstract="Schram, A. et al. Abstract# 1618P, Annals of Oncol. 2023"
                link="https://www.annalsofoncology.org/article/S0923-7534(23)03404-X/fulltext"
              />
            </WithSeparator>,
          ],
        ],
      },
      {
        columnHeaderType: AnnotationColumnHeaderType.UPDATED_SAME_LEVEL_DRUG,
        content: [
          [
            '2',
            'ERBB2',
            <WithSeparator separator={', '}>
              <AlterationPageLink hugoSymbol="ERBB2" alteration="Amplification">
                Amplification
              </AlterationPageLink>
            </WithSeparator>,
            'Biliary Tract Cancer',
            'Trastuzumab + Pertuzumab, Tucatinib + Trastuzumab (Level 2)',
            'Zanidatamab (Level 3A)',
            <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
              <FdaApprovalLink
                approval="zanidatamab"
                for="HER2+ (IHC 3+) biliary tract cancer"
                link="https://www.fda.gov/drugs/resources-information-approved-drugs/fda-grants-accelerated-approval-zanidatamab-hrii-previously-treated-unresectable-or-metastatic-her2"
              />
              <PMIDLink pmids="37276871" />
            </WithSeparator>,
          ],
        ],
      },
    ],
    newlyAddedGenes: ['AIP', 'CASR', 'GEN1'],
  },
  '11262024': {
    changedAnnotations: [
      {
        columnHeaderType: AnnotationColumnHeaderType.NEW_ALTERATION_WITH_LEVEL,
        content: [
          [
            '1',
            'KMT2A',
            'Fusions',
            'Mixed Phenotype Acute Leukemia',
            'Revumenib',
            [
              <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
                <FdaApprovalLink
                  approval="revumenib"
                  link="https://www.fda.gov/drugs/resources-information-approved-drugs/fda-approves-revumenib-relapsed-or-refractory-acute-leukemia-kmt2a-translocation?"
                />
                <PMIDLink pmids="39121437 " />
              </WithSeparator>,
            ],
          ],
        ],
      },
      {
        columnHeaderType:
          AnnotationColumnHeaderType.ADDITIONAL_SENSITIVITY_LEVEL_DRUG,
        content: [
          [
            'NTRK1',
            'G595R',
            'All Solid Tumors',
            'Larotrectinib (Level R1), Entrectinib (Level R2)',
            <div>
              <div>Selitrectinib (Level 3A)</div>
              <br />
              <div>Zurletrectinib (Level 4)</div>
            </div>,
            '3A',
            'R1',
            <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
              <PMIDLink pmids="32133433, 33004339, 28578312, 38902532, 34625502" />
            </WithSeparator>,
          ],
          [
            'NTRK3',
            'G623R',
            'All Solid Tumors',
            'Larotrectinib (Level R1)',
            <div>
              <div>Selitrectinib (Level 3A)</div>
              <br />
              <div>Zurletrectinib (Level 4)</div>
            </div>,
            '3A',
            'R1',
            <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
              <PMIDLink pmids="28578312, 34030125, 37262390, 38902532, 34625502" />
            </WithSeparator>,
          ],
        ],
      },
      {
        useOneLineRowClass: false,
        title:
          'Updated therapeutic implications - Promotion of tumor type-specific level of evidence for an alteration(s)',
        headers: CHANGED_ANNOTATION_LEVEL_WITH_EVIDENCE_COLUMNS,
        content: [
          [
            'KMT2A',
            'Fusions',
            'Acute Myeloid Leukemia, B-cell Lymphoblastic Leukemia/Lymphoma',
            'Revumenib (Level 3A)',
            '3A',
            '1',
            <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
              <FdaApprovalLink
                approval="revumenib"
                link="https://www.fda.gov/drugs/resources-information-approved-drugs/fda-approves-revumenib-relapsed-or-refractory-acute-leukemia-kmt2a-translocation?"
              />
              <PMIDLink pmids="39121437" />
            </WithSeparator>,
          ],
        ],
      },
      {
        columnHeaderType: AnnotationColumnHeaderType.UPDATED_SAME_LEVEL_DRUG,
        content: [
          [
            '1',
            <WithSeparator separator={', '}>
              {getAlternativeGenePageLinks('NTRK1/2/3')}
            </WithSeparator>,
            <WithSeparator separator={', '}>
              <AlterationPageLink hugoSymbol="NTRK1" alteration="Fusions">
                Fusions
              </AlterationPageLink>
            </WithSeparator>,
            'All Solid Tumors',
            'Entrectinib, Larotrectinib, Repotrectinib (Level 1)',
            'Zurletrectinib (Level 4)',
            <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
              <PMIDLink pmids="38902532" />
            </WithSeparator>,
          ],
        ],
      },
      {
        columnHeaderType:
          AnnotationColumnHeaderType.DRUG_REMOVAL_SAME_HIGHEST_LEVEL,
        content: [
          [
            'PIK3CA',
            'H1047R',
            'All Solid Tumors',
            '4',
            'LOXO-783, LOXO-783 + Aromatase Inhibition Therapy + Abemaciclib, LOXO-783 + Fulvestrant, LOXO-783 + Fulvestrant + Abemaciclib, LOXO-783 + LY3484356, LOXO-783 + LY3484356 + Abemaciclib, LOXO-783 + Paclitaxel (Level 4)',
            'RLY-2608, RLY-2608 + Fulvestrant (Level 4)',
            <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
              <Linkout link="https://www.oncologypipeline.com/apexonco/lilly-down-not-out-pi3k-alpha-inhibition">
                Discontinuation of LOXO-783 development
              </Linkout>
            </WithSeparator>,
          ],
        ],
      },
    ],
    newlyAddedGenes: ['ADGRG4', 'AFDN', 'AGGF1', 'MAGI2', 'PRKCB', 'ZNF292'],
  },
  '10242024': {
    priorityNews: [
      <span>
        Update to our{' '}
        <Link to={PAGE_ROUTE.CDX}>
          FDA Cleared or Approved Companion Diagnostic Devices
        </Link>{' '}
        (CDx) page
      </span>,
      <span>
        Update to our{' '}
        <Link to={PAGE_ROUTE.ONCOLOGY_TX}>FDA-Approved Oncology Therapies</Link>{' '}
        page
      </span>,
    ],
    changedAnnotations: [
      {
        columnHeaderType: AnnotationColumnHeaderType.NEW_ALTERATION_WITH_LEVEL,
        content: [
          [
            ['3A', 'R2'],
            'ROS1',
            <WithSeparator separator={', '}>
              {getAlternativeAllelesPageLinks('ROS1', 'G2032R')}
            </WithSeparator>,
            'Non-Small Cell Lung Cancer',

            ['Taletrectinib', 'Crizotinib, Lorlatinib'],
            [
              <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
                <PMIDLink pmids="38822758, 31399568" />
              </WithSeparator>,
              <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
                <PMIDLink
                  wrapText
                  pmids="33685866, 29333528, 23724914, 36135089, 36135089, 32918045"
                />
              </WithSeparator>,
            ],
          ],
          [
            ['3A', 'R2'],
            'ROS1',
            <WithSeparator separator={', '}>
              {getAlternativeAllelesPageLinks('ROS1', 'L2086F')}
            </WithSeparator>,
            'Non-Small Cell Lung Cancer',
            ['Cabozantinib', 'Lorlatinib, Repotrectinib'],
            [
              <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
                <PMIDLink pmids="33685866, 37291202, 39117775, 39091594" />
              </WithSeparator>,
              <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
                <PMIDLink pmids="37291202, 33685866, 39091594" />
              </WithSeparator>,
            ],
          ],
          [
            '3A',
            'SMARCA4',
            'Oncogenic Mutations',
            'Non-Small Cell Lung Cancer, Esophageal Adenocarcinoma',
            'PRT3789',
            <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
              <AbstractLink
                abstract="Guo, R. et al., Abstract# 603O, ESMO 2024"
                link="https://www.annalsofoncology.org/article/S0923-7534(24)02189-6/fulltext"
              />
              <AbstractLink
                abstract="Hulse, M. et al., Abstract# 3263, AACR 2022"
                link="https://aacrjournals.org/cancerres/article/82/12_Supplement/3263/703325/Abstract-3263-Preclinical-characterization-of"
              />
            </WithSeparator>,
          ],
        ],
      },
      {
        useOneLineRowClass: false,
        title:
          'Updated therapeutic implications - Promotion of tumor type-specific level of evidence for an alteration(s)',
        headers: CHANGED_ANNOTATION_LEVEL_WITH_EVIDENCE_COLUMNS,
        content: [
          [
            'PIK3CA',
            <>
              <AlterationPageLink
                hugoSymbol="PIK3CA"
                alteration="Oncogenic Mutations"
              />{' '}
              <span>
                (excluding R88Q, N345K, C420R, E542K, E545A/D/G/K/Q,
                Q546E/K/R/P, M1043V/I, H1047Y/R/L, G1049R which are already
                Level 1)
              </span>
            </>,
            'Breast Cancer',
            <div>
              <div style={{ fontStyle: 'italic' }}>
                {DRUGS_REMAINING_IN_ONCOKB}:
              </div>
              <div>
                Alpelisib + Fulvestrant, Capivasertib + Fulvestrant (Level 2)
              </div>
              <br></br>
              <div>Inavolisib + Palbociclib + Fulvestrant (Level 3A)</div>
              <br></br>
              <div style={{ fontStyle: 'italic' }}>
                {DRUGS_PROMOTED_IN_ONCOKB}:
              </div>
              <div>Inavolisib + Palbociclib + Fulvestrant (Level 1)</div>
            </div>,
            '2',
            '1',
            <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
              <FdaApprovalLink
                approval="Inavolisib + Palbociclib + Fulvestrant"
                link="https://www.fda.gov/drugs/resources-information-approved-drugs/fda-approves-inavolisib-palbociclib-and-fulvestrant-endocrine-resistant-pik3ca-mutated-hr-positive"
              />
              <AbstractLink
                abstract="Jhaveri, K. et al., Abstract# GS03-13, SABCS 2023"
                link="https://medically.gene.com/global/en/unrestricted/oncology/SABCS-2023/sabcs-2023-presentation-jhaveri-inavolisib-or-placebo-i.html"
              />
            </WithSeparator>,
          ],
        ],
      },
      {
        columnHeaderType: AnnotationColumnHeaderType.UPDATED_SAME_LEVEL_DRUG,
        content: [
          [
            '1',
            'EGFR',
            <>
              <AlterationPageLink
                hugoSymbol="EGFR"
                alteration={'Exon 19 in-frame deletions'}
              />
              , <AlterationPageLink hugoSymbol="EGFR" alteration={'L858R'} />
            </>,
            'Non-Small Cell Lung Cancer',
            <>
              <div>
                Afatinib, Dacomitinib, Erlotinib, Erlotinib + Ramucirumab,
                Gefitinib, Osimertinib, Osimertinib + Chemotherapy, Amivantamab
                + Lazertinib (Level 1)
              </div>
              <br></br>
              <div>Amivantamab + Chemotherapy (Level 2)</div>
              <br></br>
              <div>Patritumab Deruxtecan (Level 3A)</div>
            </>,

            'Amivantamab + Chemotherapy (Level 1)',
            <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
              <FdaApprovalLink
                approval="Amivantamab with Chemotherapy"
                link="https://www.fda.gov/drugs/resources-information-approved-drugs/fda-approves-amivantamab-vmjw-carboplatin-and-pemetrexed-non-small-cell-lung-cancer-egfr-exon-19"
              />
              <PMIDLink pmids="37879444" />
            </WithSeparator>,
          ],
          [
            '1',
            'PIK3CA',
            <WithSeparator separator={', '}>
              {getAlternativeAllelesPageLinks('PIK3CA', 'R88Q')}
              {getAlternativeAllelesPageLinks('PIK3CA', 'N345K')}
              {getAlternativeAllelesPageLinks('PIK3CA', 'C420R')}
              {getAlternativeAllelesPageLinks('PIK3CA', 'E542K')}
              {getAlternativeAllelesPageLinks('PIK3CA', 'E545A/D/G/K/Q')}
              {getAlternativeAllelesPageLinks('PIK3CA', 'Q546E/K/R/P')}
              {getAlternativeAllelesPageLinks('PIK3CA', 'M1043V/I')}
              {getAlternativeAllelesPageLinks('PIK3CA', 'H1047Y/R/L')}
              {getAlternativeAllelesPageLinks('PIK3CA', 'G1049R')}
            </WithSeparator>,
            'Breast Cancer',
            <>
              <div>Capivasertib + Fulvestrant (Level 1)</div>
              <br></br>
              <div>
                Alpelisib + Fulvestrant (Level 1 for PIK3CA C420R, E542K,
                E545A/D/G/K, H1047Y/R/L, Q546E/R only)
              </div>
            </>,
            'Inavolisib + Palbociclib + Fulvestrant (Level 1; Promoted from Level 3A)',
            <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
              <FdaApprovalLink
                approval="Inavolisib with Palbociclib + Fulvestrant"
                link="https://www.fda.gov/drugs/resources-information-approved-drugs/fda-approves-inavolisib-palbociclib-and-fulvestrant-endocrine-resistant-pik3ca-mutated-hr-positive"
              />
              <AbstractLink
                abstract="Jhaveri, K. et al., Abstract# GS03-13, SABCS 2023"
                link="https://medically.gene.com/global/en/unrestricted/oncology/SABCS-2023/sabcs-2023-presentation-jhaveri-inavolisib-or-placebo-i.html"
              />
            </WithSeparator>,
          ],
          [
            '1',
            'ALK',
            'Fusions',
            'Non-Small Cell Lung Cancer',
            'Alectinib, Brigatinib, Certinib, Crizotinib, Lorlatinib (Level 1)',
            'NVL-655 (Level 3A)',
            <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
              <PMIDLink pmids="39269178" />
              <AbstractLink
                abstract="Drilon, A. et al., Abstract# 1253O, ESMO 2024 "
                link="https://www.annalsofoncology.org/article/S0923-7534(24)02829-1/fulltext"
              />
            </WithSeparator>,
          ],
          [
            '1',
            'ROS1',
            'Fusions',
            'Non-Small Cell Lung Cancer',
            <>
              <div>Crizotinib, Entrectinib, Repotrectinib (Level 1)</div>
              <br></br>
              <div>Ceritinib, Lorlatinib (Level 2)</div>
            </>,
            'Taletrectinib (Level 3A)',
            <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
              <PMIDLink pmids="38822758, 36877099, 31399568" />
            </WithSeparator>,
          ],
          [
            '2',
            'ALK',
            'G1202R',
            'Non-Small Cell Lung Cancer',
            'Lorlatinib (Level 2)',
            'NVL-655 (Level 3A)',
            <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
              <PMIDLink pmids="39269178" />
              <AbstractLink
                abstract="Drilon, A. et al., Abstract# 1253O, ESMO 2024"
                link="https://www.annalsofoncology.org/article/S0923-7534(24)02829-1/fulltext"
              />
            </WithSeparator>,
          ],
          [
            '3A',
            'KRAS',
            'G12D',
            'Non-Small Cell Lung Cancer, Pancreatic Adenocarcinoma',
            'RMC-6236 (Level 3A)',
            'ASP3082 (Level 3A; Promoted from Level 4)',
            <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
              <AbstractLink
                abstract="Park, W. et al., Abstract# 608O, ESMO 2024"
                link="https://www.annalsofoncology.org/article/S0923-7534(24)02194-X/fulltext"
              />
              <AbstractLink
                abstract="Nagashima, T. et al., Abstract# 5735, AACR 2023"
                link="https://aacrjournals.org/cancerres/article/83/7_Supplement/5735/722276"
              />
            </WithSeparator>,
          ],
        ],
      },
    ],
    newlyAddedGenes: ['ADARB2', 'BUB1B', 'CCN6', 'CDKN1C', 'EGR2'],
  },
  '09252024': {
    changedAnnotations: [
      {
        columnHeaderType: AnnotationColumnHeaderType.NEW_ALTERATION_WITH_LEVEL,
        content: [
          [
            '3A',
            'ALK',
            <WithSeparator separator={', '}>
              {getAlternativeAllelesPageLinks('ALK', 'F1174L/C')}
              {getAlternativeAllelesPageLinks('ALK', 'F1245Y/V')}
              {getAlternativeAllelesPageLinks('ALK', 'R1275Q/L')}
            </WithSeparator>,
            'Neuroblastoma',
            'Lorlatinib',
            <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
              <PMIDLink pmids="37012551, 26554404, 38032104, 27483357" />
            </WithSeparator>,
          ],
          [
            '3A',
            'MET',
            <WithSeparator separator={', '}>
              {getAlternativeAllelesPageLinks('MET', 'H1094Y')}
              {getAlternativeAllelesPageLinks('MET', 'F1200I')}
            </WithSeparator>,
            'Non-Small Cell Lung Cancer',
            'Elzovantinib',
            <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
              <PMIDLink pmids="38564707" />
            </WithSeparator>,
          ],
          [
            '4',
            'MET',
            <WithSeparator separator={', '}>
              {getAlternativeAllelesPageLinks('MET', 'N1100S')}
              {getAlternativeAllelesPageLinks('MET', 'V1092I')}
              {getAlternativeAllelesPageLinks('MET', 'H1106D')}
              {getAlternativeAllelesPageLinks('MET', 'R1170Q')}
              {getAlternativeAllelesPageLinks('MET', 'M1250T')}
            </WithSeparator>,
            'Non-Small Cell Lung Cancer',
            'Elzovantinib, Capmatinib, Tepotinib',
            <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
              <PMIDLink pmids="38564707" />
            </WithSeparator>,
          ],
        ],
      },
      {
        columnHeaderType: AnnotationColumnHeaderType.UPDATED_SAME_LEVEL_DRUG,
        content: [
          [
            '1',
            'EGFR',
            'Exon 19 in-frame deletions, L858R',
            'Non-Small Cell Lung Cancer',
            'Afatinib, Dacomitinib, Erlotinib, Erlotinib + Ramucirumab, Gefitinib, Osimertinib, Osimertinib + Chemotherapy (Level 1); Amivantamab + Chemotherapy (Level 2); Amivantamab + Lazertinib, Patritumab Deruxtecan (Level 3A)',
            'Amivantamab + Lazertinib (Level 1; Promoted from Level 3A)',
            <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
              <FdaApprovalLink
                approval="Amivantamab + Lazertinib"
                link="https://www.fda.gov/drugs/resources-information-approved-drugs/fda-approves-lazertinib-amivantamab-vmjw-non-small-lung-cancer"
              />
              <PMIDLink pmids="38924756" />
            </WithSeparator>,
          ],
        ],
      },
    ],
    newlyAddedGenes: [
      'ABCB1',
      'ACVR2A',
      'ADGRA2',
      'BCL2L2',
      'ELL2',
      'FANCI',
      'USP1',
      'XPA',
    ],
  },
  '08152024': {
    changedAnnotations: [
      {
        columnHeaderType: AnnotationColumnHeaderType.NEW_ALTERATION_WITH_LEVEL,
        content: [
          [
            '3A',
            'FBXW7',
            'Oncogenic Mutations',
            'Endometrial Cancer, Ovarian Cancer',
            'Lunresertib + Camonsertib',
            <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
              <PMIDLink pmids="38410486" />
              <AbstractLink
                abstract="Yap, T. et al., Abstract# 35396. AACR-NCI-EORTC 2023"
                link="https://ir.reparerx.com/static-files/c46f541b-554a-4690-90de-e63fa7dea852"
              />
              <AbstractLink
                abstract="Gallo, D. et al., Abstract# B057, AACR 2023"
                link="https://aacrjournals.org/mct/article/22/12_Supplement/B057/730329/Abstract-B057-Preclinical-development-of-PKMYT1"
              />
              <AbstractLink
                abstract="Yap, T. et al., Abstract# B156, AACR-NCI-EORTC 2023"
                link="https://www.reparerx.com/wp-content/uploads/2023/10/ANE_B156_MYTHIC-clinical_poster.pdf"
              />
              <Linkout link="https://www.onclive.com/view/lunresertib-camonsertib-gets-fast-tracked-by-fda-for-ccne1-or-fbxw7-ppp2r1a-ovarian-cancer">
                FDA fast track designation
              </Linkout>
            </WithSeparator>,
          ],
          [
            '3A',
            'PPP2R1A',
            'Oncogenic Mutations',
            'Endometrial Cancer, Ovarian Cancer',
            'Lunresertib + Camonsertib',
            <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
              <AbstractLink
                abstract="Yap, T. et al., Abstract# 35396. AACR-NCI-EORTC 2023"
                link="https://ir.reparerx.com/static-files/c46f541b-554a-4690-90de-e63fa7dea852"
              />
              <Linkout link="https://www.onclive.com/view/lunresertib-camonsertib-gets-fast-tracked-by-fda-for-ccne1-or-fbxw7-ppp2r1a-ovarian-cancer">
                FDA fast track designation
              </Linkout>
            </WithSeparator>,
          ],
          [
            '4',
            'FBXW7',
            'Oncogenic Mutations',
            'All Solid Tumors',
            'Lunresertib + Camonsertib',
            <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
              <PMIDLink pmids="38410486" />
              <AbstractLink
                abstract="Yap, T. et al., Abstract# 35396. AACR-NCI-EORTC 2023"
                link="https://ir.reparerx.com/static-files/c46f541b-554a-4690-90de-e63fa7dea852"
              />
              <AbstractLink
                abstract="Gallo, D. et al., Abstract# B057, AACR 2023"
                link="https://aacrjournals.org/mct/article/22/12_Supplement/B057/730329/Abstract-B057-Preclinical-development-of-PKMYT1"
              />
              <AbstractLink
                abstract="Yap, T. et al., Abstract# B156, AACR-NCI-EORTC 2023"
                link="https://www.reparerx.com/wp-content/uploads/2023/10/ANE_B156_MYTHIC-clinical_poster.pdf"
              />
            </WithSeparator>,
          ],
          [
            '4',
            'PPP2R1A',
            'Oncogenic Mutations',
            'All Solid Tumors',
            'Lunresertib + Camonsertib',
            <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
              <AbstractLink
                abstract="Yap, T. et al., Abstract# 35396. AACR-NCI-EORTC 2023"
                link="https://ir.reparerx.com/static-files/c46f541b-554a-4690-90de-e63fa7dea852"
              />
            </WithSeparator>,
          ],
        ],
      },
      {
        useOneLineRowClass: false,
        title:
          'Updated therapeutic implications - Promotion of tumor type-specific level of evidence for an alteration(s)',
        headers: CHANGED_ANNOTATION_LEVEL_WITH_EVIDENCE_COLUMNS,
        content: [
          [
            'IDH1',
            <span>
              {getAlternativeAllelesPageLinks('IDH1', 'R132C/H/G/S/L')}
            </span>,
            'Oligodendroglioma',
            <div>
              <div style={{ fontStyle: 'italic' }}>
                {DRUGS_REMAINING_IN_ONCOKB}:
              </div>
              <div>Ivosidenib (Level 2)</div>
              <br></br>
              <div style={{ fontStyle: 'italic' }}>
                {DRUGS_ADDED_TO_ONCOKB}:
              </div>
              <div>Vorasidenib (Level 1)</div>
            </div>,
            '2',
            '1',
            <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
              <FdaApprovalLink
                approval="Vorasidenib"
                link="https://www.fda.gov/drugs/resources-information-approved-drugs/fda-approves-vorasidenib-grade-2-astrocytoma-or-oligodendroglioma-susceptible-idh1-or-idh2-mutation?utm_medium=email&utm_source=govdelivery"
              />
              <PMIDLink pmids="37272516" />
            </WithSeparator>,
          ],
          [
            'IDH1',
            <span>
              {getAlternativeAllelesPageLinks('IDH1', 'R132C/H/G/S/L')}
            </span>,
            'Astrocytoma',
            <div>
              <div style={{ fontStyle: 'italic' }}>
                {DRUGS_REMAINING_IN_ONCOKB}:
              </div>
              <div>Vorasidenib (Level 3A), Ivosidenib (Level 3A)</div>
              <br></br>
              <div style={{ fontStyle: 'italic' }}>
                {DRUGS_PROMOTED_IN_ONCOKB}:
              </div>
              <div>Vorasidenib (Level 1), Ivosidenib (Level 2)</div>
            </div>,
            '3A',
            '1',
            <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
              <FdaApprovalLink
                approval="Vorasidenib"
                link="https://www.fda.gov/drugs/resources-information-approved-drugs/fda-approves-vorasidenib-grade-2-astrocytoma-or-oligodendroglioma-susceptible-idh1-or-idh2-mutation?utm_medium=email&utm_source=govdelivery"
              />
              <span>
                Inclusion of Ivosidenib in NCCN Central Nervous System
                Guidelines V1.2024
              </span>
              <PMIDLink pmids="32530764, 37272516" />
            </WithSeparator>,
          ],
          [
            'IDH2',
            <span>
              {getAlternativeAllelesPageLinks('IDH2', 'R172K/M/W/S/G')}
            </span>,
            'Astrocytoma, Oligodendroglioma',
            'Vorasidenib',
            '3A',
            '1',
            <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
              <FdaApprovalLink
                approval="Vorasidenib"
                link="https://www.fda.gov/drugs/resources-information-approved-drugs/fda-approves-vorasidenib-grade-2-astrocytoma-or-oligodendroglioma-susceptible-idh1-or-idh2-mutation?utm_medium=email&utm_source=govdelivery"
              />
              <PMIDLink pmids="37272516" />
            </WithSeparator>,
          ],
          [
            'CCNE1',
            'Amplification',
            'Endometrial Cancer, Ovarian Cancer',
            <div>
              <div style={{ fontStyle: 'italic' }}>
                {DRUGS_REMAINING_IN_ONCOKB}:
              </div>
              <div>Lunresertib (Level 4), BLU-222 (Level 4)</div>
              <br></br>
              <div style={{ fontStyle: 'italic' }}>
                {DRUGS_ADDED_TO_ONCOKB}:
              </div>
              <div>Lunresertib + Camonsertib (Level 3A)</div>
            </div>,
            '4',
            '3A',
            <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
              <PMIDLink pmids="38410486" />
              <AbstractLink
                abstract="Yap, T. et al., Abstract# 35396. AACR-NCI-EORTC 2023"
                link="https://ir.reparerx.com/static-files/c46f541b-554a-4690-90de-e63fa7dea852"
              />
              <AbstractLink
                abstract="Gallo, D. et al., Abstract# B057, AACR 2023"
                link="https://aacrjournals.org/mct/article/22/12_Supplement/B057/730329/Abstract-B057-Preclinical-development-of-PKMYT1"
              />
              <Linkout link="https://www.onclive.com/view/lunresertib-camonsertib-gets-fast-tracked-by-fda-for-ccne1-or-fbxw7-ppp2r1a-ovarian-cancer">
                FDA fast track designation
              </Linkout>
            </WithSeparator>,
          ],
        ],
      },
      {
        title:
          'Updated therapeutic implications - Demotion of tumor type-specific level of evidence for an alteration',
        headers: UPDATED_ANNOTATION_LEVEL_COLUMNS,
        content: [
          [
            <WithSeparator separator={', '}>
              <GenePageLink hugoSymbol="SRSF2" />
              <GenePageLink hugoSymbol="ZRSR2" />
            </WithSeparator>,
            'Oncogenic Mutations',
            'Acute Myeloid Leukemia',
            'H3B-8800',
            '4',
            'No Level',
            <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
              <Linkout link="https://www.onclive.com/view/roivant-sciences-to-discontinue-rvt-2001-development-in-myelodysplastic-syndrome">
                Discontinuation of H3B-8800 development
              </Linkout>
              <span>Encore-MDS trial failed to meet primary endpoints</span>
              <PMIDLink pmids="34172893" />
            </WithSeparator>,
          ],
        ],
      },
      {
        useOneLineRowClass: false,
        headers: CHANGED_ANNOTATION_ADDITIONAL_DRUG_SAME_HIGHEST_LEVEL_COLUMNS,
        title: `Updated therapeutic implications - Addition of therapy(s) associated with a tumor type-specific leveled alteration(s) (without changing the alteration's highest level of evidence)`,
        content: [
          [
            'PIK3CA',
            <WithSeparator separator={', '}>
              <AlterationPageLink hugoSymbol="PIK3CA" alteration="R88Q" />
              <AlterationPageLink hugoSymbol="PIK3CA" alteration="N345K" />
              <AlterationPageLink hugoSymbol="PIK3CA" alteration="C420R" />
              <AlterationPageLink hugoSymbol="PIK3CA" alteration="E542K" />
              {getAlternativeAllelesPageLinks('PIK3CA', 'E545A/D/G/K/Q')}
              {getAlternativeAllelesPageLinks('PIK3CA', 'Q546E/K/R/P')}
              {getAlternativeAllelesPageLinks('PIK3CA', 'Q546E/K/R/P')}
              {getAlternativeAllelesPageLinks('PIK3CA', 'M1043V/I')}
              {getAlternativeAllelesPageLinks('PIK3CA', 'H1047Y/R/L')}
              <AlterationPageLink hugoSymbol="PIK3CA" alteration="G1049R" />
            </WithSeparator>,
            'Breast Cancer',
            '1',
            'Capivasertib + Fulvestrant (Level 1); Alpelisib + Fulvestrant (Level 1 for PIK3CA C420R, E542K, E545A/D/G/K, H1047Y/R/L, Q546E/R only)',
            'Inavolisib + Palbociclib + Fulvestrant (Level 3A)',
            <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
              <AbstractLink
                abstract="Jhaveri, K. et al., Abstract# GS03-13, SABCS 2023"
                link="https://medically.gene.com/global/en/unrestricted/oncology/SABCS-2023/sabcs-2023-presentation-jhaveri-inavolisib-or-placebo-i.html"
              />
              <Linkout link="https://www.onclive.com/view/inavolisib-receives-fda-breakthrough-therapy-designation-for-pik3ca-mutated-hr-her2-breast-cancer">
                FDA breakthrough therapy designation
              </Linkout>
            </WithSeparator>,
          ],
          [
            'PIK3CA',
            <>
              <AlterationPageLink
                hugoSymbol="PIK3CA"
                alteration={'Oncogenic Mutations'}
              />{' '}
              <span>(excluding Level 1 mutations listed above)</span>
            </>,
            'Breast Cancer',
            '2',
            'Alpelisib + Fulvestrant (Level 2); Capivasertib + Fulvestrant (Level 2)',
            'Inavolisib + Palbociclib + Fulvestrant (Level 3A)',
            <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
              <AbstractLink
                abstract="Jhaveri, K. et al., Abstract# GS03-13, SABCS 2023"
                link="https://medically.gene.com/global/en/unrestricted/oncology/SABCS-2023/sabcs-2023-presentation-jhaveri-inavolisib-or-placebo-i.html"
              />
              <Linkout link="https://www.onclive.com/view/inavolisib-receives-fda-breakthrough-therapy-designation-for-pik3ca-mutated-hr-her2-breast-cancer">
                FDA breakthrough therapy designation
              </Linkout>
            </WithSeparator>,
          ],
          [
            'CCNE1',
            'Amplification',
            'All Solid Tumors',
            '4',
            'Lunresertib, BLU-222 (Level 4)',
            'Lunresertib + Camonsertib (Level 4)',
            <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
              <PMIDLink pmids="38410486" />
              <AbstractLink
                abstract="Yap, T. et al., Abstract# 35396. AACR-NCI-EORTC 2023"
                link="https://ir.reparerx.com/static-files/c46f541b-554a-4690-90de-e63fa7dea852"
              />
              <AbstractLink
                abstract="Gallo, D. et al., Abstract# B057, AACR 2023"
                link="https://aacrjournals.org/mct/article/22/12_Supplement/B057/730329/Abstract-B057-Preclinical-development-of-PKMYT1"
              />
              <AbstractLink
                abstract="Yap, T. et al., Abstract# B156, AACR-NCI-EORTC 2023"
                link="https://www.reparerx.com/wp-content/uploads/2023/10/ANE_B156_MYTHIC-clinical_poster.pdf"
              />
            </WithSeparator>,
          ],
          [
            <WithSeparator separator={', '}>
              <GenePageLink hugoSymbol="SF3B1" />
              <GenePageLink hugoSymbol="U2AF1" />
            </WithSeparator>,
            'Oncogenic Mutations',
            'Acute Myeloid Leukemia',
            '4',
            <span>
              H3B-8800 (Level 4;{' '}
              <span style={{ fontWeight: 'bold' }}>Removed in this update</span>
              )
            </span>,
            'Emavusertib (Level 4)',
            <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
              <Linkout link="https://www.onclive.com/view/roivant-sciences-to-discontinue-rvt-2001-development-in-myelodysplastic-syndrome">
                Discontinuation of H3B-8800 development
              </Linkout>
              <span>Encore-MDS trial failed to meet primary endpoints</span>
              <PMIDLink pmids="34172893" />
              <AbstractLink
                abstract="Garcia-Manero, G. et al., Abstract# 7016, JCO, ASCO 2022"
                link="https://ascopubs.org/doi/10.1200/JCO.2022.40.16_suppl.7016"
              />
            </WithSeparator>,
          ],
          [
            <WithSeparator separator={', '}>
              <GenePageLink hugoSymbol="SF3B1" />
              <GenePageLink hugoSymbol="U2AF1" />
            </WithSeparator>,
            'Oncogenic Mutations',
            'Myelodysplastic Syndrome',
            '4',
            <span>
              H3B-8800 (Level 4;{' '}
              <span style={{ fontWeight: 'bold' }}>Removed in this update</span>
              )
            </span>,
            'Emavusertib, Ceralasertib (Level 4)',
            <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
              <Linkout link="https://www.onclive.com/view/roivant-sciences-to-discontinue-rvt-2001-development-in-myelodysplastic-syndrome">
                Discontinuation of H3B-8800 development
              </Linkout>
              <span>Encore-MDS trial failed to meet primary endpoints</span>
              <PMIDLink pmids="34172893" />
              <AbstractLink
                abstract="Garcia-Manero, G. et al., Abstract# 7016, JCO, ASCO 2022"
                link="https://ascopubs.org/doi/10.1200/JCO.2022.40.16_suppl.7016"
              />
              <AbstractLink
                abstract="Brunner, A. et al., Abstract# P758, HemaSphere, EHA 2022"
                link="https://journals.lww.com/hemasphere/fulltext/2022/06003/p758__inhibition_of_atr_with_ceralasertib.653.aspx"
              />
            </WithSeparator>,
          ],
          [
            <WithSeparator separator={', '}>
              <GenePageLink hugoSymbol="SRSF2" />
              <GenePageLink hugoSymbol="ZRSR2" />
            </WithSeparator>,
            'Oncogenic Mutations',
            'Myelodysplastic Syndrome',
            '4',
            <span>
              H3B-8800 (Level 4;{' '}
              <span style={{ fontWeight: 'bold' }}>Removed in this update</span>
              )
            </span>,
            'Ceralasertib (Level 4)',
            <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
              <Linkout link="https://www.onclive.com/view/roivant-sciences-to-discontinue-rvt-2001-development-in-myelodysplastic-syndrome">
                Discontinuation of H3B-8800 development
              </Linkout>
              <span>Encore-MDS trial failed to meet primary endpoints</span>
              <PMIDLink pmids="34172893" />
              <AbstractLink
                abstract="Brunner, A. et al., Abstract# P758, HemaSphere, EHA 2022"
                link="https://journals.lww.com/hemasphere/fulltext/2022/06003/p758__inhibition_of_atr_with_ceralasertib.653.aspx"
              />
            </WithSeparator>,
          ],
          [
            <WithSeparator separator={', '}>
              <GenePageLink hugoSymbol="SF3B1" />
              <GenePageLink hugoSymbol="U2AF1" />
              <GenePageLink hugoSymbol="SRSF2" />
              <GenePageLink hugoSymbol="ZRSR2" />
            </WithSeparator>,
            'Oncogenic Mutations',
            'Chronic Myelomonocytic Leukemia',
            '4',
            <span>
              H3B-8800 (Level 4;{' '}
              <span style={{ fontWeight: 'bold' }}>Removed in this update</span>
              )
            </span>,
            'Ceralasertib (Level 4)',
            <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
              <Linkout link="https://www.onclive.com/view/roivant-sciences-to-discontinue-rvt-2001-development-in-myelodysplastic-syndrome">
                Discontinuation of H3B-8800 development
              </Linkout>
              <span>Encore-MDS trial failed to meet primary endpoints</span>
              <PMIDLink pmids="34172893" />
              <AbstractLink
                abstract="Brunner, A. et al., Abstract# P758, HemaSphere, EHA 2022"
                link="https://journals.lww.com/hemasphere/fulltext/2022/06003/p758__inhibition_of_atr_with_ceralasertib.653.aspx"
              />
            </WithSeparator>,
          ],
        ],
      },
    ],
    newlyAddedGenes: ['CTDNEP1', 'SAMD9', 'SAMD9L', 'SMARCA1', 'USP6', 'WRN'],
  },
  '07042024': {
    news: [
      <span>
        We updated the level 2 association for actionable POLE and POLD1
        mutations in colorectal cancer and small bowel adenocarcinoma for
        immunotherapy to only include known oncogenic mutations in the
        exonuclease domain.
      </span>,
    ],
  },
  '07022024': {
    priorityNews: [
      <span>
        Release of{' '}
        <a
          href="https://sop.oncokb.org/?version=v4.1"
          target="_blank"
          rel="noopener noreferrer"
        >
          {ONCOKB_TM} SOP v4.1
        </a>
      </span>,
      <span>
        Updated HUGO symbol for gene SLC9A3R1 to{' '}
        <GenePageLink hugoSymbol="NHERF1" />
      </span>,
    ],
    changedAnnotations: [
      {
        columnHeaderType:
          AnnotationColumnHeaderType.PROMOTION_TUMOR_TYPE_SPECIFIC_EVIDENCE,
        content: [
          [
            'KRAS',
            'G12C',
            'Colorectal Cancer',
            <div>
              <div style={{ fontStyle: 'italic' }}>
                {DRUGS_REMAINING_IN_ONCOKB}:
              </div>
              <div style={{ textDecoration: 'underline' }}>Sensitivity</div>
              <div>
                Adagrasib + Cetuximab, Adagrasib + Panitumumab, Sotorasib +
                Cetuximab, Sotorasib + Panitumumab (Level 2)
              </div>
              <br></br>
              <div style={{ textDecoration: 'underline' }}>Resistance</div>
              <div>
                Tucatinib + Trastuzumab, Cetuximab, Panitumumab (Level R1)
              </div>
              <br></br>
              <div style={{ fontStyle: 'italic' }}>
                {DRUGS_PROMOTED_IN_ONCOKB}:
              </div>
              <div>Adagrasib + Cetuximab (Level 1)</div>
            </div>,
            '2',
            '1',
            <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
              <FdaApprovalLink
                approval="Adagrasib + Cetuximab"
                link="https://www.fda.gov/drugs/resources-information-approved-drugs/fda-grants-accelerated-approval-adagrasib-cetuximab-kras-g12c-mutated-colorectal-cancer"
              />
              <PMIDLink pmids="38587856" />
            </WithSeparator>,
          ],
          [
            'KRAS',
            'G12C',
            'Biliary Tract Cancer',
            'Adagrasib',
            '3A',
            '2',
            <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
              <span>
                Inclusion in NCCN Biliary Tract Cancer Guidelines V2.2024
              </span>
              <PMIDLink pmids="37099736" />
            </WithSeparator>,
          ],
        ],
      },
      {
        columnHeaderType: AnnotationColumnHeaderType.ADDITIONAL_SAME_LEVEL_DRUG,
        title: `Updated therapeutic implications - Addition of therapy(s) associated with a tumor type-specific leveled alteration(s) (without changing the alteration's highest level of evidence)`,
        content: [
          [
            'EGFR',
            'Exon 19 in-frame deletion, L858R',
            'Non-Small Cell Lung Cancer',
            '1',
            'Erlotinib, Afatinib, Gefitinib, Dacomitinib, Erlotinib + Ramucirumab, Osimertinib (Level 1); Patritumab Deruxtecan (Level 3A)',
            'Osimertinib + Chemotherapy (Level 1); Amivantamab + Chemotherapy (Level 2); Amivantamab + Lazertinib (Level 3A)',
            <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
              <FdaApprovalLink
                approval="Osimertinib with Chemotherapy"
                link="https://www.fda.gov/drugs/resources-information-approved-drugs/fda-approves-osimertinib-chemotherapy-egfr-mutated-non-small-cell-lung-cancer"
              />
              <span>
                Inclusion of Amivantamab + Chemotherapy in NCCN Non-Small Cell
                Lung Cancer Guidelines V5.2024
              </span>
              <PMIDLink
                pmids="37937763, 37710001, 37879444, 38924756"
                wrapText
              />
            </WithSeparator>,
          ],
          [
            'EGFR',
            'S768I, L861Q, G719X',
            'Non-Small Cell Lung Cancer',
            '1',
            'Afatinib (Level 1); Osimertinib (Level 2); Patritumab Deruxtecan (Level 3A)',
            'Erlotinib, Gefitinib, Dacomitinib, Amivantamab + Chemotherapy  (Level 2); Amivantamab + Lazertinib (Level 3A)',
            <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
              <span>
                Inclusion of Erlotinib, Gefitinib, Dacomitinib and Amivantamab +
                Chemotherapy in NCCN Non-Small Cell Lung Cancer Guidelines
                V5.2024
              </span>
              <PMIDLink pmids="37879444, 25668120, 35770100" wrapText />
              <AbstractLink
                abstract="Cho, B.C. et al., Abstract #8516, ASCO 2024"
                link="https://ascopubs.org/doi/pdf/10.1200/JCO.2024.42.16_suppl.8516"
              />
            </WithSeparator>,
          ],
          [
            'ERBB2',
            'Amplification',
            'Biliary Tract Cancer',
            '2',
            'Trastuzumab + Pertuzumab',
            'Tucatinib + Trastuzumab (Level 2)',
            <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
              <span>
                Inclusion in NCCN Biliary Tract Cancer Guidelines V2.2024
              </span>
              <PMIDLink pmids="37751561" />
            </WithSeparator>,
          ],
        ],
      },
      {
        columnHeaderType:
          AnnotationColumnHeaderType.DRUG_UPDATE_SAME_HIGHEST_LEVEL,
        content: [
          [
            '1',
            'NTRK1, NTRK2, NTRK3',
            'Fusions',
            'All Solid Tumors',
            'Larotrectinib, Entrectinib (Level 1); Repotrectinib (Level 3A)',
            'Repotrectinib (Level 1)',
            <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
              <FdaApprovalLink
                approval="Repotrectinib"
                link="https://www.fda.gov/drugs/resources-information-approved-drugs/fda-grants-accelerated-approval-repotrectinib-adult-and-pediatric-patients-ntrk-gene-fusion-positive"
              />{' '}
              <AbstractLink
                abstract="Solomon, B.J., et al., Abstract #1372P, Ann Oncol Vol 34, Suppl 2, 2023"
                link="https://www.annalsofoncology.org/article/S0923-7534(23)03242-8/fulltext"
              />
            </WithSeparator>,
          ],
        ],
      },
    ],
    newlyAddedGenes: ['LMNA', 'PRCC', 'UBA1', 'UBTF', 'RIOK2'],
  },
  '06042024': {
    priorityNews: [
      <span>
        Release of{' '}
        <a
          href="https://sop.oncokb.org/?version=v4.0"
          target="_blank"
          rel="noopener noreferrer"
        >
          {ONCOKB_TM} SOP v4.0
        </a>
      </span>,
    ],
    changedAnnotations: [
      {
        columnHeaderType: AnnotationColumnHeaderType.NEW_ALTERATION_WITH_LEVEL,
        content: [
          [
            '2',
            'POLE',
            <AlterationPageLink
              hugoSymbol="POLE"
              alteration={'Exonuclease Domain Missense Mutations'}
            >
              Exonuclease Domain Missense Mutations (268_471mis)
            </AlterationPageLink>,
            'Colorectal Cancer, Small Bowel Cancer',
            'Pembrolizumab, Nivolumab, Ipilimumab + Nivolumab, Dostarlimab',
            <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
              <span>
                Inclusion in Colon Cancer NCCN Guidelines V2.2024 and in Small
                Bowel Adenocarcinoma NCCN Guidelines V3.2024
              </span>
              <PMIDLink
                pmids="26028255, 31682550, 28734759, 37917058"
                wrapText
              />
              <AbstractLink
                abstract="Chae et al. Abstract# 3417, AACR 2020"
                link="https://aacrjournals.org/cancerres/article/80/16_Supplement/3417/642689/Abstract-3417-A-phase-II-basket-trial-of-dual-anti"
              />
            </WithSeparator>,
          ],
          [
            '2',
            'POLD1',
            <AlterationPageLink
              hugoSymbol="POLD1"
              alteration={'Exonuclease Domain Missense Mutations'}
            >
              Exonuclease Domain Missense Mutations (304_533mis)
            </AlterationPageLink>,
            'Colorectal Cancer, Small Bowel Cancer',
            'Pembrolizumab, Nivolumab, Ipilimumab + Nivolumab, Dostarlimab',
            <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
              <span>
                Inclusion in Colon Cancer NCCN Guidelines V2.2024 and in Small
                Bowel Adenocarcinoma NCCN Guidelines V3.2024
              </span>
              <PMIDLink
                pmids="26028255, 31682550, 28734759, 37917058"
                wrapText
              />
              <AbstractLink
                abstract="Chae et al. Abstract# 3417, AACR 2020"
                link="https://aacrjournals.org/cancerres/article/80/16_Supplement/3417/642689/Abstract-3417-A-phase-II-basket-trial-of-dual-anti"
              />
            </WithSeparator>,
          ],
          [
            '3A',
            'MTAP',
            'Deletion',
            'All Solid Tumors',
            'AMG193, MRTX1719',
            <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
              <PMIDLink pmids="37552839" />
              <AbstractLink
                abstract="Rodon, J. et al. Abstract# PR006, AACR-NCI-EORTC 2023"
                link="https://aacrjournals.org/mct/article/22/12_Supplement/PR006/730845/Abstract-PR006-Initial-results-from-first-in-human"
              />
            </WithSeparator>,
          ],
        ],
      },
      {
        columnHeaderType:
          AnnotationColumnHeaderType.ADDITIONAL_SENSITIVITY_LEVEL_DRUG,
        content: [
          [
            'ALK',
            'G1202R',
            'Non-Small Cell Lung Cancer',
            'Alectinib (Level R2)',
            'Lorlatinib (Level 2)',
            '2',
            'R2',
            <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
              <span>
                Inclusion in the NCCN Non-Small Cell Lung Cancer Guidelines
                V5.2024
              </span>
              <PMIDLink pmids="30892989" />
            </WithSeparator>,
          ],
          [
            'ALK',
            'L1196M',
            'Non-Small Cell Lung Cancer',
            'Crizotinib (Level R2)',
            'Lorlatinib (Level 2)',
            '2',
            'R2',
            <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
              <span>
                Inclusion in the NCCN Non-Small Cell Lung Cancer Guidelines
                V5.2024
              </span>
              <PMIDLink pmids="30892989" />
            </WithSeparator>,
          ],
        ],
      },
      {
        columnHeaderType: AnnotationColumnHeaderType.ADDITIONAL_SAME_LEVEL_DRUG,
        title: `Updated therapeutic implications - Addition of therapy(s) associated with a tumor type-specific leveled alteration(s) (without changing the alteration's highest level of evidence)`,
        content: [
          [
            'Other Biomarkers',
            'MSI-H',
            'Colorectal Cancer',
            '1',
            'Pembrolizumab, Nivolumab, Ipilimumab + Nivolumab',
            'Dostarlimab (Level 2)',
            <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
              <span>Inclusion in Colon Cancer NCCN Guidelines V2.2024</span>
              <PMIDLink pmids="37917058" />
            </WithSeparator>,
          ],
          [
            'Other Biomarkers',
            'MSI-H',
            'Small Bowel Cancer',
            '1',
            'Pembrolizumab',
            'Nivolumab, Ipilimumab + Nivolumab, Dostarlimab (Level 2)',
            <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
              <span>
                Inclusion in Small Bowel Adenocarcinoma NCCN Guidelines V3.2024
              </span>
              <PMIDLink pmids="328734759, 37917058" />
              <AbstractLink
                abstract="Chae et al. Abstract# 3417, AACR 2020"
                link="https://aacrjournals.org/cancerres/article/80/16_Supplement/3417/642689/Abstract-3417-A-phase-II-basket-trial-of-dual-anti"
              />
            </WithSeparator>,
          ],
          [
            'ALK',
            'G1202R',
            'Non-Small Cell Lung Cancer',
            'R2',
            'Alectinib',
            'Crizotinib, Ceritinib, Brigatinib (Level R2)',
            <PMIDLink
              pmids="31358542, 29935304, 27432227,
            24675041, 25727400,
            26698910, 31585938, 22277784"
              wrapText
            />,
          ],
        ],
      },
      {
        columnHeaderType:
          AnnotationColumnHeaderType.DRUG_REMOVAL_SAME_HIGHEST_LEVEL,
        content: [
          [
            'EGFR',
            'Exon 20 in-frame insertions',
            'Non-Small Cell Lung Cancer',
            '1',
            'Amivantamab, Amivantamab + Chemotherapy (Level 1); Poziotinib, CLN-081 (Level 3A)',
            'Mobocertinib (Level 1)',
            <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
              <Linkout link="https://www.onclive.com/view/takeda-to-voluntarily-withdraw-mobocertinib-for-egfr-exon-20-insertion-nsclc">
                Withdrawal of Mobocertinib
              </Linkout>
              <span>
                EXCLAIM-2 trial failed to meet primary endpoint of PFS
              </span>
              <AbstractLink
                abstract="Jänne, PA. et al. Abstract# 507O, Annals of Oncol. 2023"
                link="https://www.annalsofoncology.org/article/S0923-7534(23)04792-0/fulltext"
              />
            </WithSeparator>,
          ],
        ],
      },
    ],
    newlyAddedGenes: ['DDB2', 'FGF8', 'FGF9', 'GPC3', 'TOP2A'],
  },
  '05012024': {
    priorityNews: [
      <span>
        Release of the{' '}
        <Link to={PAGE_ROUTE.CDX}>
          "FDA Cleared or Approved Companion Diagnostic Devices"
        </Link>{' '}
        (CDx) page, which includes the companion diagnostics that are listed in
        the FDA-drug labels of {ONCOKB_TM} level 1 precision oncology drugs{' '}
      </span>,
      <span>
        We have updated our <Link to={PAGE_ROUTE.FAQ_ACCESS}>FAQ page</Link>{' '}
        with the most commonly asked questions of 2023. Take a look at what our
        users are asking us
      </span>,
    ],
    changedAnnotations: [
      {
        columnHeaderType:
          AnnotationColumnHeaderType.PROMOTION_TUMOR_TYPE_SPECIFIC_EVIDENCE,
        title:
          'Updated therapeutic implications - Promotion of tumor type-specific level of evidence for an alteration',
        content: [
          [
            'BRAF',
            'Fusions',
            'Low-Grade Giloma',
            'Tovorafenib',
            '3B',
            '1',
            <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
              <FdaApprovalLink
                link="https://www.fda.gov/drugs/resources-information-approved-drugs/fda-grants-accelerated-approval-tovorafenib-patients-relapsed-or-refractory-braf-altered-pediatric"
                approval="Tovorafenib"
              />
              <PMIDLink pmids="37978284" />
            </WithSeparator>,
          ],
          [
            'BRAF',
            <>
              <AlterationPageLink hugoSymbol="BRAF" alteration="V600" />{' '}
              (excluding V600E)
            </>,
            'Low-Grade Glioma',
            'Tovorafenib',
            '3B',
            '1',
            <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
              <FdaApprovalLink
                link="https://www.fda.gov/drugs/resources-information-approved-drugs/fda-grants-accelerated-approval-tovorafenib-patients-relapsed-or-refractory-braf-altered-pediatric"
                approval="Tovorafenib"
              />
              <PMIDLink pmids="37978284" />
            </WithSeparator>,
          ],
          [
            'ERBB2',
            'Amplification',
            'Salivary Gland Cancer',
            'Trastuzumab, Trastuzumab + Docetaxel, Ado-Trastuzumab Emtansine, Trastuzumab Deruxtecan, Trastuzumab + Pertuzumab',
            '3B',
            '2',
            <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
              <span>
                Inclusion in NCCN Head and Neck Cancer Guidelines V3.2024
              </span>
              <PMIDLink
                pmids="28006087, 30452336, 31504139, 38231777, 32067683"
                wrapText
              />
              <AbstractLink
                abstract="Liu, D. et al. Abstract# 3025, JCO 2023."
                link="https://ascopubs.org/doi/10.1200/JCO.2023.41.16_suppl.3025"
              />
            </WithSeparator>,
          ],
          [
            'ERBB2',
            'Amplification',
            'All Solid Tumors (excluding Breast Cancer, Esophagogastric Cancer, and Colorectal Cancer where ERBB2 amplification remains Level 1; Biliary Tract Cancer, Salivary Gland Cancer, and Uterine Cancer where ERBB2 amplification remains Level 2)',
            'Trastuzumab Deruxtecan',
            '3B',
            '3A',
            <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
              <FdaApprovalLink
                approval="Trastuzumab Deruxtecan for HER2+ (IHC 3+) Solid Tumors"
                link="https://www.fda.gov/drugs/resources-information-approved-drugs/fda-grants-accelerated-approval-fam-trastuzumab-deruxtecan-nxki-unresectable-or-metastatic-her2"
              />
              <span>
                Clinical response demonstrated in various HER2-expressing (IHC
                3+) solid tumors
              </span>
              <PMIDLink pmids="37870536, 38547891, 37286557" wrapText />
            </WithSeparator>,
          ],
        ],
      },
      {
        columnHeaderType: AnnotationColumnHeaderType.ADDITIONAL_SAME_LEVEL_DRUG,
        title: `Addition of therapy(s) associated with a tumor type-specific leveled alteration(s) (without changing the alteration's highest level of evidence)`,
        content: [
          [
            'BRAF',
            'V600E',
            'Low-Grade Glioma',
            '1',
            'Dabrafenib + Trametinib (Level 1)',
            'Tovorafenib (Level 1)',
            <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
              <FdaApprovalLink
                link="https://www.fda.gov/drugs/resources-information-approved-drugs/fda-grants-accelerated-approval-tovorafenib-patients-relapsed-or-refractory-braf-altered-pediatric"
                approval="Tovorafenib"
              />
              <PMIDLink pmids="37978284" />
            </WithSeparator>,
          ],
        ],
      },
    ],
    newlyAddedGenes: [
      'FGF7',
      'FOLR1',
      'GRB7',
      'MTHFD2',
      'MYO5A',
      'SLIT3',
      'UCHL1',
    ],
  },
  '03212024': {
    priorityNews: [
      <span>
        Updated therapeutic implications - New alteration(s) with a tumor
        type-specific level of evidence
        <Row className={'overflow-auto'}>
          <table className="table">
            <thead>
              <tr>
                <th>{LEVELS}</th>
                <th>{GENE}</th>
                <th>{MUTATION}</th>
                <th>{CANCER_TYPE}</th>
                <th>{DRUGS}</th>
                <th>{EVIDENCE}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>3A</td>
                <td rowSpan={2}>
                  <GenePageLink hugoSymbol="EGFR" />
                </td>
                <td rowSpan={2}>
                  <AlterationPageLink hugoSymbol="EGFR" alteration="L718Q" />
                </td>
                <td rowSpan={2}>Non-Small Cell Lung Cancer</td>
                <td>Afatinib</td>
                <td>
                  <PMIDLink pmids="32146032, 32193290, 31315676" wrapText />
                </td>
              </tr>
              <tr>
                <td>R2</td>
                <td>Osimertinib</td>
                <td>
                  <PMIDLink
                    pmids="27257132, 29506987, 33937055, 31205925, 34926262, 31315676, 32146032"
                    wrapText
                  />
                </td>
              </tr>
              <tr>
                <td>R2</td>
                <td>
                  <GenePageLink hugoSymbol="EGFR" />
                </td>
                <td>
                  <AlterationPageLink hugoSymbol="EGFR" alteration="L792F" />
                </td>
                <td>Non-Small Cell Lung Cancer</td>
                <td>Osimertinib</td>
                <td>
                  <PMIDLink
                    pmids="35932642, 28093244, 29506987, 35422503"
                    wrapText
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </Row>
      </span>,
    ],
    changedAnnotations: [
      {
        columnHeaderType:
          AnnotationColumnHeaderType.ADDITIONAL_SENSITIVITY_LEVEL_DRUG,
        content: [
          [
            'EGFR',
            'G724S',
            'Non-Small Cell Lung Cancer',
            'Osimertinib (Level R2)',
            'Afatinib (Level 3A)',
            '3A',
            'R2',
            <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
              <PMIDLink
                pmids="32093857, 35979997, 33209641, 34590038, 30405134"
                wrapText
              />
            </WithSeparator>,
          ],
        ],
      },
      {
        columnHeaderType:
          AnnotationColumnHeaderType.DEMOTION_TUMOR_TYPE_SPECIFIC_EVIDENCE,
        title:
          'Updated therapeutic implications - Demotion of tumor type-specific level of evidence for an alteration',
        content: [
          [
            'AKT1',
            'Oncogenic Mutations (excluding E17K, which remains Level 1)',
            'Breast Cancer',
            'Capivasertib + Fulvestrant',
            '1',
            '2',
            <span>
              To adhere to the{' '}
              <Linkout link="https://www.accessdata.fda.gov/drugsatfda_docs/label/2023/218197s000lbl.pdf">
                FDA-drug label
              </Linkout>{' '}
              and{' '}
              <Linkout link="https://info.foundationmedicine.com/hubfs/FMI%20Labels/FoundationOne_CDx_Label_Technical_Info.pdf">
                CDx
              </Linkout>{' '}
              for Capivasertib, Level 1 assignment will be only for AKT1 E17K
              detected by the FoundationOne CDx test. All other AKT1 oncogenic
              mutations are Level 2 per their inclusion in the NCCN Breast
              Cancer Guidelines V2.2024
            </span>,
          ],
          [
            'PIK3CA',
            'Oncogenic Mutations (excluding R88Q, N345K, C420R, E542K, E545A, E545D, E545Q, E545K, E545G, Q546E, Q546K, Q546R, Q546P, M1043V, M1043I, H1047Y, H1047R, H1047L and G1049R, which remain Level 1)',
            'Breast Cancer',
            <div>
              <div style={{ fontStyle: 'italic' }}>
                {DRUGS_REMAINING_IN_ONCOKB}:
              </div>
              <div>
                Capivasertib + Fulvestrant (Level 1), Alpelisib + Fulvestrant
                (Level 2){' '}
              </div>
              <br></br>
              <div style={{ fontStyle: 'italic' }}>
                {DRUGS_DEMOTED_IN_ONCOKB}:
              </div>
              <div>Capivasertib + Fulvestrant (Level 2)</div>
            </div>,
            '1',
            '2',
            <span>
              To adhere to the{' '}
              <Linkout link="https://www.accessdata.fda.gov/drugsatfda_docs/label/2023/218197s000lbl.pdf">
                FDA-drug label
              </Linkout>{' '}
              and{' '}
              <Linkout link="https://info.foundationmedicine.com/hubfs/FMI%20Labels/FoundationOne_CDx_Label_Technical_Info.pdf">
                CDx
              </Linkout>{' '}
              for Capivasertib, Level 1 assignment will be only for the PIK3CA
              alterations detected by the FoundationOne CDx test. All other
              PIK3CA oncogenic mutations are Level 2 per their inclusion in the
              NCCN Breast Cancer Guidelines V2.2024
            </span>,
          ],
          [
            'FGFR1',
            'Amplification',
            'Lung Squamous Cell Carcinoma',
            'Erdafitinib',
            '3A',
            'No Level',
            <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
              <span>
                Limited response rate to EGFR inhibitors for FGFR1-amplified
                lung squamous cell carcinoma; Discontinuation of infigratinib
              </span>
              <PMIDLink pmids={'37909331, 37606995'} />
            </WithSeparator>,
          ],
        ],
      },
      {
        columnHeaderType:
          AnnotationColumnHeaderType.PROMOTION_TUMOR_TYPE_SPECIFIC_EVIDENCE,
        title:
          'Updated therapeutic implications - Promotion of tumor type-specific level of evidence for an alteration',
        content: [
          [
            'KRAS',
            'G12C',
            'Ampullary Cancer',
            'Sotorasib, Adagrasib',
            '3B',
            '2',
            <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
              <span>
                Inclusion in NCCN Ampullary Adenocarcinoma Guidelines V1.2024
              </span>
              <PMIDLink pmids="32955176" />
            </WithSeparator>,
          ],
          [
            'EGFR',
            'L718V',
            'Non-Small Cell Lung Cancer',
            <div>
              <div style={{ fontStyle: 'italic' }}>
                {DRUGS_REMAINING_IN_ONCOKB}:
              </div>
              <div>Osimertinib (Level R2), Afatinib (Level 4)</div>
              <br></br>
              <div style={{ fontStyle: 'italic' }}>
                {DRUGS_PROMOTED_IN_ONCOKB}:
              </div>
              <div>Afatinib (Level 3A)</div>
            </div>,
            '4',
            '3A',
            <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
              <Linkout link="https://www.sciencedirect.com/science/article/pii/S2666621923000133">
                Ito, T., et al., Current Prob. in cancer, 2023
              </Linkout>
              <PMIDLink pmids="35365043, 31757379, 29571986" />
            </WithSeparator>,
          ],
        ],
      },
      {
        columnHeaderType: AnnotationColumnHeaderType.ADDITIONAL_SAME_LEVEL_DRUG,
        title: `Updated therapeutic implications - Addition of therapy(s) associated with a tumor type-specific leveled alteration(s) (without changing the alteration's highest level of evidence)`,
        content: [
          [
            'EGFR',
            'Exon 20 in-frame insertions',
            'Non-Small Cell Lung Cancer',
            '1',
            'Amivantamab, Mobocertinib (Level 1); Erlotinib, Afatinib, Gefitinib (Level R1)',
            'Amivantamab + Chemotherapy (Level 1)',
            <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
              <FdaApprovalLink
                approval="Amivantamab + Carboplatin + Pemetrexed"
                link="https://www.fda.gov/drugs/resources-information-approved-drugs/fda-approves-amivantamab-vmjw-egfr-exon-20-insertion-mutated-non-small-cell-lung-cancer-indications"
              />
              <PMIDLink pmids="37870976" />
            </WithSeparator>,
          ],
        ],
      },
    ],
    newlyAddedGenes: ['MAP3K21', 'NQO1', 'POU2F2', 'RPS15'],
  },
  '02082024': {
    news: [
      <span>
        Updated therapeutic implications - Demotion of tumor type-specific level
        of evidence for an alteration(s)
        <Row className={'overflow-auto'}>
          <table className="table">
            <thead>
              <tr>
                <th>{GENE}</th>
                <th>{MUTATION}</th>
                <th>{CANCER_TYPE}</th>
                <th>{DRUGS}</th>
                <th>{PREVIOUS_LEVEL}</th>
                <th>{CURRENT_LEVEL}</th>
                <th>{REASON}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <GenePageLink hugoSymbol="FGFR3" />
                </td>
                <td>
                  <span>
                    Fusions (excluding FGFR3-TACC3 Fusion and FGFR3-BAIAP2L1
                    Fusion which remain Level 1)
                  </span>
                </td>
                <td>Bladder Cancer</td>
                <td>Erdafitinib</td>
                <td>1</td>
                <td>2</td>
                <td>
                  <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
                    <Linkout link="https://www.accessdata.fda.gov/drugsatfda_docs/label/2020/212018s001lbl.pdf">
                      Adherence to FDA-drug label and CDx for Erdafitinib
                    </Linkout>
                    <span>
                      Inclusion in NCCN Bladder Cancer Guidelines V3.2023
                    </span>
                    <PMIDLink pmids="37870920" />
                  </WithSeparator>
                </td>
              </tr>
            </tbody>
          </table>
        </Row>
      </span>,
      <span>
        Updated therapeutic implications - Promotion of tumor type-specific
        level of evidence for an alteration(s)
        <Row className={'overflow-auto'}>
          <table className="table">
            <thead>
              <tr>
                <th>{GENE}</th>
                <th>{MUTATION}</th>
                <th>{CANCER_TYPE}</th>
                <th>{DRUGS}</th>
                <th>{PREVIOUS_LEVEL}</th>
                <th>{CURRENT_LEVEL}</th>
                <th>{REASON}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <GenePageLink hugoSymbol="FGFR3" />
                </td>
                <td>
                  <span>
                    <WithSeparator separator={', '}>
                      {['S371C', 'G380R', 'K650'].map((alt, index) => (
                        <AlterationPageLink
                          key={index}
                          hugoSymbol="FGFR3"
                          alteration={alt}
                        />
                      ))}
                    </WithSeparator>
                  </span>
                </td>
                <td rowSpan={2}>Bladder Cancer</td>
                <td rowSpan={2}>Erdafitinib</td>
                <td>3A</td>
                <td>2</td>
                <td rowSpan={2}>
                  {' '}
                  <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
                    <Linkout link="https://www.accessdata.fda.gov/drugsatfda_docs/label/2020/212018s001lbl.pdf">
                      Adherence to FDA-drug label and CDx for Erdafitinib
                    </Linkout>
                    <span>
                      Inclusion in NCCN Bladder Cancer Guidelines V3.2023
                    </span>
                    <PMIDLink pmids="37870920" />
                  </WithSeparator>
                </td>
              </tr>
              <tr>
                <td>
                  <GenePageLink hugoSymbol="FGFR3" />
                </td>
                <td>
                  <span>
                    Oncogenic Mutations (excluding G370C, R248C, S249C, Y373C
                    which remain Level 1)
                  </span>
                </td>
                <td>4</td>
                <td>2</td>
              </tr>
              <tr>
                <td>
                  <GenePageLink hugoSymbol="MDM2" />
                </td>
                <td>
                  <span>
                    <AlterationPageLink
                      hugoSymbol="MDM2"
                      alteration="Amplification"
                    />
                  </span>
                </td>
                <td>
                  Dedifferentiated Liposarcoma, Well-Differentiated Liposarcoma
                </td>
                <td>
                  <div>
                    <div style={{ fontStyle: 'italic' }}>
                      {DRUGS_REMAINING_IN_ONCOKB}:
                    </div>
                    <div>Milademetan (Level 4)</div>
                    <br></br>
                    <div style={{ fontStyle: 'italic' }}>
                      {DRUGS_ADDED_TO_ONCOKB}:
                    </div>
                    <div>Brigimadlin (Level 3A)</div>
                  </div>
                </td>
                <td>4</td>
                <td>3A</td>
                <td>
                  <PMIDLink pmids="37269344" />
                </td>
              </tr>
            </tbody>
          </table>
        </Row>
      </span>,
    ],
    changedAnnotations: [
      {
        columnHeaderType: AnnotationColumnHeaderType.DRUG_REMOVAL,
        content: [
          [
            'FGFR2',
            'Fusions',
            'Bladder Cancer',
            'Level 1',
            'No Level',
            <div>
              <div>Erdafitinib (Level 1)</div>
              <div>AZD4547 (Level 4)</div>
            </div>,
            'Erdafitinib, AZD4547',
            <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
              <Linkout link="https://www.accessdata.fda.gov/drugsatfda_docs/label/2020/212018s001lbl.pdf">
                Amendment to the FDA-drug label for Erdafitinib
              </Linkout>
              <span>
                4/25 (16%) response rate for FGFR2/3 fusion+ bladder cancer, 0/6
                (0%) response for FGFR2 fusion+ bladder cancer
              </span>
              <PMIDLink pmids="31340094" />
            </WithSeparator>,
          ],
        ],
      },
    ],
    updatedImplicationTitle:
      'Updated therapeutic implications - New alteration(s) with a tumor type-specific level of evidence',
    updatedImplication: [
      [
        '3A',
        'MDM2',
        'Amplification',
        'Intimal Sarcoma',
        'Milademetan',
        <PMIDLink pmids={'37369013'} />,
      ],
    ],
    newlyAddedGenes: [
      'ANKRD26',
      'ARHGAP26',
      'ATIC',
      'CD70',
      'ERCC1',
      'FGF1',
      'FGF2',
      'FGF5',
      'HFE',
      'HOXA11',
      'MN1',
      'PML',
      'SRP72',
      'TNFRSF17',
    ],
  },
  '01172024': {
    priorityNews: [
      <span>
        Happy New Year! As of December 31, 2023, 11 level 1, 7 level 2, 4 level
        3 and 3 level 4 treatments for unique biomarker-selected indications
        were added to OncoKB. A table summarizing these changes can be found{' '}
        <YearEndReviewPageLink year={'2023'}>here</YearEndReviewPageLink>. The
        Precision Oncology: 2023 in review article can be found{' '}
        <Linkout
          link={
            'https://aacrjournals.org/cancerdiscovery/article/13/12/2525/731600/Precision-Oncology-2023-in-Review'
          }
        >
          here
        </Linkout>
        .
      </span>,
    ],
  },
  '12212023': {
    priorityNews: [
      <span>
        Release of{' '}
        <a
          href="https://sop.oncokb.org/?version=v3.1"
          target="_blank"
          rel="noopener noreferrer"
        >
          {ONCOKB_TM} SOP v3.1
        </a>
      </span>,
      <span>
        We have replaced the "Precision Oncology Therapies" page with{' '}
        <Link to={PAGE_ROUTE.ONCOLOGY_TX}>
          "FDA-Approved Oncology Therapies"
        </Link>{' '}
        which includes classification of which oncology therapies are considered
        "precision oncology therapies"
      </span>,
    ],
    updatedImplicationTitle:
      'Updated therapeutic implications - New alterations with a level of evidence',
    updatedImplication: [
      [
        'R2',
        'EGFR',
        <WithSeparator separator={', '}>
          {['S464L', 'G465E', 'G465R', 'V441D', 'V441G', 'S492R'].map(
            alteration => (
              <AlterationPageLink
                hugoSymbol="EGFR"
                alteration={alteration}
                key={alteration}
              />
            )
          )}
        </WithSeparator>,
        'Colorectal Cancer',
        'Cetuximab, Panitumumab',
        <PMIDLink pmids={'29423521, 29196463'} />,
      ],
    ],
    newlyAddedGenes: [
      'EMSY',
      'FGF23',
      'FRS2',
      'GABRA6',
      'GATA4',
      'KEL',
      'PIK3C2B',
      'PRKDC',
      'QKI',
      'RANBP2',
      'SOX10',
      'STAT4',
      'TAF1',
    ],
  },
  '12062023': {
    changedAnnotations: [
      {
        columnHeaderType: AnnotationColumnHeaderType.LEVEL,
        title: 'Updated therapeutic implications - Changed level of evidence',
        content: [
          [
            'AKT1',
            'Oncogenic Mutations',
            'Breast Cancer',
            'Capivasertib + Fulvestrant',
            '3A (Capivasertib monotherapy for AKT1 E17K only)',
            '1',
            <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
              <FdaApprovalLink
                approval="Capivasertib + Fulvestrant"
                link="https://www.fda.gov/drugs/resources-information-approved-drugs/fda-approves-capivasertib-fulvestrant-breast-cancer"
              />
              <PMIDLink pmids={'37256976'} />
            </WithSeparator>,
          ],
          [
            'PTEN',
            'Oncogenic Mutations',
            'Breast Cancer',
            <div>
              <div style={{ fontStyle: 'italic' }}>
                {DRUGS_REMAINING_IN_ONCOKB}:
              </div>
              <div>GSK2636771, AZD8186 (Currently Level 4)</div>
              <br></br>
              <div style={{ fontStyle: 'italic' }}>
                {DRUGS_ADDED_TO_ONCOKB}:
              </div>
              <div>Capivasertib + Fulvestrant (Level 1)</div>
            </div>,
            '4',
            '1',
            <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
              <FdaApprovalLink
                approval="Capivasertib + Fulvestrant"
                link="https://www.fda.gov/drugs/resources-information-approved-drugs/fda-approves-capivasertib-fulvestrant-breast-cancer"
              />
              <PMIDLink pmids={'37256976'} />
            </WithSeparator>,
          ],
          [
            'KRAS',
            'G12A/D/R/S/V',
            'Pancreatic Adenocarcinoma, Non-Small Cell Lung Cancer',
            'RMC-6236',
            '4',
            '3A',
            <AbstractLink
              abstract="Arbour, KC. et al. Abstract# 6520, Annals of Oncol. 2023"
              link="https://oncologypro.esmo.org/meeting-resources/esmo-congress/preliminary-clinical-activity-of-rmc-6236-a-first-in-class-ras-selective-tri-complex-ras-multi-on-inhibitor-in-patients-with-kras-mutant-pancre"
            />,
          ],
        ],
      },
      {
        columnHeaderType: AnnotationColumnHeaderType.ADDITIONAL_SAME_LEVEL_DRUG,
        content: [
          [
            'PIK3CA',
            'Oncogenic Mutations',
            'Breast Cancer',
            '1',
            'Alpelisib + Fulvestrant (Level 1; select PIK3CA mts only), RLY-2608 + Fulvestrant (Level 4)',
            'Capivasertib + Fulvestrant (Level 1)',
            <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
              <FdaApprovalLink
                approval={'Capivasertib + Fulvestrant'}
                link={
                  'https://www.fda.gov/drugs/resources-information-approved-drugs/fda-approves-capivasertib-fulvestrant-breast-cancer'
                }
              />
              <PMIDLink pmids={'37256976'} />
            </WithSeparator>,
          ],
          [
            'ROS1',
            'Fusions',
            'Non-Small Cell Lung Cancer',
            '1',
            'Crizotinib, Entrectinib (Level 1), Ceritinib, Lorlatinib (Level 2),  Repotrectinib (Level 3A)',
            'Repotrectinib (Promoted to Level 1)',
            <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
              <FdaApprovalLink
                approval={'Repotrectinib for ROS1+ NSCLC'}
                link={
                  'https://www.fda.gov/drugs/resources-information-approved-drugs/fda-approves-repotrectinib-ros1-positive-non-small-cell-lung-cancer'
                }
              />
              <AbstractLink
                abstract="Cho et al. Abstract# OA03.06, J. of Thoracic Oncol. Nov. 2023"
                link="https://www.jto.org/article/S1556-0864(23)00837-7/fulltext"
              />
            </WithSeparator>,
          ],
        ],
      },
    ],
    news: [
      <span>
        Updated therapeutic implications - New alterations with a level of
        evidence
        <Row className={'overflow-auto'}>
          <table className="table">
            <thead>
              <tr>
                <th>{LEVEL}</th>
                <th>{GENE}</th>
                <th>{MUTATION}</th>
                <th>{CANCER_TYPE}</th>
                <th>{DRUGS}</th>
                <th>{EVIDENCE}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>3A</td>
                <td>
                  <GenePageLink hugoSymbol="EGFR" />
                </td>
                <td>
                  <AlterationPageLink
                    alteration="Amplification"
                    hugoSymbol="EGFR"
                  />
                </td>
                <td>Gastroesophageal Adenocarcinoma</td>
                <td>
                  Cetuximab, Cetuximab + Chemotherapy, Panitumumab, Panitumumab
                  + Chemotherapy
                </td>
                <td>
                  <PMIDLink pmids={'35349370'} />
                </td>
              </tr>
            </tbody>
          </table>
        </Row>
      </span>,
    ],
    newlyAddedGenes: [
      'FGF6',
      'HSD3B1',
      'IRF2',
      'PAX3',
      'PAX7',
      'PDK1',
      'ZNF217',
    ],
  },
  '11132023': {
    news: [
      <span>
        Updated therapeutic implications - Addition of therapies for variants
        with a level of evidence
        <Row className={'overflow-auto'}>
          <table className="table">
            <thead>
              <tr>
                <th>{GENE}</th>
                <th>{MUTATION}</th>
                <th>{CANCER_TYPE}</th>
                <th>{CURRENT_LEVEL_OF_EVIDENCE}</th>
                <th>{DRUGS_REMAINING_IN_ONCOKB}</th>
                <th>{DRUGS_ADDED_TO_ONCOKB}</th>
                <th>{EVIDENCE}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <GenePageLink hugoSymbol="BRCA1" />
                </td>
                <td rowSpan={2} style={{ verticalAlign: 'middle' }}>
                  Oncogenic Mutations
                </td>
                <td rowSpan={2} style={{ verticalAlign: 'middle' }}>
                  Prostate Cancer
                </td>
                <td rowSpan={2} style={{ verticalAlign: 'middle' }}>
                  1
                </td>
                <td rowSpan={2} style={{ verticalAlign: 'middle' }}>
                  Olaparib, Rucaparib, Olaparib + Abiraterone + Prednisone,
                  Talazoparib + Enzalutamide (Level 1)
                </td>
                <td rowSpan={2} style={{ verticalAlign: 'middle' }}>
                  Niraparib + Abiraterone Acetate + Prednisone (Level 1)
                </td>
                <td rowSpan={2} style={{ verticalAlign: 'middle' }}>
                  <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
                    <FdaApprovalLink
                      approval={'Niraparib + Abiraterone Acetate + Prednisone'}
                      link={
                        'https://www.fda.gov/drugs/resources-information-approved-drugs/fda-approves-niraparib-and-abiraterone-acetate-plus-prednisone-brca-mutated-metastatic-castration'
                      }
                    />
                    <PMIDLink pmids={'36952634'} />
                  </WithSeparator>
                </td>
              </tr>
              <tr>
                <td>
                  <GenePageLink hugoSymbol="BRCA2" />
                </td>
              </tr>
            </tbody>
          </table>
        </Row>
      </span>,
    ],
    changedAnnotations: [
      {
        columnHeaderType: AnnotationColumnHeaderType.LEVEL,
        title: 'Updated therapeutic implications - Changed level of evidence',
        content: [
          [
            'IDH1',
            'R132',
            'Myelodysplastic Syndromes',
            'Ivosidenib',
            '3B',
            '1',
            <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
              <FdaApprovalLink
                approval="Ivosidenib for patients with IDH1-mutant myelodysplastic syndrome"
                link="https://www.fda.gov/drugs/resources-information-approved-drugs/fda-approves-ivosidenib-myelodysplastic-syndromes"
              />
              <AbstractLink
                abstract="DiNardo et al. Abstract# MDS-457, SOHO 2023"
                link="https://www.sciencedirect.com/science/article/pii/S2152265023011898"
              />
            </WithSeparator>,
          ],
        ],
      },
    ],
    newlyAddedGenes: ['CTNNA1', 'FGF10', 'FGF14', 'HSP90AA1'],
  },
  '10242023': {
    changedAnnotations: [
      {
        columnHeaderType: AnnotationColumnHeaderType.LEVEL,
        title: 'Updated therapeutic implications - Changed level of evidence',
        content: [
          [
            'KRAS',
            'G12C',
            'Colorectal Cancer',
            <div>
              <div style={{ fontStyle: 'italic' }}>
                {DRUGS_REMAINING_IN_ONCOKB}:
              </div>
              <div>Adagrasib + Cetuximab (Level 3A)</div>
              <br></br>
              <div style={{ fontStyle: 'italic' }}>
                {DRUGS_ADDED_TO_ONCOKB}:
              </div>
              <div>
                Adagrasib + Panitumumab; Sotorasib + Cetuximab; Sotorasib +
                Panitumumab
              </div>
            </div>,
            '3A',
            '2',
            <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
              <span>
                Inclusion in Colon Cancer NCCN guidelines v3.2023 and in Rectal
                Cancer NCCN guidelines v5.2023
              </span>
              <PMIDLink pmids={'36546659'} />
              <AbstractLink
                link={
                  'https://www.annalsofoncology.org/article/S0923-7534(22)04268-5/fulltext'
                }
                abstract="Kuboki et al. Abstract# 45MO, ESMO 2022."
              />
            </WithSeparator>,
          ],
        ],
      },
      {
        columnHeaderType: AnnotationColumnHeaderType.ADDITIONAL_SAME_LEVEL_DRUG,
        content: [
          [
            'BRAF',
            'V600E',
            'Non-Small Cell Lung Cancer',
            '1',
            'Dabrafenib + Trametinib (Level 1)',
            'Encorafenib + Binimetinib (Level 1)',
            <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
              <FdaApprovalLink
                approval={'Encorafenib + Binimetinib for BRAF V600E NSCLC'}
                link={
                  'https://www.fda.gov/drugs/resources-information-approved-drugs/fda-approves-encorafenib-binimetinib-metastatic-non-small-cell-lung-cancer-braf-v600e-mutation'
                }
              />
              <PMIDLink pmids={'37270692'} />
            </WithSeparator>,
          ],
        ],
      },
    ],
    newlyAddedGenes: ['EPHB4', 'ETS1', 'FANCE', 'FANCF', 'FANCG', 'MYB'],
  },
  '10022023': {
    changedAnnotations: [
      {
        columnHeaderType: AnnotationColumnHeaderType.LEVEL,
        title: 'Updated therapeutic implications - Changed level of evidence',
        content: [
          [
            'RET',
            'Oncogenic Mutations',
            'Medullary Thyroid Cancer (MTC)',
            'Pralsetinib',
            '1',
            '3A',
            <FdaWithdrawalLink linkText="Withdrawal of FDA approval for Pralsetinib for RET-mutant MTC" />,
          ],
          [
            'ALK',
            'Oncogenic Mutations',
            'Non-Small Cell Lung Cancer',
            'Lorlatinib',
            '1',
            'No level',
            <Linkout link="https://www.accessdata.fda.gov/drugsatfda_docs/label/2021/210868s004lbl.pdf">
              Adherence to FDA drug label and CDx for Lorlatinib
            </Linkout>,
          ],
        ],
      },
      {
        columnHeaderType: AnnotationColumnHeaderType.ADDITIONAL_SAME_LEVEL_DRUG,
        content: [
          [
            'Other Biomarkers',
            'MSI-H',
            'Endometrial Cancer',
            '1',
            'Pembrolizumab (All Solid Tumors)',
            'Dostarlimab + Carboplatin + Paclitaxel (Level 1, Endometrial Cancer)',
            <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
              <FdaApprovalLink
                approval={'Dostarlimab for MSI-H endometrial cancer'}
                link={
                  'https://www.fda.gov/drugs/drug-approvals-and-databases/fda-approves-quizartinib-newly-diagnosed-acute-myeloid-leukemia'
                }
              />
              <PMIDLink pmids={'36972026'} />
            </WithSeparator>,
          ],
        ],
      },
    ],
    newlyAddedGenes: [
      'ELF4',
      'ELK4',
      'ELL',
      'ELN',
      'ERC1',
      'FOXN4',
      'HIRA',
      'ONECUT2',
      'POU3F2',
      'SF3B2',
      'ZBTB7A',
    ],
  },
  '09012023': {
    newlyAddedGenes: [
      'ACVR1B',
      'ARHGEF12',
      'BCL7A',
      'CD19',
      'CHD2',
      'COL2A1',
      'DNM2',
      'DPYD',
      'EBF1',
      'EIF3E',
      'FANCM',
      'FHIT',
      'FOXO3',
      'GATA6',
      'GRM3',
      'HDAC2',
      'HNF1B',
      'IFNAR1',
      'ING1',
      'ITPKB',
      'KDM5D',
      'KLHL6',
      'LEF1',
      'MAP3K7',
      'MLH3',
      'MS4A1',
      'PHLPP1',
      'PHLPP2',
      'PTPN13',
      'PTPN14',
      'RPL5',
      'SLC9A3R1',
      'SLIT2',
      'SZT2',
      'TONSL',
      'XPC',
      'XRCC1',
      'ZMYM3',
    ],
  },
  '07282023': {
    changedAnnotations: [
      {
        columnHeaderType: AnnotationColumnHeaderType.ADDITIONAL_SAME_LEVEL_DRUG,
        content: [
          [
            'FLT3',
            <Link
              to={getAlterationPageLink({
                hugoSymbol: 'FLT3',
                alteration: 'Internal tandem duplication',
              })}
            >
              Internal Tandem Duplications (ITD)
            </Link>,
            'Acute Myeloid Leukemia',
            '1',
            <WithSeparator
              separator={
                <>
                  ,<br />
                </>
              }
            >
              <>
                Gilteritinib
                <br />
                (Level 1)
              </>
              <>
                Midostaurin + High Dose Chemotherapy
                <br />
                (Level 1)
              </>
              <>
                Crenolanib
                <br />
                (Level 3A)
              </>
              <>
                Quizartinib
                <br />
                (Level 3A)
              </>
            </WithSeparator>,
            <>
              Quizartinib
              <br />
              (Promoted to Level 1)
            </>,
            <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
              <FdaApprovalLink
                approval={'Quizartinib'}
                link={
                  'https://www.fda.gov/drugs/drug-approvals-and-databases/fda-approves-quizartinib-newly-diagnosed-acute-myeloid-leukemia'
                }
              />
              <PMIDLink pmids={'37116523'} />
            </WithSeparator>,
          ],
        ],
      },
    ],
    newlyAddedGenes: [
      'CACNA1D',
      'CANT1',
      'CBFA2T3',
      'CD22',
      'CD74',
      'CDH2',
      'CDH4',
      'CDH11',
      'CLTCL1',
      'CNTRL',
      'COL1A1',
      'CUL4A',
      'DDX5',
      'FSTL1',
    ],
  },
  '07122023': {
    news: [
      <span>
        Updated therapeutic implications - new alterations with a level of
        evidence
        <Row className={'overflow-auto'}>
          <table className="table">
            <thead>
              <tr>
                <th>Level</th>
                <th>Gene</th>
                <th>Mutation</th>
                <th>Cancer Type</th>
                <th>Drug(s)</th>
                <th>Evidence</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>
                  <GenePageLink hugoSymbol={'ATR'} />
                </td>
                <td rowSpan={5} style={{ verticalAlign: 'middle' }}>
                  Oncogenic Mutations
                </td>
                <td rowSpan={5} style={{ verticalAlign: 'middle' }}>
                  Prostate Cancer
                </td>
                <td rowSpan={5} style={{ verticalAlign: 'middle' }}>
                  Talazoparib + Enzalutamide
                </td>
                <td rowSpan={5} style={{ verticalAlign: 'middle' }}>
                  <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
                    <FdaApprovalLink
                      approval={'Talazoparib + Enzalutamide'}
                      link={
                        'https://www.fda.gov/drugs/drug-approvals-and-databases/fda-approves-talazoparib-enzalutamide-hrr-gene-mutated-metastatic-castration-resistant-prostate#:~:text=On%20June%2020%2C%202023%2C%20the,resistant%20prostate%20cancer%20(mCRPC).'
                      }
                    />
                    <PMIDLink pmids={'37285865'} />
                  </WithSeparator>
                </td>
              </tr>
              <tr>
                <td>1</td>
                <td>
                  <GenePageLink hugoSymbol={'FANCA'} />
                </td>
              </tr>
              <tr>
                <td>1</td>
                <td>
                  <GenePageLink hugoSymbol={'MLH1'} />
                </td>
              </tr>
              <tr>
                <td>1</td>
                <td>
                  <GenePageLink hugoSymbol={'MRE11'} />
                </td>
              </tr>
              <tr>
                <td>1</td>
                <td>
                  <GenePageLink hugoSymbol={'NBN'} />
                </td>
              </tr>
              <tr>
                <td>2</td>
                <td>
                  <GenePageLink hugoSymbol={'IDH1'} />
                </td>
                <td>Oncogenic Mutations</td>
                <td>Oligodendroglioma</td>
                <td>Ivosidenib</td>
                <td>
                  <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
                    <span>Inclusion in CNS NCCN Guidelines v1.2023</span>
                    <PMIDLink pmids={'32530764'} />
                  </WithSeparator>
                </td>
              </tr>
              <tr>
                <td>3A</td>
                <td>
                  <GenePageLink hugoSymbol={'IDH2'} />
                </td>
                <td>R172</td>
                <td>Oligodendroglioma, Astrocytoma</td>
                <td>Vorasidenib</td>
                <td>
                  <PMIDLink pmids={'37272516'} />
                </td>
              </tr>
              <tr>
                <td>4</td>
                <td>
                  <GenePageLink hugoSymbol={'KRAS'} />
                </td>
                <td>G12</td>
                <td>All Solid Tumors</td>
                <td>RMC-6236</td>
                <td>
                  <AbstractLink
                    abstract={'Koltun et al. Abstract# 3597, AACR 2022'}
                    link={
                      'https://aacrjournals.org/cancerres/article/82/12_Supplement/3597/702320/Abstract-3597-Direct-targeting-of-KRASG12X-mutant'
                    }
                  />
                </td>
              </tr>
              <tr>
                <td>4</td>
                <td>
                  <GenePageLink hugoSymbol={'FGFR2'} />
                </td>
                <td>Amplification</td>
                <td>All Solid Tumors</td>
                <td>RLY-4008</td>
                <td>
                  <AbstractLink
                    abstract={'Borad et al. Abstract# 4009, ASCO 2023'}
                    link={
                      'https://ascopubs.org/doi/abs/10.1200/JCO.2023.41.16_suppl.4009?af=R)(PMID: 37270847'
                    }
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </Row>
      </span>,
      <span>
        Updated therapeutic implications - Addition of therapies for variants
        with a level of evidence
        <Row className={'overflow-auto'}>
          <table className="table">
            <thead>
              <tr>
                <th>Gene</th>
                <th>Mutation</th>
                <th>Cancer Type</th>
                <th>Current Level of Evidence</th>
                <th>Drug(s) currently in OncoKB</th>
                <th>Drug(s) added to OncoKB</th>
                <th>Evidence</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <GenePageLink hugoSymbol={'ALK'} />
                </td>
                <td>Fusions</td>
                <td>Inflammatory Myofibroblastic Tumors</td>
                <td>1</td>
                <td>
                  Crizotinib (Level 1); Brigatinib, Lorlatinib, Ceritinib (Level
                  2)
                </td>
                <td>Alectinib (Level 2)</td>
                <td>
                  Inclusion in Soft Tissue Sarcoma NCCN Guidelines v2.2023
                </td>
              </tr>
              <tr>
                <td>
                  <GenePageLink hugoSymbol={'FGFR2'} />
                </td>
                <td>Fusions</td>
                <td>Cholangiocarcinoma</td>
                <td>1</td>
                <td>Futibatinib, Pemigatinib (Level 1)</td>
                <td>RLY-4008 (Level 3A)</td>
                <td>
                  <AbstractLink
                    abstract={'Borad et al. Abstract# 4009, ASCO 2023'}
                    link={
                      'https://ascopubs.org/doi/abs/10.1200/JCO.2023.41.16_suppl.4009?af=R)(PMID: 37270847'
                    }
                  />
                </td>
              </tr>
              <tr>
                <td rowSpan={2}>
                  <GenePageLink hugoSymbol={'BRCA1'} />
                </td>
                <td rowSpan={2}>Oncogenic Mutations</td>
                <td rowSpan={2}>Prostate Cancer</td>
                <td rowSpan={2}>1</td>
                <td rowSpan={2}>Olaparib, Rucaparib (Level 1)</td>
                <td>Talazoparib + Enzalutamide (Level 1)</td>
                <td>
                  <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
                    <FdaApprovalLink
                      approval={'Talazoparib + Enzalutamide'}
                      link={
                        'https://www.fda.gov/drugs/drug-approvals-and-databases/fda-approves-talazoparib-enzalutamide-hrr-gene-mutated-metastatic-castration-resistant-prostate#:~:text=On%20June%2020%2C%202023%2C%20the,resistant%20prostate%20cancer%20(mCRPC).'
                      }
                    />
                    <PMIDLink pmids={'37285865'} />
                  </WithSeparator>
                </td>
              </tr>
              <tr>
                <td>
                  Olaparib + Abiraterone + Prednisone/Prednisolone (Level 1)
                </td>
                <td>
                  <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
                    <FdaApprovalLink
                      approval={
                        'Olaparib + Abiraterone + Prednisone/Prednisolone'
                      }
                      link={
                        'https://www.fda.gov/drugs/drug-approvals-and-databases/fda-approves-olaparib-abiraterone-and-prednisone-or-prednisolone-brca-mutated-metastatic-castration'
                      }
                    />
                    <AbstractLink
                      abstract={'Clarke et al. Abstract# LBA16, ASCO GUCS 2023'}
                      link={
                        'https://ascopubs.org/doi/abs/10.1200/JCO.2023.41.6_suppl.LBA16'
                      }
                    />
                  </WithSeparator>
                </td>
              </tr>
              <tr>
                <td rowSpan={2}>
                  <GenePageLink hugoSymbol={'BRCA2'} />
                </td>
                <td rowSpan={2}>Oncogenic Mutations</td>
                <td rowSpan={2}>Prostate Cancer</td>
                <td rowSpan={2}>1</td>
                <td rowSpan={2}>Olaparib, Rucaparib (Level 1)</td>
                <td>Talazoparib + Enzalutamide (Level 1)</td>
                <td>
                  <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
                    <FdaApprovalLink
                      approval={'Talazoparib + Enzalutamide'}
                      link={
                        'https://www.fda.gov/drugs/drug-approvals-and-databases/fda-approves-talazoparib-enzalutamide-hrr-gene-mutated-metastatic-castration-resistant-prostate#:~:text=On%20June%2020%2C%202023%2C%20the,resistant%20prostate%20cancer%20(mCRPC).'
                      }
                    />
                    <PMIDLink pmids={'37285865'} />
                  </WithSeparator>
                </td>
              </tr>
              <tr>
                <td>
                  Olaparib + Abiraterone + Prednisone/Prednisolone (Level 1)
                </td>
                <td>
                  <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
                    <FdaApprovalLink
                      approval={
                        'Olaparib + Abiraterone + Prednisone/Prednisolone'
                      }
                      link={
                        'https://www.fda.gov/drugs/drug-approvals-and-databases/fda-approves-olaparib-abiraterone-and-prednisone-or-prednisolone-brca-mutated-metastatic-castration'
                      }
                    />
                    <AbstractLink
                      abstract={'Clarke et al. Abstract# LBA16, ASCO GUCS 2023'}
                      link={
                        'https://ascopubs.org/doi/abs/10.1200/JCO.2023.41.6_suppl.LBA16'
                      }
                    />
                  </WithSeparator>
                </td>
              </tr>
              <tr>
                <td>
                  <GenePageLink hugoSymbol={'ATM'} />
                </td>
                <td rowSpan={5} style={{ verticalAlign: 'middle' }}>
                  Oncogenic Mutations
                </td>
                <td rowSpan={5} style={{ verticalAlign: 'middle' }}>
                  Prostate Cancer
                </td>
                <td rowSpan={5} style={{ verticalAlign: 'middle' }}>
                  1
                </td>
                <td rowSpan={5} style={{ verticalAlign: 'middle' }}>
                  Olaparib (Level 1)
                </td>
                <td rowSpan={5} style={{ verticalAlign: 'middle' }}>
                  Talazoparib + Enzalutamide (Level 1)
                </td>
                <td rowSpan={5} style={{ verticalAlign: 'middle' }}>
                  <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
                    <FdaApprovalLink
                      approval={'Talazoparib + Enzalutamide'}
                      link={
                        'https://www.fda.gov/drugs/drug-approvals-and-databases/fda-approves-talazoparib-enzalutamide-hrr-gene-mutated-metastatic-castration-resistant-prostate#:~:text=On%20June%2020%2C%202023%2C%20the,resistant%20prostate%20cancer%20(mCRPC).'
                      }
                    />
                    <PMIDLink pmids={'37285865'} />
                  </WithSeparator>
                </td>
              </tr>
              <tr>
                <td>
                  <GenePageLink hugoSymbol={'PALB2'} />
                </td>
              </tr>
              <tr>
                <td>
                  <GenePageLink hugoSymbol={'CDK12'} />
                </td>
              </tr>

              <tr>
                <td>
                  <GenePageLink hugoSymbol={'CHEK2'} />
                </td>
              </tr>
              <tr>
                <td>
                  <GenePageLink hugoSymbol={'RAD51C'} />
                </td>
              </tr>
              <tr>
                <td>
                  <GenePageLink hugoSymbol={'IDH1'} />
                </td>
                <td>R132</td>
                <td>Oligodendroglioma, Astrocytoma</td>
                <td>3A</td>
                <td>Ivosidenib</td>
                <td>Vorasidenib (Level 3A)</td>
                <td>
                  <PMIDLink pmids={'37272516'} />
                </td>
              </tr>
              <tr>
                <td>
                  <GenePageLink hugoSymbol={'FGFR2'} />
                </td>
                <td>Oncogenic Mutations</td>
                <td>All Solid Tumors</td>
                <td>4</td>
                <td>Erdafitinib and AZD4547 (Level 4)</td>
                <td>RLY-4008 (Level 4)</td>
                <td>
                  <AbstractLink
                    abstract={'Borad et al. Abstract# 4009, ASCO 2023'}
                    link={
                      'https://ascopubs.org/doi/abs/10.1200/JCO.2023.41.16_suppl.4009?af=R)(PMID:%2037270847'
                    }
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <GenePageLink hugoSymbol={'KRAS'} />
                </td>
                <td>G12D</td>
                <td>All Solid Tumors</td>
                <td>4</td>
                <td>RMC-6236</td>
                <td>MRTX-1133 and ASP3082 (level 4)</td>
                <td>
                  <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
                    <AbstractLink
                      abstract={'Nagashima et al. Abstract# 5735, AACR 2023'}
                      link={
                        'https://aacrjournals.org/cancerres/article/83/7_Supplement/5735/722276'
                      }
                    />
                    <PMIDLink pmids={'36472553'} />
                  </WithSeparator>
                </td>
              </tr>
            </tbody>
          </table>
        </Row>
      </span>,
      <span>
        Updated therapeutic implications - Removal of therapies for variants
        with a level of evidence
        <Row className={'overflow-auto'}>
          <table className="table">
            <thead>
              <tr>
                <th>Gene</th>
                <th>Mutation</th>
                <th>Cancer Type</th>
                <th>Current Level of Evidence</th>
                <th>Drug(s) currently in OncoKB</th>
                <th>Drug(s) removed from OncoKB</th>
                <th>Evidence</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <GenePageLink hugoSymbol={'FGFR1'} />
                </td>
                <td>Amplification</td>
                <td>Lung Squamous Cell Carcinoma</td>
                <td>3A</td>
                <td>Erdafitinib</td>
                <td rowSpan={2}>Debio1347</td>
                <td rowSpan={2}>
                  <Linkout
                    link={
                      'https://classic.clinicaltrials.gov/ct2/show/NCT03834220'
                    }
                  >
                    Failed in basket study
                  </Linkout>{' '}
                  - no further clinical development
                </td>
              </tr>
              <tr>
                <td>{convertGeneInputToLinks('FGFR1, FGFR2, FGFR3')}</td>
                <td>Oncogenic Mutations</td>
                <td>All Solid Tumors</td>
                <td>4</td>
                <td>Erdafitinib, AZD4547</td>
              </tr>
            </tbody>
          </table>
        </Row>
      </span>,
    ],
    changedAnnotations: [
      {
        title: 'Changed level of evidence',
        content: [
          [
            'FGFR2',
            'Oncogenic Mutations',
            'Cholangiocarcinoma',
            'RLY-4008 (Level 3A); Erdafitinib and AZD4547 (Currently Level 4)',
            '4',
            '3A',
            <AbstractLink
              abstract={'Borad et al. Abstract# 4009, ASCO 2023'}
              link={
                'https://ascopubs.org/doi/abs/10.1200/JCO.2023.41.16_suppl.4009?af=R)(PMID: 37270847'
              }
            />,
          ],
          [
            'IDH1',
            'R132',
            'Oligodendroglioma',
            'Ivosidenib',
            '3A',
            '2',
            <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
              <span>Inclusion in CNS NCCN Guidelines v1.2023</span>
              <PMIDLink pmids={'32530764'} />
            </WithSeparator>,
          ],
        ],
      },
    ],
    newlyAddedGenes: ['CAD', 'CHD4', 'H4C6', 'TRIB3'],
  },
  '05192023': {
    priorityNews: [
      <span>
        Updated therapeutic implications - new alterations with a level of
        evidence
        <Row className={'overflow-auto'}>
          <table className="table">
            <thead>
              <tr>
                <th>Level</th>
                <th>Gene</th>
                <th>Mutation</th>
                <th>Cancer Type</th>
                <th>Drug(s)</th>
                <th>Evidence</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td rowSpan={3}>1</td>
                <td rowSpan={3}>
                  <GenePageLink hugoSymbol={'RARA'} />
                </td>
                <td rowSpan={3}>
                  <AlterationPageLink
                    hugoSymbol={'RARA'}
                    alteration={'PML-RARA Fusion'}
                  />
                </td>
                <td rowSpan={3}>Acute Promyelocytic Leukemia</td>
                <td>Tretinoin</td>
                <td>
                  <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
                    <PMIDLink pmids={'1850498'} />
                    <FdaApprovalLink
                      approval={'Tretinoin'}
                      year={'1995'}
                      link={
                        'https://www.accessdata.fda.gov/drugsatfda_docs/label/2023/020438s007s008lbl.pdf'
                      }
                    />
                  </WithSeparator>
                </td>
              </tr>
              <tr>
                <td>Arsenic Trioxide</td>
                <td>
                  <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
                    <PMIDLink pmids={'11559723'} />
                    <FdaApprovalLink
                      approval={'Arsenic Trioxide'}
                      year={'2000'}
                      link={
                        'https://www.accessdata.fda.gov/drugsatfda_docs/label/2020/021248s019lbl.pdf'
                      }
                    />
                  </WithSeparator>
                </td>
              </tr>
              <tr>
                <td>Tretinoin + Arsenic Trioxide</td>
                <td>
                  <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
                    <PMIDLink pmids={'23841729'} />
                    <FdaApprovalLink
                      approval={'Arsenic Trioxide + Tretinoin'}
                      year={'2000'}
                      link={
                        'https://www.accessdata.fda.gov/drugsatfda_docs/label/2020/021248s019lbl.pdf'
                      }
                    />
                  </WithSeparator>
                </td>
              </tr>
              <tr>
                <td>2</td>
                <td>
                  <GenePageLink hugoSymbol={'ERBB2'} />
                </td>
                <td>
                  {' '}
                  <AlterationPageLink
                    hugoSymbol={'ERBB2'}
                    alteration={'Amplification'}
                  />
                </td>
                <td>Biliary Tract Cancer</td>
                <td>Trastuzumab + Pertuzumab</td>
                <td>
                  Inclusion in Biliary Tract Cancer NCCN guidelines (v2.2023)
                </td>
              </tr>
              <tr>
                <td>R2</td>
                <td>
                  <GenePageLink hugoSymbol={'EGFR'} />
                </td>
                <td>
                  <AlterationPageLink
                    hugoSymbol={'EGFR'}
                    alteration={'L792H'}
                  />
                </td>
                <td>Non-Small Cell Lung Cancer</td>
                <td>Osimertinib</td>
                <td>
                  <PMIDLink
                    pmids={'28093244, 28625641, 29506987, 29857056, 34526717'}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </Row>
      </span>,
    ],
    changedAnnotations: [
      {
        content: [
          [
            'ESR1',
            <span>
              Oncogenic ligand-binding domain in-frame insertions or deletions
            </span>,
            'Breast Cancer',
            'Elacestrant',
            '3A',
            '2',
            'Inclusion in Breast Cancer NCCN guidelines (v4.2023)',
          ],
          [
            'KRAS',
            'G12C',
            'Pancreatic Adenocarcinoma',
            'Adagrasib, Sotorasib',
            '3A',
            '2',
            'Inclusion in Pancreatic Cancer NCCN guidelines (v1.2023)',
          ],
        ],
      },
    ],
    news: [
      <span>
        Updated therapeutic implications - Removal of therapies for variants
        with a level of evidence
        <Row className={'overflow-auto'}>
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: 2 }}>Gene</th>
                <th>Mutation</th>
                <th>Cancer Type</th>
                <th>Current Level of Evidence</th>
                <th>Drug(s) removed from OncoKB</th>
                <th>Drug(s) remaining in OncoKB</th>
                <th>Evidence</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <GenePageLink hugoSymbol={'FGFR2'} />
                </td>
                <td>
                  <AlterationPageLink
                    hugoSymbol={'FGFR2'}
                    alteration={'Fusions'}
                  />
                </td>
                <td>Cholangiocarcinoma</td>
                <td>1</td>
                <td rowSpan={3}>Infigratinib</td>
                <td>Pemigatinib, Futibatinib</td>
                <td rowSpan={3}>
                  <Linkout
                    link={
                      'https://professionals.optumrx.com/content/dam/optum3/professional-optumrx/news/rxnews/drug-withdrawls/drugwithdrawal_truseltiq_2022-1117.pdf'
                    }
                  >
                    Discontinuation of infigratinib
                  </Linkout>
                </td>
              </tr>
              <tr>
                <td>
                  <GenePageLink hugoSymbol={'FGFR1'} />
                </td>
                <td>
                  <AlterationPageLink
                    hugoSymbol={'FGFR1'}
                    alteration={'Amplification'}
                  />
                </td>
                <td>Lung Squamous Cell Carcinoma</td>
                <td>3A</td>
                <td>Debio1347, Erdafitinib</td>
              </tr>
              <tr>
                <td>{convertGeneInputToLinks('FGFR1, FGFR2, FGFR3')}</td>
                <td>Oncogenic Mutations</td>
                <td>All Solid Tumors</td>
                <td>4</td>
                <td>Debio1347, Erdafitinib, AZD4547</td>
              </tr>
            </tbody>
          </table>
        </Row>
      </span>,
    ],
    newlyAddedGenes: ['ALDH1L2', 'FOLH1', 'IQGAP1', 'POU3F4', 'TIGAR'],
  },
  '04122023': {
    priorityNews: [
      <span>
        Release of NEW cancer-type pages, allowing easier visualization of
        variant and cancer type-specific clinical implications. As an example,
        see tables for treatment, diagnostic and prognostic implications on the{' '}
        <AlterationPageLink
          hugoSymbol={'ABL1'}
          alteration={'BCR-ABL1 Fusion'}
          cancerType={'B-lymphoblastic leukemia/lymphoma'}
        >
          BCR-ABL1, B-lymphoblastic leukemia/lymphoma
        </AlterationPageLink>{' '}
        cancer-type page.
      </span>,
      <span>
        Release of therapeutic descriptions for all alteration- and tumor
        type-specific leveled associations. These are located on the variant-
        and cancer-type pages. See{' '}
        <AlterationPageLink hugoSymbol={'BRAF'} alteration={'V600E'}>
          BRAF V600E
        </AlterationPageLink>{' '}
        as an example.
      </span>,
    ],
    newlyAddedGenes: ['MERTK'],
  },
  '03222023': {
    priorityNews: [
      <span>
        Release of <SopPageLink version={3} />.
      </span>,
      <span>
        We have updated our <Link to={PAGE_ROUTE.FAQ_ACCESS}>FAQ page</Link>{' '}
        with the most commonly asked questions of 2022. Take a look at what our
        users are asking us.
      </span>,
      <span>
        This release contains significant data updates including to citations,
        mutation effect descriptions, etc. in alignment with our current SOP.
      </span>,
    ],
    newlyAddedGenes: [
      'ACKR3',
      'ECSIT',
      'FES',
      'HSD17B2',
      'ID1',
      'KAT7',
      'LRP1B',
      'MAL2',
      'MBD4',
      'MEF2C',
      'PHF19',
      'TNFSF13',
      'UBE2A',
    ],
  },
  '02102023': {
    changedAnnotations: [
      {
        columnHeaderType: AnnotationColumnHeaderType.ADDITIONAL_DIFF_LEVEL_DRUG,
        title:
          'Changed annotation and addition of therapies for variants with a level of evidence',
        content: [
          [
            'ESR1',
            'Oncogenic Ligand-Binding Domain Missense Mutations (310_547)',
            'Breast Cancer',
            '3A',
            '1',
            <span>
              Fulvestrant
              <br />
              (Level 3A)
            </span>,
            <span>
              Elacestrant
              <br />
              (Level 1)
            </span>,
            <FdaApprovalLink
              approval={'elacestrant in breast cancer'}
              link={
                'https://www.fda.gov/drugs/resources-information-approved-drugs/fda-approves-elacestrant-er-positive-her2-negative-esr1-mutated-advanced-or-metastatic-breast-cancer'
              }
            />,
          ],
          [
            'ESR1',
            'Oncogenic Ligand-Binding Domain In-Frame Insertions or Deletions (310_547)',
            'Breast Cancer',
            '3A',
            '3A',
            <span>
              Fulvestrant
              <br />
              (Level 3A)
            </span>,
            <span>
              Elacestrant
              <br />
              (Level 3A)
            </span>,
            <>
              <FdaApprovalLink
                approval={'elacestrant in breast cancer'}
                link={
                  'https://www.fda.gov/drugs/resources-information-approved-drugs/fda-approves-elacestrant-er-positive-her2-negative-esr1-mutated-advanced-or-metastatic-breast-cancer'
                }
              />{' '}
              <span>
                (Level 1 ESR1 mutations limited to those specified in
                corresponding FDA-approved CDx)
              </span>
            </>,
          ],
        ],
      },
    ],
  },
  '01052023': {
    news: [
      <span>
        Happy New Year! 2022 brought many changes to the landscape of precision
        oncology. The OncoKB 2022 year in review can be found{' '}
        <YearEndReviewPageLink year={'2022'}>HERE</YearEndReviewPageLink>.
      </span>,
    ],
  },
  '12222022': {
    priorityNews: [
      <span>
        Happy Holidays! OncoKB mutation effect descriptions are now available to
        all users on our website, in cBioPortal and through our API. These
        descriptions summarize the data supporting the biological and oncogenic
        effect designation for each alteration, and represent seven years of
        effort from the OncoKB scientific team.
      </span>,
    ],
    changedAnnotations: [
      {
        columnHeaderType: AnnotationColumnHeaderType.ADDITIONAL_SAME_LEVEL_DRUG,
        content: [
          [
            'KRAS',
            'G12C',
            'Non-Small Cell Lung Cancer',
            '1',
            'Sotorasib',
            <span>
              Adagrasib
              <br />
              (Level 1)
            </span>,
            <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
              <FdaApprovalLink
                approval={'adagrasib in NSCLC'}
                link={
                  'https://www.fda.gov/drugs/resources-information-approved-drugs/fda-grants-accelerated-approval-adagrasib-kras-g12c-mutated-nsclc'
                }
              />
              <AbstractLink
                abstract={'Spira et al. Abstract# 9002, ASCO 2022'}
                link={
                  'https://meetings.asco.org/abstracts-presentations/208088'
                }
              />
            </WithSeparator>,
          ],
        ],
      },
    ],
  },
  '12132022': {
    newlyAddedGenes: [
      'ATP1A1',
      'FUS',
      'HMGA1',
      'HMGA2',
      'HTATIP2',
      'INTS6',
      'TRIM27',
      'ZFP36L2',
    ],
    changedAnnotations: [
      {
        columnHeaderType: AnnotationColumnHeaderType.ADDITIONAL_SAME_LEVEL_DRUG,
        content: [
          [
            'IDH1',
            'R132C/H/L/G/S',
            'Acute Myeloid Leukemia',
            '1',
            'Ivosidenib',
            <span>
              Olutasidenib
              <br />
              (Level 1)
            </span>,
            <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
              <FdaApprovalLink
                approval={'olutasidenib in AML'}
                link={
                  'https://www.fda.gov/drugs/resources-information-approved-drugs/fda-approves-olutasidenib-relapsed-or-refractory-acute-myeloid-leukemia-susceptible-idh1-mutation'
                }
              />
              <AbstractLink
                abstract={'Cortes et al. Abstract #6193, ASH 2022'}
                link={
                  'https://ashpublications.org/blood/article/140/Supplement%201/6193/487212'
                }
              />
            </WithSeparator>,
          ],
        ],
      },
    ],
  },
  '10282022': {
    updatedImplicationTitle:
      'Updated therapeutic implications - new alterations with a level of evidence',
    updatedImplication: [
      [
        '1',
        'RET',
        'Fusions',
        'All Solid Tumors',
        'Selpercatinib',
        <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
          <FdaApprovalLink
            approval={'selpercatinib in solid tumors'}
            link={
              'https://www.fda.gov/drugs/resources-information-approved-drugs/fda-approves-selpercatinib-locally-advanced-or-metastatic-ret-fusion-positive-solid-tumors'
            }
          />
          <AbstractLink
            abstract={'Subbiah et al. Abstract# 3094, ASCO 2022'}
            link={
              'https://ascopubs.org/doi/abs/10.1200/JCO.2022.40.16_suppl.3094'
            }
          />
        </WithSeparator>,
      ],
      [
        '3A',
        'TP53',
        'Y220C',
        'All Solid Tumors',
        'PC14586',
        <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
          <AbstractLink
            abstract={'Dumbrava et al. Abstract# 3003, ASCO 2022'}
            link={
              'https://ascopubs.org/doi/abs/10.1200/JCO.2022.40.16_suppl.3003'
            }
          />
          <AbstractLink
            abstract={'Dumble et al. Abstract# LB006, AACR 2021'}
            link={
              'https://aacrjournals.org/cancerres/article/81/13_Supplement/LB006/669897/Abstract-LB006-PC14586-The-first-orally'
            }
          />
        </WithSeparator>,
      ],
      [
        '4',
        'PIK3CA',
        'Oncogenic Mutations',
        'All Solid Tumors',
        'RLY-2608',
        <AbstractLink
          abstract={'Perez et al. Abstract# TPS1124, ASCO 2022'}
          link={
            'https://ascopubs.org/doi/abs/10.1200/JCO.2022.40.16_suppl.TPS1124'
          }
        />,
      ],
      [
        '4',
        'PIK3CA',
        'H1047R',
        'All Solid Tumors (excluding Colorectal Cancer)',
        'LOXO-783',
        <AbstractLink
          abstract={'Klippel et al. Abstract# P142, AACR-NCI-EORTC 2021'}
          link={
            'https://aacrjournals.org/mct/article/20/12_Supplement/P142/675896/Abstract-P142-Preclinical-characterization-of-LOX'
          }
        />,
      ],
      [
        '4',
        'CCNE1',
        'Amplification',
        'All Solid Tumors',
        'RP-6306, BLU-222',
        <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
          <AbstractLink
            abstract={'Brown et al. Abstract# 2306, AACR 2022'}
            link={
              'https://aacrjournals.org/cancerres/article/82/12_Supplement/2306/703534'
            }
          />
          <PMIDLink pmids={'35444283'} />
        </WithSeparator>,
      ],
      [
        '4',
        'KRAS',
        'G12D',
        'All Solid Tumors',
        'RMC-6236',
        <AbstractLink
          abstract={'Koltun et al. Abstract# 3597, AACR 2022'}
          link={
            'https://aacrjournals.org/cancerres/article/82/12_Supplement/3597/702320/Abstract-3597-Direct-targeting-of-KRASG12X-mutant'
          }
        />,
      ],
    ],
    changedAnnotations: [
      {
        columnHeaderType: AnnotationColumnHeaderType.ADDITIONAL_SAME_LEVEL_DRUG,
        content: [
          [
            'FGFR2',
            'Fusions',
            'Cholangiocarcinoma',
            '1',
            'Infigratinib, Pemigatinib',
            <>
              Futibatinib
              <br />
              (Level 1)
            </>,
            <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
              <FdaApprovalLink
                link={
                  'https://www.fda.gov/drugs/resources-information-approved-drugs/fda-grants-accelerated-approval-futibatinib-cholangiocarcinoma'
                }
                approval={'futibatinib in cholangiocarcinoma'}
              />
              <AbstractLink
                abstract={'Goyal et al. Abstract# 4009, ASCO 2022'}
                link={
                  'https://ascopubs.org/doi/abs/10.1200/JCO.2022.40.16_suppl.4009'
                }
              />
            </WithSeparator>,
          ],
          [
            'MET',
            'Amplification',
            'Non-Small Cell Lung Cancer',
            '2',
            'Crizotinib, Capmatinib, Tepotinib',
            <>
              Telisotuzumab Vedotin
              <br />
              (Level 3A)
            </>,
            <AbstractLink
              abstract={'Camidge et al. Abstract# 9016, ASCO 2022'}
              link={
                'https://ascopubs.org/doi/abs/10.1200/JCO.2022.40.16_suppl.9016'
              }
            />,
          ],
          [
            'PIK3CA',
            'C420R, E542K, E545A, E545D, E545G, E545K, Q546E, Q546R, H1047L, H1047R, H1047Y',
            'Breast Cancer',
            '1',
            'Alpelisib + Fulvestrant',
            <>
              RLY-2608 + Fulvestrant
              <br />
              (Level 4)
            </>,
            <AbstractLink
              abstract={'Perez et al. Abstract# TPS1124, ASCO 2022'}
              link={
                'https://ascopubs.org/doi/abs/10.1200/JCO.2022.40.16_suppl.TPS1124'
              }
            />,
          ],
          [
            'PIK3CA',
            'Oncogenic Mutations (excluding C420R, E542K, E545A, E545D, E545G, E545K, Q546E, Q546R, H1047L, H1047R, and H1047Y)',
            'Breast Cancer',
            '2',
            'Alpelisib + Fulvestrant',
            <>
              RLY-2608 + Fulvestrant
              <br />
              (Level 4)
            </>,
            <AbstractLink
              abstract={'Perez et al. Abstract# TPS1124, ASCO 2022'}
              link={
                'https://ascopubs.org/doi/abs/10.1200/JCO.2022.40.16_suppl.TPS1124'
              }
            />,
          ],
          [
            'PIK3CA',
            'H1047R',
            'Breast Cancer',
            '1',
            'Alpelisib + Fulvestrant',
            <>
              LOXO-783 + Fulvestrant +/- Abemaciclib, LOXO-783 + LY3484356 +/-
              Abemaciclib, LOXO-783 + Aromitase Inhibitors + Abemaciclib,
              LOXO-783 + Nab-Paclitaxel
              <br />
              (Level 4)
            </>,
            <AbstractLink
              abstract={'Klippel et al. Abstract# P142, AACR-NCI-EORTC 2021'}
              link={
                'https://aacrjournals.org/mct/article/20/12_Supplement/P142/675896/Abstract-P142-Preclinical-characterization-of-LOX'
              }
            />,
          ],
        ],
      },
    ],
    newlyAddedGenes: ['MYH11', 'PUM1', 'FBXW2', 'NUP214'],
  },
  '09062022': {
    updatedImplicationTitle:
      'Updated therapeutic implications - new alterations with a level of evidence',
    updatedImplication: [
      [
        '1',
        'BRAF',
        'V600E',
        'All Solid Tumors (excluding Colorectal Cancer)',
        'Dabrafenib + Trametinib',
        <FdaApprovalLink
          approval={'dabrafenib + trametinib in solid tumors'}
          link={
            'https://www.fda.gov/drugs/resources-information-approved-drugs/fda-grants-accelerated-approval-dabrafenib-combination-trametinib-unresectable-or-metastatic-solid'
          }
        />,
      ],
    ],
    changedAnnotations: [
      {
        content: [
          [
            'BRAF',
            'V600E',
            'Biliary Tract Cancer, Diffuse Glioma, Encapsulated Glioma, Ganglioglioma, Pleomorphic Xanthoastrocytoma, Pilocytic Astrocytoma',
            'Dabrafenib + Trametinib',
            '2',
            '1',
            <FdaApprovalLink
              approval={'dabrafenib + trametinib in solid tumors'}
              link={
                'https://www.fda.gov/drugs/resources-information-approved-drugs/fda-grants-accelerated-approval-dabrafenib-combination-trametinib-unresectable-or-metastatic-solid'
              }
            />,
          ],
          [
            'ERBB2',
            'Oncogenic Mutations',
            'Non-Small Cell Lung Cancer',
            'Trastuzumab Deruxtecan',
            '2',
            '1',
            <FdaApprovalLink
              approval={'trastuzumab deruxtecan in non-small cell lung cancer'}
              link={
                'https://www.fda.gov/drugs/resources-information-approved-drugs/fda-grants-accelerated-approval-fam-trastuzumab-deruxtecan-nxki-her2-mutant-non-small-cell-lung'
              }
            />,
          ],
          [
            'FGFR1',
            'Fusions',
            'Myeloid/Lymphoid Neoplasms with FGFR1 Rearrangement',
            'Pemigatinib',
            '2',
            '1',
            <FdaApprovalLink
              approval={'pemigatinib in myeloid/lymphoid neoplasms'}
              link={
                'https://www.fda.gov/drugs/resources-information-approved-drugs/fda-approves-pemigatinib-relapsed-or-refractory-myeloidlymphoid-neoplasms-fgfr1-rearrangement'
              }
            />,
          ],
        ],
      },
    ],
    newlyAddedGenes: ['MKI67', 'BRD3', 'BRSK1', 'BCL3'],
  },
  '07252022': {
    updatedImplicationTitle:
      'Updated therapeutic implications - new alterations with a level of evidence',
    updatedImplication: [
      [
        '3A',
        'KMT2A',
        'Fusions',
        'B-Lymphoblastic Leukemia/Lymphoma, Acute Myeloid Leukemia',
        'SNDX-5613 (Menin inhibitor)',
        <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
          <PMIDLink pmids={'31855575'} />
          <AbstractLink
            abstract={'Stein et al. Abstract# 699, ASH 2021 '}
            link={
              'https://ashpublications.org/blood/article/138/Supplement%201/699/479484/Safety-and-Efficacy-of-Menin-Inhibition-in'
            }
          />
        </WithSeparator>,
      ],
      [
        '3A',
        'NPM1',
        'Oncogenic Mutations',
        'Acute Myeloid Leukemia',
        'SNDX-5613 (Menin inhibitor)',
        <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
          <PMIDLink pmids={'31855575'} />
          <AbstractLink
            abstract={'Stein et al. Abstract# 699, ASH 2021 '}
            link={
              'https://ashpublications.org/blood/article/138/Supplement%201/699/479484/Safety-and-Efficacy-of-Menin-Inhibition-in'
            }
          />
        </WithSeparator>,
      ],
    ],
    changedAnnotations: [
      {
        content: [
          [
            'ALK',
            'Fusions',
            'Inflammatory Myofibroblastic Tumor',
            'Crizotinib',
            '2',
            '1',
            <FdaApprovalLink
              approval={'crizotinib in inflammatory myofibroblastic tumor'}
              link={
                'https://www.fda.gov/drugs/resources-information-approved-drugs/fda-approves-crizotinib-alk-positive-inflammatory-myofibroblastic-tumor'
              }
            />,
          ],
        ],
      },
      {
        columnHeaderType: AnnotationColumnHeaderType.ADDITIONAL_SAME_LEVEL_DRUG,
        content: [
          [
            'NRG1',
            'Fusions',
            'Non-Small Cell Lung Cancer',
            '3A',
            'Zenocutuzumab',
            <>
              Seribantumab
              <br />
              (Level 3A)
            </>,
            <AbstractLink
              abstract={'Carrizosa et al. Abstract# 3006, ASCO 2022'}
              link={
                'https://ascopubs.org/doi/abs/10.1200/JCO.2022.40.16_suppl.3006'
              }
            />,
          ],
        ],
      },
    ],
    news: [
      <span>
        Updated therapeutic implications - Removal of therapies for variants
        with a level of evidence
        <Row className={'overflow-auto'}>
          <table className="table">
            <thead>
              <tr>
                <th>Gene</th>
                <th>Mutation</th>
                <th>Cancer Type</th>
                <th>Current Level of Evidence</th>
                <th>Drug(s) removed from OncoKB</th>
                <th>Drug remaining in OncoKB</th>
                <th>Evidence</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <GenePageLink hugoSymbol={'ESR1'} />
                </td>
                <td>Oncogenic Mutations</td>
                <td>Breast Cancer</td>
                <td>3A</td>
                <td>AZD9496</td>
                <td>Fulvestrant</td>
                <td>
                  <PMIDLink pmids={'32234755'} />
                </td>
              </tr>
            </tbody>
          </table>
        </Row>
      </span>,
    ],
  },
  '06062022': {
    changedAnnotations: [
      {
        content: [
          [
            'BRAF',
            'V600E',
            'Biliary Tract Cancer',
            'Dabrafenib + Trametinib',
            '3A',
            '2',
            <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
              <NccnLink version={'v1.2022'} cancerType={'Hepatobiliary'} />
              <PMIDLink pmids={'32818466, 32758030'} />
            </WithSeparator>,
          ],
        ],
      },
      {
        columnHeaderType: AnnotationColumnHeaderType.ADDITIONAL_SAME_LEVEL_DRUG,
        content: [
          [
            'ALK',
            'Fusions',
            'Inflammatory Myofibroblastic Tumor',
            '2',
            'Crizotinib, Ceritinib, Brigatinib',
            <>
              Brigatinib
              <br />
              (Level 2)
            </>,
            <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
              <NccnLink
                cancerType={'Soft Tissue Sarcoma'}
                version={'v1.2022'}
              />
              <PMIDLink pmids={'28713152, 32868646, 33007314'} />
            </WithSeparator>,
          ],
          [
            'ROS1',
            'Fusions',
            'Non-Small Cell Lung Cancer',
            '1',
            'Crizotinib, Entrectinib',
            <>
              Repotrectinib
              <br />
              (Level 3A)
            </>,
            <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
              <FdaBreakthroughLink
                link={
                  'https://www.onclive.com/view/fda-grants-breakthrough-designation-to-repotrectinib-for-pretreated-ros1-metastatic-nsclc'
                }
              />
              <AbstractLink
                abstract={'Cho et al. Abstract# MA11.07, IASLC 2021'}
                link={
                  'https://www.jto.org/article/S1556-0864(21)00293-8/fulltext'
                }
              />
            </WithSeparator>,
          ],
          [
            'NTRK1, NTRK2, NTRK3',
            'Fusions',
            'All Solid Tumors',
            '1',
            'Larotrectinib, Entrectinib',
            <>
              Repotrectinib
              <br />
              (Level 3A)
            </>,
            <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
              <FdaBreakthroughLink
                link={
                  'https://www.onclive.com/view/fda-grants-breakthrough-designation-to-repotrectinib-for-pretreated-ros1-metastatic-nsclc'
                }
              />
              <AbstractLink
                abstract={'Cho et al. Abstract# MA11.07, IASLC 2021'}
                link={
                  'https://www.jto.org/article/S1556-0864(21)00293-8/fulltext'
                }
              />
            </WithSeparator>,
          ],
        ],
      },
    ],
  },
  '05052022': {
    priorityNews: [
      <span>
        We loved connecting with so many of you at the 2022 AACR annual meeting.
        If you missed our poster, you can download a copy{' '}
        <a href="content/files/poster/AACR_poster_2022v2.pdf" download>
          here
        </a>
      </span>,
    ],
    changedAnnotations: [
      {
        columnHeaderType: AnnotationColumnHeaderType.ADDITIONAL_SAME_LEVEL_DRUG,
        content: [
          [
            'EGFR',
            'S768I, L861Q, G719',
            'Non-Small Cell Lung Cancer',
            '1',
            'Afatinib',
            <>
              Osimertinib
              <br />
              (Level 2)
            </>,
            <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
              <span>Listing in NSCLC NCCN v1.2022</span>
              <PMIDLink pmids={'31825714'} />
            </WithSeparator>,
          ],
          [
            'ROS1',
            'Fusions',
            'Non-Small Cell Lung Cancer',
            '1',
            'Crizotinib, Entrectinib',
            <>
              Ceritinib
              <br />
              (Level 2)
            </>,
            <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
              <span>Listing in NSCLC NCCN v1.2022</span>
              <PMIDLink pmids={'28520527'} />
            </WithSeparator>,
          ],
          [
            'ROS1',
            'Fusions',
            'Non-Small Cell Lung Cancer',
            '1',
            'Crizotinib, Entrectinib',
            <>
              Lorlatinib
              <br />
              (Level 2)
            </>,
            <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
              <span>Listing in NSCLC NCCN v1.2022</span>
              <PMIDLink pmids={'31669155'} />
            </WithSeparator>,
          ],
          [
            'MET',
            'Amplifications',
            'Non-Small Cell Lung Cancer',
            '2',
            'Crizotinib',
            <>
              Capmatinib
              <br />
              (Level 2)
            </>,
            <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
              <span>Listing in NSCLC NCCN v1.2022</span>
              <PMIDLink pmids={'32877583'} />
            </WithSeparator>,
          ],
          [
            'MET',
            'Amplifications',
            'Non-Small Cell Lung Cancer',
            '2',
            'Crizotinib',
            <>
              Tepotinib
              <br />
              (Level 2)
            </>,
            <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
              <span>Listing in NSCLC NCCN v1.2022</span>
              <AbstractLink
                abstract={'Le et al. Abstract# 9021, ASCO 2021'}
                link={
                  'https://ascopubs.org/doi/abs/10.1200/JCO.2021.39.15_suppl.9021'
                }
              />
            </WithSeparator>,
          ],
          [
            'KRAS',
            'G12C',
            'Pancreatic Cancer',
            '3A',
            'Adagrasib',
            <>
              Sotorasib
              <br />
              (Level 3A)
            </>,
            <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
              <AbstractLink
                abstract={'Strickler et al. Abstract# 360490, ASCO GI 2022'}
                link={
                  'https://ascopubs.org/doi/abs/10.1200/JCO.2022.40.36_suppl.360490'
                }
              />
            </WithSeparator>,
          ],
          [
            'FGFR2',
            'Fusions',
            'Cholangiocarcinoma',
            '1',
            'Infigratinib, Pemigatinib',
            <>
              Futibatinib
              <br />
              (Level 3A)
            </>,
            <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
              <AbstractLink
                abstract={'Goyal et al. Abstract# CT010, AACR 2021'}
                link={
                  'https://aacrjournals.org/cancerres/article/81/13_Supplement/CT010/669687/Abstract-CT010-Primary-results-of-phase-2-FOENIX'
                }
              />
            </WithSeparator>,
          ],
        ],
      },
    ],
    newlyAddedGenes: ['AFF4'],
  },
  '03292022': {
    updatedImplication: [
      [
        '2',
        'BRCA2',
        'Oncogenic Mutations',
        'Uterine Sarcoma',
        'Olaparib, Rucaparib, Niraparib',
        <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
          <span>Listing in Uterine cancer NCCN v1.2022</span>
          <PMIDLink pmids={'33970096'} />
        </WithSeparator>,
      ],
      [
        '2',
        'PALB2',
        'Oncogenic Mutations',
        'Pancreatic Cancer',
        'Rucaparib',
        <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
          <span>Listing in Pancreatic cancer NCCN v1.2022</span>
          <PMIDLink pmids={'33970687, 34351646, 30051098'} />
        </WithSeparator>,
      ],
    ],
    changedAnnotations: [
      {
        content: [
          [
            'BRCA1, BRCA2',
            'Oncogenic Mutations',
            'Pancreatic Cancer',
            'PARPi',
            '3A',
            '2',
            <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
              <span>
                Listing of Rucaparib in Pancreatic cancer NCCN v1.2022
              </span>
              <PMIDLink pmids={'33970687, 34351646, 30051098'} />
            </WithSeparator>,
          ],
        ],
      },
    ],
    news: [
      <span>
        Statistically recurrent hotspots per cancerhotspots.org that have not
        been curated by {ONCOKB_TM} are now considered "Likely Oncogenic" (the
        concept “Predicted Oncogenic” has been removed).
      </span>,
      <span>
        API information (<Linkout link={'https://www.oncokb.org/api/v1/info'} />
        ) now includes the software version which, together with the data
        version, can be used to update instances of local annotation.
      </span>,
    ],
  },
  '02282022': {
    priorityNews: [<NewlyAddedGenesListItem genes={['LTK', 'EXT1']} />],
    updatedImplication: [
      [
        '3A',
        'EGFR',
        'Exon 19 deletion, Exon 19 insertion, G719, L858R, L861Q, S768I',
        'Non-Small Cell Lung Cancer',
        'Patritumab Deruxtecan',
        <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
          <span>FDA Breakthrough Therapy designation</span>
          <PMIDLink pmids={'34548309'} />
        </WithSeparator>,
      ],
      [
        '3A',
        'EGFR',
        'Exon 20 in-frame insertions',
        'Non-Small Cell Lung Cancer',
        'CLN-081',
        <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
          <span>FDA Breakthrough Therapy designation</span>
          <AbstractLink
            link={'https://ascopubs.org/doi/10.1200/JCO.2021.39.15_suppl.9077'}
            abstract={'Piotrowska et al. Abstract# 9077, ASCO 2021.'}
          />
        </WithSeparator>,
      ],
      [
        '3A',
        'ERBB2',
        'Oncogenic Mutations',
        'Non-Small Cell Lung Cancer',
        'Trastuzumab + Pertuzumab + Docetaxel',
        <PMIDLink pmids={'35073148'} />,
      ],
      [
        '3A',
        'KRAS',
        'G12C',
        'Gastrointestinal Cancers (excluding Colorectal and Appendiceal Cancer), Pancreatic Adenocarcinoma',
        'Adagrasib',
        <AbstractLink
          link={'https://ascopubs.org/doi/abs/10.1200/JCO.2022.40.4_suppl.519'}
          abstract={
            'Bekaii-Saab et al. Abstract# 519, ASCO GI Symposium, 2022.'
          }
        />,
      ],
    ],
  },
  '01072022': {
    priorityNews: [
      <span>
        In addition to the previously provided reference genome, gene pages will
        now include gene chromosomal locations. See{' '}
        <GenePageLink hugoSymbol={'BRAF'} /> as an example.
      </span>,
    ],
    updatedImplication: [
      [
        '4',
        'STK11',
        'Oncogenic Mutations',
        'Non-Small Cell Lung Cancer',
        'Bemcentinib + Pembrolizumab',
        <AbstractLink
          link={'https://jitc.bmj.com/content/9/Suppl_2/A632'}
          abstract={'Li et al. Abstract # 602, JITC 2021'}
        />,
      ],
    ],
  },
  '11292021': {
    priorityNews: [
      <span>
        Release of <SopPageLink version={2.2} />
      </span>,
      <NewlyAddedGenesListItem
        genes={['POLG', 'IL6ST', 'WWP1']}
        title={'New Genes Added'}
      />,
    ],
    updatedImplication: [
      [
        '1',
        'ABL1',
        'T315I',
        'Chronic Myelogenous Leukemia',
        'Asciminib',
        <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
          <FdaApprovalLink
            link={
              'https://www.fda.gov/drugs/resources-information-approved-drugs/fda-approves-asciminib-philadelphia-chromosome-positive-chronic-myeloid-leukemia'
            }
            approval={'Asciminib'}
          />
          <AbstractLink
            link={'https://ash.confex.com/ash/2020/webprogram/Paper143816.html'}
            abstract={'Hochhaus et al. Abstract #LBA-4, ASH 2020'}
          />
        </WithSeparator>,
      ],
      [
        '3A',
        'IDH1',
        'R132',
        'Glioma',
        'Ivosidenib',
        <PMIDLink pmids={'29670690, 32530764'} />,
      ],
      [
        '3A',
        'KRAS',
        'G12C',
        'Colorectal Cancer',
        'Adagrasib, Adagrasib + Cetuximab',
        <AbstractLink
          link={
            'https://oncologypro.esmo.org/meeting-resources/esmo-congress-2021/krystal-1-adagrasib-mrtx849-as-monotherapy-or-combined-with-cetuximab-cetux-in-patients-pts-with-colorectal-cancer-crc-harboring-a-krasg12'
          }
          abstract={'Weiss et al. Abstract# LBA6, ESMO 2021'}
        />,
      ],
      [
        '4',
        'MDM2',
        'Amplification',
        'Dedifferentiated Liposarcoma, Well-Differentiated Liposarcoma',
        'Milademetan',
        <PMIDLink pmids={'23400593'} />,
      ],
    ],
    updatedImplicationTitle:
      'Updated therapeutic implications: New variants with a level of evidence',
    changedAnnotations: [
      {
        title: 'Updated therapeutic implications: Changed annotations',
        content: [
          [
            'ABL1',
            'BCR-ABL1 Fusion',
            'Chronic Myelogenous Leukemia',
            'Asciminib',
            '3A',
            '1',
            <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
              <FdaApprovalLink
                link={
                  'https://www.fda.gov/drugs/resources-information-approved-drugs/fda-approves-asciminib-philadelphia-chromosome-positive-chronic-myeloid-leukemia'
                }
                approval={'Asciminib'}
              />
              <PMIDLink pmids={'34407542'} />
            </WithSeparator>,
          ],
          [
            'BRCA1, BRCA2',
            'Oncogenic Mutations',
            'Breast Cancer',
            'Olaparib, Talazoparib',
            '2',
            '3A',
            <span>
              Strict adherence to FDA drug labels for{' '}
              <Linkout
                link={
                  'https://www.accessdata.fda.gov/drugsatfda_docs/label/2020/208558s014lbl.pdf'
                }
              >
                olaparib
              </Linkout>{' '}
              and{' '}
              <Linkout
                link={
                  'https://www.accessdata.fda.gov/drugsatfda_docs/label/2018/211651s000lbl.pdf'
                }
              >
                talazoparib
              </Linkout>
            </span>,
          ],
          [
            'MET',
            <AlterationPageLink hugoSymbol={'MET'} alteration={'Y1003'}>
              {' '}
              Y1003mut{' '}
            </AlterationPageLink>,
            'Non-Small Cell Lung Cancer',
            'Tepotinib, Capmatinib',
            '1',
            '3A',
            <span>
              Strict adherence to FDA drug labels for{' '}
              <Linkout
                link={
                  'https://www.accessdata.fda.gov/drugsatfda_docs/label/2021/214096s000lbl.pdf'
                }
              >
                tepotinib
              </Linkout>{' '}
              and{' '}
              <Linkout
                link={
                  'https://www.accessdata.fda.gov/drugsatfda_docs/label/2020/213591s000lbl.pdf'
                }
              >
                capmatinib
              </Linkout>
            </span>,
          ],
          [
            'MET',
            <AlterationPageLink hugoSymbol={'MET'} alteration={'Y1003'}>
              {' '}
              Y1003mut{' '}
            </AlterationPageLink>,
            'Non-Small Cell Lung Cancer',
            'Crizotinib',
            '2',
            '3A',
            <span>
              Strict adherence to listing in NCCN Non-Small Cell Lung Cancer
              v7.2021
            </span>,
          ],
        ],
      },
    ],
    news: [
      <span>
        Updated therapeutic implications: Updated variant annotations to more
        accurately reflect the evidence
        <SimpleTable
          columns={[
            { name: 'Level' },
            { name: 'Gene' },
            { name: 'Previous Variant Annotation' },
            { name: 'Current Variant Annotation' },
            { name: 'Cancer Type' },
            { name: 'Drug' },
            { name: 'Evidence' },
          ]}
          rows={[
            [
              '1',
              <GenePageLink hugoSymbol="ALK" />,
              'Oncogenic Mutations',
              'Fusions',
              'Non-Small Cell Lung Cancer',
              'Brigatinib',
              <span>
                <Linkout
                  link={
                    'https://www.accessdata.fda.gov/drugsatfda_docs/label/2020/208772s008lbl.pdf'
                  }
                >
                  FDA drug label for brigatinib
                </Linkout>{' '}
                and adherence to <SopPageLink version={2.2} />
              </span>,
            ],
            [
              '2',
              <GenePageLink hugoSymbol="BRAF" />,
              'V600',
              'V600 (Excluding V600E, V600K)',
              'Melanoma',
              'Binimetinib + Encorafenib, Dabrafenib + Trametinib, Cobimetinib + Vemurafenib',
              <span>
                The NCCN Melanoma: Cutaneous v2.2021 lists “BRAF V600” and is
                not limited to V600E/K. Therefore, according to the{' '}
                <SopPageLink version={2.2} /> BRAF V600 is considered Level 2,
                while V600E/K are Level 1.
              </span>,
            ],
            [
              '2',
              <GenePageLink hugoSymbol="EZH2" />,
              'Oncogenic Mutations',
              'Oncogenic Mutations (Excluding Y646F, A692V, Y646C, Y646S, Y646N, Y646H, A682G)',
              'Follicular Lymphoma',
              'Tazemetostat',
              <span>
                The NCCN B-cell lymphoma v5.2021 lists “EZH2 mutation” and is
                not limited to the mutations listed in the FDA-approved CDx.
                Therefore, according to the <SopPageLink version={2.2} /> EZH2
                Oncogenic Mutations are considered Level 2, with the exception
                of those mutations listed in the CDx, which are Level 1.
              </span>,
            ],
            [
              '2',
              <GenePageLink hugoSymbol="PIK3CA" />,
              'Oncogenic Mutations',
              'Oncogenic Mutations (Excluding E545G, Q546E, E545A, H1047R, C420R, H1047Y, Q546R, H1047L, E542K, E545D, E545K)',
              'Breast Cancer',
              'Alpelisib+Fulvestrant',
              <span>
                The NCCN Breast Cancer V8.2021 lists “PIK3CA activating
                mutation” and is not limited to the mutations listed in the
                FDA-approved CDx. Therefore, PIK3CA Oncogenic Mutations by{' '}
                <SopPageLink version={2.2} /> are considered Level 2, with the
                exception of those mutations listed in the CDx, which are Level
                1.
              </span>,
            ],
          ].map((record, index) => {
            return {
              key: `11292021-ACCURATE-COLUMN-${index}`,
              content: record.map((subItem, subIndex) => {
                return {
                  key: `11292021-ACCURATE-COLUMN-${index}-${subIndex}`,
                  content: subItem,
                };
              }),
            };
          })}
          theadClassName={mainstyle.changedAnnotationTableHead}
        />
      </span>,
      <span>
        Updated therapeutic implications: Updated tumor type
        <SimpleTable
          columns={[
            { name: 'Level' },
            { name: 'Gene' },
            { name: 'Mutation' },
            { name: 'Previous Cancer Type' },
            { name: 'Current Cancer Type' },
            { name: 'Drug' },
            { name: 'Evidence' },
          ]}
          rows={[
            [
              '3A',
              <GenePageLink hugoSymbol={'PTCH1'} />,
              'Truncating Mutations',
              'Embryonal Tumor',
              'Medulloblastoma',
              'Sonidegib, Vismodegib',
              <PMIDLink
                pmids={'24523439, 32923880, 26169613, 31362788, 29515801'}
              />,
            ],
          ].map((record, index) => {
            return {
              key: `11292021-UPDATED-CANCER-TYPE-COLUMN-${index}`,
              content: record.map((subItem, subIndex) => {
                return {
                  key: `11292021-ACCURATE-COLUMN-${index}-${subIndex}`,
                  content: subItem,
                };
              }),
            };
          })}
          theadClassName={mainstyle.changedAnnotationTableHead}
        />
      </span>,
    ],
  },
  '10262021': {
    priorityNews: [
      <span>
        Updated therapeutic implications - 8 new associations
        <Row className={'overflow-auto'}>
          <table className="table">
            <thead>
              <tr style={{ whiteSpace: 'nowrap' }}>
                <th>Level</th>
                <th>Gene</th>
                <th>Mutation</th>
                <th>Cancer Type</th>
                <th>Drug</th>
                <th>Evidence</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>2</td>
                <td>
                  <GenePageLink hugoSymbol={'BRAF'} />
                </td>
                <td>V600E</td>
                <td>Encapsulated Glioma, Diffuse Glioma</td>
                <td>Dabrafenib + Trametinib, Vemurafenib + Cobimetinib</td>
                <td>
                  <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
                    <span>Listing in the CNS NCCN v1.2021</span>
                    <PMIDLink
                      pmids={'28984141, 29380516, 26287849, 30351999'}
                    />
                  </WithSeparator>
                </td>
              </tr>
              <tr>
                <td>2</td>
                <td>
                  <GenePageLink hugoSymbol={'BRAF'} />
                </td>
                <td>V600</td>
                <td>Langerhans Cell Histiocytosis</td>
                <td>Vemurafenib, Dabrafenib</td>
                <td>
                  <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
                    <span>Listing in Histiocytic Neoplasms NCCN v2.2021</span>
                    <PMIDLink pmids={'30867592'} />
                  </WithSeparator>
                </td>
              </tr>
              <tr>
                <td rowSpan={3}>2</td>
                <td rowSpan={3}>
                  <GenePageLink hugoSymbol={'BRAF'} />
                </td>
                <td rowSpan={3}>Oncogenic Mutations, excluding V600</td>
                <td>Erdheim-Chester Disease</td>
                <td rowSpan={3}>Cobimetinib, Trametinib</td>
                <td>
                  <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
                    <span>Listing in Histiocytic Neoplasms NCCN v2.2021</span>
                    <PMIDLink pmids={'30867592'} />
                  </WithSeparator>
                </td>
              </tr>
              <tr>
                <td>Langerhans Cell Histiocytosis</td>
                <td>
                  <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
                    <span>Listing in Histiocytic Neoplasms NCCN v2.2021</span>
                    <PMIDLink pmids={'30867592, 32991018'} />
                  </WithSeparator>
                </td>
              </tr>
              <tr>
                <td>Rosai-Dorfman Disease</td>
                <td>
                  <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
                    <span>Listing in Histiocytic Neoplasms NCCN v2.2021</span>
                    <PMIDLink pmids={'29236635'} />
                  </WithSeparator>
                </td>
              </tr>
              <tr>
                <td rowSpan={3}>2</td>
                <td rowSpan={3}>
                  <GenePageLink hugoSymbol={'ARAF'} />
                  {', '}
                  <GenePageLink hugoSymbol={'RAF1'} />
                  {', '}
                  <GenePageLink hugoSymbol={'KRAS'} />
                  {', '}
                  <GenePageLink hugoSymbol={'NRAS'} />
                  {', '}
                  <GenePageLink hugoSymbol={'MAP2K1'} />
                  {', '}
                  <GenePageLink hugoSymbol={'MAP2K2'} />
                </td>
                <td rowSpan={3}>Oncogenic Mutations</td>
                <td>Erdheim-Chester Disease</td>
                <td rowSpan={3}>Cobimetinib, Trametinib</td>
                <td>
                  <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
                    <span>Listing in Histiocytic Neoplasms NCCN v2.2021</span>
                    <PMIDLink pmids={'30867592'} />
                  </WithSeparator>
                </td>
              </tr>
              <tr>
                <td>Langerhans Cell Histiocytosis</td>
                <td>
                  <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
                    <span>Listing in Histiocytic Neoplasms NCCN v2.2021</span>
                    <PMIDLink pmids={'30867592, 32991018'} />
                  </WithSeparator>
                </td>
              </tr>
              <tr>
                <td>Rosai-Dorfman Disease</td>
                <td>
                  <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
                    <span>Listing in Histiocytic Neoplasms NCCN v2.2021</span>
                    <PMIDLink pmids={'29236635'} />
                  </WithSeparator>
                </td>
              </tr>
              <tr>
                <td>3A</td>
                <td>
                  <GenePageLink hugoSymbol={'BRAF'} />
                </td>
                <td>V600</td>
                <td>Histiocytosis</td>
                <td>Vemurafenib, Dabrafenib</td>
                <td>
                  <PMIDLink pmids={'25209580, 31213430, 31376203'} />
                </td>
              </tr>
              <tr>
                <td>3A</td>
                <td>
                  <GenePageLink hugoSymbol={'KRAS'} />
                </td>
                <td>Oncogenic Mutations</td>
                <td>Histiocytosis</td>
                <td>Cobimetinib, Trametinib</td>
                <td>
                  <PMIDLink pmids={'30361829'} />
                </td>
              </tr>
              <tr>
                <td>3A</td>
                <td>
                  <GenePageLink hugoSymbol={'NRG1'} />
                </td>
                <td>Fusions</td>
                <td>All Solid Tumors</td>
                <td>Zenocutuzumab</td>
                <td>
                  <AbstractLink
                    link={
                      'https://ascopubs.org/doi/abs/10.1200/JCO.2021.39.15_suppl.3003'
                    }
                    abstract={'Schram et al. Abstract#  3003, ASCO 2021'}
                  />
                </td>
              </tr>
              <tr>
                <td>R2</td>
                <td>
                  <GenePageLink hugoSymbol={'BTK'} />
                </td>
                <td>C481R, C481F, C481Y, T474I, T474S, T316A</td>
                <td>Chronic Lymphocytic Leukemia/Small Lymphocytic Lymphoma</td>
                <td>Ibrutinib</td>
                <td>
                  <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
                    <PMIDLink
                      pmids={'28049639, 29381098, 28418267, 32670873'}
                    />
                    <AbstractLink
                      link={
                        'https://ashpublications.org/blood/article/134/Supplement_1/504/426369/Resistance-to-Acalabrutinib-in-CLL-Is-Mediated'
                      }
                      abstract={'Woyach et al. Abstract# 642-CLL, ASH 2019'}
                    />
                  </WithSeparator>
                </td>
              </tr>
            </tbody>
          </table>
        </Row>
      </span>,
    ],
    changedAnnotations: [
      {
        columnHeaderType: AnnotationColumnHeaderType.DRUG,
        content: [
          [
            '3A',
            'BRAF',
            'Oncogenic Mutations, excluding V600',
            'Histiocytosis',
            'Cobimetinib',
            'Cobimetinib, Trametinib',
            <PMIDLink pmids={'30361829'} />,
          ],
          [
            '3A',
            'ARAF, RAF1, NRAS, MAP2K2',
            'Oncogenic Mutations',
            'Histiocytosis',
            'Cobimetinib',
            'Cobimetinub, Trametinib',
            <PMIDLink pmids={'30361829'} />,
          ],
        ],
      },
    ],
  },
  '10072021': {
    priorityNews: [
      <span>
        {ONCOKB_TM} is the first somatic human genetic variant database to
        achieve{' '}
        <Linkout
          link={
            'https://www.fda.gov/drugs/resources-information-approved-drugs/fda-recognizes-memorial-sloan-kettering-database-molecular-tumor-marker-information'
          }
        >
          FDA partial recognition
        </Linkout>
        ! Read more about the scope of the recognition, the recognition process,
        and what it means for the knowledge base and our users on our{' '}
        <Link to={PAGE_ROUTE.FDA_RECOGNITION}>About Page</Link>.
      </span>,
    ],
  },
  '09292021': {
    priorityNews: [
      <span>
        New to {ONCOKB_TM} Watch our introductory videos to get you started. See
        the {ONCOKB_TM} <Link to={PAGE_ROUTE.ABOUT}>About page</Link>.
      </span>,
    ],
    updatedImplication: [
      [
        'R2',
        'EGFR',
        'G724S',
        'Non-Small Cell Lung Cancer',
        'Osimertinib',
        <PMIDLink pmids={'28838405, 30405134, 30228210, 30796031'} />,
      ],
    ],
    changedAnnotations: [
      {
        content: [
          [
            'EGFR',
            'Exon 20 in-frame insertions',
            'Non-Small Cell Lung Cancer',
            'Mobocertinib',
            '3A',
            '1',
            <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
              <FdaApprovalLink
                link={
                  'https://www.fda.gov/drugs/resources-information-approved-drugs/fda-grants-accelerated-approval-mobocertinib-metastatic-non-small-cell-lung-cancer-egfr-exon-20'
                }
                approval={'Mobocertinib'}
              />
              <AbstractLink
                link={
                  'https://ascopubs.org/doi/abs/10.1200/JCO.2021.39.15_suppl.9014'
                }
                abstract={'Ramalingham et al. Abstract # 9014, ASCO 2021'}
              />
            </WithSeparator>,
          ],
        ],
      },
    ],
  },
  '08312021': {
    updatedImplication: [
      [
        '2',
        'BRAF',
        'Fusions',
        'Pilocytic Astrocytoma',
        'Selumetinib',
        <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
          <span>Listing in CNS Cancer NCCN v1.2021</span>
          <PMIDLink pmids={'31151904'} />
        </WithSeparator>,
      ],
    ],
    changedAnnotations: [
      {
        content: [
          [
            'IDH1',
            'R132',
            'Cholangiocarcinoma',
            'Ivosidenib',
            '3A',
            '1',
            <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
              <FdaApprovalLink
                link={
                  'https://www.fda.gov/drugs/resources-information-approved-drugs/fda-approves-ivosidenib-advanced-or-metastatic-cholangiocarcinoma?utm_medium=email&utm_source=govdelivery'
                }
                approval={'Ivosidenib'}
              />
              <PMIDLink pmids={'32416072'} />
            </WithSeparator>,
          ],
        ],
      },
    ],
  },
  '07162021': {
    priorityNews: [
      <span>
        Release of <SopPageLink version={2.1} />
      </span>,
    ],
    changedAnnotations: [
      {
        content: [
          [
            'KIT',
            'D816',
            'Mastocytosis',
            'Avapritinib',
            '3A',
            '1',
            <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
              <FdaApprovalLink
                link={
                  'https://www.fda.gov/drugs/drug-approvals-and-databases/fda-approves-avapritinib-advanced-systemic-mastocytosis'
                }
                approval={'Avapritinib'}
              />
              <AbstractLink
                link={
                  'https://ashpublications.org/blood/article/136/Supplement%201/37/470030/Pure-Pathologic-Response-Is-Associated-with'
                }
                abstract={'Gotlib et al. Abstract# 634, ASH 2020'}
              />
              <AbstractLink
                link={
                  'https://www.ashclinicalnews.org/on-location/other-meetings/pathfinder-avapritinib-induces-rapid-responses-advanced-systemic-mastocytosis/'
                }
                abstract={'DeAngelo et al. Absract# CT023, AACR 2021.'}
              />
            </WithSeparator>,
          ],
          [
            'EGFR',
            'Exon 20 in-frame insertions',
            'Non-Small Cell Lung Cancer',
            'Amivantamab',
            '3A',
            '1',
            <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
              <FdaApprovalLink
                link={
                  'https://www.fda.gov/drugs/resources-information-approved-drugs/fda-grants-accelerated-approval-amivantamab-vmjw-metastatic-non-small-cell-lung-cancer'
                }
                approval={'Amivantamab'}
              />
              <AbstractLink
                link={
                  'https://www.jto.org/article/S1556-0864(21)00326-9/fulltext'
                }
                abstract={'Sabari et al. Abstract# OA04.04, WCLC, 2021.'}
              />
            </WithSeparator>,
          ],
        ],
      },
    ],
  },
  '06172021': {
    priorityNews: [
      <span>
        The official {ONCOKB_TM} hugo symbols and gene aliases now come from the{' '}
        <Linkout link={'https://www.genenames.org'}>HGNC</Linkout> gene list
      </span>,
    ],
    updatedImplication: [
      [
        '1',
        'ERBB2',
        'Amplification',
        'Esophagogastric Cancer',
        'Pembrolizumab + Trastuzumab + Chemotherapy',
        <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
          <FdaApprovalLink
            link={
              'https://www.fda.gov/drugs/drug-approvals-and-databases/fda-grants-accelerated-approval-pembrolizumab-her2-positive-gastric-cancer'
            }
            approval={'Pembrolizumab + Trastuzumab + Chemotherapy'}
          />
          <PMIDLink pmids={'33167735'} />
        </WithSeparator>,
      ],
      [
        '1',
        'FGFR2',
        'Fusions',
        'Cholangiocarcinoma',
        'Infigratinib',
        <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
          <FdaApprovalLink
            link={
              'https://www.fda.gov/drugs/drug-approvals-and-databases/fda-grants-accelerated-approval-infigratinib-metastatic-cholangiocarcinoma'
            }
            approval={'Infigratinib'}
          />
          <AbstractLink
            link={
              'https://ascopubs.org/doi/abs/10.1200/JCO.2021.39.3_suppl.265?af=R'
            }
            abstract={'Javle et al. Abstract# 265, ASCO 2021'}
          />
        </WithSeparator>,
      ],
      [
        '4',
        'ARID1A',
        'Truncating Mutations',
        'All Solid Tumors',
        'Tazemetostat',
        <PMIDLink pmids={'25686104, 32506298'} />,
      ],
      [
        '4',
        'ARID1A',
        'Truncating Mutations',
        'All Solid Tumors',
        'PLX2853',
        <PMIDLink pmids={'29760405, 31913353'} />,
      ],
    ],
    changedAnnotations: [
      {
        content: [
          [
            'KRAS',
            'G12C',
            'Non-Small Cell Lung Cancer',
            'Sotorasib',
            '3A',
            '1',
            <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
              <FdaApprovalLink
                link={
                  'https://www.fda.gov/drugs/drug-approvals-and-databases/fda-grants-accelerated-approval-sotorasib-kras-g12c-mutated-nsclc'
                }
                approval={'Sotorasib'}
              />
              <PMIDLink pmids={'34096690'} />
            </WithSeparator>,
          ],
        ],
      },
    ],
    news: [
      <span>
        Updated Level 1 therapeutic biomarker associations for EZH2, IDH1, IDH2
        and PIK3CA to align with the biomarkers specified in each FDA-approved
        companion diagnostic test
        <SimpleTable
          columns={CDX_COLUMNS}
          rows={[
            [
              '1',
              <GenePageLink hugoSymbol={'EZH2'} />,
              'Follicular Lymphoma',
              'Tazemetostat',
              'Oncogenic Mutations',
              'Y646N, Y646F, Y646H, Y646S, Y646C, A682G, A692V',
              <PMALink pma={'P200014'} />,
            ],
            [
              '1',
              <GenePageLink hugoSymbol={'IDH1'} />,
              'AML',
              'Ivosidenib',
              'Oncogenic Mutations',
              'R132C, R132H, R132G, R132S, R132L',
              <PMALink pma={'P170041'} />,
            ],
            [
              '1',
              <GenePageLink hugoSymbol={'IDH2'} />,
              'AML',
              'Enasidenib',
              'Oncogenic Mutations',
              'R140Q, R140L, R140G, R140W, R172K, R172M, R172G, R172S, R172W',
              <PMALink pma={'P170005'} />,
            ],
            [
              '1',
              <GenePageLink hugoSymbol={'PIK3CA'} />,
              'Breast Cancer',
              'Alpelisib + Fulvestrant',
              'Oncogenic Mutations',
              'C420R, E542K, E545A, E545D, E545G, E545K, Q546E, Q546R, H1047L, H1047R, H1047Y',
              <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
                <span>
                  FoundationOne CDx - <PMALink pma={'P170019/S006'} />
                </span>
                <span>
                  Therascreen - <PMALink pma={'P190001'} />
                </span>
                <span>
                  FoundationOne Liquid CDx -{' '}
                  <WithSeparator separator={', '}>
                    <PMALink pma={'P200006'} />
                    <PMALink pma={'P200016'} />
                  </WithSeparator>
                </span>
              </WithSeparator>,
            ],
          ].map((record, index) => {
            return {
              key: `06172021-CDX-COLUMN-${index}`,
              content: record.map((subItem, subIndex) => {
                return {
                  key: `06172021-CDX-COLUMN-${index}-${subIndex}`,
                  content: subItem,
                };
              }),
            };
          })}
          theadClassName={mainstyle.changedAnnotationTableHead}
        />
      </span>,
    ],
  },
  '04142021': {
    priorityNews: [
      <span>
        An updated version of the {ONCOKB_TM} Curation Standard Operating
        Procedure, v2.0, has been released. See the {ONCOKB_TM}{' '}
        <Link to={PAGE_ROUTE.ABOUT}>About</Link> page or{' '}
        <SopPageLink>https://sop.oncokb.org</SopPageLink>
      </span>,
      <span>
        &quot;Resistance&quot; is now included as an oncogenic effect for
        variants that are only found in the context of drug resistance
      </span>,
      <span>
        Documentation of all data changes in each {ONCOKB_TM} release are now
        publicly accessible on{' '}
        <Linkout link={ONCOKB_DATAHUB_LINK}>GitHub</Linkout>
      </span>,
    ],
    updatedImplication: [
      [
        '2',
        'IDH1',
        'Oncogenic Mutations',
        'Chondrosarcoma',
        'Ivosidenib',
        <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
          <span>Listing in Bone Cancer NCCN v1.2021</span>
          <PMIDLink pmids={'32208957'} />
        </WithSeparator>,
      ],
      [
        '2',
        'JAK2',
        'Fusions',
        'Myeloid/Lymphoid Neoplasms with Eosinophilia and Rearrangement of PDGFRA/PDGFRB or FGFR1 or with PCM1-JAK2',
        'Ruxolitinib, Fedratinib',
        <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
          <span>
            Listing in Myeloid/Lymphoid Neoplasms with Eosinophilia and Tyrosine
            Kinase Fusion Genes NCCN v3.2021
          </span>
          <PMIDLink pmids={'32279331'} />
        </WithSeparator>,
      ],
      [
        '2',
        'FGFR1',
        'Fusions',
        'Myeloid/Lymphoid Neoplasms with FGFR1 Rearrangement',
        'Pemigatinib',
        <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
          <span>
            Listing in Myeloid/Lymphoid Neoplasms with Eosinophilia and Tyrosine
            Kinase Fusion Genes NCCN v3.2021
          </span>
          <PMIDLink pmids={'32472305'} />
          <AbstractLink
            link={
              'https://ashpublications.org/blood/article/132/Supplement%201/690/266005/Interim-Results-from-Fight-203-a-Phase-2-Open'
            }
            abstract={'Verstovsek et al, Abstract# 690, ASH 2018.'}
          />
        </WithSeparator>,
      ],
      [
        '3A',
        'EGFR',
        'Exon 20 in-frame insertions',
        'Non-Small Cell Lung Cancer',
        'Mobocertinib',
        <PMIDLink pmids={'33632775'} />,
      ],
      [
        '3A',
        'EGFR',
        'Exon 20 in-frame insertions',
        'Non-Small Cell Lung Cancer',
        'Amivantamab',
        <AbstractLink
          link={
            'https://library.iaslc.org/conference-program?product_id=20&author=&category=&date=&session_type=&session=&presentation=&keyword=sabari&cme=undefined&'
          }
          abstract={'Sabari et al. Abstract# OA04.04, WCLC 2020.'}
        />,
      ],
      [
        '3A',
        'KRAS',
        'G12C',
        'Non-Small Cell Lung Cancer',
        'Adagrasib',
        <AbstractLink
          link={
            'https://cm.eortc.org/cmPortal/Searchable/ENA2020/config/normal#!abstractdetails/0000902150'
          }
          abstract={'Janne et al. Abstract# LBA-03, EORTC 2020.'}
        />,
      ],
      [
        '3A',
        'HRAS',
        'Oncogenic Mutations',
        'Bladder Urothelial Carcinoma',
        'Tipifarnib',
        <PMIDLink pmids={'32636318'} />,
      ],
      [
        '3A',
        'BRAF',
        'V600E',
        'Biliary Tract Cancer',
        'Dabrafenib + Trametinib',
        <PMIDLink pmids={'32818466'} />,
      ],
      [
        '3A',
        'TSC2',
        'Oncogenic Mutations',
        'Perivascular Epithelioid Cell Tumor',
        'ABI-009',
        <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
          <AbstractLink
            link={
              'https://ascopubs.org/doi/abs/10.1200/JCO.2019.37.15_suppl.11005'
            }
            abstract={'Wagner et al. Abstract# 11005, ASCO 2019.'}
          />
          <AbstractLink
            link={
              'https://ascopubs.org/doi/abs/10.1200/JCO.2020.38.15_suppl.11516'
            }
            abstract={'Wagner et al. Abstract# 11516, ASCO 2020.'}
          />
        </WithSeparator>,
      ],
    ],
  },
  '03122021': {
    updatedImplication: [
      [
        '1',
        'MET',
        'Exon 14 Deletion',
        'Non-Small Cell Lung Cancer',
        'Tepotinib',
        <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
          <FdaApprovalLink
            link={
              'https://www.fda.gov/drugs/drug-approvals-and-databases/fda-grants-accelerated-approval-tepotinib-metastatic-non-small-cell-lung-cancer'
            }
            approval={'Tepotinib'}
          />
          <PMIDLink pmids={'32469185'} />
        </WithSeparator>,
      ],
      [
        '2',
        'ERBB2',
        'Amplification',
        'Colorectal Cancer',
        'Trastuzumab Deruxtecan',
        <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
          <span>Listing in Colorectal Cancer NCCN, v2.2021</span>
          <AbstractLink
            link={
              'https://ascopubs.org/doi/abs/10.1200/JCO.2020.38.15_suppl.4000'
            }
            abstract={'Siena et al. Abstract# 4000, ASCO 2020.'}
          />
        </WithSeparator>,
      ],
      [
        '2',
        'ERBB2',
        'Oncogenic Mutations',
        'Non-Small Cell Lung Cancer',
        'Trastuzumab Deruxtecan',
        <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
          <span>Listing in NSCLC NCCN, v2.2021</span>
          <AbstractLink
            link={'https://ascopubs.org/doi/10.1200/JCO.2020.38.15_suppl.9504'}
            abstract={'Smit et al. Abstract# 9504, ASCO 2020.'}
          />
        </WithSeparator>,
      ],
      [
        '2',
        'ALK',
        'Fusions',
        'Inflammatory Myofibroblastic Tumor',
        'Brigatinib',
        <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
          <span>Listing in Soft Tissue Sarcoma NCCN, v1.2021</span>
          <PMIDLink pmids={'27836716'} />
        </WithSeparator>,
      ],
      [
        '4',
        'KIT',
        'D816, D820, N822, Y823D, C809G, A829P',
        'Gastrointestinal Stromal Tumors',
        'Nilotinib',
        <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
          <PMIDLink pmids={'19467857, 21456006'} />
        </WithSeparator>,
      ],
      [
        '4',
        'KIT',
        'D816, D820, N822, Y823D, C809G, A829P',
        'Gastrointestinal Stromal Tumors',
        'Pazopanib',
        <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
          <PMIDLink pmids={'24356634'} />
        </WithSeparator>,
      ],
      [
        'R1',
        'NTRK3',
        'G623R, G696A, F617L',
        'All Solid Tumors',
        'Larotrectinib',
        <span>
          Inclusion as resistance mutations in{' '}
          <Linkout
            link={
              'https://www.accessdata.fda.gov/drugsatfda_docs/label/2018/211710s000lbl.pdf'
            }
          >
            FDA drug label
          </Linkout>
        </span>,
      ],
      [
        'R2',
        'NTRK1',
        'G623R',
        'All Solid Tumors',
        'Entrectinib',
        <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
          <PMIDLink pmids={'28751539, 28751539, 26546295'} />
          <AbstractLink
            link={
              'https://tptherapeutics.com/wp-content/uploads/AACR_2019_TRK_Final_S.pdf'
            }
            abstract={'Drilon et al. Abstract# 4000, AACR 2019'}
          />
        </WithSeparator>,
      ],
    ],
    changedAnnotations: [
      {
        content: [
          ['NTRK1', 'G623R', 'All Solid Tumors', 'Larotrectinib', 'R2', 'R1'],
          [
            'KIT',
            'D816, D820, N822, Y823D, C809G, A829P',
            'Gastrointestinal Stromal Tumors',
            'Sorafenib',
            'None',
            '2',
          ],
          [
            'CDK4',
            'Amplification',
            'Dedifferentiated Liposarcoma, Well-Differentiated Liposarcoma',
            'Palbociclib, Abemaciclib',
            'None',
            '4',
          ],
        ],
      },
    ],
  },
  '02102021': {
    priorityNews: [
      <span>
        Members of the {ONCOKB_TM} External Advisory Board and their relevant
        COIs are now listed on the{' '}
        <Link to={PAGE_ROUTE.TEAM}>{ONCOKB_TM} team page</Link>
      </span>,
    ],
    updatedImplication: [
      [
        '1',
        'ALK',
        'Fusions',
        'Anaplastic Large-Cell Lymphoma',
        'Crizotinib',
        <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
          <FdaApprovalLink
            link={
              'https://www.fda.gov/drugs/drug-approvals-and-databases/fda-approves-crizotinib-children-and-young-adults-relapsed-or-refractory-systemic-anaplastic-large'
            }
            approval={'Crizotinib'}
          />
          <PMIDLink pmids={'23598171, 28032129, 29352732'} />
        </WithSeparator>,
      ],
      [
        '1',
        'ERBB2',
        'Amplification',
        'Breast Cancer',
        'Margetuximab + Chemotherapy',
        <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
          <FdaApprovalLink
            link={
              'https://www.fda.gov/drugs/drug-approvals-and-databases/fda-approves-margetuximab-metastatic-her2-positive-breast-cancer'
            }
            approval={'Margetuximab + Chemotherapy'}
          />
          <AbstractLink
            link={
              'https://ascopubs.org/doi/abs/10.1200/JCO.2019.37.15_suppl.1000'
            }
            abstract={'Rugo et al. Abstract # 1000, ASCO 2019'}
          />
        </WithSeparator>,
      ],
      [
        '1',
        'ERBB2',
        'Amplification',
        'Gastric or Gastroesophageal Adenocarcinoma',
        'Trastuzumab Deruxtecan',
        <WithSeparator separator={EVIDENCE_COLUMN_SEPARATOR}>
          <Linkout
            link={
              'https://www.fda.gov/drugs/drug-approvals-and-databases/fda-approves-fam-trastuzumab-deruxtecan-nxki-her2-positive-gastric-adenocarcinomas'
            }
          >
            FDA-approval of Trastuzumab deruxtecan
          </Linkout>
          <PMIDLink pmids={'32469182'} />
        </WithSeparator>,
      ],
    ],
    changedAnnotations: [
      {
        title: `Changed annotation to adhere to our upcoming ${ONCOKB_TM} SOP v2.0`,
        content: [
          [
            'RET',
            'Fusions',
            'Non-Small Cell Lung Cancer',
            'Vandetanib',
            '2',
            '3A',
          ],
          [
            'NRAS',
            'Oncogenic Mutations',
            'Melanoma',
            'Binimetinib + Ribociclib',
            '3A',
            '4',
          ],
          [
            'MET',
            'Amplification',
            'Renal Cell Carcinoma',
            'Cabozantinib',
            '2',
            'None',
          ],
          [
            'CDK4',
            'Amplification',
            'Dedifferentiated Liposarcoma, Well-Differentiated Liposarcoma',
            'Palbociclib, Abemaciclib',
            '2',
            'None',
          ],
          [
            'KIT',
            'A829P, C809G, D816, D820, N822, Y823D',
            'Gastrointestinal Stromal Tumor',
            'Sorafenib',
            '2',
            'None',
          ],
          [
            'KIT',
            'Oncogenic Mutations',
            'Thymic Tumor',
            'Sunitinib',
            '2',
            'None',
          ],
        ],
      },
    ],
  },
  '01142021': {
    priorityNews: [
      <span>
        We are excited to introduce the{' '}
        <LevelOfEvidencePageLink levelType={LEVEL_TYPES.DX}>
          {ONCOKB_TM} Diagnostic (Dx)
        </LevelOfEvidencePageLink>{' '}
        and{' '}
        <LevelOfEvidencePageLink levelType={LEVEL_TYPES.PX}>
          Prognostic (Px)
        </LevelOfEvidencePageLink>{' '}
        Levels of Evidence (currently applicable to hematologic disease). The
        definitions of these levels of evidence can be found on the{' '}
        <LevelOfEvidencePageLink levelType={LEVEL_TYPES.DX}>
          Levels of Evidence
        </LevelOfEvidencePageLink>{' '}
        page. The complete list of biomarkers associated with a diagnostic or
        prognostic level of evidence can be found on the{' '}
        <Link to={PAGE_ROUTE.ACTIONABLE_GENE}>Actionable Genes</Link> page
      </span>,
    ],
  },
  '12172020': {
    priorityNews: [
      <span>Updated all gene names to the latest HUGO symbol</span>,
    ],
    updatedImplication: [
      [
        '1',
        'RET',
        'Fusions',
        'Thyroid Cancer',
        'Pralsetinib',
        <span>
          <Linkout
            link={
              'https://www.fda.gov/drugs/drug-approvals-and-databases/fda-approves-pralsetinib-ret-altered-thyroid-cancers'
            }
          >
            FDA-approval of Pralsetinib
          </Linkout>
          ; Abstract:{' '}
          <Linkout
            link={
              'https://ascopubs.org/doi/abs/10.1200/JCO.2020.38.15_suppl.109'
            }
          >
            Subbiah et al. Abstract# 109, ASCO 2020
          </Linkout>
        </span>,
      ],
    ],
    changedAnnotations: [
      {
        content: [
          [
            'RET',
            'Oncogenic Mutations',
            'Medullary Thyroid Cancer',
            <div>Pralsetinib</div>,
            '3A',
            '1',
            <div>
              <Linkout
                link={
                  'https://www.fda.gov/drugs/drug-approvals-and-databases/fda-approves-pralsetinib-ret-altered-thyroid-cancers'
                }
              >
                FDA-approval of Pralsetinib
              </Linkout>
              ; Abstract:{' '}
              <Linkout
                link={
                  'https://oncologypro.esmo.org/meeting-resources/esmo-virtual-congress-2020/results-from-the-registrational-phase-i-ii-arrow-trial-of-pralsetinib-blu-667-in-patients-pts-with-advanced-ret-mutation-positive-medullary-thy'
                }
              >
                Hu et al. Abstract# 19130, ESMO 2020
              </Linkout>
            </div>,
          ],
        ],
      },
    ],
  },
  '11132020': {
    priorityNews: [
      <span>
        Based on the updated NCCN Guidelines for CML and ALL, the ABL1 G250E,
        Y253H, E255K/V, V299L T315I/A, F317V/I/C/L, and F359C/I/V mutations are
        included as Level R1 resistance mutations for the tyrosine kinase
        inhibitors indicated in the table below.
      </span>,
      <span>
        Updated therapeutic implications
        <Row className={'overflow-auto'}>
          <table className="table">
            <thead>
              <tr style={{ whiteSpace: 'nowrap' }}>
                <th>Level</th>
                <th>Gene</th>
                <th>Mutation</th>
                <th>Cancer Type</th>
                <th>Drug</th>
                <th>Evidence</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td rowSpan={8}>R1</td>
                <td rowSpan={8}>
                  <GenePageLink hugoSymbol={'ABL1'} />
                </td>
                <td rowSpan={2}>V299L, F317L, G250E</td>
                <td>CML</td>
                <td rowSpan={2}>Bosutinib</td>
                <td>
                  NCCN v2.2021 CML; <PMIDLink pmids={'21865346, 22371878'} />
                </td>
              </tr>
              <tr>
                <td>BLL</td>
                <td>
                  NCCN v2.2020 ALL; <PMIDLink pmids={'26040495'} />
                </td>
              </tr>
              <tr>
                <td rowSpan={2}>F317V/I/C/L, T315A, V299L</td>
                <td>CML</td>
                <td rowSpan={2}>Dasatinib</td>
                <td>
                  NCCN v2.2021 CML;{' '}
                  <PMIDLink
                    pmids={
                      '17785585, 19589924, 19779040, 17710227, 17339191, 17114651'
                    }
                  />
                </td>
              </tr>
              <tr>
                <td>BLL</td>
                <td>
                  NCCN v2.2020 ALL;{' '}
                  <PMIDLink pmids={'17496201, 20131302, 17339191'} />
                </td>
              </tr>
              <tr>
                <td rowSpan={2}>E255K/V, F359C/I/V, Y253H, G250E</td>
                <td>CML</td>
                <td rowSpan={2}>Nilotinib</td>
                <td>
                  NCCN v2.2021 CML;{' '}
                  <PMIDLink
                    pmids={'16775235, 17785585, 23502220, 19652056, 19589924'}
                  />
                </td>
              </tr>
              <tr>
                <td>BLL</td>
                <td>
                  NCCN v2.2020 ALL;{' '}
                  <PMIDLink
                    pmids={'16775235, 17785585, 23502220, 19652056, 19589924'}
                  />
                </td>
              </tr>
              <tr>
                <td rowSpan={2}>
                  V299L, G250E, F317V/I/C/L, T315A, E255K/V, F359C/I/V, Y253H
                </td>
                <td>CML</td>
                <td rowSpan={2}>Imatinib</td>
                <td>
                  NCCN v2.2021 CML;{' '}
                  <PMIDLink
                    pmids={
                      '17189410, 20010464, 19925053, 17189410, 17785585, 12623848'
                    }
                  />
                </td>
              </tr>
              <tr>
                <td>BLL</td>
                <td>
                  NCCN v2.2020 ALL;{' '}
                  <PMIDLink pmids={'17189410, 17405907, 11861307'} />
                </td>
              </tr>
            </tbody>
          </table>
        </Row>
      </span>,
    ],
  },
  '09172020': {
    priorityNews: [
      <span>
        We now support links to the variant page with the{' '}
        <Linkout link={'https://varnomen.hgvs.org/recommendations/DNA/'}>
          HGVS Variant Nomenclature
        </Linkout>
        , see <Linkout link={FAQ_URL_PATTERNS_LINK}>HERE</Linkout> for more
        details.
      </span>,
    ],
    updatedImplication: [
      [
        'R1',
        'BTK',
        'C481S',
        'Chronic Lymphocytic Leukemia/Small Lymphocytic Lymphoma',
        'Ibrutinib',
        <span>
          Listing in NCCN v4.2020 CLL; <PMIDLink pmids={'24869598, 28418267'} />
        </span>,
      ],
    ],
    changedAnnotations: [
      {
        content: [
          [
            'RET',
            'Fusions',
            'Non-Small Cell Lung Cancer',
            <div>Pralsetinib</div>,
            '3A',
            '1',
            <div>
              Abstract:{' '}
              <Linkout
                link={
                  'https://ascopubs.org/doi/abs/10.1200/JCO.2020.38.15_suppl.109'
                }
              >
                Subbiah et al. Abstract# 109, ASCO 2020
              </Linkout>
              ;{' '}
              <Linkout
                link={
                  'https://www.fda.gov/drugs/resources-information-approved-drugs/fda-approves-pralsetinib-lung-cancer-ret-gene-fusions'
                }
              >
                FDA-approval of Pralsetinib
              </Linkout>
            </div>,
          ],
        ],
      },
    ],
  },
  '08282020': {
    priorityNews: [
      <span>
        Updated therapeutic implications - 4 new associations
        <Row className={'overflow-auto'}>
          <table className="table">
            <thead>
              <tr>
                <th>Level</th>
                <th>Gene</th>
                <th>Mutation</th>
                <th>Cancer Type</th>
                <th>Drug</th>
                <th>Evidence</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>
                  <GenePageLink hugoSymbol={'KIT'} />
                </td>
                <td>Select Oncogenic Mutations</td>
                <td>Gastrointestinal Stromal Tumors</td>
                <td>Ripretinib</td>
                <td>
                  <Linkout
                    link={
                      'https://www.fda.gov/drugs/drug-approvals-and-databases/fda-approves-ripretinib-advanced-gastrointestinal-stromal-tumor'
                    }
                  >
                    FDA-approval of Ripretinib
                  </Linkout>
                  ; <PMIDLink pmids={'32511981'} />
                </td>
              </tr>
              <tr>
                <td>1</td>
                <td>
                  <GenePageLink hugoSymbol={'BRAF'} />
                </td>
                <td>
                  <AlterationPageLink hugoSymbol={'BRAF'} alteration={'V600'} />
                </td>
                <td>Melanoma</td>
                <td>Vemurafenib + Cobimetinib + Atezulizumab</td>
                <td>
                  <Linkout
                    link={
                      'https://www.fda.gov/drugs/resources-information-approved-drugs/fda-approves-atezolizumab-braf-v600-unresectable-or-metastatic-melanoma?utm_campaign=Oncology%207-31-2020%20atezolizumab&utm_medium=email&utm_source=Eloqua&elqTrackId=38552F7B5C55F017B66C6336EE62E571&elq=83c8ebb4efca420989e612b8413456fe&elqaid=13603&elqat=1&elqCampaignId=11643'
                    }
                  >
                    FDA-approval of Atezulizumab
                  </Linkout>
                  ; <PMIDLink pmids={'32534646'} />
                </td>
              </tr>
              <tr>
                <td rowSpan={3}>2</td>
                <td rowSpan={3}>
                  <GenePageLink hugoSymbol={'PDGFRA'} />
                </td>
                <td rowSpan={3}>
                  <AlterationPageLink
                    hugoSymbol={'PDGFRA'}
                    alteration={'Oncogenic Mutations'}
                  />
                </td>
                <td rowSpan={3}>Gastrointestinal Stromal Tumors</td>
                <td>Ripretinib</td>
                <td>
                  Listing in 2.2020 Soft Tissue Sarcoma NCCN;{' '}
                  <PMIDLink pmids={'32511981'} />
                </td>
              </tr>
              <tr>
                <td>Regorafenib</td>
                <td>
                  Listing in 2.2020 Soft Tissue Sarcoma NCCN;{' '}
                  <PMIDLink pmids={'23177515, 27371698'} />
                </td>
              </tr>
              <tr>
                <td>Sunitinib</td>
                <td>
                  Listing in 2.2020 Soft Tissue Sarcoma NCCN;{' '}
                  <PMIDLink pmids={'17046465, 19282169, 25641662'} />
                </td>
              </tr>
              <tr>
                <td>3A</td>
                <td>
                  <GenePageLink hugoSymbol={'BRCA1'} />
                  {', '}
                  <GenePageLink hugoSymbol={'BRCA2'} />
                </td>
                <td>Oncogenic Mutations</td>
                <td>Pancreatic Adenocarcinoma</td>
                <td>Olaparib</td>
                <td>
                  <Linkout
                    link={
                      'https://www.fda.gov/drugs/resources-information-approved-drugs/fda-approves-olaparib-gbrcam-metastatic-pancreatic-adenocarcinoma'
                    }
                  >
                    FDA-approval of Olaparib in the germline setting
                  </Linkout>
                  ; <PMIDLink pmids={'31157963, 32444418'} />
                </td>
              </tr>
            </tbody>
          </table>
        </Row>
      </span>,
    ],
  },
  '07232020': {
    updatedImplication: [
      [
        '1',
        'Other Biomarkers',
        <AlterationPageLink
          hugoSymbol={'Other Biomarkers'}
          alteration={'TMB-H'}
        >
          Tumor Mutational Burden - High
        </AlterationPageLink>,
        'All Solid Tumors',
        'Pembrolizumab',
        <span>
          Abstract:{' '}
          <Linkout
            link={
              'https://www.sciencedirect.com/science/article/pii/S0923753419594042'
            }
          >
            Marabelle et al. Abstract# 1192O, ESMO 2019
          </Linkout>
          ,{' '}
          <Linkout
            link={
              'https://www.fda.gov/drugs/drug-approvals-and-databases/fda-approves-pembrolizumab-adults-and-children-tmb-h-solid-tumors'
            }
          >
            FDA-approval of Pembrolizumab
          </Linkout>
        </span>,
      ],
    ],
    newlyAddedGenes: ['LARP4B', 'DAZAP1', 'KLF3', 'ZNF750', 'MEF2D'],
  },
  '07092020': {
    updatedImplication: [
      [
        '1',
        'SMARCB1',
        'Deletion',
        'Epithelioid Sarcoma',
        'Tazemetostat',
        <span>
          Abstract:{' '}
          <Linkout
            link={
              'https://ascopubs.org/doi/abs/10.1200/JCO.2019.37.15_suppl.11003'
            }
          >
            Stacchiotti et al. Abstract# 11003, JCO 2019
          </Linkout>
          ,{' '}
          <Linkout
            link={
              'https://www.fda.gov/drugs/resources-information-approved-drugs/fda-approves-tazemetostat-advanced-epithelioid-sarcoma'
            }
          >
            FDA-approval of Tazemetostat
          </Linkout>
        </span>,
      ],
    ],
    changedAnnotations: [
      {
        content: [
          [
            'EZH2',
            'A682G, A692V, Y646C, Y646F, Y646H, Y646N, Y646S',
            'Follicular Lymphoma',
            <div>Tazemetostat</div>,
            '3A',
            '1',
            <div>
              Abstract:{' '}
              <Linkout
                link={
                  'https://ashpublications.org/blood/article/134/Supplement_1/123/426294/Phase-2-Multicenter-Study-of-Tazemetostat-an-EZH2'
                }
              >
                Morschhauser et al. Abstract# 123, ASH 2019
              </Linkout>
              ,{' '}
              <Linkout
                link={
                  'https://www.fda.gov/drugs/fda-granted-accelerated-approval-tazemetostat-follicular-lymphoma'
                }
              >
                FDA-approval of Tazemetostat
              </Linkout>
            </div>,
          ],
        ],
      },
    ],
    newlyAddedGenes: ['PPP2R2A'],
  },
  '06092020': {
    numOfAssociationsInUpdatedImplication: 15,
    updatedImplication: [
      [
        '1',
        'BRCA1, BRCA2, BARD1, BRIP1, CDK12, CHEK1, CHEK2, FANCL, PALB2, RAD51B, RAD51C, RAD51D, RAD54L',
        <span style={{ whiteSpace: 'nowrap' }}>Oncogenic Mutations</span>,
        'Prostate Cancer',
        'Olaparib',
        <span>
          <PMIDLink pmids={'32343890'} />,{' '}
          <Linkout
            link={
              'https://www.fda.gov/drugs/drug-approvals-and-databases/fda-approves-olaparib-hrr-gene-mutated-metastatic-castration-resistant-prostate-cancer'
            }
          >
            FDA-approval of Olaparib
          </Linkout>
        </span>,
      ],
      [
        '1',
        'BRCA1, BRCA2',
        'Oncogenic Mutations',
        <span style={{ whiteSpace: 'nowrap' }}>Prostate Cancer</span>,
        'Rucaparib',
        <span>
          Abstract:{' '}
          <Linkout
            link={
              'https://www.sciencedirect.com/science/article/pii/S0923753419590627'
            }
          >
            Abida et al. Abstract# 846PD, ESMO 2019
          </Linkout>
          ,{' '}
          <Linkout
            link={
              'https://www.fda.gov/drugs/fda-grants-accelerated-approval-rucaparib-brca-mutated-metastatic-castration-resistant-prostate'
            }
          >
            FDA-approval of Rucaparib
          </Linkout>
        </span>,
      ],
    ],
    changedAnnotations: [
      {
        content: [
          [
            'ATM',
            'Oncogenic Mutations',
            'Prostate Cancer',
            <div>Olaparib</div>,
            '4',
            '1',
            <div>
              <PMIDLink pmids={'32343890'} />,{' '}
              <Linkout
                link={
                  'https://www.fda.gov/drugs/drug-approvals-and-databases/fda-approves-olaparib-hrr-gene-mutated-metastatic-castration-resistant-prostate-cancer'
                }
              >
                FDA-approval of Olaparib
              </Linkout>
            </div>,
          ],
        ],
      },
    ],
    newlyAddedGenes: ['FANCL'],
  },
  '05112020': {
    priorityNews: [
      <span>
        We are excited to announce that our first {ONCOKB_TM} webinar was a
        success! You can find a video recording{' '}
        <Link
          to={{
            pathname: PAGE_ROUTE.ABOUT,
          }}
        >
          here
        </Link>
        .
      </span>,
    ],
    updatedImplication: [
      [
        '1',
        'FGFR2',
        'Fusions',
        'Cholangiocarcinoma',
        'Pemigatinib',
        <span>
          <PMIDLink pmids={'32203698'} />,{' '}
          <a
            href="https://www.fda.gov/news-events/press-announcements/fda-approves-first-targeted-treatment-patients-cholangiocarcinoma-cancer-bile-ducts"
            target="_blank"
            rel="noopener noreferrer"
          >
            FDA-approval of Pemigatinib
          </a>
        </span>,
      ],
      [
        '1',
        'RET',
        'Fusions',
        'Thyroid Cancer',
        'Selpercatinib',
        <div>
          <div>
            Abstract:{' '}
            <Linkout
              link={
                'https://www.sciencedirect.com/science/article/pii/S0923753419604539'
              }
            >
              Wirth et al. Abstract# LBA93, ESMO 2019;
            </Linkout>
          </div>
          <div>
            <Linkout
              link={
                'https://www.fda.gov/drugs/drug-approvals-and-databases/fda-approves-selpercatinib-lung-and-thyroid-cancers-ret-gene-mutations-or-fusions'
              }
            >
              FDA-approval of Selpercatinib{' '}
            </Linkout>
          </div>
        </div>,
      ],
      [
        '1',
        'ERBB2',
        'Amplification',
        'Breast Cancer',
        'Tucatinib + Trastuzumab + Capecitabine',
        <span>
          <PMIDLink pmids={'31825569'} />,{' '}
          <Linkout
            link={
              'https://www.fda.gov/news-events/press-announcements/fda-approves-first-new-drug-under-international-collaboration-treatment-option-patients-her2'
            }
          >
            FDA-approval of Tucatinib
          </Linkout>
        </span>,
      ],
      [
        '1',
        'ERBB2',
        'Amplification',
        'Breast Cancer',
        'Trastuzumab Deruxtecan',
        <span>
          <PMIDLink pmids={'31825192'} />,{' '}
          <Linkout link="https://www.fda.gov/drugs/resources-information-approved-drugs/fda-approves-fam-trastuzumab-deruxtecan-nxki-unresectable-or-metastatic-her2-positive-breast-cancer">
            FDA-approval of Trastuzumab Deruxtecan
          </Linkout>
        </span>,
      ],
      [
        '2',
        'BRAF',
        'V600E',
        'Pilocytic Astrocytoma, Pleomorphic Xanthoastrocytoma and Ganglioglioma',
        'Dabrafenib + Trametinib, Vemurafenib + Cobimetinib',
        <span>
          <span>Listing in 1.2020 CNS NCCN;</span>{' '}
          <PMIDLink
            pmids={'28984141, 29380516, 26287849, 30351999, 30120137'}
          />
        </span>,
      ],
    ],
    changedAnnotations: [
      {
        content: [
          [
            'MET',
            'Exon 14 Deletion',
            'Non-Small Cell Lung Cancer',
            <div>Capmatinib</div>,
            '3A',
            '1',
            <div>
              <div>
                Abstract:{' '}
                <Linkout
                  link={
                    'https://ascopubs.org/doi/abs/10.1200/JCO.2019.37.15_suppl.9004'
                  }
                >
                  Wolf, J. et al. Abstract# 9004, ASCO 2019;
                </Linkout>
              </div>
              <div>
                <Linkout
                  link={
                    'https://www.fda.gov/drugs/drug-approvals-and-databases/fda-grants-accelerated-approval-capmatinib-metastatic-non-small-cell-lung-cancer'
                  }
                >
                  FDA-approval of Capmatinib{' '}
                </Linkout>
              </div>
            </div>,
          ],
          [
            'RET',
            'Fusions',
            'Non-Small Cell Lung Cancer',
            'Selpercatinib',
            '3A',
            '1',
            <div>
              <div>
                Abstract:{' '}
                <Linkout
                  link={
                    'https://www.jto.org/article/S1556-0864(19)30742-7/fulltext'
                  }
                >
                  Drilon et al. Abstract# PL02.08, IASLC WCLC 2019;
                </Linkout>
              </div>
              <div>
                <Linkout
                  link={
                    'https://www.fda.gov/drugs/drug-approvals-and-databases/fda-approves-selpercatinib-lung-and-thyroid-cancers-ret-gene-mutations-or-fusions'
                  }
                >
                  FDA-approval of Selpercatinib{' '}
                </Linkout>
              </div>
            </div>,
          ],
          [
            'RET',
            'Oncogenic Mutations',
            'Medullary Thyroid Cancer',
            'Selpercatinib',
            '3A',
            '1',
            <div>
              <div>
                Abstract:{' '}
                <Linkout
                  link={
                    'https://www.sciencedirect.com/science/article/pii/S0923753419604539'
                  }
                >
                  Wirth et al. Abstract# LBA93, ESMO 2019;
                </Linkout>
              </div>
              <div>
                <Linkout
                  link={
                    'https://www.fda.gov/drugs/drug-approvals-and-databases/fda-approves-selpercatinib-lung-and-thyroid-cancers-ret-gene-mutations-or-fusions'
                  }
                >
                  FDA-approval of Selpercatinib{' '}
                </Linkout>
              </div>
            </div>,
          ],
        ],
      },
    ],
  },
  '04232020': {
    updatedImplication: [
      [
        '1',
        'BRAF',
        'V600E',
        'Colorectal Cancer',
        'Encorafenib + Cetuximab',
        <span>
          <PMIDLink pmids={'31566309'} />,{' '}
          <a
            href="https://www.fda.gov/drugs/resources-information-approved-drugs/fda-approves-encorafenib-combination-cetuximab-metastatic-colorectal-cancer-braf-v600e-mutation"
            target="_blank"
            rel="noopener noreferrer"
          >
            FDA-approval of Encorafenib + Cetuximab
          </a>
        </span>,
      ],
      [
        '1',
        'NF1',
        'Oncogenic Mutations',
        'Neurofibroma',
        'Selumetinib',
        <span>
          <PMIDLink pmids={'28029918, 32187457'} />,{' '}
          <a
            href="https://www.fda.gov/drugs/resources-information-approved-drugs/fda-approves-selumetinib-neurofibromatosis-type-1-symptomatic-inoperable-plexiform-neurofibromas"
            target="_blank"
            rel="noopener noreferrer"
          >
            FDA-approval of Selumetinib
          </a>
        </span>,
      ],
      [
        '2',
        'BRAF',
        'V600E',
        'Colorectal Cancer',
        'Encorafenib + Panitumumab',
        <span>
          <span>Listing in 2.2020 Colon Cancer NCCN;</span>{' '}
          <PMIDLink pmids={'29431699, 31566309'} />
        </span>,
      ],
      [
        '2',
        'ERBB2',
        'Amplification',
        'Colorectal Cancer',
        'Trastuzumab + Lapatinib',
        <span>
          <span>Listing in 2.2020 Colon Cancer NCCN;</span>{' '}
          <PMIDLink pmids={'27108243'} />
        </span>,
      ],
      [
        '2',
        'ERBB2',
        'Amplification',
        'Colorectal Cancer',
        'Trastuzumab + Pertuzumab',
        <span>
          <span>Listing in 2.2020 Colon Cancer NCCN;</span>{' '}
          <PMIDLink pmids={'30857956'} />
        </span>,
      ],
    ],
    changedAnnotations: [
      {
        content: [
          [
            'BRAF',
            'V600E',
            'Colorectal Cancer',
            <div>
              <div>Encorafenib + Cetuximab + Binimetinib,</div>
              <div>Dabrafenib + Panitumumab + Trametinib</div>
            </div>,
            '2',
            'None',
            'Listing removed from 2.2020 Colon Cancer NCCN',
          ],
        ],
      },
    ],
    news: [
      <span>
        Updated EGFR biomarker-drug associations for investigational Levels 3A
        and 4
      </span>,
      <span>Updated and reorganized KIT biomarker-drug associations</span>,
    ],
    newlyAddedGenes: ['DDX4', 'DDX41', 'ELMSAN1', 'MBD6'],
  },
  '02122020': {
    priorityNews: [
      <span>
        The version controlled {ONCOKB_TM} Curation Standard Operating Procedure
        v1.0 has been released in the{' '}
        <Link to={PAGE_ROUTE.ABOUT}>{ONCOKB_TM} About</Link> page.
      </span>,
    ],
    updatedImplication: [
      [
        '1',
        'PDGFRA',
        'D842V, D842Y, D842_H845del, D842_H845insV',
        'Gastrointestinal Stromal Tumor',
        'Avapritinib',
        <span>
          Abstract:{' '}
          <Linkout
            link={
              'https://ascopubs.org/doi/abs/10.1200/JCO.2019.37.15_suppl.11022'
            }
          >
            Heinrich et al. Abstract # 11022, ASCO 2019
          </Linkout>
          ;{' '}
          <Linkout link="https://www.fda.gov/drugs/resources-information-approved-drugs/fda-approves-avapritinib-gastrointestinal-stromal-tumor-rare-mutation">
            FDA-approval of Avapritinib; 2019
          </Linkout>
        </span>,
      ],
      [
        '3A',
        'BRCA2',
        'Oncogenic Mutations',
        'Pancreatic Adenocarcinoma',
        'Rucaparib',
        <span>
          <PMIDLink pmids={'30051098'} />; Abstract:{' '}
          <a
            href="https://cancerres.aacrjournals.org/content/79/13_Supplement/CT234"
            target="_blank"
            rel="noopener noreferrer"
          >
            Reiss Binder et al. Abstract# CT234, AACR 2019
          </a>
        </span>,
      ],
      [
        '4',
        'EGFR',
        'L718V',
        'Non-Small Cell Lung Cancer',
        'Afatinib',
        <span>
          <PMIDLink pmids={'29571986, 31757379'} />
        </span>,
      ],
      [
        'R2',
        'EGFR',
        'L718V',
        'Non-Small Cell Lung Cancer',
        'Osimertinib',
        <span>
          <PMIDLink pmids={'29568384, 29571986, 31301016, 31757379'} />
        </span>,
      ],
      [
        'R2',
        'KIT',
        'A829P',
        'Gastrointestinal Stromal Tumor',
        'Imatinib',
        <span>
          <PMIDLink pmids={'18955458, 25239608, 31085175'} />
        </span>,
      ],
      [
        'R2',
        'KIT',
        'A829P',
        'Gastrointestinal Stromal Tumor',
        'Sunitinib',
        <span>
          <PMIDLink pmids={'31085175'} />
        </span>,
      ],
    ],
    newlyAddedGenes: ['AJUBA', 'ZBTB20', 'ZFP36L1'],
  },
  '12122019': {
    priorityNews: [
      <span>User accounts and commercial licenses now available</span>,
      <span>{ONCOKB_TM} now contains annotation of over 5,000 variants</span>,
    ],
    updatedImplication: [
      [
        '1',
        'FLT3',
        'D835, I836',
        'AML',
        'Gilteritinib',
        <span>
          <PMIDLink pmids={'28516360, 28645776'} /> ;{' '}
          <a
            href="https://www.fda.gov/drugs/fda-approves-gilteritinib-relapsed-or-refractory-acute-myeloid-leukemia-aml-flt3-mutatation"
            target="_blank"
            rel="noopener noreferrer"
          >
            FDA-approval of Gilteritinib
          </a>
        </span>,
      ],
      [
        '1',
        <span style={{ whiteSpace: 'nowrap' }}>MSI-H</span>,
        '',
        'Colorectal Cancer',
        'Nivolumab + Ipilimumab',
        <span>
          <PMIDLink pmids={'29355075'} />;{' '}
          <a
            href="https://www.fda.gov/drugs/resources-information-approved-drugs/fda-grants-accelerated-approval-ipilimumab-msi-h-or-dmmr-metastatic-colorectal-cancer"
            target="_blank"
            rel="noopener noreferrer"
          >
            FDA-approval of Nivolumab + Ipilimumab
          </a>
        </span>,
      ],
      [
        '1',
        'ROS1',
        'Fusions',
        'NSCLC',
        'Entrectinib',
        <span>
          <PMIDLink pmids={'28183697'} />, Abstract:{' '}
          <a
            href="https://cancerres.aacrjournals.org/content/77/13_Supplement/CT060"
            target="_blank"
            rel="noopener noreferrer"
          >
            Drilon et al. Abstract# CT060, AACR 2017
          </a>{' '}
          ;{' '}
          <a
            href="https://www.fda.gov/drugs/resources-information-approved-drugs/fda-approves-entrectinib-ntrk-solid-tumors-and-ros-1-nsclc"
            target="_blank"
            rel="noopener noreferrer"
          >
            FDA-approval of Entrectinib
          </a>
        </span>,
      ],
      [
        '3A',
        'KRAS',
        'G12C',
        'NSCLC',
        'AMG-510',
        <span>
          Abstract:{' '}
          <a
            href="https://oncologypro.esmo.org/Meeting-Resources/ESMO-2019-Congress/Phase-1-Study-of-AMG-510-a-Novel-Molecule-Targeting-KRAS-G12C-Mutant-Solid-Tumors"
            target="_blank"
            rel="noopener noreferrer"
          >
            Govindan et al. ESMO 2019
          </a>
        </span>,
      ],
    ],
    changedAnnotations: [
      {
        content: [
          [
            'NTRK1, NTRK2, NTRK3',
            'Fusions',
            'All Solid Tumors',
            'Entrectinib',
            '3A',
            '1',
            <a
              href="https://www.fda.gov/drugs/resources-information-approved-drugs/fda-approves-entrectinib-ntrk-solid-tumors-and-ros-1-nsclc"
              target="_blank"
              rel="noopener noreferrer"
            >
              FDA-approval of Entrectinib
            </a>,
          ],
          [
            'ERBB2',
            'Oncogenic Mutations',
            'NSCLC',
            'Ado-trastuzumab Emtansine',
            '3A',
            '2A',
            <div>Listing in 1.2020 Non-Small Cell Lung Cancer NCCN</div>,
          ],
          [
            'IDH1',
            'Oncogenic Mutations',
            'Cholangiocarcinoma',
            'Ivosidenib',
            '2B',
            '3A',
            <span>
              Abstract:{' '}
              <a
                href="https://oncologypro.esmo.org/Meeting-Resources/ESMO-2019-Congress/ClarIDHy-A-global-phase-3-randomized-double-blind-study-of-ivosidenib-IVO-vs-placebo-in-patients-with-advanced-cholangiocarcinoma-CC-with-an-isocitrate-dehydrogenase-1-IDH1-mutation"
                target="_blank"
                rel="noopener noreferrer"
              >
                Abou-Alfa et al. Abstract# LBA10_PR, ESMO 2019
              </a>
            </span>,
          ],
          [
            'PIK3CA',
            'Oncogenic Mutations',
            'Breast Cancer',
            'Alpelisib',
            '3A',
            'None',
            <div>
              Alpelisib in combination with fulvestrant is{' '}
              <a
                href="https://www.fda.gov/drugs/resources-information-approved-drugs/fda-approves-alpelisib-metastatic-breast-cancer"
                target="_blank"
                rel="noopener noreferrer"
              >
                FDA-approved to treat patients with PIK3CA mutant breast cancer
              </a>
            </div>,
          ],
        ],
      },
    ],
    news: [
      <span>
        Refined KIT and EGFR biomarker-drug associations to strictly adhere to
        the FDA drug labels and NCCN guidelines
      </span>,
    ],
    newlyAddedGenes: [
      'AGO1',
      'ALB',
      'APLNR',
      'CYP19A1',
      'DKK2',
      'DKK3',
      'DKK4',
      'GAB2',
      'HLA-C',
      'LRP5',
      'LRP6',
      'MLLT1',
      'DKK1',
      'NADK',
      'REST',
      'SCG5',
      'SFRP1',
      'SFRP2',
      'SOCS3',
      'STAT1',
      'STAT2',
      'TLE1',
      'TLE2',
      'TLE3',
      'TLE4',
      'WIF1',
    ],
  },
  '08282019': {
    newlyAddedGenes: [
      'ARHGAP35',
      'FOXF1',
      'GAB1',
      'MAD2L2',
      'SMARCA2',
      'SMARCE1',
    ],
    updatedImplication: [
      [
        '3A',
        'EZH2',
        'Oncogenic Mutations',
        'Follicular Lymphoma',
        'Tazemetostat',
        <a
          href="https://library.ehaweb.org/eha/2018/stockholm/214434/gilles.salles.interim.update.from.a.phase.2.multicenter.study.of.tazemetostat.html?f=topic=1574*media=3%27"
          target="_blank"
          rel="noopener noreferrer"
        >
          Abstract: Morschhauser et al. Abstract# S100, EHA 2018.
        </a>,
      ],
    ],
  },
  '08042019': {
    newlyAddedGenes: ['ATXN7', 'MTAP', 'SERPINB3', 'SERPINB4'],
    updatedImplication: [
      [
        '2A',
        'BRAF',
        'V600E',
        'Hairy Cell Leukemia',
        'Vemurafenib',
        <span>
          Listing in 3.2019 Hairy Cell Leukemia NCCN (
          <PMIDLink pmids={'26352686'} />)
        </span>,
      ],
      [
        '3A',
        'ARAF, BRAF, RAF1, NRAS, KRAS, MAP2K2',
        'Oncogenic Mutations',
        'Histiocytic and Dendritic Cell Neoplasms',
        'Cobimetinib',
        <PMIDLink pmids={'30867592'} />,
      ],
    ],
    changedAnnotations: [
      {
        content: [
          [
            'BRAF',
            'D287H, D594, F595L, G466, G596, N581, S467L, V459L',
            'All Solid Tumors',
            'PLX8394',
            '4',
            'No level',
            <>
              <div>Re-review of PMID</div>
              <div>
                <PMIDLink pmids={'28783719'} />
              </div>
              <br />
              <div>
                BRAF class III mutants are not necessarily sensitive to dimer
                disrupter RAF inhibitor PLX8394
              </div>
            </>,
          ],
        ],
      },
    ],
  },
  '06212019': {
    priorityNews: [
      'Improved Actionable Genes page',
      <span>
        Updated the Cancer Genes list which now consists of 1039 genes (no
        longer referring to the{' '}
        <a
          href="https://cancer.sanger.ac.uk/cosmic/census?tier=2"
          target="_blank"
          rel="noopener noreferrer"
        >
          Cancer Gene Census Tier 2 genes
        </a>
        )
      </span>,
    ],
    updatedImplicationInOldFormat: {
      '1': [
        <span>
          PIK3CA - Oncogenic Mutations - Breast Cancer - Alpelisib (
          <b>previously level 3A</b>)<br />
          May 24, 2019:{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.fda.gov/drugs/resources-information-approved-drugs/fda-approves-alpelisib-metastatic-breast-cancer"
          >
            The FDA approved PI(3)-kinase alpha selective inhibitor alpelisib
          </a>{' '}
          in combination with fulvestrant, to treat patients with HR+/ HER2-
          PIK3CA-mutant advanced or metastatic breast cancer.
        </span>,
      ],
      '2': [
        <span>
          BRAF - V600E - Colorectal Cancer - Encorafenib + Binimetinib +
          Cetuximab (<b>previously level 3A</b>)
        </span>,
        <span>
          ERBB2 - Amplification - Uterine Serous Carcinoma - Trastuzumab +
          Carboplatin-Paclitaxel (<b>previously level 2B</b>)
        </span>,
      ],
    },
  },
  '05092019': {
    news: [
      <span>
        Standardization of therapeutic names with{' '}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://ncit.nci.nih.gov/ncitbrowser/"
        >
          NCI thesaurus
        </a>
      </span>,
    ],
    priorityNews: [
      <span>
        Addition of Actionable Genes for Hematologic Malignancies
        <Row className={'overflow-auto'}>
          <table className="table">
            <thead>
              <tr>
                <th className="col-xs-1">Level</th>
                <th className="col-xs-1">Gene</th>
                <th className="col-xs-4">Mutation</th>
                <th className="col-xs-4">Cancer Type</th>
                <th className="col-xs-2">Drug</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td rowSpan={5}>1</td>
                <td rowSpan={3}>
                  <GenePageLink hugoSymbol={'ABL1'} />
                </td>
                <td rowSpan={2}>BCR-ABL1 fusion</td>
                <td>B-Lymphoblastic Leukemia/Lymphoma (BLL)</td>
                <td>Ponatinib</td>
              </tr>
              <tr>
                <td>Chronic Myelogenous Leukemia (CML)</td>
                <td>Bosutinib</td>
              </tr>
              <tr>
                <td>T315I</td>
                <td>BLL, CML</td>
                <td>Ponatinib</td>
              </tr>
              <tr>
                <td rowSpan={2}>
                  <GenePageLink hugoSymbol={'FLT3'} />
                </td>
                <td>Internal tandem duplications (ITD)</td>
                <td rowSpan={2}>Acute Myeloid Leukemia (AML)</td>
                <td>Gilteritinib</td>
              </tr>
              <tr>
                <td>Oncogenic Mutations</td>
                <td>Midostaurin + High Dose Chemotherapy</td>
              </tr>
              <tr>
                <td>R1</td>
                <td>
                  <GenePageLink hugoSymbol={'ABL1'} />
                </td>
                <td>T315I</td>
                <td>BLL, CML</td>
                <td>Imatinib, Dasatinib, Nilotinib, Bosutinib</td>
              </tr>
              <tr>
                <td rowSpan={4}>2A</td>
                <td rowSpan={4}>
                  <GenePageLink hugoSymbol={'ABL1'} />
                </td>
                <td>BCR-ABL1 fusion</td>
                <td>BLL</td>
                <td>Bosutinib, Nilotinib</td>
              </tr>
              <tr>
                <td>
                  E255K, E255V, F317C, F317I, F317L, F317V, F359C, F359I, F359V,
                  T315A, Y253H
                </td>
                <td rowSpan={3}>BLL, CML</td>
                <td>Bosutinib</td>
              </tr>
              <tr>
                <td>E255K, E255V, F359C, F359I, F359V, Y253H</td>
                <td>Dasatinib</td>
              </tr>
              <tr>
                <td>F317C, F317I, F317L, F317V, T315A, V299L</td>
                <td>Nilotinib</td>
              </tr>
              <tr>
                <td rowSpan={4}>3A</td>
                <td rowSpan={3}>
                  <GenePageLink hugoSymbol={'ABL1'} />
                </td>
                <td>BCR-ABL1 fusion</td>
                <td>CML</td>
                <td>Asciminib</td>
              </tr>
              <tr>
                <td>E255K, E255V, F359C, F359I, F359V, Y253H</td>
                <td rowSpan={2}>BLL, CML</td>
                <td>Dasatinib</td>
              </tr>
              <tr>
                <td>F317C, F317I, F317L, F317V, T315A, V299L</td>
                <td>Nilotinib</td>
              </tr>
              <tr>
                <td>
                  <GenePageLink hugoSymbol={'FLT3'} />
                </td>
                <td>ITD</td>
                <td>AML</td>
                <td>Crenolanib, Quizartinib</td>
              </tr>
              <tr>
                <td rowSpan={4}>4</td>
                <td>
                  <GenePageLink hugoSymbol={'SF3B1'} />
                </td>
                <td rowSpan={4}>Oncogenic Mutations</td>
                <td rowSpan={4}>
                  AML, Chronic Myelomonocytic Leukemia (CMML), Myelodysplastic
                  Syndrome (MDS)
                </td>
                <td rowSpan={4}>H3B-8800</td>
              </tr>
              <tr>
                <td>
                  <GenePageLink hugoSymbol={'SRSF2'} />
                </td>
              </tr>
              <tr>
                <td>
                  <GenePageLink hugoSymbol={'U2AF1'} />
                </td>
              </tr>
              <tr>
                <td>
                  <GenePageLink hugoSymbol={'ZRSR2'} />
                </td>
              </tr>
            </tbody>
          </table>
        </Row>
      </span>,
    ],
    newlyAddedGenes: [
      'ATF1',
      'CCNB3',
      'CMTR2',
      'CREB1',
      'CTR9',
      'CXORF67',
      'DDIT3',
      'ETAA1',
      'ETV5',
      'FEV',
      'FLI1',
      'IL3',
      'KAT6A',
      'KBTBD4',
      'KLF2',
      'LMO2',
      'LZTR1',
      'MAF',
      'MAFB',
      'NR4A3',
      'NRG1',
      'NUP98',
      'PDGFB',
      'PGBD5',
      'PHF6',
      'PRKACA',
      'SETBP1',
      'SLFN11',
      'SPRTN',
      'SS18',
      'TCL1A',
      'TCL1B',
      'TFE3',
      'TRIP13',
      'USP8',
      'YY1',
      'ZNRF3',
    ],
    newlyAddedGenesTypes: ['heme', 'fusion'],
    updatedImplicationInOldFormat: {
      '1': [
        <span>
          April 12, 2019:{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.fda.gov/drugs/resources-information-approved-drugs/fda-grants-accelerated-approval-erdafitinib-metastatic-urothelial-carcinoma"
          >
            the FDA approved erdafitinib
          </a>{' '}
          for patients with locally advanced or metastatic urothelial carcinoma,
          with susceptible FGFR3 or FGFR2 genetic alterations (FGFR2 Fusions,
          FGFR3 Fusions or FGFR3 R248C, S249C, G370C, Y373C mutations), that has
          progressed during or following platinum-containing chemotherapy.
        </span>,
      ],
      '4': [
        <span>
          MET - Fusions - All Tumors - Crizotinib (<b>new association</b>)
        </span>,
        <span>
          CDK12 - Truncating Mutations - All Tumors - Pembrolizumab, Nivolumab,
          Cemiplimab (<b>new association</b>)
        </span>,
      ],
    },
  },
  '01242019': {
    newlyAddedGenesTypes: ['heme'],
    newlyAddedGenes: [
      'ECT2L',
      'RELN',
      'TAL1',
      'MLLT10',
      'TLX3',
      'TLX1',
      'TRA',
      'TRB',
      'TRD',
      'TRG',
      'EPOR',
      'ABL2',
      'MECOM',
      'DEK',
      'RBM15',
      'BCL9',
    ],
    updatedImplicationInOldFormat: {
      '1': [
        <span>
          November 2, 2018:{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.fda.gov/Drugs/InformationOnDrugs/ApprovedDrugs/ucm625027.htm"
          >
            the FDA approved lorlatinib
          </a>{' '}
          for patients with anaplastic lymphoma kinase (ALK)-positive metastatic
          non-small cell lung cancer (NSCLC) whose disease has progressed on
          crizotinib and at least one other ALK inhibitor or whose disease has
          progressed on alectinib or ceritinib for metastatic disease.
        </span>,
      ],
    },
  },
  '12142018': {
    priorityNews: [
      <span>
        Inclusion of <GenePageLink hugoSymbol={'NTRK1'} /> and{' '}
        <GenePageLink hugoSymbol={'NTRK3'} /> Level R2 alterations to the
        Actionable Genes page
      </span>,
    ],
    newlyAddedGenes: [
      'KSR2',
      'LCK',
      'LTB',
      'MGAM',
      'MOB3B',
      'MPEG1',
      'NCOR2',
      'PIGA',
      'PLCG1',
      'POT1',
      'ROBO1',
      'RUNX1T1',
      'SAMHD1',
      'SETD1A',
      'SGK1',
      'SMC1A',
      'SMC3',
      'SMG1',
      'SP140',
      'STAT6',
      'TBL1XR1',
      'UBR5',
      'VAV1',
      'VAV2',
      'XBP1',
    ],
    newlyAddedGenesTypes: ['heme'],
    updatedImplicationInOldFormat: {
      '1': [
        <span>
          November 26, 2018:{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.fda.gov/Drugs/InformationOnDrugs/ApprovedDrugs/ucm626720.htm"
          >
            the FDA approved larotrectinib
          </a>{' '}
          for adult and pediatric patients with solid tumors that have an NTRK1,
          -2, or -3 gene fusion without a known acquired resistance mutation.
        </span>,
      ],
      '2': [
        <span>
          BRCA1/2 - Oncogenic Mutations - Breast Cancer - Talazoparib (
          <b>new association</b>)
        </span>,
        <span>
          RET - Fusions - Non-Small Cell Lung Cancer - BLU-667 (
          <b>new association</b>)
        </span>,
      ],
      '3': [
        <span>
          BRAF - V600E - Colorectal Cancer - Encorafenib + Binimetinib +
          Cetuximab (<b>new association</b>)
        </span>,
        <span>
          ERBB2 - Oncogenic Mutations - Non-Small Cell Lung Cancer -
          Ado-trastuzumab Emtansine (<b>new association</b>)
        </span>,
        <span>
          RET - Oncogenic Mutations - Medullary Thyroid Cancer - BLU-667 (
          <b>new association</b>)
        </span>,
      ],
      '4': [
        <span>
          KDM6A - Oncogenic Mutations - Bladder Cancer - EZH2 inhibitors (
          <b>new association</b>)
        </span>,
      ],
    },
  },
  '11022018': {
    updatedImplicationInOldFormat: {
      '2': [
        <span>
          RET - Fusions - Non-Small Cell Lung Cancer - LOXO-292 (
          <b>added as new association</b>)
        </span>,
      ],
    },
  },
  '10262018': {
    news: [
      <span>
        OncoTree updated from version{' '}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="http://oncotree.info/#/home?version=oncotree_2017_06_21"
        >
          2017_06_21
        </a>{' '}
        to version{' '}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="http://oncotree.info/#/home?version=oncotree_2018_06_15"
        >
          2018_06_15
        </a>
      </span>,
      <span>
        {ONCOKB_TM} is monitoring the following drugs that were granted{' '}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.fda.gov/forpatients/approvals/fast/ucm405397.htm"
        >
          Breakthrough Therapy
        </a>{' '}
        designation by the FDA:
        <ul className="bullet" style={{ marginTop: '0.875rem' }}>
          <li>
            Oct 2, 2018:{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.onclive.com/web-exclusives/fda-grants-rucaparib-breakthrough-designation-for-mcrpc"
            >
              Rucarparib in adult patients with BRCA1/2-positive metastatic
              castration-resistant disease following at least 1 androgen
              receptor–directed therapy and taxane-based chemotherapy.
            </a>
          </li>
        </ul>
      </span>,
    ],
    priorityNews: [
      <span>
        Level <Link to={PAGE_ROUTE.ACTIONABLE_GENE}>R2</Link> alterations in{' '}
        <GenePageLink hugoSymbol={'ALK'} /> <GenePageLink hugoSymbol={'EGFR'} />{' '}
        <GenePageLink hugoSymbol={'MET'} /> are now included in the{' '}
        <Link to={PAGE_ROUTE.ACTIONABLE_GENE}>Actionable Genes</Link> page
      </span>,
    ],
    newlyAddedGenes: [
      'NT5C2',
      'P2RY8',
      'PCBP1',
      'PDS5B',
      'PTPN1',
      'PTPN2 ',
      'STAG1',
      'TRAF3',
      'TRAF5',
    ],
    newlyAddedGenesTypes: ['heme'],
    updatedImplicationInOldFormat: {
      '4': [
        <span>
          ALK - C1156Y, G1269A, I1171N, L1196M - Non-Small Cell Lung Cancer -
          Lorlatinib
        </span>,
        <span>EGFR - D761Y - Non-Small Cell Lung Cancer - Osimertinib</span>,
      ],
    },
  },
  '10012018': {
    news: [
      <span>
        {ONCOKB_TM} is monitoring the following drugs that were granted{' '}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.fda.gov/forpatients/approvals/fast/ucm405397.htm"
        >
          Breakthrough Therapy
        </a>{' '}
        designation by the FDA:
        <ul className="bullet" style={{ marginTop: '0.875rem' }}>
          <li>
            Sept 5, 2018:{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.onclive.com/web-exclusives/fda-grants-loxo292-breakthrough-designation-for-nsclc-mtc"
            >
              LOXO-292 for RET fusion–positive non–small cell lung cancer
              (NSCLC) or RET-mutant medullary thyroid cancer (MTC)
            </a>
          </li>
        </ul>
      </span>,
    ],
    updatedImplicationInOldFormat: {
      '3': [
        <span>
          RET - Oncogenic Mutations - Medullary Thyroid Cancer - LOXO-292 (
          <b>added as new association</b>)
        </span>,
      ],
    },
    newlyAddedGenes: [
      'HIST1H1E',
      'SETD6',
      'SETD5',
      'SETD7',
      'SETDB2',
      'SETDB1',
      'SETD4',
      'SETD3',
      'SETD1B',
      'U2AF2',
      'TET3',
      'NFE2',
      'IRF8',
      'IRF1',
      'IKZF3',
      'JARID2',
      'NCSTN',
      'HIST1H2BO',
      'HIST1H2AC',
      'HIST1H2BG',
      'HIST1H2BJ',
      'HIST1H2BK',
      'HIST1H2BC',
      'HIST1H2AG',
      'HIST1H2AL',
      'HIST1H2AM',
      'TYK2',
    ],
    newlyAddedGenesTypes: ['heme'],
  },
  '08202018': {
    news: [
      <span>
        Incorporation of positional variants (e.g., BRAF V600) into Actionable
        Genes table.
      </span>,
      <span>Updated layout of Actionable Genes table.</span>,
      <span>
        {ONCOKB_TM} is monitoring the following drugs that were granted{' '}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.fda.gov/forpatients/approvals/fast/ucm405397.htm"
        >
          Breakthrough Therapy
        </a>{' '}
        designation by the FDA:
        <ul className="bullet" style={{ marginTop: '0.875rem' }}>
          <li>
            August 6, 2018:{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="http://www.ascopost.com/News/59131"
            >
              Lenvatinib Plus Pembrolizumab in non-MSI-H Endometrial Carcinoma
            </a>
          </li>
          <li>
            August 7, 2018:{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="http://www.ascopost.com/News/59138"
            >
              Quizartinib for Relapsed/Refractory FLT3-ITD AML
            </a>
          </li>
          <li>
            August 14, 2018:{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="http://www.ascopost.com/News/59160"
            >
              Encorafenib Plus Binimetinib and Cetuximab in BRAFV600E–Mutant
              Metastatic Colorectal Cancer
            </a>
          </li>
        </ul>
      </span>,
    ],
    priorityNews: [
      <span>
        {ONCOKB_TM} now contains over 4000 curated alterations in over 500
        genes.
      </span>,
    ],
    newlyAddedGenes: [
      'ACTG1',
      'ARHGEF28',
      'ARID3A',
      'ARID3B',
      'ARID3C',
      'ARID4A',
      'ARID4B',
      'ARID5A',
      'ATP6AP1',
      'ATP6V1B2',
      'ATXN2',
      'BACH2',
      'BCL11B',
      'BCORL1',
      'BCR',
      'BTG1',
      'CD28',
      'CD58',
      'CIITA',
      'CRBN',
      'CUX1',
      'DDX3X',
      'DTX1',
      'DUSP22',
      'EGR1',
      'EP400',
      'ESCO2',
      'ETNK1',
      'FANCD2',
      'FAS',
      'FBXO11',
      'FURIN',
      'GNA12',
      'GNA13',
      'GNB1',
      'GTF2I',
      'HDAC1',
      'HDAC4',
      'HDAC7',
      'HIF1A',
      'HIST1H1B',
      'HIST1H1D',
    ],
    newlyAddedGenesTypes: ['heme'],
    updatedImplicationInOldFormat: {
      '1': [
        <span>
          July 20, 2018:{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.fda.gov/Drugs/InformationOnDrugs/ApprovedDrugs/ucm614128.htm"
          >
            the FDA approved ivosidenib
          </a>{' '}
          for adult patients with relapsed or refractory acute myeloid leukemia
          (AML) with a susceptible IDH1 mutation as detected by an FDA-approved
          test.
        </span>,
      ],
    },
  },
  '07122018': {
    news: [
      <span>
        New Level 4 associations have been added:
        <Row className={'overflow-auto'}>
          <SimpleTable
            columns={NEWLY_ADDED_LEVEL_FOUR_COLUMNS}
            rows={NEWLY_ADDED_LEVEL_FOUR.map((record, index) => {
              const geneInput = record[0];
              return {
                key: `NEWLY_ADDED_LEVEL_FOUR-${index}`,
                content: record.map((subItem, subIndex) => {
                  let content: ElementType = subItem;
                  if (subIndex === 0) {
                    content = <GenePageLink hugoSymbol={subItem} />;
                  } else if (
                    subIndex === 1 &&
                    linkableMutationName(geneInput, subItem)
                  ) {
                    content = (
                      <AlterationPageLink
                        hugoSymbol={geneInput}
                        alteration={subItem}
                      />
                    );
                  }
                  return {
                    key: `NEWLY_ADDED_LEVEL_FOUR-${index}-${subIndex}`,
                    content,
                  };
                }),
              };
            })}
          />
        </Row>
      </span>,
      <span>
        Inclusion of Level R1 actionable alterations in Actionable Genes
      </span>,
    ],
    updatedImplicationInOldFormat: {
      '1': [
        <span>
          April 18, 2018:{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.fda.gov/Drugs/InformationOnDrugs/ApprovedDrugs/ucm605113.htm"
          >
            the FDA approved osimertinib
          </a>{' '}
          for the first-line treatment of patients with metastatic non-small
          cell lung cancer (NSCLC) whose tumors have epidermal growth factor
          receptor (EGFR) exon 19 deletions or exon 21 L858R mutations.
        </span>,
        <span>
          May 4, 2018:{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.fda.gov/Drugs/InformationOnDrugs/ApprovedDrugs/ucm606708.htm"
          >
            the FDA approved the combination of dabrafenib plus trametinib
          </a>{' '}
          for treatment of patients with locally advanced or metastatic
          anaplastic thyroid cancer with BRAF V600E mutation and with no
          satisfactory locoregional treatment options.
        </span>,
        <span>
          June 27, 2018:{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.fda.gov/Drugs/InformationOnDrugs/ApprovedDrugs/ucm611981.htm"
          >
            the FDA approved the combination of encorafenib plus binimetinib
          </a>{' '}
          for patients with BRAF V600E- or V600K-mutant metastatic and/or
          unresectable melanoma.
        </span>,
      ],
      '3': [
        <span>
          EGFR - Exon 20 insertions - Non-small cell lung cancer - Poziotinib (
          <b>added as new association</b>)
        </span>,
        <span>
          ALK - G1202R - Non-small cell lung cancer - Lorlatinib (
          <b>added as new association</b>)
        </span>,
        <span>
          KIT - D816 mutations - Mastocytosis - Avapritinib (
          <b>added as new association</b>)
        </span>,
        <span>
          MTOR - E2014K, E2419K - Bladder cancer - Everolimus (
          <b>updated association</b>)
        </span>,
        <span>
          MTOR - L1460P, L2209V, L2427Q - Renal cell carcinoma - Temsirolimus (
          <b>updated association</b>)
        </span>,
        <span>
          MTOR - Q2223K - Renal cell carcinoma - Everolimus (
          <b>updated association</b>)
        </span>,
      ],
    },
  },
  '02022018': {
    news: [
      <span>
        Addition of a new gene: KLF5 (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.ncbi.nlm.nih.gov/pubmed/28963353"
        >
          Zhang et al., Cancer Discovery, 2017
        </a>
        ).
      </span>,
      <span>
        Addition of new alterations and updates to existing alterations.
      </span>,
    ],
    updatedImplicationInOldFormat: {
      '1': [
        <span>
          November 6, 2017:{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.fda.gov/NewsEvents/Newsroom/PressAnnouncements/ucm583931.htm"
          >
            the FDA approved vemurafenib
          </a>{' '}
          for treatment of patients with Erdheim-Chester disease (histiocytosis)
          who harbor BRAF V600 mutations.
        </span>,
      ],
      '3': [
        <span>
          HRAS - Oncogenic Mutations - Head and Neck Squamous Cell Carcinoma -
          Tipifarnib (<b>moved from 4 to 3A only for HNSCC</b>)
        </span>,
      ],
    },
  },
  '10262017': {
    news: [
      <span>Updates to Levels of Evidence 3A and 4.</span>,
      <span>
        Mutation frequency plots are now calculated based on{' '}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.cbioportal.org/study?id=msk_impact_2017#summary"
        >
          {MSK_IMPACT_TM} Clinical Sequencing Cohort
        </a>{' '}
        (
        <a
          href="https://www.ncbi.nlm.nih.gov/pubmed/28481359"
          target="_blank"
          rel="noopener noreferrer"
        >
          Zehir et al., Nature Medicine, 2017
        </a>
        ).
      </span>,
    ],
  },
  '08172017': {
    news: [
      <span>
        August 1, 2017:{' '}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.fda.gov/Drugs/InformationOnDrugs/ApprovedDrugs/ucm569366.htm"
        >
          the FDA approved nivolumab
        </a>{' '}
        for treatment of patients with mismatch repair deficient (MMR-D) and{' '}
        <MSILink /> metastatic colorectal cancer that has progressed following
        treatment with a fluoropyrimidine, oxaliplatin and irinotecan.
      </span>,
      <span>
        August 1, 2017:{' '}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.fda.gov/Drugs/InformationOnDrugs/ApprovedDrugs/ucm569482.htm"
        >
          the FDA approved enasidenib
        </a>{' '}
        for treatment of patients with relapsed or refractory
        <GenePageLink hugoSymbol={'IDH2'}>IDH2-mutant</GenePageLink> Acute
        Myeloid Leukemia (AML).
      </span>,
      <span>
        June 22, 2017:{' '}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.fda.gov/Drugs/InformationOnDrugs/ApprovedDrugs/ucm564331.htm"
        >
          the FDA approved combination dabrafenib + trametinib
        </a>{' '}
        for treatment of patients with{' '}
        <AlterationPageLink
          hugoSymbol={'BRAF'}
          alteration={'V600E'}
          showGene={true}
        />{' '}
        mutant metastatic NSCLC.
      </span>,
      <span>
        May 23, 2017:{' '}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.fda.gov/Drugs/InformationOnDrugs/ApprovedDrugs/ucm560040.htm"
        >
          the FDA approved pembrolizumab
        </a>{' '}
        for treatment of patients with unresectable or metastatic, <MSILink />{' '}
        or mismatch repair deficient (MMR-D) solid tumors.
      </span>,
    ],
  },
  '08022017': {
    news: [
      <span>
        Introduced a curated list of{' '}
        <Link to={PAGE_ROUTE.CANCER_GENES}>cancer genes</Link>.
      </span>,
      <span>
        Addition of gene-alterations pages with alteration level annotation.{' '}
        <AlterationPageLink hugoSymbol={'BRAF'} alteration={'V600E'}>
          e.g. BRAF V600E
        </AlterationPageLink>
        .
      </span>,
      <>
        <span style={{ marginLeft: '-0.25rem' }}>
          Improved search box that queries genes and alterations.
        </span>
        <br />
        <Row>
          <Col lg={6} md={8} xs={12}>
            <OptimizedImage src={SearchOneImg} />
          </Col>
        </Row>
        <Row>
          <Col lg={6} md={8} xs={12}>
            <OptimizedImage className="md-auto" src={SearchTwoImg} />
          </Col>
        </Row>
      </>,
    ],
  },
  '05152017': {
    news: [
      <span>
        Brigatinib FDA-approval in ALK-positive NSCLC added as a new Level 1
        association.
      </span>,
      <span>
        Amplification events for most Oncogenes and Deletions or Truncating
        mutations for most Tumor Suppressor have been annotated/updated.
      </span>,
      <span>Inclusion of literature from AACR 2017.</span>,
      <span>
        Addition of new alterations and updates to existing alteration
        annotations.
      </span>,
    ],
  },
  '04052017': {
    priorityNews: [
      <span>Curation of 58 additional genes.</span>,
      <>
        <span style={{ marginLeft: '-0.25rem' }}>
          Gene alias information added to gene page and search box.
        </span>
        <br />
        <Row>
          <Col xs={12} md={8} xl={6}>
            <OptimizedImage src={ERBBImg} />
          </Col>
        </Row>
      </>,
      <span>API updates.</span>,
    ],
    updatedImplicationInOldFormat: {
      '1': [
        <span>
          BRCA1/2 - Oncogenic Mutations - Ovarian Cancer - Niraparib FDA
          approval added
        </span>,
        <span>
          BRCA1/2 - Oncogenic Mutations - Ovarian Cancer - Rucaparib (
          <b>new publication added</b>)
        </span>,
        <span>
          Updated alterations for KIT - Gastrointestinal Stromal Tumor -
          Imatinib, Sunitinib, Regorafenib
        </span>,
      ],
      '2': [
        <span>
          Updated alterations for KIT - Gastrointestinal Stromal Tumor -
          Nilotinib, Dasatinib, Sorafenib
        </span>,
        <span>
          Updated alterations for KIT - Thymic cancer - Sunitinib, Sorafenib
        </span>,
      ],
      '3': [
        <span>
          BRAF V600 - Colorectal Cancer - Encorafenib + Binimetinib + Cetuximab
          (<b>new association</b>)
        </span>,
        <span>
          FGFR1 - Amplification - Lung Squamous Cell Carcinoma - AZD4547,
          Debio1347 (<b>new abstract added</b>)
        </span>,
        <span>
          FGFR2 - Fusions - Cholangiocarcinoma - BGJ398, Debio1347 (
          <b>new abstract added</b>)
        </span>,
        <span>
          Updated alterations for FGFR3 - Bladder cancer - JNJ-42756493,
          Debio1347
        </span>,
        <span>
          PIK3CA - Oncogenic Mutations - Breast cancer - Updated treatments and
          evidence
        </span>,
      ],
      '4': [
        <span>
          BRAF V600 - Colorectal Cancer - Radiation + Trametinib + Fluorouracil
          (<b>new association</b>)
        </span>,
        <span>Updated alterations for FGFR3 - Breast cancer - Debio1347</span>,
        <span>KRAS - Wildtype - Updated treatments and evidence</span>,
        <span>
          KRAS - Oncogenic Mutations - Updated treatments and evidence
        </span>,
        <span>
          PIK3CA - Oncogenic Mutations - Breast cancer - Updated treatments and
          evidence
        </span>,
        <span>
          PTEN - Oncogenic Mutations - Breast cancer - Updated treatments and
          evidence
        </span>,
      ],
    },
  },
  '03072017': {
    priorityNews: [
      <span>
        Expanded selection of genes with Oncogene or Tumor Suppressor
        annotation.
      </span>,
      <span>
        Level 4 actionable genes are now accessible from the home page.
      </span>,
    ],
    updatedImplicationInOldFormat: {
      '1': [
        <span>
          Updated alterations for EGFR - Non-Small Cell Lung Cancer - EGFR TKIs
        </span>,
        <span>
          Updated alterations for KIT - Gastrointestinal Stromal Tumor -
          Imatinib, Sunitinib, Regorafenib
        </span>,
      ],
      '2': [
        <span>
          CDK4 - Amplification - Well-Differentiated
          Liposarcoma/Dedifferentiated Liposarcoma - Palbociclib, Abemaciclib (
          <b>disease changed from Soft Tissue Sarcoma and Abemaciclib added</b>)
        </span>,
        <span>
          TSC1 - Renal Cell Carcinoma - Everolimus (<b>new association</b>)
        </span>,
      ],
      '3': [
        <span>
          ESR1 - Oncogenic Mutations - AZD9496, Fulvestrant (
          <b>new association</b>)
        </span>,
        <span>
          FGFR1 - Amplification - Breast Cancer - Dovitinib (<b>removed</b>)
        </span>,
        <span>
          FGFR1 - Amplification - Lung Squamous Cell Carcinoma - Debio1347 (
          <b>new association</b>)
        </span>,
        <span>
          FGFR2 - Amplification - Breast Cancer - Dovitinib (<b>removed</b>)
        </span>,
        <span>
          FGFR2/3 - Fusions - Various cancer types - Debio1347 (
          <b>new association</b>)
        </span>,
        <span>
          FGFR3 - Hotspots - Bladder Cancer - Debio1347, JNJ-42756493 (
          <b>new association</b>)
        </span>,
        <span>
          KRAS - Oncogenic Mutations - Colorectal Cancer -
          Atezolizumab+Cobimetinib (<b>moved from 4 to 3A only in CRC</b>)
        </span>,
        <span>
          MDM2 - Amplification - Liposarcoma - DS-3032b and RG7112 (
          <b>new association</b>)
        </span>,
        <span>
          PIK3CA - Oncogenic Mutations - Breast Cancer - Alpelisib+Fulvestrant,
          Buparlisib+Fulvestrant, Copanlisib, GDC0077, Serabelisib,
          Fulvestrant+Taselisib (<b>new drugs added</b>)
        </span>,
      ],
      '4': [
        <span>
          EGFR alterations - Glioma - Erlotinib (<b>removed</b>)
        </span>,
        <span>
          MDM2 - Amplification - Liposarcoma - DS-3032b (<b>moved to 3A</b>)
        </span>,
        <span>
          PIK3CA - Oncogenic Mutations - Breast Cancer - Alpelisib+Fulvestrant (
          <b>moved to 3A</b>)
        </span>,
        <span>
          IDH1 - R132 alterations - Chondrosarcoma - AG-120 (
          <b>moved from 3A to 4</b>)
        </span>,
      ],
    },
  },
  '12292016': {
    news: [
      <span>
        Level 3 and 4 alterations supported by data from conference proceedings
        are now included in the Actionable Genes tab.
      </span>,
    ],
  },
  '11222016': {
    news: [
      <span>
        All {ONCOKB_TM} alterations and their annotations can now be{' '}
        <Link to={PAGE_ROUTE.API_ACCESS}>
          {' '}
          batch downloaded or accessed programmatically via our API.
        </Link>
      </span>,
      <span>
        Oncogene and tumor suppressor gene annotations have been added.
      </span>,
      <span>
        Alterations with inconclusive supporting data have now been included.
      </span>,
    ],
  },
  '10242016': {
    news: [
      <span>
        Inclusion of a selection of Level 4 associations in the Actionable Genes
        tab.
      </span>,
      <span>
        KRAS activating mutations are no longer considered Level 3A based on the
        completion of the SELECT-1 trial. Despite promising initial results,
        selumetinib did not have a significant effect on survival, and therefore
        activating KRAS mutations are now considered Level 4.
      </span>,
    ],
  },
  '09162016': {
    news: [<span>Updated Actionable Genes.</span>],
  },
  '08102016': {
    news: [
      <>
        <span style={{ marginLeft: '-0.25rem' }}>
          Improved visualization of {ONCOKB_TM} in cBioPortal:
        </span>
        <br />
        <Row>
          <Col xs={12} md={8} xl={6}>
            <OptimizedImage src={ClinicalImg} />
          </Col>
          <Col xs={12} md={8} xl={6}>
            <OptimizedImage src={BiologicalImg} />
          </Col>
        </Row>
      </>,
      <span>
        Updated genes and alterations in the tables of Levels 1, 2 and 3
        Actionable Genes.
      </span>,
      <span>Updated Levels of Evidence.</span>,
    ],
  },
  '07062016': {
    news: [
      <span>
        Annotations for Level 1, 2 and 3 genes now include key updates from ASCO
        2016.
      </span>,
      <span>
        The Levels of Evidence system now includes Level R1, comprising of
        alterations that are NCCN-compendium listed as a biomarker of resistance
        to an FDA-approved drug.
      </span>,
    ],
  },
};
