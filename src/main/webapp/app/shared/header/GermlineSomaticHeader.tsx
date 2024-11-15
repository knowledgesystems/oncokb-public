import React from 'react';
import classnames from 'classnames';
import { FeedbackType } from 'app/components/feedback/types';
import { FeedbackIcon } from 'app/components/feedback/FeedbackIcon';
import styles from './GermlineSomaticHeader.module.scss';
import AppStore from 'app/store/AppStore';
import { AnnotationStore } from 'app/store/AnnotationStore';
import GeneticTypeTag from 'app/components/geneticTypeTag/GeneticTypeTag';
export default function GermlineSomaticHeader({
  includeEmailLink,
  annotation,
  appStore,
  alterationNameWithDiff,
  isGermline,
  extra,
}: {
  includeEmailLink: boolean;
  appStore: AppStore;
  alterationNameWithDiff: AnnotationStore['alterationNameWithDiff'];
  annotation: Parameters<typeof FeedbackIcon>[0]['feedback']['annotation'];
  isGermline: boolean;
  extra?: React.ReactNode;
}) {
  return (
    <h1 className={classnames(styles.header, 'h2')}>
      <div className={classnames(styles.headerContent)}>
        <span
          className={classnames(styles.headerContentGene, styles.centerContent)}
        >
          {annotation?.gene}
          {/* force a space between character between the two spans */}
          &nbsp;
        </span>
        <span className={classnames(styles.headerContentGene)}>
          {alterationNameWithDiff}
        </span>
        <span className={classnames(styles.extraContent, styles.centerContent)}>
          <GeneticTypeTag className={'ml-2'} isGermline={isGermline} />
          {extra}
          <span style={{ fontSize: '0.5em' }} className={'ml-2'}>
            {includeEmailLink && (
              <FeedbackIcon
                feedback={{
                  type: FeedbackType.ANNOTATION,
                  annotation,
                }}
                appStore={appStore}
              />
            )}
          </span>
        </span>
      </div>
    </h1>
  );
}
