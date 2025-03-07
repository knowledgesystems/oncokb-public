import React from 'react';
import {
  levelOfEvidence2Level,
  OncoKBAnnotationIcon,
} from 'app/shared/utils/Utils';
import { Else, If, Then } from 'react-if';
import Highlighter from 'react-highlight-words';
import styles from './SearchOption.module.scss';
import { ExtendedTypeaheadSearchResp } from 'app/pages/HomePage';
import classnames from 'classnames';
import AppStore from 'app/store/AppStore';
import { FeedbackIcon } from 'app/components/feedback/FeedbackIcon';
import { FeedbackType } from 'app/components/feedback/types';
import { LEVEL_PRIORITY_BY_TYPE, ONCOKB_TM } from 'app/config/constants';
import { Alteration } from 'app/shared/api/generated/OncoKbPrivateAPI';
import { sortByLevelWithLevels } from 'app/shared/utils/ReactTableUtils';
import WithSeparator from 'react-with-separator';
import GeneticTypeTag from 'app/components/geneticTypeTag/GeneticTypeTag';
import { GENETIC_TYPE } from 'app/components/geneticTypeTabs/GeneticTypeTabs';

export enum SearchOptionType {
  GENE = 'GENE',
  VARIANT = 'VARIANT',
  DRUG = 'DRUG',
  GENOMIC = 'GENOMIC',
  CANCER_TYPE = 'CANCER_TYPE',
  TEXT = 'TEXT',
}
type SearchOptionProps = {
  search: string | undefined;
  type: SearchOptionType;
  data: ExtendedTypeaheadSearchResp;
  appStore: AppStore;
};
const LevelString: React.FunctionComponent<{
  level: string;
}> = props => {
  const level = levelOfEvidence2Level(props.level);
  return (
    <>
      <span className={`oncokb level-${level} text-nowrap`}>Level {level}</span>
    </>
  );
};
const GeneSearchOption: React.FunctionComponent<{
  search: string;
  data: ExtendedTypeaheadSearchResp;
}> = props => {
  return (
    <>
      <div className={'d-flex'}>
        <Highlighter
          searchWords={[props.search]}
          textToHighlight={`${props.data.gene.hugoSymbol} (Entrez Gene: ${props.data.gene.entrezGeneId})`}
        />
        {props.data.annotation &&
          Object.values(GENETIC_TYPE).includes(
            props.data.annotation.toLowerCase() as GENETIC_TYPE
          ) && (
            <GeneticTypeTag
              isGermline={props.data.annotation.toLowerCase() === 'germline'}
              className={'ml-2'}
            />
          )}
        {props.data.highestSensitiveLevel ||
        props.data.highestResistanceLevel ? (
          <span className={classnames(styles.subTitle, 'ml-2')}>
            <span className={'mr-2'}>Highest level of evidence:</span>
            <WithSeparator separator={' '}>
              {props.data.highestSensitiveLevel && (
                <LevelString level={props.data.highestSensitiveLevel} />
              )}
              {props.data.highestResistanceLevel && (
                <LevelString level={props.data.highestResistanceLevel} />
              )}
            </WithSeparator>
          </span>
        ) : undefined}
      </div>
      {props.data.gene.geneAliases.length > 0 ? (
        <i>
          <div className={styles.subTitle}>
            <span>Also known as </span>
            <Highlighter
              searchWords={[props.search]}
              textToHighlight={`${props.data.gene.geneAliases.join(', ')}`}
            />
          </div>
        </i>
      ) : undefined}
    </>
  );
};

const AlterationSearchOption: React.FunctionComponent<{
  search: string;
  data: ExtendedTypeaheadSearchResp;
  appStore: AppStore;
}> = props => {
  return (
    <>
      <div className={'d-flex align-items-center'}>
        <Highlighter
          textToHighlight={props.data.gene.hugoSymbol}
          searchWords={[props.search]}
        />{' '}
        /
        <Highlighter
          textToHighlight={props.data.alterationsName}
          searchWords={[props.search]}
        />
        <OncoKBAnnotationIcon
          className={'mb-1 ml-1'}
          oncogenicity={props.data.oncogenicity}
          vus={props.data.vus}
          sensitiveLevel={props.data.highestSensitiveLevel}
          resistanceLevel={props.data.highestResistanceLevel}
        />
        <If condition={!props.data.variantExist}>
          <span className={'ml-auto'}>
            <span>Not annotated by {ONCOKB_TM}</span>
            <FeedbackIcon
              feedback={{
                type: FeedbackType.ANNOTATION,
                annotation: {
                  gene: props.search,
                },
              }}
              appStore={props.appStore}
            />
          </span>
        </If>
      </div>
      {props.data.annotation ? (
        <div className={styles.subTitle}>
          <span>{props.data.annotation}</span>
        </div>
      ) : undefined}
    </>
  );
};
const GenomicSearchOption: React.FunctionComponent<{
  search: string;
  data: ExtendedTypeaheadSearchResp;
  appStore: AppStore;
}> = props => {
  return (
    <>
      <div className={'d-flex align-items-center'}>
        Query is annotated as {props.data.gene.hugoSymbol} /{' '}
        {props.data.alterationsName}
        <OncoKBAnnotationIcon
          className={'mb-1 ml-1'}
          oncogenicity={props.data.oncogenicity}
          vus={props.data.vus}
          sensitiveLevel={props.data.highestSensitiveLevel}
          resistanceLevel={props.data.highestResistanceLevel}
        />
      </div>
      {props.data.annotation ? (
        <div className={styles.subTitle}>
          <span>{props.data.annotation}</span>
        </div>
      ) : undefined}
    </>
  );
};

