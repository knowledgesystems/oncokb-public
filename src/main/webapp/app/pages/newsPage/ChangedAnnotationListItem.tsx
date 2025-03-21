import {
  CHANGED_ANNOTATION_LEVEL_COLUMNS,
  CHANGED_ANNOTATION_DRUG_COLUMNS,
  CHANGED_ANNOTATION_ADDITIONAL_DRUG_SAME_LEVEL_COLUMNS,
  CHANGED_ANNOTATION_ADDITIONAL_DRUG_DIFF_LEVEL_COLUMNS,
  GENE,
  MUTATION,
  CHANGED_ANNOTATION_DRUG_REMOVAL_COLUMNS,
  CHANGED_ANNOTATION_LEVEL_WITH_EVIDENCE_COLUMNS,
  CHANGED_ANNOTATION_SENSITIVITY_LEVEL_COLUMNS,
  UPDATED_IMPLICATION_COLUMNS,
  CHANGED_ANNOTATION_DRUG_REMOVAL_SAME_HIGHEST_LEVEL_COLUMNS,
  CHANGED_ANNOTATION_DRUG_SAME_HIGHEST_LEVEL_COLUMNS,
  CHANGED_ANNOTATION_UPDATED_DRUG_SAME_HIGHEST_LEVEL_COLUMNS,
} from 'app/pages/newsPage/NewsPageContent';
import { SimpleTable, SimpleTableRow } from 'app/components/SimpleTable';
import { Row } from 'react-bootstrap';
import React from 'react';

import mainStyle from './main.module.scss';
import {
  convertGeneInputToLinks,
  getColumnIndexByName,
  linkableMutationName,
} from './Util';
import { AlterationPageLink } from 'app/shared/utils/UrlUtils';
import { sortBy } from 'app/shared/utils/LodashUtils';

export enum AnnotationColumnHeaderType {
  LEVEL,
  DRUG,
  ADDITIONAL_SAME_LEVEL_DRUG,
  ADDITIONAL_DIFF_LEVEL_DRUG,
  ADDITIONAL_SENSITIVITY_LEVEL_DRUG,
  DRUG_REMOVAL,
  DRUG_REMOVAL_SAME_HIGHEST_LEVEL,
  DRUG_UPDATE_SAME_HIGHEST_LEVEL,
  DEMOTION_TUMOR_TYPE_SPECIFIC_EVIDENCE,
  PROMOTION_TUMOR_TYPE_SPECIFIC_EVIDENCE,
  NEW_ALTERATION_WITH_LEVEL,
  UPDATED_SAME_LEVEL_DRUG,
}

