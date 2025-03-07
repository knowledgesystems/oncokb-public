import HighestLevelEvidence from 'app/pages/somaticGermlineAlterationPage/HighestLevelEvidence';
import {
  VariantAnnotation,
  MutationEffectResp,
  GermlineVariant,
  Query,
  GeneNumber,
} from '../api/generated/OncoKbPrivateAPI';
import React from 'react';
import classnames from 'classnames';
import SomaticGermlineTiles, {
  AlterationTileProps,
} from './SomaticGermlineTiles';
import { ONCOGENICITY, MUTATION_EFFECT, ONCOKB_TM } from 'app/config/constants';
import {
  isPositionalAlteration,
  citationsHasInfo,
  OncoKBOncogenicityIcon,
} from '../utils/Utils';
import { DefaultTooltip } from 'cbioportal-frontend-commons';
import { CitationTooltip } from 'app/components/CitationTooltip';
import {
  COLOR_ICON_WITH_INFO,
  COLOR_ICON_WITHOUT_INFO,
} from 'app/config/theme';
import {
  Oncogenicity,
  Pathogenicity,
} from 'app/components/oncokbMutationMapper/OncokbMutationMapper';

function OncogenicInfo({
  isUnknownOncogenicity,
  isVus,
  oncogenicity,
}: {
  isUnknownOncogenicity: boolean;
  oncogenicity: string | undefined;
  isVus: boolean;
  className?: string;
}) {
  return (
    <span style={{ margin: '0px' }} className="h5">
      <span>
        {isUnknownOncogenicity
          ? `${ONCOGENICITY.UNKNOWN} Oncogenic Effect`
          : oncogenicity}
      </span>
      <OncoKBOncogenicityIcon
        oncogenicity={oncogenicity}
        isVus={isVus}
        classNameParent={classnames('d-inline-block my-auto')}
      />
    </span>
  );
}

function MutationEffectIcon({
  mutationEffect,
}: {
  mutationEffect: MutationEffectResp;
}) {
  const hasCitations = citationsHasInfo(mutationEffect.citations);
  const tooltipOverlay = () => (
    <CitationTooltip
      pmids={mutationEffect.citations.pmids}
      abstracts={mutationEffect.citations.abstracts}
    />
  );
  return (
    <span className="h5">
      <span>
        {mutationEffect.knownEffect === MUTATION_EFFECT.UNKNOWN
          ? `${MUTATION_EFFECT.UNKNOWN} Biological Effect`
          : mutationEffect.knownEffect}
      </span>
      {hasCitations ? (
        <DefaultTooltip overlay={tooltipOverlay} key="mutationEffectTooltip">
          <i
            className="fa fa-book mx-1"
            style={{
              fontSize: '0.8em',
              color: hasCitations
                ? COLOR_ICON_WITH_INFO
                : COLOR_ICON_WITHOUT_INFO,
            }}
          ></i>
        </DefaultTooltip>
      ) : null}
    </span>
  );
}
function createHighestLevelOfEvidenceTileProps(
  variantAnnotation: VariantAnnotation | GeneNumber,
  includeTitle: boolean
): AlterationTileProps {
  const {
    highestDiagnosticImplicationLevel,
    highestFdaLevel,
    highestPrognosticImplicationLevel,
    highestResistanceLevel,
    highestSensitiveLevel,
  } = variantAnnotation;
  return {
    title: includeTitle ? 'Highest Level of Evidence' : undefined,
    items: [
      [
        {
          title: 'Therapeutic',
          show: !!highestSensitiveLevel || !!highestResistanceLevel,
          value: (
            <div className={classnames('d-flex', 'flex-row')}>
              <HighestLevelEvidence
                type="Sensitive"
                level={highestSensitiveLevel}
              />
              <HighestLevelEvidence
                type="Resistance"
                level={highestResistanceLevel}
              />
            </div>
          ),
        },
        {
          title: 'Diagnostic',
          show: !!highestDiagnosticImplicationLevel,
          value: (
            <HighestLevelEvidence
              type="DiagnosticImplication"
              level={highestDiagnosticImplicationLevel}
            />
          ),
        },
      ],
      [
        {
          title: 'Prognostic',
          show: !!highestPrognosticImplicationLevel,
          value: (
            <HighestLevelEvidence
              type="PrognosticImplication"
              level={highestPrognosticImplicationLevel}
            />
          ),
        },
        {
          title: 'FDA',
          show: !!highestFdaLevel,
          value: <HighestLevelEvidence type="Fda" level={highestFdaLevel} />,
        },
      ],
    ],
  };
}

