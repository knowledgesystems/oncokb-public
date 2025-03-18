import { computed } from 'mobx';
import { SearchColumn } from 'app/components/oncokbTable/OncoKBTable';
import { BiologicalVariant } from 'app/shared/api/generated/OncoKbPrivateAPI';
import {
  filterByKeyword,
  getDefaultColumnDefinition,
} from 'app/shared/utils/Utils';
import {
  ONCOKB_TM,
  REFERENCE_GENOME,
  TABLE_COLUMN_KEY,
} from 'app/config/constants';
import { AlterationPageLink } from 'app/shared/utils/UrlUtils';
import { Citations } from 'app/shared/api/generated/OncoKbAPI';
import { DescriptionTooltip } from 'app/pages/annotationPage/DescriptionTooltip';
import SummaryWithRefs from 'app/oncokb-frontend-commons/src/components/SummaryWithRefs';
import React, { FunctionComponent } from 'react';
import { GenePageTable } from 'app/pages/genePage/GenePageTable';

const getColumns = (germline: boolean, hugoSymbol: string) => {
  const altColumn = {
    ...getDefaultColumnDefinition(TABLE_COLUMN_KEY.ALTERATION),
    accessor: 'variant',
    onFilter: (data: BiologicalVariant, keyword: string) =>
      filterByKeyword(data.variant.name, keyword),
    Cell(props: { original: BiologicalVariant }) {
      return (
        <>
          <AlterationPageLink
            hugoSymbol={hugoSymbol}
            alteration={{
              alteration: props.original.variant.alteration,
              name: props.original.variant.name,
            }}
            alterationRefGenomes={
              props.original.variant.referenceGenomes as REFERENCE_GENOME[]
            }
            germline={germline}
          />
        </>
      );
    },
  };
  const descriptionColumn = {
    ...getDefaultColumnDefinition(TABLE_COLUMN_KEY.DESCRIPTION),
    accessor(d: BiologicalVariant) {
      return {
        abstracts: d.pathogenicAbstracts,
        pmids: d.pathogenicPmids,
      } as Citations;
    },
    Cell(props: { original: BiologicalVariant }) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {props.original.mutationEffectDescription ? (
            <DescriptionTooltip
              description={
                <SummaryWithRefs
                  content={props.original.mutationEffectDescription}
                  type="tooltip"
                />
              }
            />
          ) : undefined}
        </div>
      );
    },
  };
  const somaticColumns = [
    altColumn,
    {
      ...getDefaultColumnDefinition(TABLE_COLUMN_KEY.ONCOGENICITY),
      onFilter: (data: BiologicalVariant, keyword: string) =>
        filterByKeyword(data.oncogenic, keyword),
    },
    {
      ...getDefaultColumnDefinition(TABLE_COLUMN_KEY.MUTATION_EFFECT),
      onFilter: (data: BiologicalVariant, keyword: string) =>
        filterByKeyword(data.mutationEffect, keyword),
    },
    descriptionColumn,
  ];
  const germlineColumns = [
    altColumn,
    {
      Header: <span>Protein Change</span>,
      accessor: 'variant.proteinChange',
      onFilter: (data: BiologicalVariant, keyword: string) =>
        filterByKeyword(data.variant.proteinChange, keyword),
    },
    {
      Header: <span>Pathogenicity</span>,
      accessor: 'pathogenic',
      onFilter: (data: BiologicalVariant, keyword: string) =>
        filterByKeyword(data.pathogenic, keyword),
    },
    {
      Header: <span>Penetrance</span>,
      accessor: 'penetrance',
      onFilter: (data: BiologicalVariant, keyword: string) =>
        filterByKeyword(data.penetrance, keyword),
    },
    {
      Header: <span>Mechanism of Inheritance</span>,
      accessor: 'inheritanceMechanism',
      onFilter: (data: BiologicalVariant, keyword: string) =>
        filterByKeyword(data.inheritanceMechanism, keyword),
    },
    {
      Header: <span>Cancer Risk</span>,
      accessor: 'cancerRisk',
      onFilter: (data: BiologicalVariant, keyword: string) =>
        filterByKeyword(data.cancerRisk, keyword),
    },
    descriptionColumn,
  ];
  return germline ? germlineColumns : somaticColumns;
};

const AnnotatedAlterations: FunctionComponent<{
  germline: boolean;
  hugoSymbol: string;
  alterations: BiologicalVariant[];
  isLargeScreen?: boolean;
}> = props => {
  const style = props.isLargeScreen
    ? {
        width: '80%',
        marginBottom: '-30px',
        zIndex: 1,
      }
    : undefined;
  return (
    <>
      <div style={style}>
        <span>
          A list of the oncogenic and mutation effects of{' '}
          <b>all {ONCOKB_TM} curated</b> {props.hugoSymbol} alterations.
        </span>
      </div>
      <GenePageTable
        data={props.alterations}
        columns={getColumns(props.germline, props.hugoSymbol)}
        isPending={false}
      />
    </>
  );
};

export default AnnotatedAlterations;
