import AppStore from 'app/store/AppStore';
import { inject } from 'mobx-react';
import React from 'react';
import { DefaultTooltip } from 'cbioportal-frontend-commons';
import { InfoLevel } from 'app/shared/api/generated/OncoKbAPI';
import _ from 'lodash';
import { level2LevelOfEvidence } from 'app/shared/utils/Utils';
import ReactHtmlParser from 'react-html-parser';

export const LevelWithDescription: React.FunctionComponent<{
  level: string;
  appStore?: AppStore;
}> = inject('appStore')(props => {
  const levelOfEvidence = level2LevelOfEvidence(props.level);

  function getLevelDescription() {
    const match: InfoLevel | undefined = _.find(
      props.appStore!.appInfo.result.levels,
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
