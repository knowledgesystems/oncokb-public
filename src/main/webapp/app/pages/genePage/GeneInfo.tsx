import React, { useState } from 'react';
import GeneAliasesDescription from 'app/shared/texts/GeneAliasesDescription';
import { Col, Row } from 'react-bootstrap';
import { Gene } from 'app/shared/api/generated/OncoKbAPI';
import { EnsemblGene } from 'app/shared/api/generated/OncoKbPrivateAPI';
import {
  FdaLevelIcon,
  levelOfEvidence2Level,
  OncoKBLevelIcon,
} from 'app/shared/utils/Utils';
import WithSeparator from 'react-with-separator';
import { LEVELS } from 'app/config/constants';

enum GENE_TYPE_DESC {
  ONCOGENE = 'Oncogene',
  TUMOR_SUPPRESSOR = 'Tumor Suppressor',
}

export const HighestLevelItem: React.FunctionComponent<{
  level: LEVELS;
  key?: string;
}> = props => {
  let isFdaLevel = false;
  let levelText = '';
  switch (props.level) {
    case LEVELS.Fda1:
    case LEVELS.Fda2:
    case LEVELS.Fda3:
      levelText = `FDA Level ${props.level.replace('Fda', '')}`;
      isFdaLevel = true;
      break;
    default:
      levelText = `Level ${props.level}`;
      break;
  }
  return (
    <span className={'d-flex align-items-center'}>
      <span className={`oncokb level-${props.level}`}>{levelText}</span>
      {isFdaLevel ? (
        <FdaLevelIcon level={props.level} />
      ) : (
        <OncoKBLevelIcon level={props.level} withDescription />
      )}
    </span>
  );
};

type GeneInfoItem = {
  key: string;
  element: JSX.Element | string;
};

type GeneInfoProps = {
  gene: Gene;
  ensemblGenes: EnsemblGene[];
  highestSensitiveLevel: string | undefined;
  highestResistanceLevel: string | undefined;
  highestDiagnosticImplicationLevel?: string | undefined;
  highestPrognosticImplicationLevel?: string | undefined;
  highestFdaLevel?: string | undefined;
};

export const getHighestLevelStrings = (
  highestSensitiveLevel: string | undefined,
  highestResistanceLevel: string | undefined,
  highestDiagnosticImplicationLevel?: string | undefined,
  highestPrognosticImplicationLevel?: string | undefined,
  highestFdaLevel?: string | undefined,
  separator: string | JSX.Element = ', '
) => {
  const levels: React.ReactNode[] = [];
  if (highestSensitiveLevel) {
    const level = levelOfEvidence2Level(highestSensitiveLevel, false);
    levels.push(
      <HighestLevelItem level={level} key={'highestSensitiveLevel'} />
    );
  }
  if (highestResistanceLevel) {
    const level = levelOfEvidence2Level(highestResistanceLevel, false);
    levels.push(
      <HighestLevelItem level={level} key={'highestResistanceLevel'} />
    );
  }
  if (highestDiagnosticImplicationLevel) {
    const level = levelOfEvidence2Level(
      highestDiagnosticImplicationLevel,
      false
    );
    levels.push(
      <HighestLevelItem
        level={level}
        key={'highestDiagnosticImplicationLevel'}
      />
    );
  }
  if (highestPrognosticImplicationLevel) {
    const level = levelOfEvidence2Level(
      highestPrognosticImplicationLevel,
      false
    );
    levels.push(
      <HighestLevelItem
        level={level}
        key={'highestPrognosticImplicationLevel'}
      />
    );
  }
  if (highestFdaLevel) {
    const level = levelOfEvidence2Level(highestFdaLevel, false);
    levels.push(<HighestLevelItem level={level} key={'highestFdaLevel'} />);
  }
  return (
    <WithSeparator
      separator={<span className="mx-1">·</span>}
      key={'highest-levels'}
    >
      {levels}
    </WithSeparator>
  );
};

export const getGeneTypeSentence = (oncogene: boolean, tsg: boolean) => {
  const geneTypes = [];
  if (oncogene) {
    geneTypes.push(GENE_TYPE_DESC.ONCOGENE);
  }
  if (tsg) {
    geneTypes.push(GENE_TYPE_DESC.TUMOR_SUPPRESSOR);
  }
  return geneTypes.join(', ');
};

const GeneInfo: React.FunctionComponent<GeneInfoProps> = props => {
  const gene = props.gene;
  const info: GeneInfoItem[] = [];

  // gene type
  if (gene.oncogene || gene.tsg) {
    info.push({
      key: 'geneType',
      element: (
        <div>
          <h5>{getGeneTypeSentence(gene.oncogene, gene.tsg)}</h5>
        </div>
      ),
    });
  }

  // highest LoE
  if (
    props.highestResistanceLevel ||
    props.highestSensitiveLevel ||
    props.highestDiagnosticImplicationLevel ||
    props.highestPrognosticImplicationLevel ||
    props.highestFdaLevel
  ) {
    info.push({
      key: 'loe',
      element: (
        <div>
          <h5 className={'d-flex align-items-center flex-wrap'}>
            <span className={'mr-2'}>Highest level of evidence:</span>
            {getHighestLevelStrings(
              props.highestSensitiveLevel,
              props.highestResistanceLevel,
              props.highestDiagnosticImplicationLevel,
              props.highestPrognosticImplicationLevel,
              props.highestFdaLevel
            )}
          </h5>
        </div>
      ),
    });
  }

  if (gene.geneAliases.length > 0) {
    info.push({
      key: 'aliases',
      element: (
        <div>
          <GeneAliasesDescription geneAliases={gene.geneAliases} />
        </div>
      ),
    });
  }

  return (
    <>
      {info.map(record => (
        <Row key={record.key}>
          <Col>{record.element}</Col>
        </Row>
      ))}
    </>
  );
};

export default GeneInfo;
