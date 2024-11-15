import AppStore from 'app/store/AppStore';
import { inject } from 'mobx-react';
import React from 'react';
import { DefaultTooltip } from 'cbioportal-frontend-commons';
import { InfoLevel } from 'app/shared/api/generated/OncoKbAPI';
import { level2LevelOfEvidence } from 'app/shared/utils/Utils';
import ReactHtmlParser from 'react-html-parser';
import { LEVELS } from 'app/config/constants';

export const LevelWithDescription: React.FunctionComponent<{
  level: LEVELS | undefined;
  appStore?: AppStore;
  description?: string;
}> = inject('appStore')(props => {
  const levelOfEvidence = level2LevelOfEvidence(props.level);

  function getLevelDescription() {
    if (props.description) {
      return <span>{props.description}</span>;
    }
    const match:
      | InfoLevel
      | undefined = props.appStore!.appInfo.result.levels.find(
      (level: InfoLevel) => level.levelOfEvidence === levelOfEvidence
    );
    return match ? (
      <div style={{ maxWidth: 300 }}>
        {ReactHtmlParser(match.htmlDescription)}
      </div>
    ) : (
      ''
    );
  }

  return (
    <DefaultTooltip overlay={getLevelDescription()}>
      <span>{props.children}</span>
    </DefaultTooltip>
  );
});
