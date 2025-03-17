import React from 'react';
import AppStore from 'app/store/AppStore';
import { Alteration } from 'app/shared/api/generated/OncoKbAPI';
import {
  BiologicalVariant,
  VariantAnnotation,
} from 'app/shared/api/generated/OncoKbPrivateAPI';
import {
  FdaImplication,
  TherapeuticImplication,
} from 'app/store/AnnotationStore';
import {
  ANNOTATION_PAGE_TAB_KEYS,
  LEVEL_PRIORITY,
  LEVELS,
} from 'app/config/constants';
import { FdaTabDescription } from 'app/pages/annotationPage/TabDescriptor';
import { CancerTypeViewTable } from 'app/pages/annotationPage/CancerTypeViewTable';
import { sortTherapeuticImplications } from 'app/pages/annotationPage/Utils';
import WindowStore from 'app/store/WindowStore';
import { defaultFdaImplicationSortMethod } from 'app/shared/utils/ReactTableUtils';
import classnames from 'classnames';
import MiniNavBarHeader from 'app/shared/nav/MiniNavBarHeader';

export type ICancerTypeView = {
  appStore?: AppStore;
  isLargeScreen: boolean;
  userAuthenticated: boolean;
  hugoSymbol: string;
  alteration: string;
  matchedAlteration: Alteration | undefined;
  tumorType: string;
  onChangeTumorType: (newTumorType: string) => void;
  annotation: VariantAnnotation;
  biologicalAlterations?: BiologicalVariant[];
  relevantAlterations?: Alteration[];
  fdaImplication: FdaImplication[];
  therapeuticImplications: TherapeuticImplication[];
  diagnosticImplications: TherapeuticImplication[];
  prognosticImplications: TherapeuticImplication[];
  defaultSelectedTab?: ANNOTATION_PAGE_TAB_KEYS;
  onChangeTab?: (
    selectedTabKey: ANNOTATION_PAGE_TAB_KEYS,
    newTabKey: ANNOTATION_PAGE_TAB_KEYS
  ) => void;
  somaticGermline?: boolean;
};

const TxView: React.FunctionComponent<{
  isLargeScreen: boolean;
  userAuthenticated: boolean;
  hugoSymbol: string;
  summary?: string;
  implications: TherapeuticImplication[];
  somaticGermline: boolean;
}> = props => {
  const txStandardCares = sortTherapeuticImplications(
    props.implications.filter(implication =>
      [LEVELS.Tx1, LEVELS.Tx2, LEVELS.R1]
        .map(level => level.toString())
        .includes(implication.level)
    )
  );
  const txInvestigationalCares = sortTherapeuticImplications(
    props.implications.filter(implication =>
      [LEVELS.Tx3A, LEVELS.Tx3B, LEVELS.Tx4, LEVELS.R2]
        .map(level => level.toString())
        .includes(implication.level)
    )
  );
  return (
    <div>
      <MiniNavBarHeader
        id="treatment-implications-of-this-biomarker"
        className={classnames(
          props.somaticGermline ? undefined : 'text-primary',
          'h5'
        )}
      >
        Therapeutic Implications
      </MiniNavBarHeader>
      {props.summary && <p>{props.summary}</p>}
      {txStandardCares.length > 0 && (
        <>
          <h6>FDA-approved and/or NCCN-recommended drug association(s):</h6>
          <CancerTypeViewTable
            isLargeScreen={props.isLargeScreen}
            userAuthenticated={props.userAuthenticated}
            type={'tx'}
            hugoSymbol={props.hugoSymbol}
            data={txStandardCares.map(implication => {
              return {
                level: implication.level as LEVELS,
                alterations: implication.alterations,
                cancerTypes: implication.cancerTypes,
                drugs: implication.drugs,
                citations: implication.citations,
                description: implication.drugDescription,
              };
            })}
          />
        </>
      )}
      {txInvestigationalCares.length > 0 && (
        <>
          <h6>Investigational drug association(s):</h6>
          <CancerTypeViewTable
            isLargeScreen={props.isLargeScreen}
            userAuthenticated={props.userAuthenticated}
            type={'tx'}
            hugoSymbol={props.hugoSymbol}
            data={txInvestigationalCares.map(implication => {
              return {
                level: implication.level as LEVELS,
                alterations: implication.alterations,
                cancerTypes: implication.cancerTypes,
                drugs: implication.drugs,
                citations: implication.citations,
                description: implication.drugDescription,
              };
            })}
          />
        </>
      )}
    </div>
  );
};

