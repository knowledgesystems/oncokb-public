import * as React from 'react';
import { If, Then } from 'react-if';
import Spinner from 'react-spinkit';
import classnames from 'classnames';
import styles from './styles.module.scss';
import { COLOR_BLUE } from '../../config/theme';

export enum LoaderSize {
  LARGE,
  SMALL,
  EXTRA_SMALL,
}

export interface ILoader {
  isLoading: boolean;
  style?: any;
  color?: string;
  center?: boolean;
  centerRelativeToContainer?: boolean;
  size?: LoaderSize;
  className?: string;
  children?: React.ReactNode;
}

export default class LoadingIndicator extends React.Component<ILoader, {}> {
  public static defaultProps = {
    center: false,
    size: LoaderSize.SMALL,
  };

  public render() {
    const color = this.props.color
      ? this.props.color
      : this.props.size === LoaderSize.LARGE
      ? 'white'
      : COLOR_BLUE;
    const spinnerStyles = {
      [styles.extraSmall]: this.props.size === LoaderSize.EXTRA_SMALL,
      [styles.small]: this.props.size === LoaderSize.SMALL,
      [styles.big]: this.props.size === LoaderSize.LARGE,
      'd-flex': true,
      'justify-content-center': true,
    };

    const parentStyles = {
      [styles.centered]: this.props.center,
      [styles['centered-relative-to-container']]: this.props
        .centerRelativeToContainer,
      [styles['centered-with-children']]:
        (this.props.center || this.props.centerRelativeToContainer) &&
        React.Children.count(this.props.children) > 0,
    };

    return (
      // @ts-ignore
      <If condition={this.props.isLoading}>
        <Then>
          <div
            className={classnames(parentStyles, this.props.className)}
            style={this.props.style || {}}
          >
            <Spinner
              color={color}
              fadeIn="none"
              className={classnames(spinnerStyles)}
              style={this.props.style}
              name="line-scale-pulse-out"
            />
            <div>{this.props.children}</div>
          </div>
        </Then>
      </If>
    );
  }
}