const DrugSearchOption: React.FunctionComponent<{
  search: string;
  data: ExtendedTypeaheadSearchResp;
}> = props => {
  return (
    <>
      <div>
        <Highlighter
          searchWords={[props.search]}
          textToHighlight={props.data.drug.drugName}
        />
      </div>
      <div className={styles.subTitle}>
        {props.data.highestSensitiveLevel && (
          <LevelString level={props.data.highestSensitiveLevel} />
        )}
        {props.data.highestResistanceLevel && (
          <LevelString level={props.data.highestResistanceLevel} />
        )}{' '}
        : {` ${props.data.gene.hugoSymbol} `}
        {props.data.variants.length > 1
          ? `(${props.data.alterationsName})`
          : ''}
        {props.data.variants.length === 1 ? props.data.alterationsName : ''}
        {` ${props.data.tumorTypesName}`}
      </div>
    </>
  );
};

const CancerTypeSearchOption: React.FunctionComponent<{
  search: string;
  data: ExtendedTypeaheadSearchResp;
}> = props => {
  const groupAlterationsByGene = (alterations: Alteration[]) => {
    const groupedAlterations: { [key: string]: string[] } = {};
    alterations.forEach(alteration => {
      const gene = alteration.gene.hugoSymbol;
      if (!groupedAlterations[gene]) {
        groupedAlterations[gene] = [];
      }
      // Check for parentheses in the alteration name
      const alterationName = alteration.name.replace(/[()]/g, '').trim();
      groupedAlterations[gene].push(alterationName);
    });
    return groupedAlterations;
  };

  const renderAlterations = (alterationsByGene: {
    [key: string]: string[];
  }) => {
    const maxElementsToDisplay = 3;
    const geneKeys = Object.keys(alterationsByGene);
    // TODO detect key of other biomarkers and change accordingly
    const totalGenes = geneKeys.length;
    const genesToDisplay = Math.min(maxElementsToDisplay, totalGenes);
    // displaying 3 genes
    return geneKeys.slice(0, genesToDisplay).map((gene, index) => {
      const geneAlterations = alterationsByGene[gene];
      const showAndMore = geneAlterations.length > maxElementsToDisplay;

      const displayAlterations = showAndMore
        ? geneAlterations.slice(0, maxElementsToDisplay).join(', ') +
          ', and ' +
          (geneAlterations.length - maxElementsToDisplay).toString() +
          ' other alterations'
        : geneAlterations.join(', ');

      const separator = index < genesToDisplay - 1 ? ', ' : '';

      return (
        <span key={index}>
          {gene !== 'Other Biomarkers' ? (
            <>
              {gene} ({displayAlterations})
            </>
          ) : (
            <>{displayAlterations}</>
          )}
          {separator}
          {totalGenes > maxElementsToDisplay && index === genesToDisplay - 1
            ? ', and more'
            : ''}
        </span>
      );
    });
  };

  return (
    <>
      <div>
        <Highlighter
          searchWords={[props.search]}
          textToHighlight={props.data.tumorTypesName}
        />
      </div>
      {props.data.annotationByLevel !== null ? (
        <div>
          {Object.keys(props.data.annotationByLevel)
            .sort((a, b) => sortByLevelWithLevels(a, b, LEVEL_PRIORITY_BY_TYPE))
            .map(level => {
              const annotation = props.data.annotationByLevel[level];
              return (
                <div
                  className={styles.subTitle}
                  key={`${props.data.tumorTypesName}-${level}`}
                >
                  <LevelString level={level} />: {annotation}
                </div>
              );
            })}
        </div>
      ) : (
        <div>No evidence found.</div>
      )}
    </>
  );
};

export const SearchOption: React.FunctionComponent<SearchOptionProps> = props => {
  const searchKeyword = props.search ? props.search : '';
  return (
    <div className={classnames(styles.match)}>
      <If condition={props.type === SearchOptionType.GENE}>
        <Then>
          <GeneSearchOption search={searchKeyword} data={props.data} />
        </Then>
        <Else>
          <If condition={props.type === SearchOptionType.VARIANT}>
            <Then>
              <AlterationSearchOption
                search={searchKeyword}
                data={props.data}
                appStore={props.appStore}
              />
            </Then>
            <Else>
              <If condition={props.type === SearchOptionType.DRUG}>
                <Then>
                  <DrugSearchOption search={searchKeyword} data={props.data} />
                </Then>
                <Else>
                  <If condition={props.type === SearchOptionType.GENOMIC}>
                    <Then>
                      <GenomicSearchOption
                        search={searchKeyword}
                        data={props.data}
                        appStore={props.appStore}
                      />
                    </Then>
                    <Else>
                      <If
                        condition={props.type === SearchOptionType.CANCER_TYPE}
                      >
                        <Then>
                          <CancerTypeSearchOption
                            search={searchKeyword}
                            data={props.data}
                          />
                        </Then>
                        <Else>
                          <If condition={props.type === SearchOptionType.TEXT}>
                            <Then>
                              <span>{props.data.annotation}</span>
                            </Then>
                          </If>
                        </Else>
                      </If>
                    </Else>
                  </If>
                </Else>
              </If>
            </Else>
          </If>
        </Else>
      </If>
    </div>
  );
};