const DxPxView: React.FunctionComponent<{
  isLargeScreen: boolean;
  userAuthenticated: boolean;
  type: 'dx' | 'px';
  hugoSymbol: string;
  summary?: string;
  implications: TherapeuticImplication[];
  somaticGermline: boolean;
}> = props => {
  return (
    <div>
      <MiniNavBarHeader
        id={`${
          props.type === 'dx' ? 'diagnostic' : 'prognostic'
        }-implications-of-this-biomarker`}
        className={classnames(
          props.somaticGermline ? undefined : 'text-primary',
          'h5'
        )}
      >
        {props.type === 'dx' ? 'Diagnostic' : 'Prognostic'} Implications
      </MiniNavBarHeader>
      {props.summary && <p>{props.summary}</p>}
      {props.implications.length > 0 && (
        <CancerTypeViewTable
          isLargeScreen={props.isLargeScreen}
          userAuthenticated={props.userAuthenticated}
          type={props.type}
          hugoSymbol={props.hugoSymbol}
          data={props.implications.map(implication => {
            return {
              level: implication.level as LEVELS,
              alterations: implication.alterations,
              cancerTypes: implication.cancerTypes,
              citations: implication.citations,
              description: implication.drugDescription,
            };
          })}
        />
      )}
    </div>
  );
};

const FdaView: React.FunctionComponent<{
  isLargeScreen: boolean;
  userAuthenticated: boolean;
  hugoSymbol: string;
  summary?: string;
  implications: FdaImplication[];
  somaticGermline: boolean;
}> = props => {
  return (
    <div>
      <MiniNavBarHeader
        id="fda-recognized-biomarker"
        className={classnames(
          props.somaticGermline ? undefined : 'text-primary',
          'h5',
          'mt-5'
        )}
      >
        FDA-Recognized Biomarker
      </MiniNavBarHeader>
      <p>
        <FdaTabDescription hugoSymbol={props.hugoSymbol} />
      </p>
      <CancerTypeViewTable
        isLargeScreen={props.isLargeScreen}
        userAuthenticated={props.userAuthenticated}
        type={'fda'}
        hugoSymbol={props.hugoSymbol}
        data={props.implications
          .map(implication => {
            return {
              level: implication.level as LEVELS,
              alterations: implication.alteration.name,
              cancerTypes: implication.cancerType,
            };
          })
          .sort(defaultFdaImplicationSortMethod)}
      />
    </div>
  );
};

export const CancerTypeView: React.FunctionComponent<ICancerTypeView> = props => {
  const somaticGermline = props.somaticGermline ?? false;
  return (
    <div className={'mt-3'}>
      <TxView
        isLargeScreen={props.isLargeScreen}
        userAuthenticated={props.userAuthenticated}
        hugoSymbol={props.hugoSymbol}
        summary={props.annotation.tumorTypeSummary}
        implications={props.therapeuticImplications}
        somaticGermline={somaticGermline}
      />
      {(props.annotation.diagnosticSummary ||
        props.diagnosticImplications.length > 0) && (
        <DxPxView
          isLargeScreen={props.isLargeScreen}
          userAuthenticated={props.userAuthenticated}
          type={'dx'}
          hugoSymbol={props.hugoSymbol}
          summary={props.annotation.diagnosticSummary}
          implications={props.diagnosticImplications}
          somaticGermline={somaticGermline}
        />
      )}
      {(props.annotation.prognosticSummary ||
        props.prognosticImplications.length > 0) && (
        <DxPxView
          isLargeScreen={props.isLargeScreen}
          userAuthenticated={props.userAuthenticated}
          type={'px'}
          hugoSymbol={props.hugoSymbol}
          summary={props.annotation.prognosticSummary}
          implications={props.prognosticImplications}
          somaticGermline={somaticGermline}
        />
      )}
      {props.fdaImplication.length > 0 && (
        <FdaView
          isLargeScreen={props.isLargeScreen}
          userAuthenticated={props.userAuthenticated}
          hugoSymbol={props.hugoSymbol}
          summary={props.annotation.prognosticSummary}
          implications={props.fdaImplication}
          somaticGermline={somaticGermline}
        />
      )}
    </div>
  );
};