function createMutationEffectTileProps(
  variantAnnotation: VariantAnnotation,
  includeTitle: boolean
): AlterationTileProps {
  const query = variantAnnotation.query;
  const isPositionalAlt = isPositionalAlteration(
    query.proteinStart,
    query.proteinEnd,
    query.consequence
  );
  const { mutationEffect, oncogenic, vus } = variantAnnotation;

  const isUnknownOncogenicity =
    !oncogenic || oncogenic === ONCOGENICITY.UNKNOWN;
  return {
    title: includeTitle ? 'Mutation Effect' : undefined,
    items: [
      [
        {
          title: 'Oncogenicity',
          show: !isUnknownOncogenicity || !isPositionalAlt,
          value: (
            <OncogenicInfo
              oncogenicity={oncogenic}
              isVus={vus}
              isUnknownOncogenicity={isUnknownOncogenicity}
            />
          ),
        },
        {
          title: 'Biological Effect',
          show:
            mutationEffect &&
            (mutationEffect.knownEffect !== MUTATION_EFFECT.UNKNOWN ||
              isPositionalAlt),
          value: <MutationEffectIcon mutationEffect={mutationEffect} />,
        },
      ],
    ],
  };
}

function createPathogenicityTileProps(
  variantAnnotation: GermlineVariant,
  includeTitle: boolean
): AlterationTileProps {
  return {
    title: includeTitle ? 'Pathogenicity' : undefined,
    items: [
      [
        {
          title: ONCOKB_TM,
          value: variantAnnotation.pathogenic,
        },
        {
          title: 'ClinVar',
          value: 'ClinVar not Implemented',
          link: '#',
        },
      ],
    ],
  };
}

function createGeneticRiskTileProps(
  variantAnnotation: GermlineVariant,
  includeTitle: boolean
): AlterationTileProps {
  return {
    title: includeTitle ? 'Genetic Risk' : undefined,
    items: [
      [
        {
          title: 'Penetrance',
          value: variantAnnotation.penetrance,
        },
        {
          title: 'Inheritance',
          value: variantAnnotation.inheritanceMechanism,
        },
      ],
    ],
  };
}

type SomaticGermlineAlterationTilesProps = {
  includeTitle: boolean;
  isGermline: boolean;
  variantAnnotation: VariantAnnotation;
};

export function SomaticGermlineAlterationTiles({
  includeTitle,
  ...rest
}: SomaticGermlineAlterationTilesProps) {
  const tiles: AlterationTileProps[] = [];
  if (rest.isGermline) {
    tiles.push(
      createPathogenicityTileProps(
        rest.variantAnnotation.germline,
        includeTitle
      )
    );
    tiles.push(
      createGeneticRiskTileProps(rest.variantAnnotation.germline, includeTitle)
    );
  } else {
    tiles.push(
      createMutationEffectTileProps(rest.variantAnnotation, includeTitle)
    );
    tiles.push(
      createHighestLevelOfEvidenceTileProps(
        rest.variantAnnotation,
        includeTitle
      )
    );
  }

  return <SomaticGermlineTiles tiles={tiles} />;
}

function makeTwoColumnRow<T>(arr: T[]): [T, T][] {
  const columnSize = 2;
  const rows: [T, T][] = [];
  for (let tableRow = 0; tableRow < arr.length; tableRow += 2) {
    const columns: T[] = [];
    for (
      let tableColumn = tableRow;
      tableColumn < arr.length && tableColumn < tableRow + columnSize;
      tableColumn++
    ) {
      columns.push(arr[tableColumn]);
    }
    rows.push(columns as [T, T]);
  }
  return rows;
}

export type SomaticGermlineGeneInfoTilesProps = {
  isGermline: boolean;
  geneNumber: GeneNumber;
  oncogenicities: Oncogenicity[];
  pathogenicities: Pathogenicity[];
};

export function SomaticGermlineGeneInfoTiles({
  isGermline,
  geneNumber,
  oncogenicities,
  pathogenicities,
}: SomaticGermlineGeneInfoTilesProps) {
  const tiles: AlterationTileProps[] = [];
  const hasGeneticRiskInfo =
    geneNumber.penetrance || geneNumber.inheritanceMechanism;

  if (hasGeneticRiskInfo) {
    tiles.push({
      title: 'Genetic Risk',
      items: [
        [
          {
            title: 'Penetrance',
            value: geneNumber.penetrance,
          },
          {
            title: 'Mechanism of Inheritance',
            value: geneNumber.inheritanceMechanism,
          },
        ],
      ],
    });
  }
  tiles.push(createHighestLevelOfEvidenceTileProps(geneNumber, true));
  tiles.push({
    title: `Annotated ${isGermline ? 'Variants' : 'Alterations'}`,
    items: isGermline
      ? makeTwoColumnRow(
          pathogenicities.map(pathogenicity => {
            return {
              title: pathogenicity.pathogenicity,
              value: pathogenicity.counts.toString(),
            };
          })
        )
      : makeTwoColumnRow(
          oncogenicities.map(oncogenicity => {
            return {
              title: oncogenicity.oncogenicity,
              value: oncogenicity.counts.toString(),
            };
          })
        ),
  });

  return <SomaticGermlineTiles tiles={tiles} />;
}
