import React from 'react';
import {
  levelOfEvidence2Level,
  OncoKBLevelIcon,
  FdaLevelIcon,
} from 'app/shared/utils/Utils';

type HighestLevelEvidenceProp = {
  type:
    | 'Sensitive'
    | 'Resistance'
    | 'DiagnosticImplication'
    | 'PrognosticImplication'
    | 'Fda';
  level: string | undefined;
};

export default function HighestLevelEvidence({
  type,
  level: rawLevel = '',
}: HighestLevelEvidenceProp): JSX.Element {
  if (type === 'Sensitive') {
    const level = levelOfEvidence2Level(rawLevel, false);
    return (
      <OncoKBLevelIcon size="s2" level={level} key="highestSensitiveLevel" />
    );
  }
  if (type === 'Resistance') {
    const level = levelOfEvidence2Level(rawLevel, false);
    return (
      <OncoKBLevelIcon size="s2" level={level} key="highestResistanceLevel" />
    );
  }
  if (type === 'DiagnosticImplication') {
    const level = levelOfEvidence2Level(rawLevel, false);
    return (
      <OncoKBLevelIcon
        size="s2"
        level={level}
        key={'highestDiagnosticImplicationLevel'}
      />
    );
  }
  if (type === 'PrognosticImplication') {
    const level = levelOfEvidence2Level(rawLevel, false);
    return (
      <OncoKBLevelIcon
        size="s2"
        level={level}
        key={'highestPrognosticImplicationLevel'}
      />
    );
  }
  if (type === 'Fda') {
    const level = levelOfEvidence2Level(rawLevel, false);
    return <FdaLevelIcon size="s2" level={level} key={'highestFdaLevel'} />;
  }
  return <></>;
}
