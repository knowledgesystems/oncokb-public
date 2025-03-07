import React from 'react';
import classnames from 'classnames';
import { DEFAULT_MARGIN_TOP_LG } from 'app/config/constants';
import { getCategoricalAlterationDescription } from '../utils/Utils';

type VariantOverViewProps = {
  alterationSummaries: { content: string }[];
  hugoSymbol: string;
  alteration: string;
  oncogene: boolean | undefined;
  tsg: boolean | undefined;
};

export default function VariantOverView({
  alterationSummaries,
  hugoSymbol,
  alteration,
  oncogene,
  tsg,
}: VariantOverViewProps) {
  const categoricalAlterationDescription = getCategoricalAlterationDescription(
    hugoSymbol,
    alteration,
    oncogene,
    tsg
  );
  return (
    <div style={{ wordWrap: 'break-word' }}>
      <h3>Variant Overview</h3>

      {categoricalAlterationDescription && (
        <div className={classnames(DEFAULT_MARGIN_TOP_LG)}>
          {categoricalAlterationDescription}
        </div>
      )}
      {alterationSummaries.map(summary => {
        return (
          <div
            key={summary.content}
            className={classnames(DEFAULT_MARGIN_TOP_LG)}
          >
            {summary.content}
          </div>
        );
      })}
      <div className={classnames('mt-2')}></div>
    </div>
  );
}