export const ChangedAnnotationListItem = (props: {
  title?: string;
  data: SimpleTableRow[];
  columnHeaderType?: AnnotationColumnHeaderType;
  headers?: {
    name: string;
  }[];
  useOneLineRowClass?: boolean;
}) => {
  let longestRow = 0;
  if (props.data.length > 0) {
    longestRow = sortBy(props.data, row => -row.content.length)[0].content
      .length;
  }

  let annotationColumnHeader = undefined;
  let useOneLineRowClass = true;
  let defaultTitle = '';
  switch (props.columnHeaderType) {
    case AnnotationColumnHeaderType.DRUG:
      annotationColumnHeader = CHANGED_ANNOTATION_DRUG_COLUMNS;
      break;
    case AnnotationColumnHeaderType.ADDITIONAL_SAME_LEVEL_DRUG:
      annotationColumnHeader = CHANGED_ANNOTATION_ADDITIONAL_DRUG_SAME_LEVEL_COLUMNS;
      useOneLineRowClass = false;
      defaultTitle =
        'Updated therapeutic implications - Addition of therapies for variants with a level of evidence';
      break;
    case AnnotationColumnHeaderType.DRUG_UPDATE_SAME_HIGHEST_LEVEL:
      annotationColumnHeader = CHANGED_ANNOTATION_DRUG_SAME_HIGHEST_LEVEL_COLUMNS;
      useOneLineRowClass = false;
      defaultTitle = `Updated therapeutic implications - Changed drug specific tumor-type level of evidence for an alteration-tumor type-drug association currently in OncoKB (without changing the alteration's highest level of evidence)`;
      break;
    case AnnotationColumnHeaderType.ADDITIONAL_DIFF_LEVEL_DRUG:
      annotationColumnHeader = CHANGED_ANNOTATION_ADDITIONAL_DRUG_DIFF_LEVEL_COLUMNS;
      useOneLineRowClass = false;
      defaultTitle = 'Changed Annotation';
      break;
    case AnnotationColumnHeaderType.ADDITIONAL_SENSITIVITY_LEVEL_DRUG:
      annotationColumnHeader = CHANGED_ANNOTATION_SENSITIVITY_LEVEL_COLUMNS;
      useOneLineRowClass = false;
      defaultTitle =
        'Updated therapeutic implications - Addition of sensitivity-associated therapy(s) for an alteration(s) with a tumor type-specific resistance level of evidence';
      break;
    case AnnotationColumnHeaderType.DRUG_REMOVAL:
      annotationColumnHeader = CHANGED_ANNOTATION_DRUG_REMOVAL_COLUMNS;
      useOneLineRowClass = false;
      defaultTitle =
        'Updated therapeutic implications - Removal of therapy(s) and changed tumor type-specific level of evidence for an alteration(s)';
      break;
    case AnnotationColumnHeaderType.DRUG_REMOVAL_SAME_HIGHEST_LEVEL:
      annotationColumnHeader = CHANGED_ANNOTATION_DRUG_REMOVAL_SAME_HIGHEST_LEVEL_COLUMNS;
      useOneLineRowClass = false;
      defaultTitle = `Updated therapeutic implications - Removal of therapy(s) associated with a tumor type-specific leveled alteration(s) (without changing the alteration's highest level of evidence)`;
      break;
    case AnnotationColumnHeaderType.PROMOTION_TUMOR_TYPE_SPECIFIC_EVIDENCE:
      annotationColumnHeader = CHANGED_ANNOTATION_LEVEL_WITH_EVIDENCE_COLUMNS;
      useOneLineRowClass = false;
      defaultTitle =
        'Updated therapeutic implications - Promotion of tumor type-specific level of evidence for an alteration(s)';
      break;
    case AnnotationColumnHeaderType.DEMOTION_TUMOR_TYPE_SPECIFIC_EVIDENCE:
      annotationColumnHeader = CHANGED_ANNOTATION_LEVEL_WITH_EVIDENCE_COLUMNS;
      useOneLineRowClass = false;
      defaultTitle =
        'Updated therapeutic implications - Demotion of tumor type-specific level of evidence for an alteration(s)';
      break;
    case AnnotationColumnHeaderType.NEW_ALTERATION_WITH_LEVEL:
      annotationColumnHeader = UPDATED_IMPLICATION_COLUMNS;
      useOneLineRowClass = false;
      defaultTitle =
        'Updated therapeutic implications - New alteration(s) with a tumor type-specific level of evidence';
      break;
    case AnnotationColumnHeaderType.UPDATED_SAME_LEVEL_DRUG:
      annotationColumnHeader = CHANGED_ANNOTATION_UPDATED_DRUG_SAME_HIGHEST_LEVEL_COLUMNS;
      defaultTitle =
        "Updated therapeutic implications - Addition of drug(s) associated with a tumor type-specific leveled alteration(s) currently in OncoKB™ (without changing the alteration's highest level of evidence)";
      useOneLineRowClass = true;
      break;
    case AnnotationColumnHeaderType.LEVEL:
    default:
      annotationColumnHeader = CHANGED_ANNOTATION_LEVEL_COLUMNS;
      useOneLineRowClass = true;
      defaultTitle = 'Changed Annotation';
      break;
  }

  const geneColumnIndex = getColumnIndexByName(annotationColumnHeader, GENE);
  const mutationColumnIndex = getColumnIndexByName(
    annotationColumnHeader,
    MUTATION
  );

  if (mutationColumnIndex > -1 && geneColumnIndex > -1) {
    // transform the gene and mutation input to a link, ignore the inputs with comma, pipe or slash
    props.data.forEach(row => {
      const geneInput = row.content[geneColumnIndex].content;
      const mutationInput = row.content[mutationColumnIndex].content;
      if (typeof geneInput === 'string' && typeof mutationInput === 'string') {
        if (linkableMutationName(geneInput, mutationInput)) {
          row.content[mutationColumnIndex].content = (
            <AlterationPageLink
              key={`${geneInput}-${mutationInput}`}
              hugoSymbol={geneInput}
              alteration={mutationInput}
            />
          );
        }
      }
    });
  }

  if (geneColumnIndex > -1) {
    // transform the gene input to link(s)
    props.data.forEach(row => {
      const geneInput = row.content[geneColumnIndex].content;
      if (typeof geneInput === 'string') {
        row.content[geneColumnIndex].content = convertGeneInputToLinks(
          geneInput
        );
      }
    });
  }

  return (
    <li>
      {props.title ? props.title : defaultTitle}
      <Row className={'overflow-auto'}>
        <SimpleTable
          columns={
            props.headers
              ? props.headers
              : annotationColumnHeader.slice(0, longestRow)
          }
          rows={props.data}
          theadClassName={
            props.useOneLineRowClass ?? useOneLineRowClass
              ? mainStyle.oneRowHeader
              : ''
          }
        />
      </Row>
    </li>
  );
};
