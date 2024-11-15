import React from 'react';
import styles from './SomaticGermlineTiles.module.scss';
import classNames from 'classnames';
import { Linkout } from 'app/shared/links/Linkout';

type AlterationItemProps =
  | {
      title: string;
      show?: boolean;
      value: JSX.Element | string;
      link?: undefined;
    }
  | {
      title: string;
      show?: boolean;
      value: string;
      link: string;
    };

function AlterationItem({
  title: itemTitle,
  value,
  link,
}: AlterationItemProps) {
  return (
    <div>
      <h4 className={classNames(styles.itemHeader)}>{itemTitle}</h4>
      <div>
        {typeof value === 'string' ? (
          <div className={classNames('h5', styles.stringValue)}>
            {link ? (
              <div className={classNames(styles.itemLink)}>
                <Linkout link={link}>
                  <span className={styles.externalLinkContent}>{value}</span>
                  <i className="fa fa-external-link" />
                </Linkout>
              </div>
            ) : (
              value
            )}
          </div>
        ) : (
          value
        )}
      </div>
    </div>
  );
}

export type AlterationTileProps = {
  title?: string;
  items: [AlterationItemProps, AlterationItemProps][];
};

function SomaticGermlineTile({
  title,
  items,
}: AlterationTileProps): JSX.Element {
  const slimClass = title === undefined ? styles.slim : undefined;
  const showTile =
    items.filter(item => item.filter(x => x.show ?? true).length > 0).length <
    1;
  if (showTile) {
    return <></>;
  }
  return (
    <div className={classNames(styles.alterationTileContainer)}>
      <div
        className={classNames(
          'd-flex',
          'flex-column',
          styles.alterationTile,
          slimClass
        )}
      >
        {title && (
          <h3 className={classNames('h6', styles.tileTitle)}>{title}</h3>
        )}
        <div className={classNames(styles.alterationTileItems, slimClass)}>
          {items.map((parent, i) => {
            if (Array.isArray(parent)) {
              return parent
                .filter(x => x.show ?? true)
                .map((child, j) => {
                  return <AlterationItem key={`${i}:${j}`} {...child} />;
                });
            } else {
              return (
                <div
                  key={i}
                  className={classNames(styles.alterationTileColumnMerge)}
                >
                  <AlterationItem {...parent} />
                </div>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
}

export default function SomaticGermlineTiles({
  tiles,
}: {
  tiles: AlterationTileProps[];
}): JSX.Element {
  return (
    <div className={classNames(styles.alterationTiles)}>
      {tiles.map((x, idx) => (
        <SomaticGermlineTile key={idx} {...x} />
      ))}
    </div>
  );
}
